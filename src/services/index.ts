// ============================================================================
// Services Index - Exportações centralizadas de todos os services
// ============================================================================

// HTTP Client base
export { default as httpClient } from './http-client';

// Services
export { authService, AuthService } from './auth.service';
export { userService, UserService } from './user.service';
export { plansService, PlansService } from './plans.service';
export { uploadService, UploadService } from './upload.service';
export { campaignsService, CampaignsService } from './campaigns.service';
export { leadsService, LeadsService } from './leads.service';

// Import services for the services object
import { authService } from './auth.service';
import { userService } from './user.service';
import { plansService } from './plans.service';
import { uploadService } from './upload.service';
import { campaignsService } from './campaigns.service';
import { leadsService } from './leads.service';

// Types
export type * from '@/types/api';

// Interfaces específicas dos services
export type {
  UploadProgress,
  UploadOptions,
} from './upload.service';

export type {
  CreateCampaignData,
  UpdateCampaignData,
  CampaignFilters,
  CampaignStats,
} from './campaigns.service';

export type {
  CreateLeadData,
  UpdateLeadData,
  LeadFilters,
  LeadStats,
} from './leads.service';

// Objeto com todos os services para facilitar o uso
export const services = {
  auth: authService,
  user: userService,
  plans: plansService,
  upload: uploadService,
  campaigns: campaignsService,
  leads: leadsService,
} as const;

// Configuração global dos services
export const configureServices = (config: {
  baseURL?: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}) => {
  // Aqui você pode adicionar configurações globais se necessário
  console.log('Services configured with:', config);
};