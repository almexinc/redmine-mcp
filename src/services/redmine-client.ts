import axios, { AxiosInstance, AxiosError } from 'axios';
import { RedmineError } from '../types/redmine';
import { loadConfig, RedmineMcpConfig } from '../config';

export class RedmineApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, apiKey: string) {
    if (!baseURL) {
      throw new Error('Redmine base URL is required');
    }
    if (!apiKey) {
      throw new Error('Redmine API key is required');
    }

    this.client = axios.create({
      baseURL: baseURL.endsWith('/') ? baseURL : `${baseURL}/`,
      headers: {
        'X-Redmine-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<RedmineError>) => {
        if (error.response) {
          const errorMessage = error.response.data.errors
            ? error.response.data.errors.join(', ')
            : error.message;
          throw new Error(`Redmine API Error: ${errorMessage}`);
        }
        throw error;
      }
    );
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  async delete(endpoint: string): Promise<void> {
    await this.client.delete(endpoint);
  }

  async uploadFile(fileName: string, content: Buffer): Promise<{ token: string }> {
    const formData = new FormData();
    formData.append('file', new Blob([content]), fileName);

    const response = await this.client.post<{ upload: { token: string } }>(
      'uploads.json',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return { token: response.data.upload.token };
  }
}

// Create a singleton instance with configuration
let clientInstance: RedmineApiClient | null = null;
let currentConfig: RedmineMcpConfig | null = null;

export const getRedmineClient = (): RedmineApiClient => {
  // Load configuration if not already loaded or if client not created
  if (!clientInstance || !currentConfig) {
    currentConfig = loadConfig();
    clientInstance = new RedmineApiClient(currentConfig.url, currentConfig.apiKey);
  }
  return clientInstance;
};

export const resetRedmineClient = (): void => {
  clientInstance = null;
  currentConfig = null;
};
