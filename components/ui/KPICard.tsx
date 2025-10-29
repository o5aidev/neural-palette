import { cn } from "@/lib/utils"
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface KPICardProps {
  label: string
  value: string
  change: string
  period: string
  trend: "up" | "down"
  icon: LucideIcon
  moduleColor: string
  size?: "large" | "compact"
  sparklineData?: number[]
}

export function KPICard({
  label,
  value,
  change,
  period,
  trend,
  icon: Icon,
  moduleColor,
  size = "compact",
  sparklineData,
}: KPICardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown
  const isLarge = size === "large"

  const generateSparklinePath = (data: number[]) => {
    if (!data || data.length === 0) return ""
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const width = 100
    const height = 32
    const step = width / (data.length - 1)

    return data
      .map((value, index) => {
        const x = index * step
        const y = height - ((value - min) / range) * height
        return `${index === 0 ? "M" : "L"} ${x} ${y}`
      })
      .join(" ")
  }

  return (
    <div
      className={cn(
        "group relative bg-card border border-border rounded-sm transition-colors duration-200 hover:border-border/60",
        isLarge ? "p-8" : "p-6",
      )}
    >
      <div className="relative space-y-4">
        <div className={cn("w-8 h-8 rounded-sm flex items-center justify-center", moduleColor)}>
          <Icon className="w-4 h-4 text-white" />
        </div>

        <div className="text-xs font-normal text-muted-foreground tracking-wide uppercase">{label}</div>

        <div className={cn("font-serif font-bold text-foreground", isLarge ? "text-5xl" : "text-3xl")}>{value}</div>

        {isLarge && sparklineData && (
          <div className="h-8 pt-2">
            <svg width="100" height="32" className="w-full">
              <path
                d={generateSparklinePath(sparklineData)}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-secondary"
              />
            </svg>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium",
              trend === "up" ? "text-secondary" : "text-muted-foreground",
            )}
          >
            <TrendIcon className="w-3.5 h-3.5" />
            {change}
          </div>
          <span className="text-xs text-muted-foreground/70">{period}</span>
        </div>
      </div>
    </div>
  )
}
