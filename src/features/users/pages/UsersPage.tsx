import React, { useState } from 'react';

export function UsersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Administración</h2>
        <p className="text-gray-600">Gestión de usuarios y roles del sistema Totebin.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px] flex flex-col">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('users')}
              className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users' ? 'border-totebin-500 text-totebin-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'roles' ? 'border-totebin-500 text-totebin-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Roles y Permisos
            </button>
          </nav>
        </div>
        
        <div className="p-6 flex-1 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              {activeTab === 'users' ? 'Gestión de Usuarios' : 'Gestión de Roles'}
            </h3>
            <button className="bg-totebin-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-totebin-700 transition-colors text-sm font-medium">
              + Nuevo {activeTab === 'users' ? 'Usuario' : 'Rol'}
            </button>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {activeTab === 'users' ? 'Nombre / Correo' : 'Nombre del Rol'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {activeTab === 'users' ? 'Rol' : 'Permisos (Modulos)'}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500">
                    <p className="font-medium text-gray-700">Conectando a /api/v1/{activeTab}...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
