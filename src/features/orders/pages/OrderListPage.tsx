import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Edit2, Trash2, Search, X, CheckCircle2, Clock, Inbox, Tag, Truck } from 'lucide-react';
import { orderService } from '../../../shared/api/orderService';
import toast from 'react-hot-toast';
import { api } from '../../../shared/api/axiosInstance';
import { KPICard } from '../../../shared/components/KPICard';
import { SkeletonLoader } from '../../../shared/components/SkeletonLoader';

export function OrderListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getAllCombinedOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error('Error al cargar órdenes desde el servidor.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const [confirmAction, setConfirmAction] = useState<{type: 'delete'|'release', order: any} | null>(null);

  const proceedDelete = async (id: number) => {
    setConfirmAction(null);
    try {
      await api.delete(`/orders/${id}`);
      toast.success('Orden eliminada correctamente.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      fetchOrders();
    } catch (error) {
      toast.error('Error al eliminar la orden.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    }
  };

  const getAdvanceDetails = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return { next: 'in_process', label: 'Iniciar', title: 'Iniciar Producción', msg: '¿Iniciar producción de esta orden?', toast: 'Producción iniciada.', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100' };
      case 'in_process': return { next: 'produced', label: 'Completar', title: 'Completar Producción', msg: '¿Marcar producción como completada?', toast: 'Producción completada.', icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100' };
      case 'produced': return { next: 'in_delivery', label: 'Liberar', title: 'Liberar Camión', msg: '¿Confirmas la salida del transporte para esta orden? Se registrará la hora actual como la hora de salida oficial.', toast: 'Camión liberado. Se ha registrado la hora de salida.', icon: Truck, color: 'text-[#D97706]', bg: 'bg-[#FFFBEB] dark:bg-amber-900/30 hover:bg-[#FEF3C7]' };
      case 'in_delivery': return { next: 'delivered', label: 'Entregar', title: 'Marcar Entregado', msg: '¿Confirmar entrega de esta orden al cliente?', toast: 'Orden marcada como entregada.', icon: CheckCircle2, color: 'text-[#10B981]', bg: 'bg-[#ECFDF5] dark:bg-emerald-900/30 hover:bg-[#D1FAE5]' };
      case 'delivered': return { next: 'closed', label: 'Cerrar', title: 'Cerrar Orden', msg: '¿Cerrar esta orden definitivamente?', toast: 'Orden cerrada exitosamente.', icon: CheckCircle2, color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200' };
      default: return null;
    }
  };

  const proceedAdvanceStatus = async (order: any) => {
    const details = getAdvanceDetails(order.status);
    if (!details) return;
    
    setConfirmAction(null);
    try {
      const payload: any = {
        key: order.key,
        status: details.next,
        scheduledDeliveryDate: order.detail?.scheduledDeliveryDate || order.detail?.scheduled_delivery_date || new Date().toISOString(),
        items: order.items || []
      };
      
      // Preserve shipping date if it exists, or set it if transitioning to in_delivery
      if (details.next === 'in_delivery') {
        payload.shippingDate = new Date().toISOString();
      } else if (order.detail?.shippingDate || order.detail?.shipping_date) {
        payload.shippingDate = order.detail.shippingDate || order.detail.shipping_date;
      }

      await orderService.updateOrder(order.id, payload);
      toast.success(details.toast, {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      fetchOrders();
    } catch (error) {
      toast.error(`Error al actualizar el estado de la orden.`, {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    }
  };

  const handleAdvanceStatus = (order: any) => {
    setConfirmAction({ type: 'advance', order });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] mr-1.5"></span> Abierto
          </span>
        );
      case 'in_production':
      case 'in_process':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#0F172A] bg-[#E2E8F0] border border-[#CBD5E1]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#475569] mr-1.5"></span> En Proceso
          </span>
        );
      case 'produced':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#2A5D8F] bg-[#EFF6FF] border border-[#BFDBFE]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2A5D8F] mr-1.5"></span> Producido
          </span>
        );
      case 'in_delivery':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#D97706] bg-[#FFFBEB] border border-[#FDE68A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mr-1.5"></span> En Transporte
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#2A5D8F] bg-[#EFF6FF] border border-[#BFDBFE]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2A5D8F] mr-1.5"></span> Entregado
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mr-1.5"></span> Cerrado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0]">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = (o.key || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === 'all') return matchesSearch;
    const s = o.status?.toLowerCase();
    if (filterStatus === 'active') return matchesSearch && s !== 'closed' && s !== 'delivered';
    if (filterStatus === 'completed') return matchesSearch && (s === 'closed' || s === 'delivered');
    return matchesSearch;
  });

  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status?.toLowerCase() !== 'closed' && o.status?.toLowerCase() !== 'delivered').length;
  const closedOrders = totalOrders - activeOrders;

  return (
    <div className="bg-white rounded-2xl shadow-card-base border border-[#E2E8F0] min-h-[500px] flex flex-col font-body animate-fade-in-up">
      <div className="p-6 border-b border-[#E2E8F0] flex flex-col md:flex-row justify-between items-center bg-white rounded-t-2xl gap-4">
        
        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-xl font-display font-bold text-sm whitespace-nowrap transition-colors ${filterStatus === 'all' ? 'bg-[#2A5D8F] text-white shadow-[0_3px_0_#1B3D5C]' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'}`}
          >
            Todas
          </button>
          <button 
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-xl font-display font-bold text-sm whitespace-nowrap transition-colors ${filterStatus === 'active' ? 'bg-[#2A5D8F] text-white shadow-[0_3px_0_#1B3D5C]' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'}`}
          >
            En Proceso
          </button>
          <button 
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-xl font-display font-bold text-sm whitespace-nowrap transition-colors ${filterStatus === 'completed' ? 'bg-[#2A5D8F] text-white shadow-[0_3px_0_#1B3D5C]' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'}`}
          >
            Completadas
          </button>
        </div>
        
        {/* Search */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 z-10 w-full lg:w-auto">
          <div>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-[#94A3B8]" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar No. Orden..." 
                className="pl-11 pr-10 py-3.5 border-2 border-[#E2E8F0] rounded-xl text-[#0F172A] font-semibold focus:outline-none focus:border-[#2A5D8F] focus:ring-4 focus:ring-[#2A5D8F]/10 transition-all w-full md:w-64 shadow-sm"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#94A3B8] hover:text-[#DC2626] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="absolute mt-2 font-mono text-xs text-[#2A5D8F] font-semibold">
                Mostrando {filteredOrders.length} de {orders.length} órdenes
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* KPIs Row */}
      {/* KPIs Row */}
      {!loading && (
        <div className="px-8 py-5 border-b border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0F172A] grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPICard 
            title="Total Órdenes" 
            value={totalOrders} 
            icon={<ClipboardList />} 
            iconColorClass="text-[#2A5D8F]"
          />
          <KPICard 
            title="En Proceso" 
            value={activeOrders} 
            icon={<Clock />} 
            iconColorClass="text-[#D97706]"
          />
          <KPICard 
            title="Completadas" 
            value={closedOrders} 
            icon={<CheckCircle2 />} 
            iconColorClass="text-[#10B981]"
          />
        </div>
      )}
      
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-b-2xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <SkeletonLoader type="table" rows={6} />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8">
            <div className="flex flex-col items-center justify-center gap-4 py-20 rounded-2xl border-2 border-dashed border-[#E2E8F0] dark:border-gray-800 bg-[#F8FAFC] dark:bg-gray-800/50">
              <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 shadow-sm border border-[#E2E8F0] dark:border-gray-700">
                <svg className="w-16 h-16 text-[#2A5D8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-[#0F172A] dark:text-white text-lg">Aún no hay órdenes</p>
                <p className="text-sm text-[#64748B] dark:text-gray-400 mt-1 max-w-sm mx-auto">Parece que no tienes órdenes creadas o tu búsqueda no dio resultados. ¡Anímate a crear la primera!</p>
              </div>
              <button
                onClick={() => navigate('/orders/new')}
                className="mt-2 px-6 py-3 rounded-xl font-display font-bold text-sm text-white bg-[#2A5D8F] hover:bg-[#1B3D5C] shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1 transition-all flex items-center"
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Crear Nueva Orden
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-8 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">No. Orden</th>
                  <th className="px-8 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Productos</th>
                  <th className="px-8 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Estatus</th>
                  <th className="px-8 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">F. Entrega</th>
                  <th className="px-8 py-4 text-right text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-gray-800">
                {filteredOrders.map((order) => {
                  let borderClass = 'border-l-4 border-l-transparent';
                  const s = order.status?.toLowerCase();
                  if (s === 'open') borderClass = 'border-l-4 border-l-slate-400';
                  else if (s === 'in_process' || s === 'in_production') borderClass = 'border-l-4 border-l-blue-400';
                  else if (s === 'produced') borderClass = 'border-l-4 border-l-indigo-400';
                  else if (s === 'in_delivery') borderClass = 'border-l-4 border-l-amber-500';
                  else if (s === 'delivered') borderClass = 'border-l-4 border-l-emerald-500';
                  else if (s === 'closed') borderClass = 'border-l-4 border-l-red-500';

                  return (
                  <tr key={order.id} className={`hover:bg-[#EFF6FF] dark:hover:bg-gray-800/50 transition-colors group relative ${borderClass} dark:text-gray-300`}>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-[#94A3B8] mr-2" />
                        <div className="font-mono font-bold text-[#0F172A] text-base">{order.key}</div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-mono text-[#0F172A] font-semibold bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E2E8F0] inline-block">
                        {order.items?.length || 0} prod.
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      {getStatusBadge(order.status?.toLowerCase())}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm font-mono text-[#475569] font-medium">{formatDate(order.detail?.scheduledDeliveryDate || order.detail?.scheduled_delivery_date || order.scheduled_delivery_date)}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium overflow-hidden">
                      <div className="flex justify-end space-x-2 md:translate-x-12 opacity-100 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-300 ease-out">
                        {getAdvanceDetails(order.status) && (
                          <button 
                            onClick={() => handleAdvanceStatus(order)}
                            className={`flex items-center ${getAdvanceDetails(order.status)!.color} ${getAdvanceDetails(order.status)!.bg} px-3 py-2 rounded-lg transition-colors font-display font-bold text-xs`}
                            title={getAdvanceDetails(order.status)!.title}
                          >
                            {React.createElement(getAdvanceDetails(order.status)!.icon, { className: "w-4 h-4 mr-1.5" })}
                            {getAdvanceDetails(order.status)!.label}
                          </button>
                        )}
                        {order.status?.toLowerCase() === 'closed' && (
                          <span 
                            className="flex items-center text-slate-400 bg-slate-50 dark:bg-slate-800/30 px-3 py-2 rounded-lg font-display font-bold text-xs cursor-default"
                            title="Orden Completada"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Completado
                          </span>
                        )}
                        <button 
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="flex items-center text-[#2A5D8F] bg-[#EFF6FF] dark:bg-blue-900/30 hover:bg-[#DBEAFE] dark:hover:bg-blue-900/50 px-3 py-2 rounded-lg transition-colors font-display font-bold text-xs"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4 mr-1.5" /> Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(order)}
                          className="flex items-center text-[#DC2626] bg-[#FEF2F2] dark:bg-red-900/30 hover:bg-[#FEE2E2] dark:hover:bg-red-900/50 px-3 py-2 rounded-lg transition-colors font-display font-bold text-xs"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
            
            <div className="px-8 py-4 border-t border-[#E2E8F0] dark:border-gray-800 bg-[#F8FAFC] dark:bg-gray-800 flex justify-between items-center text-sm font-medium text-[#64748B] dark:text-gray-400">
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#2A5D8F] mr-2"></span>
                Mostrando {filteredOrders.length > 0 ? 1 : 0} - {filteredOrders.length} de {orders.length} órdenes
              </div>
            </div>
          </div>
        )}
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 lg:p-8 font-body border border-[#E2E8F0] animate-fade-in-up">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-2xl flex-shrink-0 ${confirmAction.type === 'delete' ? 'bg-[#FEF2F2] text-[#DC2626]' : getAdvanceDetails(confirmAction.order.status)?.bg + ' ' + getAdvanceDetails(confirmAction.order.status)?.color}`}>
                {confirmAction.type === 'delete' ? <Trash2 className="w-8 h-8" /> : React.createElement(getAdvanceDetails(confirmAction.order.status)!.icon, { className: "w-8 h-8" })}
              </div>
              <div>
                <h3 className="font-display font-bold text-[#0F172A] text-xl">
                  {confirmAction.type === 'delete' ? 'Eliminar Orden' : getAdvanceDetails(confirmAction.order.status)?.title}
                </h3>
                <p className="text-sm font-display font-bold text-[#64748B] mt-1">Orden No. {confirmAction.order.key}</p>
              </div>
            </div>
            
            <p className="text-[#475569] text-base leading-relaxed mb-8">
              {confirmAction.type === 'delete' ? (
                <>¿Estás seguro de eliminar esta orden? Todos sus productos asociados se perderán de la base de datos. <strong className="text-[#DC2626]">Esta acción no se puede deshacer.</strong></>
              ) : (
                <>{getAdvanceDetails(confirmAction.order.status)?.msg}</>
              )}
            </p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmAction(null)}
                className="px-6 py-3 rounded-xl font-display font-bold text-sm bg-white border-2 border-[#E2E8F0] text-[#64748B] hover:border-[#94A3B8] hover:text-[#0F172A] transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if (confirmAction.type === 'delete') proceedDelete(confirmAction.order.id);
                  else proceedAdvanceStatus(confirmAction.order);
                }}
                className={`px-6 py-3 rounded-xl font-display font-bold text-sm text-white transition-all flex items-center ${
                  confirmAction.type === 'delete' ? 'bg-[#DC2626] hover:bg-[#B91C1C] shadow-[0_4px_0_#991B1B] active:shadow-[0_0px_0_#991B1B] active:translate-y-1' : 'bg-[#2A5D8F] hover:bg-[#1E4D73] shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1'
                }`}
              >
                {confirmAction.type === 'delete' ? 'Sí, eliminar orden' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

