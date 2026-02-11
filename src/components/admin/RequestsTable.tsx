import { Link } from 'react-router-dom'
import type { RequestSubmission } from '../../features/request/request.types'
import { formatCurrency, formatDate } from '../../lib/utils'
import { Eye, ArrowUpRight } from 'lucide-react'

interface RequestsTableProps {
  requests: RequestSubmission[]
  isLoading: boolean
  onUpdate: () => void
}

export default function RequestsTable({ requests, isLoading }: RequestsTableProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rejected: 'bg-rose-50 text-rose-700 border-rose-200'
    }
    
    const labels = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${variants[status as keyof typeof variants] || variants.pending}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-muted border-t-accent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground mt-4">Loading requests...</p>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No requests yet</h3>
        <p className="text-sm text-muted-foreground">
          When students submit requests, they'll appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/40 bg-muted/30">
            <th className="text-left px-6 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Student
            </th>
            <th className="text-left px-6 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              School
            </th>
            <th className="text-left px-6 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Amount
            </th>
            <th className="text-left px-6 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Status
            </th>
            <th className="text-left px-6 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Submitted
            </th>
            <th className="text-right px-6 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {requests.map((request) => (
            <tr 
              key={request.id}
              className="hover:bg-muted/20 transition-colors group"
            >
              <td className="px-6 py-4">
                <div>
                  <p className="font-semibold text-sm text-foreground">{request.full_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{request.email}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-sm text-foreground">{request.school_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{request.program}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="font-bold text-sm text-foreground">
                  {formatCurrency(Number(request.amount), request.currency)}
                </p>
              </td>
              <td className="px-6 py-4">
                {getStatusBadge(request.status)}
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  {formatDate(request.created_at)}
                </p>
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  to={`/admin/requests/${request.id}`}
                  className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold text-accent hover:text-accent/80 bg-accent/10 hover:bg-accent/20 rounded-lg transition-all group-hover:shadow-sm"
                >
                  View
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}