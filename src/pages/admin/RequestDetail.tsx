import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { requestService } from '../../features/request/request.service'
import type { RequestSubmission } from '../../features/request/request.types'
import { ArrowLeft, Download, CheckCircle, XCircle, DollarSign, FileText } from 'lucide-react'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [request, setRequest] = useState<RequestSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [adminNotes, setAdminNotes] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (id) {
      loadRequest()
    }
  }, [id])

  const loadRequest = async () => {
    if (!id) return
    setIsLoading(true)
    const data = await requestService.getRequestById(id)
    setRequest(data)
    setAdminNotes(data?.admin_notes || '')
    setIsLoading(false)
  }

  const handleStatusUpdate = async (newStatus: 'pending' | 'approved' | 'rejected' | 'paid') => {
    if (!id || !request) return

    const confirmMessage = `Are you sure you want to mark this request as "${newStatus}"?`
    if (!confirm(confirmMessage)) return

    setIsUpdating(true)
    const result = await requestService.updateRequestStatus(id, newStatus, adminNotes)

    if (result.success) {
      alert('Status updated successfully!')
      loadRequest()
    } else {
      alert(`Failed to update status: ${result.error}`)
    }
    setIsUpdating(false)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading request...</p>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Request not found</p>
          <Button onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary mb-2">
                Request Details
              </h1>
              <p className="text-sm text-muted-foreground">
                ID: {request.id}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(request.status)}`}>
              {request.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium text-foreground">{request.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-foreground">{request.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium text-foreground">{request.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Submission Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* School Information */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">School Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">School Name</p>
                  <p className="font-medium text-foreground">{request.school_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Program</p>
                  <p className="font-medium text-foreground">{request.program}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Study Semester</p>
                  <p className="font-medium text-foreground">{request.study_semester}</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Payment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="text-2xl font-bold text-accent">
                    {request.currency} {Number(request.amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
                  <p className="font-medium text-foreground">{request.school_bank_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Account Name</p>
                  <p className="font-medium text-foreground">{request.school_account_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                  <p className="font-medium text-foreground font-mono">{request.school_account_number}</p>
                </div>
                {request.school_sort_code && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Sort Code / Additional Info</p>
                    <p className="font-medium text-foreground">{request.school_sort_code}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Uploaded Documents</h2>
              <div className="space-y-3">
                {request.admission_letter_url ? (
                  <a
                    href={request.admission_letter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-accent/5 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium text-foreground">Admission Letter</p>
                        <p className="text-sm text-muted-foreground">Click to view</p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-accent" />
                  </a>
                ) : (
                  <div className="p-4 bg-muted/30 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">No admission letter uploaded</p>
                  </div>
                )}

                {request.fee_invoice_url ? (
                  <a
                    href={request.fee_invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-accent/5 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium text-foreground">Fee Invoice</p>
                        <p className="text-sm text-muted-foreground">Click to view</p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-accent" />
                  </a>
                ) : (
                  <div className="p-4 bg-muted/30 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">No fee invoice uploaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Notes from Student */}
            {request.additional_notes && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-primary mb-4">Student Notes</h2>
                <p className="text-foreground leading-relaxed">{request.additional_notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            {/* Status Actions */}
            <div className="bg-white rounded-xl border border-border p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-primary mb-4">Update Status</h3>
              
              <div className="space-y-3">
                <Button
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={isUpdating || request.status === 'approved'}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>

                <Button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={isUpdating || request.status === 'rejected'}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>

                <Button
                  onClick={() => handleStatusUpdate('paid')}
                  disabled={isUpdating || request.status === 'paid'}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <DollarSign className="w-4 h-4" />
                  Mark as Paid
                </Button>

                <Button
                  onClick={() => handleStatusUpdate('pending')}
                  disabled={isUpdating || request.status === 'pending'}
                  variant="outline"
                  className="w-full"
                >
                  Reset to Pending
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <TextArea
                  label="Admin Notes"
                  placeholder="Add notes about this request..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Notes are saved when you update the status
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}