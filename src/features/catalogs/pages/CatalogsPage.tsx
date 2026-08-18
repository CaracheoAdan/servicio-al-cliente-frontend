import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Package, Search, Plus, X, Database, Edit2, Trash2, Tag, CheckCircle2, AlertCircle, Inbox } from 'lucide-react';
import { api } from '../../../shared/api/axiosInstance';
import { SkeletonLoader } from '../../../shared/components/SkeletonLoader';
import { KPICard } from '../../../shared/components/KPICard';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { Card, CardHeader } from '../../../shared/components/Card';
import { Product } from '../types/catalog.types';

export function CatalogsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  
  // Estado del formulario
  const [editId, setEditId] = useState<number | null>(null);
  const [newKey, setNewKey] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      const data = Array.isArray(res.data) ? res.data : (res.data.items || res.data.data || []);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error('No se pudieron cargar los productos desde el servidor.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditId(null);
    setNewKey('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditId(p.id);
    setNewKey(p.key);
    setIsActive(p.isActive !== undefined ? p.isActive : p.is_active || false);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (p: Product) => {
    const currentActive = p.isActive !== undefined ? p.isActive : p.is_active;
    try {
      await api.put(`/products/${p.id}`, { key: p.key, isActive: !currentActive });
      toast.success(`Producto marcado como ${!currentActive ? 'Activo' : 'Inactivo'}.`, {
        duration: 2000,
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
      fetchProducts();
    } catch (error) {
      toast.error('Error al cambiar el estado del producto.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/products/${editId}`, { key: newKey, isActive });
        toast.success('Producto actualizado exitosamente.', {
          style: { borderRadius: '10px', background: '#333', color: '#fff' },
        });
      } else {
        await api.post('/products', { key: newKey, isActive });
        toast.success('Producto creado exitosamente.', {
          style: { borderRadius: '10px', background: '#333', color: '#fff' },
        });
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error('Error al guardar el producto.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    }
  };

  const handleDeleteClick = (id: number) => {
    setConfirmDeleteId(id);
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await api.delete(`/products/${confirmDeleteId}`);
      toast.success('Producto eliminado.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      fetchProducts();
    } catch (error) {
      toast.error('Error al eliminar producto.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.key.toLowerCase().includes(searchTerm.toLowerCase());
    const isActiveState = p.isActive !== undefined ? p.isActive : p.is_active;
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'active') return matchesSearch && isActiveState;
    if (filterStatus === 'inactive') return matchesSearch && !isActiveState;
    return matchesSearch;
  });

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive === true || p.is_active === true).length;
  const inactiveProducts = totalProducts - activeProducts;

  return (
    <Card className="min-h-[500px] flex flex-col font-body animate-fade-in-up border-0 sm:border">
      <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-xl font-display font-bold text-sm whitespace-nowrap transition-colors ${filterStatus === 'all' ? 'bg-[#2A5D8F] text-white shadow-[0_3px_0_#1B3D5C]' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-xl font-display font-bold text-sm whitespace-nowrap transition-colors ${filterStatus === 'active' ? 'bg-[#2A5D8F] text-white shadow-[0_3px_0_#1B3D5C]' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'}`}
          >
            Activos
          </button>
          <button 
            onClick={() => setFilterStatus('inactive')}
            className={`px-4 py-2 rounded-xl font-display font-bold text-sm whitespace-nowrap transition-colors ${filterStatus === 'inactive' ? 'bg-[#2A5D8F] text-white shadow-[0_3px_0_#1B3D5C]' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'}`}
          >
            Inactivos
          </button>
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 z-10 w-full lg:w-auto">
          <div>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-[#94A3B8]" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar clave de producto..." 
                className="pl-11 pr-10 py-3.5 border-2 border-[#E2E8F0] rounded-xl text-[#0F172A] font-semibold focus:outline-none focus:border-[#2A5D8F] focus:ring-4 focus:ring-[#2A5D8F]/10 transition-all w-full md:w-64 shadow-sm"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#94A3B8] hover:text-[#DC2626] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="absolute mt-2 font-mono text-xs text-[#2A5D8F] font-semibold">
                Mostrando {filteredProducts.length} de {products.length} productos
              </p>
            )}
          </div>
          <button 
            onClick={openCreateModal}
            className="bg-[#2A5D8F] hover:bg-[#1E4D73] disabled:opacity-60 text-white px-6 py-3.5 rounded-2xl font-display font-bold shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1 transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> Nuevo Producto
          </button>
        </div>
      </CardHeader>
      
      {/* KPIs Row */}
      {/* KPIs Row */}
      {!loading && (
        <div className="px-8 py-5 border-b border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0F172A] grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPICard 
            title="Total de Productos" 
            value={totalProducts} 
            icon={<Package />} 
            iconColorClass="text-[#2A5D8F]"
          />
          <KPICard 
            title="Activos" 
            value={activeProducts} 
            icon={<CheckCircle2 />} 
            iconColorClass="text-[#10B981]"
          />
          <KPICard 
            title="Inactivos" 
            value={inactiveProducts} 
            icon={<AlertCircle />} 
            iconColorClass="text-[#F59E0B]"
          />
        </div>
      )}

      <div className="flex-1 bg-white dark:bg-gray-900 rounded-b-2xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <SkeletonLoader type="table" rows={6} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8">
            <div className="flex flex-col items-center justify-center gap-4 py-20 rounded-2xl border-2 border-dashed border-[#E2E8F0] dark:border-gray-800 bg-[#F8FAFC] dark:bg-gray-800/50">
              <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 shadow-sm border border-[#E2E8F0] dark:border-gray-700">
                <svg className="w-16 h-16 text-[#2A5D8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-[#0F172A] dark:text-white text-lg">Catálogo vacío</p>
                <p className="text-sm text-[#64748B] dark:text-gray-400 mt-1 max-w-sm mx-auto">No se encontraron productos con estos criterios. Agrega un nuevo producto para comenzar.</p>
              </div>
              <button
                onClick={openCreateModal}
                className="mt-2 px-6 py-3 rounded-xl font-display font-bold text-sm text-white bg-[#2A5D8F] hover:bg-[#1B3D5C] shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1 transition-all flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Nuevo Producto
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-8 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">ID</th>
                  <th className="px-8 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Producto (Clave)</th>
                  <th className="px-8 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Estado</th>
                  <th className="px-8 py-4 text-right text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-gray-800">
                {filteredProducts.map((p) => {
                  const isActiveState = p.isActive !== undefined ? p.isActive : p.is_active;
                  const borderClass = isActiveState ? 'border-l-4 border-l-[#2A5D8F]' : 'border-l-4 border-l-slate-400';
                  return (
                    <tr key={p.id} className={`hover:bg-[#EFF6FF] dark:hover:bg-gray-800/50 transition-colors group relative ${borderClass} dark:text-gray-300`}>
                      <td className="px-8 py-5 whitespace-nowrap text-base font-mono font-bold text-[#64748B]">{p.id}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-base font-mono font-bold text-[#0F172A]">
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 text-[#94A3B8] mr-2" />
                          {p.key}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <button 
                          onClick={() => handleToggleActive(p)}
                          title="Clic para cambiar estado"
                          className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
                        >
                          {isActiveState ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#2A5D8F] bg-[#EFF6FF] border border-[#BFDBFE]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2A5D8F] mr-1.5"></span>
                              Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mr-1.5"></span>
                              Inactivo
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium overflow-hidden">
                        <div className="flex justify-end space-x-2 md:translate-x-12 opacity-100 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-300 ease-out">
                          <button 
                            onClick={() => openEditModal(p)}
                            className="flex items-center text-[#2A5D8F] bg-[#EFF6FF] dark:bg-blue-900/30 hover:bg-[#DBEAFE] dark:hover:bg-blue-900/50 px-3 py-2 rounded-xl transition-colors font-display font-bold text-xs"
                          >
                            <Edit2 className="w-4 h-4 mr-1.5" /> Editar
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(p.id)} 
                            className="flex items-center text-[#DC2626] bg-[#FEF2F2] dark:bg-red-900/30 hover:bg-[#FEE2E2] dark:hover:bg-red-900/50 px-3 py-2 rounded-xl transition-colors font-display font-bold text-xs"
                          >
                            <Trash2 className="w-4 h-4 mr-1.5" /> Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            <div className="px-8 py-4 border-t border-[#E2E8F0] dark:border-gray-800 bg-[#F8FAFC] dark:bg-gray-800 flex justify-between items-center text-sm font-medium text-[#64748B] dark:text-gray-400">
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#2A5D8F] mr-2"></span>
                Mostrando {filteredProducts.length > 0 ? 1 : 0} - {filteredProducts.length} de {products.length} productos
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 overflow-hidden transform animate-slide-up border border-[#E2E8F0]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="font-mono text-[11px] font-bold text-[#2A5D8F] uppercase tracking-[0.15em] block mb-1">Catálogo</span>
                <h3 className="text-2xl font-display font-extrabold text-[#0F172A] tracking-tight">{editId ? 'Editar Producto' : 'Crear Nuevo'}</h3>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-[#94A3B8] hover:text-[#DC2626] transition-colors p-2 rounded-xl hover:bg-[#FEF2F2]">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-display font-bold text-[#0F172A] mb-2">Producto (Clave/Key) *</label>
                <input 
                  type="text" 
                  required 
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Ej: 10000489"
                  className="w-full p-3.5 border-2 border-[#E2E8F0] rounded-xl focus:border-[#2A5D8F] focus:ring-4 focus:ring-[#2A5D8F]/10 outline-none text-[#0F172A] font-mono font-bold transition-all"
                />
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <input 
                  type="checkbox" 
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 text-[#2A5D8F] border-[#E2E8F0] rounded focus:ring-[#2A5D8F] cursor-pointer"
                />
                <span className="text-sm font-display font-bold text-[#0F172A]">Producto Activo (is_active)</span>
              </div>
              
              <div className="pt-8 flex justify-end space-x-4 border-t border-[#E2E8F0]">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 text-sm font-display font-bold text-[#0F172A] bg-[#F8FAFC] hover:bg-[#E2E8F0] rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-[#2A5D8F] hover:bg-[#1E4D73] disabled:opacity-60 text-white px-8 py-3.5 rounded-2xl font-display font-bold shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1 transition-all flex items-center gap-2"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        title="Eliminar Producto"
        message={
          <>
            ¿Estás seguro de eliminar este producto de la base de datos? <strong className="text-[#DC2626]">Esta acción no se puede deshacer.</strong>
          </>
        }
        confirmText="Sí, eliminar producto"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </Card>
  );
}
