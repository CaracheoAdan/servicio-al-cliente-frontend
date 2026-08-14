import React, { useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from './Button';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      icon: <AlertTriangle className="w-8 h-8" />,
      iconBg: 'bg-[#FEF2F2] dark:bg-red-900/30 text-[#DC2626] dark:text-red-400',
      buttonVariant: 'danger' as const
    },
    warning: {
      icon: <AlertCircle className="w-8 h-8" />,
      iconBg: 'bg-[#FFFBEB] dark:bg-amber-900/30 text-[#D97706] dark:text-amber-400',
      buttonVariant: 'primary' as const // Or a custom warning style if added to button
    },
    info: {
      icon: <Info className="w-8 h-8" />,
      iconBg: 'bg-[#EFF6FF] dark:bg-blue-900/30 text-[#2A5D8F] dark:text-blue-400',
      buttonVariant: 'primary' as const
    }
  };

  const config = variantConfig[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 dark:bg-[#0F172A]/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl w-full max-w-md p-6 lg:p-8 font-body border border-[#E2E8F0] dark:border-slate-700 animate-fade-in-up transition-all"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl flex-shrink-0 ${config.iconBg}`}>
              {config.icon}
            </div>
            <div>
              <h3 className="font-display font-bold text-[#0F172A] dark:text-white text-xl">
                {title}
              </h3>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-[#475569] dark:text-slate-300 text-base leading-relaxed mb-8">
          {message}
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            variant="secondary" 
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button 
            variant={config.buttonVariant} 
            onClick={onConfirm}
            className={variant === 'warning' ? 'bg-[#D97706] hover:bg-[#B45309] shadow-[0_4px_0_#92400E] active:shadow-[0_0px_0_#92400E] active:translate-y-1 focus:ring-[#D97706]' : ''}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
