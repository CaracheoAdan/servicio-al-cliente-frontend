import React, { useState } from 'react'

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={`bg-totebin-900 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col min-h-screen`}>
      <div className="flex items-center justify-between p-4 border-b border-totebin-800 h-16">
        {!isCollapsed && (
          <div className="flex items-center space-x-2 font-bold text-xl">
            <img src="/src/assets/logo.png" alt="Totebin Logo" className="h-8 w-8 bg-white rounded overflow-hidden" />
            <span>Totebin</span>
          </div>
        )}
        {isCollapsed && (
          <img src="/src/assets/logo.png" alt="Logo" className="h-8 w-8 mx-auto bg-white rounded overflow-hidden" />
        )}
      </div>
      <nav className="flex-1 p-4 space-y-2 font-medium">
        <div className="p-2 rounded hover:bg-totebin-800 cursor-pointer flex items-center space-x-3">
          <span className="w-5 text-center">📋</span>
          {!isCollapsed && <span>Órdenes</span>}
        </div>
        <div className="p-2 rounded hover:bg-totebin-800 cursor-pointer flex items-center space-x-3">
          <span className="w-5 text-center">📁</span>
          {!isCollapsed && <span>Catálogos</span>}
        </div>
        <div className="p-2 rounded hover:bg-totebin-800 cursor-pointer flex items-center space-x-3">
          <span className="w-5 text-center">📊</span>
          {!isCollapsed && <span>Reportes</span>}
        </div>
        <div className="p-2 rounded hover:bg-totebin-800 cursor-pointer flex items-center space-x-3">
          <span className="w-5 text-center">👥</span>
          {!isCollapsed && <span>Usuarios</span>}
        </div>
      </nav>
      <div className="p-4 border-t border-totebin-800">
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full p-2 bg-totebin-800 rounded hover:bg-totebin-700 text-sm font-semibold">
          {isCollapsed ? '>>' : 'Colapsar'}
        </button>
      </div>
    </div>
  )
}
