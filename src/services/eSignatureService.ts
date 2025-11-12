/**
 * E-Signature Documents Service
 * Handles all e-signature document and template API calls
 */

import api from '@/lib/axios';

export interface ESignatureDocument {
  id: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  fileUrl?: string; // Original PDF file URL
  signedFileUrl?: string; // Signed PDF file URL (for completed/signed documents)
  previewImages?: string[]; // Base64 preview images for each page
  status: 'pending' | 'signed';
  sharedToInternal: boolean;
  sharedToExternal: boolean;
  internalUsers?: Array<{ id: number; name: string; email: string }>;
  externalUsers?: Array<{ email: string; token?: string }>; // token for public link access
  deadline?: string; // ISO 8601 date string
  reminderSent?: boolean;
  lastUpdatedAt: string;
  createdAt: string;
  createdBy: number;
  fieldMappings?: FieldMapping[];
  // PDF metadata
  pdfDpi?: number;
  pdfPageDimensions?: Array<{ width: number; height: number }>; // Dimensions for each page
}

export interface FieldMapping {
  id: string;
  fieldType: 'fullname' | 'email' | 'date' | 'customText' | 'checkbox' | 'radio' | 'select' | 'signature';
  fieldName: string;
  x: number; // X position in PDF points (1/72 inch)
  y: number; // Y position in PDF points (1/72 inch)
  width: number; // Width in PDF points
  height: number; // Height in PDF points
  assignedTo?: 'internal' | 'external';
  assignedUserId?: number;
  assignedEmail?: string;
  signerPlaceholder?: string; // e.g., "Signer 1", "Staff Role", "External Role" - used in templates
  required: boolean;
  pageNumber: number;
  // Options for checkbox, radio, and select fields
  options?: string[]; // Array of option values
  defaultOption?: string; // Default selected option for select/radio
  // PDF metadata for coordinate conversion
  pdfDpi?: number; // PDF DPI (default: 72)
  pdfPageWidth?: number; // Original PDF page width in points
  pdfPageHeight?: number; // Original PDF page height in points
}

export interface Template {
  id: string;
  templateName: string;
  originalFile: string;
  fileUrl: string; // Original PDF file URL
  previewImages?: string[]; // Base64 preview images for each page
  fileSize: number;
  createdAt: string;
  fieldMappings: FieldMapping[]; // Field mappings with signerPlaceholder instead of actual user assignments
  createdBy: number;
  // PDF metadata
  pdfDpi?: number;
  pdfPageDimensions?: Array<{ width: number; height: number }>;
}

export interface UploadDocumentRequest {
  file: File | string; // File object or base64 string
  fileName?: string;
}

export interface CreateDocumentRequest {
  fileName: string;
  file: string; // Base64 data URL
  mimeType: string;
}

export interface UpdateDocumentRequest {
  fileName?: string;
  fieldMappings?: FieldMapping[];
}

export interface ShareDocumentRequest {
  internalUserIds?: number[];
  externalEmails?: string[];
  deadline?: string; // ISO 8601 date string
  sendReminder?: boolean; // Whether to send reminder before deadline
}

export interface DocumentListResponse {
  success: boolean;
  message: string;
  data?: ESignatureDocument[];
  count?: number;
}

export interface DocumentResponse {
  success: boolean;
  message: string;
  data?: ESignatureDocument;
}

export interface TemplateListResponse {
  success: boolean;
  message: string;
  data?: Template[];
  count?: number;
}

export interface TemplateResponse {
  success: boolean;
  message: string;
  data?: Template;
}

// Workflow interface (not part of the main API brief - placeholder for future implementation)
export interface Workflow {
  id: string;
  documentId: string;
  signingOrder: Array<{
    userId?: number;
    email?: string;
    type: 'internal' | 'external';
    order: number;
    status: 'pending' | 'signed' | 'skipped';
    signedAt?: string;
    name?: string;
  }>;
}

export interface WorkflowResponse {
  success: boolean;
  message: string;
  data?: Workflow;
}

class ESignatureService {
  /**
   * Get all e-signature documents
   */
  async getDocuments(page?: number, limit?: number, search?: string): Promise<DocumentListResponse> {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (search) params.search = search;

    const response = await api.get<DocumentListResponse>('/e-signature/documents', { params });
    return response.data;
  }

  /**
   * Get a single document by ID
   */
  async getDocumentById(id: string): Promise<DocumentResponse> {
    const response = await api.get<DocumentResponse>(`/e-signature/documents/${id}`);
    return response.data;
  }

  /**
   * Upload a new document
   * Supports both File object (multipart/form-data) and base64 string
   */
  async uploadDocument(file: File, fileName?: string): Promise<DocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (fileName) {
      formData.append('fileName', fileName);
    }

    const response = await api.post<DocumentResponse>('/e-signature/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Create a new document with base64
   */
  async createDocument(data: CreateDocumentRequest): Promise<DocumentResponse> {
    const response = await api.post<DocumentResponse>('/e-signature/documents/upload', {
      file: data.file,
      fileName: data.fileName,
    });
    return response.data;
  }

  /**
   * Update document (field mappings, etc.)
   */
  async updateDocument(id: string, data: UpdateDocumentRequest): Promise<DocumentResponse> {
    const response = await api.put<DocumentResponse>(`/e-signature/documents/${id}`, data);
    return response.data;
  }

  /**
   * Delete a document
   */
  async deleteDocument(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/e-signature/documents/${id}`);
    return response.data;
  }

  /**
   * Share document with internal/external users
   */
  async shareDocument(id: string, data: ShareDocumentRequest): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(`/e-signature/documents/${id}/share`, data);
    return response.data;
  }

  /**
   * Download document (original or signed)
   */
  async downloadDocument(id: string, type: 'original' | 'signed' = 'original'): Promise<Blob> {
    const response = await api.get(`/e-signature/documents/${id}/download`, {
      params: { type },
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Get document view URL (returns signed PDF if available, otherwise original)
   */
  async getDocumentViewUrl(id: string): Promise<string> {
    const response = await api.get<{ success: boolean; data: { fileUrl: string } }>(`/e-signature/documents/${id}/view`);
    return response.data.data.fileUrl;
  }

  /**
   * View document (get signed PDF URL if available, otherwise original)
   */
  async viewDocument(id: string): Promise<string> {
    return this.getDocumentViewUrl(id);
  }

  /**
   * Get all templates
   */
  async getTemplates(page?: number, limit?: number): Promise<TemplateListResponse> {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await api.get<TemplateListResponse>('/e-signature/templates', { params });
    return response.data;
  }

  /**
   * Get a single template by ID
   */
  async getTemplateById(id: string): Promise<TemplateResponse> {
    const response = await api.get<TemplateResponse>(`/e-signature/templates/${id}`);
    return response.data;
  }

  /**
   * Upload a template
   * Supports both File object (multipart/form-data) and base64 string
   */
  async uploadTemplate(file: File, templateName: string): Promise<TemplateResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('templateName', templateName);

    const response = await api.post<TemplateResponse>('/e-signature/templates/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Create document from template
   */
  async createFromTemplate(templateId: string, fileName?: string): Promise<DocumentResponse> {
    const response = await api.post<DocumentResponse>(`/e-signature/templates/${templateId}/create-document`, {
      fileName,
    });
    return response.data;
  }

  /**
   * Update a template
   */
  async updateTemplate(id: string, data: { templateName?: string; fieldMappings?: FieldMapping[] }): Promise<TemplateResponse> {
    const response = await api.put<TemplateResponse>(`/e-signature/templates/${id}`, data);
    return response.data;
  }

  /**
   * Save document as template
   */
  async saveDocumentAsTemplate(documentId: string, templateName: string): Promise<TemplateResponse> {
    const response = await api.post<TemplateResponse>(`/e-signature/documents/${documentId}/save-as-template`, {
      templateName,
    });
    return response.data;
  }

  /**
   * Delete a template
   */
  async deleteTemplate(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/e-signature/templates/${id}`);
    return response.data;
  }

  /**
   * Get workflow for a document (placeholder - not in API brief)
   * TODO: Implement when workflow API is available
   */
  async getWorkflow(documentId: string): Promise<WorkflowResponse> {
    // Placeholder implementation - returns empty workflow
    return {
      success: true,
      message: 'Workflow not implemented',
      data: {
        id: `workflow_${documentId}`,
        documentId,
        signingOrder: [],
      },
    };
  }

  /**
   * Update workflow for a document (placeholder - not in API brief)
   * TODO: Implement when workflow API is available
   */
  async updateWorkflow(documentId: string, workflow: Workflow): Promise<WorkflowResponse> {
    // Placeholder implementation
    return {
      success: true,
      message: 'Workflow not implemented',
      data: workflow,
    };
  }
}

const eSignatureService = new ESignatureService();
export default eSignatureService;
