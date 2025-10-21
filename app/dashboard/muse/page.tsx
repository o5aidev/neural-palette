import DashboardLayout from '@/components/layout/DashboardLayout'

export default function MusePage() {
  return (
    <DashboardLayout
      title="Neural Muse"
      description="AIを活用した創作支援でインスピレーションを得ます"
    >
      <div className="grid gap-6">
        {/* AI Generation Interface */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">AI創作支援</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                創作プロンプト
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="例: 夏の夕暮れをイメージした、ノスタルジックなメロディを生成して"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  創作タイプ
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option>メロディ生成</option>
                  <option>歌詞生成</option>
                  <option>コード進行</option>
                  <option>アートワーク</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ムード
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option>ハッピー</option>
                  <option>メランコリック</option>
                  <option>エネルギッシュ</option>
                  <option>リラックス</option>
                </select>
              </div>
            </div>

            <button className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-lg font-medium transition-colors">
              生成開始
            </button>
          </div>
        </div>

        {/* Generation History */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">生成履歴</h2>
          <div className="space-y-3">
            {[
              { title: 'Summer Melody v3', type: 'メロディ', status: '完了', date: '2025-10-21 09:30' },
              { title: 'Nostalgic Lyrics', type: '歌詞', status: '完了', date: '2025-10-20 14:15' },
              { title: 'Album Cover Design', type: 'アートワーク', status: '処理中', date: '2025-10-21 10:00' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.type}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.date}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    item.status === '完了'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
