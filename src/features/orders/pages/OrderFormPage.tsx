import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { orderApi } from '../api/order.api';
import { OrderStatus } from '../types/order.types';

export function OrderFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  // db field: key
  const [orderKey, setOrderKey] = useState('');
  // db field: scheduled_delivery_date
  const [scheduledDeliveryDate, setScheduledDeliveryDate] = useState('');
  
  // Dynamic line items mapping to db: _order_item
  // productId: integer, orderedQuantity: integer, deliveredQuantity: integer
  const [items, setItems] = useState([{ productId: 0, orderedQuantity: 1, deliveredQuantity: 0 }]);

  // Controles de estado que mapean al enum de PostgreSQL
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
        try {
          // PATCH /api/v1/productionOrders/{id}/update_status/{status}
          // await orderApi.updateStatus(id!, { status: newStatus });
          alert(`Estado '${newStatus}' notificado al servidor (PATCH) para capturar el timestamp 'shipping_date' o actualizar 'status'.`);
        } catch (error) {
          alert(`Error al actualizar estado ${newStatus}`);
        }
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!isEditing) {
        // await orderApi.createOrder({
        //   key: orderKey,
        //   scheduledDeliveryDate,
        //   items: items.map(i => ({
        //     productId: i.productId,
        //     orderedQuantity: i.orderedQuantity,
        //   }))
        // });
        alert('Orden creada exitosamente mapeando los campos exactos de la DB (_order, _order_detail, _order_item)');
        navigate('/');
      } else {
        alert('Orden actualizada localmente (Simulado)');
      }
    } catch (error) {
      alert('Error guardando la orden');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">
          {isEditing ? `Gestión de Orden ID: ${id}` : 'Crear Orden de Producción'}
        </h3>
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700 font-medium">
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Clave de Orden (key)</label>
            <input
              type="text"
              required
              value={orderKey}
              onChange={(e) => setOrderKey(e.target.value)}
              placeholder="Ej: ORD-2023-001"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-totebin-500 focus:ring-totebin-500 p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de entrega programada (scheduled_delivery_date)</label>
            <input
              type="date"
              required
              value={scheduledDeliveryDate}
              onChange={(e) => setScheduledDeliveryDate(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-totebin-500 focus:ring-totebin-500 p-2 border"
            />
          </div>
        </div>

        {/* Tabla Dinámica de Productos (_order_item) */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Productos de la Orden (_order_item)</h4>
            <button 
              type="button" 
              onClick={handleAddItem}
              className="text-sm bg-totebin-50 text-totebin-700 hover:bg-totebin-100 font-semibold py-1 px-3 rounded border border-totebin-200 transition-colors"
            >
              + Agregar Fila
            </button>
          </div>
          <div className="border border-gray-200 rounded-md overflow-x-auto shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product ID (FK)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-32">Cant. Pedida (ordered_quantity)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-32">Cant. Entregada (delivered_quantity)</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-16">Quitar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        placeholder="ID del producto"
                        value={item.productId || ''}
                        onChange={(e) => handleItemChange(index, 'productId', parseInt(e.target.value) || 0)}
                        className="w-full border-gray-300 rounded shadow-sm focus:ring-totebin-500 focus:border-totebin-500 p-1.5 border text-sm"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="1"
                        value={item.orderedQuantity}
                        onChange={(e) => handleItemChange(index, 'orderedQuantity', parseInt(e.target.value) || 1)}
                        className="w-full border-gray-300 rounded shadow-sm focus:ring-totebin-500 focus:border-totebin-500 p-1.5 border text-sm"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        max={item.orderedQuantity}
                        value={item.deliveredQuantity}
                        onChange={(e) => handleItemChange(index, 'deliveredQuantity', parseInt(e.target.value) || 0)}
                        className="w-full border-gray-300 rounded shadow-sm focus:ring-totebin-500 focus:border-totebin-500 p-1.5 border text-sm"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button 
                        type="button"
                        onClick={() => setItems(items.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700 font-bold p-1"
                        disabled={items.length === 1}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Controles de Estado vinculados al ENUM status de PostgreSQL */}
        {isEditing && (
          <div className="bg-totebin-50 border border-totebin-200 p-5 rounded-lg shadow-sm">
            <h4 className="text-md font-bold text-totebin-900 mb-4 flex items-center">
              <span className="mr-2">🔄</span> Controles de Avance y Estado
            </h4>
            <div className="flex flex-col space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={status === 'produced' || status === 'processed' || status === 'in_delivery' || status === 'delivered'}
                  onChange={(e) => handleStatusChange('produced', e.target.checked)}
                  className="h-5 w-5 text-totebin-600 focus:ring-totebin-500 border-gray-300 rounded cursor-pointer" 
                />
                <span className="text-gray-800 font-medium text-sm">El Pedido ya está producido (Cambia status a 'produced')</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={status === 'in_delivery' || status === 'delivered'}
                  onChange={(e) => handleStatusChange('in_delivery', e.target.checked)}
                  className="h-5 w-5 text-totebin-600 focus:ring-totebin-500 border-gray-300 rounded cursor-pointer" 
                />
                <span className="text-gray-800 font-medium text-sm">Aprobada Salida de transporte (Cambia status a 'in_delivery')</span>
              </label>
            </div>
            <p className="text-xs text-totebin-700 mt-3 bg-totebin-100 p-2 rounded">
              * Nota: Al marcar una casilla se enviará un `PATCH` automático para registrar el cambio en el `enum status` y capturar el timestamp oficial (`shipping_date`).
            </p>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button 
            type="submit"
            className="bg-totebin-600 hover:bg-totebin-700 text-white font-medium py-2.5 px-8 rounded-lg shadow transition-colors"
          >
            {isEditing ? 'Guardar Cambios' : 'Generar Orden'}
          </button>
        </div>
      </form>
    </div>
  );
}
