import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0F172A] flex flex-col items-center justify-center p-4 font-body transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8 md:p-12 text-center border border-[#E2E8F0] dark:border-gray-700 animate-fade-in-up">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-amber-600 dark:text-amber-500" />
        </div>
        
        <h1 className="font-display font-black text-5xl text-[#0F172A] dark:text-white mb-2 tracking-tight">404</h1>
        <h2 className="font-display font-bold text-xl text-[#334155] dark:text-gray-300 mb-4">Página no encontrada</h2>
        
        <p className="text-[#64748B] dark:text-gray-400 text-sm mb-8 leading-relaxed">
          Lo sentimos, la ruta que intentas acceder no existe, ha sido movida o no tienes los permisos necesarios para verla.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl font-display font-bold text-sm bg-[#F1F5F9] dark:bg-gray-700 text-[#475569] dark:text-gray-300 hover:bg-[#E2E8F0] dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Regresar
          </button>
          
          <Link 
            to="/"
            className="px-6 py-3 rounded-xl font-display font-bold text-sm bg-[#2A5D8F] hover:bg-[#1E4D73] text-white shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1 transition-all flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
