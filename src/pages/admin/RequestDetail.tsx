import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { RequestSubmission } from '../../features/request/request.types'
import { formatCurrency, formatDate } from '../../lib/utils'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Download, 
  Mail,
  Phone,
  Building2,
  CreditCard,
  FileText,
  Calendar,
  User
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function RequestDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState<RequestSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (id) {
      fetchRequest(id)
    }
  }, [id])

  const fetchRequest = async (requestId: string) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (error) throw error
      setRequest(data)
    } catch (error) {
      console.error('Error fetching request:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (newStatus: 'approved' | 'rejected') => {
    if (!request) return

    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id)

      if (error) throw error

      // Send status update email
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'status_update',
          to: request.email,
          studentName: request.full_name,
          status: newStatus
        }
      })

      alert(`Request ${newStatus} successfully!`)
      navigate('/admin/dashboard')
    } catch (error) {
      console.error('Error updating request:', error)
      alert('Failed to update request')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-muted border-t-accent rounded-full animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Loading request...</p>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Request not found</h2>
          <Link to="/admin/dashboard" className="text-accent hover:underline text-sm">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const InfoCard = ({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>, label: string, value: string }) => (
    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-accent" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground break-words">
          {value}
        </p>
      </div>
    </div>
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rejected: 'bg-rose-50 text-rose-700 border-rose-200'
    }
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border ${variants[status as keyof typeof variants]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/40 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/dashboard"
                className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground mb-1">Request Details</h1>
                <p className="text-sm text-muted-foreground">
                  Submitted {formatDate(request.created_at)}
                </p>
              </div>
            </div>
            <div>
              {getStatusBadge(request.status)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Student Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden"
            >
              <div className="border-b border-border/40 px-6 py-4 bg-muted/20">
                <h2 className="text-lg font-bold text-foreground">Student Information</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard icon={User} label="Full Name" value={request.full_name} />
                <InfoCard icon={Mail} label="Email" value={request.email} />
                <InfoCard icon={Phone} label="Phone" value={request.phone} />
                <InfoCard icon={Calendar} label="Submitted" value={formatDate(request.created_at)} />
              </div>
            </motion.div>

            {/* School Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden"
            >
              <div className="border-b border-border/40 px-6 py-4 bg-muted/20">
                <h2 className="text-lg font-bold text-foreground">School Details</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard icon={Building2} label="School Name" value={request.school_name} />
                <InfoCard icon={FileText} label="Program" value={request.program} />
                <div className="md:col-span-2">
                  <InfoCard icon={Calendar} label="Semester/Year" value={request.study_semester} />
                </div>
              </div>
            </motion.div>

            {/* Payment Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden"
            >
              <div className="border-b border-border/40 px-6 py-4 bg-muted/20">
                <h2 className="text-lg font-bold text-foreground">Payment Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Amount Requested
                  </p>
                  <p className="text-3xl font-bold text-accent">
                    {formatCurrency(Number(request.amount), request.currency)}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard icon={Building2} label="Account Name" value={request.school_account_name} />
                  <InfoCard icon={CreditCard} label="Account Number" value={request.school_account_number} />
                  <div className="md:col-span-2">
                    <InfoCard icon={Building2} label="Bank Name" value={request.school_bank_name} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Documents & Actions */}
          <div className="space-y-6">
            
            {/* Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden"
            >
              <div className="border-b border-border/40 px-6 py-4 bg-muted/20">
                <h2 className="text-lg font-bold text-foreground">Documents</h2>
              </div>
              <div className="p-6 space-y-3">
                {request.admission_letter_url && (
                  <a
                    href={request.admission_letter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">Admission Letter</span>
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  </a>
                )}
                {request.fee_invoice_url && (
                  <a
                    href={request.fee_invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">Fee Invoice</span>
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  </a>
                )}
                {!request.admission_letter_url && !request.fee_invoice_url && (
                  <p className="text-sm text-muted-foreground text-center py-4">No documents uploaded</p>
                )}
              </div>
            </motion.div>

            {/* Decision Actions */}
            {request.status === 'pending' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden"
              >
                <div className="border-b border-border/40 px-6 py-4 bg-muted/20">
                  <h2 className="text-lg font-bold text-foreground">Make Decision</h2>
                </div>
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => updateStatus('approved')}
                    disabled={isUpdating}
                    className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isUpdating ? 'Updating...' : 'Approve Request'}
                  </button>
                  <button
                    onClick={() => updateStatus('rejected')}
                    disabled={isUpdating}
                    className="w-full h-11 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4" />
                    {isUpdating ? 'Updating...' : 'Reject Request'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}