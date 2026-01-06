import { useState } from 'react'
import { requestService } from '../../features/request/request.service'
import type { RequestSubmission } from '../../features/request/request.types'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Search, CheckCircle, Clock, XCircle, DollarSign, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
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
        setError('No request found with this email and ID combination. Please check your details and try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-12 h-12 text-yellow-600" />
      case 'approved':
        return <CheckCircle className="w-12 h-12 text-blue-600" />
      case 'rejected':
        return <XCircle className="w-12 h-12 text-red-600" />
      case 'paid':
        return <DollarSign className="w-12 h-12 text-green-600" />
      default:
        return <AlertCircle className="w-12 h-12 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      case 'paid': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your request is being reviewed by our team. We will update you via email once a decision is made.'
      case 'approved':
        return 'Great news! Your request has been approved. Payment processing will begin shortly.'
      case 'rejected':
        return 'Unfortunately, your request was not approved at this time. Check the notes below for more information.'
      case 'paid':
        return 'Payment has been completed! The funds have been sent directly to your school.'
      default:
        return 'Status unknown'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/5 to-white py-20 px-6">
      <div className="container-custom max-w-2xl">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
            <Search className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-primary mb-4">
            Check Request Status
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your email and request ID to check the status of your scholarship application
          </p>
        </motion.div>

        {/* Search Form */}
        {!request && (
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            variants={fadeInUp}
            className="bg-white border border-border/50 rounded-2xl p-8 shadow-soft mb-8"
          >
            <form onSubmit={handleSearch} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSearching}
              />

              <Input
                label="Request ID"
                type="text"
                placeholder="Enter your request ID from the confirmation email"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                required
                disabled={isSearching}
              />

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSearching}
                className="w-full flex items-center justify-center gap-2"
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
              </Button>
            </form>

            <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong className="text-accent">Tip:</strong> Your request ID was sent to your email when you submitted your application. 
                If you can't find it, please contact support at{' '}
                <a href="mailto:support@hopecatalyst.com" className="text-accent hover:underline">
                  support@hopecatalyst.com
                </a>
              </p>
            </div>
          </motion.div>
        )}

        {/* Request Details */}
        {request && (
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="bg-white border border-border/50 rounded-2xl p-8 shadow-soft text-center">
              <div className="flex justify-center mb-4">
                {getStatusIcon(request.status)}
              </div>
              
              <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border mb-4 ${getStatusColor(request.status)}`}>
                {request.status.toUpperCase()}
              </span>

              <h2 className="text-2xl font-semibold text-primary mb-2">
                {request.status === 'pending' && 'Request Under Review'}
                {request.status === 'approved' && 'Request Approved!'}
                {request.status === 'rejected' && 'Request Not Approved'}
                {request.status === 'paid' && 'Payment Complete!'}
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                {getStatusMessage(request.status)}
              </p>
            </div>

            {/* Request Details Card */}
            <div className="bg-white border border-border/50 rounded-2xl p-8 shadow-soft">
              <h3 className="text-xl font-semibold text-primary mb-6">Request Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium text-foreground">{request.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">School</p>
                  <p className="font-medium text-foreground">{request.school_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Program</p>
                  <p className="font-medium text-foreground">{request.program}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount Requested</p>
                  <p className="font-medium text-accent">
                    {request.currency} {Number(request.amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Submitted On</p>
                  <p className="font-medium text-foreground">
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <p className="font-medium text-foreground">
                    {new Date(request.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Admin Notes */}
              {request.admin_notes && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Notes from Admin</p>
                  <p className="text-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
                    {request.admin_notes}
                  </p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white border border-border/50 rounded-2xl p-8 shadow-soft">
              <h3 className="text-xl font-semibold text-primary mb-6">Request Timeline</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Request Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {request.status !== 'pending' && (
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      request.status === 'approved' || request.status === 'paid' ? 'bg-blue-100' :
                      request.status === 'rejected' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {request.status === 'approved' || request.status === 'paid' ? (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      ) : request.status === 'rejected' ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Status Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {request.status === 'paid' && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Payment Completed</p>
                      <p className="text-sm text-muted-foreground">
                        Funds sent to school
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="text-center">
              <Button
                onClick={() => {
                  setRequest(null)
                  setEmail('')
                  setRequestId('')
                  setError('')
                }}
                variant="outline"
              >
                Check Another Request
              </Button>
            </div>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.4 }}
          variants={fadeInUp}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at{' '}
            <a href="mailto:support@hopecatalyst.com" className="text-accent hover:underline">
              support@hopecatalyst.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}