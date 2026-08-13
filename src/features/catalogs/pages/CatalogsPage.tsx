import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Package, Search, Plus, X, Database, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../../shared/api/axiosInstance';

export function CatalogsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
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
      // Invertir estado de forma rápida visualmente para el usuario (opcional)
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

  return (
  return (
    <div className="bg-white rounded-[28px] shadow-card-base border border-[#E3E9E6] min-h-[500px] flex flex-col font-body animate-fade-in-up">
      <div className="p-8 border-b border-[#E3E9E6] flex justify-between items-center bg-white rounded-t-[28px] relative overflow-hidden">
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-[#F0FDF4] p-3 rounded-2xl border border-[#E3E9E6]">
            <Database className="w-8 h-8 text-[#15803D]" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-extrabold text-[#0F1B17] tracking-tight">Catálogo de Productos</h3>
            <p className="text-sm text-[#6B7B76] mt-1 font-body">Gestiona los productos disponibles para las órdenes</p>
          </div>
        </div>
        <div className="flex space-x-4 z-10">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA8A3]" />
            <input 
              type="text" 
              placeholder="Buscar clave de producto..." 
              className="pl-11 pr-4 py-3.5 border-2 border-[#E3E9E6] rounded-xl text-[#0F1B17] font-semibold focus:outline-none focus:border-[#15803D] focus:ring-4 focus:ring-[#15803D]/10 transition-all w-64 shadow-sm"
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="bg-[#15803D] hover:bg-[#116932] disabled:opacity-60 text-white px-6 py-3.5 rounded-2xl font-display font-bold shadow-btn-3d transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-5 h-5" /> Nuevo Producto
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-b-[28px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7FAF8] border-b border-[#E3E9E6]">
                <th className="px-8 py-5 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">ID</th>
                <th className="px-8 py-5 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Producto (Clave)</th>
                <th className="px-8 py-5 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Estado</th>
                <th className="px-8 py-5 text-right text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF1EF]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-sm font-display font-bold text-[#0F1B17]">Cargando productos...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#E3E9E6] flex items-center justify-center mb-4 bg-[#F7FAF8]">
                        <Package className="w-8 h-8 text-[#9CA8A3]" />
                      </div>
                      <p className="font-display font-bold text-[#0F1B17]">No hay productos registrados</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const isActiveState = p.isActive !== undefined ? p.isActive : p.is_active;
                  return (
                    <tr key={p.id} className="hover:bg-[#F0FDF4] transition-colors group">
                      <td className="px-8 py-5 whitespace-nowrap text-base font-mono font-bold text-[#6B7B76]">{p.id}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-base font-mono font-bold text-[#0F1B17]">{p.key}</td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <button 
                          onClick={() => handleToggleActive(p)}
                          title="Clic para cambiar estado"
                          className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
                        >
                          {isActiveState ? (
                            <span className="px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#15803D] bg-[#F0FDF4]">Activo</span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide text-[#6B7B76] bg-[#F3F6F4]">Inactivo</span>
                          )}
                        </button>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                        <button 
                          onClick={() => openEditModal(p)}
                          className="text-[#6B7B76] hover:text-[#15803D] bg-[#F3F6F4] hover:bg-[#E3E9E6] p-2 rounded-xl transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)} 
                          className="text-[#6B7B76] hover:text-[#DC2626] bg-[#F3F6F4] hover:bg-[#FEF2F2] p-2 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg p-8 overflow-hidden transform animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="font-mono text-xs font-bold text-[#15803D] uppercase tracking-widest block mb-1">Producto</span>
                <h3 className="text-2xl font-display font-bold text-[#0F1B17]">{editId ? 'Editar Producto' : 'Crear Nuevo'}</h3>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-[#9CA8A3] hover:text-[#DC2626] transition-colors p-2 rounded-full hover:bg-[#FEF2F2]">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-display font-bold text-[#0F1B17] mb-2">Producto (Clave/Key) *</label>
                <input 
                  type="text" 
                  required 
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Ej: 10000489"
                  className="w-full p-3.5 border-2 border-[#E3E9E6] rounded-xl focus:border-[#15803D] focus:ring-4 focus:ring-[#15803D]/10 outline-none text-[#0F1B17] font-mono font-bold transition-all"
                />
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <input 
                  type="checkbox" 
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 text-[#15803D] border-[#E3E9E6] rounded focus:ring-[#15803D] cursor-pointer"
                />
                <span className="text-sm font-display font-bold text-[#0F1B17]">Producto Activo (is_active)</span>
              </div>
              
              <div className="pt-8 flex justify-end space-x-4 border-t border-[#EDF1EF]">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 text-sm font-display font-bold text-[#0F1B17] bg-[#F3F6F4] hover:bg-[#E7ECE9] rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-[#15803D] hover:bg-[#116932] disabled:opacity-60 text-white px-8 py-3.5 rounded-2xl font-display font-bold shadow-btn-3d transition-all flex items-center gap-2"
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
