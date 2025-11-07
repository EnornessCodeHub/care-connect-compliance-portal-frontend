# Document Center Backend API Brief

## Overview
This brief outlines the backend API requirements for the Document Center module, which enables users to organize files and folders, share them with internal staff and external users via public URLs, and manage document access.

---

## 1. Database Schema

### 1.1 `document_folders` Table
```sql
CREATE TABLE document_folders (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_id VARCHAR(255) NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- Public sharing fields
  public_token VARCHAR(255) UNIQUE NULL,
  public_url VARCHAR(500) NULL,
  
  FOREIGN KEY (parent_id) REFERENCES document_folders(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_parent_id (parent_id),
  INDEX idx_public_token (public_token)
);
```

### 1.2 `document_files` Table
```sql
CREATE TABLE document_files (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  folder_id VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL, -- Path to stored file
  file_size BIGINT NOT NULL, -- Size in bytes
  mime_type VARCHAR(100) NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- Public sharing fields
  public_token VARCHAR(255) UNIQUE NULL,
  public_url VARCHAR(500) NULL,
  
  FOREIGN KEY (folder_id) REFERENCES document_folders(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_folder_id (folder_id),
  INDEX idx_public_token (public_token)
);
```

### 1.3 `document_shares` Table (Many-to-Many for Internal Sharing)
```sql
CREATE TABLE document_shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resource_type ENUM('folder', 'file') NOT NULL,
  resource_id VARCHAR(255) NOT NULL,
  shared_with_user_id INT NOT NULL,
  shared_by_user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_by_user_id) REFERENCES users(id),
  UNIQUE KEY unique_share (resource_type, resource_id, shared_with_user_id),
  INDEX idx_resource (resource_type, resource_id),
  INDEX idx_shared_with (shared_with_user_id)
);
```

### 1.4 `document_external_shares` Table (External Email Sharing)
```sql
CREATE TABLE document_external_shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resource_type ENUM('folder', 'file') NOT NULL,
  resource_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  shared_by_user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (shared_by_user_id) REFERENCES users(id),
  INDEX idx_resource (resource_type, resource_id),
  INDEX idx_email (email)
);
```

---

## 2. API Endpoints

### 2.1 Folder Management

#### GET `/api/v1/documents/folders`
**Description:** Get all root folders or folders within a specific parent folder

**Query Parameters:**
- `parentId` (optional): Get folders within a specific parent folder. If not provided, returns root folders.

**Response:**
```json
{
  "success": true,
  "message": "Folders retrieved successfully",
  "data": [
    {
      "id": "f_1234567890",
      "name": "NDIS Core Module",
      "parentId": null,
      "createdBy": 1,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "publicToken": null,
      "publicUrl": null,
      "subfolderCount": 2,
      "fileCount": 5
    }
  ],
  "count": 1
}
```

---

#### POST `/api/v1/documents/folders`
**Description:** Create a new folder

**Request Body:**
```json
{
  "name": "New Folder",
  "parentId": null // or specific folder ID for subfolder
}
```

**Response:**
```json
{
  "success": true,
  "message": "Folder created successfully",
  "data": {
    "id": "f_1234567890",
    "name": "New Folder",
    "parentId": null,
    "createdBy": 1,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Validation:**
- Name is required and non-empty
- If `parentId` is provided, verify parent exists and user has access
- Maximum folder depth: 2 levels (root → subfolder, no further nesting)

---

#### PUT `/api/v1/documents/folders/:folderId`
**Description:** Rename a folder

**Request Body:**
```json
{
  "name": "Updated Folder Name"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Folder updated successfully",
  "data": {
    "id": "f_1234567890",
    "name": "Updated Folder Name",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

**Authorization:**
- Only folder creator or admin can rename

---

#### DELETE `/api/v1/documents/folders/:folderId`
**Description:** Delete a folder and all its contents (recursive)

**Response:**
```json
{
  "success": true,
  "message": "Folder deleted successfully"
}
```

**Authorization:**
- Only folder creator or admin can delete
- Cascades to all subfolders and files

---

### 2.2 File Management

#### GET `/api/v1/documents/files`
**Description:** Get all files within a specific folder

**Query Parameters:**
- `folderId` (required): Folder ID to list files from

**Response:**
```json
{
  "success": true,
  "message": "Files retrieved successfully",
  "data": [
    {
      "id": "fi_1234567890",
      "name": "document.pdf",
      "folderId": "f_1234567890",
      "filePath": "/uploads/documents/fi_1234567890.pdf",
      "fileSize": 524288,
      "mimeType": "application/pdf",
      "createdBy": 1,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "publicToken": null,
      "publicUrl": null
    }
  ],
  "count": 1
}
```

---

#### POST `/api/v1/documents/files`
**Description:** Upload a new file

**Request Body (multipart/form-data or JSON with base64):**
```json
{
  "name": "document.pdf",
  "folderId": "f_1234567890",
  "file": "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCg==",
  "mimeType": "application/pdf"
}
```

**OR** (multipart/form-data):
- `name`: File name
- `folderId`: Target folder ID
- `file`: File binary data

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "fi_1234567890",
    "name": "document.pdf",
    "folderId": "f_1234567890",
    "filePath": "/uploads/documents/fi_1234567890.pdf",
    "fileSize": 524288,
    "mimeType": "application/pdf",
    "createdBy": 1,
    "createdAt": "2024-01-15T10:30:00Z",
    "fileUrl": "http://localhost:3001/uploads/documents/fi_1234567890.pdf"
  }
}
```

**Validation:**
- File name is required
- Folder ID must exist and user must have access
- Maximum file size: 10MB (configurable)
- Allowed file types: images, PDF, Word, Excel, text files

---

#### GET `/api/v1/documents/files/:fileId`
**Description:** Get file details and download URL

**Response:**
```json
{
  "success": true,
  "message": "File retrieved successfully",
  "data": {
    "id": "fi_1234567890",
    "name": "document.pdf",
    "folderId": "f_1234567890",
    "fileSize": 524288,
    "mimeType": "application/pdf",
    "fileUrl": "http://localhost:3001/uploads/documents/fi_1234567890.pdf",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### GET `/api/v1/documents/files/:fileId/download`
**Description:** Download file (returns file stream)

**Headers:**
- `Content-Type`: Based on file's MIME type
- `Content-Disposition`: `attachment; filename="document.pdf"`

**Response:**
- Binary file stream

---

#### PUT `/api/v1/documents/files/:fileId`
**Description:** Rename a file

**Request Body:**
```json
{
  "name": "updated_document.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "message": "File updated successfully",
  "data": {
    "id": "fi_1234567890",
    "name": "updated_document.pdf",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

**Authorization:**
- Only file creator or admin can rename

---

#### DELETE `/api/v1/documents/files/:fileId`
**Description:** Delete a file

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

**Authorization:**
- Only file creator or admin can delete
- Also deletes physical file from storage

---

### 2.3 Sharing Management

#### GET `/api/v1/documents/:resourceType/:resourceId/shares`
**Description:** Get sharing information for a folder or file

**Path Parameters:**
- `resourceType`: `folder` or `file`
- `resourceId`: Folder or file ID

**Response:**
```json
{
  "success": true,
  "message": "Shares retrieved successfully",
  "data": {
    "internal": [
      {
        "userId": 2,
        "fullname": "John Doe",
        "email": "john@example.com",
        "sharedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "external": [
      {
        "email": "external@example.com",
        "sharedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "publicToken": "pub_1234567890_abc123",
    "publicUrl": "http://localhost:7001/share/pub_1234567890_abc123"
  }
}
```

---

#### POST `/api/v1/documents/:resourceType/:resourceId/shares`
**Description:** Share a folder or file with internal staff and/or external users

**Request Body:**
```json
{
  "internal": [2, 3, 5], // Array of user IDs
  "external": ["user1@example.com", "user2@example.com"] // Array of email addresses
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resource shared successfully",
  "data": {
    "publicToken": "pub_1234567890_abc123",
    "publicUrl": "http://localhost:7001/share/pub_1234567890_abc123",
    "internalShares": 3,
    "externalShares": 2
  }
}
```

**Business Logic:**
- If `external` array is provided and not empty:
  - Generate a unique `publicToken` if it doesn't exist
  - Generate `publicUrl` using the token
  - Store external emails in `document_external_shares` table
- If `internal` array is provided:
  - Create entries in `document_shares` table for each user ID
  - Remove existing shares not in the new list (if updating)

---

#### DELETE `/api/v1/documents/:resourceType/:resourceId/shares`
**Description:** Remove all sharing (internal, external, and public)

**Request Body (optional):**
```json
{
  "type": "internal" // or "external" or "public" or "all"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sharing removed successfully"
}
```

---

#### DELETE `/api/v1/documents/:resourceType/:resourceId/shares/internal/:userId`
**Description:** Remove sharing with a specific internal user

**Response:**
```json
{
  "success": true,
  "message": "Internal sharing removed successfully"
}
```

---

### 2.4 Public Access (No Authentication Required)

#### GET `/api/v1/documents/public/:token`
**Description:** Get public folder or file details by token (for public share view)

**Path Parameters:**
- `token`: Public token

**Response (for folder):**
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": {
    "type": "folder",
    "id": "f_1234567890",
    "name": "NDIS Core Module",
    "subfolders": [
      {
        "id": "f_0987654321",
        "name": "Subfolder"
      }
    ],
    "files": [
      {
        "id": "fi_1234567890",
        "name": "document.pdf",
        "fileSize": 524288,
        "mimeType": "application/pdf"
      }
    ]
  }
}
```

**Response (for file):**
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": {
    "type": "file",
    "id": "fi_1234567890",
    "name": "document.pdf",
    "fileSize": 524288,
    "mimeType": "application/pdf",
    "fileUrl": "http://localhost:3001/uploads/documents/fi_1234567890.pdf"
  }
}
```

**Note:** This endpoint does NOT require authentication. It's used for the public share view.

---

#### GET `/api/v1/documents/public/:token/download`
**Description:** Download folder (as ZIP) or file by public token

**Path Parameters:**
- `token`: Public token

**Response:**
- For folder: ZIP file stream
- For file: Binary file stream

**Headers:**
- `Content-Type`: `application/zip` (for folders) or file's MIME type (for files)
- `Content-Disposition`: `attachment; filename="folder.zip"` or `attachment; filename="document.pdf"`

---

#### GET `/api/v1/documents/public/:token/files/:fileId`
**Description:** Get file details for download from public share (for files within shared folders)

**Path Parameters:**
- `token`: Public token (folder token)
- `fileId`: File ID

**Response:**
```json
{
  "success": true,
  "message": "File retrieved successfully",
  "data": {
    "id": "fi_1234567890",
    "name": "document.pdf",
    "fileSize": 524288,
    "mimeType": "application/pdf",
    "fileUrl": "http://localhost:3001/uploads/documents/fi_1234567890.pdf"
  }
}
```

---

### 2.5 Search

#### GET `/api/v1/documents/search`
**Description:** Search for folders and files by name

**Query Parameters:**
- `query` (required): Search query string
- `type` (optional): `folder`, `file`, or `all` (default: `all`)

**Response:**
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "folders": [
      {
        "id": "f_1234567890",
        "name": "NDIS Core Module",
        "parentId": null,
        "path": "/NDIS Core Module"
      }
    ],
    "files": [
      {
        "id": "fi_1234567890",
        "name": "document.pdf",
        "folderId": "f_1234567890",
        "folderName": "NDIS Core Module",
        "path": "/NDIS Core Module/document.pdf"
      }
    ]
  },
  "count": 2
}
```

---

## 3. Business Logic & Rules

### 3.1 Folder Hierarchy
- **Maximum Depth:** 2 levels (root folder → subfolder)
- **Subfolder Restriction:** Subfolders cannot have further subfolders (only files allowed)
- **Validation:** When creating a folder, check if parent is a subfolder (has `parentId`), and reject if so

### 3.2 Access Control
- **Ownership:** Users can only manage folders/files they created
- **Admin Access:** Admins can manage all folders/files
- **Shared Access:** Users with shared access can view and download, but cannot modify or delete
- **Public Access:** Public tokens allow read-only access without authentication

### 3.3 Public Sharing
- **Token Generation:** Generate unique token format: `pub_{timestamp}_{randomString}`
- **Token Persistence:** Once generated, token remains until sharing is explicitly removed
- **URL Format:** `{baseUrl}/share/{token}`
- **Security:** Public tokens should be cryptographically secure and non-guessable

### 3.4 File Storage
- **Storage Location:** `/uploads/documents/{fileId}.{extension}`
- **File Naming:** Use file ID to prevent conflicts
- **File Size Limit:** 10MB per file (configurable)
- **Allowed Types:** Images (jpg, png, gif, webp), PDF, Word (doc, docx), Excel (xls, xlsx), Text files (txt, csv)

### 3.5 Folder Download (ZIP)
- **ZIP Creation:** When downloading a folder, create a ZIP file containing:
  - All files in the folder
  - All subfolders (recursively) with their files
  - Maintain folder structure in ZIP
- **ZIP Naming:** `{folderName}.zip`

---

## 4. File Storage Strategy

### 4.1 Storage Options
1. **Local File System** (Development)
   - Store files in `backend/uploads/documents/`
   - Use file ID as filename to prevent conflicts

2. **Cloud Storage** (Production - Recommended)
   - AWS S3, Google Cloud Storage, or Azure Blob Storage
   - Store file path/URL in database
   - Generate signed URLs for secure access

### 4.2 File Upload Flow
1. Receive file (multipart/form-data or base64)
2. Validate file (size, type)
3. Generate unique file ID
4. Save file to storage
5. Create database record
6. Return file details with URL

### 4.3 File Download Flow
1. Verify user has access (or valid public token)
2. Retrieve file path from database
3. Stream file from storage
4. Set appropriate headers (Content-Type, Content-Disposition)

---

## 5. Security Considerations

### 5.1 Authentication
- All endpoints (except public endpoints) require JWT authentication
- Extract user ID from JWT token for ownership checks

### 5.2 Authorization
- Check ownership or admin role before allowing create/update/delete operations
- Check shared access before allowing view/download operations

### 5.3 Public Token Security
- Generate cryptographically secure random tokens
- Validate token format before processing
- Consider token expiration (optional, not in current requirements)

### 5.4 File Upload Security
- Validate file types (whitelist approach)
- Validate file sizes
- Scan for malware (optional, for production)
- Sanitize file names to prevent path traversal

### 5.5 Rate Limiting
- Implement rate limiting on file upload endpoints
- Implement rate limiting on public download endpoints

---

## 6. Error Handling

### 6.1 Common Error Responses

**404 Not Found:**
```json
{
  "success": false,
  "message": "Folder not found",
  "error": "FOLDER_NOT_FOUND"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "You do not have permission to access this resource",
  "error": "ACCESS_DENIED"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "message": "File size exceeds maximum limit of 10MB",
  "error": "FILE_TOO_LARGE"
}
```

**422 Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Folder name is required"
    }
  ]
}
```

---

## 7. Database Relationships

```
users
  ├── document_folders (created_by)
  ├── document_files (created_by)
  ├── document_shares (shared_with_user_id, shared_by_user_id)
  └── document_external_shares (shared_by_user_id)

document_folders
  ├── document_folders (parent_id) [self-referential]
  ├── document_files (folder_id)
  └── document_shares (resource_id)
     └── document_external_shares (resource_id)

document_files
  ├── document_shares (resource_id)
  └── document_external_shares (resource_id)
```

---

## 8. Implementation Notes

### 8.1 File Upload Middleware
- Use `multer` (Node.js) or similar for handling multipart/form-data
- Or handle base64 decoding if using JSON payload

### 8.2 ZIP Generation
- Use `archiver` (Node.js) or similar library for creating ZIP files
- Stream ZIP creation for large folders to avoid memory issues

### 8.3 Public URL Generation
- Base URL should be configurable (environment variable)
- Format: `{VITE_BASE_URL}/share/{token}` or `{FRONTEND_URL}/share/{token}`

### 8.4 Cascading Deletes
- When deleting a folder, cascade delete:
  - All subfolders (recursively)
  - All files in folder and subfolders
  - All sharing records
  - Physical files from storage

---

## 9. Testing Checklist

- [ ] Create root folder
- [ ] Create subfolder (max depth validation)
- [ ] Attempt to create subfolder in subfolder (should fail)
- [ ] Upload file to root folder
- [ ] Upload file to subfolder
- [ ] Rename folder
- [ ] Rename file
- [ ] Delete file
- [ ] Delete folder (cascading delete)
- [ ] Share folder with internal users
- [ ] Share file with internal users
- [ ] Share folder with external emails (generates public URL)
- [ ] Share file with external emails (generates public URL)
- [ ] Access public folder via token (no authentication)
- [ ] Access public file via token (no authentication)
- [ ] Download folder as ZIP (public)
- [ ] Download file (public)
- [ ] Search folders and files
- [ ] Authorization checks (owner, admin, shared user)
- [ ] File size validation
- [ ] File type validation

---

## 10. Environment Variables

```env
# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=./uploads/documents
ALLOWED_FILE_TYPES=image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/*

# Public URL Configuration
FRONTEND_URL=http://localhost:7001
PUBLIC_SHARE_BASE_URL=http://localhost:7001/share

# Storage Configuration (if using cloud storage)
STORAGE_TYPE=local  # or 's3', 'gcs', 'azure'
AWS_S3_BUCKET=your-bucket-name
AWS_S3_REGION=us-east-1
```

---

## Summary

This document center module requires:
- **4 database tables:** `document_folders`, `document_files`, `document_shares`, `document_external_shares`
- **~15 API endpoints** for full CRUD operations, sharing, and public access
- **File storage system** (local or cloud)
- **ZIP generation** for folder downloads
- **Public token system** for external sharing
- **Comprehensive authorization** checks

The backend should handle all business logic, file storage, and access control, while the frontend consumes these APIs to display and manage documents.

