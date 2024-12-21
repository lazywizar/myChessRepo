export interface User {
  _id: string;
  email: string;
  username: string;
  isVerified: boolean;
  lastLogin?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: string;
  message?: string;
}
