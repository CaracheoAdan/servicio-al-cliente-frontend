import React, { useState, useEffect } from 'react';
import { Download, Table as TableIcon } from 'lucide-react';
import { api } from '../../../shared/api/axiosInstance';
import { orderService } from '../../../shared/api/orderService';
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

        // Fetch fully hydrated orders
        const orders = await orderService.getAllCombinedOrders();

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
              fechaCompromiso: order.detail.scheduledDeliveryDate || order.detail.scheduled_delivery_date ? new Date(order.detail.scheduledDeliveryDate || order.detail.scheduled_delivery_date).toLocaleDateString() : '',
              cantidadSurtida: '',
              producidoSi: isProduced ? 'X' : '',
              producidoNo: !isProduced ? 'X' : '',
              salidaSi: isDelivered ? 'X' : '',
              salidaNo: !isDelivered ? 'X' : '',
              fechaEnvio: order.detail.shippingDate || order.detail.shipping_date ? new Date(order.detail.shippingDate || order.detail.shipping_date).toLocaleDateString() : '',
              cerrarPedido: isClosed ? 'Cerrado' : '',
              comentarios: order.detail.comments || ''
            });
          } else {
            items.forEach((item: any, index: number) => {
              flattenedData.push({
                noOrden: index === 0 ? order.key : '',
                producto: productMap.get(item.productId || item.product_id) || item.productId || item.product_id || '',
                cantidadPedida: item.orderedQuantity || item.ordered_quantity || 0,
                fechaCompromiso: index === 0 && (order.detail.scheduledDeliveryDate || order.detail.scheduled_delivery_date) ? new Date(order.detail.scheduledDeliveryDate || order.detail.scheduled_delivery_date).toLocaleDateString() : '',
                cantidadSurtida: item.deliveredQuantity || item.delivered_quantity || 0,
                producidoSi: index === 0 && isProduced ? 'X' : '',
                producidoNo: index === 0 && !isProduced ? 'X' : '',
                salidaSi: index === 0 && isDelivered ? 'X' : '',
                salidaNo: index === 0 && !isDelivered ? 'X' : '',
                fechaEnvio: index === 0 && (order.detail.shippingDate || order.detail.shipping_date) ? new Date(order.detail.shippingDate || order.detail.shipping_date).toLocaleDateString() : '',
                cerrarPedido: index === 0 && isClosed ? 'Cerrado' : '',
                comentarios: index === 0 && order.detail.comments ? order.detail.comments : ''
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
    <div className="bg-white rounded-[28px] shadow-card-base border border-[#E3E9E6] overflow-hidden font-body animate-fade-in-up">
      <div className="p-8 border-b border-[#E3E9E6] flex justify-between items-center bg-white rounded-t-[28px] relative overflow-hidden">
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-[#F0FDF4] p-3 rounded-2xl border border-[#E3E9E6]">
            <TableIcon className="w-8 h-8 text-[#15803D]" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-extrabold text-[#0F1B17] tracking-tight">Tabla Maestra de Órdenes</h3>
            <p className="text-sm text-[#6B7B76] mt-1 font-body">Vista detallada estilo Excel para exportación y análisis</p>
          </div>
        </div>
        <button 
          onClick={handleExportExcel}
          disabled={loading || data.length === 0}
          className="bg-[#15803D] hover:bg-[#116932] disabled:opacity-60 text-white px-6 py-3.5 rounded-2xl font-display font-bold shadow-btn-3d transition-all flex items-center gap-2 text-sm z-10"
        >
          <Download className="w-5 h-5" />
          Descargar Excel
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-b-[28px]" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-[#F7FAF8] border-b border-[#E3E9E6]">
              <th colSpan={5} className="px-6 py-3 border-r border-[#EDF1EF]"></th>
              <th colSpan={2} className="px-6 py-3 text-center border-r border-[#EDF1EF] text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Pedido ya está producido</th>
              <th colSpan={2} className="px-6 py-3 text-center border-r border-[#EDF1EF] text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Salida de transporte</th>
              <th colSpan={3} className="px-6 py-3"></th>
            </tr>
            <tr className="bg-[#F7FAF8] border-b border-[#E3E9E6]">
              <th className="px-6 py-4 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide border-r border-[#EDF1EF]">No. Orden</th>
              <th className="px-6 py-4 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide border-r border-[#EDF1EF]">Producto</th>
              <th className="px-6 py-4 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide border-r border-[#EDF1EF]">Cantidad pedida</th>
              <th className="px-6 py-4 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide border-r border-[#EDF1EF]">Fecha compromiso</th>
              <th className="px-6 py-4 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide border-r border-[#EDF1EF]">Cantidad surtida</th>
              <th className="px-6 py-4 text-center text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide border-r border-[#EDF1EF]">Sí</th>
              <th className="px-6 py-4 text-center text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide border-r border-[#EDF1EF]">No</th>
              <th className="px-6 py-4 text-center text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide border-r border-[#EDF1EF]">Sí</th>
              <th className="px-6 py-4 text-center text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide border-r border-[#EDF1EF]">No</th>
              <th className="px-6 py-4 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide border-r border-[#EDF1EF]">Fecha de envio</th>
              <th className="px-6 py-4 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide border-r border-[#EDF1EF]">Cerrar pedido</th>
              <th className="px-6 py-4 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Comentarios</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDF1EF]">
            {loading ? (
              <tr><td colSpan={12} className="px-6 py-12 text-center font-display font-bold text-[#0F1B17]">Cargando tabla...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={12} className="px-6 py-12 text-center font-display font-bold text-[#0F1B17]">No hay datos para mostrar</td></tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F0FDF4] transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-[#0F1B17] border-r border-[#EDF1EF]">{row.noOrden}</td>
                  <td className="px-6 py-4 font-mono text-[#4B5A5D] border-r border-[#EDF1EF]">{row.producto}</td>
                  <td className="px-6 py-4 font-mono text-[#4B5A5D] border-r border-[#EDF1EF] text-center">{row.cantidadPedida}</td>
                  <td className="px-6 py-4 font-mono text-[#4B5A5D] border-r border-[#EDF1EF] text-center">{row.fechaCompromiso}</td>
                  <td className="px-6 py-4 font-mono text-[#4B5A5D] border-r border-[#EDF1EF] text-center">{row.cantidadSurtida}</td>
                  <td className="px-6 py-4 text-center font-display font-bold text-[#15803D] border-r border-[#EDF1EF] bg-[#F0FDF4]/30">{row.producidoSi}</td>
                  <td className="px-6 py-4 text-center font-display font-bold text-[#DC2626] border-r border-[#EDF1EF]">{row.producidoNo}</td>
                  <td className="px-6 py-4 text-center font-display font-bold text-[#D97706] border-r border-[#EDF1EF] bg-[#FFFBEB]/30">{row.salidaSi}</td>
                  <td className="px-6 py-4 text-center font-display font-bold text-[#DC2626] border-r border-[#EDF1EF]">{row.salidaNo}</td>
                  <td className="px-6 py-4 font-mono text-[#4B5A5D] border-r border-[#EDF1EF] text-center">{row.fechaEnvio}</td>
                  <td className="px-6 py-4 font-display font-bold text-[#0F1B17] border-r border-[#EDF1EF] text-center">{row.cerrarPedido}</td>
                  <td className="px-6 py-4 font-body text-[#4B5A5D] text-sm max-w-[200px] truncate" title={row.comentarios}>{row.comentarios}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
