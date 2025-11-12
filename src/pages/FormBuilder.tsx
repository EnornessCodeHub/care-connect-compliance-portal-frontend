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
  const [pdfPageDimensions, setPdfPageDimensions] = useState<Array<{ width: number; height: number }>>([]);
  const [pdfDpi, setPdfDpi] = useState<number>(72); // Default PDF DPI
  
  // Drag & drop state
  const [draggingField, setDraggingField] = useState<FieldMapping | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [isPlacingField, setIsPlacingField] = useState<FieldType | null>(null); // Field type being placed
  const [draggingFieldType, setDraggingFieldType] = useState<FieldType | null>(null); // Field type being dragged from sidebar
  
  // State for field configuration
  const [newOptionInput, setNewOptionInput] = useState<{ [fieldId: string]: string }>({});

  // Save document name modal
  const [isSaveNameModalOpen, setIsSaveNameModalOpen] = useState(false);
  const [documentName, setDocumentName] = useState('');

  // Save as Template modal
  const [isSaveAsTemplateModalOpen, setIsSaveAsTemplateModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [savingAsTemplate, setSavingAsTemplate] = useState(false);

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
        
        // Load preview images if available (preferred for editor)
        if (template.previewImages && template.previewImages.length > 0) {
          setPreviewImages(template.previewImages);
          setNumPages(template.previewImages.length);
          setPdfLoading(false);
        } else if (template.fileUrl) {
          // Fallback: If no preview images, use PDF URL
          setPdfUrl(template.fileUrl);
          setPdfLoading(false);
          toast({
            variant: 'default',
            title: 'Preview Images Not Available',
            description: 'Loading PDF directly. Preview images will be generated on the server.',
          });
        }
        
        // Load PDF metadata for coordinate conversion
        if (template.pdfDpi) {
          setPdfDpi(template.pdfDpi);
        } else {
          setPdfDpi(72); // Default DPI
        }
        if (template.pdfPageDimensions && template.pdfPageDimensions.length > 0) {
          setPdfPageDimensions(template.pdfPageDimensions);
          setNumPages(template.pdfPageDimensions.length);
        } else {
          // Default page dimensions if not available
          setPdfPageDimensions([{ width: 612, height: 792 }]);
          if (!template.previewImages || template.previewImages.length === 0) {
            setNumPages(1);
          }
        }
        
        // Store PDF URL
        if (template.fileUrl) {
          setPdfUrl(template.fileUrl);
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
    console.log('Preview images:', documentData.previewImages?.length || 0);
    console.log('File URL:', documentData.fileUrl);
    
    setESignatureDocument(documentData);
    setFieldMappings(documentData.fieldMappings || []);
    
    // CRITICAL: Prioritize preview images for drag and drop functionality
    // Preview images are required for field placement via drag and drop
    if (documentData.previewImages && documentData.previewImages.length > 0) {
      console.log('Using preview images for field placement:', documentData.previewImages.length);
      setPreviewImages(documentData.previewImages);
      setNumPages(documentData.previewImages.length);
      setPdfLoading(false);
      
      // Also store PDF URL for download/viewing, but don't use it for display
      if (documentData.fileUrl) {
        setPdfUrl(documentData.fileUrl);
      }
    } else if (documentData.fileUrl) {
      // Fallback: If no preview images, show PDF but warn user
      console.warn('No preview images available, showing PDF (drag and drop may not work)');
      toast({
        variant: 'default',
        title: 'Preview Images Not Available',
        description: 'PDF is shown but field drag and drop requires preview images. Retrying in 3 seconds...',
      });
      
      // Try to load PDF via download endpoint
      if (documentData.id) {
        try {
          console.log('Loading PDF via download endpoint as fallback...');
          setPdfLoading(true);
          const blob = await eSignatureService.downloadDocument(documentData.id);
          const blobUrl = URL.createObjectURL(blob);
          console.log('PDF loaded as blob URL:', blobUrl);
          
          // Clean up old blob URL if exists
          if (pdfBlobUrlRef.current) {
            URL.revokeObjectURL(pdfBlobUrlRef.current);
          }
          pdfBlobUrlRef.current = blobUrl;
          setPdfUrl(blobUrl);
          setPdfLoading(false);
          
          // Retry loading document after 3 seconds to check for preview images
          if (documentData.id) {
            setTimeout(async () => {
              try {
                console.log('Retrying to load preview images...');
                const retryResponse = await eSignatureService.getDocumentById(documentData.id);
                if (retryResponse.success && retryResponse.data?.previewImages && retryResponse.data.previewImages.length > 0) {
                  console.log('Preview images now available:', retryResponse.data.previewImages.length);
                  setPreviewImages(retryResponse.data.previewImages);
                  setNumPages(retryResponse.data.previewImages.length);
                  toast({
                    title: 'Success',
                    description: 'Preview images loaded! You can now use drag and drop.',
                  });
                }
              } catch (retryError) {
                console.warn('Retry failed:', retryError);
              }
            }, 3000);
          }
        } catch (downloadError) {
          console.warn('Download endpoint failed, using direct fileUrl:', downloadError);
          setPdfUrl(documentData.fileUrl);
          setPdfLoading(false);
        }
      } else {
        setPdfUrl(documentData.fileUrl);
        setPdfLoading(false);
      }
    } else {
      console.warn('No preview images and no fileUrl available');
      setPdfLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'PDF file URL is not available',
      });
    }
    
    // Load PDF metadata for coordinate conversion
    if (documentData.pdfDpi) {
      setPdfDpi(documentData.pdfDpi);
    } else {
      setPdfDpi(72); // Default DPI
    }
    if (documentData.pdfPageDimensions && documentData.pdfPageDimensions.length > 0) {
      setPdfPageDimensions(documentData.pdfPageDimensions);
      setNumPages(documentData.pdfPageDimensions.length);
    } else {
      // Default page dimensions if not available
      setPdfPageDimensions([{ width: 612, height: 792 }]);
      if (!documentData.previewImages || documentData.previewImages.length === 0) {
        setNumPages(1);
      }
    }
    
    // Store PDF URL for download/viewing (if not already set)
    if (documentData.fileUrl && !pdfUrl) {
      setPdfUrl(documentData.fileUrl);
    }
    if (documentData.internalUsers) {
      setSelectedInternalUsers(documentData.internalUsers.map(u => u.id));
    }
    if (documentData.externalUsers) {
      setExternalEmails(documentData.externalUsers.map(u => u.email));
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
    
    if (!draggingFieldType || !previewImages.length) {
      setDraggingFieldType(null);
      return;
    }
    
    const container = e.currentTarget;
    const img = container.querySelector('img');
    if (!img) {
      setDraggingFieldType(null);
      return;
    }
    
    const imgRect = img.getBoundingClientRect();
    
    // Calculate drop position relative to image
    const dropX = e.clientX - imgRect.left;
    const dropY = e.clientY - imgRect.top;
    
    // Get image dimensions
    const viewportWidth = imgRect.width;
    const viewportHeight = imgRect.height;
    
    // Convert to PDF DPI coordinates
    const pageDim = pdfPageDimensions[pageIndex] || { width: 612, height: 792 };
    const pdfCoords = convertViewportToPdfCoordinates(
      dropX,
      dropY,
      viewportWidth,
      viewportHeight,
      pageIndex
    );
    
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
  };

  // Handle click on preview image (kept for backward compatibility, but not used for field placement)
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Click is now only used for selecting fields, not placing them
    // Field placement is done via drag and drop
  };

  // Handle field drag start
  const handleFieldDragStart = (e: React.MouseEvent, field: FieldMapping) => {
    e.stopPropagation();
    setDraggingField(field);
    const fieldElement = e.currentTarget as HTMLElement;
    const rect = fieldElement.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Handle field drag
  const handleFieldDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingField || !dragOffset) return;
    
    const container = e.currentTarget;
    const img = container.querySelector('img');
    if (!img) return;
    
    const imgRect = img.getBoundingClientRect();
    const clickX = e.clientX - imgRect.left - dragOffset.x;
    const clickY = e.clientY - imgRect.top - dragOffset.y;
    
    // Get image dimensions
    const viewportWidth = imgRect.width;
    const viewportHeight = imgRect.height;
    
    // Convert to PDF DPI coordinates
    const pageDim = pdfPageDimensions[draggingField.pageNumber - 1] || { width: 612, height: 792 };
    const pdfCoords = convertViewportToPdfCoordinates(
      clickX,
      clickY,
      viewportWidth,
      viewportHeight,
      draggingField.pageNumber - 1
    );
    
    // Update field position
    const updatedField = {
      ...draggingField,
      x: Math.max(0, Math.min(pageDim.width - draggingField.width, pdfCoords.x)),
      y: Math.max(0, Math.min(pageDim.height - draggingField.height, pdfCoords.y)),
    };
    
    setFieldMappings(
      fieldMappings.map((f) => (f.id === draggingField.id ? updatedField : f))
    );
    setSelectedField(updatedField);
  };

  // Handle drag end
  const handleFieldDragEnd = () => {
    setDraggingField(null);
    setDragOffset(null);
  };

  const handleFieldClick = (field: FieldMapping) => {
    setSelectedField(field);
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
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Document saved successfully',
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

  const handleSaveAsTemplate = async () => {
    if (!documentId || !templateName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a template name',
      });
      return;
    }

    try {
      setSavingAsTemplate(true);
      const response = await eSignatureService.saveDocumentAsTemplate(documentId, templateName.trim());
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Document saved as template successfully',
        });
        setIsSaveAsTemplateModalOpen(false);
        setTemplateName('');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save as template',
      });
    } finally {
      setSavingAsTemplate(false);
    }
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
              onClick={() => navigate('/forms')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documents
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
              onClick={() => navigate('/forms')}
              className="justify-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Document
            </Button>
          </div>
          <div className="flex gap-2">
            {!editTemplate && documentId && (
              <Button
                variant="outline"
                onClick={() => {
                  setTemplateName(eSignatureDocument?.fileName || '');
                  setIsSaveAsTemplateModalOpen(true);
                }}
                disabled={saving || !fieldMappings || fieldMappings.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                Save as Template
              </Button>
            )}
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
                        ref={currentPage === pageNumber ? setPdfContainerRef : null}
                        className={`relative bg-white shadow-2xl mx-auto ${
                          draggingFieldType ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                        }`}
                        style={{ maxWidth: '100%' }}
                        onMouseMove={handleFieldDrag}
                        onMouseUp={handleFieldDragEnd}
                        onMouseLeave={handleFieldDragEnd}
                        onClick={handleImageClick}
                        onDragOver={handleImageDragOver}
                        onDrop={(e) => handleImageDrop(e, index)}
                      >
                        <img
                          src={preview}
                          alt={`Page ${currentPage}`}
                          className="w-full h-auto"
                          style={{ display: 'block' }}
                        />
                        {draggingFieldType && (
                          <div className="absolute inset-0 flex items-center justify-center bg-blue-100/50 pointer-events-none z-0 border-2 border-blue-400 border-dashed">
                            <div className="bg-blue-500/20 border-2 border-blue-500 border-dashed p-4 rounded">
                              <p className="text-blue-700 font-semibold">Drop {draggingFieldType.label} here</p>
                            </div>
                          </div>
                        )}
                        {/* Overlay fields - convert PDF DPI coordinates to viewport */}
                        {fieldMappings
                          .filter((field) => field.pageNumber === currentPage)
                          .map((field) => {
                            const pageDim = pdfPageDimensions[currentPage - 1] || { width: 612, height: 792 };
                            const pageContainer = currentPage === pageNumber ? pdfContainerRef : null;
                            const imgElement = pageContainer?.querySelector('img');
                            const viewportWidth = imgElement?.clientWidth || 612;
                            const viewportHeight = imgElement?.clientHeight || 792;
                            const coords = convertPdfToViewportCoordinates(
                              field.x,
                              field.y,
                              field.width,
                              field.height,
                              viewportWidth,
                              viewportHeight,
                              currentPage - 1
                            );
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFieldClick(field);
                                    setPageNumber(currentPage); // Switch to this page when clicking field
                                  }}
                                  className={`flex items-center gap-2 px-3 py-2 bg-white border-2 rounded cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${
                                    draggingField?.id === field.id
                                      ? 'border-blue-400 shadow-lg'
                                      : 'border-blue-200'
                                  } ${
                                    selectedField?.id === field.id
                                      ? 'border-blue-400 ring-2 ring-blue-200'
                                      : ''
                                  }`}
                                  style={{
                                    minWidth: '120px',
                                  }}
                                >
                                  {/* Field Icon */}
                                  <div className="text-blue-600 flex-shrink-0">
                                    {getFieldIcon(field.fieldType)}
                                  </div>
                                  
                                  {/* Field Label */}
                                  <span className="text-blue-600 text-sm font-medium flex-1">
                                    {field.fieldName || fieldLabel}
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

      {/* Save as Template Modal */}
      <Dialog open={isSaveAsTemplateModalOpen} onOpenChange={setIsSaveAsTemplateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Document as Template</DialogTitle>
            <DialogDescription>
              Save this document as a reusable template for future use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveAsTemplate();
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
                setIsSaveAsTemplateModalOpen(false);
                setTemplateName('');
              }}
              disabled={savingAsTemplate}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAsTemplate}
              disabled={savingAsTemplate || !templateName.trim()}
            >
              {savingAsTemplate && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
