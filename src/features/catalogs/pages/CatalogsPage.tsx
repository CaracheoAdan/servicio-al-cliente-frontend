import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Package, Search, Plus, X, Database, Edit2, Trash2, Tag, CheckCircle2, XCircle, Inbox } from 'lucide-react';
import { api } from '../../../shared/api/axiosInstance';

export function CatalogsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
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

  const openEditModal = (p: any) => {
    setEditId(p.id);
    setNewKey(p.key);
    setIsActive(p.isActive !== undefined ? p.isActive : p.is_active);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (p: any) => {
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

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto de la base de datos?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Producto eliminado.', {
          style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
        fetchProducts();
      } catch (error) {
        toast.error('Error al eliminar producto.', {
          style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
      }
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
    <div className="bg-white rounded-2xl shadow-card-base border border-[#E2E8F0] min-h-[500px] flex flex-col font-body animate-fade-in-up">
      <div className="p-6 border-b border-[#E2E8F0] flex flex-col md:flex-row justify-between items-center bg-white rounded-t-2xl gap-4">
        
        {/* Quick Filters */}
        <div className="flex items-center space-x-2 w-full lg:w-auto overflow-x-auto pb-2 md:pb-0">
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
      </div>
      
      {/* KPIs Row */}
      {!loading && (
        <div className="px-8 py-5 border-b border-[#E2E8F0] bg-white grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3.5">
            <div className="p-2 rounded-xl bg-white border border-[#E2E8F0]">
              <Package className="w-5 h-5 text-[#2A5D8F]" />
            </div>
            <div>
              <div className="text-[10px] font-display font-bold text-[#64748B] uppercase tracking-wide">Total de Productos</div>
              <div className="font-mono font-bold text-lg text-[#0F172A] tabular-nums">{totalProducts}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3.5">
            <div className="p-2 rounded-xl bg-white border border-[#E2E8F0]">
              <CheckCircle2 className="w-5 h-5 text-[#2A5D8F]" />
            </div>
            <div>
              <div className="text-[10px] font-display font-bold text-[#64748B] uppercase tracking-wide">Activos</div>
              <div className="font-mono font-bold text-lg text-[#0F172A] tabular-nums">{activeProducts}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3.5">
            <div className="p-2 rounded-xl bg-white border border-[#E2E8F0]">
              <XCircle className="w-5 h-5 text-[#94A3B8]" />
            </div>
            <div>
              <div className="text-[10px] font-display font-bold text-[#64748B] uppercase tracking-wide">Inactivos</div>
              <div className="font-mono font-bold text-lg text-[#0F172A] tabular-nums">{inactiveProducts}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 bg-white rounded-b-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white">
            <div className="text-center">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-[#2A5D8F] border-t-transparent rounded-full mb-4"></div>
              <p className="font-display font-bold text-[#0F172A]">Cargando productos...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8">
            <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0]">
                <Inbox className="w-8 h-8 text-[#94A3B8]" />
              </div>
              <p className="font-display font-bold text-[#0F172A]">No se encontraron productos</p>
              <p className="text-sm text-[#64748B]">Prueba con otra búsqueda o agrega el primer producto.</p>
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
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredProducts.map((p) => {
                  const isActiveState = p.isActive !== undefined ? p.isActive : p.is_active;
                  return (
                    <tr key={p.id} className="hover:bg-[#EFF6FF] transition-colors group">
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
                      <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                        <button 
                          onClick={() => openEditModal(p)}
                          className="flex items-center text-[#2A5D8F] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-3 py-2 rounded-xl transition-colors font-display font-bold text-xs"
                        >
                          <Edit2 className="w-4 h-4 mr-1.5" /> Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)} 
                          className="flex items-center text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-3 py-2 rounded-xl transition-colors font-display font-bold text-xs"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" /> Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
    </div>
  );
}
