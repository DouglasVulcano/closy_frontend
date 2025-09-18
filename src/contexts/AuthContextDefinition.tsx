import { createContext } from 'react';
import type { User, RegisterData, UpdateUserData } from '@/types/api';

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export type { User, AuthContextType, RegisterData, UpdateUserData };