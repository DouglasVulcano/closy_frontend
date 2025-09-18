import { createContext } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  celular?: string;
  role: 'USER' | 'STARTER' | 'PRO' | 'ADMIN';
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  trial_ends_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, recaptchaToken: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: UpdateUserData) => Promise<void>;
  deleteUser: () => Promise<void>;
  getPortalUrl: (returnUrl?: string) => Promise<string>;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (roles: string | string[]) => boolean;
}

interface RegisterData {
  name: string;
  email: string;
  celular: string;
  password: string;
  password_confirmation: string;
  recaptcha_token: string;
}

interface UpdateUserData {
  name?: string;
  celular?: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export type { User, AuthContextType, RegisterData, UpdateUserData };