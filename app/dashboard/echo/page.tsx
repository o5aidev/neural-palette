'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import { KPICard } from '@/components/ui/KPICard'
import { Badge } from '@/components/ui/badge'
import { useApi, useMutation } from '@/lib/hooks/useApi'
import { useToast } from '@/lib/hooks/useToast'
import ToastContainer from '@/components/ui/ToastContainer'
import { apiClient } from '@/lib/api/client'
import { MessageCircle, CheckCircle, TrendingUp, Activity } from 'lucide-react'

interface FanMessage {
  id: string
  content: string
  platform: string
  sentiment: string
  confidence: number
  aiResponse?: string
  responseGeneratedAt?: Date
  createdAt: Date
}

interface EchoStats {
  totalMessages: number
  withResponse: number
  averageConfidence: number
  bySentiment: Record<string, number>
  recentMessages: Array<{
    id: string
    content: string
    sentiment: string
    createdAt: Date
  }>
}

export default function EchoPage() {
  const { toasts, removeToast, success, error: showError } = useToast()
  const [newMessageContent, setNewMessageContent] = useState('')
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)

  // Fetch messages
  const { data: messagesData, isLoading: messagesLoading, refetch: refetchMessages } = useApi<{ data: FanMessage[] }>(
    '/echo/messages?limit=20',
    { autoFetch: true }
  )

  // Fetch stats
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useApi<{ data: EchoStats }>(
    '/echo/stats',
    { autoFetch: true }
  )

  // Create message mutation
  const { mutate: createMessage, isLoading: isCreating } = useMutation<unknown, { content: string; platform: string }>(
    async (data) => apiClient.post('/echo/messages', data)
  )

  // Generate response mutation
  const { mutate: generateResponse, isLoading: isGenerating } = useMutation<unknown, string>(
    async (messageId) => apiClient.post(`/echo/messages/${messageId}/response`, {})
  )

  const handleCreateMessage = async () => {
    if (!newMessageContent.trim()) {
      showError('メッセージを入力してください')
      return
    }

    try {
      await createMessage({
        content: newMessageContent,
        platform: 'web'
      })
      success('メッセージを作成しました')
      setNewMessageContent('')
      setShowNewMessageModal(false)
      await refetchMessages()
      await refetchStats()
    } catch (err) {
      showError(err instanceof Error ? err.message : 'メッセージの作成に失敗しました')
    }
  }

  const handleGenerateResponse = async (messageId: string) => {
    try {
      await generateResponse(messageId)
      success('AI応答を生成しました')
      await refetchMessages()
      await refetchStats()
    } catch (err) {
      showError(err instanceof Error ? err.message : 'AI応答の生成に失敗しました')
    }
  }

  const messages = messagesData?.data || []
  const stats = statsData?.data

  const _getSentimentColor = (sentiment: string) => {
    const colors: Record<string, string> = {
      excited: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      positive: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      neutral: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400',
      negative: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      critical: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      curious: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      supportive: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
    }
    return colors[sentiment] || colors.neutral
  }

  const getSentimentLabel = (sentiment: string) => {
    const labels: Record<string, string> = {
      excited: '興奮',
      positive: 'ポジティブ',
      neutral: '中立',
      negative: 'ネガティブ',
      critical: '批判的',
      curious: '好奇心',
      supportive: '応援',
    }
    return labels[sentiment] || sentiment
  }

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="space-y-6">
        {/* Header with Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Neural Echo
            </h1>
            <p className="text-muted-foreground mt-1">
              AIエージェントによるファンエンゲージメント
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-sm border border-border hover:bg-accent transition-colors">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新規メッセージ
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            label="総メッセージ"
            value={statsLoading ? '...' : (stats?.totalMessages || 0).toString()}
            change="+18%"
            period="全期間"
            trend="up"
            icon={MessageCircle}
            moduleColor="bg-echo"
          />
          <KPICard
            label="AI応答済み"
            value={statsLoading ? '...' : (stats?.withResponse || 0).toString()}
            change="+24%"
            period="本月"
            trend="up"
            icon={CheckCircle}
            moduleColor="bg-muse"
          />
          <KPICard
            label="平均信頼度"
            value={statsLoading ? '...' : `${stats?.averageConfidence || 0}%`}
            change="+3%"
            period="全体"
            trend="up"
            icon={TrendingUp}
            moduleColor="bg-identity"
          />
          <KPICard
            label="応答率"
            value={statsLoading ? '...' : stats ? `${Math.round((stats.withResponse / stats.totalMessages) * 100)}%` : '0%'}
            change="+5%"
            period="本月"
            trend="up"
            icon={Activity}
            moduleColor="bg-palette"
          />
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              感情分布
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              ファンメッセージの感情分析
            </p>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { sentiment: 'excited', label: '興奮', icon: '🎉', count: stats?.bySentiment?.excited || 0 },
              { sentiment: 'positive', label: 'ポジティブ', icon: '😊', count: stats?.bySentiment?.positive || 0 },
              { sentiment: 'neutral', label: '中立', icon: '😐', count: stats?.bySentiment?.neutral || 0 },
              { sentiment: 'negative', label: 'ネガティブ', icon: '😔', count: stats?.bySentiment?.negative || 0 },
              { sentiment: 'critical', label: '批判的', icon: '😠', count: stats?.bySentiment?.critical || 0 },
              { sentiment: 'curious', label: '好奇心', icon: '🤔', count: stats?.bySentiment?.curious || 0 },
              { sentiment: 'supportive', label: '応援', icon: '💪', count: stats?.bySentiment?.supportive || 0 },
            ].map((item) => (
              <div
                key={item.sentiment}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all text-center"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {item.count}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                最近のメッセージ
              </h2>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                すべて表示 →
              </button>
            </div>
          </div>

          <div className="p-6">
            {messagesLoading ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">⏳</div>
                <div className="text-gray-500 dark:text-gray-400">読み込み中...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💬</div>
                <div className="text-gray-500 dark:text-gray-400 mb-2">
                  メッセージがありません
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  ファンからのメッセージをお待ちしています
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="group p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            message.sentiment === 'positive' || message.sentiment === 'excited' || message.sentiment === 'supportive' ? 'success' :
                            message.sentiment === 'negative' || message.sentiment === 'critical' ? 'danger' :
                            message.sentiment === 'curious' ? 'info' :
                            'neutral'
                          }
                          size="xs"
                        >
                          {getSentimentLabel(message.sentiment)} ({message.confidence}%)
                        </Badge>
                        <Badge variant="neutral" size="xs">
                          {message.platform}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(message.createdAt).toLocaleString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="text-gray-900 dark:text-white mb-3 pl-2 border-l-4 border-primary-200 dark:border-primary-800">
                      {message.content}
                    </div>

                    {message.aiResponse ? (
                      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">🤖</div>
                          <div className="flex-1">
                            <div className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">
                              AI応答
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              {message.aiResponse}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm text-sm font-medium transition-colors flex items-center gap-2"
                          onClick={() => handleGenerateResponse(message.id)}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <>⏳ 生成中...</>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              AI応答を生成
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      <Modal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        title="新規メッセージ作成"
      >
        <div className="space-y-4">
          <Textarea
            label="メッセージ内容"
            rows={4}
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            placeholder="ファンからのメッセージを入力..."
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowNewMessageModal(false)}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleCreateMessage}
              disabled={isCreating || !newMessageContent.trim()}
            >
              {isCreating ? '作成中...' : '作成'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
