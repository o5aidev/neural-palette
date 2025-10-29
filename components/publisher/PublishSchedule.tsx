"use client"

import { Badge } from "@/components/ui/Badge"
import { Calendar, Clock } from "lucide-react"

const schedules = [
  {
    id: 1,
    date: "2025-10-30",
    time: "12:00",
    title: "新曲「Summer Vibes」リリース",
    platforms: ["Spotify", "Apple Music", "YouTube"],
    status: "scheduled",
    type: "music",
  },
  {
    id: 2,
    date: "2025-10-31",
    time: "18:00",
    title: "MVプレミア公開",
    platforms: ["YouTube", "Instagram"],
    status: "scheduled",
    type: "video",
  },
  {
    id: 3,
    date: "2025-11-02",
    time: "14:30",
    title: "リリースイベント告知",
    platforms: ["Twitter", "Instagram", "Facebook"],
    status: "pending",
    type: "announcement",
  },
  {
    id: 4,
    date: "2025-11-05",
    time: "20:00",
    title: "ライブ配信",
    platforms: ["YouTube", "TikTok"],
    status: "pending",
    type: "live",
  },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  scheduled: { label: "予約済み", className: "bg-primary/10 text-primary border-primary/20 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800/50" },
  pending: { label: "準備中", className: "bg-muted text-muted-foreground border-border" },
  published: { label: "配信中", className: "bg-secondary/10 text-secondary border-secondary/20 dark:bg-secondary-900/20 dark:text-secondary-400 dark:border-secondary-800/50" },
}

const typeIcons: Record<string, string> = {
  music: "🎵",
  video: "🎬",
  announcement: "📢",
  live: "🔴",
}

export function PublishSchedule() {
  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="px-8 py-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              配信スケジュール
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              今後の配信予定とプラットフォーム
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-3">
        {schedules.map((schedule) => {
          const statusStyle = statusConfig[schedule.status]
          return (
            <div
              key={schedule.id}
              className="group p-5 rounded-sm border border-border hover:border-primary/40 hover:bg-accent/20 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{typeIcons[schedule.type]}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-2">{schedule.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(schedule.date).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {schedule.time}
                      </div>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="neutral"
                  size="sm"
                  className={statusStyle.className}
                >
                  {statusStyle.label}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 pl-11">
                {schedule.platforms.map((platform, index) => (
                  <Badge
                    key={index}
                    variant="neutral"
                    size="xs"
                    className="text-xs"
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
