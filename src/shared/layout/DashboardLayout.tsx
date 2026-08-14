import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [transitionKey, setTransitionKey] = useState(location.pathname);

  useEffect(() => {
    setTransitionKey(location.pathname);
  }, [location.pathname]);

  return (
    <div className="dashboard-shell flex h-screen overflow-hidden font-body relative transition-colors duration-300">
      {/* Global Top Accent Bar — thin gradient */}
      <div className="accent-bar-gradient absolute top-0 left-0 right-0 h-[3px] z-50"></div>
      
      <Sidebar />
      <div className="content-panel flex flex-col flex-1 overflow-hidden mt-[15px] mb-3 mr-3 rounded-2xl transition-colors duration-300">
        <Header />
        <main className="dashboard-main flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 transition-colors duration-300">
          <div key={transitionKey} className="max-w-[1440px] mx-auto animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
