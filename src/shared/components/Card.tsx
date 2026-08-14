import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  withGlow?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', withGlow = false, ...props }) => {
  const glowClasses = withGlow ? 'card-glow relative overflow-hidden' : '';
  
  return (
    <div 
      className={`bg-white rounded-2xl shadow-card-base border border-[#E2E8F0] ${glowClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 border-b border-[#E2E8F0] flex justify-between items-center ${className}`} {...props}>
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
