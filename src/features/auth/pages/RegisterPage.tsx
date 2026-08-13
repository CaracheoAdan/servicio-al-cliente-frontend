import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../../shared/ui/Button';
import { authApi } from '../api/auth.api';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Llamada real al backend en localhost:5040/api/v1/auth/register
      const res = await authApi.register({ email, password, name });
      toast.success('Usuario registrado exitosamente. Ahora puedes iniciar sesión.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      navigate('/login');
    } catch (error) {
      console.error("Register error:", error);
      toast.error('Error al registrar. Verifica tu backend o si el correo ya existe.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-totebin-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans animate-fade-in-up">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-totebin-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            T
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear una Cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Únete a la plataforma <span className="font-semibold text-totebin-600">Totebin</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-10 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-bold text-gray-700">Nombre Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-totebin-500 focus:border-totebin-500 bg-gray-50 focus:bg-white transition-colors"
                placeholder="Ej. Juan Pérez"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-totebin-500 focus:border-totebin-500 bg-gray-50 focus:bg-white transition-colors"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-totebin-500 focus:border-totebin-500 bg-gray-50 focus:bg-white transition-colors"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full flex justify-center py-3 text-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
              Registrar Usuario
            </Button>

            <div className="text-center text-sm pt-4 border-t border-gray-100">
              <span className="text-gray-500">¿Ya tienes cuenta? </span>
              <button type="button" onClick={() => navigate('/login')} className="font-bold text-totebin-600 hover:text-totebin-700 transition-colors">
                Inicia Sesión aquí
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
