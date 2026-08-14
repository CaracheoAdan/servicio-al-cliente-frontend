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
              horaEnvio: order.detail.shippingDate || order.detail.shipping_date ? new Date(order.detail.shippingDate || order.detail.shipping_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
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
                horaEnvio: index === 0 && (order.detail.shippingDate || order.detail.shipping_date) ? new Date(order.detail.shippingDate || order.detail.shipping_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
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
        ['No. Orden', 'Producto', 'Cantidad pedida', 'Fecha compromiso de entrega', 'Cantidad surtida', 'Si', 'No', 'Si', 'No', 'Hora de envio', 'Cerrar pedido', 'Comentarios para sistemas'],
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
          row.horaEnvio,
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
    <div className="bg-white rounded-2xl shadow-card-base border border-[#E2E8F0] overflow-hidden font-body animate-fade-in-up">
      <div className="p-6 border-b border-[#E2E8F0] flex flex-col md:flex-row justify-between items-center bg-white rounded-t-2xl gap-4">
        <div className="font-display font-bold text-[#0F172A] text-lg flex items-center gap-2">
          <TableIcon className="w-5 h-5 text-[#2A5D8F]" />
          Exportación de Datos
        </div>
        <button 
          onClick={handleExportExcel}
          disabled={loading || data.length === 0}
          className="bg-[#2A5D8F] hover:bg-[#1E4D73] disabled:opacity-60 text-white px-6 py-3.5 rounded-2xl font-display font-bold shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1 transition-all flex items-center justify-center gap-2 text-sm z-10 whitespace-nowrap"
        >
          <Download className="w-5 h-5" />
          Descargar Excel
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-b-2xl" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th colSpan={5} className="px-6 py-3 border-r border-[#E2E8F0]"></th>
              <th colSpan={2} className="px-6 py-3 text-center border-r border-[#E2E8F0] text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Pedido ya está producido</th>
              <th colSpan={2} className="px-6 py-3 text-center border-r border-[#E2E8F0] text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Salida de transporte</th>
              <th colSpan={3} className="px-6 py-3"></th>
            </tr>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className="px-6 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide border-r border-[#E2E8F0]">No. Orden</th>
              <th className="px-6 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide border-r border-[#E2E8F0]">Producto</th>
              <th className="px-6 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide border-r border-[#E2E8F0]">Cantidad pedida</th>
              <th className="px-6 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide border-r border-[#E2E8F0]">Fecha compromiso</th>
              <th className="px-6 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide border-r border-[#E2E8F0]">Cantidad surtida</th>
              <th className="px-6 py-4 text-center text-xs font-display font-bold text-[#64748B] uppercase tracking-wide border-r border-[#E2E8F0]">Sí</th>
              <th className="px-6 py-4 text-center text-xs font-display font-bold text-[#64748B] uppercase tracking-wide border-r border-[#E2E8F0]">No</th>
              <th className="px-6 py-4 text-center text-xs font-display font-bold text-[#64748B] uppercase tracking-wide border-r border-[#E2E8F0]">Sí</th>
              <th className="px-6 py-4 text-center text-xs font-display font-bold text-[#64748B] uppercase tracking-wide border-r border-[#E2E8F0]">No</th>
              <th className="px-6 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide border-r border-[#E2E8F0]">Hora de envio</th>
              <th className="px-6 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide border-r border-[#E2E8F0]">Cerrar pedido</th>
              <th className="px-6 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Comentarios</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {loading ? (
              <tr><td colSpan={12} className="px-6 py-12 text-center font-display font-bold text-[#0F172A]">Cargando tabla...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={12} className="px-6 py-12 text-center font-display font-bold text-[#0F172A]">No hay datos para mostrar</td></tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#EFF6FF] transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-[#0F172A] border-r border-[#E2E8F0]">{row.noOrden}</td>
                  <td className="px-6 py-4 font-mono text-[#475569] border-r border-[#E2E8F0]">{row.producto}</td>
                  <td className="px-6 py-4 font-mono text-[#475569] border-r border-[#E2E8F0] text-center">{row.cantidadPedida}</td>
                  <td className="px-6 py-4 font-mono text-[#475569] border-r border-[#E2E8F0] text-center">{row.fechaCompromiso}</td>
                  <td className="px-6 py-4 font-mono text-[#475569] border-r border-[#E2E8F0] text-center">{row.cantidadSurtida}</td>
                  <td className="px-6 py-4 text-center font-display font-bold text-[#2A5D8F] border-r border-[#E2E8F0] bg-[#EFF6FF]/30">{row.producidoSi}</td>
                  <td className="px-6 py-4 text-center font-display font-bold text-[#DC2626] border-r border-[#E2E8F0]">{row.producidoNo}</td>
                  <td className="px-6 py-4 text-center font-display font-bold text-[#D97706] border-r border-[#E2E8F0] bg-[#FFFBEB]/30">{row.salidaSi}</td>
                  <td className="px-6 py-4 text-center font-display font-bold text-[#DC2626] border-r border-[#E2E8F0]">{row.salidaNo}</td>
                  <td className="px-6 py-4 font-mono text-[#475569] border-r border-[#E2E8F0] text-center">{row.horaEnvio}</td>
                  <td className="px-6 py-4 font-display font-bold text-[#0F172A] border-r border-[#E2E8F0] text-center">{row.cerrarPedido}</td>
                  <td className="px-6 py-4 font-body text-[#475569] text-sm max-w-[200px] truncate" title={row.comentarios}>{row.comentarios}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
