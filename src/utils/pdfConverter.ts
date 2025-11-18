import * as pdfjsLib from 'pdfjs-dist';

// Configure worker for pdfjs-dist
// CRITICAL: Worker version MUST match the API version exactly
// Using CDN with exact version to ensure compatibility in production
if (typeof window !== 'undefined') {
  // Get the exact version from the installed package
  const pdfjsVersion = pdfjsLib.version;
  
  // Use CDN with exact version pinning to ensure version match
  // This is the most reliable approach for production
  const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;
  
  // Set worker URL
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
  
  // Verify worker is set correctly
  if (pdfjsLib.GlobalWorkerOptions.workerSrc !== workerUrl) {
    console.warn('⚠️ Worker URL was not set correctly');
  }
  
  console.log(`✅ PDF.js worker configured`);
  console.log(`   API Version: ${pdfjsVersion}`);
  console.log(`   Worker URL: ${workerUrl}`);
  
  // Test worker loading (optional, for debugging)
  if (process.env.NODE_ENV === 'development') {
    fetch(workerUrl, { method: 'HEAD' })
      .then(() => console.log('✅ Worker file is accessible'))
      .catch((err) => console.warn('⚠️ Worker file check failed:', err));
  }
}

export interface PDFConversionOptions {
  dpi?: number;
  scale?: number;
}

export interface PDFPageImage {
  pageNumber: number;
  imageData: string; // base64 data URI
  width: number;
  height: number;
}

/**
 * Convert PDF to base64 images in browser
 * Uses pdfjs-dist which works perfectly in browser environment
 */
export async function convertPDFToImages(
  pdfUrl: string,
  options: PDFConversionOptions = {}
): Promise<PDFPageImage[]> {
  const { scale = 2 } = options; // Default 2x scale (approx 150 DPI)

  try {
    console.log('🎨 Converting PDF to images (frontend)...', pdfUrl);

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    
    const pageCount = pdf.numPages;
    console.log(`📄 PDF loaded: ${pageCount} pages`);

    const images: PDFPageImage[] = [];

    // Convert each page
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      console.log(`   Converting page ${pageNum}/${pageCount}...`);

      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Failed to get canvas context');
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render PDF page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Convert canvas to base64
      const imageData = canvas.toDataURL('image/png');

      console.log(`   ✅ Page ${pageNum} converted: ${imageData.length} chars`);

      images.push({
        pageNumber: pageNum,
        imageData,
        width: viewport.width,
        height: viewport.height,
      });
    }

    console.log(`✅ Successfully converted ${images.length} pages`);
    return images;

  } catch (error) {
    console.error('❌ PDF conversion failed:', error);
    
    // Check for version mismatch errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('version') && errorMessage.includes('does not match')) {
      const versionMismatchError = new Error(
        `PDF.js version mismatch detected. API version: ${pdfjsLib.version}. ` +
        `Please ensure the worker version matches. Worker URL: ${pdfjsLib.GlobalWorkerOptions.workerSrc}`
      );
      console.error('Version mismatch details:', {
        apiVersion: pdfjsLib.version,
        workerUrl: pdfjsLib.GlobalWorkerOptions.workerSrc,
        originalError: errorMessage
      });
      throw versionMismatchError;
    }
    
    throw new Error(`Failed to convert PDF: ${errorMessage}`);
  }
}

/**
 * Convert PDF from file (for upload scenarios)
 */
export async function convertPDFFileToImages(
  file: File,
  options: PDFConversionOptions = {}
): Promise<PDFPageImage[]> {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const { scale = 2 } = options;

    console.log('🎨 Converting PDF file to images (frontend)...');

    // Load PDF from array buffer
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;
    
    const pageCount = pdf.numPages;
    console.log(`📄 PDF loaded: ${pageCount} pages`);

    const images: PDFPageImage[] = [];

    // Convert each page
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      console.log(`   Converting page ${pageNum}/${pageCount}...`);

      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Failed to get canvas context');
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render PDF page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Convert canvas to base64
      const imageData = canvas.toDataURL('image/png');

      console.log(`   ✅ Page ${pageNum} converted: ${imageData.length} chars`);

      images.push({
        pageNumber: pageNum,
        imageData,
        width: viewport.width,
        height: viewport.height,
      });
    }

    console.log(`✅ Successfully converted ${images.length} pages`);
    return images;

  } catch (error) {
    console.error('❌ PDF conversion failed:', error);
    
    // Check for version mismatch errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('version') && errorMessage.includes('does not match')) {
      const versionMismatchError = new Error(
        `PDF.js version mismatch detected. API version: ${pdfjsLib.version}. ` +
        `Please ensure the worker version matches. Worker URL: ${pdfjsLib.GlobalWorkerOptions.workerSrc}`
      );
      console.error('Version mismatch details:', {
        apiVersion: pdfjsLib.version,
        workerUrl: pdfjsLib.GlobalWorkerOptions.workerSrc,
        originalError: errorMessage
      });
      throw versionMismatchError;
    }
    
    throw new Error(`Failed to convert PDF: ${errorMessage}`);
  }
}

