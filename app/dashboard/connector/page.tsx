import DashboardLayout from '@/components/layout/DashboardLayout'
import { KPICard } from '@/components/ui/KPICard'
import { Badge } from '@/components/ui/badge'

export default function ConnectorPage() {
  const connectedAccounts = [
    { platform: 'Twitter', handle: '@neuralartist', followers: '45.2K', status: '接続済み', engagement: '8.2%' },
    { platform: 'Instagram', handle: '@neural_artist', followers: '62.8K', status: '接続済み', engagement: '12.4%' },
    { platform: 'TikTok', handle: '@neuralartist', followers: '128K', status: '接続済み', engagement: '15.8%' },
    { platform: 'Facebook', handle: 'Neural Artist', followers: '23.5K', status: '未接続', engagement: '-' },
  ]

  const totalFollowers = connectedAccounts
    .filter(a => a.status === '接続済み')
    .reduce((sum, a) => sum + parseFloat(a.followers.replace('K', '')) * 1000, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Neural Connector
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              SNS連携とソーシャルメディア管理
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新規投稿
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            label="総フォロワー"
            value="236K"
            change="+18%"
            period="全プラットフォーム"
            trend="up"
          />
          <KPICard
            label="連携アカウント"
            value="3/4"
            change="75%"
            period="接続済み"
            trend="up"
          />
          <KPICard
            label="平均エンゲージメント"
            value="12.1%"
            change="+2.3%"
            period="本月"
            trend="up"
          />
          <KPICard
            label="予約投稿"
            value="2"
            change="待機中"
            period="スケジュール"
            trend="neutral"
          />
        </div>

        {/* Social Media Accounts */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                連携アカウント
              </h2>
              <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all">
                アカウント追加
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedAccounts.map((account, index) => (
                <div
                  key={index}
                  className="group p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-lg text-gray-900 dark:text-white">{account.platform}</div>
                    <Badge
                      variant={account.status === '接続済み' ? 'success' : 'neutral'}
                      size="sm"
                    >
                      {account.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">{account.handle}</div>
                  {account.status === '接続済み' && (
                    <div className="flex justify-between text-sm pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">フォロワー</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{account.followers}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400">エンゲージメント</div>
                        <div className="font-semibold text-primary-600 dark:text-primary-400">{account.engagement}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                最近の投稿
              </h2>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                すべて表示 →
              </button>
            </div>
          </div>

          <div className="p-6 space-y-3">
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
                className="group p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="info" size="sm">
                    {post.platform}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                </div>
                <p className="text-gray-900 dark:text-white mb-4">{post.content}</p>
                <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="flex items-center gap-1">
                    <span>❤️</span>
                    <span className="font-medium">{post.likes}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>💬</span>
                    <span className="font-medium">{post.comments}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>🔄</span>
                    <span className="font-medium">{post.shares}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Posts */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                予約投稿
              </h2>
              <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all">
                新規投稿
              </button>
            </div>
          </div>

          <div className="p-6 space-y-3">
            {[
              { platforms: ['Twitter', 'Instagram'], content: '新曲リリース告知第2弾', scheduled: '2025-10-25 12:00' },
              { platforms: ['TikTok'], content: 'リハーサル風景の動画', scheduled: '2025-10-23 19:00' },
            ].map((scheduled, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white mb-3">{scheduled.content}</div>
                  <div className="flex items-center gap-2">
                    {scheduled.platforms.map((platform) => (
                      <Badge key={platform} variant="info" size="xs">
                        {platform}
                      </Badge>
                    ))}
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {scheduled.scheduled}
                    </span>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
