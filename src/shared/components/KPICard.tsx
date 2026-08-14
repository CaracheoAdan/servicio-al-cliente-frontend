import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconColorClass?: string;
  trend?: number; // percentage
  trendLabel?: string;
  sparklineData?: number[];
  isPercentage?: boolean;
}

export function KPICard({ 
  title, 
  value, 
  icon, 
  iconColorClass = "text-[#2A5D8F]",
  trend = 5, 
  trendLabel = "vs ayer",
  sparklineData = [10, 25, 15, 30, 20, 40, 35],
  isPercentage = false
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseFloat(value as string) || 0;
  
  // Count-up animation
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = numericValue / (duration / 16); // 60fps
    
    if (numericValue === 0) {
      setDisplayValue(0);
      return;
    }

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        clearInterval(timer);
        setDisplayValue(numericValue);
      } else {
        setDisplayValue(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [numericValue]);

  const formattedValue = isPercentage 
    ? `${Math.round(displayValue)}%` 
    : Math.round(displayValue).toString();

  const isPositive = trend >= 0;

  // Simple SVG Sparkline
  const maxData = Math.max(...sparklineData);
  const minData = Math.min(...sparklineData);
  const range = maxData - minData || 1;
  const points = sparklineData.map((d, i) => {
    const x = (i / (sparklineData.length - 1)) * 100;
    const y = 100 - ((d - minData) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="group relative bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white dark:hover:bg-[#0F172A] overflow-hidden">
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] shadow-sm transition-transform group-hover:scale-110`}>
            {React.cloneElement(icon as React.ReactElement, { className: `w-5 h-5 ${iconColorClass}` })}
          </div>
          <div>
            <div className="text-[10px] font-display font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wide">{title}</div>
            <div className="font-mono font-bold text-2xl text-[#0F172A] dark:text-white tabular-nums leading-none mt-1">
              {formattedValue}
            </div>
          </div>
        </div>
        
        {trend !== 0 && (
          <div className={`flex flex-col items-end`}>
            <div className={`flex items-center text-xs font-bold ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(trend)}%
            </div>
            <span className="text-[9px] text-[#94A3B8] uppercase font-bold tracking-wider mt-0.5">{trendLabel}</span>
          </div>
        )}
      </div>

      <div className="mt-4 h-8 w-full opacity-50 group-hover:opacity-100 transition-opacity">
        <svg viewBox="0 -10 100 120" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <polyline
            fill="none"
            stroke={isPositive ? "#10B981" : "#EF4444"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="drop-shadow-sm"
          />
        </svg>
      </div>
      
      {/* Subtle background glow on hover */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none ${isPositive ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}></div>
    </div>
  );
}
