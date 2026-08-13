import React from 'react';
import { useNavigate } from 'react-router-dom';

export function OrderListPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Listado de Órdenes</h3>
          <p className="text-sm text-gray-500">Consulta y administra las órdenes de producción.</p>
        </div>
        <button 
          onClick={() => navigate('/orders/new')}
          className="bg-totebin-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-totebin-700 transition-colors text-sm font-medium"
        >
          + Crear Orden
        </button>
      </div>
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No. Orden</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha Compromiso</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td colSpan={4} className="px-6 py-16 text-center text-sm text-gray-500">
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-2">📋</span>
                <p className="font-medium text-gray-700">Conectando a /api/v1/productionOrders...</p>
                <button 
                  onClick={() => navigate('/orders/demo-id-123')}
                  className="mt-4 text-totebin-600 font-semibold hover:underline bg-totebin-50 px-4 py-2 rounded-md border border-totebin-100"
                >
                  Abrir Demo de Edición de Orden (Test PATCH)
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
