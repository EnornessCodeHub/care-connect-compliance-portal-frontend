# E-Sign Document Backend API Brief

## Overview
Backend API specification for the E-Signature Documents module. Enables PDF document upload, field mapping configuration, document sharing (1 internal + 1 external user max), template management, and signing status tracking.

**Base URL:** `/api/v1/e-signature`

---

## Core Data Models

### ESignatureDocument
- `id`, `fileName`, `originalFileName`, `fileSize`
- `fileUrl`, `signedFileUrl`, `previewImages[]`
- `status`: `'pending' | 'signed'`
- `sharedToInternal`, `sharedToExternal` (boolean)
- `internalUsers[]` (max 1), `externalUsers[]` (max 1)
- `fieldMappings[]`, `deadline`, `createdBy`, timestamps
- PDF metadata: `pdfDpi`, `pdfPageDimensions[]`

### FieldMapping
- `id`, `fieldType`, `fieldName`
- Coordinates: `x`, `y`, `width`, `height` (PDF points, not pixels)
- `assignedTo`: `'internal' | 'external'`
- `assignedUserId`, `assignedEmail`, `signerPlaceholder`
- `required`, `pageNumber`, `options[]`, `defaultOption`
- PDF metadata: `pdfDpi`, `pdfPageWidth`, `pdfPageHeight`

### Template
- Similar to Document but with `templateName`
- Field mappings use `signerPlaceholder` instead of actual user assignments

---

## API Endpoints Summary

### 1. Document Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/documents` | List documents (paginated, searchable) |
| `GET` | `/documents/:id` | Get single document |
| `POST` | `/documents/upload` | Upload PDF (multipart/form-data) |
| `PUT` | `/documents/:id` | Update document (field mappings, name) |
| `DELETE` | `/documents/:id` | Delete document |
| `GET` | `/documents/:id/download` | Download PDF (original or signed) |
| `GET` | `/documents/:id/view` | Get view URL (returns signed if available) |

**Key Requirements:**
- PDF only, max 10MB
- Generate preview images (base64) on upload
- Extract PDF metadata (DPI, page dimensions)
- Store coordinates in PDF points (1/72 inch), not pixels
- Admin-only upload/edit/delete

### 2. Document Sharing

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/documents/:id/share` | Share with 1 internal + 1 external user max |

**Request Body:**
```json
{
  "internalUserIds": [1],  // Max 1 user
  "externalEmails": ["email@example.com"]  // Max 1 email
}
```

**Key Requirements:**
- Maximum 1 internal user per document
- Maximum 1 external user per document
- Generate unique share token for external users
- Delete existing shares before creating new ones

### 3. Template Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/templates` | List templates (paginated) |
| `GET` | `/templates/:id` | Get single template |
| `POST` | `/templates/upload` | Upload template PDF |
| `PUT` | `/templates/:id` | Update template (name, field mappings) |
| `DELETE` | `/templates/:id` | Delete template |
| `POST` | `/templates/:id/create-document` | Create document from template |
| `POST` | `/documents/:id/save-as-template` | Save document as template |

**Key Requirements:**
- Templates preserve field mappings with `signerPlaceholder`
- Creating document from template copies mappings but doesn't assign users
- Saving document as template converts user assignments to placeholders

---

## Database Schema (Key Tables)

### `e_signature_documents`
- Document metadata, file paths, status, sharing flags
- Foreign key: `created_by` → `users(id)`
- Indexes: `created_by`, `status`, `updated_at`

### `e_signature_document_shares`
- Share relationships (internal/external)
- UNIQUE constraints: `(document_id, share_type, user_id)` and `(document_id, share_type, email)`
- Enforces max 1 user per share type per document

### `e_signature_field_mappings`
- Field configurations per document
- Coordinates in PDF points (DECIMAL)
- JSON column for field options

### `e_signature_templates`
- Template metadata and file paths
- Similar structure to documents table

### `e_signature_template_fields`
- Field mappings for templates (with placeholders)

### Preview Image Tables
- Separate tables for document and template preview images
- Store base64-encoded images per page

---

## Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "count": 0  // For list endpoints
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

**HTTP Status Codes:**
- `200` Success
- `201` Created
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `500` Internal Server Error

---

## Authentication
All endpoints require: `Authorization: Bearer {jwt_token}`  
Exception: Public share links for external users (token-based)

---

## File Storage
- **Documents:** `/uploads/e-signature/documents/{id}.pdf`
- **Templates:** `/uploads/e-signature/templates/{id}.pdf`
- **Signed PDFs:** `/uploads/e-signature/documents/{id}_signed.pdf`

---

## PDF Processing Requirements

1. **Metadata Extraction:**
   - Extract DPI (default: 72)
   - Extract page dimensions (width, height in PDF points)
   - Extract page count

2. **Preview Image Generation:**
   - Convert each PDF page to base64 PNG/JPEG
   - Recommended: 150-200 DPI for preview
   - Format: `data:image/png;base64,{base64_string}`

3. **Coordinate System:**
   - Store in **PDF points** (1/72 inch), not pixels
   - Conversion formula:
     - `pdfPointX = (viewportX / viewportWidth) * pdfPageWidth`
     - `pdfPointY = (viewportY / viewportHeight) * pdfPageHeight`

---

## Key Business Rules

1. **Status Management:**
   - Initial: `pending`
   - Changes to `signed` when all required fields completed
   - Only two statuses: `pending` | `signed`

2. **Sharing Constraints:**
   - Max 1 internal staff member per document
   - Max 1 external user per document
   - External users access via unique share token/link

3. **Field Types:**
   - `fullname`, `email`, `date`, `customText`, `checkbox`, `radio`, `select`, `signature`

4. **Permissions:**
   - Admin: Full CRUD on documents/templates
   - Staff: View shared documents
   - External: Access via share link only

5. **Document Sorting:**
   - Default: `lastUpdatedAt DESC` (newest first)

6. **Signed Documents:**
   - Generate finalized PDF with all filled fields/signatures
   - Store in `signed_file_path` / `signed_file_url`
   - Return signed PDF URL when `status === 'signed'`

---

## Validation Rules

- File format: PDF only
- Max file size: 10MB (configurable)
- Validate PDF structure on upload
- Field coordinates must be within page bounds
- Required fields must be assigned to a user
- Share arrays limited to 1 item each

---

## Notes for Implementation

- Use UNIQUE database constraints to enforce single user assignment
- Preview images can be stored in DB or returned in API response
- External share tokens should be cryptographically secure
- Consider file cleanup on document/template deletion
- PDF processing libraries: pdf-lib, pdfkit, or similar
- Coordinate conversion is critical for accurate field placement

---

*For detailed endpoint specifications, request/response examples, and complete database schemas, refer to `E_SIGNATURE_API_BRIEF.md`*

