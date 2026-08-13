import React, { useState } from 'react';
import { Settings, Plus } from 'lucide-react';
export function UsersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  return (
    <div className="bg-white rounded-[28px] shadow-card-base border border-[#E3E9E6] min-h-[500px] flex flex-col font-body animate-fade-in-up">
      <div className="p-8 border-b border-[#E3E9E6] flex justify-between items-center bg-white rounded-t-[28px] relative overflow-hidden">
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-[#F0FDF4] p-3 rounded-2xl border border-[#E3E9E6]">
            <Settings className="w-8 h-8 text-[#15803D]" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-extrabold text-[#0F1B17] tracking-tight">Administración</h3>
            <p className="text-sm text-[#6B7B76] mt-1 font-body">Gestión de usuarios y roles del sistema Totebin.</p>
          </div>
        </div>
        <div className="z-10">
          <button className="bg-[#15803D] hover:bg-[#116932] disabled:opacity-60 text-white px-6 py-3.5 rounded-2xl font-display font-bold shadow-btn-3d transition-all flex items-center gap-2 text-sm">
            <Plus className="w-5 h-5" /> Nuevo {activeTab === 'users' ? 'Usuario' : 'Rol'}
          </button>
        </div>
      </div>

      <div className="border-b border-[#E3E9E6] bg-[#F7FAF8]">
        <nav className="flex px-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-6 font-display font-bold text-sm transition-all border-b-2 ${
              activeTab === 'users' ? 'border-[#15803D] text-[#15803D]' : 'border-transparent text-[#6B7B76] hover:text-[#0F1B17] hover:bg-[#E3E9E6]/30'
            }`}
          >
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-4 px-6 font-display font-bold text-sm transition-all border-b-2 ${
              activeTab === 'roles' ? 'border-[#15803D] text-[#15803D]' : 'border-transparent text-[#6B7B76] hover:text-[#0F1B17] hover:bg-[#E3E9E6]/30'
            }`}
          >
            Roles y Permisos
          </button>
        </nav>
      </div>
      
      <div className="flex-1 bg-white rounded-b-[28px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7FAF8] border-b border-[#E3E9E6]">
                <th className="px-8 py-5 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">
                  {activeTab === 'users' ? 'Nombre / Correo' : 'Nombre del Rol'}
                </th>
                <th className="px-8 py-5 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">
                  {activeTab === 'users' ? 'Rol' : 'Permisos (Modulos)'}
                </th>
                <th className="px-8 py-5 text-right text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF1EF]">
              <tr>
                <td colSpan={3} className="px-8 py-12 text-center text-sm font-display font-bold text-[#0F1B17]">
                  Conectando a /api/v1/{activeTab}...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
