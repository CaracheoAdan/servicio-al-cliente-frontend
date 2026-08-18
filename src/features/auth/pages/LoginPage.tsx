import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Button } from '../../../shared/components/Button';

import { AnimatedLogoContainer } from '../components/AnimatedLogoContainer';
import { authApi } from '../api/auth.api';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('totebin_token', response.accessToken);
      localStorage.setItem('totebin_user', JSON.stringify(response.user));
      toast.success(`Bienvenido, ${response.user.firstName}!`, {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
      let errorMsg = 'Error inesperado al intentar acceder al sistema.';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          const serverDetail = error.response.data?.detail || error.response.data?.title || error.response.data?.message;

          if (status === 401) {
            errorMsg = 'El correo o la contraseña están equivocados.';
          } else if (status === 404) {
            errorMsg = 'No existe ninguna cuenta registrada con este correo.';
          } else if (status === 400) {
            errorMsg = serverDetail || 'Faltan datos o tienen un formato incorrecto.';
          } else if (status === 403) {
            errorMsg = 'Tu cuenta no tiene permisos para acceder o está suspendida.';
          } else if (status >= 500) {
            errorMsg = 'Problemas con el servidor. Intenta nuevamente más tarde.';
          } else if (serverDetail) {
            errorMsg = serverDetail;
          }

          // Si el backend manda un mensaje específico en 400/401, intentamos traducirlo o dar más contexto
          const lowerDetail = serverDetail?.toLowerCase() || '';
          if (lowerDetail.includes('not found') || lowerDetail.includes('no existe')) {
              errorMsg = 'No existe ninguna cuenta registrada con este correo.';
          } else if (lowerDetail.includes('password') || lowerDetail.includes('contraseña')) {
              errorMsg = 'La contraseña ingresada es incorrecta.';
          }
        } else if (error.request) {
          errorMsg = 'No se pudo conectar con el servidor. Revisa tu conexión a internet o intenta de nuevo.';
        }
      }

      toast.error(errorMsg, {
        style: { borderRadius: '10px', background: '#EF4444', color: '#fff', fontWeight: 'bold' },
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };


  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 6;

  return (
    <div className="min-h-screen flex font-sans bg-white dark:bg-[#0B1120]">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#1E4D73] via-[#2A5D8F] to-[#5BA3D9] overflow-hidden items-center justify-center">
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#1E4D73]/40 blur-3xl"></div>
        
        <div className="relative z-10 text-center px-12 animate-fade-in-up">
          <AnimatedLogoContainer />
          <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">Totebin</h1>
          <p className="text-xl text-blue-100 max-w-md mx-auto leading-relaxed">
            Plataforma premium de gestión de clientes y seguimiento de órdenes.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative">
        <div className="absolute top-8 right-8 lg:hidden">
          <div className="h-12 w-12 bg-[#2A5D8F] rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            T
          </div>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <h2 className="text-3xl font-extrabold text-[#0F172A] dark:text-white mb-2">
              Bienvenido de nuevo
            </h2>
            <p className="text-[#475569] dark:text-slate-400 mb-8">
              Ingresa tus credenciales para acceder al sistema.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <label htmlFor="email" className="block text-sm font-semibold text-[#475569] dark:text-slate-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  className={`appearance-none block w-full px-4 py-3.5 bg-[#F8FAFC] dark:bg-[#1E293B] border rounded-xl shadow-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2A5D8F]/20 sm:text-sm text-[#0F172A] dark:text-white transition-all
                    ${emailTouched ? (isEmailValid ? 'border-green-500 focus:border-green-500' : 'border-red-500 focus:border-red-500') : 'border-[#E2E8F0] dark:border-slate-700 focus:border-[#2A5D8F]'}
                  `}
                  placeholder="tu@correo.com"
                />
              </div>
              {emailTouched && !isEmailValid && (
                <p className="mt-1 text-sm text-red-500">Ingresa un correo válido.</p>
              )}
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-[#475569] dark:text-slate-300">
                  Contraseña
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-[#2A5D8F] dark:text-[#5BA3D9] hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  className={`appearance-none block w-full px-4 py-3.5 bg-[#F8FAFC] dark:bg-[#1E293B] border rounded-xl shadow-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2A5D8F]/20 sm:text-sm text-[#0F172A] dark:text-white transition-all
                    ${passwordTouched ? (isPasswordValid ? 'border-green-500 focus:border-green-500' : 'border-red-500 focus:border-red-500') : 'border-[#E2E8F0] dark:border-slate-700 focus:border-[#2A5D8F]'}
                  `}
                  placeholder="••••••••"
                />
              </div>
              {passwordTouched && !isPasswordValid && (
                <p className="mt-1 text-sm text-red-500">Mínimo 6 caracteres.</p>
              )}
            </div>

            <div className="flex items-center animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#2A5D8F] focus:ring-[#2A5D8F] border-[#E2E8F0] dark:border-slate-600 dark:bg-slate-800 rounded transition-colors"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#475569] dark:text-slate-300">
                Recordarme
              </label>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
              <Button type="submit" isLoading={isLoading} disabled={isLoading} className="w-full flex justify-center py-3.5 text-base font-bold shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1 transition-all">
                {isLoading ? 'Conectando...' : 'Entrar al Sistema'}
              </Button>
            </div>
            
            <div className="text-center pt-6 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
              <p className="text-sm text-[#64748B] dark:text-slate-400">
                ¿No tienes cuenta?{' '}
                <button type="button" onClick={() => navigate('/register')} className="font-bold text-[#2A5D8F] dark:text-[#5BA3D9] hover:underline transition-colors">
                  Regístrate aquí
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
