import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F3F6F4] overflow-hidden font-body text-[#0F1B17] relative">
      <Sidebar />
      {/* Decorative vertical divider */}
      <div className="w-[3px] bg-gradient-to-b from-[#15803D] via-[#4ADE80] to-[#15803D] hidden md:block" />
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
