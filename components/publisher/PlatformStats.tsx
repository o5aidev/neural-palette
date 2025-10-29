"use client"

import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp } from "lucide-react"

const platforms = [
  {
    name: "Spotify",
    icon: "🎵",
    published: 47,
    pending: 3,
    views: "1.2M",
    engagement: "15.2%",
    growth: "+24%",
  },
  {
    name: "YouTube",
    icon: "📺",
    published: 89,
    pending: 5,
    views: "3.8M",
    engagement: "18.7%",
    growth: "+32%",
  },
  {
    name: "Apple Music",
    icon: "🎧",
    published: 45,
    pending: 2,
    views: "890K",
    engagement: "12.4%",
    growth: "+18%",
  },
  {
    name: "SoundCloud",
    icon: "☁️",
    published: 62,
    pending: 4,
    views: "560K",
    engagement: "9.8%",
    growth: "+15%",
  },
]

export function PlatformStats() {
  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="px-8 py-6 border-b border-border">
        <h3 className="text-base font-medium text-foreground flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          プラットフォーム別統計
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          各プラットフォームのパフォーマンス
        </p>
      </div>

      <div className="p-8 space-y-4">
        {platforms.map((platform) => (
          <div
            key={platform.name}
            className="p-5 rounded-sm border border-border hover:border-primary/40 hover:bg-accent/20 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{platform.icon}</span>
                <div>
                  <h4 className="font-medium text-foreground">{platform.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="success" size="xs">
                      {platform.published}件配信中
                    </Badge>
                    {platform.pending > 0 && (
                      <Badge variant="neutral" size="xs">
                        {platform.pending}件予約
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Badge variant="success" size="sm" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {platform.growth}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between py-2 px-3 rounded-sm bg-muted/30">
                <span className="text-muted-foreground">総再生回数:</span>
                <span className="font-medium text-foreground">{platform.views}</span>
              </div>
              <div className="flex justify-between py-2 px-3 rounded-sm bg-muted/30">
                <span className="text-muted-foreground">エンゲージ率:</span>
                <span className="font-medium text-foreground">{platform.engagement}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
