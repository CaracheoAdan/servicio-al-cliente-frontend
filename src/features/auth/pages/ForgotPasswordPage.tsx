import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Por favor, ingresa tu correo electrónico.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call for password reset
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      toast.success('Instrucciones enviadas a tu correo');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0F172A] flex items-center justify-center p-4 font-body transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden border border-[#E2E8F0] dark:border-gray-700 animate-fade-in-up">
        <div className="p-8 md:p-10">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-[#EFF6FF] dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Mail className="w-8 h-8 text-[#2A5D8F] dark:text-blue-400" />
            </div>
            <h1 className="font-display font-black text-2xl text-[#0F172A] dark:text-white tracking-tight mb-2">Recuperar Contraseña</h1>
            <p className="text-[#64748B] dark:text-gray-400 text-sm leading-relaxed">
              {isSent 
                ? "Revisa tu bandeja de entrada. Te hemos enviado un enlace para restablecer tu contraseña." 
                : "Ingresa el correo electrónico asociado a tu cuenta y te enviaremos instrucciones para recuperarla."}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold text-[#475569] dark:text-gray-300 uppercase tracking-wider font-display">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#94A3B8] dark:text-gray-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] dark:bg-gray-900 border border-[#E2E8F0] dark:border-gray-700 rounded-xl text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:bg-white focus:ring-2 focus:ring-[#2A5D8F] focus:border-transparent transition-all sm:text-sm"
                    placeholder="tu@empresa.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_4px_0_#1B3D5C] text-sm font-bold font-display text-white bg-[#2A5D8F] hover:bg-[#1E4D73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A5D8F] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Instrucciones
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <button
                onClick={() => { setIsSent(false); setEmail(''); }}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl border-2 border-[#E2E8F0] dark:border-gray-700 text-sm font-bold font-display text-[#475569] dark:text-gray-300 hover:bg-[#F8FAFC] dark:hover:bg-gray-700 transition-all"
              >
                Intentar con otro correo
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm font-bold text-[#2A5D8F] dark:text-blue-400 hover:text-[#1E4D73] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
