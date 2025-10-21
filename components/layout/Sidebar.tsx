'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  {
    name: 'Neural Identity',
    href: '/dashboard/identity',
    icon: '<¨',
    description: '¢üÆ£¹ÈDNA¡'
  },
  {
    name: 'Neural Palette',
    href: '/dashboard/content',
    icon: '=Ý',
    description: '³óÆóÄ¡'
  },
  {
    name: 'Neural Muse',
    href: '/dashboard/muse',
    icon: '(',
    description: 'AIu\/ô'
  },
  {
    name: 'Neural Echo',
    href: '/dashboard/echo',
    icon: '=¬',
    description: 'Õ¡ó¤A'
  },
  {
    name: 'Neural Publisher',
    href: '/dashboard/publisher',
    icon: '=â',
    description: '³óÆóÄMá'
  },
  {
    name: 'Neural Connector',
    href: '/dashboard/connector',
    icon: '=',
    description: 'SNS#:'
  },
  {
    name: 'Neural Sentinel',
    href: '/dashboard/sentinel',
    icon: '=á',
    description: '))Ýw'
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2 mb-8">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Neural Palette
          </span>
        </Link>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-start space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs opacity-60 mt-0.5">{item.description}</div>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
