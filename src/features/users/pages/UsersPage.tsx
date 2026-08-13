import React, { useState } from 'react';
import { Settings, Plus, Inbox } from 'lucide-react';

export function UsersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  return (
    <div className="bg-white rounded-[28px] shadow-card-base border border-[#E3E9E6] min-h-[500px] flex flex-col font-body animate-fade-in-up">
      <div className="p-8 border-b border-[#E3E9E6] flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white rounded-t-[28px] relative overflow-hidden gap-6">
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-[#F0FDF4] p-3 rounded-xl border border-[#E3E9E6]">
            <Settings className="w-8 h-8 text-[#15803D]" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-2xl md:text-3xl text-[#0F1B17] tracking-tight">Administración</h3>
            <p className="text-sm text-[#6B7B76] mt-1 font-medium">Gestión de usuarios y roles del sistema Totebin.</p>
          </div>
        </div>
        <div className="z-10">
          <button className="bg-[#15803D] hover:bg-[#116932] disabled:opacity-60 text-white px-6 py-3.5 rounded-2xl font-display font-bold shadow-[0_4px_0_#0F5C2A] active:shadow-[0_0px_0_#0F5C2A] active:translate-y-1 transition-all flex items-center gap-2 text-sm whitespace-nowrap">
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
        <div className="p-8">
          <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border-2 border-dashed border-[#E3E9E6] bg-[#F7FAF8]">
            <div className="p-4 rounded-2xl bg-white border border-[#E3E9E6]">
              <Inbox className="w-8 h-8 text-[#9CA8A3]" />
            </div>
            <p className="font-display font-bold text-[#0F1B17]">Módulo en construcción</p>
            <p className="text-sm text-[#6B7B76]">Conectando a /api/v1/{activeTab}...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
