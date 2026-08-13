import React, { useState, useEffect } from 'react';
import { Settings, Plus, Edit2, Trash2, Shield, User, Inbox, X } from 'lucide-react';
import { userService } from '../../../shared/api/userService';
import toast from 'react-hot-toast';

export function UsersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form state
  const [userForm, setUserForm] = useState({ firstName: '', lastName: '', email: '', passwordHash: '', roleId: '' });
  const [roleForm, setRoleForm] = useState({ name: '' });

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

  const handleDeleteUser = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await userService.deleteUser(id);
        toast.success('Usuario eliminado');
        fetchData();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este rol?')) {
      try {
        await userService.deleteRole(id);
        toast.success('Rol eliminado');
        fetchData();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const handleOpenUserModal = (user?: any) => {
    if (user) {
      setEditingItem(user);
      setUserForm({ 
        firstName: user.firstName || user.first_name || '', 
        lastName: user.lastName || user.last_name || '', 
        email: user.email || '', 
        passwordHash: '', // never load password 
        roleId: user.roleId || user.role_id || '' 
      });
    } else {
      setEditingItem(null);
      setUserForm({ firstName: '', lastName: '', email: '', passwordHash: '', roleId: '' });
    }
    setIsUserModalOpen(true);
  };

  const handleOpenRoleModal = (role?: any) => {
    if (role) {
      setEditingItem(role);
      setRoleForm({ name: role.name || '' });
    } else {
      setEditingItem(null);
      setRoleForm({ name: '' });
    }
    setIsRoleModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        email: userForm.email,
        passwordHash: userForm.passwordHash,
        roleId: Number(userForm.roleId)
      };

      if (editingItem) {
        // If editing and password is empty, ideally backend ignores it.
        await userService.updateUser(editingItem.id, payload);
        toast.success('Usuario actualizado');
      } else {
        await userService.createUser(payload);
        toast.success('Usuario creado');
      }
      setIsUserModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Error al guardar usuario');
    }
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await userService.updateRole(editingItem.id, roleForm);
        toast.success('Rol actualizado');
      } else {
        await userService.createRole(roleForm);
        toast.success('Rol creado');
      }
      setIsRoleModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Error al guardar rol');
    }
  };

  return (
    <div className="bg-white rounded-[28px] shadow-card-base border border-[#E3E9E6] min-h-[500px] flex flex-col font-body animate-fade-in-up">
      <div className="p-8 border-b border-[#E3E9E6] flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white rounded-t-[28px] relative overflow-hidden gap-6">
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-[#F0FDF4] p-3 rounded-xl border border-[#E3E9E6]">
            <Settings className="w-8 h-8 text-[#15803D]" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-2xl md:text-3xl text-[#0F1B17] tracking-tight">Administración</h3>
            <p className="text-sm text-[#6B7B76] mt-1 font-medium">Gestión de usuarios y roles del sistema Totebin.</p>
          </div>
        </div>
        <div className="z-10">
          <button 
            onClick={() => activeTab === 'users' ? handleOpenUserModal() : handleOpenRoleModal()}
            className="bg-[#15803D] hover:bg-[#116932] disabled:opacity-60 text-white px-6 py-3.5 rounded-2xl font-display font-bold shadow-[0_4px_0_#0F5C2A] active:shadow-[0_0px_0_#0F5C2A] active:translate-y-1 transition-all flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> Nuevo {activeTab === 'users' ? 'Usuario' : 'Rol'}
          </button>
        </div>
      </div>

      <div className="border-b border-[#E3E9E6] bg-[#F7FAF8]">
        <nav className="flex px-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-6 font-display font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'users' ? 'border-[#15803D] text-[#15803D]' : 'border-transparent text-[#6B7B76] hover:text-[#0F1B17] hover:bg-[#E3E9E6]/30'
            }`}
          >
            <User className="w-4 h-4" /> Usuarios
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-4 px-6 font-display font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'roles' ? 'border-[#15803D] text-[#15803D]' : 'border-transparent text-[#6B7B76] hover:text-[#0F1B17] hover:bg-[#E3E9E6]/30'
            }`}
          >
            <Shield className="w-4 h-4" /> Roles y Permisos
          </button>
        </nav>
      </div>
      
      <div className="flex-1 bg-white rounded-b-[28px] overflow-hidden">
        {loading ? (
          <div className="p-16 flex justify-center items-center">
            <div className="text-center">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-[#15803D] border-t-transparent rounded-full mb-4"></div>
              <p className="font-display font-bold text-[#0F1B17]">Cargando...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === 'users' ? (
              users.length === 0 ? (
                <div className="p-8">
                  <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border-2 border-dashed border-[#E3E9E6] bg-[#F7FAF8]">
                    <div className="p-4 rounded-2xl bg-white border border-[#E3E9E6]">
                      <Inbox className="w-8 h-8 text-[#9CA8A3]" />
                    </div>
                    <p className="font-display font-bold text-[#0F1B17]">No hay usuarios registrados</p>
                  </div>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7FAF8] border-b border-[#EDF1EF]">
                      <th className="px-8 py-4 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Nombre / Correo</th>
                      <th className="px-8 py-4 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Rol</th>
                      <th className="px-8 py-4 text-right text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDF1EF]">
                    {users.map(user => {
                      const role = roles.find(r => r.id === (user.roleId || user.role_id));
                      return (
                        <tr key={user.id} className="hover:bg-[#F0FDF4] transition-colors group">
                          <td className="px-8 py-5">
                            <div className="font-display font-bold text-[#0F1B17] text-sm">{user.firstName || user.first_name} {user.lastName || user.last_name}</div>
                            <div className="text-xs text-[#6B7B76] font-mono mt-0.5">{user.email}</div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-display font-bold text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0]">
                              <Shield className="w-3 h-3 mr-1.5" /> {role ? role.name : 'Sin rol'}
                            </span>
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                            <button 
                              onClick={() => handleOpenUserModal(user)}
                              className="flex items-center text-[#15803D] bg-[#F0FDF4] hover:bg-[#DCFCE7] px-3 py-2 rounded-xl transition-colors font-display font-bold text-xs"
                            >
                              <Edit2 className="w-4 h-4 mr-1.5" /> Editar
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="flex items-center text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-3 py-2 rounded-xl transition-colors font-display font-bold text-xs"
                            >
                              <Trash2 className="w-4 h-4 mr-1.5" /> Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )
            ) : (
              roles.length === 0 ? (
                <div className="p-8">
                  <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border-2 border-dashed border-[#E3E9E6] bg-[#F7FAF8]">
                    <div className="p-4 rounded-2xl bg-white border border-[#E3E9E6]">
                      <Inbox className="w-8 h-8 text-[#9CA8A3]" />
                    </div>
                    <p className="font-display font-bold text-[#0F1B17]">No hay roles registrados</p>
                  </div>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7FAF8] border-b border-[#EDF1EF]">
                      <th className="px-8 py-4 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Nombre del Rol</th>
                      <th className="px-8 py-4 text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Usuarios asignados</th>
                      <th className="px-8 py-4 text-right text-xs font-display font-bold text-[#6B7B76] uppercase tracking-wide">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDF1EF]">
                    {roles.map(role => {
                      const usersWithRole = users.filter(u => (u.roleId || u.role_id) === role.id).length;
                      return (
                        <tr key={role.id} className="hover:bg-[#F0FDF4] transition-colors group">
                          <td className="px-8 py-5">
                            <div className="font-display font-bold text-[#0F1B17] text-sm">{role.name}</div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="text-sm font-mono text-[#0F1B17] font-semibold bg-[#F7FAF8] px-3 py-1.5 rounded-lg border border-[#E3E9E6] inline-block">
                              {usersWithRole} usuarios
                            </div>
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                            <button 
                              onClick={() => handleOpenRoleModal(role)}
                              className="flex items-center text-[#15803D] bg-[#F0FDF4] hover:bg-[#DCFCE7] px-3 py-2 rounded-xl transition-colors font-display font-bold text-xs"
                            >
                              <Edit2 className="w-4 h-4 mr-1.5" /> Editar
                            </button>
                            <button 
                              onClick={() => handleDeleteRole(role.id)}
                              className="flex items-center text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-3 py-2 rounded-xl transition-colors font-display font-bold text-xs"
                            >
                              <Trash2 className="w-4 h-4 mr-1.5" /> Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )
            )}
          </div>
        )}
      </div>

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1B17]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-[#E3E9E6] bg-[#F7FAF8]">
              <h3 className="font-display font-extrabold text-[#0F1B17] text-xl">
                {editingItem ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-[#9CA8A3] hover:text-[#DC2626] transition-colors p-2 rounded-xl hover:bg-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-display font-bold text-[#0F1B17] mb-1.5">Nombre</label>
                    <input
                      type="text"
                      required
                      value={userForm.firstName}
                      onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-[#E3E9E6] rounded-xl focus:border-[#15803D] focus:ring-4 focus:ring-[#15803D]/10 outline-none text-[#0F1B17] font-body transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-display font-bold text-[#0F1B17] mb-1.5">Apellidos</label>
                    <input
                      type="text"
                      required
                      value={userForm.lastName}
                      onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-[#E3E9E6] rounded-xl focus:border-[#15803D] focus:ring-4 focus:ring-[#15803D]/10 outline-none text-[#0F1B17] font-body transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-display font-bold text-[#0F1B17] mb-1.5">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-[#E3E9E6] rounded-xl focus:border-[#15803D] focus:ring-4 focus:ring-[#15803D]/10 outline-none text-[#0F1B17] font-body transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-bold text-[#0F1B17] mb-1.5">
                    Contraseña {editingItem && <span className="text-[#9CA8A3] font-normal text-xs">(Dejar en blanco para no cambiar)</span>}
                  </label>
                  <input
                    type="password"
                    required={!editingItem}
                    value={userForm.passwordHash}
                    onChange={(e) => setUserForm({...userForm, passwordHash: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-[#E3E9E6] rounded-xl focus:border-[#15803D] focus:ring-4 focus:ring-[#15803D]/10 outline-none text-[#0F1B17] font-body transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-bold text-[#0F1B17] mb-1.5">Rol</label>
                  <select
                    required
                    value={userForm.roleId}
                    onChange={(e) => setUserForm({...userForm, roleId: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-[#E3E9E6] rounded-xl focus:border-[#15803D] focus:ring-4 focus:ring-[#15803D]/10 outline-none text-[#0F1B17] font-body transition-all bg-white"
                  >
                    <option value="" disabled>Selecciona un rol</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-5 py-3 rounded-xl font-display font-bold text-[#6B7B76] hover:bg-[#F3F6F4] transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="bg-[#15803D] hover:bg-[#116932] text-white px-6 py-3 rounded-xl font-display font-bold shadow-[0_4px_0_#0F5C2A] active:shadow-[0_0px_0_#0F5C2A] active:translate-y-1 transition-all">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1B17]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-[#E3E9E6] bg-[#F7FAF8]">
              <h3 className="font-display font-extrabold text-[#0F1B17] text-xl">
                {editingItem ? 'Editar Rol' : 'Nuevo Rol'}
              </h3>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-[#9CA8A3] hover:text-[#DC2626] transition-colors p-2 rounded-xl hover:bg-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveRole} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-display font-bold text-[#0F1B17] mb-1.5">Nombre del Rol</label>
                  <input
                    type="text"
                    required
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                    placeholder="Ej: Administrador, Operador..."
                    className="w-full px-4 py-3 border-2 border-[#E3E9E6] rounded-xl focus:border-[#15803D] focus:ring-4 focus:ring-[#15803D]/10 outline-none text-[#0F1B17] font-body transition-all"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsRoleModalOpen(false)} className="px-5 py-3 rounded-xl font-display font-bold text-[#6B7B76] hover:bg-[#F3F6F4] transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="bg-[#15803D] hover:bg-[#116932] text-white px-6 py-3 rounded-xl font-display font-bold shadow-[0_4px_0_#0F5C2A] active:shadow-[0_0px_0_#0F5C2A] active:translate-y-1 transition-all">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
