// ============================================================================
// Campaigns Service - Serviço de gerenciamento de campanhas
// ============================================================================

import httpClient from './http-client';
import type {
  Campaign,
  PaginatedResponse,
} from '@/types/api';

export interface CreateCampaignData {
  title: string;
  slug: string;
}

export interface UpdateCampaignData {
  title?: string;
  slug?: string;
  status?: 'draft' | 'active' | 'paused' | 'completed';
  start_date?: string | null;
  end_date?: string | null;
  details?: unknown;
}

export interface CampaignFilters {
  status?: 'draft' | 'active' | 'paused' | 'completed';
  title?: string;
  page?: number;
  per_page?: number;
}

export interface CampaignStats {
  total_views: number;
  total_clicks: number;
  total_leads: number;
  conversion_rate: number;
  click_through_rate: number;
  daily_stats: {
    date: string;
    views: number;
    clicks: number;
    leads: number;
  }[];
}

export class CampaignsService {
  /**
   * Obter todas as campanhas do usuário
   */
  async getCampaigns(filters: CampaignFilters = {}): Promise<PaginatedResponse<Campaign>> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/campaign?${queryString}` : '/campaign';

    return httpClient.get<PaginatedResponse<Campaign>>(endpoint);
  }

  /**
   * Obter campanha específica por ID
   */
  async getCampaign(id: number): Promise<Campaign> {
    return httpClient.get<Campaign>(`/campaigns/${id}`);
  }

  /**
   * Criar nova campanha
   */
  async createCampaign(data: CreateCampaignData): Promise<Campaign> {
    return httpClient.post<Campaign>('/campaign', data);
  }

  /**
   * Atualizar campanha
   */
  async updateCampaign(id: number, data: UpdateCampaignData): Promise<Campaign> {
    return httpClient.put<Campaign>(`/campaign/${id}`, data);
  }

  /**
   * Atualizar status da campanha
   */
  async updateCampaignStatus(id: number, status: 'draft' | 'active' | 'paused' | 'completed'): Promise<Campaign> {
    return httpClient.put<Campaign>(`/campaign/${id}`, { status });
  }

  /**
   * Excluir campanha
   */
  async deleteCampaign(id: number): Promise<void> {
    await httpClient.delete(`/campaign/${id}`);
  }

  /**
   * Obter estatísticas da campanha
   */
  async getCampaignStats(
    id: number,
    dateRange?: { start: string; end: string }
  ): Promise<CampaignStats> {
    const params = new URLSearchParams();

    if (dateRange) {
      params.append('start_date', dateRange.start);
      params.append('end_date', dateRange.end);
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `/campaigns/${id}/stats?${queryString}`
      : `/campaigns/${id}/stats`;

    return httpClient.get<CampaignStats>(endpoint);
  }

  /**
   * Obter preview da campanha
   */
  async getCampaignPreview(id: number): Promise<{ preview_url: string }> {
    return httpClient.get(`/campaigns/${id}/preview`);
  }

  /**
   * Exportar dados da campanha
   */
  async exportCampaignData(
    id: number,
    format: 'csv' | 'xlsx' = 'csv'
  ): Promise<{ download_url: string }> {
    return httpClient.post(`/campaigns/${id}/export`, { format });
  }

  /**
   * Obter campanhas ativas
   */
  async getActiveCampaigns(): Promise<Campaign[]> {
    const response = await this.getCampaigns({ status: 'active' });
    return response.data;
  }

  /**
   * Obter resumo das campanhas
   */
  async getCampaignsSummary(): Promise<{
    total_campaigns: number;
    active_campaigns: number;
    paused_campaigns: number;
    total_leads: number;
    total_views: number;
    average_conversion_rate: number;
  }> {
    return httpClient.get('/campaigns/summary');
  }
}

// Exportar instância singleton
export const campaignsService = new CampaignsService();