# Backend Changes Required for E-Signature Documents Module

## Overview
This document outlines all the backend changes needed to support the updated E-Signature Documents flow, including preview image generation, PDF DPI coordinate handling, and template signer placeholders.

---

## 1. Preview Image Generation on Upload

### Location: `eSignatureDocumentController.js` - `uploadDocument` function

### Changes Required:

**When a PDF is uploaded, the backend should:**

1. **Generate base64 preview images for each page:**
   - Convert each PDF page to a base64-encoded image (PNG or JPEG)
   - Store these as an array of base64 strings
   - Recommended: Use a library like `pdf-poppler`, `pdf2pic`, or `pdf-lib` with `canvas` to render PDF pages to images

2. **Extract PDF metadata:**
   - Get PDF DPI (default: 72)
   - Get page dimensions for each page (width and height in points)
   - Store these in the database

3. **Update database schema:**
   - Add `preview_images` column to `e_signature_documents` table (TEXT or JSON to store array of base64 strings)
   - Add `pdf_dpi` column (INT, default: 72)
   - Add `pdf_page_dimensions` column (JSON to store array of {width, height} objects)

4. **Update response:**
   - Include `previewImages` array in the upload response
   - Include `pdfDpi` in the response
   - Include `pdfPageDimensions` in the response

### Example Response Structure:
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "doc_1234567890",
    "fileName": "Document Name",
    "originalFileName": "document.pdf",
    "fileSize": 158003,
    "fileUrl": "http://localhost:3001/uploads/e-signature/doc_1234567890.pdf",
    "previewImages": [
      "data:image/png;base64,iVBORw0KGgoAAAANS...",
      "data:image/png;base64,iVBORw0KGgoAAAANS..."
    ],
    "pdfDpi": 72,
    "pdfPageDimensions": [
      { "width": 612, "height": 792 },
      { "width": 612, "height": 792 }
    ],
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z",
    "createdBy": 1
  }
}
```

### Implementation Notes:
- Use a library like `pdf-poppler` (Node.js) or `pdf2pic` to convert PDF pages to images
- Set image quality/DPI (recommended: 150-200 DPI for preview images)
- Convert to base64 data URLs (format: `data:image/png;base64,{base64String}`)
- Store original PDF file separately (for final PDF generation)

---

## 2. Database Schema Updates

### Table: `e_signature_documents`

**Add these columns:**
```sql
ALTER TABLE e_signature_documents 
ADD COLUMN preview_images TEXT NULL COMMENT 'JSON array of base64 preview images',
ADD COLUMN pdf_dpi INT DEFAULT 72 COMMENT 'PDF DPI (default: 72)',
ADD COLUMN pdf_page_dimensions TEXT NULL COMMENT 'JSON array of {width, height} for each page';
```

### Table: `e_signature_field_mappings`

**Update/Add these columns:**
```sql
ALTER TABLE e_signature_field_mappings
ADD COLUMN signer_placeholder VARCHAR(255) NULL COMMENT 'Placeholder like "Signer 1", "Staff Role", "External Role"',
ADD COLUMN pdf_dpi INT DEFAULT 72 COMMENT 'PDF DPI when field was created',
ADD COLUMN pdf_page_width INT NULL COMMENT 'Original PDF page width in points',
ADD COLUMN pdf_page_height INT NULL COMMENT 'Original PDF page height in points';
```

**Note:** The `x`, `y`, `width`, `height` columns should store values in PDF points (1/72 inch), not viewport pixels.

### Table: `e_signature_templates`

**Add these columns:**
```sql
ALTER TABLE e_signature_templates
ADD COLUMN preview_images TEXT NULL COMMENT 'JSON array of base64 preview images',
ADD COLUMN pdf_dpi INT DEFAULT 72 COMMENT 'PDF DPI (default: 72)',
ADD COLUMN pdf_page_dimensions TEXT NULL COMMENT 'JSON array of {width, height} for each page';
```

### Table: `e_signature_template_fields`

**Add these columns:**
```sql
ALTER TABLE e_signature_template_fields
ADD COLUMN signer_placeholder VARCHAR(255) NULL COMMENT 'Placeholder like "Signer 1", "Staff Role", "External Role"',
ADD COLUMN pdf_dpi INT DEFAULT 72 COMMENT 'PDF DPI when field was created',
ADD COLUMN pdf_page_width INT NULL COMMENT 'Original PDF page width in points',
ADD COLUMN pdf_page_height INT NULL COMMENT 'Original PDF page height in points';
```

---

## 3. Update GET Document Endpoint

### Location: `eSignatureDocumentController.js` - `getDocumentById` function

### Changes Required:

**Include preview images and PDF metadata in response:**
```javascript
// When fetching document, include:
{
  ...existingFields,
  previewImages: document.preview_images ? JSON.parse(document.preview_images) : null,
  pdfDpi: document.pdf_dpi || 72,
  pdfPageDimensions: document.pdf_page_dimensions ? JSON.parse(document.pdf_page_dimensions) : null
}
```

---

## 4. Update Template Upload

### Location: `eSignatureTemplateController.js` - `uploadTemplate` function

### Changes Required:

**Same as document upload:**
1. Generate preview images for each page
2. Extract PDF metadata (DPI, page dimensions)
3. Store in database
4. Include in response

---

## 5. Template Field Mappings

### Location: `eSignatureTemplateController.js` - Template field storage

### Changes Required:

**When saving template fields:**
- Store `signerPlaceholder` instead of actual user assignments
- Store PDF DPI and page dimensions with each field
- Ensure coordinates are in PDF points (not viewport pixels)

**Example field mapping for template:**
```json
{
  "id": "field_123",
  "fieldType": "signature",
  "fieldName": "Signature",
  "x": 100,  // PDF points
  "y": 200,  // PDF points
  "width": 200,  // PDF points
  "height": 50,  // PDF points
  "assignedTo": "internal",
  "signerPlaceholder": "Staff Role",  // NOT actual user ID
  "required": true,
  "pageNumber": 1,
  "pdfDpi": 72,
  "pdfPageWidth": 612,
  "pdfPageHeight": 792
}
```

---

## 6. Create Document from Template

### Location: `eSignatureDocumentController.js` - `createFromTemplate` function

### Changes Required:

**When creating a document from a template:**
1. Copy template's PDF file
2. Copy template's preview images
3. Copy template's PDF metadata (DPI, page dimensions)
4. Copy template's field mappings
5. **DO NOT copy actual user assignments** - keep signer placeholders
6. Admin will assign real users later via the share endpoint

---

## 7. Field Type Updates

### Location: All controllers and database schemas

### Changes Required:

**Remove these field types:**
- `email`
- `radio`
- `select`
- `customText`

**Keep only these field types:**
- `text`
- `textarea`
- `date`
- `checkbox`
- `dropdown`
- `signature`

**Update ENUM in database:**
```sql
ALTER TABLE e_signature_field_mappings 
MODIFY COLUMN field_type ENUM('text', 'textarea', 'signature', 'checkbox', 'date', 'dropdown') NOT NULL;

ALTER TABLE e_signature_template_fields 
MODIFY COLUMN field_type ENUM('text', 'textarea', 'signature', 'checkbox', 'date', 'dropdown') NOT NULL;
```

---

## 8. Coordinate System

### Important: All coordinates must be in PDF points (1/72 inch)

**Current behavior (WRONG):**
- Coordinates stored in viewport pixels
- Coordinates change based on screen size/zoom

**Required behavior (CORRECT):**
- Coordinates stored in PDF points (relative to PDF DPI)
- 1 point = 1/72 inch
- Standard US Letter page = 612 x 792 points
- Coordinates remain constant regardless of viewport

**When saving field mappings:**
- Ensure coordinates are converted to PDF points before saving
- Store PDF page dimensions with each field
- Store PDF DPI with each field

---

## 9. Preview Image Generation Library

### Recommended Libraries:

**Option 1: pdf-poppler (Node.js)**
```bash
npm install pdf-poppler
```
```javascript
const pdf = require('pdf-poppler');

const options = {
  format: 'png',
  out_dir: './temp',
  out_prefix: 'page',
  page: null // Convert all pages
};

pdf.convert('input.pdf', options)
  .then(() => {
    // Read generated images and convert to base64
  });
```

**Option 2: pdf2pic**
```bash
npm install pdf2pic
```
```javascript
const { fromPath } = require('pdf2pic');

const options = {
  density: 200,
  saveFilename: 'page',
  savePath: './temp',
  format: 'png',
  width: 2000,
  height: 2000
};

const convert = fromPath('input.pdf', options);
convert(1, { responseType: 'base64' })
  .then((resolve) => {
    const base64 = resolve.base64;
    // Use base64 string
  });
```

**Option 3: pdf-lib + canvas**
```bash
npm install pdf-lib canvas
```
```javascript
const { PDFDocument } = require('pdf-lib');
const { createCanvas } = require('canvas');
const fs = require('fs');

// More complex but gives full control
```

---

## 10. Response Format Updates

### All endpoints that return documents/templates should include:

```json
{
  "previewImages": ["data:image/png;base64,...", ...],
  "pdfDpi": 72,
  "pdfPageDimensions": [
    { "width": 612, "height": 792 },
    { "width": 612, "height": 792 }
  ]
}
```

---

## 11. Summary Checklist

- [ ] Install PDF to image conversion library (pdf-poppler, pdf2pic, or pdf-lib+canvas)
- [ ] Update `e_signature_documents` table: add `preview_images`, `pdf_dpi`, `pdf_page_dimensions`
- [ ] Update `e_signature_field_mappings` table: add `signer_placeholder`, `pdf_dpi`, `pdf_page_width`, `pdf_page_height`
- [ ] Update `e_signature_templates` table: add `preview_images`, `pdf_dpi`, `pdf_page_dimensions`
- [ ] Update `e_signature_template_fields` table: add `signer_placeholder`, `pdf_dpi`, `pdf_page_width`, `pdf_page_height`
- [ ] Update field type ENUMs to remove: `email`, `radio`, `select`, `customText`
- [ ] Modify `uploadDocument` to generate preview images and extract PDF metadata
- [ ] Modify `uploadTemplate` to generate preview images and extract PDF metadata
- [ ] Update `getDocumentById` to return preview images and PDF metadata
- [ ] Update `getTemplateById` to return preview images and PDF metadata
- [ ] Ensure all field coordinates are stored in PDF points (not viewport pixels)
- [ ] Update `createFromTemplate` to copy preview images and metadata
- [ ] Test preview image generation with various PDF sizes
- [ ] Test coordinate accuracy with different PDF page sizes

---

## 12. Testing Notes

1. **Test preview image generation:**
   - Upload a multi-page PDF
   - Verify all pages are converted to images
   - Verify base64 format is correct

2. **Test coordinate system:**
   - Create a field at position (100, 100) in PDF points
   - Verify it appears correctly on preview image
   - Verify coordinates are stored correctly in database

3. **Test template creation:**
   - Create a template with fields
   - Verify signer placeholders are stored (not actual users)
   - Verify preview images are stored

4. **Test template usage:**
   - Create document from template
   - Verify preview images are copied
   - Verify field mappings are copied with placeholders

---

## Questions/Clarifications Needed

1. **Preview image quality:** What DPI/resolution should preview images be? (Recommended: 150-200 DPI)
2. **Image format:** PNG or JPEG? (PNG recommended for better quality, JPEG for smaller size)
3. **Storage:** Store base64 in database or save images to disk and store URLs? (Base64 in DB is simpler but larger)
4. **PDF library preference:** Which library do you prefer? (pdf-poppler is simplest)

---

## Priority Order

1. **High Priority:**
   - Preview image generation on upload
   - Database schema updates
   - Update GET endpoints to return preview images

2. **Medium Priority:**
   - Template preview image generation
   - Signer placeholder support
   - Field type ENUM updates

3. **Low Priority:**
   - Coordinate system validation
   - Performance optimization for large PDFs

