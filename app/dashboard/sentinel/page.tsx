import DashboardLayout from '@/components/layout/DashboardLayout'

export default function SentinelPage() {
  return (
    <DashboardLayout
      title="Neural Sentinel"
      description="著作権保護と権利侵害の監視システム"
    >
      <div className="grid gap-6">
        {/* Protection Status */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '保護中のコンテンツ', value: '24', icon: '🛡️' },
            { label: '検出された侵害', value: '3', icon: '⚠️', alert: true },
            { label: '解決済み', value: '47', icon: '✅' },
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-900 rounded-lg border p-6 ${
                stat.alert
                  ? 'border-yellow-300 dark:border-yellow-700'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                {stat.alert && (
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs">
                    要対応
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Recent Infringements */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">検出された侵害</h2>
          <div className="space-y-3">
            {[
              {
                content: 'Summer Vibes 2025',
                platform: 'YouTube',
                type: '無断アップロード',
                severity: '高',
                detected: '2025-10-21 08:30',
                status: '対応中'
              },
              {
                content: 'Midnight Dreams',
                platform: 'SoundCloud',
                type: '無断使用',
                severity: '中',
                detected: '2025-10-20 14:15',
                status: '調査中'
              },
              {
                content: 'Album Art Design',
                platform: 'Instagram',
                type: '画像盗用',
                severity: '低',
                detected: '2025-10-19 10:00',
                status: '通知送信済み'
              },
            ].map((infringement, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">{infringement.content}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>{infringement.platform}</span>
                      <span>•</span>
                      <span>{infringement.type}</span>
                      <span>•</span>
                      <span>{infringement.detected}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        infringement.severity === '高'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : infringement.severity === '中'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}
                    >
                      {infringement.severity}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-full text-xs">
                      {infringement.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monitoring Rules */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">監視ルール</h2>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
              新規ルール
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                name: 'オーディオフィンガープリント監視',
                targets: ['YouTube', 'SoundCloud', 'Spotify'],
                status: '有効',
                lastScan: '2時間前'
              },
              {
                name: '画像類似度チェック',
                targets: ['Instagram', 'Twitter', 'Pinterest'],
                status: '有効',
                lastScan: '30分前'
              },
              {
                name: 'メタデータ監視',
                targets: ['すべてのプラットフォーム'],
                status: '有効',
                lastScan: '15分前'
              },
            ].map((rule, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white mb-1">{rule.name}</div>
                  <div className="flex items-center space-x-2">
                    {rule.targets.map((target) => (
                      <span
                        key={target}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded text-xs"
                      >
                        {target}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                    {rule.status}
                  </span>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    最終スキャン: {rule.lastScan}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rights Management */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">権利情報</h2>
          <div className="space-y-3">
            {[
              { content: 'Summer Vibes 2025', type: '楽曲', registered: '2025-10-15', expires: '終身' },
              { content: 'Album Cover Art', type: 'アートワーク', registered: '2025-10-10', expires: '終身' },
              { content: 'Brand Logo', type: 'ロゴ', registered: '2025-09-01', expires: '終身' },
            ].map((right, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{right.content}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {right.type} • 登録日: {right.registered}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  有効期限: {right.expires}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
