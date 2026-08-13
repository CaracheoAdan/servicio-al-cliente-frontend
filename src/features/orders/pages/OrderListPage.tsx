import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus, Edit2, Trash2 } from 'lucide-react';
import { orderService } from '../../../shared/api/orderService';
import toast from 'react-hot-toast';
import { api } from '../../../shared/api/axiosInstance';

export function OrderListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        fetchOrders(); // Recargar lista
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
        return <span className="px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#0F1B17] bg-[#E3E9E6]">Abierto</span>;
      case 'in_production':
      case 'in_process':
        return <span className="px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#0F1B17] bg-[#E3E9E6]">En Proceso</span>;
      case 'produced':
        return <span className="px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#15803D] bg-[#F0FDF4]">Producido</span>;
      case 'in_delivery':
        return <span className="px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#D97706] bg-[#FFFBEB]">En Transporte</span>;
      case 'delivered':
        return <span className="px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#15803D] bg-[#F0FDF4]">Entregado</span>;
      case 'closed':
        return <span className="px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#DC2626] bg-[#FEF2F2]">Cerrado</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#0F1B17] bg-[#E3E9E6]">{status}</span>;
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

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden font-sans animate-fade-in-up">
      <div className="p-8 border-b border-[#E3E9E6] flex justify-between items-center bg-white rounded-t-[28px] relative overflow-hidden">
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-[#F0FDF4] p-3 rounded-2xl border border-[#E3E9E6]">
            <ClipboardList className="w-8 h-8 text-[#15803D]" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-extrabold text-[#0F1B17] tracking-tight">Listado de Órdenes</h3>
            <p className="text-sm text-[#6B7B76] mt-1 font-body">Control visual del avance y estatus en el piso de producción</p>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-b-[28px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7FAF8] border-b border-[#E3E9E6]">
              <th className="px-8 py-5 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">No. Orden</th>
              <th className="px-8 py-5 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Productos</th>
              <th className="px-8 py-5 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Estatus</th>
              <th className="px-8 py-5 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">F. Entrega</th>
              <th className="px-8 py-5 text-right text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDF1EF]">
            {orders.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#E3E9E6] flex items-center justify-center mb-4 bg-[#F7FAF8]">
                      <ClipboardList className="w-8 h-8 text-[#9CA8A3]" />
                    </div>
                    <p className="font-display font-bold text-[#0F1B17]">No hay órdenes activas</p>
                    <p className="text-[#6B7B76] text-sm mt-1">Las órdenes creadas aparecerán aquí.</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F0FDF4] transition-colors group">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="font-mono font-bold text-[#0F1B17] text-base">{order.key}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-body text-[#4B5A5D]">
                      {order.items?.length || 0} {order.items?.length === 1 ? 'producto' : 'productos'}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="text-sm font-mono text-[#4B5A5D]">{formatDate(order.detail?.scheduledDeliveryDate || order.detail?.scheduled_delivery_date || order.scheduled_delivery_date)}</div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                    <button 
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="text-[#6B7B76] hover:text-[#15803D] bg-[#F3F6F4] hover:bg-[#E3E9E6] p-2 rounded-xl transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(order.id)}
                      className="text-[#6B7B76] hover:text-[#DC2626] bg-[#F3F6F4] hover:bg-[#FEF2F2] p-2 rounded-xl transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
