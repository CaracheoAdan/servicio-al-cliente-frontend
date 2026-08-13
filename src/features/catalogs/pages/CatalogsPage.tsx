import React, { useState } from 'react';

export function CatalogsPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'machines' | 'responsables'>('products');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px] flex flex-col font-sans">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('products')}
            className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'products'
                ? 'border-totebin-500 text-totebin-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab('machines')}
            className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'machines'
                ? 'border-totebin-500 text-totebin-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Máquinas
          </button>
          <button
            onClick={() => setActiveTab('responsables')}
            className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'responsables'
                ? 'border-totebin-500 text-totebin-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Responsables
          </button>
        </nav>
      </div>
      <div className="p-6 flex-1 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            {activeTab === 'products' && 'Catálogo de Productos'}
            {activeTab === 'machines' && 'Catálogo de Máquinas'}
            {activeTab === 'responsables' && 'Directorio de Responsables'}
          </h3>
          <button className="bg-totebin-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-totebin-700 transition-colors text-sm font-medium">
            + Nuevo Registro
          </button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Código / ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-2">📥</span>
                    <p className="font-medium text-gray-700">La integración con la API está lista para conectarse a tu backend.</p>
                    <p className="text-xs text-gray-400 mt-1">Hará la petición GET a /api/v1/{activeTab}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
