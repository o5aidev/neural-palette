'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { KPICard } from '@/components/ui/KPICard'
import { Badge } from '@/components/ui/Badge'
import { useApi } from '@/lib/hooks/useApi'
import { useToast } from '@/lib/hooks/useToast'
import ToastContainer from '@/components/ui/ToastContainer'
import { PublishSchedule } from '@/components/publisher/PublishSchedule'
import { PlatformStats } from '@/components/publisher/PlatformStats'

interface Distribution {
  id: string
  contentId: string
  contentTitle: string
  platforms: string[]
  status: string
  scheduledAt?: Date
  publishedAt?: Date
  createdAt: Date
}

interface PublisherStats {
  totalDistributions: number
  publishedCount: number
  scheduledCount: number
  failedCount: number
  byStatus: Record<string, number>
  byPlatform: Record<string, number>
}

export default function PublisherPage() {
  const { toasts, removeToast } = useToast()

  // Fetch distributions
  const { data: distributionsData, isLoading: distributionsLoading } = useApi<{ data: Distribution[] }>(
    '/publisher/distributions?limit=20',
    { autoFetch: true }
  )

  // Fetch stats
  const { data: statsData, isLoading: statsLoading } = useApi<{ data: PublisherStats }>(
    '/publisher/stats',
    { autoFetch: true }
  )

  const distributions = distributionsData?.data || []
  const stats = statsData?.data

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400',
      scheduled: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      publishing: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      published: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    }
    return colors[status] || colors.draft
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: '下書き',
      scheduled: '予定',
      publishing: '配信中',
      published: '配信済み',
      failed: '失敗',
    }
    return labels[status] || status
  }

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="space-y-6">
        {/* Header with Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Neural Publisher
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              コンテンツの配信スケジュールと統計管理
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <button className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新規配信
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            label="総配信数"
            value={statsLoading ? '...' : (stats?.totalDistributions || 0).toString()}
            change="+12%"
            period="全期間"
            trend="up"
          />
          <KPICard
            label="配信済み"
            value={statsLoading ? '...' : (stats?.publishedCount || 0).toString()}
            change="+8%"
            period="本月"
            trend="up"
          />
          <KPICard
            label="予定"
            value={statsLoading ? '...' : (stats?.scheduledCount || 0).toString()}
            change={stats?.scheduledCount ? `${stats.scheduledCount}件` : '0件'}
            period="待機中"
            trend="neutral"
          />
          <KPICard
            label="失敗"
            value={statsLoading ? '...' : (stats?.failedCount || 0).toString()}
            change={stats?.failedCount === 0 ? '正常' : '要確認'}
            period="エラー"
            trend={stats?.failedCount === 0 ? 'up' : 'down'}
          />
        </div>

        {/* Distributions List */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                配信スケジュール
              </h2>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                すべて表示 →
              </button>
            </div>
          </div>

          <div className="p-6">
            {distributionsLoading ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">⏳</div>
                <div className="text-gray-500 dark:text-gray-400">読み込み中...</div>
              </div>
            ) : distributions.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📅</div>
                <div className="text-gray-500 dark:text-gray-400 mb-2">
                  配信スケジュールがありません
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  コンテンツを配信予約しましょう
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {distributions.map((dist) => (
                  <div
                    key={dist.id}
                    className="group flex items-center justify-between p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all cursor-pointer"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {dist.contentTitle}
                      </h3>
                      <div className="flex items-center gap-3">
                        {dist.platforms.map((platform, idx) => (
                          <Badge key={idx} variant="neutral" size="xs">
                            {platform}
                          </Badge>
                        ))}
                        {dist.scheduledAt && (
                          <>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(dist.scheduledAt).toLocaleString('ja-JP', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          dist.status === 'published' ? 'success' :
                          dist.status === 'scheduled' ? 'info' :
                          dist.status === 'failed' ? 'danger' :
                          'neutral'
                        }
                        size="sm"
                      >
                        {getStatusLabel(dist.status)}
                      </Badge>
                      <button className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule and Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PublishSchedule />
        <PlatformStats />
      </div>
    </DashboardLayout>
  )
}
