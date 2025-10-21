import DashboardLayout from '@/components/layout/DashboardLayout'

export default function IdentityPage() {
  return (
    <DashboardLayout
      title="Neural Identity"
      description="アーティストのDNAを定義し、独自の個性を保存・管理します"
    >
      <div className="grid gap-6">
        {/* Artist DNA Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">アーティストプロフィール</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                アーティスト名
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="アーティスト名を入力"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ジャンル
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="例: ポップ、ロック、エレクトロニック"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                バイオグラフィー
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="アーティストの経歴や特徴を入力"
              />
            </div>
          </div>
        </div>

        {/* Creative DNA Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">クリエイティブDNA</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                音楽的特徴
              </label>
              <div className="flex flex-wrap gap-2">
                {['メロディック', 'リズミカル', 'ハーモニック', 'エクスペリメンタル'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                影響を受けたアーティスト
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="影響を受けたアーティストを入力"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
