import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Database, BarChart3, Settings, LogOut, Table, Plus } from 'lucide-react'

export function Sidebar() {
  const menuItems = [
    { name: 'Registro de Pedidos', path: '/orders/new', icon: Plus },
    { name: 'Gestión de Órdenes', path: '/orders', icon: ClipboardList },
    { name: 'Catálogo de Productos', path: '/catalogs', icon: Database },
    { name: 'Gráficas y Estadísticas', path: '/reports', icon: BarChart3 },
    { name: 'Exportar Excel', path: '/master-table', icon: Table },
    { name: 'Usuarios', path: '/users', icon: Settings },
  ]

  return (
    <aside className="w-72 bg-white border-r border-[#E3E9E6] flex-shrink-0 flex flex-col font-body relative overflow-hidden z-20">
      {/* Decorative Blob */}
      <div className="absolute -top-20 -left-10 w-48 h-48 rounded-full bg-[#15803D]/[0.05] blur-3xl pointer-events-none blob-breathe" />
      
      <div className="h-24 flex items-center px-8 border-b border-[#E3E9E6] relative z-10">
        <h1 className="text-3xl font-display font-extrabold text-[#0F1B17] tracking-tight">Totebin<span className="text-[#15803D]">.</span></h1>
      </div>
      
      <nav className="flex-1 p-5 space-y-2 relative z-10 overflow-y-auto">
        <div className="mb-4 mt-2 px-3">
          <span className="font-mono text-xs text-[#9CA8A3] uppercase tracking-widest font-bold">Principal</span>
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/orders'}
              className={({ isActive }) =>
                `flex items-center px-4 py-3.5 text-sm font-display font-bold rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#15803D] to-[#1A9448] text-white shadow-card-green'
                    : 'text-[#4B5A5D] hover:bg-[#F0FDF4] hover:text-[#15803D]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`mr-4 p-1.5 rounded-xl transition-colors ${isActive ? 'bg-white/20' : 'bg-[#F3F6F4] group-hover:bg-[#E3E9E6] text-[#6B7B76] group-hover:text-[#15803D]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {item.name}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-[#E3E9E6] relative z-10">
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#15803D] to-[#4ADE80] flex items-center justify-center shadow-[0_0_15px_rgba(21,128,61,0.3)]">
            <span className="font-display font-bold text-white text-sm">JA</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-[#0F1B17] text-sm truncate">Javier A.</p>
            <p className="font-mono text-xs text-[#6B7B76] truncate">Admin</p>
          </div>
          <button className="text-[#9CA8A3] hover:text-[#DC2626] transition-colors p-2 rounded-xl hover:bg-[#FEF2F2]">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
