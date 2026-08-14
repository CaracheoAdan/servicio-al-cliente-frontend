import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Plus, X, FileText, CheckCircle2, MessageSquare, Package, Truck, Check } from 'lucide-react';
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
  const [isDirty, setIsDirty] = useState(false);

  // Mark as dirty when these change
  useEffect(() => {
    if (!loading) {
      setIsDirty(true);
    }
  }, [orderKey, scheduledDeliveryDate, items, status, comments]);

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
        setTimeout(() => setIsDirty(false), 50); // Reset dirty after load
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

    if (!orderKey.trim()) {
      toast.error('El No. de Orden es requerido y no puede estar vacío.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      return;
    }

    if (!/^\d+$/.test(orderKey.trim())) {
      toast.error('El No. de Orden debe contener únicamente números.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      return;
    }

    if (!scheduledDeliveryDate) {
      toast.error('La fecha compromiso de entrega es requerida.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      return;
    }

    if (items.length === 0) {
      toast.error('Debe agregar al menos un producto a la orden.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      return;
    }

    if (items.some(item => !item.productId)) {
      toast.error('Por favor selecciona un producto en todas las filas.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      return;
    }

    const productIds = items.map(i => i.productId);
    const uniqueProductIds = new Set(productIds);
    if (uniqueProductIds.size !== productIds.length) {
      toast.error('No puedes duplicar el mismo producto en diferentes filas.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      return;
    }

    if (items.some(item => Number(item.orderedQuantity) < 1 || isNaN(Number(item.orderedQuantity)))) {
      toast.error('La cantidad pedida debe ser un número entero mayor o igual a 1.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      return;
    }

    if (items.some(item => Number(item.deliveredQuantity) < 0 || isNaN(Number(item.deliveredQuantity)))) {
      toast.error('La cantidad surtida no puede ser negativa.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      return;
    }

    try {
      const payload = {
        key: orderKey,
        status: status,
        scheduledDeliveryDate: scheduledDeliveryDate,
        comments: comments,
        items: items.map(item => ({
          productId: parseInt(item.productId as string, 10),
          orderedQuantity: parseInt(item.orderedQuantity as string, 10),
          deliveredQuantity: parseInt(item.deliveredQuantity as string, 10) || 0
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
      setIsDirty(false);
    } catch (error) {
      toast.error('Error al guardar. Revisa la consola o backend.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#64748B] dark:text-slate-400 font-display font-bold">Cargando datos...</div>;
  }

  const statuses: { value: OrderStatus; label: string; icon: any }[] = [
    { value: 'open', label: 'Abierto', icon: FileText },
    { value: 'produced', label: 'Producido', icon: Package },
    { value: 'in_delivery', label: 'En Transporte', icon: Truck },
    { value: 'delivered', label: 'Entregado', icon: CheckCircle2 },
    { value: 'closed', label: 'Cerrado', icon: Check }
  ];

  const currentStatusIndex = statuses.findIndex(s => s.value === status);

  const totalOrdered = items.reduce((acc, curr) => acc + (Number(curr.orderedQuantity) || 0), 0);
  const totalDelivered = items.reduce((acc, curr) => acc + (Number(curr.deliveredQuantity) || 0), 0);

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-card-base border border-[#E2E8F0] dark:border-slate-800 overflow-hidden font-body animate-fade-in-up w-full mx-auto">
      {/* Toolbar */}
      <div className="px-6 md:px-10 py-5 border-b border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#1E293B] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => navigate('/orders')} 
            className="p-2 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 hover:border-[#2A5D8F] dark:hover:border-[#5BA3D9] text-[#64748B] dark:text-slate-400 hover:text-[#2A5D8F] dark:hover:text-[#5BA3D9] rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-display font-extrabold text-[#0F172A] dark:text-white text-xl">
              {isEditing ? `Gestión de Orden No. ${id}` : 'Nueva Orden de Producción'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isDirty ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                {isDirty ? '• Cambios sin guardar' : '✓ Guardado'}
              </span>
            </div>
          </div>
        </div>

        {/* Visual 3-step indicator */}
        <div className="hidden lg:flex items-center space-x-2 text-sm font-semibold text-[#64748B] dark:text-slate-400">
          <div className="flex items-center"><span className="w-6 h-6 rounded-full bg-[#2A5D8F] text-white flex items-center justify-center mr-2 text-xs">1</span>Datos generales</div>
          <div className="w-8 h-px bg-[#E2E8F0] dark:bg-slate-700"></div>
          <div className="flex items-center"><span className="w-6 h-6 rounded-full bg-[#2A5D8F] text-white flex items-center justify-center mr-2 text-xs">2</span>Productos</div>
          <div className="w-8 h-px bg-[#E2E8F0] dark:bg-slate-700"></div>
          <div className="flex items-center"><span className="w-6 h-6 rounded-full bg-[#2A5D8F] text-white flex items-center justify-center mr-2 text-xs">3</span>Estado y envío</div>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 md:p-10 space-y-12">
        {/* Datos Principales */}
        <section>
          <h3 className="text-lg font-display font-bold text-[#0F172A] dark:text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#2A5D8F]/10 dark:bg-[#5BA3D9]/10 text-[#2A5D8F] dark:text-[#5BA3D9] flex items-center justify-center text-sm lg:hidden">1</span>
            Datos Generales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#F8FAFC] dark:bg-[#1E293B] p-6 rounded-2xl border border-[#E2E8F0] dark:border-slate-800">
            <div>
              <label className="block font-semibold text-sm text-[#475569] dark:text-slate-300 mb-2">No. Orden</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={orderKey}
                onChange={(e) => setOrderKey(e.target.value.replace(/\D/g, ''))}
                placeholder="Ej: 12515"
                className="block w-full border border-[#E2E8F0] dark:border-slate-700 rounded-xl focus:border-[#2A5D8F] dark:focus:border-[#5BA3D9] focus:ring-2 focus:ring-[#2A5D8F]/20 px-4 py-3 bg-white dark:bg-[#0F172A] transition-all font-mono font-semibold text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-sm text-[#475569] dark:text-slate-300 mb-2">Fecha compromiso</label>
              <input
                type="date"
                required
                value={scheduledDeliveryDate}
                onChange={(e) => setScheduledDeliveryDate(e.target.value)}
                className="block w-full border border-[#E2E8F0] dark:border-slate-700 rounded-xl focus:border-[#2A5D8F] dark:focus:border-[#5BA3D9] focus:ring-2 focus:ring-[#2A5D8F]/20 px-4 py-3 bg-white dark:bg-[#0F172A] transition-all font-mono font-semibold text-[#0F172A] dark:text-white outline-none"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block font-semibold text-sm text-[#475569] dark:text-slate-300 mb-2 flex items-center gap-1">
                <MessageSquare className="w-4 h-4" /> Comentarios
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Observaciones adicionales..."
                rows={1}
                className="block w-full border border-[#E2E8F0] dark:border-slate-700 rounded-xl focus:border-[#2A5D8F] dark:focus:border-[#5BA3D9] focus:ring-2 focus:ring-[#2A5D8F]/20 px-4 py-3 bg-white dark:bg-[#0F172A] transition-all text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] outline-none resize-y min-h-[50px]"
              />
            </div>
          </div>
        </section>

        {/* Productos */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <h3 className="text-lg font-display font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2A5D8F]/10 dark:bg-[#5BA3D9]/10 text-[#2A5D8F] dark:text-[#5BA3D9] flex items-center justify-center text-sm lg:hidden">2</span>
              Productos a Producir
            </h3>
            <button 
              type="button" 
              onClick={handleAddItem}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#2A5D8F] text-white font-display font-bold text-sm hover:bg-[#1E4D73] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Añadir Producto
            </button>
          </div>

          <div className="border border-[#E2E8F0] dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0F172A]">
            <div className="hidden md:grid grid-cols-12 gap-4 bg-[#F8FAFC] dark:bg-[#1E293B] p-4 border-b border-[#E2E8F0] dark:border-slate-800 font-semibold text-xs text-[#64748B] dark:text-slate-400 uppercase tracking-wider">
              <div className="col-span-5">Producto</div>
              <div className="col-span-3 text-center">Cant. Pedida</div>
              <div className="col-span-3 text-center">Cant. Surtida</div>
              <div className="col-span-1 text-center">Acción</div>
            </div>
            
            <div className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 items-center">
                  <div className="w-full md:col-span-5">
                    <label className="md:hidden block text-xs font-semibold text-[#64748B] dark:text-slate-400 mb-1">Producto</label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      className="w-full p-2.5 border border-[#E2E8F0] dark:border-slate-700 rounded-lg focus:border-[#2A5D8F] dark:focus:border-[#5BA3D9] focus:ring-2 focus:ring-[#2A5D8F]/20 outline-none text-[#0F172A] dark:text-white bg-white dark:bg-[#1E293B] transition-all"
                      required
                    >
                      <option value="" disabled>-- Selecciona --</option>
                      {availableProducts.map(prod => (
                        <option key={prod.id} value={prod.id}>{prod.key}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full md:col-span-3 flex md:justify-center">
                    <div className="w-full max-w-[120px]">
                      <label className="md:hidden block text-xs font-semibold text-[#64748B] dark:text-slate-400 mb-1">Cant. Pedida</label>
                      <input
                        type="number"
                        min="1"
                        value={item.orderedQuantity}
                        onChange={(e) => handleItemChange(index, 'orderedQuantity', e.target.value)}
                        className="w-full p-2.5 text-center border border-[#E2E8F0] dark:border-slate-700 rounded-lg focus:border-[#2A5D8F] dark:focus:border-[#5BA3D9] focus:ring-2 focus:ring-[#2A5D8F]/20 outline-none text-[#0F172A] dark:text-white font-mono font-bold bg-white dark:bg-[#1E293B] transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full md:col-span-3 flex md:justify-center">
                    <div className="w-full max-w-[120px]">
                      <label className="md:hidden block text-xs font-semibold text-[#64748B] dark:text-slate-400 mb-1">Cant. Surtida</label>
                      <input
                        type="number"
                        min="0"
                        value={item.deliveredQuantity}
                        onChange={(e) => handleItemChange(index, 'deliveredQuantity', e.target.value)}
                        className="w-full p-2.5 text-center border border-[#E2E8F0] dark:border-slate-700 rounded-lg focus:border-[#2A5D8F] dark:focus:border-[#5BA3D9] focus:ring-2 focus:ring-[#2A5D8F]/20 outline-none text-[#0F172A] dark:text-white font-mono font-bold bg-white dark:bg-[#1E293B] transition-all"
                      />
                    </div>
                  </div>
                  <div className="w-full md:col-span-1 flex justify-end md:justify-center mt-2 md:mt-0">
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = [...items];
                        newItems.splice(index, 1);
                        setItems(newItems);
                      }}
                      className="p-2 text-[#94A3B8] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                      title="Eliminar fila"
                      disabled={items.length === 1}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="bg-[#F8FAFC] dark:bg-[#1E293B] p-4 border-t border-[#E2E8F0] dark:border-slate-800 flex flex-col sm:flex-row justify-end items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#64748B] dark:text-slate-400 font-semibold">Total Pedido:</span>
                <span className="font-mono font-bold text-lg text-[#0F172A] dark:text-white">{totalOrdered}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#64748B] dark:text-slate-400 font-semibold">Total Surtido:</span>
                <span className={`font-mono font-bold text-lg ${totalDelivered >= totalOrdered && totalOrdered > 0 ? 'text-green-600 dark:text-green-400' : 'text-[#0F172A] dark:text-white'}`}>{totalDelivered}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Estatus */}
        <section>
          <h3 className="text-lg font-display font-bold text-[#0F172A] dark:text-white mb-6 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#2A5D8F]/10 dark:bg-[#5BA3D9]/10 text-[#2A5D8F] dark:text-[#5BA3D9] flex items-center justify-center text-sm lg:hidden">3</span>
            Estado y Envío
          </h3>
          
          <div className="bg-[#F8FAFC] dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-slate-800 p-8">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-[#E2E8F0] dark:bg-slate-700 -translate-y-1/2 rounded-full hidden sm:block"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-[#2A5D8F] dark:bg-[#5BA3D9] -translate-y-1/2 rounded-full transition-all duration-500 hidden sm:block"
                style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
              ></div>

              <div className="flex flex-col sm:flex-row justify-between items-center relative z-10 gap-4 sm:gap-0">
                {statuses.map((s, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const Icon = s.icon;
                  
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => handleStatusToggle(s.value)}
                      className={`flex flex-col items-center gap-2 group outline-none`}
                    >
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border-2
                          ${isCurrent ? 'bg-[#2A5D8F] dark:bg-[#5BA3D9] border-[#2A5D8F] dark:border-[#5BA3D9] text-white scale-110' : 
                            isCompleted ? 'bg-[#EFF6FF] dark:bg-[#1E4D73] border-[#2A5D8F] dark:border-[#5BA3D9] text-[#2A5D8F] dark:text-[#5BA3D9]' : 
                            'bg-white dark:bg-slate-800 border-[#E2E8F0] dark:border-slate-600 text-[#94A3B8] dark:text-slate-500 group-hover:border-[#94A3B8]'}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-sm font-semibold transition-colors
                        ${isCurrent ? 'text-[#0F172A] dark:text-white' : 
                          isCompleted ? 'text-[#2A5D8F] dark:text-[#5BA3D9]' : 
                          'text-[#64748B] dark:text-slate-500'}`}
                      >
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Acciones */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-8 border-t border-[#E2E8F0] dark:border-slate-800 gap-4">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-[#64748B] dark:text-slate-400 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>

          <button 
            type="submit"
            disabled={!isDirty}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-display font-bold shadow-md transition-all flex items-center justify-center h-[52px] gap-2
              ${isDirty ? 'bg-[#2A5D8F] hover:bg-[#1E4D73] text-white shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1' : 
              'bg-[#E2E8F0] dark:bg-slate-700 text-[#94A3B8] dark:text-slate-400 cursor-not-allowed shadow-none'}`}
          >
            <Save className="w-5 h-5" />
            {isEditing ? 'Guardar Cambios' : 'Crear Orden'}
          </button>
        </div>
      </form>
    </div>
  );
}
