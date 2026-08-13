import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Plus, X, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../../../shared/api/axiosInstance';
import { orderService } from '../../../shared/api/orderService';
import { OrderStatus } from '../types/order.types';

export function OrderFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [orderKey, setOrderKey] = useState('');
  const [scheduledDeliveryDate, setScheduledDeliveryDate] = useState('');
  const [shippingDate, setShippingDate] = useState('');
  const [items, setItems] = useState([{ productId: '', orderedQuantity: 1, deliveredQuantity: 0 }]);
  const [status, setStatus] = useState<OrderStatus>('open');
  const [comments, setComments] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get('/products');
        const prodData = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.items || prodRes.data.data || []);
        const activeProducts = prodData.filter((p: any) => p.isActive === true || p.is_active === true);
        setAvailableProducts(activeProducts);

        if (isEditing) {
          const orderData = await orderService.getOrderById(id!);
          if (orderData) {
            setOrderKey(orderData.key || '');
            if (orderData.detail?.scheduledDeliveryDate || orderData.detail?.scheduled_delivery_date) {
              setScheduledDeliveryDate((orderData.detail.scheduledDeliveryDate || orderData.detail.scheduled_delivery_date).split('T')[0]);
            }
            if (orderData.detail?.shippingDate || orderData.detail?.shipping_date) {
              setShippingDate((orderData.detail.shippingDate || orderData.detail.shipping_date).split('T')[0]);
            }
            setStatus(orderData.status || 'open');
            setComments(orderData.detail?.comments || '');
            
            if (orderData.items && orderData.items.length > 0) {
              setItems(orderData.items.map((i: any) => ({
                productId: i.product_id || i.productId || '',
                orderedQuantity: i.ordered_quantity || i.orderedQuantity || 1,
                deliveredQuantity: i.delivered_quantity || i.deliveredQuantity || 0
              })));
            }
          }
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
        shippingDate: shippingDate || undefined,
        comments: comments, // Enviamos el comentario al backend
        items: items.map(item => ({
          productId: parseInt(item.productId as string, 10),
          orderedQuantity: item.orderedQuantity,
          deliveredQuantity: item.deliveredQuantity
        }))
      };

      if (isEditing) {
        await orderService.updateOrder(id!, payload);
        toast.success('Orden actualizada en DB.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      } else {
        await orderService.createOrder(payload);
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
        </div>        {/* Productos */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-display font-bold text-[#0F1B17]">Productos a Producir</h4>
            <button 
              type="button" 
              onClick={handleAddItem}
              className="text-sm bg-[#F0FDF4] text-[#15803D] hover:bg-[#116932] hover:text-white font-display font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Agregar Fila
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-end gap-4 p-4 rounded-2xl bg-[#F7FAF8] border border-[#E3E9E6]">
                <div className="w-full md:w-2/5">
                  <label className="block text-xs font-display font-bold text-[#6B7B76] mb-1.5 uppercase tracking-wide">Producto</label>
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    className="w-full p-3.5 border-2 border-[#E3E9E6] rounded-xl focus:border-[#15803D] focus:ring-4 focus:ring-[#15803D]/10 outline-none text-[#0F1B17] font-body transition-all bg-white"
                    required
                  >
                    <option value="" disabled>-- Selecciona un Producto --</option>
                    {availableProducts.map(prod => (
                      <option key={prod.id} value={prod.id}>{prod.key}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-1/4">
                  <label className="block text-xs font-display font-bold text-[#6B7B76] mb-1.5 uppercase tracking-wide">Cant. Pedida</label>
                  <input
                    type="number"
                    min="1"
                    value={item.orderedQuantity}
                    onChange={(e) => handleItemChange(index, 'orderedQuantity', parseInt(e.target.value) || 1)}
                    className="w-full p-3.5 border-2 border-[#E3E9E6] rounded-xl focus:border-[#15803D] focus:ring-4 focus:ring-[#15803D]/10 outline-none text-[#0F1B17] font-mono font-bold transition-all bg-white"
                    required
                  />
                </div>
                <div className="w-full md:w-1/4">
                  <label className="block text-xs font-display font-bold text-[#6B7B76] mb-1.5 uppercase tracking-wide">Cant. Surtida</label>
                  <input
                    type="number"
                    min="0"
                    value={item.deliveredQuantity}
                    onChange={(e) => handleItemChange(index, 'deliveredQuantity', parseInt(e.target.value) || 0)}
                    className="w-full p-3.5 border-2 border-[#E3E9E6] rounded-xl focus:border-[#15803D] focus:ring-4 focus:ring-[#15803D]/10 outline-none text-[#0F1B17] font-mono font-bold transition-all bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newItems = [...items];
                    newItems.splice(index, 1);
                    setItems(newItems);
                  }}
                  className="p-3.5 bg-white text-[#9CA8A3] hover:text-[#DC2626] border-2 border-[#E3E9E6] hover:border-[#DC2626]/30 hover:bg-[#FEF2F2] rounded-xl transition-colors mb-0 disabled:opacity-50"
                  title="Eliminar fila"
                  disabled={items.length === 1}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Estatus */}
        <div className="bg-white p-8 rounded-[28px] border border-[#E3E9E6] shadow-card-base max-w-2xl">
          <div className="space-y-6">
            {/* Pedido ya esta producido */}
            <div className={`border-2 rounded-2xl p-6 transition-all duration-300 ${status === 'produced' || status === 'in_delivery' || status === 'delivered' ? 'bg-[#F0FDF4] border-[#15803D]/30' : 'bg-[#F7FAF8] border-[#E3E9E6]'}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="font-display font-bold text-[#0F1B17] text-base">Pedido ya está producido</span>
              </div>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="producedStatus"
                    checked={status === 'produced' || status === 'in_delivery' || status === 'delivered'}
                    onChange={() => handleStatusToggle('produced')}
                    className="h-5 w-5 text-[#15803D] focus:ring-[#15803D] border-[#E3E9E6]" 
                  />
                  <span className="font-display font-bold text-[#6B7B76]">Sí</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="producedStatus"
                    checked={status === 'open'}
                    onChange={() => handleStatusToggle('open')}
                    className="h-5 w-5 text-[#DC2626] focus:ring-[#DC2626] border-[#E3E9E6]" 
                  />
                  <span className="font-display font-bold text-[#6B7B76]">No</span>
                </label>
              </div>
            </div>

            {/* Salida de transporte */}
            <div className={`border-2 rounded-2xl p-6 transition-all duration-300 ${status === 'in_delivery' || status === 'delivered' ? 'bg-[#FFFBEB] border-[#D97706]/30' : 'bg-[#F7FAF8] border-[#E3E9E6]'}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="font-display font-bold text-[#0F1B17] text-base">Salida de transporte para entrega</span>
              </div>
              <div className="flex space-x-6 mb-5">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="shippingStatus"
                    checked={status === 'in_delivery' || status === 'delivered'}
                    onChange={() => {
                      handleStatusToggle('in_delivery');
                      if (!shippingDate) {
                        setShippingDate(new Date().toISOString().split('T')[0]);
                      }
                    }}
                    className="h-5 w-5 text-[#D97706] focus:ring-[#D97706] border-[#E3E9E6]" 
                  />
                  <span className="font-display font-bold text-[#6B7B76]">Sí</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="shippingStatus"
                    checked={status !== 'in_delivery' && status !== 'delivered'}
                    onChange={() => handleStatusToggle('produced')}
                    className="h-5 w-5 text-[#DC2626] focus:ring-[#DC2626] border-[#E3E9E6]" 
                  />
                  <span className="font-display font-bold text-[#6B7B76]">No</span>
                </label>
              </div>
              
              <div>
                <label className="block text-xs font-display font-bold text-[#6B7B76] mb-1.5 uppercase tracking-wide">Fecha de envío</label>
                <input
                  type="date"
                  value={shippingDate}
                  onChange={(e) => setShippingDate(e.target.value)}
                  className="w-full md:w-2/3 p-3.5 border-2 border-[#E3E9E6] rounded-xl focus:border-[#D97706] focus:ring-4 focus:ring-[#D97706]/10 outline-none text-[#0F1B17] font-mono font-bold transition-all bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-[#E3E9E6]">
          <button
            type="button"
            onClick={() => handleStatusToggle('closed')}
            className={`flex items-center px-6 py-3.5 rounded-2xl font-display font-bold transition-all ${status === 'closed' ? 'bg-[#F3F6F4] text-[#9CA8A3] cursor-not-allowed' : 'bg-[#FEF2F2] text-[#DC2626] hover:bg-red-100 shadow-[0_4px_0_#991B1B] active:shadow-[0_0px_0_#991B1B] active:translate-y-1'}`}
            disabled={status === 'closed'}
          >
            <CheckCircle2 className="w-5 h-5 mr-2" /> Cerrar pedido
          </button>

          <button 
            type="submit"
            className="bg-[#15803D] hover:bg-[#116932] disabled:opacity-60 text-white px-8 py-3.5 rounded-2xl font-display font-bold shadow-btn-3d transition-all flex items-center text-base"
          >
            <Save className="w-5 h-5 mr-2" />
            {isEditing ? 'Guardar Cambios' : 'Crear Orden'}
          </button>
        </div>
      </form>
    </div>
  );
}
