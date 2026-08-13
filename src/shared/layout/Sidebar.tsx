import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Database, BarChart3, Settings, LogOut, Table, Plus } from 'lucide-react'

export function Sidebar() {
  const menuItems = [
    { name: 'Registro de Pedidos', path: '/orders/new', icon: <Plus className="w-5 h-5 mr-3" /> },
    { name: 'Gestión de Órdenes', path: '/orders', icon: <ClipboardList className="w-5 h-5 mr-3" /> },
    { name: 'Catálogo de Productos', path: '/catalogs', icon: <Database className="w-5 h-5 mr-3" /> },
    { name: 'Gráficas y Estadísticas', path: '/reports', icon: <BarChart3 className="w-5 h-5 mr-3" /> },
    { name: 'Exportar Excel (Tabla Maestra)', path: '/master-table', icon: <Table className="w-5 h-5 mr-3" /> },
    { name: 'Usuarios y Permisos', path: '/users', icon: <Settings className="w-5 h-5 mr-3" /> },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col font-sans">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <h1 className="text-2xl font-extrabold text-totebin-700 tracking-tight">Totebin</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-totebin-50 text-totebin-600 shadow-[0_0_15px_rgba(22,163,74,0.15)] scale-[1.02]'
                  : 'text-gray-500 hover:bg-totebin-50 hover:text-totebin-600 hover:shadow-[0_0_15px_rgba(22,163,74,0.2)] hover:scale-[1.02]'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-500 font-medium">Versión 1.0.0</p>
          <p className="text-[10px] text-gray-400 mt-1">Conectado a Localhost</p>
        </div>
      </div>
    </aside>
  )
}
