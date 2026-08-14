import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, TrendingUp, Truck, CheckCircle2 } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in-up font-body">
      <div className="flex flex-col lg:flex-row justify-end items-center bg-white p-6 rounded-2xl shadow-card-base border border-[#E2E8F0] relative overflow-hidden gap-4">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] px-5 py-2.5 rounded-2xl flex items-center shadow-sm relative z-10">
          <Clock className="w-4 h-4 text-[#2A5D8F] mr-2" />
          <span className="text-sm font-display font-bold text-[#0F172A]">
            Última actualización: <span className="font-mono ml-1">{new Date().toLocaleTimeString()}</span>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-card-base border border-[#E2E8F0]">
          <div className="text-center">
             <div className="inline-block animate-spin w-8 h-8 border-4 border-[#2A5D8F] border-t-transparent rounded-full mb-4"></div>
             <p className="font-display font-bold text-[#0F172A]">Calculando estadísticas...</p>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* KPI 1: Eficiencia (Ejemplo) */}
            <div className="bg-white p-6 rounded-2xl shadow-card-base border border-[#E2E8F0] flex items-center space-x-4 card-glow transition-all">
              <div className="bg-[#EFF6FF] p-4 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-[#2A5D8F]" />
              </div>
              <div>
                <p className="text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Eficiencia OEE</p>
                <p className="text-3xl font-mono font-bold text-[#0F172A] mt-1">92<span className="text-lg text-[#94A3B8]">%</span></p>
              </div>
            </div>

            {/* KPI 2: Ordenes Entregadas */}
            <div className="bg-white p-6 rounded-2xl shadow-card-base border border-[#E2E8F0] flex items-center space-x-4 card-glow transition-all">
              <div className="bg-[#FFFBEB] p-4 rounded-2xl">
                <Truck className="w-8 h-8 text-[#D97706]" />
              </div>
              <div>
                <p className="text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Órdenes Procesadas</p>
                <p className="text-3xl font-mono font-bold text-[#0F172A] mt-1">{transportData.length} <span className="text-lg text-[#94A3B8]">órdenes</span></p>
              </div>
            </div>

            {/* KPI 3: Promedio Cumplimiento */}
            <div className="bg-white p-6 rounded-2xl shadow-card-base border border-[#E2E8F0] flex items-center space-x-4 card-glow transition-all">
              <div className="bg-[#EFF6FF] p-4 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-[#2A5D8F]" />
              </div>
              <div>
                <p className="text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Cumplimiento Global</p>
                <p className="text-3xl font-mono font-bold text-[#0F172A] mt-1">
                  {fulfillmentData.length > 0 ? Math.round(fulfillmentData.reduce((acc, curr) => acc + curr.fulfillment, 0) / fulfillmentData.length) : 0}
                  <span className="text-lg text-[#94A3B8]">%</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-card-base border border-[#E2E8F0]">
              <div className="flex items-center mb-6">
                <div className="w-2 h-6 bg-[#2A5D8F] rounded-full mr-3"></div>
                <h4 className="text-lg font-display font-bold text-[#0F172A]">Salida de Camiones (shipping_date)</h4>
              </div>
              <p className="text-xs font-mono text-[#94A3B8] mb-6">Regla: Salida 11:00 AM. Tolerancia hasta 11:30 AM.</p>
              
              <div className="h-80 w-full relative">
                {transportData.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-[#94A3B8]">No hay órdenes con fecha de salida registrada.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={transportData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="order" tick={{fill: '#64748B', fontSize: 12, fontFamily: 'IBM Plex Mono'}} axisLine={false} tickLine={false} />
                      <YAxis domain={[9, 13]} tickFormatter={formatTimeAxis} tick={{fill: '#64748B', fontSize: 12, fontFamily: 'IBM Plex Mono'}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        formatter={(value: number, name: string, props: any) => [props.payload.label, 'Salida']}
                        contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontFamily: 'IBM Plex Mono' }}
                      />
                      <ReferenceArea y1={11.0} y2={11.5} fill="#2A5D8F" fillOpacity={0.1} />
                      <ReferenceLine y={11.0} stroke="#2A5D8F" strokeDasharray="4 4" label={{ position: 'top', value: 'Meta (11:00)', fill: '#2A5D8F', fontSize: 12, fontFamily: 'IBM Plex Mono' }} />
                      <ReferenceLine y={11.5} stroke="#D97706" strokeDasharray="4 4" label={{ position: 'top', value: 'Límite (11:30)', fill: '#D97706', fontSize: 12, fontFamily: 'IBM Plex Mono' }} />
                      <Line 
                        type="monotone" 
                        dataKey="time" 
                        stroke="#2A5D8F" 
                        strokeWidth={4}
                        dot={{ fill: '#2A5D8F', strokeWidth: 2, r: 6, stroke: '#ffffff' }}
                        activeDot={{ r: 8, strokeWidth: 0, fill: '#1E4D73' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card-base border border-[#E2E8F0]">
              <div className="flex items-center mb-6">
                <div className="w-2 h-6 bg-[#2A5D8F] rounded-full mr-3"></div>
                <h4 className="text-lg font-display font-bold text-[#0F172A]">Nivel de Cumplimiento</h4>
              </div>
              <p className="text-xs font-mono text-[#94A3B8] mb-6">Fórmula: (Entregado / Pedido) * 100%.</p>
              
              <div className="h-80 w-full relative">
                {fulfillmentData.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-[#94A3B8]">No hay productos en las órdenes actuales.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fulfillmentData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="order" tick={{fill: '#64748B', fontSize: 12, fontFamily: 'IBM Plex Mono'}} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} tick={{fill: '#64748B', fontSize: 12, fontFamily: 'IBM Plex Mono'}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        formatter={(val) => [`${val}%`, 'Cumplimiento']}
                        contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', fontFamily: 'IBM Plex Mono' }}
                        cursor={{fill: '#F8FAFC'}}
                      />
                      <Bar 
                        dataKey="fulfillment" 
                        fill="#2A5D8F" 
                        radius={[8, 8, 0, 0]}
                        barSize={40}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
