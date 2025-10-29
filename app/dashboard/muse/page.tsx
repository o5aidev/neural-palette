'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/badge'
import { KPICard } from '@/components/ui/KPICard'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/lib/hooks/useToast'
import { useApi, useMutation } from '@/lib/hooks/useApi'
import ToastContainer from '@/components/ui/ToastContainer'
import { apiClient } from '@/lib/api/client'
import { Sparkles, Calendar, Zap, TrendingUp } from 'lucide-react'
import { PromptTemplates } from '@/components/muse/PromptTemplates'
import { GenerationStats } from '@/components/muse/GenerationStats'

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
    <DashboardLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="space-y-6">
        {/* Header with Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Neural Muse
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              AI創作支援でインスピレーションを無限に
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
              新規セッション
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            label="総生成数"
            value="1,847"
            change="+23%"
            period="全期間"
            trend="up"
            icon={Sparkles}
            moduleColor="bg-muse"
          />
          <KPICard
            label="今月の生成"
            value="342"
            change="+15%"
            period="本月"
            trend="up"
            icon={Calendar}
            moduleColor="bg-palette"
          />
          <KPICard
            label="トークン使用"
            value="125K"
            change="+8%"
            period="本月"
            trend="up"
            icon={Zap}
            moduleColor="bg-connector"
          />
          <KPICard
            label="平均信頼度"
            value="94%"
            change="+2%"
            period="全体"
            trend="up"
            icon={TrendingUp}
            moduleColor="bg-identity"
          />
        </div>

        {/* Quick Generate Actions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              クイック生成
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              ワンクリックでAI生成を開始
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: 'melody', label: 'メロディ', icon: '🎵', desc: 'メロディライン生成' },
              { type: 'lyrics', label: '歌詞', icon: '📝', desc: '歌詞・詞の生成' },
              { type: 'chord', label: 'コード', icon: '🎹', desc: 'コード進行提案' },
              { type: 'artwork', label: 'アート', icon: '🎨', desc: 'ビジュアル制作' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => setType(item.type)}
                className={`p-6 rounded-xl border-2 transition-all text-left hover:scale-105 hover:shadow-lg ${
                  type === item.type
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  {item.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {item.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Generation Interface */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">AI創作プロンプト</h2>
          <div className="space-y-4">
            <Textarea
              label="創作プロンプト"
              rows={4}
              placeholder="例: 夏の夕暮れをイメージした、ノスタルジックなメロディを生成して"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  選択中: {typeMap[type] || type}
                </label>
                <div className="px-4 py-2.5 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg text-sm text-primary-700 dark:text-primary-300">
                  上の「クイック生成」から選択してください
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full py-3 text-lg font-semibold"
              onClick={handleGenerate}
              isLoading={isGenerating}
            >
              {isGenerating ? '生成中...' : '🚀 AI生成を開始'}
            </Button>
          </div>
        </div>

        {/* Generation History */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                生成履歴
              </h2>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                すべて表示 →
              </button>
            </div>
          </div>

          <div className="p-6">
            {historyLoading ? (
              <TableSkeleton rows={5} />
            ) : historyData?.data && historyData.data.length > 0 ? (
              <div className="space-y-3">
                {historyData.data.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all cursor-pointer"
                    onClick={() => setSelectedResult(item)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {item.type === 'melody' ? '🎵' : item.type === 'lyrics' ? '📝' : item.type === 'chord' ? '🎹' : '🎨'}
                        </span>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {item.prompt.substring(0, 50)}
                          {item.prompt.length > 50 ? '...' : ''}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 ml-11">
                        <Badge variant="info" size="xs">
                          {typeMap[item.type] || item.type}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(item.generatedAt).toLocaleString('ja-JP')}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          信頼度 {item.confidence}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-4">
                        <div className="text-xs text-gray-500 dark:text-gray-400">トークン</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.tokensUsed.toLocaleString()}
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎨</div>
                <div className="text-gray-500 dark:text-gray-400 mb-2">
                  まだ生成履歴がありません
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  上のフォームから最初のAI生成を始めましょう!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Templates and Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PromptTemplates />
        <GenerationStats />
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
