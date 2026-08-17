export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface RegisterCommand {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: number | string;
}
