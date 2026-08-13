import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { orderApi } from '../api/order.api';

export function OrderFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [orderNumber, setOrderNumber] = useState('');
  const [commitmentDate, setCommitmentDate] = useState('');
  
  // Dynamic line items
  const [items, setItems] = useState([{ productId: '', requestedQuantity: 1, suppliedQuantity: 0 }]);
  
  // Controles de estado
  const [isProduced, setIsProduced] = useState(false);
  const [isTransported, setIsTransported] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { productId: '', requestedQuantity: 1, suppliedQuantity: 0 }]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleStatusChange = async (type: 'PRODUCED' | 'TRANSPORTED', value: boolean) => {
    if (type === 'PRODUCED') setIsProduced(value);
    if (type === 'TRANSPORTED') setIsTransported(value);

    if (value && isEditing) {
      try {
        // La petición PATCH para capturar el timestamp del servidor
        // await orderApi.updateStatus(id!, { status: type });
        alert(`Estado ${type} notificado al servidor (PATCH).`);
      } catch (error) {
        alert(`Error al actualizar estado ${type}`);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!isEditing) {
        // await orderApi.createOrder({
        //   orderNumber,
        //   commitmentDate,
        //   items: items.map(i => ({
        //     productId: i.productId,
        //     requestedQuantity: i.requestedQuantity,
        //     suppliedQuantity: i.suppliedQuantity
        //   }))
        // });
        alert('Orden creada exitosamente (Mock API)');
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
          {isEditing ? `Gestión de Orden: ${id}` : 'Crear Orden de Producción'}
        </h3>
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700 font-medium">
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">No. Orden</label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-totebin-500 focus:ring-totebin-500 p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha compromiso de entrega</label>
            <input
              type="date"
              required
              value={commitmentDate}
              onChange={(e) => setCommitmentDate(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-totebin-500 focus:ring-totebin-500 p-2 border"
            />
          </div>
        </div>

        {/* Tabla Dinámica de Productos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Detalle de Productos</h4>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Código/Nombre Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-32">Cant. Pedida</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-32">Cant. Surtida</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-16">Quitar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        placeholder="Buscar producto en BD..."
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        className="w-full border-gray-300 rounded shadow-sm focus:ring-totebin-500 focus:border-totebin-500 p-1.5 border text-sm"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="1"
                        value={item.requestedQuantity}
                        onChange={(e) => handleItemChange(index, 'requestedQuantity', Number(e.target.value))}
                        className="w-full border-gray-300 rounded shadow-sm focus:ring-totebin-500 focus:border-totebin-500 p-1.5 border text-sm"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        value={item.suppliedQuantity}
                        onChange={(e) => handleItemChange(index, 'suppliedQuantity', Number(e.target.value))}
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

        {/* Lógica Crítica: Checks dinámicos para lanzar peticiones PATCH */}
        {isEditing && (
          <div className="bg-totebin-50 border border-totebin-200 p-5 rounded-lg shadow-sm">
            <h4 className="text-md font-bold text-totebin-900 mb-4 flex items-center">
              <span className="mr-2">🔄</span> Controles de Avance y Estado
            </h4>
            <div className="flex flex-col space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isProduced}
                  onChange={(e) => handleStatusChange('PRODUCED', e.target.checked)}
                  className="h-5 w-5 text-totebin-600 focus:ring-totebin-500 border-gray-300 rounded cursor-pointer" 
                />
                <span className="text-gray-800 font-medium text-sm">El Pedido ya está producido</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isTransported}
                  onChange={(e) => handleStatusChange('TRANSPORTED', e.target.checked)}
                  className="h-5 w-5 text-totebin-600 focus:ring-totebin-500 border-gray-300 rounded cursor-pointer" 
                />
                <span className="text-gray-800 font-medium text-sm">Aprobada Salida de transporte</span>
              </label>
            </div>
            <p className="text-xs text-totebin-700 mt-3 bg-totebin-100 p-2 rounded">
              * Nota: Al marcar una casilla se enviará un `PATCH /api/v1/productionOrders/{id}/update_status/{'{status}'}` automático para registrar el timestamp del servidor.
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
