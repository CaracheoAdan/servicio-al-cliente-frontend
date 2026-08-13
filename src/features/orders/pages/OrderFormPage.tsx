import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Plus, X, FileText, CheckCircle2 } from 'lucide-react';
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
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${id}`);
          const data = res.data.data || res.data;
          setOrderKey(data.key || '');
          if (data.scheduled_delivery_date || data.scheduledDeliveryDate) {
            setScheduledDeliveryDate((data.scheduled_delivery_date || data.scheduledDeliveryDate).split('T')[0]);
          }
          setStatus(data.status || 'open');
          
          if (data.items && data.items.length > 0) {
            setItems(data.items.map((i: any) => ({
              productId: i.product_id || i.productId || '',
              orderedQuantity: i.ordered_quantity || i.orderedQuantity || 1,
              deliveredQuantity: i.delivered_quantity || i.deliveredQuantity || 0
            })));
          }
        } catch (error) {
          console.error("Error fetching order:", error);
          toast.error('Error al cargar la orden.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
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
      toast.success(`Estado seleccionado: ${newStatus}. No olvides Guardar Cambios.`, {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        key: orderKey,
        status: status,
        scheduledDeliveryDate: scheduledDeliveryDate,
        items: items
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
      console.error("Error saving order:", error);
      toast.error('Error al guardar la orden. Revisa la consola o backend.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Cargando datos del servidor...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden font-sans animate-fade-in-up">
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <FileText className="w-6 h-6 text-totebin-600 mr-3" />
          {isEditing ? `Gestión de No. Orden: ${id}` : 'Registro de Orden de Producción'}
        </h3>
        <button onClick={() => navigate('/orders')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-bold text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Regresar
        </button>
      </div>

      <form onSubmit={handleSave} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div>
            <label className="block text-sm font-extrabold text-gray-800 mb-2">No. Orden</label>
            <input
              type="text"
              required
              value={orderKey}
              onChange={(e) => setOrderKey(e.target.value)}
              placeholder="Ej: 12515"
              className="block w-full border-gray-200 rounded-xl shadow-sm focus:border-totebin-500 focus:ring-totebin-500 px-4 py-3 bg-white transition-colors font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-extrabold text-gray-800 mb-2">Fecha compromiso de entrega</label>
            <input
              type="date"
              required
              value={scheduledDeliveryDate}
              onChange={(e) => setScheduledDeliveryDate(e.target.value)}
              className="block w-full border-gray-200 rounded-xl shadow-sm focus:border-totebin-500 focus:ring-totebin-500 px-4 py-3 bg-white transition-colors font-semibold"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-gray-900 flex items-center">
              Productos <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">"Una orden puede tener varios productos"</span>
            </h4>
            <button 
              type="button" 
              onClick={handleAddItem}
              className="text-sm bg-totebin-50 text-totebin-700 hover:bg-totebin-100 font-bold py-2 px-4 rounded-lg border border-totebin-200 transition-colors flex items-center shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Nuevo Producto
            </button>
          </div>
          <div className="border border-gray-100 rounded-xl overflow-x-auto shadow-sm">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-slate-700">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-slate-700 w-40">Cantidad pedida</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider w-40">Cantidad surtida</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider w-16">X</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3 border-r border-gray-100">
                      <input
                        type="text"
                        placeholder="Ej: 10000489"
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-totebin-500 focus:border-totebin-500 px-3 py-2 text-sm font-semibold"
                        required
                      />
                    </td>
                    <td className="px-6 py-3 border-r border-gray-100">
                      <input
                        type="number"
                        min="1"
                        value={item.orderedQuantity}
                        onChange={(e) => handleItemChange(index, 'orderedQuantity', parseInt(e.target.value) || 1)}
                        className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-totebin-500 focus:border-totebin-500 px-3 py-2 text-sm font-semibold"
                        required
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="number"
                        min="0"
                        value={item.deliveredQuantity}
                        onChange={(e) => handleItemChange(index, 'deliveredQuantity', parseInt(e.target.value) || 0)}
                        className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-totebin-500 focus:border-totebin-500 px-3 py-2 text-sm font-semibold text-totebin-700 bg-totebin-50"
                      />
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button 
                        type="button"
                        onClick={() => setItems(items.filter((_, i) => i !== index))}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                        disabled={items.length === 1}
                      >
                        <X className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className={`border rounded-xl p-5 transition-colors ${status === 'produced' || status === 'in_delivery' || status === 'delivered' ? 'bg-totebin-50 border-totebin-200' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Pedido ya está producido</h4>
                  <p className="text-xs text-gray-500">Marcar "Sí" captura la fecha/hora del servidor.</p>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer bg-white border border-gray-300 rounded-lg p-1 px-3 shadow-sm hover:bg-gray-50">
                  <span className="text-sm font-bold text-gray-700">Sí</span>
                  <input 
                    type="checkbox" 
                    checked={status === 'produced' || status === 'in_delivery' || status === 'delivered'}
                    onChange={() => handleStatusToggle('produced')}
                    className="h-5 w-5 text-totebin-600 focus:ring-totebin-500 border-gray-300 rounded cursor-pointer" 
                  />
                </label>
              </div>
            </div>

            <div className={`border rounded-xl p-5 transition-colors ${status === 'in_delivery' || status === 'delivered' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Salida de transporte para entrega</h4>
                  <p className="text-xs text-gray-500">Marcar "Sí" captura la 'Fecha de envio'.</p>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer bg-white border border-gray-300 rounded-lg p-1 px-3 shadow-sm hover:bg-gray-50">
                  <span className="text-sm font-bold text-gray-700">Sí</span>
                  <input 
                    type="checkbox" 
                    checked={status === 'in_delivery' || status === 'delivered'}
                    onChange={() => handleStatusToggle('in_delivery')}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" 
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
          {isEditing ? (
            <button
              type="button"
              onClick={() => handleStatusToggle('closed')}
              className={`flex items-center px-6 py-3 rounded-xl font-bold shadow-sm transition-colors ${status === 'closed' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'}`}
              disabled={status === 'closed'}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {status === 'closed' ? 'Pedido Cerrado' : 'Cerrar pedido'}
            </button>
          ) : <div></div>}

          <button 
            type="submit"
            className="bg-totebin-600 hover:bg-totebin-700 hover:shadow-lg hover:-translate-y-0.5 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all duration-200 flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {isEditing ? 'Guardar Cambios' : 'Generar Orden'}
          </button>
        </div>
      </form>
    </div>
  );
}
