import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestService } from '../../features/request/request.service'
import { adminAuthService } from '../../features/admin/admin.auth.service'
import { ArrowLeft, Archive, LogOut, Filter } from 'lucide-react'

type ReasonFilter = 'all' | 'rejected' | 'paid'

export default function ArchivedRequests() {
  const navigate = useNavigate()
  const [archives, setArchives] = useState<any[]>([])
  const [filteredArchives, setFilteredArchives] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reasonFilter, setReasonFilter] = useState<ReasonFilter>('all')

  useEffect(() => {
    loadArchives()
  }, [])

  useEffect(() => {
    filterArchives()
  }, [archives, reasonFilter])

  const loadArchives = async () => {
    setIsLoading(true)
    const data = await requestService.getArchivedRequests()
    setArchives(data)
    setIsLoading(false)
  }

  const filterArchives = () => {
    if (reasonFilter === 'all') {
      setFilteredArchives(archives)
    } else {
      setFilteredArchives(archives.filter(a => a.archived_reason === reasonFilter))
    }
  }

  const handleSignOut = async () => {
    await adminAuthService.signOut()
    navigate('/admin/login')
  }

  const getReasonColor = (reason: string) => {
    return reason === 'rejected' 
      ? 'bg-red-100 text-red-800'
      : 'bg-green-100 text-green-800'
  }

  const getReasonCount = (reason: ReasonFilter) => {
    if (reason === 'all') return archives.length
    return archives.filter(a => a.archived_reason === reason).length
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-serif font-bold text-primary">
                  Archived Requests
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  View completed and rejected requests
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setReasonFilter('all')}
            className={`p-6 bg-white rounded-xl border-2 transition-all text-left ${
              reasonFilter === 'all' ? 'border-accent shadow-medium' : 'border-border hover:border-accent/50'
            }`}
          >
            <div className="text-3xl font-bold text-primary mb-1">
              {getReasonCount('all')}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Archived
            </div>
          </button>

          <button
            onClick={() => setReasonFilter('rejected')}
            className={`p-6 bg-white rounded-xl border-2 transition-all text-left ${
              reasonFilter === 'rejected' ? 'border-red-500 shadow-medium' : 'border-border hover:border-red-500/50'
            }`}
          >
            <div className="text-3xl font-bold text-red-600 mb-1">
              {getReasonCount('rejected')}
            </div>
            <div className="text-sm text-muted-foreground">
              Rejected
            </div>
          </button>

          <button
            onClick={() => setReasonFilter('paid')}
            className={`p-6 bg-white rounded-xl border-2 transition-all text-left ${
              reasonFilter === 'paid' ? 'border-green-500 shadow-medium' : 'border-border hover:border-green-500/50'
            }`}
          >
            <div className="text-3xl font-bold text-green-600 mb-1">
              {getReasonCount('paid')}
            </div>
            <div className="text-sm text-muted-foreground">
              Paid & Archived
            </div>
          </button>
        </div>

        {/* Archived Requests Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading archives...</p>
            </div>
          ) : filteredArchives.length === 0 ? (
            <div className="p-12 text-center">
              <Archive className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No archived requests found</p>
              <p className="text-sm text-muted-foreground">
                {reasonFilter !== 'all' 
                  ? 'Try changing the filter' 
                  : 'Archived requests will appear here'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Student</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">School</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Amount</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Reason</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Archived Date</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Archived By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredArchives.map((archive) => (
                    <tr key={archive.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-foreground">{archive.full_name}</div>
                          <div className="text-sm text-muted-foreground">{archive.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-foreground">{archive.school_name}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-foreground">
                          {archive.currency} {Number(archive.amount).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getReasonColor(archive.archived_reason)}`}>
                          {archive.archived_reason.charAt(0).toUpperCase() + archive.archived_reason.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {new Date(archive.archived_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {archive.archived_by_email}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}