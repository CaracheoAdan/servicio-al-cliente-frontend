import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea
} from 'recharts';

// Datos de prueba para Salida de Camiones
// Mapeamos las horas a formato decimal (ej: 11.5 = 11:30 AM)
const transportData = [
  { order: 'ORD-010', time: 10.5, label: '10:30 AM (Anticipado)' },
  { order: 'ORD-011', time: 11.0, label: '11:00 AM (Ideal)' },
  { order: 'ORD-012', time: 11.25, label: '11:15 AM (Tolerancia)' },
  { order: 'ORD-013', time: 12.0, label: '12:00 PM (Retraso)' },
  { order: 'ORD-014', time: 11.45, label: '11:45 AM (Retraso)' },
  { order: 'ORD-015', time: 10.9, label: '10:54 AM (Anticipado)' },
];

const formatTimeAxis = (val: number) => {
  const hours = Math.floor(val);
  const mins = Math.round((val - hours) * 60);
  return `${hours}:${mins.toString().padStart(2, '0')}`;
};

// Datos de prueba para Cumplimiento (Cantidad Surtida / Cantidad Pedida * 100)
const fulfillmentData = [
  { order: 'ORD-010', fulfillment: 100 },
  { order: 'ORD-011', fulfillment: 85 },
  { order: 'ORD-012', fulfillment: 10 },
  { order: 'ORD-013', fulfillment: 50 },
  { order: 'ORD-014', fulfillment: 100 },
  { order: 'ORD-015', fulfillment: 100 },
];

export function ReportsPage() {
  return (
    <div className="space-y-8 font-sans">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Panel de Reportes</h2>
        <p className="text-gray-600">Visualización de métricas de transporte y cumplimiento.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gráfica 1: Picos de Transporte */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-totebin-900 mb-2">Horarios de Salida de Camiones</h3>
          <p className="text-sm text-gray-500 mb-6">Regla: Salida 11:00 AM. Tolerancia 30 mins (hasta 11:30 AM).</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transportData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="order" />
                <YAxis domain={[9, 13]} tickFormatter={formatTimeAxis} />
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => [props.payload.label, 'Hora de Salida']} 
                />
                <Legend />
                {/* Zona Ideal y Tolerancia */}
                <ReferenceArea y1={11.0} y2={11.5} fill="#dcfce7" fillOpacity={0.5} />
                
                {/* Lineas de Referencia */}
                <ReferenceLine y={11.0} stroke="#16a34a" strokeDasharray="3 3" label="Meta (11:00)" />
                <ReferenceLine y={11.5} stroke="#eab308" strokeDasharray="3 3" label="Límite Tolerancia (11:30)" />
                
                <Line 
                  type="monotone" 
                  dataKey="time" 
                  name="Hora Real de Salida" 
                  stroke="#14532d" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfica 2: Cumplimiento */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-totebin-900 mb-2">Porcentaje de Cumplimiento</h3>
          <p className="text-sm text-gray-500 mb-6">Fórmula: (Surtida / Pedida) * 100%.</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fulfillmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="order" />
                <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                <Tooltip formatter={(val) => `${val}%`} />
                <Legend />
                <Bar dataKey="fulfillment" name="% Cumplimiento" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
