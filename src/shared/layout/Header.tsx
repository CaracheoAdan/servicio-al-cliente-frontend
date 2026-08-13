import React from 'react'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('totebin_token');
    navigate('/login');
  }

  return (
    <header className="bg-white h-24 border-b border-[#E3E9E6] flex items-center justify-between px-8 relative shrink-0">
      {/* Top gradient strip */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#15803D] via-[#4ADE80] to-[#15803D]" />
      
      <div>
        <h1 className="text-2xl font-display font-bold text-[#0F1B17]">Panel de Control</h1>
        <div className="flex items-center space-x-2 mt-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#15803D] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#15803D]" />
          </span>
          <span className="font-mono text-xs text-[#9CA8A3]">SISTEMA EN LÍNEA</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={handleLogout}
          className="bg-[#F3F6F4] hover:bg-[#E7ECE9] text-[#0F1B17] px-4 py-2 rounded-xl font-display font-bold text-sm transition-colors"
        >
          Salir
        </button>
      </div>
    </header>
  )
}
