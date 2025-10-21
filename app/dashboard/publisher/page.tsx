import DashboardLayout from '@/components/layout/DashboardLayout'

export default function PublisherPage() {
  return (
    <DashboardLayout
      title="Neural Publisher"
      description="コンテンツの配信スケジュールと統計管理"
    >
      <div className="grid gap-6">
        {/* Publishing Calendar */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">配信スケジュール</h2>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
              新規スケジュール
            </button>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Summer Vibes 2025 - Release', platform: 'すべてのプラットフォーム', date: '2025-11-15 00:00', status: '予定' },
              { title: 'Behind the Scenes Video', platform: 'YouTube, Instagram', date: '2025-11-10 18:00', status: '予定' },
              { title: 'Teaser Post', platform: 'Twitter, Instagram', date: '2025-10-25 12:00', status: '配信済み' },
            ].map((schedule, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{schedule.title}</h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{schedule.platform}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{schedule.date}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    schedule.status === '配信済み'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  }`}
                >
                  {schedule.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Stats */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">配信統計</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">総リーチ数</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">45,678</div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">+23% 先月比</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">エンゲージメント率</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">8.4%</div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">+1.2% 先月比</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">配信プラットフォーム数</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">7</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">今月の配信数</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
            </div>
          </div>
        </div>

        {/* Platform Status */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">プラットフォーム状態</h2>
          <div className="space-y-3">
            {[
              { name: 'Spotify', status: '接続済み', followers: '15,234' },
              { name: 'Apple Music', status: '接続済み', followers: '12,890' },
              { name: 'YouTube Music', status: '接続済み', followers: '23,456' },
              { name: 'SoundCloud', status: '未接続', followers: '-' },
            ].map((platform, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="font-medium text-gray-900 dark:text-white">{platform.name}</div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      platform.status === '接続済み'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {platform.status}
                  </span>
                </div>
                {platform.followers !== '-' && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    フォロワー: {platform.followers}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
