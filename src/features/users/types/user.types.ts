export interface User {
  id: number;
  email: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  name?: string;
  roleId?: number;
  role_id?: number;
  isActive?: boolean;
  is_active?: boolean;
}

export interface UserRole {
  id: number;
  name: string;
  description?: string;
  permissions?: string | string[];
}

export interface CreateUserPayload {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  roleId?: number;
}

export interface UpdateUserPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  password?: string;
  passwordHash?: string;
  roleId?: number;
  isActive?: boolean;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissions?: string;
}

