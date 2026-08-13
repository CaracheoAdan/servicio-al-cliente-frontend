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
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 min-h-[500px] flex flex-col font-sans animate-fade-in-up">
      <div className="border-b border-gray-100">
        <nav className="flex -mb-px px-6 space-x-6" aria-label="Tabs">
          <button
            className="flex items-center whitespace-nowrap py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-300 border-totebin-500 text-totebin-600"
          >
            <Package className="w-4 h-4 mr-2" />
            Productos
          </button>
        </nav>
      </div>
      
      <div className="p-6 flex-1 bg-gray-50/50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-extrabold text-gray-900 flex items-center">
            <Database className="w-6 h-6 mr-2 text-totebin-600" />
            Catálogo de Productos
          </h3>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar clave de producto..." 
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-totebin-500 focus:border-transparent w-64 shadow-sm"
              />
            </div>
            <button 
              onClick={openCreateModal}
              className="bg-totebin-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-totebin-700 transition-all duration-200 text-sm font-semibold flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Nuevo Producto
            </button>
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Producto (Clave / Key)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500 font-medium">Cargando productos desde el backend...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500 font-medium">No hay productos registrados en la base de datos.</td>
                </tr>
              ) : (
                products.map((p) => {
                  const isActiveState = p.isActive !== undefined ? p.isActive : p.is_active;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{p.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{p.key}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleToggleActive(p)}
                          title="Clic para cambiar estado"
                          className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
                        >
                          {isActiveState ? (
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 cursor-pointer shadow-sm">Activo</span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-bold border border-gray-200 cursor-pointer shadow-sm">Inactivo</span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                        <button 
                          onClick={() => openEditModal(p)}
                          className="text-gray-400 hover:text-totebin-600 bg-white hover:bg-totebin-50 border border-transparent hover:border-totebin-100 p-2 rounded-lg transition-all shadow-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)} 
                          className="text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 border border-transparent hover:border-red-100 p-2 rounded-lg transition-all shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">{editId ? 'Editar Producto' : 'Crear Nuevo Producto'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Producto (Clave/Key) *</label>
                <input 
                  type="text" 
                  required 
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Ej: 10000489"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-totebin-500 focus:border-totebin-500 transition-shadow outline-none text-gray-800 font-semibold"
                />
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <input 
                  type="checkbox" 
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 text-totebin-600 border-gray-300 rounded focus:ring-totebin-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">Producto Activo (is_active)</span>
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
