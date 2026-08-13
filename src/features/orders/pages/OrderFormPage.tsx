import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Plus, X, RefreshCw, FileText } from 'lucide-react';
import { OrderStatus } from '../types/order.types';

export function OrderFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [orderKey, setOrderKey] = useState('');
  const [scheduledDeliveryDate, setScheduledDeliveryDate] = useState('');
  const [items, setItems] = useState([{ productId: 0, orderedQuantity: 1, deliveredQuantity: 0 }]);
  const [status, setStatus] = useState<OrderStatus>('open');

  const handleAddItem = () => {
    setItems([...items, { productId: 0, orderedQuantity: 1, deliveredQuantity: 0 }]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleStatusChange = async (newStatus: OrderStatus, checked: boolean) => {
    if (checked) {
      setStatus(newStatus);
      if (isEditing) {
        toast.success(`Estado actualizado a '${newStatus}'`, {
          icon: '🔄',
          style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) {
      toast.success('Orden creada exitosamente.', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      setTimeout(() => navigate('/'), 1000);
    } else {
      toast.success('Orden actualizada.', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden font-sans animate-fade-in-up">
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <FileText className="w-6 h-6 text-totebin-600 mr-3" />
          {isEditing ? `Gestión de Orden ID: ${id}` : 'Crear Orden de Producción'}
        </h3>
        <button onClick={() => navigate('/')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-bold text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </button>
      </div>

      <form onSubmit={handleSave} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Clave de Orden (key)</label>
            <input
              type="text"
              required
              value={orderKey}
              onChange={(e) => setOrderKey(e.target.value)}
              placeholder="Ej: ORD-2023-001"
              className="block w-full border-gray-200 rounded-xl shadow-sm focus:border-totebin-500 focus:ring-totebin-500 px-4 py-3 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Fecha programada (scheduled_delivery_date)</label>
            <input
              type="date"
              required
              value={scheduledDeliveryDate}
              onChange={(e) => setScheduledDeliveryDate(e.target.value)}
              className="block w-full border-gray-200 rounded-xl shadow-sm focus:border-totebin-500 focus:ring-totebin-500 px-4 py-3 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-gray-900">Productos de la Orden (_order_item)</h4>
            <button 
              type="button" 
              onClick={handleAddItem}
              className="text-sm bg-totebin-50 text-totebin-700 hover:bg-totebin-100 font-bold py-2 px-4 rounded-lg border border-totebin-200 transition-colors flex items-center shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Agregar Fila
            </button>
          </div>
          <div className="border border-gray-100 rounded-xl overflow-x-auto shadow-sm">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Product ID (FK)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase w-40">Pedida (ordered)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase w-40">Surtida (delivered)</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase w-20">Acción</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <input
                        type="number"
                        placeholder="ID"
                        value={item.productId || ''}
                        onChange={(e) => handleItemChange(index, 'productId', parseInt(e.target.value) || 0)}
                        className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-totebin-500 focus:border-totebin-500 px-3 py-2 text-sm"
                        required
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="number"
                        min="1"
                        value={item.orderedQuantity}
                        onChange={(e) => handleItemChange(index, 'orderedQuantity', parseInt(e.target.value) || 1)}
                        className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-totebin-500 focus:border-totebin-500 px-3 py-2 text-sm"
                        required
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="number"
                        min="0"
                        max={item.orderedQuantity}
                        value={item.deliveredQuantity}
                        onChange={(e) => handleItemChange(index, 'deliveredQuantity', parseInt(e.target.value) || 0)}
                        className="w-full border-gray-200 rounded-lg shadow-sm focus:ring-totebin-500 focus:border-totebin-500 px-3 py-2 text-sm bg-gray-50"
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
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm">
            <h4 className="text-md font-bold text-slate-800 mb-5 flex items-center">
              <RefreshCw className="mr-2 w-5 h-5 text-slate-500" /> Controles de Avance (PATCH)
            </h4>
            <div className="flex flex-col space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={status === 'produced' || status === 'processed' || status === 'in_delivery' || status === 'delivered'}
                  onChange={(e) => handleStatusChange('produced', e.target.checked)}
                  className="h-5 w-5 text-totebin-600 focus:ring-totebin-500 border-gray-300 rounded cursor-pointer transition-shadow" 
                />
                <span className="text-gray-700 font-semibold text-sm group-hover:text-gray-900 transition-colors">
                  El Pedido ya está producido <span className="text-gray-400 font-normal ml-1">(Cambia a 'produced')</span>
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={status === 'in_delivery' || status === 'delivered'}
                  onChange={(e) => handleStatusChange('in_delivery', e.target.checked)}
                  className="h-5 w-5 text-totebin-600 focus:ring-totebin-500 border-gray-300 rounded cursor-pointer transition-shadow" 
                />
                <span className="text-gray-700 font-semibold text-sm group-hover:text-gray-900 transition-colors">
                  Aprobada Salida de transporte <span className="text-gray-400 font-normal ml-1">(Cambia a 'in_delivery')</span>
                </span>
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-8 border-t border-gray-100">
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
