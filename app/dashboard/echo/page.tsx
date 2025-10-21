import DashboardLayout from '@/components/layout/DashboardLayout'

export default function EchoPage() {
  return (
    <DashboardLayout
      title="Neural Echo"
      description="AIエージェントによるファンとの対話とエンゲージメント管理"
    >
      <div className="grid gap-6">
        {/* Engagement Overview */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '総メッセージ数', value: '1,234', change: '+12%', trend: 'up' },
            { label: 'アクティブファン', value: '892', change: '+8%', trend: 'up' },
            { label: '平均応答時間', value: '2.3分', change: '-15%', trend: 'down' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
              <div
                className={`text-sm ${
                  stat.trend === 'up'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Conversations */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">最近の会話</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              すべて表示
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                user: 'ファンA',
                message: '新曲のリリース日はいつですか？',
                reply: '11月15日にリリース予定です！お楽しみに！',
                time: '5分前',
                status: '返信済み'
              },
              {
                user: 'ファンB',
                message: 'ライブのチケット情報を教えてください',
                reply: '10月25日から一般販売開始です。公式サイトをチェックしてください！',
                time: '15分前',
                status: '返信済み'
              },
              {
                user: 'ファンC',
                message: 'コラボレーション企画に参加したいです',
                reply: '',
                time: '30分前',
                status: '未返信'
              },
            ].map((conversation, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-gray-900 dark:text-white">{conversation.user}</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{conversation.time}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        conversation.status === '返信済み'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}
                    >
                      {conversation.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  💬 {conversation.message}
                </div>
                {conversation.reply && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-primary-500">
                    ↩️ {conversation.reply}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">AIエージェント設定</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                応答スタイル
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option>フレンドリー</option>
                <option>フォーマル</option>
                <option>カジュアル</option>
                <option>エンスージアスティック</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">自動返信</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AIが自動的にファンに返信します</div>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
