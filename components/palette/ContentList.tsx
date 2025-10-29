"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { ArrowRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const contents = [
  {
    id: 1,
    title: "夕焼けの街並み",
    category: "イラスト",
    type: "illustration",
    status: "published",
    aiGenerated: false,
    date: "2024-01-15 14:32",
  },
  {
    id: 2,
    title: "未来都市のコンセプトアート",
    category: "3Dモデル",
    type: "model",
    status: "published",
    aiGenerated: true,
    date: "2024-01-15 10:15",
  },
  {
    id: 3,
    title: "オリジナル楽曲 - 星の記憶",
    category: "音楽",
    type: "music",
    status: "draft",
    aiGenerated: false,
    date: "2024-01-14 18:45",
  },
  {
    id: 4,
    title: "タイムラプス動画 - 桜の開花",
    category: "動画",
    type: "video",
    status: "published",
    aiGenerated: false,
    date: "2024-01-14 09:20",
  },
  {
    id: 5,
    title: "AIアシスト - 抽象画コレクション",
    category: "イラスト",
    type: "illustration",
    status: "published",
    aiGenerated: true,
    date: "2024-01-13 16:55",
  },
]

const categoryConfig = {
  illustration: {
    label: "イラスト",
    className:
      "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50",
    borderColor: "border-l-[3px] border-l-purple-400/60 dark:border-l-purple-500/50",
  },
  model: {
    label: "3Dモデル",
    className:
      "bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-900/50",
    borderColor: "border-l-[3px] border-l-cyan-400/60 dark:border-l-cyan-500/50",
  },
  music: {
    label: "音楽",
    className:
      "bg-pink-50 text-pink-700 border border-pink-200 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-900/50",
    borderColor: "border-l-[3px] border-l-pink-400/60 dark:border-l-pink-500/50",
  },
  video: {
    label: "動画",
    className:
      "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
    borderColor: "border-l-[3px] border-l-blue-400/60 dark:border-l-blue-500/50",
  },
}

const statusConfig = {
  published: { label: "公開中", className: "bg-secondary/10 text-secondary border border-secondary/20" },
  draft: { label: "下書き", className: "bg-muted text-muted-foreground border border-border" },
}

export function ContentList() {
  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-8 py-6 border-b border-border">
        <h3 className="text-base font-medium text-foreground">最近のコンテンツ</h3>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs font-normal">
          すべて表示
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>

      <div className="divide-y divide-dashed divide-border/60">
        {contents.map((content) => (
          <div
            key={content.id}
            className={cn(
              "group px-8 py-6 hover:bg-accent/30 transition-colors duration-200",
              categoryConfig[content.type as keyof typeof categoryConfig].borderColor,
            )}
          >
            <div className="flex items-center gap-6">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-foreground leading-relaxed">{content.title}</div>
                  {content.aiGenerated && (
                    <Badge className="text-[10px] font-normal rounded-sm bg-muse/10 text-muse border border-muse/20">
                      AI生成
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground leading-relaxed">
                  <span>{content.category}</span>
                  <span className="text-border">•</span>
                  <span>{content.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  className={cn(
                    "text-xs font-normal rounded-sm",
                    statusConfig[content.status as keyof typeof statusConfig].className,
                  )}
                >
                  {statusConfig[content.status as keyof typeof statusConfig].label}
                </Badge>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
