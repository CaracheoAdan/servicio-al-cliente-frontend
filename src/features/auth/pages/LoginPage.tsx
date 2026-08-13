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
    <div className="min-h-screen bg-totebin-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-totebin-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            T
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sistema de Gestión <span className="font-semibold text-totebin-600">Totebin</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-totebin-500 focus:border-totebin-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-totebin-500 focus:border-totebin-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-totebin-600 focus:ring-totebin-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>
            </div>

            <div className="text-center text-sm pt-4 border-t border-gray-100">
              <span className="text-gray-500">¿No tienes cuenta? </span>
              <button type="button" onClick={() => navigate('/register')} className="font-bold text-totebin-600 hover:text-totebin-700 transition-colors">
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
