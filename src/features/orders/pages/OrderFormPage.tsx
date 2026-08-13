import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Plus, X, FileText, CheckCircle2, Copy } from 'lucide-react';
import { api } from '../../../shared/api/axiosInstance';
import { OrderStatus } from '../types/order.types';

export function OrderFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [orderKey, setOrderKey] = useState('');
  const [scheduledDeliveryDate, setScheduledDeliveryDate] = useState('');
  const [items, setItems] = useState([{ productId: '', orderedQuantity: 1, deliveredQuantity: 0 }]);
  const [status, setStatus] = useState<OrderStatus>('open');
  const [comments, setComments] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  
  // Estado para la función de pre-llenado
  const [existingOrders, setExistingOrders] = useState<any[]>([]);
  const [selectedOrderToCopy, setSelectedOrderToCopy] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get('/products');
        const prodData = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.items || prodRes.data.data || []);
        const activeProducts = prodData.filter((p: any) => p.isActive === true || p.is_active === true);
        setAvailableProducts(activeProducts);

        if (isEditing) {
          const orderRes = await api.get(`/orders/${id}`);
          const orderData = orderRes.data.data || orderRes.data;
          
          setOrderKey(orderData.key || '');
          if (orderData.scheduled_delivery_date || orderData.scheduledDeliveryDate) {
            setScheduledDeliveryDate((orderData.scheduled_delivery_date || orderData.scheduledDeliveryDate).split('T')[0]);
          }
          setStatus(orderData.status || 'open');
          setComments(orderData.comments || '');
          
          if (orderData.items && orderData.items.length > 0) {
            setItems(orderData.items.map((i: any) => ({
              productId: i.product_id || i.productId || '',
              orderedQuantity: i.ordered_quantity || i.orderedQuantity || 1,
              deliveredQuantity: i.delivered_quantity || i.deliveredQuantity || 0
            })));
          }
        } else {
          // Si es nueva orden, cargar la lista de órdenes existentes para permitir pre-llenado
          const ordersRes = await api.get('/orders');
          const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data.items || ordersRes.data.data || []);
          setExistingOrders(ordersData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error('Error al cargar datos del servidor.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing]);

  const handlePrefillFromOrder = async (orderIdToCopy: string) => {
    if (!orderIdToCopy) return;
    try {
      setLoading(true);
      const orderRes = await api.get(`/orders/${orderIdToCopy}`);
      const orderData = orderRes.data.data || orderRes.data;
      
      if (orderData.items && orderData.items.length > 0) {
        setItems(orderData.items.map((i: any) => ({
          productId: i.product_id || i.productId || '',
          orderedQuantity: i.ordered_quantity || i.orderedQuantity || 1,
          deliveredQuantity: 0 // Resetear a 0 porque es una nueva orden
        })));
        toast.success(`Formulario pre-llenado usando los productos de la orden ${orderData.key}`, { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      } else {
        toast.error('La orden seleccionada no tiene productos.');
      }
    } catch (error) {
      toast.error('Error al intentar pre-llenar la orden.');
    } finally {
      setLoading(false);
      setSelectedOrderToCopy('');
    }
  };

  const handleAddItem = () => {
    setItems([...items, { productId: '', orderedQuantity: 1, deliveredQuantity: 0 }]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleStatusToggle = (newStatus: OrderStatus) => {
    setStatus(newStatus);
    if (isEditing) {
      toast.success(`Estado seleccionado: ${newStatus}.`, {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some(item => !item.productId)) {
      toast.error('Por favor selecciona un producto en todas las filas.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      return;
    }

    try {
      const payload = {
        key: orderKey,
        status: status,
        scheduledDeliveryDate: scheduledDeliveryDate,
        comments: comments, // Enviamos el comentario al backend
        items: items.map(item => ({
          productId: parseInt(item.productId as string, 10),
          orderedQuantity: item.orderedQuantity,
          deliveredQuantity: item.deliveredQuantity
        }))
      };

      if (isEditing) {
        await api.put(`/orders/${id}`, payload);
        toast.success('Orden actualizada en DB.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      } else {
        await api.post('/orders', payload);
        toast.success('Orden creada en DB.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
        setTimeout(() => navigate('/orders'), 1000);
      }
    } catch (error) {
      toast.error('Error al guardar. Revisa la consola o backend.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Cargando datos...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-sans animate-fade-in-up max-w-5xl mx-auto">
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <FileText className="w-6 h-6 text-totebin-600 mr-3" />
          {isEditing ? `Gestión de No. Orden: ${id}` : 'Nueva Orden de Producción'}
        </h3>
        <button onClick={() => navigate('/orders')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-bold text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Regresar
        </button>
      </div>

      <form onSubmit={handleSave} className="p-8 space-y-8">
        
        {/* Pre-llenado (Solo al crear nueva orden) */}
        {!isEditing && existingOrders.length > 0 && (
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-center space-x-4">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
              <Copy className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-blue-900">¿Quieres pre-llenar los productos usando una orden anterior?</p>
              <p className="text-xs text-blue-700">Selecciona una orden y copiaremos sus productos (sin las cantidades surtidas) para ahorrarte tiempo.</p>
            </div>
            <select
              value={selectedOrderToCopy}
              onChange={(e) => {
                setSelectedOrderToCopy(e.target.value);
                handlePrefillFromOrder(e.target.value);
              }}
              className="border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            >
              <option value="">-- Seleccionar Orden --</option>
              {existingOrders.map(o => (
                <option key={o.id} value={o.id}>Orden: {o.key}</option>
              ))}
            </select>
          </div>
        )}

        {/* Datos Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">No. Orden</label>
            <input
              type="text"
              required
              value={orderKey}
              onChange={(e) => setOrderKey(e.target.value)}
              placeholder="Ej: 12515"
              className="block w-full border-gray-200 rounded-xl shadow-sm focus:border-totebin-500 focus:ring-totebin-500 px-4 py-2.5 bg-white transition-colors font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Fecha compromiso de entrega</label>
            <input
              type="date"
              required
              value={scheduledDeliveryDate}
              onChange={(e) => setScheduledDeliveryDate(e.target.value)}
              className="block w-full border-gray-200 rounded-xl shadow-sm focus:border-totebin-500 focus:ring-totebin-500 px-4 py-2.5 bg-white transition-colors font-semibold text-gray-700"
            />
          </div>
        </div>

        {/* Productos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-gray-900">Productos a Producir</h4>
            <button 
              type="button" 
              onClick={handleAddItem}
              className="text-sm bg-totebin-50 text-totebin-700 hover:bg-totebin-100 font-bold py-2 px-4 rounded-lg border border-totebin-200 transition-colors flex items-center shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Agregar Fila
            </button>
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase w-40">Cantidad pedida</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase w-40">Cantidad surtida</th>
                  <th className="px-4 py-3 text-center w-16"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-totebin-500 focus:border-totebin-500 text-sm font-semibold cursor-pointer"
                        required
                      >
                        <option value="" disabled>-- Selecciona un Producto --</option>
                        {availableProducts.map(prod => (
                          <option key={prod.id} value={prod.id}>{prod.key}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="1"
                        value={item.orderedQuantity}
                        onChange={(e) => handleItemChange(index, 'orderedQuantity', parseInt(e.target.value) || 1)}
                        className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-totebin-500 text-sm font-semibold"
                        required
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        value={item.deliveredQuantity}
                        onChange={(e) => handleItemChange(index, 'deliveredQuantity', parseInt(e.target.value) || 0)}
                        className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-totebin-500 text-sm font-semibold text-totebin-700 bg-totebin-50"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        type="button"
                        onClick={() => setItems(items.filter((_, i) => i !== index))}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50"
                        disabled={items.length === 1}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estatus y Comentarios (Edición) */}
        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
            <div className="space-y-4">
              <div className={`border rounded-xl p-4 transition-colors ${status === 'produced' || status === 'in_delivery' || status === 'delivered' ? 'bg-totebin-50 border-totebin-200' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-sm">Pedido ya está producido</span>
                  <label className="flex items-center space-x-2 cursor-pointer bg-white border border-gray-300 rounded-md p-1 px-2 shadow-sm">
                    <span className="text-xs font-bold text-gray-700">Sí</span>
                    <input 
                      type="checkbox" 
                      checked={status === 'produced' || status === 'in_delivery' || status === 'delivered'}
                      onChange={() => handleStatusToggle('produced')}
                      className="h-4 w-4 text-totebin-600 focus:ring-totebin-500 border-gray-300 rounded" 
                    />
                  </label>
                </div>
              </div>

              <div className={`border rounded-xl p-4 transition-colors ${status === 'in_delivery' || status === 'delivered' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-sm">Salida de transporte (Envío)</span>
                  <label className="flex items-center space-x-2 cursor-pointer bg-white border border-gray-300 rounded-md p-1 px-2 shadow-sm">
                    <span className="text-xs font-bold text-gray-700">Sí</span>
                    <input 
                      type="checkbox" 
                      checked={status === 'in_delivery' || status === 'delivered'}
                      onChange={() => handleStatusToggle('in_delivery')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Comentarios para sistemas</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Escribe observaciones adicionales aquí..."
                rows={4}
                className="w-full border-gray-200 rounded-xl shadow-sm focus:border-totebin-500 focus:ring-totebin-500 px-4 py-3 bg-white text-sm"
              ></textarea>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          {isEditing ? (
            <button
              type="button"
              onClick={() => handleStatusToggle('closed')}
              className={`flex items-center px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors ${status === 'closed' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'}`}
              disabled={status === 'closed'}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" /> Cerrar pedido
            </button>
          ) : <div></div>}

          <button 
            type="submit"
            className="bg-totebin-600 hover:bg-totebin-700 text-white font-bold py-2.5 px-8 rounded-xl shadow-md transition-all duration-200 flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {isEditing ? 'Guardar Cambios' : 'Generar Orden'}
          </button>
        </div>
      </form>
    </div>
  );
}
