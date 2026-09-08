import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../../shared/components/Button';
import { authApi } from '../api/auth.api';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  
  const navigate = useNavigate();

  const isFirstNameValid = firstName.trim().length >= 3;
  const isLastNameValid = lastName.trim().length >= 3;
  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 8;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid) {
      setFirstNameTouched(true);
      setLastNameTouched(true);
      setEmailTouched(true);
      setPasswordTouched(true);
      toast.error('Por favor completa todos los campos correctamente.');
      return;
    }

    setIsLoading(true);
    try {
      // Usamos roleId 2 por defecto para usuarios normales
      await authApi.register({ 
        email: email.trim().toLowerCase(), 
        password, 
        firstName: firstName.trim(), 
        lastName: lastName.trim(),
        roleId: 2 
      });
      toast.success('Usuario registrado exitosamente. Ahora puedes iniciar sesión.', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      navigate('/login');
    } catch (error: any) {
      console.error("Register error:", error);
      let errorMsg = 'Error al registrar la cuenta. Verifica los datos.';
      if (error?.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 409 || data?.title === 'User.EmailAlreadyExists') {
          errorMsg = 'Este correo electrónico ya se encuentra registrado. Intenta iniciar sesión o usa otro correo.';
        } else if (status === 400) {
          if (data?.errors) {
            const firstKey = Object.keys(data.errors)[0];
            const messages = data.errors[firstKey];
            if (Array.isArray(messages) && messages.length > 0) {
              errorMsg = messages[0];
            }
          } else if (data?.detail) {
            errorMsg = data.detail;
          }
        } else if (status >= 500) {
          errorMsg = 'Error en el servidor. Intenta nuevamente más tarde.';
        }
      } else if (error?.request) {
        errorMsg = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      }
      toast.error(errorMsg, {
        style: { borderRadius: '10px', background: '#EF4444', color: '#fff', fontWeight: 'bold' },
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-row-reverse font-sans bg-white dark:bg-[#0B1120]">
      {/* Right side - Branding (reversed for Register) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-bl from-[#1E4D73] via-[#2A5D8F] to-[#5BA3D9] overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-32 right-32 w-96 h-96 rounded-full bg-[#1E4D73]/40 blur-3xl"></div>
        
        <div className="relative z-10 text-center px-12 animate-fade-in-up">
          <div className="mx-auto h-24 w-24 bg-white rounded-2xl flex items-center justify-center text-[#2A5D8F] text-5xl font-bold shadow-2xl mb-8 transform rotate-3 transition-transform hover:rotate-0">
            T
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">Únete a Totebin</h1>
          <p className="text-xl text-blue-100 max-w-md mx-auto leading-relaxed">
            Comienza a gestionar tus órdenes y clientes de manera profesional hoy mismo.
          </p>
        </div>
      </div>

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <div className="h-12 w-12 bg-[#2A5D8F] rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            T
          </div>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <h2 className="text-3xl font-extrabold text-[#0F172A] dark:text-white mb-2">
              Crear una Cuenta
            </h2>
            <p className="text-[#475569] dark:text-slate-400 mb-8">
              Rellena los datos para configurar tu perfil de usuario.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-[#475569] dark:text-slate-300 mb-2">
                    Nombre(s)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={() => setFirstNameTouched(true)}
                      className={`appearance-none block w-full px-4 py-3.5 bg-[#F8FAFC] dark:bg-[#1E293B] border rounded-xl shadow-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2A5D8F]/20 sm:text-sm text-[#0F172A] dark:text-white transition-all
                        ${firstNameTouched ? (isFirstNameValid ? 'border-green-500 focus:border-green-500' : 'border-red-500 focus:border-red-500') : 'border-[#E2E8F0] dark:border-slate-700 focus:border-[#2A5D8F]'}
                      `}
                      placeholder="Ej. Juan"
                    />
                  </div>
                  {firstNameTouched && !isFirstNameValid && (
                    <p className="mt-1 text-sm text-red-500">Mínimo 3 caracteres.</p>
                  )}
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-[#475569] dark:text-slate-300 mb-2">
                    Apellidos
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onBlur={() => setLastNameTouched(true)}
                      className={`appearance-none block w-full px-4 py-3.5 bg-[#F8FAFC] dark:bg-[#1E293B] border rounded-xl shadow-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2A5D8F]/20 sm:text-sm text-[#0F172A] dark:text-white transition-all
                        ${lastNameTouched ? (isLastNameValid ? 'border-green-500 focus:border-green-500' : 'border-red-500 focus:border-red-500') : 'border-[#E2E8F0] dark:border-slate-700 focus:border-[#2A5D8F]'}
                      `}
                      placeholder="Ej. Pérez"
                    />
                  </div>
                  {lastNameTouched && !isLastNameValid && (
                    <p className="mt-1 text-sm text-red-500">Mínimo 3 caracteres.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <label className="block text-sm font-semibold text-[#475569] dark:text-slate-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
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

            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <label className="block text-sm font-semibold text-[#475569] dark:text-slate-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
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
                <p className="mt-1 text-sm text-red-500">Mínimo 8 caracteres.</p>
              )}
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
              <Button type="submit" isLoading={isLoading} disabled={isLoading} className="w-full flex justify-center py-3.5 text-base font-bold shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1 transition-all">
                {isLoading ? 'Registrando...' : 'Registrar Usuario'}
              </Button>
            </div>

            <div className="text-center pt-6 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
              <p className="text-sm text-[#64748B] dark:text-slate-400">
                ¿Ya tienes cuenta?{' '}
                <button type="button" onClick={() => navigate('/login')} className="font-bold text-[#2A5D8F] dark:text-[#5BA3D9] hover:underline transition-colors">
                  Inicia Sesión aquí
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
