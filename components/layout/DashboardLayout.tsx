import Sidebar from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {(title || description) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}
