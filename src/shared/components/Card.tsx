import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  withGlow?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', withGlow = false, ...props }) => {
  const glowClasses = withGlow ? 'card-glow relative overflow-hidden' : '';
  
  return (
    <div 
      className={`bg-white dark:bg-[#0F172A] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-[#E2E8F0] dark:border-slate-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-shadow duration-300 ${glowClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 border-b border-[#E2E8F0] dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#0F172A] rounded-t-2xl ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};
