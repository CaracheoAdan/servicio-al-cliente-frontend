import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-shell flex h-screen overflow-hidden font-body relative bg-[#EFF2F7]">
      {/* Global Top Accent Bar — thin gradient */}
      <div className="accent-bar-gradient absolute top-0 left-0 right-0 h-[3px] z-50"></div>
      
      <Sidebar />
      <div className="content-panel flex flex-col flex-1 overflow-hidden mt-[15px] mb-3 mr-3 rounded-2xl bg-[#F8FAFC] shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
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
