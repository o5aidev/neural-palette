'use client'

import { Bell, Settings, User } from 'lucide-react'

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-sm p-2 hover:bg-accent transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="rounded-sm p-2 hover:bg-accent transition-colors">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="rounded-sm p-2 hover:bg-accent transition-colors">
            <User className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopBar
