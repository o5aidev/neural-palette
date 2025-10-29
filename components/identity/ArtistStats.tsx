"use client"

import { Badge } from "@/components/ui/Badge"
import { TrendingUp, Music, Users, Award } from "lucide-react"

const stats = [
  {
    category: "音楽活動",
    icon: Music,
    items: [
      { label: "リリース楽曲数", value: "47", trend: "+12" },
      { label: "コラボレーション", value: "23", trend: "+5" },
      { label: "ライブパフォーマンス", value: "89", trend: "+18" },
    ],
  },
  {
    category: "ファンエンゲージメント",
    icon: Users,
    items: [
      { label: "総フォロワー数", value: "236K", trend: "+18K" },
      { label: "月間再生回数", value: "1.2M", trend: "+245K" },
      { label: "平均エンゲージ率", value: "12.4%", trend: "+2.1%" },
    ],
  },
  {
    category: "受賞・評価",
    icon: Award,
    items: [
      { label: "音楽賞受賞", value: "8", trend: "+3" },
      { label: "チャートイン", value: "15", trend: "+4" },
      { label: "プレイリスト追加", value: "342", trend: "+67" },
    ],
  },
]

export function ArtistStats() {
  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="px-8 py-6 border-b border-border">
        <h3 className="text-base font-medium text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          アーティスト統計
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          活動実績とエンゲージメント指標
        </p>
      </div>

      <div className="p-8 space-y-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.category}
              className="p-5 rounded-sm border border-border hover:border-primary/40 hover:bg-accent/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-sm bg-primary/10">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-medium text-foreground">{stat.category}</h4>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {stat.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-sm bg-muted/30"
                  >
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-foreground">{item.value}</span>
                      <Badge variant="success" size="xs" className="text-xs">
                        {item.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
