'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import { useApi, useMutation } from '@/lib/hooks/useApi'
import { useToast } from '@/lib/hooks/useToast'
import ToastContainer from '@/components/ui/ToastContainer'
import { apiClient } from '@/lib/api/client'

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

  const getSentimentColor = (sentiment: string) => {
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
    <DashboardLayout
      title="Neural Echo"
      description="AIエージェントによるファンとの対話とエンゲージメント管理"
    >
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="grid gap-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">総メッセージ数</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {statsLoading ? '...' : stats?.totalMessages || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">AI応答済み</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {statsLoading ? '...' : stats?.withResponse || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">平均信頼度</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {statsLoading ? '...' : `${stats?.averageConfidence || 0}%`}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button onClick={() => setShowNewMessageModal(true)}>
            新規メッセージ作成
          </Button>
        </div>

        {/* Messages List */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">ファンメッセージ</h2>

          {messagesLoading ? (
            <div className="text-center py-8 text-gray-500">読み込み中...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">メッセージがありません</div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getSentimentColor(message.sentiment)}`}>
                        {getSentimentLabel(message.sentiment)} ({message.confidence}%)
                      </span>
                      <span className="text-xs text-gray-500">{message.platform}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(message.createdAt).toLocaleString('ja-JP')}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    💬 {message.content}
                  </div>

                  {message.aiResponse ? (
                    <div className="text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-primary-500 mb-2">
                      ↩️ {message.aiResponse}
                    </div>
                  ) : (
                    <div className="mt-2">
                      <Button
                        size="sm"
                        onClick={() => handleGenerateResponse(message.id)}
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'AI応答生成中...' : 'AI応答を生成'}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
