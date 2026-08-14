import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  Plus, ClipboardList, Database, BarChart3, Table, Settings, 
  LogOut, ChevronLeft, ChevronRight, Moon, Sun 
} from 'lucide-react'

export function Sidebar() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleLogout = () => {
    localStorage.removeItem('totebin_token')
    navigate('/login')
  }

  const menuSections = [
    {
      label: 'GENERAL',
      items: [
        { name: 'Registro de Pedidos', path: '/orders/new', icon: Plus },
        { name: 'Gestión de Órdenes', path: '/orders', icon: ClipboardList },
      ],
    },
    {
      label: 'CATÁLOGOS',
      items: [
        { name: 'Catálogo de Productos', path: '/catalogs', icon: Database },
      ],
    },
    {
      label: 'REPORTES Y CAPTURA',
      items: [
        { name: 'Gráficas y Estadísticas', path: '/reports', icon: BarChart3 },
        { name: 'Exportar Excel', path: '/master-table', icon: Table },
      ],
    },
    {
      label: 'ADMINISTRACIÓN',
      items: [
        { name: 'Usuarios', path: '/users', icon: Settings },
      ],
    },
  ]

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-72'} flex-shrink-0 p-3 transition-all duration-300 ease-in-out`}>
      <div className="sidebar-card bg-white border border-[#E2E8F0] rounded-2xl flex flex-col h-full sidebar-float overflow-hidden">
        {/* Top controls: Collapse + Dark Mode */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#2A5D8F] transition-colors"
            title={collapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          {!collapsed && (
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#2A5D8F] transition-colors"
              title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Brand */}
        <div className={`flex items-center border-b border-[#E2E8F0] ${collapsed ? 'px-4 py-4 justify-center' : 'px-6 py-5'}`}>
          {collapsed ? (
            <span className="sidebar-brand font-display font-extrabold text-xl text-[#0F172A]">T<span className="text-[#2A5D8F]">.</span></span>
          ) : (
            <h1 className="sidebar-brand text-2xl font-display font-extrabold text-[#0F172A] tracking-tight">Totebin<span className="text-[#2A5D8F]">.</span></h1>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {menuSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <div className="mb-2 px-3">
                  <span className="sidebar-section-label font-mono text-[10px] text-[#94A3B8] uppercase tracking-[0.15em] font-bold">{section.label}</span>
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.path === '/orders'}
                      className={({ isActive }) =>
                        `sidebar-menu-item flex items-center ${collapsed ? 'justify-center px-3' : 'px-3'} py-3 text-sm font-display font-bold rounded-xl transition-all duration-200 group ${
                          isActive
                            ? 'bg-[#2A5D8F] text-white shadow-card-brand'
                            : 'text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2A5D8F]'
                        }`
                      }
                      title={collapsed ? item.name : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`sidebar-icon-box ${collapsed ? '' : 'mr-3'} p-1.5 rounded-lg transition-colors ${
                            isActive 
                              ? 'bg-white/20' 
                              : 'bg-[#F1F5F9] group-hover:bg-[#DBEAFE] text-[#64748B] group-hover:text-[#2A5D8F]'
                          }`}>
                            <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                          </div>
                          {!collapsed && item.name}
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card */}
        <div className={`p-4 border-t border-[#E2E8F0] ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
          <div className={`sidebar-user-card bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl ${collapsed ? 'p-2' : 'p-3'} flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-9 h-9 rounded-full bg-[#2A5D8F] flex items-center justify-center shrink-0">
              <span className="font-display font-bold text-white text-xs">JA</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="sidebar-user-name font-display font-bold text-[#0F172A] text-sm truncate">Javier A.</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <p className="sidebar-user-role font-mono text-[10px] text-[#64748B] truncate">Súper Administrador</p>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`sidebar-logout-btn mt-2 w-full flex items-center ${collapsed ? 'justify-center' : 'justify-center gap-2'} px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#DC2626] hover:border-[#FECACA] transition-colors font-display font-bold text-xs`}
            title="Salir"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Salir</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
