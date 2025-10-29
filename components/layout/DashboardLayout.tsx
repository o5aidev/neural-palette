"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [currentModule, setCurrentModule] = useState("palette")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentModule={currentModule} onModuleChange={setCurrentModule} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
