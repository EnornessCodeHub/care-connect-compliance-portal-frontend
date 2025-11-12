# E-Signature Documents Flow Updates

## Overview
This document outlines the changes needed to match the E-Signature Documents module to the specified flow requirements.

## Key Changes Required

### 1. Field Types ✅ (COMPLETED)
- Removed `customText`, `email`, `radio`, `select` 
- Kept: `text`, `textarea`, `date`, `checkbox`, `dropdown`, `signature`
- Updated field types array to match requirements

### 2. Preview Images (IN PROGRESS)
- ✅ Added `previewImages` state
- ✅ Updated `loadDocument` to load preview images
- ⏳ Need to: Update UI to display base64 preview images instead of PDF viewer in editor mode
- ⏳ Need to: Backend should generate preview images on upload

### 3. Coordinate System (IN PROGRESS)
- ✅ Added `pdfDpi` and `pdfPageDimensions` state
- ✅ FieldMapping interface already has PDF DPI coordinate fields
- ⏳ Need to: Update `handleAddField` to calculate coordinates relative to PDF DPI
- ⏳ Need to: Update `handlePositionChange` to work with PDF DPI coordinates
- ⏳ Need to: Add helper functions to convert between viewport and PDF DPI coordinates

### 4. Template Management (PENDING)
- ✅ Template interface already has `signerPlaceholder` support
- ⏳ Need to: Update template creation to use signer placeholders instead of actual users
- ⏳ Need to: Update template usage flow to assign real users to signer placeholders
- ⏳ Need to: Add UI for signer placeholder assignment when creating from template

### 5. Signing Interface (PENDING)
- ⏳ Need to: Create signing page that uses base64 preview images
- ⏳ Need to: Add interactive overlay fields on preview images
- ⏳ Need to: Support signature drawing/upload
- ⏳ Need to: Track progress per signer

### 6. Final PDF Generation (PENDING)
- ⏳ Need to: Backend endpoint to generate final flattened PDF
- ⏳ Need to: Merge original PDF + field values + signatures
- ⏳ Need to: Render at exact coordinates relative to PDF DPI

## Implementation Priority

1. **High Priority:**
   - Update coordinate handling to use PDF DPI
   - Update UI to use preview images in editor
   - Update field addition/positioning to work with PDF DPI coordinates

2. **Medium Priority:**
   - Template signer placeholder assignment
   - Signing interface with preview images

3. **Low Priority:**
   - Final PDF generation (backend)
   - Progress tracking UI

## Notes

- The service interface already supports most required features
- Main work is in the UI layer (FormBuilder component)
- Backend may need updates for preview image generation and final PDF rendering

