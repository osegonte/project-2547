import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Request } from '../../features/request/request.types'
import RequestsTable from '../../components/admin/RequestsTable'
import { TrendingUp, Clock, CheckCircle, XCircle, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

interface DashboardStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<Request[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setRequests(data)
        
        // Calculate stats
        const stats: DashboardStats = {
          total: data.length,
          pending: data.filter(r => r.status === 'pending').length,
          approved: data.filter(r => r.status === 'approved').length,
          rejected: data.filter(r => r.status === 'rejected').length
        }
        setStats(stats)
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      label: 'Total Requests',
      value: stats.total,
      icon: FileText,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      trend: null
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      trend: null
    },
    {
      label: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: stats.total > 0 ? `${Math.round((stats.approved / stats.total) * 100)}%` : null
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      trend: stats.total > 0 ? `${Math.round((stats.rejected / stats.total) * 100)}%` : null
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/40 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage scholarship requests</p>
            </div>
            <button
              onClick={fetchRequests}
              className="h-10 px-4 text-sm font-medium bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors shadow-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-border/50 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} strokeWidth={2} />
                </div>
                {stat.trend && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">{isLoading ? '—' : stat.value}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Requests Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden"
        >
          <div className="border-b border-border/40 px-6 py-4">
            <h2 className="text-lg font-bold text-foreground">All Requests</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isLoading ? 'Loading...' : `${requests.length} total requests`}
            </p>
          </div>
          
          <RequestsTable 
            requests={requests} 
            isLoading={isLoading}
            onUpdate={fetchRequests}
          />
        </motion.div>
      </div>
    </div>
  )
}