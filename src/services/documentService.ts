/**
 * Document Center Service
 * Handles all document-related API calls
 */

import api from '@/lib/axios';

export interface DocumentFolder {
  id: string;
  name: string;
  parentId: string | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  publicToken?: string | null;
  publicUrl?: string | null;
  subfolderCount?: number;
  fileCount?: number;
}

export interface DocumentFile {
  id: string;
  name: string;
  folderId: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  publicToken?: string | null;
  publicUrl?: string | null;
  fileUrl?: string; // Virtual field from backend
}

export interface CreateFolderRequest {
  name: string;
  parentId?: string | null;
}

export interface UpdateFolderRequest {
  name: string;
}

export interface UploadFileRequest {
  name: string;
  folderId: string;
  file: string; // Base64 data URL
  mimeType?: string;
}

export interface UpdateFileRequest {
  name: string;
}

export interface ShareResourceRequest {
  internal?: number[];
  external?: string[];
}

export interface ShareInfo {
  internal: Array<{
    userId: number;
    fullname: string;
    email: string;
    sharedAt: string;
  }>;
  external: Array<{
    email: string;
    sharedAt: string;
  }>;
  publicToken: string | null;
  publicUrl: string | null;
}

export interface SearchResult {
  folders: Array<{
    id: string;
    name: string;
    parentId: string | null;
    path: string;
  }>;
  files: Array<{
    id: string;
    name: string;
    folderId: string;
    folderName: string;
    path: string;
  }>;
}

export interface FolderResponse {
  success: boolean;
  message: string;
  data?: DocumentFolder;
}

export interface FolderListResponse {
  success: boolean;
  message: string;
  data?: DocumentFolder[];
  count?: number;
}

export interface FileResponse {
  success: boolean;
  message: string;
  data?: DocumentFile;
}

export interface FileListResponse {
  success: boolean;
  message: string;
  data?: DocumentFile[];
  count?: number;
}

export interface ShareResponse {
  success: boolean;
  message: string;
  data?: {
    publicToken: string | null;
    publicUrl: string | null;
    internalShares: number;
    externalShares: number;
  };
}

export interface ShareInfoResponse {
  success: boolean;
  message: string;
  data?: ShareInfo;
}

export interface SearchResponse {
  success: boolean;
  message: string;
  data?: SearchResult;
  count?: number;
}

class DocumentService {
  // ==================== FOLDER METHODS ====================

  /**
   * Get all folders (root or within parent)
   */
  async getFolders(parentId?: string | null): Promise<FolderListResponse> {
    const params: any = {};
    if (parentId !== undefined) {
      params.parentId = parentId;
    }
    const response = await api.get<FolderListResponse>('/documents/folders', { params });
    return response.data;
  }

  /**
   * Create a new folder
   */
  async createFolder(data: CreateFolderRequest): Promise<FolderResponse> {
    const response = await api.post<FolderResponse>('/documents/folders', data);
    return response.data;
  }

  /**
   * Update folder (rename)
   */
  async updateFolder(folderId: string, data: UpdateFolderRequest): Promise<FolderResponse> {
    const response = await api.put<FolderResponse>(`/documents/folders/${folderId}`, data);
    return response.data;
  }

  /**
   * Delete folder (recursive)
   */
  async deleteFolder(folderId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/documents/folders/${folderId}`);
    return response.data;
  }

  // ==================== FILE METHODS ====================

  /**
   * Get files in folder
   */
  async getFiles(folderId: string): Promise<FileListResponse> {
    const response = await api.get<FileListResponse>('/documents/files', {
      params: { folderId }
    });
    return response.data;
  }

  /**
   * Upload a file
   */
  async uploadFile(data: UploadFileRequest): Promise<FileResponse> {
    const response = await api.post<FileResponse>('/documents/files', data);
    return response.data;
  }

  /**
   * Get file details
   */
  async getFileById(fileId: string): Promise<FileResponse> {
    const response = await api.get<FileResponse>(`/documents/files/${fileId}`);
    return response.data;
  }

  /**
   * Download file
   */
  async downloadFile(fileId: string): Promise<Blob> {
    const response = await api.get(`/documents/files/${fileId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Update file (rename)
   */
  async updateFile(fileId: string, data: UpdateFileRequest): Promise<FileResponse> {
    const response = await api.put<FileResponse>(`/documents/files/${fileId}`, data);
    return response.data;
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/documents/files/${fileId}`);
    return response.data;
  }

  // ==================== SHARING METHODS ====================

  /**
   * Get sharing information
   */
  async getShares(resourceType: 'folder' | 'file', resourceId: string): Promise<ShareInfoResponse> {
    const response = await api.get<ShareInfoResponse>(`/documents/${resourceType}/${resourceId}/shares`);
    return response.data;
  }

  /**
   * Share resource
   */
  async shareResource(resourceType: 'folder' | 'file', resourceId: string, data: ShareResourceRequest): Promise<ShareResponse> {
    const response = await api.post<ShareResponse>(`/documents/${resourceType}/${resourceId}/shares`, data);
    return response.data;
  }

  /**
   * Remove sharing
   */
  async removeSharing(resourceType: 'folder' | 'file', resourceId: string, type?: 'internal' | 'external' | 'public' | 'all'): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/documents/${resourceType}/${resourceId}/shares`, {
      data: type ? { type } : undefined
    });
    return response.data;
  }

  /**
   * Remove internal share with specific user
   */
  async removeInternalShare(resourceType: 'folder' | 'file', resourceId: string, userId: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/documents/${resourceType}/${resourceId}/shares/internal/${userId}`);
    return response.data;
  }

  // ==================== SEARCH METHODS ====================

  /**
   * Search folders and files
   */
  async searchDocuments(query: string, type?: 'folder' | 'file' | 'all'): Promise<SearchResponse> {
    const response = await api.get<SearchResponse>('/documents/search', {
      params: { query, type: type || 'all' }
    });
    return response.data;
  }

  // ==================== PUBLIC ACCESS METHODS (No Auth) ====================

  /**
   * Get public resource by token (no authentication required)
   */
  async getPublicResource(token: string): Promise<{
    success: boolean;
    message: string;
    data?: {
      type: 'folder' | 'file';
      id: string;
      name: string;
      subfolders?: Array<{ id: string; name: string }>;
      files?: Array<{ id: string; name: string; fileSize: number; mimeType: string }>;
      fileSize?: number;
      mimeType?: string;
      fileUrl?: string;
    };
  }> {
    // Use fetch instead of api to avoid adding auth headers
    const baseURL = import.meta.env.VITE_BASE_URL || '';
    const response = await fetch(`${baseURL}/documents/public/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ success: false, message: 'Failed to fetch resource' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Download public resource (no authentication required)
   */
  async downloadPublicResource(token: string, fileName?: string): Promise<Blob> {
    const baseURL = import.meta.env.VITE_BASE_URL || '';
    const response = await fetch(`${baseURL}/documents/public/${token}/download`, {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Failed to download resource');
    }
    return response.blob();
  }

  /**
   * Get public file from shared folder (no authentication required)
   */
  async getPublicFile(token: string, fileId: string): Promise<Blob> {
    const baseURL = import.meta.env.VITE_BASE_URL || '';
    const response = await fetch(`${baseURL}/documents/public/${token}/files/${fileId}`, {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Failed to get file');
    }
    return response.blob();
  }
}

export default new DocumentService();

