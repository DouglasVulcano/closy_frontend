// ============================================================================
// Plans Service - Serviço de gerenciamento de planos
// ============================================================================

import httpClient from './http-client';
import type {
  Plan,
  CheckoutRequest,
  CheckoutResponse,
} from '@/types/api';

export class PlansService {
  /**
   * Obter todos os planos disponíveis
   */
  async getPlans(): Promise<Plan[]> {
    return httpClient.get<Plan[]>('/plans');
  }

  /**
   * Obter plano específico por ID
   */
  async getPlan(id: number): Promise<Plan> {
    return httpClient.get<Plan>(`/plans/${id}`);
  }

  /**
   * Obter planos ativos
   */
  async getActivePlans(): Promise<Plan[]> {
    return httpClient.get<Plan[]>('/plans?active=true');
  }

  /**
   * Criar sessão de checkout do Stripe
   */
  async createCheckout(data: CheckoutRequest): Promise<CheckoutResponse> {
    return httpClient.post<CheckoutResponse>('/stripe/checkout', data);
  }

  /**
   * Obter informações da assinatura atual
   */
  async getCurrentSubscription(): Promise<{
    id: string;
    status: string;
    plan: Plan;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    trial_end?: string;
  } | null> {
    try {
      return await httpClient.get('/subscription/current');
    } catch (error) {
      // Se não houver assinatura, retornar null
      return null;
    }
  }

  /**
   * Cancelar assinatura
   */
  async cancelSubscription(): Promise<void> {
    await httpClient.post('/subscription/cancel');
  }

  /**
   * Reativar assinatura cancelada
   */
  async resumeSubscription(): Promise<void> {
    await httpClient.post('/subscription/resume');
  }

  /**
   * Obter histórico de faturas
   */
  async getInvoices(): Promise<{
    id: string;
    amount_paid: number;
    currency: string;
    status: string;
    created: number;
    invoice_pdf?: string;
    hosted_invoice_url?: string;
  }[]> {
    return httpClient.get('/subscription/invoices');
  }

  /**
   * Obter próxima fatura
   */
  async getUpcomingInvoice(): Promise<{
    amount_due: number;
    currency: string;
    period_start: number;
    period_end: number;
  } | null> {
    try {
      return await httpClient.get('/subscription/upcoming-invoice');
    } catch {
      return null;
    }
  }

  /**
   * Atualizar método de pagamento
   */
  async updatePaymentMethod(): Promise<{ setup_intent_client_secret: string }> {
    return httpClient.post('/subscription/update-payment-method');
  }

  /**
   * Obter métodos de pagamento
   */
  async getPaymentMethods(): Promise<{
    id: string;
    type: string;
    card?: {
      brand: string;
      last4: string;
      exp_month: number;
      exp_year: number;
    };
    is_default: boolean;
  }[]> {
    return httpClient.get('/subscription/payment-methods');
  }

  /**
   * Definir método de pagamento padrão
   */
  async setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
    await httpClient.post('/subscription/default-payment-method', {
      payment_method_id: paymentMethodId,
    });
  }

  /**
   * Remover método de pagamento
   */
  async removePaymentMethod(paymentMethodId: string): Promise<void> {
    await httpClient.delete(`/subscription/payment-methods/${paymentMethodId}`);
  }
}

// Exportar instância singleton
export const plansService = new PlansService();