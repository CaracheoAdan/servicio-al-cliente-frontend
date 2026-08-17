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

  let userPermissions: string[] = [];
  try {
    const stored = localStorage.getItem('totebin_user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user?.permissions && typeof user.permissions === 'string') {
        userPermissions = JSON.parse(user.permissions);
      } else if (Array.isArray(user?.permissions)) {
        userPermissions = user.permissions;
      }
    }
  } catch (e) {}

  const isFullScreen = userPermissions.includes('full_screen');

  return (
    <div className="dashboard-shell flex h-screen overflow-hidden font-body relative transition-colors duration-300">
      {/* Global Top Accent Bar — thin gradient */}
      <div className="accent-bar-gradient absolute top-0 left-0 right-0 h-[3px] z-50"></div>
      
      {!isFullScreen && <Sidebar />}
      <div className={`content-panel flex flex-col flex-1 overflow-hidden transition-colors duration-300 ${isFullScreen ? 'm-0 rounded-none' : 'mt-[15px] mb-3 mr-3 rounded-2xl'}`}>
        {!isFullScreen && <Header />}
        <main className={`dashboard-main flex-1 overflow-y-auto transition-colors duration-300 ${isFullScreen ? 'p-2 md:p-4' : 'p-6 md:p-10 lg:p-12'}`}>
          <div key={transitionKey} className="max-w-[1440px] mx-auto animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
