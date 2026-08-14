import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0F172A] overflow-hidden font-body text-[#0F172A] relative pt-[4px]">
      {/* Global Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#2A5D8F] z-50"></div>
      
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <Header />
        <main className="dashboard-main flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
