import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus, Edit2 } from 'lucide-react';

export function OrderListPage() {
  const navigate = useNavigate();

  // Datos simulados para visualizar la UI temporalmente
  const mockOrders = [
    { id: 1, key: 'ORD-2023-001', status: 'open', date: '2023-11-01' },
    { id: 2, key: 'ORD-2023-002', status: 'in_production', date: '2023-11-02' },
    { id: 3, key: 'ORD-2023-003', status: 'in_delivery', date: '2023-11-03' },
    { id: 4, key: 'ORD-2023-004', status: 'delivered', date: '2023-11-04' },
    { id: 5, key: 'ORD-2023-005', status: 'closed', date: '2023-11-05' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">Abierta</span>;
      case 'in_production':
        return <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold border border-yellow-100">En Producción</span>;
      case 'in_delivery':
        return <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-100">En Tránsito</span>;
      case 'delivered':
        return <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">Entregada</span>;
      case 'closed':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold border border-gray-200">Cerrada</span>;
      default:
        return <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-bold border border-gray-100">{status}</span>;
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
            <p className="text-sm text-gray-500 mt-1">Consulta y administra las órdenes de producción.</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/orders/new')}
          className="bg-totebin-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-totebin-700 transition-all duration-200 text-sm font-bold flex items-center"
        >
          <Plus className="w-5 h-5 mr-1" />
          Crear Orden
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Clave (Key)</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">F. Programada</th>
              <th className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{order.key}</div>
                </td>
                <td className="px-8 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-8 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-600">{order.date}</div>
                </td>
                <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="text-gray-400 hover:text-totebin-600 bg-white hover:bg-totebin-50 border border-transparent hover:border-totebin-100 p-2 rounded-lg transition-all shadow-sm flex items-center justify-center ml-auto"
                    title="Editar Orden"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
