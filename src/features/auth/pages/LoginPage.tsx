import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../../shared/ui/Button';
import { authApi } from '../api/auth.api';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Pendiente de habilitar cuando el backend de Auth esté listo
      // const res = await authApi.login({ email, password });
      // if (res && res.token) {
      //   localStorage.setItem('totebin_token', res.token);
      //   navigate('/');
      // } else {
      //   toast.error('El servidor no devolvió un token válido.');
      // }
      
      // Bypass temporal para poder visualizar y trabajar en el sistema
      localStorage.setItem('totebin_token', 'mock_token_temporal');
      toast.success('Bypass de Login activado.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
      toast.error('Error al intentar acceder.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-[#2A5D8F] rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            T
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#0F172A]">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-center text-sm text-[#475569]">
          Sistema de Gestión <span className="font-semibold text-[#2A5D8F]">Totebin</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card-brand sm:rounded-xl sm:px-10 border border-[#E2E8F0]">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#475569]">
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-[#E2E8F0] rounded-lg shadow-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2A5D8F]/20 focus:border-[#2A5D8F] sm:text-sm text-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#475569]">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-[#E2E8F0] rounded-lg shadow-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2A5D8F]/20 focus:border-[#2A5D8F] sm:text-sm text-[#0F172A]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#2A5D8F] focus:ring-[#2A5D8F] border-[#E2E8F0] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#0F172A]">
                  Recordarme
                </label>
              </div>
            </div>

            <div className="text-center text-sm pt-4 border-t border-[#E2E8F0]">
              <span className="text-[#64748B]">¿No tienes cuenta? </span>
              <button type="button" onClick={() => navigate('/register')} className="font-bold text-[#2A5D8F] hover:text-[#1E4D73] transition-colors">
                Regístrate aquí
              </button>
            </div>

            <div>
              <Button type="submit" className="w-full flex justify-center py-2.5">
                Entrar al Sistema
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
