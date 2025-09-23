// ============================================================================
// Auth Service - Serviço de autenticação
// ============================================================================

import httpClient from './http-client';
import type {
  LoginData,
  RegisterData,
  LoginResponse,
  RegisterResponse,
  User,
  PortalRequest,
  PortalResponse,
} from '@/types/api';

export class AuthService {
  /**
   * Realizar login do usuário
   */
  async login(data: LoginData): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>('/login', data);
  }

  /**
   * Registrar novo usuário
   */
  async register(data: RegisterData): Promise<RegisterResponse> {
    return httpClient.post<RegisterResponse>('/register', data);
  }

  /**
   * Fazer logout do usuário
   */
  async logout(): Promise<void> {
    try {
      await httpClient.delete('/logout');
    } finally {
      // Sempre limpar o token local, mesmo se a requisição falhar
      localStorage.removeItem('token');
    }
  }

  /**
   * Obter dados do usuário autenticado
   */
  async getCurrentUser(): Promise<User> {
    return httpClient.get<User>('/user');
  }

  /**
   * Verificar se o token é válido
   */
  async verifyToken(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Solicitar redefinição de senha
   */
  async requestPasswordReset(email: string): Promise<void> {
    await httpClient.post('/password/email', { email });
  }

  /**
   * Redefinir senha com token
   */
  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    await httpClient.post('/password/reset', data);
  }

  /**
   * Verificar email
   */
  async verifyEmail(data: { id: string; hash: string; expires: string; signature: string }): Promise<void> {
    await httpClient.post(`/email/verify/${data.id}/${data.hash}`, {
      expires: data.expires,
      signature: data.signature,
    });
  }

  /**
   * Reenviar email de verificação
   */
  async resendVerificationEmail(): Promise<void> {
    await httpClient.post('/email/verification-notification');
  }
}

// Exportar instância singleton
export const authService = new AuthService();