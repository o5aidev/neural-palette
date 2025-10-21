import DashboardLayout from '@/components/layout/DashboardLayout'

export default function ConnectorPage() {
  return (
    <DashboardLayout
      title="Neural Connector"
      description="SNS連携とソーシャルメディア管理"
    >
      <div className="grid gap-6">
        {/* Social Media Accounts */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">連携アカウント</h2>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
              アカウント追加
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { platform: 'Twitter', handle: '@neuralartist', followers: '45.2K', status: '接続済み', engagement: '8.2%' },
              { platform: 'Instagram', handle: '@neural_artist', followers: '62.8K', status: '接続済み', engagement: '12.4%' },
              { platform: 'TikTok', handle: '@neuralartist', followers: '128K', status: '接続済み', engagement: '15.8%' },
              { platform: 'Facebook', handle: 'Neural Artist', followers: '23.5K', status: '未接続', engagement: '-' },
            ].map((account, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-gray-900 dark:text-white">{account.platform}</div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      account.status === '接続済み'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {account.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{account.handle}</div>
                {account.status === '接続済み' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">フォロワー: {account.followers}</span>
                    <span className="text-primary-600 dark:text-primary-400">エンゲージメント: {account.engagement}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">最近の投稿</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              すべて表示
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                platform: 'Instagram',
                content: '新曲「Summer Vibes」のティザー公開！🎵 #新曲 #音楽',
                date: '2025-10-20 15:30',
                likes: '2,345',
                comments: '189',
                shares: '456'
              },
              {
                platform: 'Twitter',
                content: 'スタジオでの制作風景をライブ配信中！見に来てね👋',
                date: '2025-10-19 18:00',
                likes: '1,892',
                comments: '234',
                shares: '567'
              },
              {
                platform: 'TikTok',
                content: 'メイキング動画アップしました！裏側をちょっとだけ公開🎬',
                date: '2025-10-18 12:00',
                likes: '5,678',
                comments: '432',
                shares: '1,234'
              },
            ].map((post, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-primary-600 dark:text-primary-400">{post.platform}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{post.content}</p>
                <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                  <span>🔄 {post.shares}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Posts */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">予約投稿</h2>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
              新規投稿
            </button>
          </div>

          <div className="space-y-3">
            {[
              { platforms: ['Twitter', 'Instagram'], content: '新曲リリース告知第2弾', scheduled: '2025-10-25 12:00' },
              { platforms: ['TikTok'], content: 'リハーサル風景の動画', scheduled: '2025-10-23 19:00' },
            ].map((scheduled, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white mb-1">{scheduled.content}</div>
                  <div className="flex items-center space-x-2">
                    {scheduled.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded text-xs"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{scheduled.scheduled}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
