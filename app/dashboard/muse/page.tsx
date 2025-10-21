'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { TableSkeleton } from '@/components/ui/Skeleton'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/lib/hooks/useToast'
import { useApi, useMutation } from '@/lib/hooks/useApi'
import ToastContainer from '@/components/ui/ToastContainer'
import { apiClient } from '@/lib/api/client'

interface GenerationResult {
  id: string
  sessionId: string
  sessionTitle: string
  type: string
  prompt: string
  result: string
  tokensUsed: number
  model: string
  confidence: number
  generatedAt: Date
}

export default function MusePage() {
  const { toasts, removeToast, success, error: showError } = useToast()
  const [prompt, setPrompt] = useState('')
  const [type, setType] = useState('melody')
  const [mood, setMood] = useState('happy')
  const [selectedResult, setSelectedResult] = useState<GenerationResult | null>(null)

  // Fetch generation history
  const { data: historyData, isLoading: historyLoading, refetch } = useApi<{ data: GenerationResult[] }>('/muse/history?limit=20', {
    autoFetch: true
  })

  // Generate mutation
  const { mutate: generate, isLoading: isGenerating } = useMutation<any, any>(
    async (data) => apiClient.post('/muse/generate', data)
  )

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showError('プロンプトを入力してください')
      return
    }

    try {
      const result = await generate({
        prompt,
        type,
        mood
      })

      success('AI生成が完了しました')
      setPrompt('')
      await refetch()

      // Show result in modal
      if (result.data) {
        setSelectedResult(result.data)
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : '生成に失敗しました')
    }
  }

  const typeMap: Record<string, string> = {
    melody: 'メロディ生成',
    lyrics: '歌詞生成',
    chord: 'コード進行',
    artwork: 'アートワーク'
  }

  return (
    <DashboardLayout
      title="Neural Muse"
      description="AIを活用した創作支援でインスピレーションを得ます"
    >
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="grid gap-6">
        {/* AI Generation Interface */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">AI創作支援</h2>
          <div className="space-y-4">
            <Textarea
              label="創作プロンプト"
              rows={4}
              placeholder="例: 夏の夕暮れをイメージした、ノスタルジックなメロディを生成して"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="創作タイプ"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="melody">メロディ生成</option>
                <option value="lyrics">歌詞生成</option>
                <option value="chord">コード進行</option>
                <option value="artwork">アートワーク</option>
              </Select>

              <Select
                label="ムード"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              >
                <option value="happy">ハッピー</option>
                <option value="melancholic">メランコリック</option>
                <option value="energetic">エネルギッシュ</option>
                <option value="relaxed">リラックス</option>
              </Select>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={handleGenerate}
              isLoading={isGenerating}
            >
              生成開始
            </Button>
          </div>
        </div>

        {/* Generation History */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">生成履歴</h2>

          {historyLoading ? (
            <TableSkeleton rows={5} />
          ) : historyData?.data && historyData.data.length > 0 ? (
            <div className="space-y-3">
              {historyData.data.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => setSelectedResult(item)}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {item.prompt.substring(0, 60)}
                      {item.prompt.length > 60 ? '...' : ''}
                    </h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {typeMap[item.type] || item.type}
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.generatedAt).toLocaleString('ja-JP')}
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        信頼度: {item.confidence}%
                      </span>
                    </div>
                  </div>
                  <Badge variant="info">
                    {item.tokensUsed} tokens
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              まだ生成履歴がありません。
              <br />
              上のフォームから最初のAI生成を始めましょう！
            </div>
          )}
        </div>
      </div>

      {/* Result Modal */}
      {selectedResult && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedResult(null)}
          title="AI生成結果"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                プロンプト
              </h3>
              <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded">
                {selectedResult.prompt}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                生成結果
              </h3>
              <pre className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-4 rounded whitespace-pre-wrap text-sm font-mono max-h-96 overflow-y-auto">
                {selectedResult.result}
              </pre>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">モデル</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedResult.model}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">トークン数</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedResult.tokensUsed}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">信頼度</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedResult.confidence}%</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  )
}
