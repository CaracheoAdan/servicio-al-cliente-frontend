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
  passwordHash: string;
  firstName: string;
  lastName: string;
}
