"use client"

import { cn } from "@/lib/utils"

const modules = [
  {
    id: "identity",
    name: "Neural Identity",
    subtitle: "アーティストDNA / プロフィール",
    colorClass: "bg-identity",
  },
  {
    id: "palette",
    name: "Neural Palette",
    subtitle: "コンテンツ / メディア管理",
    colorClass: "bg-palette",
  },
  {
    id: "muse",
    name: "Neural Muse",
    subtitle: "AI創作 / セッション",
    colorClass: "bg-muse",
  },
  {
    id: "echo",
    name: "Neural Echo",
    subtitle: "ファン / 感情分析",
    colorClass: "bg-echo",
  },
  {
    id: "publisher",
    name: "Neural Publisher",
    subtitle: "配信 / スケジュール",
    colorClass: "bg-publisher",
  },
  {
    id: "connector",
    name: "Neural Connector",
    subtitle: "SNS連携 / 投稿",
    colorClass: "bg-connector",
  },
  {
    id: "sentinel",
    name: "Neural Sentinel",
    subtitle: "権利保護 / 監視",
    colorClass: "bg-sentinel",
  },
]

interface SidebarProps {
  currentModule: string
  onModuleChange: (module: string) => void
}

export function Sidebar({ currentModule, onModuleChange }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="px-8 py-8 border-b border-border">
        <h1 className="text-xl font-medium text-foreground tracking-wide">Neural Palette</h1>
        <span className="inline-block mt-3 px-3 py-1 text-xs font-normal border border-primary/30 text-primary rounded-sm">
          v1.0.0
        </span>
      </div>

      <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
        {modules.map((module) => {
          const isActive = currentModule === module.id

          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={cn(
                "w-full text-left px-4 py-4 transition-colors duration-200 rounded-sm relative",
                "hover:bg-accent/50",
                isActive && "bg-accent border-l-2 border-primary",
              )}
            >
              <div className="space-y-1">
                <div
                  className={cn(
                    "text-sm font-medium leading-relaxed",
                    isActive ? "text-foreground" : "text-foreground/70",
                  )}
                >
                  {module.name}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">{module.subtitle}</div>
              </div>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
