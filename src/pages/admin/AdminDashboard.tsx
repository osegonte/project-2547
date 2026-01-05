import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestService } from '../../features/request/request.service'
import { adminAuthService } from '../../features/admin/admin.auth.service'
import type { RequestSubmission } from '../../features/request/request.types'
import { Search, Filter, LogOut, Eye } from 'lucide-react'

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'paid'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<RequestSubmission[]>([])
  const [filteredRequests, setFilteredRequests] = useState<RequestSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadRequests()
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, statusFilter, searchQuery])

  const loadRequests = async () => {
    setIsLoading(true)
    const data = await requestService.getAllRequests()
    setRequests(data)
    setIsLoading(false)
  }

  const filterRequests = () => {
    let filtered = [...requests]

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(req =>
        req.full_name.toLowerCase().includes(query) ||
        req.email.toLowerCase().includes(query) ||
        req.school_name.toLowerCase().includes(query)
      )
    }

    setFilteredRequests(filtered)
  }

  const handleSignOut = async () => {
    await adminAuthService.signOut()
    navigate('/admin/login')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-blue-100 text-blue-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'paid': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusCount = (status: StatusFilter) => {
    if (status === 'all') return requests.length
    return requests.filter(req => req.status === status).length
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-primary">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage scholarship requests
              </p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-6 bg-white rounded-xl border-2 transition-all text-left ${
              statusFilter === 'all' ? 'border-accent shadow-medium' : 'border-border hover:border-accent/50'
            }`}
          >
            <div className="text-3xl font-bold text-primary mb-1">
              {getStatusCount('all')}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Requests
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`p-6 bg-white rounded-xl border-2 transition-all text-left ${
              statusFilter === 'pending' ? 'border-yellow-500 shadow-medium' : 'border-border hover:border-yellow-500/50'
            }`}
          >
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {getStatusCount('pending')}
            </div>
            <div className="text-sm text-muted-foreground">
              Pending Review
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('approved')}
            className={`p-6 bg-white rounded-xl border-2 transition-all text-left ${
              statusFilter === 'approved' ? 'border-blue-500 shadow-medium' : 'border-border hover:border-blue-500/50'
            }`}
          >
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {getStatusCount('approved')}
            </div>
            <div className="text-sm text-muted-foreground">
              Approved
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('paid')}
            className={`p-6 bg-white rounded-xl border-2 transition-all text-left ${
              statusFilter === 'paid' ? 'border-green-500 shadow-medium' : 'border-border hover:border-green-500/50'
            }`}
          >
            <div className="text-3xl font-bold text-green-600 mb-1">
              {getStatusCount('paid')}
            </div>
            <div className="text-sm text-muted-foreground">
              Paid
            </div>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="h-12 pl-10 pr-8 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-2">No requests found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Requests will appear here once submitted'}
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
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Date</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-foreground">{request.full_name}</div>
                          <div className="text-sm text-muted-foreground">{request.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-foreground">{request.school_name}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-foreground">
                          {request.currency} {Number(request.amount).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => navigate(`/admin/requests/${request.id}`)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-accent hover:bg-accent/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
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