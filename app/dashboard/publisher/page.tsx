'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useApi } from '@/lib/hooks/useApi'
import { useToast } from '@/lib/hooks/useToast'
import ToastContainer from '@/components/ui/ToastContainer'

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
  const [showNewModal, setShowNewModal] = useState(false)

  // Fetch distributions
  const { data: distributionsData, isLoading: distributionsLoading, refetch: refetchDistributions } = useApi<{ data: Distribution[] }>(
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
    <DashboardLayout
      title="Neural Publisher"
      description="コンテンツの配信スケジュールと統計管理"
    >
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="grid gap-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">総配信数</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {statsLoading ? '...' : stats?.totalDistributions || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">配信済み</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {statsLoading ? '...' : stats?.publishedCount || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">予定</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {statsLoading ? '...' : stats?.scheduledCount || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">失敗</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {statsLoading ? '...' : stats?.failedCount || 0}
            </div>
          </div>
        </div>

        {/* Distributions List */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">配信スケジュール</h2>
            <Button onClick={() => setShowNewModal(true)}>
              新規配信作成
            </Button>
          </div>

          {distributionsLoading ? (
            <div className="text-center py-8 text-gray-500">読み込み中...</div>
          ) : distributions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">配信がありません</div>
          ) : (
            <div className="space-y-3">
              {distributions.map((dist) => (
                <div
                  key={dist.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{dist.contentTitle}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {dist.platforms.join(', ')}
                      </span>
                      {dist.scheduledAt && (
                        <>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(dist.scheduledAt).toLocaleString('ja-JP')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(dist.status)}`}>
                    {getStatusLabel(dist.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note: Create modal would require content selection - simplified for now */}
    </DashboardLayout>
  )
}
