// ============================================================================
// Upload Service - Serviço de gerenciamento de uploads
// ============================================================================

import httpClient from './http-client';
import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
} from '@/types/api';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  maxSize?: number; // em bytes
  allowedTypes?: string[]; // tipos MIME permitidos
  directory?: string;
}

export class UploadService {
  private readonly DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly DEFAULT_ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ];

  /**
   * Validar arquivo antes do upload
   */
  private validateFile(file: File, options: UploadOptions = {}): void {
    const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
    const allowedTypes = options.allowedTypes || this.DEFAULT_ALLOWED_TYPES;

    // Validar tamanho
    if (file.size > maxSize) {
      throw new Error(`Arquivo muito grande. Tamanho máximo: ${this.formatFileSize(maxSize)}`);
    }

    // Validar tipo
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`);
    }
  }

  /**
   * Formatar tamanho do arquivo para exibição
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Gerar nome único para arquivo
   */
  private generateUniqueFileName(originalName: string, prefix?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const baseName = prefix || 'file';
    return `${baseName}-${timestamp}-${random}.${extension}`;
  }

  /**
   * Obter URL pré-assinada para upload
   */
  async getPresignedUrl(request: PresignedUrlRequest): Promise<PresignedUrlResponse> {
    return httpClient.post<PresignedUrlResponse>('/s3/presigned-url', request);
  }

  /**
   * Upload de arquivo para S3 com progresso
   */
  async uploadToS3(
    presignedUrl: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Configurar progresso
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            };
            onProgress(progress);
          }
        });
      }

      // Configurar eventos
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was aborted'));
      });

      // Fazer upload
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  /**
   * Upload completo de arquivo (obter URL + upload)
   */
  async uploadFile(
    file: File,
    options: UploadOptions = {}
  ): Promise<{ publicUrl: string; fileName: string }> {
    // Validar arquivo
    this.validateFile(file, options);

    // Gerar nome único
    const fileName = this.generateUniqueFileName(file.name, 'upload');
    const directory = options.directory || 'uploads/general';

    // Obter URL pré-assinada
    const presignedResponse = await this.getPresignedUrl({
      file_name: fileName,
      content_type: file.type,
      directory,
    });

    // Fazer upload
    await this.uploadToS3(presignedResponse.presigned_url, file, options.onProgress);

    return {
      publicUrl: presignedResponse.public_url,
      fileName: presignedResponse.file_name,
    };
  }

  /**
   * Upload de imagem de perfil
   */
  async uploadProfileImage(
    file: File,
    userId: number,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ publicUrl: string; fileName: string }> {
    return this.uploadFile(file, {
      directory: 'uploads/profiles',
      maxSize: 2 * 1024 * 1024, // 2MB para perfil
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      onProgress,
    });
  }

  /**
   * Upload de imagem para campanha
   */
  async uploadCampaignImage(
    file: File,
    campaignId: number,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ publicUrl: string; fileName: string }> {
    return this.uploadFile(file, {
      directory: `uploads/campaigns/${campaignId}`,
      maxSize: 10 * 1024 * 1024, // 10MB para campanhas
      allowedTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
      ],
      onProgress,
    });
  }

  /**
   * Upload múltiplo de arquivos
   */
  async uploadMultipleFiles(
    files: File[],
    options: UploadOptions = {}
  ): Promise<{ publicUrl: string; fileName: string }[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, options));
    return Promise.all(uploadPromises);
  }

  /**
   * Excluir arquivo do S3
   */
  async deleteFile(fileName: string, directory: string = 'uploads/general'): Promise<void> {
    await httpClient.delete('/s3/file', {
      headers: {
        'X-File-Name': fileName,
        'X-Directory': directory,
      },
    });
  }
}

// Exportar instância singleton
export const uploadService = new UploadService();