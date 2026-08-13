import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus, FileSignature } from 'lucide-react';

export function OrderListPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden font-sans animate-fade-in-up">
      <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center space-x-4">
          <div className="bg-totebin-50 p-3 rounded-xl">
            <ClipboardList className="w-8 h-8 text-totebin-600" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Listado de Órdenes</h3>
            <p className="text-sm text-gray-500 mt-1">Consulta y administra las órdenes de producción reales de la base de datos.</p>
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
      
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50/80">
          <tr>
            <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Clave (Key)</th>
            <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado (Enum)</th>
            <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">F. Programada</th>
            <th className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-50">
          <tr>
            <td colSpan={4} className="px-8 py-24 text-center text-sm text-gray-500">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <FileSignature className="w-10 h-10 text-gray-300" />
                </div>
                <div>
                  <p className="font-semibold text-gray-600 text-lg">Carga de datos dinámica configurada.</p>
                  <p className="text-gray-400 mt-1">Esperando conexión final con PostgreSQL.</p>
                </div>
                <button 
                  onClick={() => navigate('/orders/1')}
                  className="mt-6 text-totebin-600 font-bold hover:text-totebin-700 bg-totebin-50 hover:bg-totebin-100 px-6 py-2.5 rounded-lg border border-totebin-200 transition-colors shadow-sm"
                >
                  Probar interfaz de actualización para la Orden ID: 1
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
