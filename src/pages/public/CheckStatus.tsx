import { useState } from 'react'
import { requestService } from '../../features/request/request.service'
import type { RequestSubmission } from '../../features/request/request.types'
import { Search, CheckCircle, Clock, XCircle, DollarSign, AlertCircle, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function CheckStatus() {
  const [email, setEmail] = useState('')
  const [requestId, setRequestId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [request, setRequest] = useState<RequestSubmission | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setRequest(null)
    setIsSearching(true)

    try {
      const data = await requestService.getRequestByEmailAndId(email, requestId)
      if (data) {
        setRequest(data)
      } else {
        setError(
          'No request found with this email and ID combination. Please check your details and try again.'
        )
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const resetSearch = () => {
    setRequest(null)
    setEmail('')
    setRequestId('')
    setError('')
  }

  const statusConfig: Record<string, {
    icon: React.ReactNode
    badge: string
    heading: string
    message: string
    colors: string
    iconBg: string
  }> = {
    pending: {
      icon: <Clock className="w-10 h-10 text-yellow-600" />,
      badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      heading: 'Request Under Review',
      message: 'Your request is being reviewed by our team. We will update you via email once a decision is made.',
      colors: 'text-yellow-600',
      iconBg: 'bg-yellow-50',
    },
    approved: {
      icon: <CheckCircle className="w-10 h-10 text-blue-600" />,
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      heading: 'Request Approved!',
      message: 'Great news! Your request has been approved. Payment processing will begin shortly.',
      colors: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    rejected: {
      icon: <XCircle className="w-10 h-10 text-red-600" />,
      badge: 'bg-red-50 text-red-700 border-red-200',
      heading: 'Request Not Approved',
      message: 'Unfortunately, your request was not approved at this time. Check the notes below for more information.',
      colors: 'text-red-600',
      iconBg: 'bg-red-50',
    },
    paid: {
      icon: <DollarSign className="w-10 h-10 text-green-600" />,
      badge: 'bg-green-50 text-green-700 border-green-200',
      heading: 'Payment Complete!',
      message: 'Payment has been completed! The funds have been sent directly to your school.',
      colors: 'text-green-600',
      iconBg: 'bg-green-50',
    },
  }

  const status = request ? statusConfig[request.status] || {
    icon: <AlertCircle className="w-10 h-10 text-gray-600" />,
    badge: 'bg-gray-50 text-gray-700 border-gray-200',
    heading: 'Unknown Status',
    message: 'Unable to determine the status of your request.',
    colors: 'text-gray-600',
    iconBg: 'bg-gray-50',
  } : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/5 via-white to-white flex flex-col items-center px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
      {/* ── Header ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
        variants={fadeInUp}
        className="text-center mb-10 w-full max-w-lg"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 bg-accent/10 rounded-2xl mb-5">
          <Search className="w-7 h-7 text-accent" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-3">
          Check Request Status
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Enter your email and request ID to check the status of your application
        </p>
      </motion.div>

      {/* ── Search Form ── */}
      {!request && (
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.15 }}
          variants={fadeInUp}
          className="w-full max-w-lg"
        >
          <div className="bg-white border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSearch} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSearching}
                  className="w-full h-12 px-4 rounded-xl border border-border/60 bg-white text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all disabled:opacity-50"
                />
              </div>

              {/* Request ID */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Request ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your request ID"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  required
                  disabled={isSearching}
                  className="w-full h-12 px-4 rounded-xl border border-border/60 bg-white text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all disabled:opacity-50"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSearching}
                className="w-full h-12 rounded-xl bg-accent text-white text-sm font-semibold shadow-sm transition-all hover:bg-accent/90 hover:shadow-md active:bg-accent/80 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Check Status
                  </>
                )}
              </button>
            </form>

            {/* Tip */}
            <div className="mt-6 p-4 bg-accent/5 border border-accent/15 rounded-xl">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-accent">Tip:</span> Your request ID was sent to your email when you submitted your application.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Results ── */}
      {request && status && (
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          variants={fadeInUp}
          className="w-full max-w-lg space-y-5"
        >
          {/* Status Card */}
          <div className="bg-white border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 ${status.iconBg}`}>
              {status.icon}
            </div>

            <span className={`inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border mb-4 ${status.badge}`}>
              {request.status}
            </span>

            <h2 className="text-2xl font-serif font-semibold text-primary mb-2">
              {status.heading}
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {status.message}
            </p>
          </div>

          {/* Request Details */}
          <div className="bg-white border border-border/50 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 sm:px-8 py-4 border-b border-border/30">
              <h3 className="text-sm font-semibold text-foreground">Request Details</h3>
            </div>

            <div className="divide-y divide-border/20">
              <DetailRow label="Full Name" value={request.full_name} />
              <DetailRow label="School" value={request.school_name} />
              <DetailRow label="Program" value={request.program} />
              <DetailRow
                label="Amount"
                value={`${request.currency} ${Number(request.amount).toLocaleString()}`}
                accent
              />
              <DetailRow
                label="Submitted"
                value={new Date(request.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              />
              <DetailRow
                label="Last Updated"
                value={new Date(request.updated_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              />
            </div>

            {/* Admin Notes */}
            {request.admin_notes && (
              <div className="px-6 sm:px-8 py-5 border-t border-border/30">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Notes from Admin
                </p>
                <p className="text-sm text-foreground leading-relaxed bg-muted/30 p-4 rounded-xl">
                  {request.admin_notes}
                </p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white border border-border/50 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 sm:px-8 py-4 border-b border-border/30">
              <h3 className="text-sm font-semibold text-foreground">Timeline</h3>
            </div>

            <div className="px-6 sm:px-8 py-5 space-y-5">
              <TimelineItem
                icon={<CheckCircle className="w-4 h-4 text-green-600" />}
                iconBg="bg-green-50"
                title="Request Submitted"
                time={new Date(request.created_at).toLocaleString()}
              />

              {request.status !== 'pending' && (
                <TimelineItem
                  icon={
                    request.status === 'approved' || request.status === 'paid' ? (
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )
                  }
                  iconBg={
                    request.status === 'approved' || request.status === 'paid'
                      ? 'bg-blue-50'
                      : 'bg-red-50'
                  }
                  title="Status Updated"
                  time={new Date(request.updated_at).toLocaleString()}
                />
              )}

              {request.status === 'paid' && (
                <TimelineItem
                  icon={<DollarSign className="w-4 h-4 text-green-600" />}
                  iconBg="bg-green-50"
                  title="Payment Completed"
                  time="Funds sent to school"
                />
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center pt-2">
            <button
              onClick={resetSearch}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Check Another Request
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Footer Help ── */}
      <motion.p
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.3 }}
        variants={fadeInUp}
        className="mt-12 text-sm text-muted-foreground text-center"
      >
        Need help? Contact us at{' '}
        <a href="mailto:support@hopecatalyst.com" className="text-accent hover:underline">
          support@hopecatalyst.com
        </a>
      </motion.p>
    </div>
  )
}

/* ─── Detail Row ─── */

function DetailRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center px-6 sm:px-8 py-3.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium text-right ${accent ? 'text-accent' : 'text-foreground'}`}>
        {value}
      </span>
    </div>
  )
}

/* ─── Timeline Item ─── */

function TimelineItem({
  icon,
  iconBg,
  title,
  time,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  time: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
      </div>
    </div>
  )
}