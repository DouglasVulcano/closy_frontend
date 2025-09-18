// ============================================================================
// User Service - Serviço de gerenciamento de usuários
// ============================================================================

import httpClient from './http-client';
import type {
  User,
  UpdateUserData,
  ChangePasswordData,
} from '@/types/api';

export class UserService {
  /**
   * Atualizar dados do usuário
   */
  async updateProfile(data: UpdateUserData): Promise<User> {
    const response = await httpClient.put<{ message: string; user: User }>('/user', data);
    return response.user;
  }

  /**
   * Alterar senha do usuário
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    await httpClient.put('/user/password', data);
  }

  /**
   * Excluir conta do usuário
   */
  async deleteAccount(): Promise<void> {
    await httpClient.delete('/user');
  }

  /**
   * Obter estatísticas do usuário
   */
  async getUserStats(): Promise<{
    campaigns_count: number;
    leads_count: number;
    total_clicks: number;
    conversion_rate: number;
  }> {
    return httpClient.get('/user/stats');
  }

  /**
   * Atualizar foto de perfil
   */
  async updateProfilePicture(imageUrl: string): Promise<User> {
    return this.updateProfile({ profile_picture: imageUrl });
  }

  /**
   * Obter configurações de notificação
   */
  async getNotificationSettings(): Promise<{
    email_notifications: boolean;
    push_notifications: boolean;
    marketing_emails: boolean;
    weekly_reports: boolean;
    lead_alerts: boolean;
    campaign_updates: boolean;
  }> {
    return httpClient.get('/user/notification-settings');
  }

  /**
   * Atualizar configurações de notificação
   */
  async updateNotificationSettings(settings: {
    email_notifications?: boolean;
    push_notifications?: boolean;
    marketing_emails?: boolean;
    weekly_reports?: boolean;
    lead_alerts?: boolean;
    campaign_updates?: boolean;
  }): Promise<void> {
    await httpClient.put('/user/notification-settings', settings);
  }

  /**
   * Obter configurações de segurança
   */
  async getSecuritySettings(): Promise<{
    two_factor_enabled: boolean;
    login_alerts: boolean;
    session_timeout: number;
    last_login_at?: string;
    last_login_ip?: string;
  }> {
    return httpClient.get('/user/security-settings');
  }

  /**
   * Ativar autenticação de dois fatores
   */
  async enableTwoFactor(): Promise<{
    qr_code: string;
    secret: string;
    recovery_codes: string[];
  }> {
    return httpClient.post('/user/two-factor/enable');
  }

  /**
   * Confirmar ativação da autenticação de dois fatores
   */
  async confirmTwoFactor(code: string): Promise<void> {
    await httpClient.post('/user/two-factor/confirm', { code });
  }

  /**
   * Desativar autenticação de dois fatores
   */
  async disableTwoFactor(password: string): Promise<void> {
    await httpClient.delete('/user/two-factor', { 
      headers: { 'X-Password': password } 
    });
  }

  /**
   * Gerar novos códigos de recuperação
   */
  async generateRecoveryCodes(): Promise<{ recovery_codes: string[] }> {
    return httpClient.post('/user/two-factor/recovery-codes');
  }
}

// Exportar instância singleton
export const userService = new UserService();