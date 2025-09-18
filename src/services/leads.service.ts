// ============================================================================
// Leads Service - Serviço de gerenciamento de leads
// ============================================================================

import httpClient from './http-client';
import type {
  Lead,
  PaginatedResponse,
} from '@/types/api';

export interface CreateLeadData {
  name: string;
  email: string;
  phone?: string;
  campaign_id: number;
  custom_fields?: Record<string, unknown>;
}

export interface UpdateLeadData {
  name?: string;
  email?: string;
  phone?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  notes?: string;
  custom_fields?: Record<string, unknown>;
}

export interface LeadFilters {
  campaign_id?: number;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
  sort_by?: 'name' | 'email' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

export interface LeadStats {
  total_leads: number;
  new_leads: number;
  contacted_leads: number;
  qualified_leads: number;
  converted_leads: number;
  lost_leads: number;
  conversion_rate: number;
  daily_leads: {
    date: string;
    count: number;
  }[];
}

export class LeadsService {
  /**
   * Obter todos os leads do usuário
   */
  async getLeads(filters: LeadFilters = {}): Promise<PaginatedResponse<Lead>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/leads?${queryString}` : '/leads';
    
    return httpClient.get<PaginatedResponse<Lead>>(endpoint);
  }

  /**
   * Obter lead específico por ID
   */
  async getLead(id: number): Promise<Lead> {
    return httpClient.get<Lead>(`/leads/${id}`);
  }

  /**
   * Criar novo lead
   */
  async createLead(data: CreateLeadData): Promise<Lead> {
    return httpClient.post<Lead>('/leads', data);
  }

  /**
   * Atualizar lead
   */
  async updateLead(id: number, data: UpdateLeadData): Promise<Lead> {
    return httpClient.put<Lead>(`/leads/${id}`, data);
  }

  /**
   * Excluir lead
   */
  async deleteLead(id: number): Promise<void> {
    await httpClient.delete(`/leads/${id}`);
  }

  /**
   * Excluir múltiplos leads
   */
  async deleteMultipleLeads(ids: number[]): Promise<void> {
    await httpClient.delete('/leads/bulk', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Atualizar status do lead
   */
  async updateLeadStatus(
    id: number, 
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  ): Promise<Lead> {
    return httpClient.patch<Lead>(`/leads/${id}/status`, { status });
  }

  /**
   * Adicionar nota ao lead
   */
  async addLeadNote(id: number, note: string): Promise<void> {
    await httpClient.post(`/leads/${id}/notes`, { note });
  }

  /**
   * Obter notas do lead
   */
  async getLeadNotes(id: number): Promise<{
    id: number;
    note: string;
    created_at: string;
    user_name: string;
  }[]> {
    return httpClient.get(`/leads/${id}/notes`);
  }

  /**
   * Obter leads por campanha
   */
  async getLeadsByCampaign(campaignId: number, filters: Omit<LeadFilters, 'campaign_id'> = {}): Promise<PaginatedResponse<Lead>> {
    return this.getLeads({ ...filters, campaign_id: campaignId });
  }

  /**
   * Obter estatísticas dos leads
   */
  async getLeadsStats(
    filters: { 
      campaign_id?: number; 
      date_from?: string; 
      date_to?: string; 
    } = {}
  ): Promise<LeadStats> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/leads/stats?${queryString}` : '/leads/stats';
    
    return httpClient.get<LeadStats>(endpoint);
  }

  /**
   * Exportar leads
   */
  async exportLeads(
    filters: LeadFilters = {},
    format: 'csv' | 'xlsx' = 'csv'
  ): Promise<{ download_url: string }> {
    const params = new URLSearchParams();
    
    Object.entries({ ...filters, format }).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    return httpClient.post('/leads/export', Object.fromEntries(params));
  }

  /**
   * Importar leads de arquivo CSV
   */
  async importLeads(
    file: File,
    campaignId: number,
    mapping: Record<string, string>
  ): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('campaign_id', campaignId.toString());
    formData.append('mapping', JSON.stringify(mapping));

    return httpClient.post('/leads/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Obter leads recentes
   */
  async getRecentLeads(limit: number = 10): Promise<Lead[]> {
    const response = await this.getLeads({ 
      per_page: limit, 
      sort_by: 'created_at', 
      sort_order: 'desc' 
    });
    return response.data;
  }

  /**
   * Marcar lead como convertido
   */
  async convertLead(id: number, conversionValue?: number): Promise<Lead> {
    return httpClient.patch<Lead>(`/leads/${id}/convert`, { 
      conversion_value: conversionValue 
    });
  }

  /**
   * Obter histórico de atividades do lead
   */
  async getLeadActivity(id: number): Promise<{
    id: number;
    action: string;
    description: string;
    created_at: string;
    user_name?: string;
  }[]> {
    return httpClient.get(`/leads/${id}/activity`);
  }
}

// Exportar instância singleton
export const leadsService = new LeadsService();