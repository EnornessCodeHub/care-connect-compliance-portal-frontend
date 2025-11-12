# E-Signature Documents Module - Backend API Brief

## Overview

This document outlines the API endpoints required for the E-Signature Documents module. The module allows administrators to upload PDF documents, configure field mappings using drag-and-drop, assign documents to **one internal staff member** and **one external user**, save documents as templates, and track document signing status.

---

## Base URL

```
/api/v1/e-signature
```

---

## Data Models

### ESignatureDocument

```typescript
{
  id: string;                    // Unique document ID (e.g., "doc_1234567890")
  fileName: string;              // Display name of the document
  originalFileName: string;      // Original uploaded file name
  fileSize: number;              // File size in bytes
  fileUrl?: string;              // URL to access the original PDF file
  signedFileUrl?: string;        // URL to access the signed/completed PDF file
  previewImages?: string[];      // Base64 preview images for each page (for frontend display)
  status: 'pending' | 'signed'; // Document status (only two statuses)
  sharedToInternal: boolean;     // Whether shared with internal staff
  sharedToExternal: boolean;     // Whether shared with external users
  internalUsers?: Array<{        // Internal staff who have access (MAX 1 USER)
    id: number;
    name: string;
    email: string;
  }>;
  externalUsers?: Array<{        // External users who have access (MAX 1 USER)
    email: string;
    token?: string;               // Unique token for public link access
  }>;
  deadline?: string;             // ISO 8601 date string (optional)
  reminderSent?: boolean;        // Whether reminder email was sent
  lastUpdatedAt: string;        // ISO 8601 timestamp
  createdAt: string;             // ISO 8601 timestamp
  createdBy: number;             // User ID who created the document
  fieldMappings?: FieldMapping[]; // Configured field mappings
  // PDF metadata for coordinate conversion
  pdfDpi?: number;               // PDF DPI (default: 72)
  pdfPageDimensions?: Array<{    // Dimensions for each page in PDF points
    width: number;
    height: number;
  }>;
}
```

### FieldMapping

```typescript
{
  id: string;                    // Unique field ID
  fieldType: 'fullname' | 'email' | 'date' | 'customText' | 'checkbox' | 'radio' | 'select' | 'signature';
  fieldName: string;             // Display name of the field
  x: number;                     // X position in PDF points (1/72 inch), not pixels
  y: number;                     // Y position in PDF points (1/72 inch), not pixels
  width: number;                 // Field width in PDF points
  height: number;                // Field height in PDF points
  assignedTo?: 'internal' | 'external'; // Who can fill this field
  assignedUserId?: number;        // Specific user ID (if assigned to specific user)
  assignedEmail?: string;         // Specific email (if assigned to external user)
  signerPlaceholder?: string;    // Placeholder text for templates (e.g., "Signer 1", "Staff Role")
  required: boolean;             // Whether field is required
  pageNumber: number;            // PDF page number (1-indexed)
  // Options for checkbox, radio, and select fields
  options?: string[];            // Array of option values
  defaultOption?: string;         // Default selected option for select/radio
  // PDF metadata for coordinate conversion
  pdfDpi?: number;               // PDF DPI (default: 72)
  pdfPageWidth?: number;         // Original PDF page width in points
  pdfPageHeight?: number;        // Original PDF page height in points
}
```

### Template

```typescript
{
  id: string;                    // Unique template ID
  templateName: string;           // Template display name
  originalFile: string;           // Original file name
  fileUrl: string;                // URL to the template PDF
  previewImages?: string[];       // Base64 preview images for each page
  fileSize: number;               // File size in bytes
  visibility: 'private' | 'public'; // Template visibility
  createdAt: string;              // ISO 8601 timestamp
  fieldMappings: FieldMapping[];  // Pre-configured field mappings (with signerPlaceholder)
  createdBy: number;              // User ID who created the template
  // PDF metadata
  pdfDpi?: number;                // PDF DPI (default: 72)
  pdfPageDimensions?: Array<{     // Dimensions for each page in PDF points
    width: number;
    height: number;
  }>;
}
```

---

## API Endpoints

### 1. Document Management

#### GET `/api/v1/e-signature/documents`

**Description:** Get all e-signature documents for the authenticated user. Documents are sorted by `lastUpdatedAt` in descending order (newest first).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search query for file name

**Response:**
```json
{
  "success": true,
  "message": "Documents retrieved successfully",
  "data": [
    {
      "id": "doc_1234567890",
      "fileName": "Masharib Khan",
      "originalFileName": "Masharib Khan.pdf",
      "fileSize": 158003,
      "fileUrl": "http://localhost:3001/uploads/e-signature/documents/doc_1234567890.pdf",
      "signedFileUrl": null,
      "previewImages": ["data:image/png;base64,..."],
      "status": "pending",
      "sharedToInternal": true,
      "sharedToExternal": false,
      "internalUsers": [
        {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        }
      ],
      "externalUsers": [],
      "lastUpdatedAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "fieldMappings": [],
      "pdfDpi": 72,
      "pdfPageDimensions": [
        {
          "width": 612,
          "height": 792
        }
      ]
    }
  ],
  "count": 1
}
```

**Notes:**
- `internalUsers` array contains **maximum 1 user**
- `externalUsers` array contains **maximum 1 user**
- Documents are sorted by `lastUpdatedAt` DESC (newest first)

---

#### GET `/api/v1/e-signature/documents/:id`

**Description:** Get a single document by ID.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Document ID

**Response:**
```json
{
  "success": true,
  "message": "Document retrieved successfully",
  "data": {
    "id": "doc_1234567890",
    "fileName": "Masharib Khan",
    "originalFileName": "Masharib Khan.pdf",
    "fileSize": 158003,
    "fileUrl": "http://localhost:3001/uploads/e-signature/documents/doc_1234567890.pdf",
    "signedFileUrl": null,
    "previewImages": ["data:image/png;base64,..."],
    "status": "pending",
    "sharedToInternal": true,
    "sharedToExternal": false,
    "internalUsers": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    ],
    "externalUsers": [],
    "lastUpdatedAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "createdBy": 1,
    "fieldMappings": [],
    "pdfDpi": 72,
    "pdfPageDimensions": [
      {
        "width": 612,
        "height": 792
      }
    ]
  }
}
```

---

#### POST `/api/v1/e-signature/documents/upload`

**Description:** Upload a new PDF document.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `file`: PDF file (required)
- `fileName`: Optional custom file name (defaults to original file name)

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "doc_1234567890",
    "fileName": "Masharib Khan",
    "originalFileName": "Masharib Khan.pdf",
    "fileSize": 158003,
    "fileUrl": "http://localhost:3001/uploads/e-signature/documents/doc_1234567890.pdf",
    "signedFileUrl": null,
    "previewImages": ["data:image/png;base64,..."],
    "status": "pending",
    "sharedToInternal": false,
    "sharedToExternal": false,
    "lastUpdatedAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "createdBy": 1,
    "fieldMappings": [],
    "pdfDpi": 72,
    "pdfPageDimensions": [
      {
        "width": 612,
        "height": 792
      }
    ]
  }
}
```

**Validation:**
- File must be PDF format
- Maximum file size: 10MB (configurable)
- Only admin users can upload documents

**Backend Processing:**
1. Save PDF file to `/uploads/e-signature/documents/{id}.pdf`
2. Extract PDF metadata (DPI, page dimensions, page count)
3. Generate preview images (convert each PDF page to base64 image)
4. Store preview images in database or return in response
5. Set initial status to `'pending'`

---

#### PUT `/api/v1/e-signature/documents/:id`

**Description:** Update document (field mappings, file name, etc.).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters:**
- `id`: Document ID

**Request Body:**
```json
{
  "fileName": "Updated Document Name",
  "fieldMappings": [
    {
      "id": "field_123",
      "fieldType": "signature",
      "fieldName": "Signature",
      "x": 100,
      "y": 200,
      "width": 200,
      "height": 50,
      "assignedTo": "internal",
      "assignedUserId": 1,
      "required": true,
      "pageNumber": 1,
      "options": [],
      "pdfDpi": 72,
      "pdfPageWidth": 612,
      "pdfPageHeight": 792
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Document updated successfully",
  "data": {
    "id": "doc_1234567890",
    "fileName": "Updated Document Name",
    "lastUpdatedAt": "2024-01-15T11:00:00Z",
    "fieldMappings": [...]
  }
}
```

**Authorization:**
- Only document creator or admin can update

---

#### DELETE `/api/v1/e-signature/documents/:id`

**Description:** Delete a document.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Document ID

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

**Authorization:**
- Only document creator or admin can delete
- Also deletes physical file from storage

---

### 2. Document Sharing

#### POST `/api/v1/e-signature/documents/:id/share`

**Description:** Share document with **one internal staff member** and/or **one external user**.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters:**
- `id`: Document ID

**Request Body:**
```json
{
  "internalUserIds": [1],              // Array with MAX 1 user ID
  "externalEmails": ["external@example.com"]  // Array with MAX 1 email
}
```

**Response:**
```json
{
  "success": true,
  "message": "Document shared successfully"
}
```

**Validation:**
- `internalUserIds` array must contain **maximum 1 user ID** (take first if multiple provided)
- `externalEmails` array must contain **maximum 1 email** (take first if multiple provided)
- If `internalUserIds` is provided, sets `sharedToInternal` to true
- If `externalEmails` is provided, sets `sharedToExternal` to true
- For external users, generates unique share token/link
- Sends notification emails to external users (optional)

**Database Update:**
- Delete existing shares for this document
- Insert new share record(s) (max 1 internal, max 1 external)

---

#### GET `/api/v1/e-signature/documents/:id/download`

**Description:** Download the original or signed PDF document.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Document ID

**Query Parameters:**
- `type` (optional): `'original'` or `'signed'` (default: `'original'`)

**Response:**
- Binary file stream (PDF)
- Headers:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="document.pdf"`

**Authorization:**
- User must be document creator, admin, or have been shared the document

---

#### GET `/api/v1/e-signature/documents/:id/view`

**Description:** Get the view URL for the document (for preview). Returns signed PDF URL if document is signed, otherwise returns original PDF URL.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Document ID

**Response:**
```json
{
  "success": true,
  "data": {
    "fileUrl": "http://localhost:3001/uploads/e-signature/documents/doc_1234567890.pdf",
    "signedFileUrl": "http://localhost:3001/uploads/e-signature/documents/doc_1234567890_signed.pdf"
  }
}
```

**Logic:**
- If `status === 'signed'` and `signedFileUrl` exists, return `signedFileUrl`
- Otherwise, return `fileUrl`

---

### 3. Template Management

#### GET `/api/v1/e-signature/templates`

**Description:** Get all templates.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page
- `visibility` (optional): Filter by 'private' or 'public'

**Response:**
```json
{
  "success": true,
  "message": "Templates retrieved successfully",
  "data": [
    {
      "id": "tpl_1234567890",
      "templateName": "Masharib Khan",
      "originalFile": "original.pdf",
      "fileUrl": "http://localhost:3001/uploads/e-signature/templates/tpl_1234567890.pdf",
      "previewImages": ["data:image/png;base64,..."],
      "fileSize": 158003,
      "visibility": "private",
      "createdAt": "2024-01-15T10:30:00Z",
      "fieldMappings": [],
      "createdBy": 1,
      "pdfDpi": 72,
      "pdfPageDimensions": [
        {
          "width": 612,
          "height": 792
        }
      ]
    }
  ],
  "count": 1
}
```

---

#### GET `/api/v1/e-signature/templates/:id`

**Description:** Get a single template by ID.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Template ID

**Response:**
```json
{
  "success": true,
  "message": "Template retrieved successfully",
  "data": {
    "id": "tpl_1234567890",
    "templateName": "Masharib Khan",
    "originalFile": "original.pdf",
    "fileUrl": "http://localhost:3001/uploads/e-signature/templates/tpl_1234567890.pdf",
    "previewImages": ["data:image/png;base64,..."],
    "fileSize": 158003,
    "visibility": "private",
    "createdAt": "2024-01-15T10:30:00Z",
    "fieldMappings": [...],
    "createdBy": 1,
    "pdfDpi": 72,
    "pdfPageDimensions": [
      {
        "width": 612,
        "height": 792
      }
    ]
  }
}
```

---

#### POST `/api/v1/e-signature/templates/upload`

**Description:** Upload a template.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `file`: PDF file (required)
- `templateName`: Template name (required)

**Response:**
```json
{
  "success": true,
  "message": "Template uploaded successfully",
  "data": {
    "id": "tpl_1234567890",
    "templateName": "Masharib Khan",
    "originalFile": "original.pdf",
    "fileUrl": "http://localhost:3001/uploads/e-signature/templates/tpl_1234567890.pdf",
    "previewImages": ["data:image/png;base64,..."],
    "fileSize": 158003,
    "visibility": "private",
    "createdAt": "2024-01-15T10:30:00Z",
    "fieldMappings": [],
    "createdBy": 1,
    "pdfDpi": 72,
    "pdfPageDimensions": [
      {
        "width": 612,
        "height": 792
      }
    ]
  }
}
```

**Authorization:**
- Only admin users can upload templates

**Backend Processing:**
1. Save PDF file to `/uploads/e-signature/templates/{id}.pdf`
2. Extract PDF metadata (DPI, page dimensions)
3. Generate preview images
4. Set `visibility` to `'private'` by default

---

#### PUT `/api/v1/e-signature/templates/:id`

**Description:** Update a template (template name, field mappings).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters:**
- `id`: Template ID

**Request Body:**
```json
{
  "templateName": "Updated Template Name",
  "fieldMappings": [
    {
      "id": "field_123",
      "fieldType": "signature",
      "fieldName": "Signature",
      "x": 100,
      "y": 200,
      "width": 200,
      "height": 50,
      "assignedTo": "internal",
      "signerPlaceholder": "Staff Role",
      "required": true,
      "pageNumber": 1,
      "options": [],
      "pdfDpi": 72,
      "pdfPageWidth": 612,
      "pdfPageHeight": 792
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Template updated successfully",
  "data": {
    "id": "tpl_1234567890",
    "templateName": "Updated Template Name",
    "fieldMappings": [...]
  }
}
```

**Authorization:**
- Only template creator or admin can update

---

#### POST `/api/v1/e-signature/templates/:id/create-document`

**Description:** Create a new document from a template.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters:**
- `id`: Template ID

**Request Body:**
```json
{
  "fileName": "Document from Template"  // Optional, defaults to template name
}
```

**Response:**
```json
{
  "success": true,
  "message": "Document created from template successfully",
  "data": {
    "id": "doc_1234567890",
    "fileName": "Document from Template",
    "originalFileName": "original.pdf",
    "fileSize": 158003,
    "fileUrl": "http://localhost:3001/uploads/e-signature/documents/doc_1234567890.pdf",
    "previewImages": ["data:image/png;base64,..."],
    "status": "pending",
    "sharedToInternal": false,
    "sharedToExternal": false,
    "lastUpdatedAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "createdBy": 1,
    "fieldMappings": [...]  // Copied from template, with signerPlaceholder preserved
  }
}
```

**Backend Processing:**
1. Copy template PDF file to documents directory
2. Copy all field mappings from template
3. Preserve `signerPlaceholder` in field mappings (don't assign actual users)
4. Set status to `'pending'`

---

#### POST `/api/v1/e-signature/documents/:id/save-as-template`

**Description:** Save an existing document as a template.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters:**
- `id`: Document ID

**Request Body:**
```json
{
  "templateName": "Template Name"  // Required
}
```

**Response:**
```json
{
  "success": true,
  "message": "Template saved successfully",
  "data": {
    "id": "tpl_1234567890",
    "templateName": "Template Name",
    "originalFile": "original.pdf",
    "fileUrl": "http://localhost:3001/uploads/e-signature/templates/tpl_1234567890.pdf",
    "previewImages": ["data:image/png;base64,..."],
    "fileSize": 158003,
    "visibility": "private",
    "createdAt": "2024-01-15T10:30:00Z",
    "fieldMappings": [...],  // Copied from document, with assigned users converted to placeholders
    "createdBy": 1,
    "pdfDpi": 72,
    "pdfPageDimensions": [
      {
        "width": 612,
        "height": 792
      }
    ]
  }
}
```

**Backend Processing:**
1. Copy document PDF file to templates directory
2. Copy all field mappings from document
3. Convert assigned users to placeholders:
   - Remove `assignedUserId` and `assignedEmail`
   - Set `signerPlaceholder` based on `assignedTo` (e.g., "Staff Role" for internal, "External Role" for external)
4. Set `visibility` to `'private'` by default

---

#### DELETE `/api/v1/e-signature/templates/:id`

**Description:** Delete a template.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id`: Template ID

**Response:**
```json
{
  "success": true,
  "message": "Template deleted successfully"
}
```

**Authorization:**
- Only template creator or admin can delete

---

## Database Schema Recommendations

### `e_signature_documents` Table

```sql
CREATE TABLE e_signature_documents (
  id VARCHAR(255) PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  original_file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  signed_file_path VARCHAR(500) NULL,
  file_size INT NOT NULL,
  file_url VARCHAR(500),
  signed_file_url VARCHAR(500) NULL,
  status ENUM('pending', 'signed') DEFAULT 'pending',
  shared_to_internal BOOLEAN DEFAULT FALSE,
  shared_to_external BOOLEAN DEFAULT FALSE,
  pdf_dpi INT DEFAULT 72,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_created_by (created_by),
  INDEX idx_status (status),
  INDEX idx_updated_at (updated_at)
);
```

### `e_signature_document_shares` Table

```sql
CREATE TABLE e_signature_document_shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id VARCHAR(255) NOT NULL,
  share_type ENUM('internal', 'external') NOT NULL,
  user_id INT NULL,                    -- For internal shares (MAX 1 per document)
  email VARCHAR(255) NULL,              -- For external shares (MAX 1 per document)
  share_token VARCHAR(255) NULL,        -- Unique token for external access
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (document_id) REFERENCES e_signature_documents(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_internal_share (document_id, share_type, user_id),
  UNIQUE KEY unique_external_share (document_id, share_type, email),
  INDEX idx_document (document_id),
  INDEX idx_user (user_id),
  INDEX idx_email (email),
  INDEX idx_token (share_token)
);
```

**Note:** Use UNIQUE constraints to enforce single user assignment per document per share type.

### `e_signature_document_preview_images` Table

```sql
CREATE TABLE e_signature_document_preview_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  document_id VARCHAR(255) NOT NULL,
  page_number INT NOT NULL,
  preview_image LONGTEXT NOT NULL,      -- Base64 encoded image
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (document_id) REFERENCES e_signature_documents(id) ON DELETE CASCADE,
  UNIQUE KEY unique_page (document_id, page_number),
  INDEX idx_document (document_id)
);
```

### `e_signature_field_mappings` Table

```sql
CREATE TABLE e_signature_field_mappings (
  id VARCHAR(255) PRIMARY KEY,
  document_id VARCHAR(255) NOT NULL,
  field_type ENUM('fullname', 'email', 'date', 'customText', 'checkbox', 'radio', 'select', 'signature') NOT NULL,
  field_name VARCHAR(255) NOT NULL,
  x DECIMAL(10, 2) NOT NULL,           -- PDF points (1/72 inch)
  y DECIMAL(10, 2) NOT NULL,           -- PDF points (1/72 inch)
  width DECIMAL(10, 2) NOT NULL,       -- PDF points
  height DECIMAL(10, 2) NOT NULL,      -- PDF points
  assigned_to ENUM('internal', 'external') NULL,
  assigned_user_id INT NULL,
  assigned_email VARCHAR(255) NULL,
  signer_placeholder VARCHAR(255) NULL,
  required BOOLEAN DEFAULT FALSE,
  page_number INT DEFAULT 1,
  options JSON NULL,                   -- For checkbox, radio, select fields
  default_option VARCHAR(255) NULL,    -- For select, radio fields
  pdf_dpi INT DEFAULT 72,
  pdf_page_width DECIMAL(10, 2) NULL,
  pdf_page_height DECIMAL(10, 2) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (document_id) REFERENCES e_signature_documents(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_document (document_id)
);
```

### `e_signature_templates` Table

```sql
CREATE TABLE e_signature_templates (
  id VARCHAR(255) PRIMARY KEY,
  template_name VARCHAR(255) NOT NULL,
  original_file VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT NOT NULL,
  file_url VARCHAR(500),
  visibility ENUM('private', 'public') DEFAULT 'private',
  pdf_dpi INT DEFAULT 72,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_created_by (created_by),
  INDEX idx_visibility (visibility)
);
```

### `e_signature_template_preview_images` Table

```sql
CREATE TABLE e_signature_template_preview_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_id VARCHAR(255) NOT NULL,
  page_number INT NOT NULL,
  preview_image LONGTEXT NOT NULL,      -- Base64 encoded image
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (template_id) REFERENCES e_signature_templates(id) ON DELETE CASCADE,
  UNIQUE KEY unique_page (template_id, page_number),
  INDEX idx_template (template_id)
);
```

### `e_signature_template_fields` Table

```sql
CREATE TABLE e_signature_template_fields (
  id VARCHAR(255) PRIMARY KEY,
  template_id VARCHAR(255) NOT NULL,
  field_type ENUM('fullname', 'email', 'date', 'customText', 'checkbox', 'radio', 'select', 'signature') NOT NULL,
  field_name VARCHAR(255) NOT NULL,
  x DECIMAL(10, 2) NOT NULL,           -- PDF points (1/72 inch)
  y DECIMAL(10, 2) NOT NULL,           -- PDF points (1/72 inch)
  width DECIMAL(10, 2) NOT NULL,       -- PDF points
  height DECIMAL(10, 2) NOT NULL,      -- PDF points
  assigned_to ENUM('internal', 'external') NULL,
  signer_placeholder VARCHAR(255) NULL,
  required BOOLEAN DEFAULT FALSE,
  page_number INT DEFAULT 1,
  options JSON NULL,                   -- For checkbox, radio, select fields
  default_option VARCHAR(255) NULL,    -- For select, radio fields
  pdf_dpi INT DEFAULT 72,
  pdf_page_width DECIMAL(10, 2) NULL,
  pdf_page_height DECIMAL(10, 2) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (template_id) REFERENCES e_signature_templates(id) ON DELETE CASCADE,
  INDEX idx_template (template_id)
);
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error code (optional)"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

---

## Authentication

All endpoints (except public share links) require authentication:

```
Authorization: Bearer {jwt_token}
```

---

## File Storage

- Upload directory: `/uploads/e-signature/documents/` and `/uploads/e-signature/templates/`
- File naming: Use document/template ID as filename
- File URL format: `{base_url}/uploads/e-signature/{type}/{id}.pdf`
- Signed file format: `{base_url}/uploads/e-signature/documents/{id}_signed.pdf`

---

## PDF Processing Requirements

### 1. PDF Metadata Extraction
- Extract DPI (default: 72 if not specified)
- Extract page dimensions (width, height in PDF points)
- Extract page count

### 2. Preview Image Generation
- Convert each PDF page to base64-encoded PNG/JPEG image
- Recommended resolution: 150-200 DPI for preview
- Store preview images in database or return in API response
- Image format: `data:image/png;base64,{base64_string}`

### 3. Coordinate System
- Store field coordinates in **PDF points** (1/72 inch), not pixels
- PDF points are resolution-independent
- Convert viewport coordinates to PDF points using:
  - `pdfPointX = (viewportX / viewportWidth) * pdfPageWidth`
  - `pdfPointY = (viewportY / viewportHeight) * pdfPageHeight`

---

## Notes

1. **Status Management:**
   - Documents start with status `pending`
   - Status changes to `signed` when all required fields are signed
   - Only two statuses: `pending` and `signed`

2. **Sharing:**
   - **Single User Assignment:** Each document can be assigned to **maximum 1 internal staff** and **maximum 1 external user**
   - Internal sharing: User must be authenticated staff member
   - External sharing: User receives unique share link/token (no authentication required)
   - External share tokens should be unique and secure
   - When sharing, delete existing shares and create new ones (max 1 per type)

3. **Field Mappings:**
   - Coordinates (x, y, width, height) are in **PDF points** (1/72 inch), not pixels
   - Field mappings are stored per document
   - Templates preserve field mappings with `signerPlaceholder` for reuse
   - Field types: `fullname`, `email`, `date`, `customText`, `checkbox`, `radio`, `select`, `signature`
   - Options for checkbox, radio, and select fields are stored as JSON array

4. **Templates:**
   - Templates can be created from uploaded PDFs or saved from existing documents
   - Templates preserve field mappings with `signerPlaceholder` instead of actual user assignments
   - Templates can be updated (name, field mappings)
   - Creating a document from a template copies field mappings but doesn't assign actual users

5. **Permissions:**
   - Only admin users can upload, edit, and delete documents/templates
   - Staff users can view documents shared with them
   - External users can only access via share links

6. **File Validation:**
   - Only PDF files accepted
   - Maximum file size: 10MB (configurable)
   - Validate PDF structure on upload

7. **Document Sorting:**
   - Documents are sorted by `lastUpdatedAt` in descending order (newest first)

8. **Signed Documents:**
   - When a document is signed, generate a finalized PDF with all filled fields and signatures
   - Store the signed PDF in `signed_file_path` and `signed_file_url`
   - When viewing a signed document, return `signedFileUrl` instead of `fileUrl`

---

## Future Enhancements (Optional)

1. Document versioning
2. Signing workflow with multiple signers
3. Email notifications for document assignment
4. Document completion tracking per user
5. Bulk operations (upload, share, delete)
6. Document analytics and reporting
