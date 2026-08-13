import React from 'react';
import { BarChart3, Clock, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea
} from 'recharts';

const formatTimeAxis = (val: number) => {
  const hours = Math.floor(val);
  const mins = Math.round((val - hours) * 60);
  return `${hours}:${mins.toString().padStart(2, '0')}`;
};

export function ReportsPage() {
  // Datos simulados para propósitos de UI (hasta conectar la API final)
  const transportData = [
    { order: 'ORD-101', time: 10.5, label: '10:30 AM' },
    { order: 'ORD-102', time: 11.0, label: '11:00 AM' },
    { order: 'ORD-103', time: 11.25, label: '11:15 AM' },
    { order: 'ORD-104', time: 12.0, label: '12:00 PM' },
    { order: 'ORD-105', time: 10.9, label: '10:54 AM' },
  ];

  const fulfillmentData = [
    { order: 'ORD-101', fulfillment: 100 },
    { order: 'ORD-102', fulfillment: 85 },
    { order: 'ORD-103', fulfillment: 10 },
    { order: 'ORD-104', fulfillment: 50 },
    { order: 'ORD-105', fulfillment: 100 },
  ];

  return (
    <div className="space-y-8 font-sans animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <TrendingUp className="mr-3 h-8 w-8 text-totebin-600" />
          Panel de Analíticas
        </h2>
        <p className="text-gray-500 mt-2 text-sm">Visualización avanzada de métricas de transporte y rendimiento de órdenes.</p>
      </div>

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
          
          <div className="h-80 w-full">
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
          
          <div className="h-80 w-full">
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
          </div>
        </div>
      </div>
    </div>
  );
}
