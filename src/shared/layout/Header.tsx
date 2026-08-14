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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getTurn = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return 'Turno Matutino';
    if (hour >= 14 && hour < 22) return 'Turno Vespertino';
    return 'Turno Nocturno';
  };

  return (
    <header className="dashboard-header bg-white border-b border-[#E2E8F0] relative shrink-0 transition-colors duration-300">
      
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="header-breadcrumb font-mono text-[11px] uppercase tracking-[0.15em] text-[#2A5D8F] font-bold cursor-pointer hover:text-[#5BA3D9] transition-colors">{getGreeting()}, Javier — {getTurn()}</span>
            <span className="text-[#E2E8F0] dark:text-[#3F3F46] text-[10px]">|</span>
            <span className="header-breadcrumb font-mono text-[11px] uppercase tracking-[0.15em] text-[#64748B] font-medium">{meta.breadcrumb}</span>
          </div>
          <h1 className="header-title text-xl font-display font-extrabold text-[#0F172A] tracking-tight">{meta.title}</h1>
          <p className="header-subtitle text-sm text-[#64748B] mt-0.5 font-medium">{meta.subtitle}</p>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] dark:text-[#A1A1AA]">Progreso de Turno</span>
              <span className="text-[10px] font-bold text-[#2A5D8F] dark:text-[#5BA3D9]">75%</span>
            </div>
            <div className="w-32 h-1.5 bg-[#EFF2F7] dark:bg-[#27272A] rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-[#1E4D73] to-[#5BA3D9] rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-[#E2E8F0] dark:bg-[#3F3F46]"></div>

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
