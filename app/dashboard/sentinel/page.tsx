"use client"

import DashboardLayout from '@/components/layout/DashboardLayout'
import { KPICard } from "@/components/ui/KPICard"
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"

export default function SentinelPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header with Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Neural Sentinel
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              権利保護と侵害検知システム
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <button className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              新規スキャン
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Large Card 1 with Sparkline */}
          <KPICard
            label="保護中コンテンツ"
            value="1,247"
            change="+12.5%"
            period="先月比"
            trend="up"
            icon={Shield}
            moduleColor="bg-sentinel"
            size="large"
            sparklineData={[820, 890, 950, 1020, 1100, 1180, 1247]}
          />

          {/* Large Card 2 with Sparkline */}
          <KPICard
            label="検出侵害"
            value="23"
            change="-8.3%"
            period="先週比"
            trend="down"
            icon={AlertTriangle}
            moduleColor="bg-muse"
            size="large"
            sparklineData={[45, 38, 42, 35, 30, 25, 23]}
          />
        </div>

        {/* Compact Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KPICard
            label="解決済み"
            value="156"
            change="+24.1%"
            period="今月"
            trend="up"
            icon={CheckCircle}
            moduleColor="bg-echo"
            size="compact"
          />
          <KPICard
            label="成功率"
            value="94.2%"
            change="+2.1%"
            period="全期間"
            trend="up"
            icon={TrendingUp}
            moduleColor="bg-palette"
            size="compact"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
