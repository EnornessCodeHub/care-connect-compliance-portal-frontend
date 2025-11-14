import * as pdfjsLib from 'pdfjs-dist';

// Configure worker for pdfjs-dist
// Try local worker first (from public folder), fallback to CDN
const workerUrl = '/workers/pdf.worker.min.mjs';

// Check if local worker exists, otherwise use CDN
fetch(workerUrl, { method: 'HEAD' })
  .then(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    console.log('✅ Using local pdfjs worker');
  })
  .catch(() => {
    // Fallback to unpkg CDN
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    console.log('✅ Using CDN pdfjs worker');
  });

// Set initial worker (will be replaced by async check above)
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

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
    throw new Error(`Failed to convert PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    throw new Error(`Failed to convert PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

