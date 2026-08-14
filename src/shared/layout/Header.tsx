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
    <header className="dashboard-header bg-white border-b border-[#E2E8F0] relative shrink-0">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#2A5D8F] via-[#5BA3D9] to-[#2A5D8F]" />
      
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <span className="header-breadcrumb font-mono text-[11px] uppercase tracking-[0.15em] text-[#2A5D8F] font-bold block mb-1">{meta.breadcrumb}</span>
          <h1 className="header-title text-xl font-display font-extrabold text-[#0F172A] tracking-tight">{meta.title}</h1>
          <p className="header-subtitle text-sm text-[#64748B] mt-0.5 font-medium">{meta.subtitle}</p>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLogout}
            className="header-logout-btn bg-[#F1F5F9] hover:bg-[#FEF2F2] text-[#475569] hover:text-[#DC2626] px-4 py-2.5 rounded-lg font-display font-bold text-sm transition-colors flex items-center gap-2"
          >
            Salir <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
