export interface User {
  id: number;
  email: string;
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
  password?: string;
  name?: string;
  roleId?: number;
}

export interface UpdateUserPayload {
  email?: string;
  name?: string;
  roleId?: number;
  isActive?: boolean;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
}
