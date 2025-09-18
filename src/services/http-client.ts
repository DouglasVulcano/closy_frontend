// ============================================================================
// HTTP Client - Cliente HTTP base com interceptors e configurações centralizadas
// ============================================================================

import { HttpError, type RequestConfig, type AuthenticatedRequestConfig } from '@/types/api';

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

export interface RequestInterceptor {
  onRequest?: (config: RequestInit & { url: string }) => RequestInit & { url: string };
  onError?: (error: Error) => Promise<never>;
}

export interface ResponseInterceptor {
  onResponse?: (response: Response) => Response | Promise<Response>;
  onError?: (error: HttpError) => Promise<never>;
}

class HttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(config: HttpClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.defaultHeaders,
    };
  }

  // Adicionar interceptors
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  // Método privado para aplicar interceptors de request
  private applyRequestInterceptors(config: RequestInit & { url: string }): RequestInit & { url: string } {
    return this.requestInterceptors.reduce((acc, interceptor) => {
      return interceptor.onRequest ? interceptor.onRequest(acc) : acc;
    }, config);
  }

  // Método privado para aplicar interceptors de response
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    return this.responseInterceptors.reduce(async (acc, interceptor) => {
      const resolvedResponse = await acc;
      return interceptor.onResponse ? interceptor.onResponse(resolvedResponse) : resolvedResponse;
    }, Promise.resolve(response));
  }

  // Método privado para tratar erros com interceptors
  private async handleError(error: HttpError): Promise<never> {
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onError) {
        await interceptor.onError(error);
      }
    }
    throw error;
  }

  // Método privado para fazer requisições
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    config: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Configurar headers
    const headers = {
      ...this.defaultHeaders,
      ...config.headers,
      ...options.headers,
    };

    // Configurar request
    let requestConfig: RequestInit & { url: string } = {
      ...options,
      url,
      headers,
    };

    // Aplicar interceptors de request
    try {
      requestConfig = this.applyRequestInterceptors(requestConfig);
    } catch (error) {
      for (const interceptor of this.requestInterceptors) {
        if (interceptor.onError) {
          await interceptor.onError(error as Error);
        }
      }
      throw error;
    }

    // Configurar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || this.timeout);

    try {
      // Fazer requisição
      const response = await fetch(requestConfig.url, {
        ...requestConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Aplicar interceptors de response
      const interceptedResponse = await this.applyResponseInterceptors(response);

      // Verificar se a resposta foi bem-sucedida
      if (!interceptedResponse.ok) {
        let errorMessage = `HTTP ${interceptedResponse.status}: ${interceptedResponse.statusText}`;
        let errors: Record<string, string[]> | undefined;

        try {
          const errorData = await interceptedResponse.json();
          errorMessage = errorData.message || errorMessage;
          errors = errorData.errors;
        } catch {
          // Se não conseguir parsear o JSON, usar a mensagem padrão
        }

        const httpError = new HttpError(interceptedResponse.status, errorMessage, errors);
        return this.handleError(httpError);
      }

      // Tentar parsear JSON
      try {
        return await interceptedResponse.json();
      } catch {
        // Se não for JSON, retornar como texto
        return (await interceptedResponse.text()) as unknown as T;
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof HttpError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          const timeoutError = new HttpError(408, 'Request timeout');
          return this.handleError(timeoutError);
        }

        const networkError = new HttpError(0, `Network error: ${error.message}`);
        return this.handleError(networkError);
      }

      const unknownError = new HttpError(0, 'Unknown error occurred');
      return this.handleError(unknownError);
    }
  }

  // Métodos HTTP públicos
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, config);
  }

  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    );
  }

  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    );
  }

  async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    );
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, config);
  }

  // Método para upload de arquivos
  async upload<T>(endpoint: string, file: File, config?: RequestConfig): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: formData,
      },
      {
        ...config,
        headers: {
          // Remover Content-Type para deixar o browser definir o boundary
          ...config?.headers,
        },
      }
    );
  }

  // Método para upload direto para S3
  async uploadToS3(presignedUrl: string, file: File): Promise<void> {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new HttpError(response.status, 'Failed to upload file to S3');
    }
  }
}

// Criar instância do cliente HTTP
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const httpClient = new HttpClient({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Interceptor para adicionar token de autenticação
httpClient.addRequestInterceptor({
  onRequest: (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
});

// Interceptor para tratar erros de autenticação
httpClient.addResponseInterceptor({
  onError: async (error) => {
    if (error.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      
      // Redirecionar para login se não estiver na página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    throw error;
  },
});

export default httpClient;