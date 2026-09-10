export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions?: string | string[];
}

export interface RegisterCommand {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
