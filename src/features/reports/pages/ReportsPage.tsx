import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, TrendingUp, Truck, CheckCircle2, Smile, Meh, Frown, Activity, Sun, Moon } from 'lucide-react';
import { api } from '../../../shared/api/axiosInstance';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea, Cell
} from 'recharts';

const formatTimeAxis = (val: number) => {
  const hours = Math.floor(val);
  const mins = Math.round((val - hours) * 60);
  return `${hours}:${mins.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
};

import { orderService } from '../../../shared/api/orderService';

const CustomFulfillmentTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPerfect = data.fulfillment === 100;
    const isWarning = data.fulfillment >= 80 && data.fulfillment < 100;
    const isDanger = data.fulfillment < 80;
    
    return (
      <div className="bg-[#0F172A] p-5 rounded-2xl shadow-2xl border border-[#334155] font-body text-white min-w-[200px] animate-fade-in-up">
        <p className="font-display font-bold text-[#94A3B8] mb-2 uppercase tracking-wide text-[10px]">Orden <span className="text-white text-xs ml-1">#{label}</span></p>
        <div className="flex items-end gap-2 mb-4">
          <p className={`text-4xl font-mono font-bold leading-none ${isPerfect ? 'text-[#10B981]' : isWarning ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
            {data.fulfillment}%
          </p>
        </div>
        <div className="pt-3 border-t border-[#334155] flex justify-between gap-6 text-xs">
           <div>
             <p className="text-[#64748B] uppercase tracking-wide text-[10px] mb-1">Pedido</p>
             <p className="font-mono font-bold text-white">{data.totalOrdered} <span className="text-[#64748B] font-normal">unds</span></p>
           </div>
           <div className="text-right">
             <p className="text-[#64748B] uppercase tracking-wide text-[10px] mb-1">Entregado</p>
             <p className="font-mono font-bold text-white">{data.totalDelivered} <span className="text-[#64748B] font-normal">unds</span></p>
           </div>
        </div>
      </div>
    );
  }
  return null;
};

import { useReports } from '../hooks/useReports';

const RealTimeClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const isDay = hours >= 6 && hours < 18; // 6am to 6pm
  
  let shiftName = "TURNO NOCTURNO";
  if (hours >= 6 && hours < 14) shiftName = "TURNO MATUTINO";
  else if (hours >= 14 && hours < 22) shiftName = "TURNO VESPERTINO";

  // Using specific options for Mexico locale to ensure correct AM/PM and formatting
  const timeString = time.toLocaleTimeString('es-MX', { hour12: true, hour: '2-digit', minute: '2-digit' });
  const [timeVal, ampmRaw] = timeString.split(' ');
  const ampm = (ampmRaw || '').replace(/\./g, '').toUpperCase();
  const seconds = time.getSeconds().toString().padStart(2, '0');
  
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const dateString = time.toLocaleDateString('es-MX', dateOptions);
  const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

  return (
    <div className="bg-gradient-to-br from-[#BFDBFE] to-white border border-[#DBEAFE] rounded-3xl p-6 shadow-card-brand relative overflow-hidden flex items-center justify-between w-full lg:w-auto">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-white/80 backdrop-blur-md w-16 h-16 rounded-full flex items-center justify-center shadow-sm border border-white/60 mr-6 z-10">
          {isDay ? <Sun className="w-8 h-8 text-[#F59E0B]" /> : <Moon className="w-8 h-8 text-[#6366F1]" />}
        </div>
        <div className="flex flex-col z-10">
          <div className="flex items-baseline">
            <span className="text-6xl font-mono font-bold text-[#0F172A] tracking-tighter leading-none">{timeVal.replace(/^0/, '')}</span>
            <span className="text-2xl font-mono text-[#2A5D8F] opacity-60 ml-1">:{seconds}</span>
            <span className="text-base font-display font-bold text-[#2A5D8F] ml-3">{ampm}</span>
          </div>
          <div className="flex items-center mt-3 gap-3">
            <span className="text-base font-display font-medium text-[#0F172A]">{formattedDate}</span>
            <span className="bg-[#2A5D8F] text-white text-xs px-3 py-1.5 rounded-lg font-bold tracking-wider shadow-sm uppercase">{shiftName}</span>
          </div>
        </div>
      </div>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
    </div>
  );
};

export function ReportsPage() {
  const { loading, error, transportData, fulfillmentData, latestOrder, generalMetrics } = useReports();

  const getFaceConfig = (score: number) => {
    if (score >= 75) return { emoji: '😃', color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]', border: 'border-[#D1FAE5]' };
    if (score >= 60) return { emoji: '😐', color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB]', border: 'border-[#FEF3C7]' };
    return { emoji: '😞', color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]', border: 'border-[#FEE2E2]' };
  };

  const faceConfig = getFaceConfig(generalMetrics?.general || 0);

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-card-base border border-red-200">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up font-body">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="bg-gradient-to-r from-[#BFDBFE] to-white p-6 rounded-3xl shadow-card-brand border border-[#DBEAFE] flex-1 w-full h-full flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          <div className="font-display font-bold text-[#0F172A] text-xl flex items-center gap-3 mb-2 relative z-10">
            <div className="flex-shrink-0 bg-white/80 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center shadow-sm border border-white/60">
              <BarChart3 className="w-6 h-6 text-[#2A5D8F]" />
            </div>
            Inteligencia de Negocios
          </div>
          <p className="text-[#475569] text-sm max-w-md relative z-10 font-medium">Monitoreo en tiempo real de operaciones, nivel de cumplimiento de surtido y picos de distribución de camiones.</p>
        </div>
        <RealTimeClock />
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
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Última Orden Salida */}
            {latestOrder ? (
              <div className="bg-gradient-to-br from-[#BFDBFE] to-white p-6 md:p-8 rounded-3xl shadow-card-brand border border-[#DBEAFE] card-glow transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
                  <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <div className="flex-shrink-0 bg-white/80 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center shadow-sm border border-white/60">
                      <Truck className="w-7 h-7 text-[#2A5D8F]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-display font-bold text-[#475569] uppercase tracking-wide">Último Camión Lanzado</h3>
                      <p className="text-2xl font-mono font-bold text-[#0F172A]">Orden <span className="text-[#2A5D8F]">#{latestOrder.key}</span></p>
                    </div>
                  </div>
                  <div className="bg-[#2A5D8F] px-4 py-2 rounded-xl shadow-sm flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse mr-2"></div>
                    <span className="font-display font-bold text-sm text-white uppercase tracking-wider">
                      {latestOrder.status?.toLowerCase() === 'delivered' ? 'ENTREGADO' : latestOrder.status?.toLowerCase() === 'closed' ? 'CERRADO' : 'EN TRÁNSITO'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-6 relative z-10 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#E2E8F0]">
                      <Clock className="w-5 h-5 text-[#64748B]" />
                    </div>
                    <div>
                      <p className="text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Hora de Salida</p>
                      <p className="font-mono font-bold text-[#2A5D8F] text-lg">{latestOrder.shippingDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 border-l-0 md:border-l border-white/50 md:pl-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#E2E8F0]">
                      <CheckCircle2 className="w-5 h-5 text-[#2A5D8F]" />
                    </div>
                    <div>
                      <p className="text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Cumplimiento</p>
                      <p className="font-mono font-bold text-[#2A5D8F] text-lg">{latestOrder.fulfillment}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-l-0 md:border-l border-white/50 md:pl-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#E2E8F0]">
                      <TrendingUp className="w-5 h-5 text-[#D97706]" />
                    </div>
                    <div>
                      <p className="text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Prods. Surtidos</p>
                      <p className="font-mono font-bold text-[#2A5D8F] text-lg">{latestOrder.totalDelivered} <span className="text-sm font-medium text-[#64748B]">de {latestOrder.totalOrdered}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-card-base border border-[#E2E8F0] flex flex-col items-center justify-center text-center">
                <Truck className="w-10 h-10 text-[#94A3B8] mb-3" />
                <h3 className="font-display font-bold text-[#0F172A] text-lg">No hay camiones en ruta</h3>
                <p className="text-[#64748B] text-sm mt-1">Cuando liberes una orden, aparecerá aquí como la última salida.</p>
              </div>
            )}

            {/* Cumplimiento General */}
            <div className="bg-gradient-to-bl from-[#BFDBFE] to-white p-6 md:p-8 rounded-3xl shadow-card-brand border border-[#DBEAFE] card-glow transition-all relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 bg-white/80 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center shadow-sm border border-white/60">
                    <Activity className="w-7 h-7 text-[#2A5D8F]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-bold text-[#475569] uppercase tracking-wide">Cumplimiento General</h3>
                    <p className="text-xs text-[#64748B] font-medium mt-0.5">Surtido x Tiempo</p>
                  </div>
                </div>
                <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full border-4 flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-sm transition-transform hover:scale-110 cursor-default select-none ${faceConfig.border}`}>
                  <span className="text-7xl md:text-8xl drop-shadow-sm" role="img" aria-label="Status Face">
                    {faceConfig.emoji}
                  </span>
                </div>
              </div>

              <div className="flex items-end gap-3 mb-6 relative z-10">
                <p className={`text-6xl font-mono font-bold leading-none tracking-tight ${faceConfig.color}`}>
                  {generalMetrics.general}%
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-4 relative z-10 shadow-sm">
                <div>
                  <p className="text-[10px] font-display font-bold text-[#64748B] uppercase tracking-wide mb-1">Cump. de Entregas (Cant.)</p>
                  <p className="font-mono font-bold text-[#2A5D8F] text-lg">{generalMetrics.fulfillPct}%</p>
                </div>
                <div className="border-l border-white/50 pl-4">
                  <p className="text-[10px] font-display font-bold text-[#64748B] uppercase tracking-wide mb-1">Cump. a Entregas (Tiempo)</p>
                  <p className="font-mono font-bold text-[#2A5D8F] text-lg">{generalMetrics.onTimePct}%</p>
                </div>
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
                    <BarChart data={fulfillmentData} margin={{ top: 30, right: 30, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                        </linearGradient>
                        <linearGradient id="colorMid" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F59E0B" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#D97706" stopOpacity={0.8}/>
                        </linearGradient>
                        <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#EF4444" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#DC2626" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="order" tick={{fill: '#64748B', fontSize: 12, fontFamily: 'IBM Plex Mono'}} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} tick={{fill: '#64748B', fontSize: 12, fontFamily: 'IBM Plex Mono'}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        content={<CustomFulfillmentTooltip />}
                        cursor={{fill: '#F8FAFC'}}
                      />
                      <Bar 
                        dataKey="fulfillment" 
                        radius={[8, 8, 0, 0]}
                        barSize={48}
                        animationDuration={1500}
                        label={{ position: 'top', fill: '#0F172A', fontSize: 12, fontWeight: 'bold', fontFamily: 'IBM Plex Mono', formatter: (val: number) => `${val}%` }}
                      >
                        {fulfillmentData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.fulfillment === 100 ? "url(#colorHigh)" : entry.fulfillment >= 80 ? "url(#colorMid)" : "url(#colorLow)"} 
                          />
                        ))}
                      </Bar>
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
