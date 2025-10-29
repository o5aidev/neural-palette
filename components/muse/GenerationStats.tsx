"use client"

import { Badge } from "@/components/ui/Badge"
import { BarChart3, TrendingUp } from "lucide-react"

const stats = [
  {
    type: "melody",
    label: "メロディ生成",
    icon: "🎵",
    count: 847,
    percentage: 42,
    avgTokens: 1250,
    avgConfidence: 92,
    trend: "+15%",
  },
  {
    type: "lyrics",
    label: "歌詞生成",
    icon: "📝",
    count: 623,
    percentage: 31,
    avgTokens: 980,
    avgConfidence: 88,
    trend: "+22%",
  },
  {
    type: "chord",
    label: "コード進行",
    icon: "🎹",
    count: 312,
    percentage: 15,
    avgTokens: 720,
    avgConfidence: 95,
    trend: "+8%",
  },
  {
    type: "artwork",
    label: "アートワーク",
    icon: "🎨",
    count: 218,
    percentage: 12,
    avgTokens: 1850,
    avgConfidence: 90,
    trend: "+18%",
  },
]

export function GenerationStats() {
  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-8 py-6 border-b border-border">
        <div>
          <h3 className="text-base font-medium text-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            生成タイプ別統計
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            各タイプの生成実績とパフォーマンス
          </p>
        </div>
      </div>

      <div className="p-8 space-y-4">
        {stats.map((stat) => (
          <div
            key={stat.type}
            className="group p-5 rounded-sm border border-border hover:border-primary/40 hover:bg-accent/20 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <h4 className="font-medium text-foreground">{stat.label}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="neutral" size="xs">
                      {stat.count.toLocaleString()}回
                    </Badge>
                    <Badge variant="success" size="xs" className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{stat.percentage}%</div>
                <div className="text-xs text-muted-foreground">割合</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${stat.percentage}%` }}
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">平均トークン:</span>
                <span className="font-medium text-foreground">{stat.avgTokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">平均信頼度:</span>
                <span className="font-medium text-foreground">{stat.avgConfidence}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
