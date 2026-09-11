import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, User, X } from 'lucide-react';
import { userService } from '../../../shared/api/userService';
import toast from 'react-hot-toast';
import { SkeletonLoader } from '../../../shared/components/SkeletonLoader';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { Card, CardHeader } from '../../../shared/components/Card';
import { User as UserType, UserRole } from '../types/user.types';

export function UsersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [users, setUsers] = useState<UserType[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserType | UserRole | null>(null);

  // Form state
  const [userForm, setUserForm] = useState({ firstName: '', lastName: '', email: '', passwordHash: '', roleId: '' });
  const [roleForm, setRoleForm] = useState<{ name: string; permissions: string[] }>({ name: '', permissions: [] });

  // Delete modal state
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; type: 'user' | 'role' } | null>(null);

  const pages = [
    { id: 'orders', label: 'Gestión de Órdenes' },
    { id: 'orders_new', label: 'Registro de Pedidos' },
    { id: 'catalogs', label: 'Catálogo de Productos' },
    { id: 'reports', label: 'Gráficas y Estadísticas' },
    { id: 'master_table', label: 'Exportar Excel' },
    { id: 'users', label: 'Usuarios y Roles' },
    { id: 'full_screen', label: 'Modo Pantalla Completa (TV)' }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        userService.getUsers(),
        userService.getRoles()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar datos.', { style: { borderRadius: '10px', background: '#333', color: '#fff' }});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const executeDelete = async () => {
    if (!confirmDelete) return;
    try {
      if (confirmDelete.type === 'user') {
        await userService.deleteUser(confirmDelete.id);
        toast.success('Usuario eliminado');
      } else {
        await userService.deleteRole(confirmDelete.id);
        toast.success('Rol eliminado');
      }
      fetchData();
    } catch (error) {
      toast.error('Error al eliminar');
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleOpenUserModal = (user?: UserType) => {
    if (user) {
      setEditingItem(user);
      const u = user as UserType & { firstName?: string; first_name?: string; lastName?: string; last_name?: string };
      setUserForm({ 
        firstName: u.firstName || u.first_name || '', 
        lastName: u.lastName || u.last_name || '', 
        email: user.email || '', 
        passwordHash: '', // never load password 
        roleId: (user.roleId || user.role_id || '').toString() 
      });
    } else {
      setEditingItem(null);
      setUserForm({ firstName: '', lastName: '', email: '', passwordHash: '', roleId: '' });
    }
    setIsUserModalOpen(true);
  };

  const handleOpenRoleModal = (role?: UserRole) => {
    if (role) {
      setEditingItem(role);
      let perms: string[] = [];
      try {
        const r = role as UserRole & { permissions?: string | string[] };
        if (typeof r.permissions === 'string') perms = JSON.parse(r.permissions);
        else if (Array.isArray(r.permissions)) perms = r.permissions;
      } catch(e) {}
      setRoleForm({ name: role.name || '', permissions: perms });
    } else {
      setEditingItem(null);
      setRoleForm({ name: '', permissions: [] });
    }
    setIsRoleModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userForm.firstName.trim().length < 3 || userForm.lastName.trim().length < 3) {
      toast.error('El nombre y los apellidos deben tener al menos 3 caracteres.');
      return;
    }
    if (!editingItem && userForm.passwordHash.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (editingItem && userForm.passwordHash && userForm.passwordHash.length < 8) {
      toast.error('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      const payload = {
        firstName: userForm.firstName.trim(),
        lastName: userForm.lastName.trim(),
        email: userForm.email.trim().toLowerCase(),
        password: userForm.passwordHash || undefined,
        passwordHash: userForm.passwordHash || undefined, // Keep for update just in case
        roleId: Number(userForm.roleId)
      };

      if (editingItem) {
        await userService.updateUser(editingItem.id, payload);
        toast.success('Usuario actualizado');
      } else {
        await userService.createUser(payload);
        toast.success('Usuario creado');
      }
      setIsUserModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error(error);
      const status = error?.response?.status;
      const data = error?.response?.data;
      if (status === 409 || data?.title === 'User.EmailAlreadyExists') {
        toast.error('Ya existe un usuario con este correo electrónico.');
      } else if (data?.errors) {
        const firstKey = Object.keys(data.errors)[0];
        const messages = data.errors[firstKey];
        toast.error(Array.isArray(messages) && messages.length > 0 ? messages[0] : 'Datos incompletos o inválidos.');
      } else if (data?.detail) {
        toast.error(data.detail);
      } else {
        toast.error('Error al guardar usuario');
      }
    }
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: roleForm.name,
        permissions: JSON.stringify(roleForm.permissions)
      };

      if (editingItem) {
        await userService.updateRole(editingItem.id, payload);
        toast.success('Rol actualizado');
      } else {
        await userService.createRole(payload);
        toast.success('Rol creado');
      }
      setIsRoleModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Error al guardar rol');
    }
  };

  return (
    <Card className="min-h-[500px] flex flex-col font-body animate-fade-in-up border-0 sm:border">
      <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Quick Filters / Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl font-display font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'users' ? 'bg-[#2A5D8F] text-white shadow-[0_3px_0_#1B3D5C]' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
            }`}
          >
            <User className="w-4 h-4" /> Usuarios
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-xl font-display font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'roles' ? 'bg-[#2A5D8F] text-white shadow-[0_3px_0_#1B3D5C]' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
            }`}
          >
            <Shield className="w-4 h-4" /> Roles y Permisos
          </button>
        </div>
        <div className="z-10">
          <button 
            onClick={() => activeTab === 'users' ? handleOpenUserModal() : handleOpenRoleModal()}
            className="bg-[#2A5D8F] hover:bg-[#1E4D73] disabled:opacity-60 text-white px-6 py-3.5 rounded-2xl font-display font-bold shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1 transition-all flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> Nuevo {activeTab === 'users' ? 'Usuario' : 'Rol'}
          </button>
        </div>
      </CardHeader>
      
      <div className="flex-1 bg-white dark:bg-[#0F172A] rounded-b-2xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <SkeletonLoader type="table" rows={4} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === 'users' ? (
              users.length === 0 ? (
                <div className="p-8">
                  <div className="flex flex-col items-center justify-center gap-4 py-20 rounded-2xl border-2 border-dashed border-[#E2E8F0] dark:border-gray-800 bg-[#F8FAFC] dark:bg-gray-800/50">
                    <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 shadow-sm border border-[#E2E8F0] dark:border-gray-700">
                      <svg className="w-16 h-16 text-[#2A5D8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="font-display font-bold text-[#0F172A] dark:text-white text-lg">No hay usuarios</p>
                      <p className="text-sm text-[#64748B] dark:text-gray-400 mt-1 max-w-sm mx-auto">Comienza agregando un nuevo usuario para otorgarle acceso al sistema.</p>
                    </div>
                    <button
                      onClick={() => handleOpenUserModal()}
                      className="mt-2 px-6 py-3 rounded-xl font-display font-bold text-sm text-white bg-[#2A5D8F] hover:bg-[#1B3D5C] shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1 transition-all flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Usuario
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <th className="px-8 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Nombre / Correo</th>
                        <th className="px-8 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Rol</th>
                        <th className="px-8 py-4 text-right text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] dark:divide-gray-800">
                      {users.map(user => {
                        const role = roles.find(r => r.id === (user.roleId || user.role_id));
                        return (
                          <tr key={user.id} className="hover:bg-[#EFF6FF] dark:hover:bg-gray-800/50 transition-colors group relative border-l-4 border-l-[#2A5D8F] dark:text-gray-300">
                            <td className="px-8 py-5">
                              <div className="font-display font-bold text-[#0F172A] dark:text-white text-sm">{user.firstName || user.first_name} {user.lastName || user.last_name}</div>
                              <div className="text-xs text-[#64748B] dark:text-gray-400 font-mono mt-0.5">{user.email}</div>
                            </td>
                            <td className="px-8 py-5">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-display font-bold text-[#2A5D8F] bg-[#EFF6FF] dark:bg-blue-900/30 border border-[#BFDBFE] dark:border-blue-800/50">
                                <Shield className="w-3 h-3 mr-1.5" /> {role ? role.name : 'Sin rol'}
                              </span>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium overflow-hidden">
                              <div className="flex justify-end space-x-2 md:translate-x-12 opacity-100 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-300 ease-out">
                                <button 
                                  onClick={() => handleOpenUserModal(user)}
                                  className="flex items-center text-[#2A5D8F] bg-[#EFF6FF] dark:bg-blue-900/30 hover:bg-[#DBEAFE] dark:hover:bg-blue-900/50 px-3 py-2 rounded-xl transition-colors font-display font-bold text-xs"
                                >
                                  <Edit2 className="w-4 h-4 mr-1.5" /> Editar
                                </button>
                                <button 
                                  onClick={() => setConfirmDelete({ id: user.id, type: 'user' })}
                                  className="flex items-center text-[#DC2626] bg-[#FEF2F2] dark:bg-red-900/30 hover:bg-[#FEE2E2] dark:hover:bg-red-900/50 px-3 py-2 rounded-xl transition-colors font-display font-bold text-xs"
                                >
                                  <Trash2 className="w-4 h-4 mr-1.5" /> Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="px-8 py-4 border-t border-[#E2E8F0] dark:border-gray-800 bg-[#F8FAFC] dark:bg-gray-800 flex justify-between items-center text-sm font-medium text-[#64748B] dark:text-gray-400">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#2A5D8F] mr-2"></span>
                      Mostrando {users.length} usuarios
                    </div>
                  </div>
                </>
              )
            ) : (
              roles.length === 0 ? (
                <div className="p-8">
                  <div className="flex flex-col items-center justify-center gap-4 py-20 rounded-2xl border-2 border-dashed border-[#E2E8F0] dark:border-gray-800 bg-[#F8FAFC] dark:bg-gray-800/50">
                    <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 shadow-sm border border-[#E2E8F0] dark:border-gray-700">
                      <svg className="w-16 h-16 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="font-display font-bold text-[#0F172A] dark:text-white text-lg">No hay roles</p>
                      <p className="text-sm text-[#64748B] dark:text-gray-400 mt-1 max-w-sm mx-auto">Define roles de acceso para controlar los permisos de tus usuarios en el sistema.</p>
                    </div>
                    <button
                      onClick={() => handleOpenRoleModal()}
                      className="mt-2 px-6 py-3 rounded-xl font-display font-bold text-sm text-white bg-[#D97706] hover:bg-[#B45309] shadow-[0_4px_0_#92400E] active:shadow-[0_0px_0_#92400E] active:translate-y-1 transition-all flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Rol
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="px-8 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Nombre del Rol</th>
                      <th className="px-8 py-4 text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Usuarios asignados</th>
                      <th className="px-8 py-4 text-right text-xs font-display font-bold text-[#64748B] uppercase tracking-wide">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] dark:divide-gray-800">
                    {roles.map(role => {
                      const usersWithRole = users.filter(u => (u.roleId || u.role_id) === role.id).length;
                      return (
                        <tr key={role.id} className="hover:bg-[#EFF6FF] dark:hover:bg-gray-800/50 transition-colors group relative border-l-4 border-l-[#D97706] dark:text-gray-300">
                          <td className="px-8 py-5">
                            <div className="font-display font-bold text-[#0F172A] dark:text-white text-sm">{role.name}</div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="text-sm font-mono text-[#0F172A] dark:text-white font-semibold bg-[#F8FAFC] dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-gray-700 inline-block">
                              {usersWithRole} usuarios
                            </div>
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium overflow-hidden">
                            <div className="flex justify-end space-x-2 md:translate-x-12 opacity-100 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-300 ease-out">
                              <button 
                                onClick={() => handleOpenRoleModal(role)}
                                className="flex items-center text-[#D97706] bg-[#FEF3C7] dark:bg-yellow-900/30 hover:bg-[#FDE68A] dark:hover:bg-yellow-900/50 px-3 py-2 rounded-xl transition-colors font-display font-bold text-xs"
                              >
                                <Edit2 className="w-4 h-4 mr-1.5" /> Editar
                              </button>
                              <button 
                                onClick={() => setConfirmDelete({ id: role.id, type: 'role' })}
                                className="flex items-center text-[#DC2626] bg-[#FEF2F2] dark:bg-red-900/30 hover:bg-[#FEE2E2] dark:hover:bg-red-900/50 px-3 py-2 rounded-xl transition-colors font-display font-bold text-xs"
                              >
                                <Trash2 className="w-4 h-4 mr-1.5" /> Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                  <div className="px-8 py-4 border-t border-[#E2E8F0] dark:border-gray-800 bg-[#F8FAFC] dark:bg-gray-800 flex justify-between items-center text-sm font-medium text-[#64748B] dark:text-gray-400">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#D97706] mr-2"></span>
                      Mostrando {roles.length} roles
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        )}
      </div>

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="font-display font-extrabold text-[#0F172A] text-xl">
                {editingItem ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-[#94A3B8] hover:text-[#DC2626] transition-colors p-2 rounded-xl hover:bg-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-display font-bold text-[#0F172A] mb-1.5">Nombre</label>
                    <input
                      type="text"
                      required
                      value={userForm.firstName}
                      onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:border-[#2A5D8F] focus:ring-4 focus:ring-[#2A5D8F]/10 outline-none text-[#0F172A] font-body transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-display font-bold text-[#0F172A] mb-1.5">Apellidos</label>
                    <input
                      type="text"
                      required
                      value={userForm.lastName}
                      onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:border-[#2A5D8F] focus:ring-4 focus:ring-[#2A5D8F]/10 outline-none text-[#0F172A] font-body transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-display font-bold text-[#0F172A] mb-1.5">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:border-[#2A5D8F] focus:ring-4 focus:ring-[#2A5D8F]/10 outline-none text-[#0F172A] font-body transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-bold text-[#0F172A] mb-1.5">
                    Contraseña {editingItem ? <span className="text-[#94A3B8] font-normal text-xs">(Dejar en blanco para mantener la actual)</span> : <span className="text-[#94A3B8] font-normal text-xs">(Mínimo 8 caracteres)</span>}
                  </label>
                  <input
                    type="password"
                    required={!editingItem}
                    minLength={8}
                    placeholder={editingItem ? "••••••••" : "Mínimo 8 caracteres"}
                    value={userForm.passwordHash}
                    onChange={(e) => setUserForm({...userForm, passwordHash: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:border-[#2A5D8F] focus:ring-4 focus:ring-[#2A5D8F]/10 outline-none text-[#0F172A] font-body transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-bold text-[#0F172A] mb-1.5">Rol</label>
                  <select
                    required
                    value={userForm.roleId}
                    onChange={(e) => setUserForm({...userForm, roleId: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:border-[#2A5D8F] focus:ring-4 focus:ring-[#2A5D8F]/10 outline-none text-[#0F172A] font-body transition-all bg-white"
                  >
                    <option value="" disabled>Selecciona un rol</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-5 py-3 rounded-xl font-display font-bold text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="bg-[#2A5D8F] hover:bg-[#1E4D73] text-white px-6 py-3 rounded-xl font-display font-bold shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1 transition-all">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="font-display font-extrabold text-[#0F172A] text-xl">
                {editingItem ? 'Editar Rol' : 'Nuevo Rol'}
              </h3>
              <button type="button" onClick={() => setIsRoleModalOpen(false)} className="text-[#94A3B8] hover:text-[#DC2626] transition-colors p-2 rounded-xl hover:bg-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveRole} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-display font-bold text-[#0F172A] mb-1.5">Nombre del Rol</label>
                  <input
                    type="text"
                    required
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                    placeholder="Ej: Administrador, Operador..."
                    className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:border-[#2A5D8F] focus:ring-4 focus:ring-[#2A5D8F]/10 outline-none text-[#0F172A] font-body transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-bold text-[#0F172A] mb-2">Páginas Permitidas</label>
                  <div className="space-y-2 border-2 border-[#E2E8F0] rounded-xl p-4 bg-[#F8FAFC]">
                    {pages.map(page => (
                      <label key={page.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input 
                            type="checkbox" 
                            className="peer appearance-none w-5 h-5 border-2 border-[#CBD5E1] rounded-md checked:bg-[#2A5D8F] checked:border-[#2A5D8F] transition-all cursor-pointer"
                            checked={roleForm.permissions.includes(page.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRoleForm({ ...roleForm, permissions: [...roleForm.permissions, page.id] });
                              } else {
                                setRoleForm({ ...roleForm, permissions: roleForm.permissions.filter(p => p !== page.id) });
                              }
                            }}
                          />
                          <svg className="absolute w-3.5 h-3.5 left-0.5 top-0.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-[#475569] group-hover:text-[#0F172A] transition-colors">{page.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsRoleModalOpen(false)} className="px-5 py-3 rounded-xl font-display font-bold text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="bg-[#2A5D8F] hover:bg-[#1E4D73] text-white px-6 py-3 rounded-xl font-display font-bold shadow-[0_4px_0_#1B3D5C] active:shadow-[0_0px_0_#1B3D5C] active:translate-y-1 transition-all">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDelete !== null}
        title={confirmDelete?.type === 'user' ? 'Eliminar Usuario' : 'Eliminar Rol'}
        message={
          <>
            ¿Estás seguro de eliminar este {confirmDelete?.type === 'user' ? 'usuario' : 'rol'}? <strong className="text-[#DC2626]">Esta acción no se puede deshacer.</strong>
          </>
        }
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={executeDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </Card>
  );
}
