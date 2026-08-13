import React, { useState, useEffect } from 'react';
import { Download, Table as TableIcon } from 'lucide-react';
import { api } from '../../../shared/api/axiosInstance';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

export function MasterTablePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products to map product_id to product_key
        const prodRes = await api.get('/products');
        const prodData = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.items || prodRes.data.data || []);
        const productMap = new Map(prodData.map((p: any) => [p.id, p.key]));

        // Fetch orders
        const res = await api.get('/orders');
        const orders = Array.isArray(res.data) ? res.data : (res.data.items || res.data.data || []);

        const flattenedData: any[] = [];

        orders.forEach((order: any) => {
          const items = order.items || [];
          const status = order.status;
          
          const isProduced = ['produced', 'in_delivery', 'delivered', 'closed'].includes(status);
          const isDelivered = ['in_delivery', 'delivered', 'closed'].includes(status);
          const isClosed = status === 'closed';

          if (items.length === 0) {
            flattenedData.push({
              noOrden: order.key,
              producto: '',
              cantidadPedida: '',
              fechaCompromiso: order.scheduled_delivery_date || order.scheduledDeliveryDate ? new Date(order.scheduled_delivery_date || order.scheduledDeliveryDate).toLocaleDateString() : '',
              cantidadSurtida: '',
              producidoSi: isProduced ? 'X' : '',
              producidoNo: !isProduced ? 'X' : '',
              salidaSi: isDelivered ? 'X' : '',
              salidaNo: !isDelivered ? 'X' : '',
              fechaEnvio: order.shipping_date || order.shippingDate ? new Date(order.shipping_date || order.shippingDate).toLocaleDateString() : '',
              cerrarPedido: isClosed ? 'Cerrado' : '',
              comentarios: ''
            });
          } else {
            items.forEach((item: any, index: number) => {
              flattenedData.push({
                noOrden: index === 0 ? order.key : '',
                producto: productMap.get(item.productId || item.product_id) || item.productId || item.product_id || '',
                cantidadPedida: item.orderedQuantity || item.ordered_quantity || 0,
                fechaCompromiso: index === 0 && (order.scheduled_delivery_date || order.scheduledDeliveryDate) ? new Date(order.scheduled_delivery_date || order.scheduledDeliveryDate).toLocaleDateString() : '',
                cantidadSurtida: item.deliveredQuantity || item.delivered_quantity || 0,
                producidoSi: index === 0 && isProduced ? 'X' : '',
                producidoNo: index === 0 && !isProduced ? 'X' : '',
                salidaSi: index === 0 && isDelivered ? 'X' : '',
                salidaNo: index === 0 && !isDelivered ? 'X' : '',
                fechaEnvio: index === 0 && (order.shipping_date || order.shippingDate) ? new Date(order.shipping_date || order.shippingDate).toLocaleDateString() : '',
                cerrarPedido: index === 0 && isClosed ? 'Cerrado' : '',
                comentarios: ''
              });
            });
          }
        });

        setData(flattenedData);
      } catch (error) {
        console.error("Error fetching master table data:", error);
        toast.error('Error al cargar la tabla consolidada.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportExcel = () => {
    try {
      // Create worksheet mapping precise Excel columns
      const wsData = [
        // Header Row 1 (Super headers)
        ['', '', '', '', '', 'Pedido ya esta producido', '', 'Salida de transporte para entrega al cliente', '', '', '', ''],
        // Header Row 2
        ['No. Orden', 'Producto', 'Cantidad pedida', 'Fecha compromiso de entrega', 'Cantidad surtida', 'Si', 'No', 'Si', 'No', 'Fecha de envio', 'Cerrar pedido', 'Comentarios para sistemas'],
        // Data Rows
        ...data.map(row => [
          row.noOrden,
          row.producto,
          row.cantidadPedida,
          row.fechaCompromiso,
          row.cantidadSurtida,
          row.producidoSi,
          row.producidoNo,
          row.salidaSi,
          row.salidaNo,
          row.fechaEnvio,
          row.cerrarPedido,
          row.comentarios
        ])
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Merge cells for the super headers to replicate exactly the requested format
      ws['!merges'] = [
        { s: { r: 0, c: 5 }, e: { r: 0, c: 6 } }, // Merge "Pedido ya esta producido" across Si/No
        { s: { r: 0, c: 7 }, e: { r: 0, c: 8 } }  // Merge "Salida de transporte..." across Si/No
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte Maestro');
      
      XLSX.writeFile(wb, 'Reporte_Ordenes_Totebin.xlsx');
      
      toast.success('Excel exportado correctamente.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
    } catch (error) {
      console.error(error);
      toast.error('Error al generar Excel.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden font-sans animate-fade-in-up">
      <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center space-x-4">
          <div className="bg-totebin-50 p-3 rounded-xl">
            <TableIcon className="w-8 h-8 text-totebin-600" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Tabla Maestra de Órdenes</h3>
            <p className="text-sm text-gray-500 mt-1">Vista consolidada idéntica al formato Excel, con capacidad de exportación.</p>
          </div>
        </div>
        <button 
          onClick={handleExportExcel}
          disabled={loading || data.length === 0}
          className="bg-green-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-green-700 transition-all duration-200 text-sm font-bold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5 mr-2" />
          Exportar Excel
        </button>
      </div>

      <div className="overflow-x-auto w-full" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        <table className="w-full whitespace-nowrap">
          <thead className="bg-slate-800 sticky top-0 z-10">
            <tr>
              <th colSpan={5} className="px-4 py-2 border-r border-slate-700"></th>
              <th colSpan={2} className="px-4 py-2 border-r border-slate-700 text-center text-xs font-bold text-white uppercase bg-slate-700">Pedido ya esta producido</th>
              <th colSpan={2} className="px-4 py-2 border-r border-slate-700 text-center text-xs font-bold text-white uppercase bg-slate-600">Salida de transporte</th>
              <th colSpan={3} className="px-4 py-2"></th>
            </tr>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 border-r border-slate-700">No. Orden</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 border-r border-slate-700">Producto</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-300 border-r border-slate-700">Cantidad pedida</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-300 border-r border-slate-700">Fecha compromiso</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-300 border-r border-slate-700">Cantidad surtida</th>
              
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-300 border-r border-slate-700">Si</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-300 border-r border-slate-700">No</th>
              
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-300 border-r border-slate-700">Si</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-300 border-r border-slate-700">No</th>
              
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-300 border-r border-slate-700">Fecha de envio</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-300 border-r border-slate-700">Cerrar pedido</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300">Comentarios para sistemas</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={12} className="px-8 py-12 text-center text-sm text-gray-500 font-medium">Cargando base de datos completa...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-8 py-12 text-center text-sm text-gray-500 font-medium">No hay registros para mostrar.</td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-2 border-r border-gray-100 font-bold text-sm text-gray-900">{row.noOrden}</td>
                  <td className="px-4 py-2 border-r border-gray-100 text-sm font-medium text-gray-700">{row.producto}</td>
                  <td className="px-4 py-2 border-r border-gray-100 text-center text-sm font-semibold text-gray-600">{row.cantidadPedida}</td>
                  <td className="px-4 py-2 border-r border-gray-100 text-center text-sm text-gray-500">{row.fechaCompromiso}</td>
                  <td className="px-4 py-2 border-r border-gray-100 text-center text-sm font-semibold text-totebin-700 bg-totebin-50">{row.cantidadSurtida}</td>
                  
                  <td className="px-4 py-2 border-r border-gray-100 text-center font-bold text-green-600">{row.producidoSi}</td>
                  <td className="px-4 py-2 border-r border-gray-100 text-center font-bold text-red-600">{row.producidoNo}</td>
                  
                  <td className="px-4 py-2 border-r border-gray-100 text-center font-bold text-green-600">{row.salidaSi}</td>
                  <td className="px-4 py-2 border-r border-gray-100 text-center font-bold text-red-600">{row.salidaNo}</td>
                  
                  <td className="px-4 py-2 border-r border-gray-100 text-center text-sm text-gray-500">{row.fechaEnvio}</td>
                  <td className="px-4 py-2 border-r border-gray-100 text-center text-sm text-gray-500 font-bold">{row.cerrarPedido}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">{row.comentarios}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
