/**
 * Example Service Template
 * Use this as a template for creating new services with axios
 * 
 * Key Benefits:
 * - Automatic authentication (token added via interceptor)
 * - Automatic 401 logout (handled by interceptor)
 * - Automatic JSON parsing
 * - TypeScript type safety
 * - Clean, readable code
 */

import api from '@/lib/axios';

// Define your interfaces
interface ExampleData {
  id: number;
  name: string;
  status: boolean;
}

interface ExampleResponse {
  success: boolean;
  message: string;
  data?: ExampleData;
}

interface ExampleListResponse {
  success: boolean;
  message: string;
  data?: ExampleData[];
}

class ExampleService {
  /**
   * GET request - Fetch list
   */
  async getList(): Promise<ExampleListResponse> {
    const response = await api.get<ExampleListResponse>('/endpoint');
    return response.data;
  }

  /**
   * GET request - Fetch by ID
   */
  async getById(id: number): Promise<ExampleResponse> {
    const response = await api.get<ExampleResponse>(`/endpoint/${id}`);
    return response.data;
  }

  /**
   * POST request - Create
   */
  async create(data: Partial<ExampleData>): Promise<ExampleResponse> {
    const response = await api.post<ExampleResponse>('/endpoint', data);
    return response.data;
  }

  /**
   * PUT request - Update
   */
  async update(id: number, data: Partial<ExampleData>): Promise<ExampleResponse> {
    const response = await api.put<ExampleResponse>(`/endpoint/${id}`, data);
    return response.data;
  }

  /**
   * PATCH request - Partial update
   */
  async partialUpdate(id: number, data: Partial<ExampleData>): Promise<ExampleResponse> {
    const response = await api.patch<ExampleResponse>(`/endpoint/${id}`, data);
    return response.data;
  }

  /**
   * DELETE request - Delete
   */
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/endpoint/${id}`);
    return response.data;
  }

  /**
   * GET request with query parameters
   */
  async search(query: string, page: number = 1, limit: number = 10): Promise<ExampleListResponse> {
    const response = await api.get<ExampleListResponse>('/endpoint/search', {
      params: { query, page, limit }
    });
    return response.data;
  }

  /**
   * POST request with FormData (file upload)
   */
  async uploadFile(file: File, additionalData?: Record<string, any>): Promise<ExampleResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response = await api.post<ExampleResponse>('/endpoint/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Request with custom timeout
   */
  async slowOperation(data: any): Promise<ExampleResponse> {
    const response = await api.post<ExampleResponse>('/endpoint/slow', data, {
      timeout: 60000, // 60 seconds
    });
    return response.data;
  }

  /**
   * Request with custom headers
   */
  async customHeaderRequest(data: any): Promise<ExampleResponse> {
    const response = await api.post<ExampleResponse>('/endpoint/custom', data, {
      headers: {
        'X-Custom-Header': 'custom-value',
      },
    });
    return response.data;
  }
}

export default new ExampleService();

