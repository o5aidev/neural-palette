import DashboardLayout from '@/components/layout/DashboardLayout'

export default function ContentPage() {
  return (
    <DashboardLayout
      title="Neural Palette"
      description="コンテンツを管理し、作品のバージョン管理を行います"
    >
      <div className="grid gap-6">
        {/* Content Library */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">コンテンツライブラリ</h2>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
              新規コンテンツ
            </button>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Summer Vibes 2025', type: '楽曲', status: '公開中', date: '2025-10-15' },
              { title: 'Midnight Dreams', type: '楽曲', status: '下書き', date: '2025-10-12' },
              { title: 'Live Performance #1', type: '動画', status: '公開中', date: '2025-10-10' },
            ].map((content, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{content.title}</h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{content.type}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{content.date}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    content.status === '公開中'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                  }`}
                >
                  {content.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Version History */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">バージョン履歴</h2>
          <div className="space-y-3">
            {[
              { version: 'v2.1', description: 'ミックス調整', date: '2025-10-20' },
              { version: 'v2.0', description: 'リマスター版', date: '2025-10-18' },
              { version: 'v1.0', description: '初回リリース', date: '2025-10-15' },
            ].map((version, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border-l-2 border-primary-500 bg-gray-50 dark:bg-gray-800/50 pl-4"
              >
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{version.version}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-3">{version.description}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{version.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
