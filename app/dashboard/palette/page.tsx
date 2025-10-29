"use client"

import DashboardLayout from '@/components/layout/DashboardLayout'
import { KPICard } from "@/components/ui/KPICard"
import { ContentList } from "@/components/palette/ContentList"
import { CategoryStats } from "@/components/palette/CategoryStats"
import { Palette, Sparkles, Users, Shield } from 'lucide-react'

export default function PalettePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Large Cards with Sparkline - 2x2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <KPICard
            label="総コンテンツ"
            value="248"
            change="+12.5%"
            period="先月比"
            trend="up"
            icon={Palette}
            moduleColor="bg-palette"
            size="large"
            sparklineData={[210, 220, 225, 230, 235, 242, 248]}
          />

          <KPICard
            label="AI生成数"
            value="36"
            change="+15.6%"
            period="先週比"
            trend="up"
            icon={Sparkles}
            moduleColor="bg-muse"
            size="large"
            sparklineData={[28, 30, 32, 33, 34, 35, 36]}
          />
        </div>

        {/* Compact Cards Row - 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KPICard
            label="ファン応答率"
            value="98%"
            change="+2.1%"
            period="24h"
            trend="up"
            icon={Users}
            moduleColor="bg-echo"
            size="compact"
          />
          <KPICard
            label="侵害検出"
            value="0"
            change="±0"
            period="監視中"
            trend="down"
            icon={Shield}
            moduleColor="bg-sentinel"
            size="compact"
          />
        </div>

        {/* Content List */}
        <ContentList />

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryStats />
        </div>
      </div>
    </DashboardLayout>
  )
}
