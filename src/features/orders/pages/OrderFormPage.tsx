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
    return <div className="p-8 text-center text-[#64748B] font-display font-bold">Cargando datos...</div>;
  }

  const isProduced = status === 'produced' || status === 'in_delivery' || status === 'delivered' || status === 'closed';
  const isDelivered = status === 'in_delivery' || status === 'delivered' || status === 'closed';

  return (
    <div className="bg-white rounded-2xl shadow-card-base border border-[#E2E8F0] overflow-hidden font-body animate-fade-in-up w-full mx-auto">
      {/* Toolbar */}
      <div className="px-10 md:px-12 py-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center rounded-t-2xl gap-4">
        <div className="font-display font-bold text-[#0F172A] text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#2A5D8F]" />
          {isEditing ? `Gestión de Orden No. ${id}` : 'Nueva Orden de Producción'}
        </div>
        <button 
          type="button"
          onClick={() => navigate('/orders')} 
          className="bg-transparent border border-[#E2E8F0] hover:border-[#2A5D8F] text-[#64748B] hover:text-[#2A5D8F] px-5 py-2.5 rounded-xl font-display font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Regresar
        </button>
      </div>

      <form onSubmit={handleSave} className="p-10 md:p-12 space-y-14">
        {/* Datos Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#F8FAFC] p-8 md:p-10 rounded-2xl border border-[#E2E8F0]">
          <div>
            <label className="block font-display font-bold text-sm text-[#0F172A] mb-2">No. Orden</label>
            <input
              type="text"
              required
              value={orderKey}
              onChange={(e) => setOrderKey(e.target.value)}
              placeholder="Ej: 12515"
              className="block w-full border-2 border-[#E2E8F0] rounded-xl focus:border-[#2A5D8F] focus:ring-4 focus:ring-[#2A5D8F]/10 px-4 py-3.5 bg-white transition-all font-mono font-semibold text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
            />
          </div>
          <div>
            <label className="block font-display font-bold text-sm text-[#0F172A] mb-2">Fecha compromiso de entrega</label>
            <input
              type="date"
              required
              value={scheduledDeliveryDate}
              onChange={(e) => setScheduledDeliveryDate(e.target.value)}
              className="block w-full border-2 border-[#E2E8F0] rounded-xl focus:border-[#2A5D8F] focus:ring-4 focus:ring-[#2A5D8F]/10 px-4 py-3.5 bg-white transition-all font-mono font-semibold text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
            />
          </div>
        </div>

        {/* Productos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-display font-bold text-[#0F172A]">Productos a Producir</h4>
            <button 
              type="button" 
              onClick={handleAddItem}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EFF6FF] text-[#2A5D8F] font-display font-bold text-sm border border-[#BFDBFE] hover:bg-[#DBEAFE] transition-colors"
            >
              <Plus className="w-4 h-4" /> Agregar Fila
            </button>
          </div>

          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-end gap-6 p-6 md:p-8 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] even:bg-white dark:even:bg-[#1E1E1E]">
                <div className="w-full md:w-2/5 flex flex-col justify-end">
                  <label className="block font-display font-bold text-[11px] uppercase tracking-wide text-[#64748B] mb-2">Producto</label>
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    className="w-full p-3.5 border-2 border-[#E2E8F0] rounded-xl focus:border-[#2A5D8F] focus:ring-4 focus:ring-[#2A5D8F]/10 outline-none text-[#0F172A] font-body transition-all bg-white"
                    required
                  >
                    <option value="" disabled>-- Selecciona un Producto --</option>
                    {availableProducts.map(prod => (
                      <option key={prod.id} value={prod.id}>{prod.key}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-1/4 flex flex-col justify-end">
                  <label className="block font-display font-bold text-[11px] uppercase tracking-wide text-[#64748B] mb-2">Cant. Pedida</label>
                  <input
                    type="number"
                    min="1"
                    value={item.orderedQuantity}
                    onChange={(e) => handleItemChange(index, 'orderedQuantity', parseInt(e.target.value) || 1)}
                    className="w-full p-3.5 border-2 border-[#E2E8F0] rounded-xl focus:border-[#2A5D8F] focus:ring-4 focus:ring-[#2A5D8F]/10 outline-none text-[#0F172A] font-mono font-bold transition-all bg-white"
                    required
                  />
                </div>
                <div className="w-full md:w-1/4 flex flex-col justify-end">
                  <label className="block font-display font-bold text-[11px] uppercase tracking-wide text-[#64748B] mb-2">Cant. Surtida</label>
                  <input
                    type="number"
                    min="0"
                    value={item.deliveredQuantity}
                    onChange={(e) => handleItemChange(index, 'deliveredQuantity', parseInt(e.target.value) || 0)}
                    className="w-full p-3.5 border-2 border-[#E2E8F0] rounded-xl focus:border-[#2A5D8F] focus:ring-4 focus:ring-[#2A5D8F]/10 outline-none text-[#0F172A] font-mono font-bold transition-all bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newItems = [...items];
                    newItems.splice(index, 1);
                    setItems(newItems);
                  }}
                  className="p-3.5 bg-white border border-[#E2E8F0] hover:border-[#DC2626] text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-xl transition-all shrink-0 disabled:opacity-50 dark:bg-[#121212] dark:border-[#333333] dark:hover:border-[#DC2626]"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pedido ya esta producido */}
          <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-8 md:p-10">
            <h5 className="font-display font-bold text-[#0F172A] mb-6">Pedido ya está producido</h5>
            <div className="inline-flex rounded-xl bg-[#E2E8F0] dark:bg-[#121212] p-1">
              <button 
                type="button" 
                onClick={() => handleStatusToggle('produced')} 
                className={`px-8 py-2 rounded-lg font-display font-bold text-sm transition-all ${isProduced ? 'bg-white dark:bg-[#333333] text-[#0F172A] dark:text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-white'}`}
              >
                Sí
              </button>
              <button 
                type="button" 
                onClick={() => handleStatusToggle('open')} 
                className={`px-8 py-2 rounded-lg font-display font-bold text-sm transition-all ${!isProduced ? 'bg-white dark:bg-[#333333] text-[#0F172A] dark:text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-white'}`}
              >
                No
              </button>
            </div>
          </div>

          {/* Salida de transporte */}
          <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-8 md:p-10">
            <h5 className="font-display font-bold text-[#0F172A] mb-6">Salida de transporte para entrega</h5>
            <div className="inline-flex rounded-xl bg-[#E2E8F0] dark:bg-[#121212] p-1 mb-6 block">
              <button 
                type="button" 
                onClick={() => handleStatusToggle('in_delivery')} 
                className={`px-8 py-2 rounded-lg font-display font-bold text-sm transition-all ${isDelivered ? 'bg-white dark:bg-[#333333] text-[#0F172A] dark:text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-white'}`}
              >
                Sí
              </button>
              <button 
                type="button" 
                onClick={() => handleStatusToggle('produced')} 
                className={`px-8 py-2 rounded-lg font-display font-bold text-sm transition-all ${!isDelivered ? 'bg-white dark:bg-[#333333] text-[#0F172A] dark:text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-white'}`}
              >
                No
              </button>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-between items-center pt-10 px-2 border-t border-[#E2E8F0] mt-10">
          <button
            type="button"
            onClick={() => handleStatusToggle('closed')}
            disabled={status === 'closed'}
            className={`flex items-center px-6 py-3.5 rounded-xl font-display font-bold border-2 transition-all h-[52px] ${status === 'closed' ? 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0] cursor-not-allowed dark:bg-[#18181B] dark:border-[#333333]' : 'bg-transparent text-[#64748B] border-[#E2E8F0] hover:border-[#2A5D8F] hover:text-[#2A5D8F] dark:border-[#333333] dark:hover:border-[#5BA3D9] dark:hover:text-[#5BA3D9]'}`}
          >
            <CheckCircle2 className="w-5 h-5 mr-2" /> Cerrar pedido
          </button>

          <button 
            type="submit"
            className="bg-[#2A5D8F] hover:bg-[#1E4D73] disabled:opacity-60 text-white px-8 py-3.5 rounded-xl font-display font-bold shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1 transition-all flex items-center h-[52px]"
          >
            <Save className="w-5 h-5 mr-2" />
            {isEditing ? 'Guardar Cambios' : 'Crear Orden'}
          </button>
        </div>
      </form>
    </div>
  );
}
