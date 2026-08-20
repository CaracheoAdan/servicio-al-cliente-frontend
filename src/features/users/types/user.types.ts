export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  roleId?: number;
  role_id?: number;
  isActive?: boolean;
}

export interface UserRole {
  id: number;
  name: string;
  description?: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: number;
}

export interface UpdateUserInfoPayload {
  id: string;
  email?: string;
  name?: string;
  roleId?: number;
  isActive?: boolean;
}

export interface UpdateUserPasswordPayload {
  id: string;
  currentPassword: string;
  newPassword: string;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
}
