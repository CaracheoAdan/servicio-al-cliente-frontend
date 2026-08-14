import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut } from 'lucide-react'

const routeMeta: Record<string, { breadcrumb: string; title: string; subtitle: string }> = {
  '/orders': { breadcrumb: 'PRODUCCIÓN', title: 'Gestión de Órdenes', subtitle: 'Control visual del avance y estatus en el piso de producción' },
  '/orders/new': { breadcrumb: 'PRODUCCIÓN', title: 'Nueva Orden', subtitle: 'Registra un nuevo pedido en el sistema' },
  '/catalogs': { breadcrumb: 'CATÁLOGOS', title: 'Catálogo de Productos', subtitle: 'Gestiona los productos disponibles para las órdenes' },
  '/reports': { breadcrumb: 'ANÁLISIS', title: 'Gráficas y Estadísticas', subtitle: 'Visualización de indicadores de desempeño' },
  '/master-table': { breadcrumb: 'EXPORTACIÓN', title: 'Exportar Excel', subtitle: 'Tabla maestra con vista consolidada de datos' },
  '/users': { breadcrumb: 'ADMINISTRACIÓN', title: 'Usuarios', subtitle: 'Administra los usuarios del sistema' },
}

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('totebin_token');
    navigate('/login');
  }

  // Match route — handle dynamic segments like /orders/:id
  let meta = routeMeta[location.pathname]
  if (!meta && location.pathname.startsWith('/orders/')) {
    meta = { breadcrumb: 'PRODUCCIÓN · GESTIÓN', title: `Orden No. ${location.pathname.split('/').pop()}`, subtitle: 'Detalle y edición de la orden de producción' }
  }
  if (!meta) {
    meta = { breadcrumb: 'PANEL', title: 'Panel de Control', subtitle: 'Sistema Totebin' }
  }

  return (
    <header className="dashboard-header bg-gradient-to-r from-[#BFDBFE] to-white border-b border-[#DBEAFE] relative shrink-0 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="flex items-center justify-between px-8 py-5 relative z-10">
        <div>
          <span className="header-breadcrumb font-mono text-[11px] uppercase tracking-[0.15em] text-[#2A5D8F] font-bold block mb-1">{meta.breadcrumb}</span>
          <h1 className="header-title text-xl font-display font-extrabold text-[#0F172A] tracking-tight">{meta.title}</h1>
          <p className="header-subtitle text-sm text-[#475569] mt-0.5 font-medium">{meta.subtitle}</p>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLogout}
            className="header-logout-btn bg-transparent border border-[#E2E8F0] hover:border-[#DC2626] text-[#64748B] hover:text-[#DC2626] px-5 py-2.5 rounded-xl font-display font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
          >
            Salir <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
