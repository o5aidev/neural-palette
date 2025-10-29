"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { ArrowRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  {
    id: 1,
    name: "イラスト・アート",
    types: ["デジタルアート", "水彩画", "油彩", "スケッチ"],
    count: 124,
    aiGeneratedCount: 18,
    active: true,
    growth: "+15.2%",
  },
  {
    id: 2,
    name: "3Dモデル・造形",
    types: ["キャラクター", "背景", "小物", "建築"],
    count: 56,
    aiGeneratedCount: 12,
    active: true,
    growth: "+8.5%",
  },
  {
    id: 3,
    name: "音楽・サウンド",
    types: ["オリジナル曲", "BGM", "効果音", "ボイス"],
    count: 42,
    aiGeneratedCount: 3,
    active: true,
    growth: "+22.1%",
  },
  {
    id: 4,
    name: "動画・アニメーション",
    types: ["モーション", "VFX", "タイムラプス"],
    count: 26,
    aiGeneratedCount: 3,
    active: false,
    growth: "+5.3%",
  },
]

const getTypeColors = (index: number) => {
  const colors = [
    {
      bg: "bg-purple-50 dark:bg-purple-950/20",
      text: "text-purple-700 dark:text-purple-400/80",
      border: "border-purple-200/50 dark:border-purple-900/30",
    },
    {
      bg: "bg-cyan-50 dark:bg-cyan-950/20",
      text: "text-cyan-700 dark:text-cyan-400/80",
      border: "border-cyan-200/50 dark:border-cyan-900/30",
    },
    {
      bg: "bg-pink-50 dark:bg-pink-950/20",
      text: "text-pink-700 dark:text-pink-400/80",
      border: "border-pink-200/50 dark:border-pink-900/30",
    },
    {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      text: "text-blue-700 dark:text-blue-400/80",
      border: "border-blue-200/50 dark:border-blue-900/30",
    },
  ]
  return colors[index % colors.length]
}

export function CategoryStats() {
  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-8 py-6 border-b border-border">
        <h3 className="text-base font-medium text-foreground">カテゴリ別統計</h3>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs font-normal">
          すべて表示
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>

      <div className="p-8 space-y-5">
        {categories.map((category) => {
          const aiPercentage = ((category.aiGeneratedCount / category.count) * 100).toFixed(1)
          return (
            <div
              key={category.id}
              className="group p-5 rounded-sm border border-border bg-background hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-sm font-medium text-foreground leading-relaxed">{category.name}</h4>
                    <Badge className="text-xs font-normal rounded-sm bg-primary/5 text-primary border border-primary/10">
                      {category.count}件
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {category.types.map((type, index) => {
                      const colors = getTypeColors(index)
                      return (
                        <Badge
                          key={type}
                          variant="outline"
                          className={cn("text-xs font-normal rounded-sm border", colors.bg, colors.text, colors.border)}
                        >
                          {type}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <Badge
                    className={cn(
                      "text-xs font-normal rounded-sm border",
                      category.active
                        ? "bg-secondary/10 text-secondary border-secondary/20"
                        : "bg-muted text-muted-foreground border-border",
                    )}
                  >
                    {category.active ? "表示中" : "非表示"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    AI生成: {aiPercentage}% ({category.aiGeneratedCount}件)
                  </span>
                </div>
                <span className="text-xs text-secondary font-medium">{category.growth}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
