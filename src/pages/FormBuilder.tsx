import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Save,
  Upload,
  FileText,
  Calendar,
  CheckSquare,
  ChevronDown,
  Mail,
  Radio,
  Type,
  PenTool,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Menu,
  User,
  Plus,
} from 'lucide-react';
import eSignatureService, { ESignatureDocument, FieldMapping } from '@/services/eSignatureService';
import staffService, { Staff } from '@/services/staffService';
import authService from '@/services/authService';
import { convertPDFToImages } from '@/utils/pdfConverter';

interface FieldType {
  type: FieldMapping['fieldType'];
  label: string;
  icon: React.ReactNode;
  category: 'internal' | 'external';
}

const fieldTypes: FieldType[] = [
  { type: 'fullname', label: 'FullName', icon: <User className="h-4 w-4" />, category: 'internal' },
  { type: 'email', label: 'Email', icon: <Mail className="h-4 w-4" />, category: 'internal' },
  { type: 'date', label: 'Date', icon: <Calendar className="h-4 w-4" />, category: 'internal' },
  { type: 'customText', label: 'Custom Text', icon: <Type className="h-4 w-4" />, category: 'internal' },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare className="h-4 w-4" />, category: 'internal' },
  { type: 'radio', label: 'Radio Button', icon: <Radio className="h-4 w-4" />, category: 'internal' },
  { type: 'select', label: 'Select', icon: <ChevronDown className="h-4 w-4" />, category: 'internal' },
  { type: 'signature', label: 'Signature', icon: <PenTool className="h-4 w-4" />, category: 'internal' },
  { type: 'fullname', label: 'FullName', icon: <User className="h-4 w-4" />, category: 'external' },
  { type: 'email', label: 'Email', icon: <Mail className="h-4 w-4" />, category: 'external' },
  { type: 'date', label: 'Date', icon: <Calendar className="h-4 w-4" />, category: 'external' },
  { type: 'customText', label: 'Custom Text', icon: <Type className="h-4 w-4" />, category: 'external' },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare className="h-4 w-4" />, category: 'external' },
  { type: 'radio', label: 'Radio Button', icon: <Radio className="h-4 w-4" />, category: 'external' },
  { type: 'select', label: 'Select', icon: <ChevronDown className="h-4 w-4" />, category: 'external' },
  { type: 'signature', label: 'Signature', icon: <PenTool className="h-4 w-4" />, category: 'external' },
];

// Helper function to get field icon based on field type
const getFieldIcon = (fieldType: string) => {
  switch (fieldType) {
    case 'fullname':
      return <User className="h-4 w-4" />;
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'date':
      return <Calendar className="h-4 w-4" />;
    case 'customText':
      return <Type className="h-4 w-4" />;
    case 'checkbox':
      return <CheckSquare className="h-4 w-4" />;
    case 'radio':
      return <Radio className="h-4 w-4" />;
    case 'select':
      return <ChevronDown className="h-4 w-4" />;
    case 'signature':
      return <PenTool className="h-4 w-4" />;
    default:
      return <Type className="h-4 w-4" />;
  }
};

// Helper function to get field label based on field type
const getFieldLabel = (fieldType: string) => {
  const field = fieldTypes.find(f => f.type === fieldType);
  return field?.label || 'Field';
};

export default function FormBuilder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isAdmin = authService.isAdmin();
  
  const documentId = searchParams.get('id');
  const templateId = searchParams.get('templateId');
  const editTemplate = searchParams.get('editTemplate') === 'true';
  const tab = searchParams.get('tab') || 'fields';
  
  // Get document data from navigation state (if coming from upload)
  const uploadedDocumentData = location.state?.documentData;
  
  // State for sidebar visibility - open by default
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  
  // PDF viewer state
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [pdfLoading, setPdfLoading] = useState(false);

  const [eSignatureDocument, setESignatureDocument] = useState<ESignatureDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [selectedField, setSelectedField] = useState<FieldMapping | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]); // Base64 preview images for each page
  const [pdfContainerRef, setPdfContainerRef] = useState<HTMLDivElement | null>(null);
  const pdfBlobUrlRef = useRef<string | null>(null);
  const pdfContainerRefs = useRef<Map<number, HTMLDivElement>>(new Map()); // Store refs for all pages
  const [pdfPageDimensions, setPdfPageDimensions] = useState<Array<{ width: number; height: number }>>([]);
  const [pdfDpi, setPdfDpi] = useState<number>(72); // Default PDF DPI
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set()); // Track which images have loaded
  
  // Drag & drop state
  const [draggingField, setDraggingField] = useState<FieldMapping | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false); // Track if actually dragging (not just clicking)
  const DRAG_THRESHOLD = 5; // Minimum pixels to move before starting drag
  const [isPlacingField, setIsPlacingField] = useState<FieldType | null>(null); // Field type being placed
  const [draggingFieldType, setDraggingFieldType] = useState<FieldType | null>(null); // Field type being dragged from sidebar
  
  // State for field configuration
  const [newOptionInput, setNewOptionInput] = useState<{ [fieldId: string]: string }>({});

  // Save document name modal
  const [isSaveNameModalOpen, setIsSaveNameModalOpen] = useState(false);
  const [documentName, setDocumentName] = useState('');


  // Share dialog
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedInternalUsers, setSelectedInternalUsers] = useState<number[]>([]);
  const [externalEmails, setExternalEmails] = useState<string[]>(['']);
  const [sharing, setSharing] = useState(false);
  
  // Collapsible sections state
  const [internalFieldsExpanded, setInternalFieldsExpanded] = useState(true);
  const [externalFieldsExpanded, setExternalFieldsExpanded] = useState(true);

  useEffect(() => {
    if (templateId && editTemplate) {
      // Load template directly for editing (not creating a new document)
      loadTemplateForEditing();
    } else if (templateId) {
      // Create document from template (old behavior - for backward compatibility)
      loadTemplateAndCreateDocument();
    } else if (documentId) {
      // If we have uploaded document data from navigation state, use it directly
      if (uploadedDocumentData && uploadedDocumentData.id === documentId) {
        console.log('Using uploaded document data from navigation state');
        loadDocumentFromData(uploadedDocumentData);
      } else {
        console.log('Loading document from API');
        loadDocument();
      }
    }
    
    // Cleanup blob URL on unmount
    return () => {
      if (pdfBlobUrlRef.current) {
        URL.revokeObjectURL(pdfBlobUrlRef.current);
        pdfBlobUrlRef.current = null;
      }
    };
  }, [documentId, templateId, editTemplate, uploadedDocumentData]);

  // Reset imagesLoaded when document/template or preview images change
  useEffect(() => {
    setImagesLoaded(new Set());
    
    // Check if images are already loaded (cached images)
    // This handles the case where onLoad might not fire for cached images
    if (previewImages.length > 0) {
      // Use setTimeout to ensure DOM is updated and refs are set
      setTimeout(() => {
        previewImages.forEach((_, index) => {
          const pageNumber = index + 1;
          // Get container from refs map
          const container = pdfContainerRefs.current.get(pageNumber);
          if (container) {
            const imgElement = container.querySelector(`img[data-page-container="${pageNumber}"]`) as HTMLImageElement;
            if (imgElement && imgElement.complete && imgElement.naturalWidth > 0) {
              // Image is already loaded
              setImagesLoaded(prev => new Set(prev).add(pageNumber));
            }
          } else {
            // Fallback: try to find by data attribute
            const imgElement = window.document.querySelector(`img[data-page-container="${pageNumber}"]`) as HTMLImageElement;
            if (imgElement && imgElement.complete && imgElement.naturalWidth > 0) {
              setImagesLoaded(prev => new Set(prev).add(pageNumber));
            }
          }
        });
        // Force re-render after checking all images
        setFieldMappings(prev => [...prev]);
      }, 100);
    }
  }, [eSignatureDocument?.id, previewImages.length, editTemplate, templateId]);
  
  const loadTemplateForEditing = async () => {
    if (!templateId) return;
    
    try {
      setLoading(true);
      setPdfLoading(true);
      const response = await eSignatureService.getTemplateById(templateId);
      if (response.success && response.data) {
        const template = response.data;
        // Create a temporary document-like object from template for editing
        const templateAsDocument: ESignatureDocument = {
          id: template.id,
          fileName: template.templateName,
          originalFileName: template.originalFile,
          fileSize: template.fileSize,
          fileUrl: template.fileUrl,
          previewImages: template.previewImages,
          status: 'pending',
          sharedToInternal: false,
          sharedToExternal: false,
          fieldMappings: template.fieldMappings || [],
          pdfDpi: template.pdfDpi,
          pdfPageDimensions: template.pdfPageDimensions,
          createdAt: template.createdAt,
          lastUpdatedAt: template.createdAt,
          createdBy: template.createdBy,
        };
        setESignatureDocument(templateAsDocument);
        setFieldMappings(template.fieldMappings || []);
        
        // CRITICAL: Load PDF metadata FIRST (before conversion) for coordinate conversion
        if (template.pdfDpi) {
          setPdfDpi(template.pdfDpi);
        } else {
          setPdfDpi(72); // Default DPI
        }
        
        // Parse page dimensions if they come as JSON string from backend
        let parsedDimensions = template.pdfPageDimensions;
        if (typeof parsedDimensions === 'string') {
          try {
            parsedDimensions = JSON.parse(parsedDimensions);
            console.log('📋 Parsed page dimensions from JSON string:', parsedDimensions);
          } catch (parseError) {
            console.error('Failed to parse pdfPageDimensions:', parseError);
            parsedDimensions = [{ width: 612, height: 792 }];
          }
        }
        
        if (parsedDimensions && Array.isArray(parsedDimensions) && parsedDimensions.length > 0) {
          setPdfPageDimensions(parsedDimensions);
          setNumPages(parsedDimensions.length);
        } else {
          // Default page dimensions if not available
          setPdfPageDimensions([{ width: 612, height: 792 }]);
          setNumPages(1);
        }
        
        // Convert PDF to images on frontend using pdfjs-dist
        if (template.fileUrl) {
          try {
            setPdfUrl(template.fileUrl);
            
            console.log('🎨 Converting template PDF to images on frontend...');
            console.log('Template metadata:', {
              dpi: template.pdfDpi || 72,
              pages: template.pdfPageDimensions?.length || 1,
              dimensions: template.pdfPageDimensions
            });
            
            toast({
              title: 'Loading Template',
              description: 'Converting PDF pages to images...',
            });
            
            // Convert PDF to base64 images using pdfjs-dist (browser-native)
            const images = await convertPDFToImages(template.fileUrl, { scale: 2 });
            
            // Extract base64 image data from results
            const base64Images = images.map(img => img.imageData);
            
            console.log(`✅ Converted ${images.length} template pages on frontend`);
            
            setPreviewImages(base64Images);
            setNumPages(images.length);
            setPdfLoading(false);
            
            toast({
              title: 'Success',
              description: `Template loaded with ${images.length} pages. You can now edit field mappings.`,
            });
            
          } catch (conversionError) {
            console.error('❌ Frontend template conversion failed:', conversionError);
            setPdfLoading(false);
            toast({
              variant: 'destructive',
              title: 'Template Conversion Failed',
              description: conversionError instanceof Error ? conversionError.message : 'Failed to convert template PDF to images',
            });
          }
        } else {
          console.warn('No template file URL available');
          setPdfLoading(false);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Template file URL is not available',
          });
        }
      }
    } catch (error: any) {
      console.error('Error loading template:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load template',
      });
      setPdfLoading(false);
    } finally {
      setLoading(false);
    }
  };
  
  const loadTemplateAndCreateDocument = async () => {
    if (!templateId) return;
    
    try {
      setLoading(true);
      // Create document from template
      const createResponse = await eSignatureService.createFromTemplate(templateId);
      if (createResponse.success && createResponse.data) {
        // Navigate to the new document
        navigate(`/forms/create?id=${createResponse.data.id}`, { replace: true });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load template',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'share' && isAdmin) {
      loadStaff();
    }
  }, [tab, isAdmin]);

  // Inject PDF viewer styles
  useEffect(() => {
    const pdfViewerStyles = `
      .react-pdf__Page {
        display: flex;
        justify-content: center;
      }
      .react-pdf__Page__canvas {
        margin: 0 auto;
      }
      .react-pdf__Page__textContent {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        opacity: 0.2;
        line-height: 1;
      }
      .react-pdf__Page__textContent span {
        color: transparent;
        position: absolute;
        white-space: pre;
        cursor: text;
        transform-origin: 0% 0%;
      }
    `;
    
    if (typeof window !== 'undefined' && !window.document.head.querySelector('style[data-pdf-viewer]')) {
      const styleSheet = window.document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.setAttribute('data-pdf-viewer', 'true');
      styleSheet.innerText = pdfViewerStyles;
      window.document.head.appendChild(styleSheet);
    }
  }, []);

  // Load document from provided data (e.g., from upload response)
  const loadDocumentFromData = async (documentData: ESignatureDocument) => {
    console.log('Loading document from provided data:', documentData);
    console.log('File URL:', documentData.fileUrl);
    
    setESignatureDocument(documentData);
    setFieldMappings(documentData.fieldMappings || []);
    
    // CRITICAL: Load PDF metadata FIRST (before conversion) for coordinate conversion
    if (documentData.pdfDpi) {
      setPdfDpi(documentData.pdfDpi);
    } else {
      setPdfDpi(72); // Default DPI
    }
    
    // Parse page dimensions if they come as JSON string from backend
    let parsedDimensions = documentData.pdfPageDimensions;
    if (typeof parsedDimensions === 'string') {
      try {
        parsedDimensions = JSON.parse(parsedDimensions);
        console.log('📋 Parsed page dimensions from JSON string:', parsedDimensions);
      } catch (parseError) {
        console.error('Failed to parse pdfPageDimensions:', parseError);
        parsedDimensions = [{ width: 612, height: 792 }];
      }
    }
    
    if (parsedDimensions && Array.isArray(parsedDimensions) && parsedDimensions.length > 0) {
      setPdfPageDimensions(parsedDimensions);
      setNumPages(parsedDimensions.length);
    } else {
      // Default page dimensions if not available
      setPdfPageDimensions([{ width: 612, height: 792 }]);
      setNumPages(1);
    }
    
    // Set user selections
    if (documentData.internalUsers) {
      setSelectedInternalUsers(documentData.internalUsers.map(u => u.id));
    }
    if (documentData.externalUsers) {
      setExternalEmails(documentData.externalUsers.map(u => u.email));
    }
    
    // Convert PDF to images on frontend using pdfjs-dist
    if (documentData.fileUrl) {
      try {
        setPdfLoading(true);
        setPdfUrl(documentData.fileUrl);
        
        console.log('🎨 Converting PDF to images on frontend...');
        console.log('Document metadata:', {
          dpi: documentData.pdfDpi || 72,
          pages: documentData.pdfPageDimensions?.length || 1,
          dimensions: documentData.pdfPageDimensions
        });
        
        toast({
          title: 'Loading PDF',
          description: 'Converting PDF pages to images...',
        });
        
        // Convert PDF to base64 images using pdfjs-dist (browser-native)
        const images = await convertPDFToImages(documentData.fileUrl, { scale: 2 });
        
        // Extract base64 image data from results
        const base64Images = images.map(img => img.imageData);
        
        console.log(`✅ Converted ${images.length} pages on frontend`);
        
        setPreviewImages(base64Images);
        setNumPages(images.length);
        setPdfLoading(false);
        
        toast({
          title: 'Success',
          description: `PDF loaded with ${images.length} pages. You can now drag and drop fields.`,
        });
        
      } catch (conversionError) {
        console.error('❌ Frontend PDF conversion failed:', conversionError);
        setPdfLoading(false);
        toast({
          variant: 'destructive',
          title: 'PDF Conversion Failed',
          description: conversionError instanceof Error ? conversionError.message : 'Failed to convert PDF to images',
        });
      }
    } else {
      console.warn('No file URL available');
      setPdfLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'PDF file URL is not available',
      });
    }
    
    setLoading(false);
  };

  const loadDocument = async () => {
    if (!documentId) return;

    try {
      setLoading(true);
      setPdfLoading(true);
      const response = await eSignatureService.getDocumentById(documentId);
      console.log('Document response:', response);
      
      if (response.success && response.data) {
        // CRITICAL: Load PDF directly, don't wait for preview images
        await loadDocumentFromData(response.data);
      }
    } catch (error: any) {
      console.error('Error loading document:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load document',
      });
      setPdfLoading(false);
      setLoading(false);
    }
  };

  const loadStaff = async () => {
    try {
      const response = await staffService.listStaff();
      if (response.success && response.data) {
        setStaffList(response.data);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load staff list',
      });
    }
  };

  // Convert viewport coordinates to PDF DPI coordinates
  const convertViewportToPdfCoordinates = (
    viewportX: number,
    viewportY: number,
    viewportWidth: number,
    viewportHeight: number,
    pageIndex: number
  ): { x: number; y: number; width: number; height: number } => {
    const pageDim = pdfPageDimensions[pageIndex] || { width: 612, height: 792 }; // Default US Letter
    const scaleX = pageDim.width / viewportWidth;
    const scaleY = pageDim.height / viewportHeight;
    
    console.log('🔄 Converting viewport to PDF coords:');
    console.log('   Input:', { viewportX, viewportY, viewportWidth, viewportHeight, pageIndex });
    console.log('   Page dim:', pageDim);
    console.log('   Scales:', { scaleX, scaleY });
    console.log('   Result X:', viewportX * scaleX, 'Result Y:', viewportY * scaleY);
    
    return {
      x: viewportX * scaleX,
      y: viewportY * scaleY,
      width: 200 * scaleX, // Default field width in PDF coordinates
      height: 30 * scaleY, // Default field height in PDF coordinates
    };
  };

  // Convert PDF DPI coordinates to viewport coordinates for display
  const convertPdfToViewportCoordinates = (
    pdfX: number,
    pdfY: number,
    pdfWidth: number,
    pdfHeight: number,
    viewportWidth: number,
    viewportHeight: number,
    pageIndex: number
  ): { x: number; y: number; width: number; height: number } => {
    const pageDim = pdfPageDimensions[pageIndex] || { width: 612, height: 792 };
    const scaleX = viewportWidth / pageDim.width;
    const scaleY = viewportHeight / pageDim.height;
    
    return {
      x: pdfX * scaleX,
      y: pdfY * scaleY,
      width: pdfWidth * scaleX,
      height: pdfHeight * scaleY,
    };
  };

  // Handle drag start from field button
  const handleFieldTypeDragStart = (e: React.DragEvent, fieldType: FieldType) => {
    console.log('🎯 Drag started:', fieldType);
    setDraggingFieldType(fieldType);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', JSON.stringify(fieldType));
  };

  // Handle drag end from field button
  const handleFieldTypeDragEnd = () => {
    setDraggingFieldType(null);
  };

  // Handle drop on PDF preview image
  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>, pageIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('📍 Drop triggered on page:', pageIndex + 1);
    console.log('   draggingFieldType:', draggingFieldType);
    console.log('   previewImages.length:', previewImages.length);
    console.log('   pdfPageDimensions:', pdfPageDimensions);
    
    if (!draggingFieldType || !previewImages.length) {
      console.warn('⚠️ Drop failed: missing draggingFieldType or previewImages');
      setDraggingFieldType(null);
      return;
    }
    
    const container = e.currentTarget;
    const img = container.querySelector('img');
    if (!img) {
      console.warn('⚠️ Drop failed: image element not found');
      setDraggingFieldType(null);
      return;
    }
    
    const imgRect = img.getBoundingClientRect();
    
    console.log('🖼️ Image rect:', imgRect);
    console.log('   width:', imgRect.width, 'height:', imgRect.height);
    console.log('   clientX:', e.clientX, 'clientY:', e.clientY);
    console.log('   imgRect.left:', imgRect.left, 'imgRect.top:', imgRect.top);
    
    // Calculate drop position relative to image
    const dropX = e.clientX - imgRect.left;
    const dropY = e.clientY - imgRect.top;
    
    console.log('💧 Drop position (viewport):', { dropX, dropY });
    
    // Get image dimensions
    const viewportWidth = imgRect.width;
    const viewportHeight = imgRect.height;
    
    console.log('📐 Viewport dimensions:', { viewportWidth, viewportHeight });
    
    // Convert to PDF DPI coordinates
    const pageDim = pdfPageDimensions[pageIndex] || { width: 612, height: 792 };
    console.log('📄 PDF page dimensions:', pageDim);
    
    const pdfCoords = convertViewportToPdfCoordinates(
      dropX,
      dropY,
      viewportWidth,
      viewportHeight,
      pageIndex
    );
    
    console.log('🔢 PDF coordinates after conversion:', pdfCoords);
    
    // Default field dimensions in PDF points
    const defaultPdfWidth = 200;
    const defaultPdfHeight = 30;
    
    // Initialize options for checkbox and radio fields (select starts with no options)
    const needsOptions = ['checkbox', 'radio'].includes(draggingFieldType.type);
    const initialOptions = needsOptions ? ['Option 1'] : undefined;
    
    const newField: FieldMapping = {
      id: `field_${Date.now()}`,
      fieldType: draggingFieldType.type,
      fieldName: draggingFieldType.label,
      x: pdfCoords.x - defaultPdfWidth / 2, // Center the field on drop position
      y: pdfCoords.y - defaultPdfHeight / 2,
      width: defaultPdfWidth,
      height: defaultPdfHeight,
      assignedTo: draggingFieldType.category,
      signerPlaceholder: draggingFieldType.category === 'internal' ? 'Staff Role' : 'External Role',
      required: true,
      pageNumber: pageIndex + 1,
      options: initialOptions,
      pdfDpi: pdfDpi,
      pdfPageWidth: pageDim.width,
      pdfPageHeight: pageDim.height,
    };
    
    console.log('✅ Field added successfully:', newField);
    console.log('   Position (PDF points):', { x: newField.x, y: newField.y });
    console.log('   Page dimensions:', pageDim);
    
    setFieldMappings([...fieldMappings, newField]);
    setSelectedField(newField);
    setDraggingFieldType(null);
    setPageNumber(pageIndex + 1); // Switch to the page where field was dropped
  };

  // Handle drag over on PDF preview image
  const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    // Log only once per second to avoid console spam
    const now = Date.now();
    const lastLog = (window as any).lastDragOverLog;
    if (!lastLog || now - lastLog > 1000) {
      console.log('🔄 Dragging over PDF area...');
      (window as any).lastDragOverLog = now;
    }
  };

  // Handle click on preview image (kept for backward compatibility, but not used for field placement)
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Click is now only used for selecting fields, not placing them
    // Field placement is done via drag and drop
  };

  // Handle field drag start
  const handleFieldDragStart = (e: React.MouseEvent, field: FieldMapping) => {
    e.stopPropagation();
    e.preventDefault();
    
    const fieldElement = e.currentTarget as HTMLElement;
    const fieldRect = fieldElement.getBoundingClientRect();
    
    // Calculate offset: where we clicked relative to the field's top-left corner
    // This offset will be used to maintain the relative position when dragging
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setDragOffset({
      x: e.clientX - fieldRect.left,
      y: e.clientY - fieldRect.top,
    });
    
    setDraggingField(field);
    setIsDragging(false); // Not dragging yet, just clicked
  };

  // Handle field drag
  const handleFieldDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingField || !dragOffset || !dragStartPos) return;
    
    // Calculate distance moved from initial click
    const deltaX = Math.abs(e.clientX - dragStartPos.x);
    const deltaY = Math.abs(e.clientY - dragStartPos.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Only start dragging if mouse moved beyond threshold
    if (!isDragging && distance < DRAG_THRESHOLD) {
      return; // Still just a click, not a drag
    }
    
    // Mark as dragging
    if (!isDragging) {
      setIsDragging(true);
    }
    
    const container = e.currentTarget;
    const img = container.querySelector('img');
    if (!img) return;
    
    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Get image dimensions
    const viewportWidth = imgRect.width;
    const viewportHeight = imgRect.height;
    
    // Get page dimensions for calculations
    const pageDim = pdfPageDimensions[draggingField.pageNumber - 1] || { width: 612, height: 792 };
    const fieldWidth = Number(draggingField.width) || 200;
    const fieldHeight = Number(draggingField.height) || 30;
    
    // Calculate scale factors for conversion
    const scaleX = viewportWidth / pageDim.width;
    const scaleY = viewportHeight / pageDim.height;
    
    // Calculate maximum positions in viewport coordinates
    const maxXViewport = (pageDim.width - fieldWidth) * scaleX;
    const maxYViewport = (pageDim.height - fieldHeight) * scaleY;
    
    // Calculate mouse position relative to image
    // Allow mouse to go beyond image to reach edges
    // To position field at maxX, mouse needs to be at: maxXViewport + dragOffset.x
    const rawMouseX = e.clientX - imgRect.left;
    const rawMouseY = e.clientY - imgRect.top;
    
    // Allow mouse to go enough to the right to position field at maxX
    // Don't restrict mouse movement - let it go anywhere, we'll clamp the final result
    const mouseXRelativeToImage = rawMouseX;
    const mouseYRelativeToImage = rawMouseY;
    
    // Calculate new position: mouse position minus the offset from where we clicked on the field
    // This gives us the top-left corner of where the field should be in viewport coordinates
    let newX = mouseXRelativeToImage - dragOffset.x;
    let newY = mouseYRelativeToImage - dragOffset.y;
    
    // Clamp newX/newY to viewport bounds (allowing field to reach edges)
    // maxXViewport and maxYViewport are already calculated above
    newX = Math.max(0, Math.min(maxXViewport, newX));
    newY = Math.max(0, Math.min(maxYViewport, newY));
    
    // Convert to PDF coordinates
    const pdfCoords = convertViewportToPdfCoordinates(
      newX,
      newY,
      viewportWidth,
      viewportHeight,
      draggingField.pageNumber - 1
    );
    
    // Calculate maximum X and Y positions in PDF coordinates
    // Field's right edge (x + width) should be able to reach page width
    // So maxX = pageWidth - fieldWidth (this allows field's right edge to be at pageWidth)
    const maxX = pageDim.width - fieldWidth;
    const maxY = pageDim.height - fieldHeight;
    
    // Clamp coordinates to page bounds (should already be within bounds due to viewport clamping)
    const clampedX = Math.max(0, Math.min(maxX, pdfCoords.x));
    const clampedY = Math.max(0, Math.min(maxY, pdfCoords.y));
    
    // Debug logging for right edge dragging
    if (Math.abs(pdfCoords.x - maxX) < 100 || rawMouseX > viewportWidth * 0.8) {
      console.log('🔍 Right edge drag:', {
        mouse: {
          rawMouseX: rawMouseX.toFixed(2),
          mouseXRelativeToImage: mouseXRelativeToImage.toFixed(2),
          dragOffsetX: dragOffset.x.toFixed(2),
          viewportWidth: viewportWidth.toFixed(2)
        },
        viewport: {
          newX: newX.toFixed(2),
          maxXViewport: maxXViewport.toFixed(2),
          neededMouseX: (maxXViewport + dragOffset.x).toFixed(2)
        },
        pdf: {
          pdfCoordsX: pdfCoords.x.toFixed(2),
          maxX: maxX.toFixed(2),
          clampedX: clampedX.toFixed(2),
          pageWidth: pageDim.width.toFixed(2),
          fieldWidth: fieldWidth.toFixed(2),
          fieldRightEdge: (clampedX + fieldWidth).toFixed(2)
        },
        canReachRight: pdfCoords.x <= maxX,
        isClamped: pdfCoords.x !== clampedX
      });
    }
    
    // Update field position with bounds checking
    const updatedField = {
      ...draggingField,
      x: clampedX,
      y: clampedY,
    };
    
    setFieldMappings(
      fieldMappings.map((f) => (f.id === draggingField.id ? updatedField : f))
    );
    setSelectedField(updatedField);
  };

  // Handle drag end
  const handleFieldDragEnd = (e?: React.MouseEvent) => {
    const wasDragging = isDragging;
    
    // If we were actually dragging, prevent click event
    if (wasDragging && e) {
      e?.preventDefault();
      e?.stopPropagation();
    }
    
    setDraggingField(null);
    setDragOffset(null);
    setDragStartPos(null);
    setIsDragging(false);
    
    // Return whether we were dragging (so click handler can decide)
    return wasDragging;
  };

  const handleFieldClick = (field: FieldMapping) => {
    // Only select if we're not currently dragging
    if (!isDragging) {
      setSelectedField(field);
    }
  };


  const handleDeleteField = () => {
    if (!selectedField) return;
    setFieldMappings(fieldMappings.filter((f) => f.id !== selectedField.id));
    setSelectedField(null);
  };

  // PDF viewer handlers
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    console.error('PDF URL:', pdfUrl);
    setPdfLoading(false);
    toast({
      variant: 'destructive',
      title: 'Error',
      description: `Failed to load PDF document: ${error.message || 'Unknown error'}`,
    });
  };

  // Removed zoom and navigation functions - using smooth scrolling instead

  const handlePageClick = (page: number) => {
    setPageNumber(page);
    // Scroll to the selected page smoothly
    setTimeout(() => {
      const pageElement = pdfContainerRef;
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleSave = async () => {
    // If editing a template, save directly without showing document name modal
    if (editTemplate && templateId) {
      await performSave();
      return;
    }

    if (!documentId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Document ID is required',
      });
      return;
    }

    if (!eSignatureDocument) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Document not loaded',
      });
      return;
    }

    // Check if this is a new document - show modal if:
    // 1. Document was created recently (within last 5 minutes) - indicates new upload
    // 2. fileName matches originalFileName (hasn't been customized)
    // 3. fileName is empty
    // 4. No field mappings AND document was just created
    const originalNameWithoutExt = eSignatureDocument.originalFileName?.replace(/\.pdf$/i, '') || '';
    const currentFileName = eSignatureDocument.fileName || '';
    const hasNoFieldMappings = !fieldMappings || fieldMappings.length === 0;
    const fileNameMatchesOriginal = currentFileName === originalNameWithoutExt;
    
    // Check if document was created recently (within last 5 minutes)
    const createdAt = eSignatureDocument.createdAt ? new Date(eSignatureDocument.createdAt) : null;
    const lastUpdatedAt = eSignatureDocument.lastUpdatedAt ? new Date(eSignatureDocument.lastUpdatedAt) : null;
    const isRecentlyCreated = createdAt && lastUpdatedAt && 
      (lastUpdatedAt.getTime() - createdAt.getTime()) < 5 * 60 * 1000; // 5 minutes
    const isNewlyCreated = createdAt && lastUpdatedAt && 
      Math.abs(lastUpdatedAt.getTime() - createdAt.getTime()) < 10 * 1000; // Created and updated within 10 seconds
    
    // Show modal if: recently created OR (no field mappings AND newly created) OR fileName matches original OR fileName is empty
    const isNewDocument = isRecentlyCreated || 
      (hasNoFieldMappings && isNewlyCreated) || 
      fileNameMatchesOriginal || 
      !currentFileName || 
      currentFileName.trim() === '';
    
    console.log('Save check:', {
      hasNoFieldMappings,
      fileNameMatchesOriginal,
      currentFileName,
      originalNameWithoutExt,
      fieldMappingsLength: fieldMappings?.length,
      isRecentlyCreated,
      isNewlyCreated,
      createdAt: eSignatureDocument.createdAt,
      lastUpdatedAt: eSignatureDocument.lastUpdatedAt,
      isNewDocument
    });
    
    if (isNewDocument) {
      // Show modal to enter document name
      const defaultName = originalNameWithoutExt || currentFileName || 'Untitled Document';
      setDocumentName(defaultName);
      setIsSaveNameModalOpen(true);
      console.log('Opening save name modal with name:', defaultName);
      return;
    }

    // For existing documents, save directly
    await performSave();
  };

  const performSave = async (fileName?: string) => {
    // If editing a template, save the template instead of document
    if (editTemplate && templateId) {
      try {
        setSaving(true);
        console.log('💾 Saving template with field mappings:', {
          templateId,
          templateName: fileName || eSignatureDocument?.fileName || '',
          fieldMappingsCount: fieldMappings.length,
          fieldMappings: fieldMappings
        });
        const response = await eSignatureService.updateTemplate(templateId, {
          templateName: fileName || eSignatureDocument?.fileName || '',
          fieldMappings,
        });
        if (response.success) {
          toast({
            title: 'Success',
            description: 'Template saved successfully',
          });
          // Navigate back to templates page
          navigate('/forms/templates');
        }
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to save template',
        });
      } finally {
        setSaving(false);
      }
      return;
    }

    if (!documentId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Document ID is required',
      });
      return;
    }

    try {
      setSaving(true);
      const updateData: any = {
        fieldMappings,
      };
      
      // If fileName is provided, update it
      if (fileName) {
        updateData.fileName = fileName.trim();
      }
      
      const response = await eSignatureService.updateDocument(documentId, updateData);
      
      // Share document with selected users (if any)
      if (selectedInternalUsers.length > 0 || externalEmails.length > 0) {
        await eSignatureService.shareDocument(documentId, {
          internalUserIds: selectedInternalUsers,
          externalEmails: externalEmails
        });
      }
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Document saved and shared successfully',
        });
        
        // If this was a new document, navigate to document list
        const isNewDocument = !eSignatureDocument?.fileName || eSignatureDocument.fileName.trim() === '';
        if (isNewDocument || fileName) {
          navigate('/forms');
        }
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save document',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWithName = async () => {
    if (!documentName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a document name',
      });
      return;
    }

    setIsSaveNameModalOpen(false);
    await performSave(documentName.trim());
  };


  const handleShare = async () => {
    if (!documentId) return;

    try {
      setSharing(true);
      const response = await eSignatureService.shareDocument(documentId, {
        internalUserIds: selectedInternalUsers,
        externalEmails: externalEmails.filter(e => e.trim() !== ''),
      });
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Document shared successfully',
        });
        setIsShareOpen(false);
        loadDocument();
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to share document',
      });
    } finally {
      setSharing(false);
    }
  };

  const internalFields = fieldTypes.filter(f => f.category === 'internal');
  const externalFields = fieldTypes.filter(f => f.category === 'external');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!eSignatureDocument) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No document found. Please upload a document first.
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate(editTemplate ? '/forms/templates' : '/forms')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {editTemplate ? 'Back to Templates' : 'Back to Documents'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background w-full">
      {/* Left Sidebar - Collapsible */}
      {leftSidebarOpen && (
        <div className="w-64 border-r bg-muted/30 p-4 space-y-4 overflow-y-auto">


        {/* Internal Fields */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-semibold">Internal Fields</Label>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setInternalFieldsExpanded(!internalFieldsExpanded)}
            >
              {internalFieldsExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
          {internalFieldsExpanded && (
            <div className="grid grid-cols-3 gap-2">
              {internalFields.map((field) => (
                <Button
                  key={`${field.type}-${field.category}`}
                  variant={selectedField?.fieldType === field.type ? 'default' : 'outline'}
                  className={`flex flex-col items-center justify-center h-20 p-1.5 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 cursor-grab active:cursor-grabbing ${
                    draggingFieldType?.type === field.type && draggingFieldType?.category === field.category
                      ? 'opacity-50 scale-95'
                      : ''
                  }`}
                  draggable={true}
                  onDragStart={(e) => handleFieldTypeDragStart(e, field)}
                  onDragEnd={handleFieldTypeDragEnd}
                >
                  <div className="mb-1 flex-shrink-0">{field.icon}</div>
                  <span className="text-[9px] font-medium text-center break-words line-clamp-2 w-full px-0.5 leading-tight overflow-hidden">{field.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* External Fields */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-semibold">External Fields</Label>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setExternalFieldsExpanded(!externalFieldsExpanded)}
            >
              {externalFieldsExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
          {externalFieldsExpanded && (
            <div className="grid grid-cols-3 gap-2">
              {externalFields.map((field) => (
                <Button
                  key={`${field.type}-${field.category}`}
                  variant="outline"
                  className={`flex flex-col items-center justify-center h-20 p-1.5 bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700 cursor-grab active:cursor-grabbing ${
                    draggingFieldType?.type === field.type && draggingFieldType?.category === field.category
                      ? 'opacity-50 scale-95'
                      : ''
                  }`}
                  draggable={true}
                  onDragStart={(e) => handleFieldTypeDragStart(e, field)}
                  onDragEnd={handleFieldTypeDragEnd}
                >
                  <div className="mb-1 flex-shrink-0">{field.icon}</div>
                  <span className="text-[9px] font-medium text-center break-words line-clamp-2 w-full px-0.5 leading-tight overflow-hidden">{field.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
        </div>
      )}

      {/* Main Content - Full Width */}
      <div className="flex-1 flex flex-col w-full">
        <div className="border-b p-4 flex items-center justify-between bg-background w-full">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(editTemplate ? '/forms/templates' : '/forms')}
              className="justify-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {editTemplate ? 'Back to Templates' : 'Back to Document'}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              {editTemplate ? 'Save Template' : 'Save Document'}
            </Button>
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div className="flex-1 flex bg-gray-800 overflow-hidden">
          {/* Main PDF Viewer - Simple Image Viewer with Smooth Scrolling */}
          <div className="flex-1 flex flex-col bg-gray-800 overflow-hidden">
            {/* PDF Content - All Pages Scrollable */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-4">
                {(() => {
                  console.log('Rendering PDF area - State:', {
                    pdfLoading,
                    previewImagesCount: previewImages.length,
                    pdfUrl: pdfUrl ? 'SET' : 'NOT SET',
                    hasDocument: !!eSignatureDocument,
                    documentId
                  });
                  return null;
                })()}
                {pdfLoading ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin opacity-50" />
                      <p>Loading PDF...</p>
                    </CardContent>
                  </Card>
                ) : previewImages.length > 0 ? (
                  // CRITICAL: Show preview images first for drag and drop functionality
                  // Preview images are required for field placement
                  // Show all pages in a scrollable list
                  previewImages.map((preview, index) => {
                    const currentPage = index + 1;
                    return (
                      <div
                        key={index}
                        ref={(ref) => {
                          if (ref) {
                            pdfContainerRefs.current.set(currentPage, ref);
                            if (currentPage === pageNumber) {
                              setPdfContainerRef(ref);
                            }
                          } else {
                            pdfContainerRefs.current.delete(currentPage);
                          }
                        }}
                        className={`relative bg-white shadow-2xl mx-auto ${
                          draggingFieldType ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                        }`}
                        style={{ maxWidth: '100%' }}
                        onMouseMove={handleFieldDrag}
                        onMouseUp={(e) => handleFieldDragEnd(e)}
                        onMouseLeave={() => handleFieldDragEnd()}
                        onClick={handleImageClick}
                        onDragOver={handleImageDragOver}
                        onDrop={(e) => handleImageDrop(e, index)}
                      >
                        <img
                          src={preview}
                          alt={`Page ${currentPage}`}
                          className="w-full h-auto"
                          style={{ display: 'block' }}
                          data-page-container={currentPage}
                          onLoad={() => {
                            // Mark this image as loaded
                            setImagesLoaded(prev => new Set(prev).add(currentPage));
                            // Force re-render to recalculate field positions
                            setFieldMappings(prev => [...prev]);
                          }}
                        />
                        {draggingFieldType && (
                          <div className="absolute inset-0 flex items-center justify-center bg-blue-100/50 pointer-events-none z-0 border-2 border-blue-400 border-dashed">
                            <div className="bg-blue-500/20 border-2 border-blue-500 border-dashed p-4 rounded">
                              <p className="text-blue-700 font-semibold">Drop {draggingFieldType.label} here</p>
                            </div>
                          </div>
                        )}
                        {/* Overlay fields - convert PDF DPI coordinates to viewport */}
                        {(() => {
                          const fieldsOnPage = fieldMappings.filter((field) => field.pageNumber === currentPage);
                          if (fieldsOnPage.length > 0) {
                            console.log(`🎯 Rendering ${fieldsOnPage.length} fields on page ${currentPage}`);
                          }
                          return null;
                        })()}
                        {/* Field Overlays - Only render if image has loaded */}
                        {imagesLoaded.has(currentPage) && fieldMappings
                          .filter((field) => field.pageNumber === currentPage)
                          .map((field) => {
                            const pageDim = pdfPageDimensions[currentPage - 1] || { width: 612, height: 792 };
                            // Get image element from the container for this page
                            const container = pdfContainerRefs.current.get(currentPage);
                            const imgElement = container?.querySelector(`img[data-page-container="${currentPage}"]`) || 
                                              container?.querySelector('img');
                            // Use getBoundingClientRect() to match drop handler coordinate calculation
                            const imgRect = imgElement?.getBoundingClientRect();
                            const viewportWidth = imgRect?.width || 612;
                            const viewportHeight = imgRect?.height || 792;
                            const coords = convertPdfToViewportCoordinates(
                              field.x,
                              field.y,
                              field.width,
                              field.height,
                              viewportWidth,
                              viewportHeight,
                              currentPage - 1
                            );
                            
                            // Log coordinate conversion for debugging
                            if (fieldMappings.filter(f => f.pageNumber === currentPage).indexOf(field) === 0) {
                              console.log(`🗺️ Field coordinate conversion (Page ${currentPage}):`, {
                                fieldId: field.id,
                                fieldName: field.fieldName,
                                pdfCoords: { x: field.x, y: field.y, width: field.width, height: field.height },
                                viewportDims: { width: viewportWidth, height: viewportHeight },
                                pageDims: pageDim,
                                viewportCoords: coords
                              });
                            }
                            
                            const fieldLabel = getFieldLabel(field.fieldType);
                            return (
                              <div
                                key={field.id}
                                className="absolute z-10 group"
                                style={{
                                  left: `${coords.x}px`,
                                  top: `${coords.y}px`,
                                  userSelect: 'none',
                                }}
                              >
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                  <div className="bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                    {field.fieldName || fieldLabel}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                                      <div className="border-4 border-transparent border-t-black"></div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Draggable Field Card */}
                                <div
                                  onMouseDown={(e) => handleFieldDragStart(e, field)}
                                  onMouseUp={(e) => {
                                    const wasDragging = handleFieldDragEnd(e);
                                    // Only handle click if we weren't dragging
                                    if (!wasDragging) {
                                      e.stopPropagation();
                                      handleFieldClick(field);
                                      setPageNumber(currentPage); // Switch to this page when clicking field
                                    }
                                  }}
                                  className={`flex items-center gap-2 px-3 py-2 bg-white border-2 rounded cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${
                                    draggingField?.id === field.id
                                      ? field.assignedTo === 'external' ? 'border-yellow-400 shadow-lg' : field.assignedTo === 'internal' ? 'border-blue-400 shadow-lg' : 'border-gray-400 shadow-lg'
                                      : field.assignedTo === 'external' ? 'border-yellow-200' : field.assignedTo === 'internal' ? 'border-blue-200' : 'border-gray-200'
                                  } ${
                                    selectedField?.id === field.id
                                      ? field.assignedTo === 'external' 
                                        ? 'border-yellow-400 ring-2 ring-yellow-200' 
                                        : field.assignedTo === 'internal'
                                          ? 'border-blue-400 ring-2 ring-blue-200'
                                          : 'border-gray-400 ring-2 ring-gray-200'
                                      : ''
                                  }`}
                                  style={{
                                    minWidth: '120px',
                                  }}
                                >
                                  {/* Field Icon */}
                                  <div className={field.assignedTo === 'external' ? 'text-yellow-600 flex-shrink-0' : field.assignedTo === 'internal' ? 'text-blue-600 flex-shrink-0' : 'text-gray-600 flex-shrink-0'}>
                                    {getFieldIcon(field.fieldType)}
                                  </div>
                                  
                                  {/* Field Label */}
                                  <span className={field.assignedTo === 'external' ? 'text-yellow-700 text-sm font-medium flex-1' : field.assignedTo === 'internal' ? 'text-blue-600 text-sm font-medium flex-1' : 'text-gray-700 text-sm font-medium flex-1'}>
                                    {field.fieldName || fieldLabel} {!field.assignedTo && '(No Assignment)'}
                                  </span>
                                  
                                  {/* Delete Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedField(field);
                                      handleDeleteField();
                                    }}
                                    className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                                    title="Delete field"
                                  >
                                    <X className="h-3 w-3 text-white" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    );
                  })
                ) : pdfUrl ? (
                  // Fallback: Show PDF in iframe if preview images not available
                  // Note: Drag and drop will not work on PDF iframe
                  <div className="w-full flex items-center justify-center bg-white relative">
                    <div className="w-full max-w-4xl relative">
                      <div className="w-full h-[800px] border rounded-lg shadow-lg bg-white overflow-hidden">
                        <iframe
                          key={`iframe-${pdfUrl}`}
                          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                          className="w-full h-full border-0"
                          title="PDF Document"
                          style={{ display: 'block', minHeight: '800px' }}
                          onLoad={() => {
                            console.log('PDF iframe loaded successfully:', pdfUrl);
                            setPdfLoading(false);
                          }}
                          onError={(e) => {
                            console.error('PDF iframe load error:', e);
                            console.error('Failed URL:', pdfUrl);
                          }}
                        />
                      </div>
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                        <p className="font-semibold">⚠️ Preview Images Required</p>
                        <p>Field drag and drop requires preview images. Please wait for image conversion or refresh the page.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Please upload a PDF document to get started</p>
                      <p className="text-sm mt-2">The PDF will be converted to preview images for field placement</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Field Configuration - Collapsible */}
      {rightSidebarOpen && (
        <div className="w-80 border-l bg-muted/30 p-4 space-y-4 overflow-y-auto">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-center">Fields Configuration</h2>
          <Separator className="mb-4" />
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {fieldMappings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No fields added yet
                </p>
              ) : (
                fieldMappings.map((field) => {
                  const fieldLabel = getFieldLabel(field.fieldType);
                  const isSelected = selectedField?.id === field.id;
                  
                  return (
                    <Card
                      key={field.id}
                      className="border rounded-lg shadow-sm"
                    >
                      <CardContent className="p-4">
                        <h3 className="text-base font-semibold text-blue-600 mb-3">{field.fieldName || fieldLabel}</h3>
                        
                        {/* Signature - No additional configuration */}
                        {field.fieldType === 'signature' && (
                          <div className="space-y-2">
                            <Input
                              value={field.fieldName}
                              onChange={(e) => {
                                const updated = { ...field, fieldName: e.target.value };
                                setFieldMappings(
                                  fieldMappings.map((f) => (f.id === field.id ? updated : f))
                                );
                                if (isSelected) setSelectedField(updated);
                              }}
                              placeholder="Field name"
                              className="h-9 border-gray-300"
                            />
                            <Input
                              value="No additional configuration"
                              disabled
                              className="h-9 bg-gray-50 text-gray-400"
                            />
                          </div>
                        )}
                        
                        {/* Checkbox Group */}
                        {field.fieldType === 'checkbox' && (
                          <div className="space-y-3">
                            <Input
                              value={field.fieldName}
                              onChange={(e) => {
                                const updated = { ...field, fieldName: e.target.value };
                                setFieldMappings(
                                  fieldMappings.map((f) => (f.id === field.id ? updated : f))
                                );
                                if (isSelected) setSelectedField(updated);
                              }}
                              placeholder="Field name"
                              className="h-9 border-gray-300"
                            />
                            <div className="space-y-2">
                              {(field.options || []).map((option, index) => (
                                <Input
                                  key={index}
                                  value={option}
                                  onChange={(e) => {
                                    const updatedOptions = [...(field.options || [])];
                                    updatedOptions[index] = e.target.value;
                                    const updated = { ...field, options: updatedOptions };
                                    setFieldMappings(
                                      fieldMappings.map((f) => (f.id === field.id ? updated : f))
                                    );
                                    if (isSelected) setSelectedField(updated);
                                  }}
                                  className="h-9 border-gray-300"
                                />
                              ))}
                            </div>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                const updatedOptions = [...(field.options || []), ''];
                                const updated = { ...field, options: updatedOptions };
                                setFieldMappings(
                                  fieldMappings.map((f) => (f.id === field.id ? updated : f))
                                );
                                if (isSelected) setSelectedField(updated);
                              }}
                              className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Field
                            </Button>
                          </div>
                        )}
                        
                        {/* Radio Button Group */}
                        {field.fieldType === 'radio' && (
                          <div className="space-y-3">
                            <Input
                              value={field.fieldName}
                              onChange={(e) => {
                                const updated = { ...field, fieldName: e.target.value };
                                setFieldMappings(
                                  fieldMappings.map((f) => (f.id === field.id ? updated : f))
                                );
                                if (isSelected) setSelectedField(updated);
                              }}
                              placeholder="Field name"
                              className="h-9 border-gray-300"
                            />
                            <div className="space-y-2">
                              {(field.options || []).map((option, index) => (
                                <Input
                                  key={index}
                                  value={option}
                                  onChange={(e) => {
                                    const updatedOptions = [...(field.options || [])];
                                    updatedOptions[index] = e.target.value;
                                    const updated = { ...field, options: updatedOptions };
                                    setFieldMappings(
                                      fieldMappings.map((f) => (f.id === field.id ? updated : f))
                                    );
                                    if (isSelected) setSelectedField(updated);
                                  }}
                                  className="h-9 border-gray-300"
                                />
                              ))}
                            </div>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                const updatedOptions = [...(field.options || []), ''];
                                const updated = { ...field, options: updatedOptions };
                                setFieldMappings(
                                  fieldMappings.map((f) => (f.id === field.id ? updated : f))
                                );
                                if (isSelected) setSelectedField(updated);
                              }}
                              className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Field
                            </Button>
                          </div>
                        )}
                        
                        {/* Select Group */}
                        {field.fieldType === 'select' && (
                          <div className="space-y-3">
                            <Input
                              value={field.fieldName}
                              onChange={(e) => {
                                const updated = { ...field, fieldName: e.target.value };
                                setFieldMappings(
                                  fieldMappings.map((f) => (f.id === field.id ? updated : f))
                                );
                                if (isSelected) setSelectedField(updated);
                              }}
                              placeholder="Field name"
                              className="h-9 border-gray-300"
                            />
                            {/* Options List */}
                            {(field.options || []).length > 0 && (
                              <div className="space-y-2">
                                {(field.options || []).map((option, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Input
                                      value={option}
                                      onChange={(e) => {
                                        const updatedOptions = [...(field.options || [])];
                                        updatedOptions[index] = e.target.value;
                                        const updated = { ...field, options: updatedOptions };
                                        setFieldMappings(
                                          fieldMappings.map((f) => (f.id === field.id ? updated : f))
                                        );
                                        if (isSelected) setSelectedField(updated);
                                      }}
                                      className="h-9 border-gray-300 flex-1"
                                    />
                                    <button
                                      onClick={() => {
                                        const updatedOptions = (field.options || []).filter((_, i) => i !== index);
                                        const updated = { ...field, options: updatedOptions, defaultOption: field.defaultOption === option ? undefined : field.defaultOption };
                                        setFieldMappings(
                                          fieldMappings.map((f) => (f.id === field.id ? updated : f))
                                        );
                                        if (isSelected) setSelectedField(updated);
                                      }}
                                      className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                                      title="Remove option"
                                    >
                                      <X className="h-3 w-3 text-white" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Add Option Input and Button */}
                            <div className="flex gap-2">
                              <Input
                                value={newOptionInput[field.id] || ''}
                                onChange={(e) => {
                                  setNewOptionInput({ ...newOptionInput, [field.id]: e.target.value });
                                }}
                                placeholder="Add option"
                                className="h-9 border-gray-300 flex-1"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const optionValue = newOptionInput[field.id]?.trim();
                                    if (optionValue) {
                                      const updatedOptions = [...(field.options || []), optionValue];
                                      const updated = { ...field, options: updatedOptions };
                                      setFieldMappings(
                                        fieldMappings.map((f) => (f.id === field.id ? updated : f))
                                      );
                                      if (isSelected) setSelectedField(updated);
                                      setNewOptionInput({ ...newOptionInput, [field.id]: '' });
                                    }
                                  }
                                }}
                              />
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  const optionValue = newOptionInput[field.id]?.trim();
                                  if (optionValue) {
                                    const updatedOptions = [...(field.options || []), optionValue];
                                    const updated = { ...field, options: updatedOptions };
                                    setFieldMappings(
                                      fieldMappings.map((f) => (f.id === field.id ? updated : f))
                                    );
                                    if (isSelected) setSelectedField(updated);
                                    setNewOptionInput({ ...newOptionInput, [field.id]: '' });
                                  }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {/* FullName, Email, Date, Custom Text - Simple field name */}
                        {['fullname', 'email', 'date', 'customText'].includes(field.fieldType) && (
                          <div className="space-y-2">
                            <Input
                              value={field.fieldName}
                              onChange={(e) => {
                                const updated = { ...field, fieldName: e.target.value };
                                setFieldMappings(
                                  fieldMappings.map((f) => (f.id === field.id ? updated : f))
                                );
                                if (isSelected) setSelectedField(updated);
                              }}
                              placeholder="Field name"
                              className="h-9 border-gray-300"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
        </div>
      )}

      {/* Save Document Name Modal */}
      <Dialog open={isSaveNameModalOpen} onOpenChange={setIsSaveNameModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save E-Signature Document</DialogTitle>
            <DialogDescription>
              Enter a name for this e-signature document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="documentName">Document Name</Label>
              <Input
                id="documentName"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Enter document name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveWithName();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsSaveNameModalOpen(false);
                setDocumentName('');
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveWithName}
              disabled={saving || !documentName.trim()}
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Share this document with internal staff or external users for signing.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="internal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="internal">Internal Staff</TabsTrigger>
              <TabsTrigger value="external">External Users</TabsTrigger>
            </TabsList>
            <TabsContent value="internal" className="space-y-4">
              <div className="space-y-2">
                <Label>Select Staff Members</Label>
                <ScrollArea className="h-64 border rounded-md p-4">
                  {staffList.map((staff) => (
                    <div key={staff.id} className="flex items-center space-x-2 py-2">
                      <input
                        type="checkbox"
                        id={`staff-${staff.id}`}
                        checked={selectedInternalUsers.includes(staff.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInternalUsers([...selectedInternalUsers, staff.id]);
                          } else {
                            setSelectedInternalUsers(selectedInternalUsers.filter(id => id !== staff.id));
                          }
                        }}
                      />
                      <Label htmlFor={`staff-${staff.id}`}>
                        {staff.fullname || staff.username} ({staff.email})
                      </Label>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </TabsContent>
            <TabsContent value="external" className="space-y-4">
              <div className="space-y-2">
                <Label>External User Emails</Label>
                {externalEmails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => {
                        const updated = [...externalEmails];
                        updated[index] = e.target.value;
                        setExternalEmails(updated);
                      }}
                    />
                    {externalEmails.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setExternalEmails(externalEmails.filter((_, i) => i !== index));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExternalEmails([...externalEmails, ''])}
                >
                  Add Email
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare} disabled={sharing}>
              {sharing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
