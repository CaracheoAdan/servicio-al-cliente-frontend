import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, Clock, CheckCircle2, Factory } from 'lucide-react';
import { orderService, CombinedOrder, OrderStatus } from '../../../shared/api/orderService';

export function ProductionTVPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const { data: orders = [], isLoading, isError } = useQuery<CombinedOrder[]>({
    queryKey: ['tv_orders_polling'],
    queryFn: () => orderService.getAllCombinedOrders(),
    refetchInterval: 15000,
  });

  const { activeOrders, finishedOrders } = useMemo(() => {
    const active: CombinedOrder[] = [];
    const finished: CombinedOrder[] = [];

    orders.forEach(order => {
      if ([OrderStatus.PRODUCED, OrderStatus.DELIVERED, OrderStatus.CLOSED].includes(order.status)) {
        finished.push(order);
      } else if (order.status !== OrderStatus.NONE) {
        active.push(order);
      }
    });

    return { activeOrders: active, finishedOrders: finished };
  }, [orders]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white font-display">
        <Factory className="w-24 h-24 text-[#5BA3D9] animate-pulse mb-8" />
        <h1 className="text-4xl font-bold animate-pulse">Cargando Tablero de Producción...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-red-400 font-display">
        <h1 className="text-4xl font-bold">Error al conectar con el servidor. Reintentando...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-body overflow-hidden flex flex-col">
      {/* HEADER */}
      <header className="bg-[#1E293B] border-b border-slate-800 p-6 flex justify-between items-center shrink-0 shadow-lg relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#2A5D8F]/20 rounded-2xl flex items-center justify-center text-[#5BA3D9]">
            <Factory className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-black text-white tracking-tight">Tablero de Producción</h1>
            <p className="text-xl text-slate-400 font-semibold mt-1 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10B981]"></span>
              Actualización en tiempo real
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-5xl font-display font-black text-white">
            {currentTime.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <p className="text-xl text-slate-400 font-semibold uppercase tracking-widest mt-1">
            {currentTime.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 grid grid-cols-12 gap-8 p-8 overflow-hidden bg-[#0B1120]">
        
        {/* ACTIVE ORDERS */}
        <section className="col-span-9 flex flex-col overflow-hidden bg-[#1E293B] rounded-3xl border border-slate-800 shadow-2xl">
          <div className="p-6 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-amber-400" />
              <h2 className="text-3xl font-display font-bold text-white">Órdenes a Producir</h2>
            </div>
            <span className="px-4 py-1.5 bg-amber-500/20 text-amber-400 font-bold text-xl rounded-xl">
              {activeOrders.length} Pendientes
            </span>
          </div>
          
          <div className="flex-1 overflow-auto p-6 scrollbar-hide">
            {activeOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <Package className="w-32 h-32 mb-6 opacity-20" />
                <p className="text-4xl font-bold font-display">No hay órdenes pendientes</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {activeOrders.map(order => (
                  <div key={order.id} className="bg-slate-900 border-l-4 border-[#5BA3D9] rounded-2xl p-6 shadow-xl flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-5">
                        <span className="px-5 py-2 bg-[#2A5D8F] text-white text-3xl font-black font-mono rounded-xl shadow-inner">
                          {order.key}
                        </span>
                        <span className="text-2xl text-slate-400 font-bold bg-slate-800 px-4 py-2 rounded-lg">
                          Entrega: <span className="text-amber-400">{order.detail?.scheduledDeliveryDate ? new Date(order.detail.scheduledDeliveryDate).toLocaleDateString('es-MX', {day: '2-digit', month: 'short'}) : 'N/A'}</span>
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-6 bg-slate-800 p-4 rounded-xl border border-slate-700/50">
                            <Package className="w-10 h-10 text-[#5BA3D9]" />
                            <div className="flex-1 text-3xl font-bold text-white truncate">
                              {item.productName}
                            </div>
                            <div className="text-4xl font-black font-mono text-emerald-400 bg-emerald-900/20 px-8 py-3 rounded-xl border border-emerald-800/30">
                              x{item.orderedQuantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FINISHED ORDERS */}
        <section className="col-span-3 flex flex-col overflow-hidden bg-[#1E293B] rounded-3xl border border-slate-800 shadow-2xl">
          <div className="p-6 bg-emerald-900/20 border-b border-slate-800 flex items-center gap-3 shrink-0">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <h2 className="text-2xl font-display font-bold text-white">Terminadas ({finishedOrders.length})</h2>
          </div>
          
          <div className="flex-1 overflow-auto p-5 scrollbar-hide">
            {finishedOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center">
                <CheckCircle2 className="w-20 h-20 mb-4 opacity-20" />
                <p className="text-2xl font-bold font-display">Sin órdenes terminadas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {finishedOrders.slice(0, 15).map(order => (
                  <div key={order.id} className="bg-emerald-900/10 border-l-4 border-emerald-500 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-black font-mono text-emerald-400">{order.key}</span>
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-lg uppercase tracking-wider">
                        LISTO
                      </span>
                    </div>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-slate-300 text-lg font-semibold truncate flex justify-between mt-2 border-t border-emerald-900/30 pt-2">
                        <span className="truncate mr-2">{item.productName}</span>
                        <span className="text-white font-mono font-bold">x{item.orderedQuantity}</span>
                      </div>
                    ))}
                  </div>
                ))}
                {finishedOrders.length > 15 && (
                  <div className="text-center text-slate-500 font-bold py-4 text-xl">
                    +{finishedOrders.length - 15} órdenes previas...
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
