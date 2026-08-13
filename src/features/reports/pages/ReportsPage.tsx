import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, TrendingUp } from 'lucide-react';
import { api } from '../../../shared/api/axiosInstance';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea
} from 'recharts';

const formatTimeAxis = (val: number) => {
  const hours = Math.floor(val);
  const mins = Math.round((val - hours) * 60);
  return `${hours}:${mins.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
};

import { orderService } from '../../../shared/api/orderService';

export function ReportsPage() {
  const [transportData, setTransportData] = useState<any[]>([]);
  const [fulfillmentData, setFulfillmentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndComputeReports = async () => {
      try {
        setLoading(true);
        // Pedimos todas las órdenes reales al servidor, completamente hidratadas
        const orders = await orderService.getAllCombinedOrders();

        const transport: any[] = [];
        const fulfillment: any[] = [];

        orders.forEach((order: any) => {
          // --- Cálculo de Picos de Transporte ---
          // Usar la relación detail
          const shippingDateStr = order.detail?.shippingDate || order.detail?.shipping_date || order.detail?.scheduledDeliveryDate;
          
          if (shippingDateStr) {
            const date = new Date(shippingDateStr);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const decimalTime = hours + (minutes / 60);
            
            // Solo lo incluimos si es una hora razonable de envío (por ej, descartar las de 00:00 por defecto)
            if (hours > 0) {
              transport.push({
                order: order.key,
                time: decimalTime,
                label: formatTimeAxis(decimalTime)
              });
            }
          }

          // --- Cálculo de Cumplimiento ---
          if (order.items && order.items.length > 0) {
            let totalOrdered = 0;
            let totalDelivered = 0;

            order.items.forEach((item: any) => {
              totalOrdered += (item.ordered_quantity || item.orderedQuantity || 0);
              totalDelivered += (item.delivered_quantity || item.deliveredQuantity || 0);
            });

            if (totalOrdered > 0) {
              const percentage = Math.round((totalDelivered / totalOrdered) * 100);
              fulfillment.push({
                order: order.key,
                fulfillment: percentage
              });
            }
          }
        });

        setTransportData(transport);
        setFulfillmentData(fulfillment);

      } catch (error) {
        console.error("Error al generar reportes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndComputeReports();
  }, []);

  return (
    <div className="space-y-8 font-sans animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <TrendingUp className="mr-3 h-8 w-8 text-totebin-600" />
          Panel de Analíticas
        </h2>
        <p className="text-gray-500 mt-2 text-sm">Visualización avanzada calculada desde la base de datos real en tiempo real.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-bold">Procesando miles de registros desde el servidor...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfica 1: Picos de Transporte */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <div className="bg-totebin-50 p-2 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-totebin-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Salida de Camiones (shipping_date)</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6 pl-12">Regla: Salida 11:00 AM. Tolerancia hasta 11:30 AM.</p>
            
            <div className="h-80 w-full relative">
              {transportData.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">No hay órdenes con fecha de salida registrada.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={transportData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="order" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis domain={[9, 13]} tickFormatter={formatTimeAxis} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [props.payload.label, 'Salida']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <ReferenceArea y1={11.0} y2={11.5} fill="#dcfce7" fillOpacity={0.4} />
                    <ReferenceLine y={11.0} stroke="#16a34a" strokeDasharray="4 4" label={{ position: 'top', value: 'Meta (11:00)', fill: '#16a34a', fontSize: 12 }} />
                    <ReferenceLine y={11.5} stroke="#eab308" strokeDasharray="4 4" label={{ position: 'top', value: 'Límite (11:30)', fill: '#eab308', fontSize: 12 }} />
                    <Line 
                      type="monotone" 
                      dataKey="time" 
                      stroke="#16a34a" 
                      strokeWidth={4}
                      dot={{ fill: '#16a34a', strokeWidth: 2, r: 6, stroke: '#ffffff' }}
                      activeDot={{ r: 8, strokeWidth: 0, fill: '#14532d' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Gráfica 2: Cumplimiento */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <div className="bg-totebin-50 p-2 rounded-lg mr-3">
                <BarChart3 className="h-5 w-5 text-totebin-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Nivel de Cumplimiento</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6 pl-12">Fórmula: (Entregado / Pedido) * 100%.</p>
            
            <div className="h-80 w-full relative">
              {fulfillmentData.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">No hay productos en las órdenes actuales.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fulfillmentData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="order" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(val) => [`${val}%`, 'Cumplimiento']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      cursor={{fill: '#f8fafc'}}
                    />
                    <Bar 
                      dataKey="fulfillment" 
                      fill="#16a34a" 
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
