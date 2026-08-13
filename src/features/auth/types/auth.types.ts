export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface RegisterCommand {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}
