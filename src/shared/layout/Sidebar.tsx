import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItemClass = ({ isActive }: { isActive: boolean }) => 
    `p-2 rounded cursor-pointer flex items-center space-x-3 transition-colors font-medium ${
      isActive ? 'bg-totebin-800 text-white' : 'hover:bg-totebin-800 text-gray-300 hover:text-white'
    }`

  return (
    <div className={`bg-totebin-900 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col min-h-screen shrink-0 shadow-lg z-10`}>
      <div className="flex items-center justify-between p-4 border-b border-totebin-800 h-16 shrink-0">
        {!isCollapsed && (
          <div className="flex items-center space-x-2 font-extrabold text-2xl tracking-tight">
            <div className="h-8 w-8 bg-white rounded flex items-center justify-center overflow-hidden">
               <img src="/src/assets/logo.png" alt="Totebin Logo" className="w-full h-full object-cover" />
            </div>
            <span>Totebin</span>
          </div>
        )}
        {isCollapsed && (
          <div className="h-8 w-8 mx-auto bg-white rounded flex items-center justify-center overflow-hidden">
             <img src="/src/assets/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <NavLink to="/" className={navItemClass}>
          <span className="w-6 text-center text-lg">📋</span>
          {!isCollapsed && <span>Órdenes</span>}
        </NavLink>
        <NavLink to="/catalogs" className={navItemClass}>
          <span className="w-6 text-center text-lg">📁</span>
          {!isCollapsed && <span>Catálogos</span>}
        </NavLink>
        <NavLink to="/reports" className={navItemClass}>
          <span className="w-6 text-center text-lg">📊</span>
          {!isCollapsed && <span>Reportes</span>}
        </NavLink>
        <NavLink to="/users" className={navItemClass}>
          <span className="w-6 text-center text-lg">👥</span>
          {!isCollapsed && <span>Usuarios</span>}
        </NavLink>
      </nav>
      <div className="p-4 border-t border-totebin-800">
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full p-2 bg-totebin-800 rounded hover:bg-totebin-700 text-sm font-semibold transition-colors">
          {isCollapsed ? '>>' : 'Colapsar'}
        </button>
      </div>
    </div>
  )
}
