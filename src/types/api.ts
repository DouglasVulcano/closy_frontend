// ============================================================================
// API Types - Tipos centralizados para todas as interfaces de API
// ============================================================================

// Base types
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  first_page_url: string;
  from: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  prev_page_url: string | null;
  to: number;
}

// User related types
export interface User {
  id: number;
  name: string;
  email: string;
  celular?: string;
  profile_picture?: string;
  role: 'USER' | 'STARTER' | 'PRO' | 'ADMIN';
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  trial_ends_at?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  celular: string;
  password: string;
  password_confirmation: string;
  recaptcha_token: string;
}

export interface LoginData {
  email: string;
  password: string;
  recaptcha_token: string;
}

export interface UpdateUserData {
  name?: string;
  celular?: string;
  profile_picture?: string;
}

export interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// Auth related types
export interface AuthResponse {
  token: string;
  user: User;
}

export type LoginResponse = AuthResponse;
export type RegisterResponse = AuthResponse;

// Plans related types
export interface Plan {
  id: number;
  name: string;
  price: string;
  role: string;
  active: boolean;
  trial_days: number;
  monthly_leads_limit: number;
  description: string;
  features: string;
  created_at: string;
  updated_at: string;
}

// Stripe related types
export interface CheckoutRequest {
  plan_id: number;
  return_success_url: string;
  return_cancel_url: string;
}

export interface CheckoutResponse {
  checkout_url: string;
}

export interface PortalRequest {
  return_url?: string;
}

export interface PortalResponse {
  portal_url: string;
}

// S3 Upload related types
export interface PresignedUrlRequest {
  file_name: string;
  content_type: string;
  directory: string;
}

export interface PresignedUrlResponse {
  presigned_url: string;
  file_name: string;
  content_type: string;
  expiration_minutes: number;
  public_url: string;
}

// Campaign related types
export interface Campaign {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  start_date: string | null;
  end_date: string | null;
  status: 'draft' | 'active' | 'paused' | 'completed';
  details: unknown | null;
  created_at: string;
  updated_at: string;
  leads_count: number;
  converted_leads_count: string;
  conversion: string;
  // Legacy properties for backward compatibility
  name?: string;
  leads?: number;
  updatedAt?: string;
}

// Lead related types (para futuras implementações)
export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  campaign_id: number;
  created_at: string;
  updated_at: string;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

// Request configuration types
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface AuthenticatedRequestConfig extends RequestConfig {
  requiresAuth?: boolean;
}