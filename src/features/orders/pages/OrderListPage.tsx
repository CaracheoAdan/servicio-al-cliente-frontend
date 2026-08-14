import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Edit2, Trash2, Search, X, CheckCircle2, Clock, Inbox, Tag } from 'lucide-react';
import { orderService } from '../../../shared/api/orderService';
import toast from 'react-hot-toast';
import { api } from '../../../shared/api/axiosInstance';

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

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta orden? Todos sus productos asociados se perderán.')) {
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
    }
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
    if (filterStatus === 'active') return matchesSearch && o.status !== 'closed' && o.status !== 'delivered';
    if (filterStatus === 'completed') return matchesSearch && (o.status === 'closed' || o.status === 'delivered');
    return matchesSearch;
  });

  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status !== 'closed' && o.status !== 'delivered').length;
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
      {!loading && (
        <div className="px-8 py-5 border-b border-[#E2E8F0] bg-white grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3.5">
            <div className="p-2 rounded-xl bg-white border border-[#E2E8F0]">
              <ClipboardList className="w-5 h-5 text-[#2A5D8F]" />
            </div>
            <div>
              <div className="text-[10px] font-display font-bold text-[#64748B] uppercase tracking-wide">Total Órdenes</div>
              <div className="font-mono font-bold text-lg text-[#0F172A] tabular-nums">{totalOrders}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3.5">
            <div className="p-2 rounded-xl bg-white border border-[#E2E8F0]">
              <Clock className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <div className="text-[10px] font-display font-bold text-[#64748B] uppercase tracking-wide">En Proceso</div>
              <div className="font-mono font-bold text-lg text-[#0F172A] tabular-nums">{activeOrders}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3.5">
            <div className="p-2 rounded-xl bg-white border border-[#E2E8F0]">
              <CheckCircle2 className="w-5 h-5 text-[#2A5D8F]" />
            </div>
            <div>
              <div className="text-[10px] font-display font-bold text-[#64748B] uppercase tracking-wide">Completadas</div>
              <div className="font-mono font-bold text-lg text-[#0F172A] tabular-nums">{closedOrders}</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 bg-white rounded-b-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white">
            <div className="text-center">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-[#2A5D8F] border-t-transparent rounded-full mb-4"></div>
              <p className="font-display font-bold text-[#0F172A]">Cargando órdenes...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-xl border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
                <Inbox className="w-8 h-8 text-[#94A3B8]" />
              </div>
              <p className="font-display font-bold text-[#0F172A]">No se encontraron órdenes</p>
              <p className="text-sm text-[#64748B]">Prueba con otra búsqueda o crea una nueva orden.</p>
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
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#EFF6FF] transition-colors group">
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
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm font-mono text-[#475569] font-medium">{formatDate(order.detail?.scheduledDeliveryDate || order.detail?.scheduled_delivery_date || order.scheduled_delivery_date)}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                      <button 
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="flex items-center text-[#2A5D8F] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-3 py-2 rounded-lg transition-colors font-display font-bold text-xs"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4 mr-1.5" /> Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="flex items-center text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-3 py-2 rounded-lg transition-colors font-display font-bold text-xs"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

