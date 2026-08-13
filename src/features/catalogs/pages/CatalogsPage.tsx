import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Package, Server, Users, Search, Plus, X, Database, Edit2, Trash2 } from 'lucide-react';

export function CatalogsPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'machines' | 'responsables'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data para que la tabla no se vea vacía
  const mockProducts = [
    { id: 1, key: 'PRD-ALUM-01', isActive: true },
    { id: 2, key: 'PRD-ACER-05', isActive: true },
    { id: 3, key: 'PRD-COBR-99', isActive: false },
    { id: 4, key: 'PRD-PLAS-12', isActive: true },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success('Registro guardado exitosamente en la base de datos.', {
      duration: 3000,
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 min-h-[500px] flex flex-col font-sans animate-fade-in-up">
      <div className="border-b border-gray-100">
        <nav className="flex -mb-px px-6 space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center whitespace-nowrap py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-300 ${
              activeTab === 'products'
                ? 'border-totebin-500 text-totebin-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <Package className="w-4 h-4 mr-2" />
            Productos
          </button>
          <button
            onClick={() => setActiveTab('machines')}
            className={`flex items-center whitespace-nowrap py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-300 ${
              activeTab === 'machines'
                ? 'border-totebin-500 text-totebin-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <Server className="w-4 h-4 mr-2" />
            Máquinas
          </button>
          <button
            onClick={() => setActiveTab('responsables')}
            className={`flex items-center whitespace-nowrap py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-300 ${
              activeTab === 'responsables'
                ? 'border-totebin-500 text-totebin-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Responsables
          </button>
        </nav>
      </div>
      
      <div className="p-6 flex-1 bg-gray-50/50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-extrabold text-gray-900 flex items-center">
            <Database className="w-6 h-6 mr-2 text-totebin-600" />
            Catálogo de {activeTab === 'products' ? 'Productos' : activeTab === 'machines' ? 'Máquinas' : 'Responsables'}
          </h3>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar clave..." 
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-totebin-500 focus:border-transparent w-64 shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-totebin-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-totebin-700 transition-all duration-200 text-sm font-semibold flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Nuevo Registro
            </button>
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Clave (Key)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {activeTab === 'products' ? (
                mockProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{p.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{p.key}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {p.isActive ? (
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">Activo</span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-bold border border-gray-200">Inactivo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                      <button className="text-gray-400 hover:text-totebin-600 bg-white hover:bg-totebin-50 border border-transparent hover:border-totebin-100 p-2 rounded-lg transition-all shadow-sm">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 border border-transparent hover:border-red-100 p-2 rounded-lg transition-all shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-sm text-gray-500">
                    <p className="font-medium text-gray-500">Selecciona "Productos" para ver datos de prueba.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Profesional */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Crear Nuevo Registro</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Clave (Key) *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej: PRD-001"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-totebin-500 focus:border-totebin-500 transition-shadow outline-none text-gray-800"
                />
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <input 
                  type="checkbox" 
                  defaultChecked
                  className="w-5 h-5 text-totebin-600 border-gray-300 rounded focus:ring-totebin-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">Registro Activo (is_active)</span>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 text-sm font-semibold text-white bg-totebin-600 hover:bg-totebin-700 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
