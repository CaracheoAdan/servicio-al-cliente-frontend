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
        return <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 shadow-sm">Abierta</span>;
      case 'in_production':
      case 'in_process':
        return <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold border border-yellow-100 shadow-sm">En Proceso</span>;
      case 'produced':
        return <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold border border-orange-100 shadow-sm">Producido</span>;
      case 'in_delivery':
        return <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-100 shadow-sm">En Tránsito</span>;
      case 'delivered':
        return <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 shadow-sm">Entregada</span>;
      case 'closed':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold border border-gray-200 shadow-sm">Cerrada</span>;
      default:
        return <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-bold border border-gray-100 shadow-sm">{status}</span>;
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
      <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center space-x-4">
          <div className="bg-totebin-50 p-3 rounded-xl">
            <ClipboardList className="w-8 h-8 text-totebin-600" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Listado de Órdenes</h3>
            <p className="text-sm text-gray-500 mt-1">Control visual del avance y estatus en el piso de producción</p>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No. Orden (Key)</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">F. Compromiso</th>
              <th className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-8 py-8 text-center text-sm text-gray-500 font-medium">Cargando órdenes desde el backend...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-8 text-center text-sm text-gray-500 font-medium">No hay órdenes registradas en la base de datos.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{order.key}</div>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-600">{formatDate(order.detail?.scheduledDeliveryDate || order.detail?.scheduled_delivery_date || order.scheduled_delivery_date)}</div>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                    <button 
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="text-gray-400 hover:text-totebin-600 bg-white hover:bg-totebin-50 border border-transparent hover:border-totebin-100 p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"
                      title="Editar Orden"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(order.id)}
                      className="text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 border border-transparent hover:border-red-100 p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"
                      title="Eliminar Orden"
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
