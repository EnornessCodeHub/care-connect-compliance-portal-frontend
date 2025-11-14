import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Loader2,
  PenTool,
  Save,
  FileText,
  Calendar,
  Type,
  CheckSquare,
  Mail,
} from 'lucide-react';
import eSignatureService, { ESignatureDocument, FieldMapping } from '@/services/eSignatureService';
import { useUser } from '@/contexts/UserContext';
import { convertPDFToImages } from '@/utils/pdfConverter';

export default function FormSign() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  
  const [document, setDocument] = useState<ESignatureDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [pdfPageDimensions, setPdfPageDimensions] = useState<Array<{ width: number; height: number }>>([]);
  const pdfContainerRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set()); // Track which images have loaded
  
  // Request cancellation for preventing duplicate API calls
  const abortControllerRef = useRef<AbortController | null>(null);
  const isSubmittingRef = useRef(false); // Track if a submit is in progress
  
  // Field values state
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  
  // Field edit dialog state
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldMapping | null>(null);
  
  // Signature dialog state
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Confirmation dialog state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadDocument();
    }
    
    // Cleanup: Cancel any pending requests when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [id]);

  // Reset imagesLoaded when document or preview images change
  useEffect(() => {
    setImagesLoaded(new Set());
    
    // Check if images are already loaded (cached images)
    // This handles the case where onLoad might not fire for cached images
    if (previewImages.length > 0) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        previewImages.forEach((_, index) => {
          const pageNumber = index + 1;
          const container = pdfContainerRefs.current.get(pageNumber);
          if (container) {
            const imgElement = container.querySelector('img') as HTMLImageElement;
            if (imgElement && imgElement.complete && imgElement.naturalWidth > 0) {
              // Image is already loaded
              setImagesLoaded(prev => new Set(prev).add(pageNumber));
            }
          }
        });
        // Force re-render after checking all images
        setFieldValues(prev => ({ ...prev }));
      }, 100);
    }
  }, [document?.id, previewImages.length]);

  // Force re-render when window resizes to recalculate field positions
  useEffect(() => {
    const handleResize = () => {
      // Force component to re-render by updating a dummy state
      // This will recalculate all field positions with new container dimensions
      if (document && previewImages.length > 0) {
        // Trigger a re-render by updating field values (using a no-op update)
        setFieldValues(prev => ({ ...prev }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [document, previewImages.length]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const response = await eSignatureService.getDocumentById(id!);
      
      if (response.success && response.data) {
        setDocument(response.data);
        
        console.log('📄 Document loaded:', {
          id: response.data.id,
          fileName: response.data.fileName,
          fieldMappingsCount: response.data.fieldMappings?.length || 0,
          fieldMappings: response.data.fieldMappings,
          pdfPageDimensions: response.data.pdfPageDimensions
        });
        
        // Set PDF metadata
        // Parse pdfPageDimensions if it comes as a JSON string from backend
        let parsedDimensions = response.data.pdfPageDimensions;
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
        } else {
          // Default page dimensions if not available
          setPdfPageDimensions([{ width: 612, height: 792 }]);
        }
        
        // Convert PDF to images
        if (response.data.fileUrl) {
          const images = await convertPDFToImages(response.data.fileUrl, { scale: 2 });
          setPreviewImages(images.map(img => img.imageData));
        }
        
        // Initialize field values with defaults
        const initialValues: Record<string, any> = {};
        response.data.fieldMappings?.forEach(field => {
          console.log('🔵 Field:', {
            id: field.id,
            fieldType: field.fieldType,
            fieldName: field.fieldName,
            assignedTo: field.assignedTo,
            pageNumber: field.pageNumber,
            x: field.x,
            y: field.y
          });
          
          if (field.fieldType === 'checkbox') {
            initialValues[field.id] = false;
          } else if (field.fieldType === 'radio' || field.fieldType === 'select') {
            initialValues[field.id] = field.defaultOption || '';
          } else {
            initialValues[field.id] = '';
          }
        });
        setFieldValues(initialValues);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load document',
      });
      navigate('/forms');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFieldValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleFieldClick = (field: FieldMapping) => {
    if (field.fieldType === 'signature') {
      setSelectedField(field);
      setIsSignatureOpen(true);
    } else {
      setSelectedField(field);
      setIsFieldDialogOpen(true);
    }
  };

  // Helper function to get canvas coordinates accounting for CSS scaling
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Get client coordinates (works for both mouse and touch)
    const clientX = 'touches' in e ? e.touches[0]?.clientX || e.changedTouches[0]?.clientX || 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY || e.changedTouches[0]?.clientY || 0 : e.clientY;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent default touch behavior
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const { x, y } = getCanvasCoordinates(e);
      
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#000';
      ctx.beginPath();
      ctx.moveTo(x, y);
      // Draw a point at the click location immediately
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent default touch behavior
    if (!isDrawing) return;
    
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const { x, y } = getCanvasCoordinates(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas || !selectedField) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    handleFieldChange(selectedField.id, dataUrl);
    setIsSignatureOpen(false);
    setSelectedField(null);
    
    toast({
      title: 'Signature Saved',
      description: 'Your signature has been added to the document',
    });
  };

  const saveFieldValue = () => {
    setIsFieldDialogOpen(false);
    setSelectedField(null);
  };

  const handleSubmit = () => {
    // Validate required fields
    const missingFields = document?.fieldMappings?.filter(field => {
      if (field.required) {
        const value = fieldValues[field.id];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return true;
        }
      }
      return false;
    });

    if (missingFields && missingFields.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Missing Required Fields',
        description: `Please fill in all required fields before submitting`,
      });
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!document) return;
    
    // Prevent duplicate submissions
    if (isSubmittingRef.current || saving) {
      console.log('⚠️ Submit already in progress, ignoring duplicate request');
      return;
    }

    try {
      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();
      isSubmittingRef.current = true;
      setSaving(true);
      
      const response = await eSignatureService.submitSignedDocument(document.id, fieldValues);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Document signed successfully. The signed PDF has been saved.',
        });
        
        setIsConfirmOpen(false);
        navigate('/forms');
      } else {
        throw new Error(response.message || 'Failed to save document');
      }
    } catch (error: any) {
      // Ignore abort errors
      if (error.name === 'AbortError' || abortControllerRef.current?.signal.aborted) {
        console.log('Request was cancelled');
        return;
      }
      
      console.error('Submit error:', error);
      
      // Check if it's a rate limit error
      if (error.response?.status === 429 || error.message?.toLowerCase().includes('too many requests')) {
        toast({
          variant: 'destructive',
          title: 'Too Many Requests',
          description: 'Please wait a moment before trying again.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to save document',
        });
      }
    } finally {
      setSaving(false);
      isSubmittingRef.current = false;
      abortControllerRef.current = null;
    }
  };

  // Convert PDF coordinates to viewport coordinates for rendering
  const convertPdfToViewportCoordinates = (field: FieldMapping, pageNumber: number) => {
    const pageIndex = pageNumber - 1;
    const container = pdfContainerRefs.current.get(pageNumber);
    if (!container) {
      console.warn(`⚠️ Container not found for page ${pageNumber}`);
      return { x: 0, y: 0, width: 200, height: 30 };
    }
    
    // CRITICAL: Use actual image element dimensions, not container dimensions
    // This matches how FormBuilder calculates coordinates
    const imgElement = container.querySelector('img');
    if (!imgElement) {
      console.warn(`⚠️ Image element not found in container for page ${pageNumber}`);
      return { x: 0, y: 0, width: 200, height: 30 };
    }
    
    // Use getBoundingClientRect() to match FormBuilder's drop handler coordinate calculation
    // This ensures consistency between FormBuilder (where fields are placed) and FormSign (where fields are displayed)
    const imgRect = imgElement.getBoundingClientRect();
    const viewportWidth = imgRect.width;
    const viewportHeight = imgRect.height;
    
    // Wait for image to have valid dimensions
    if (viewportWidth === 0 || viewportHeight === 0) {
      console.warn(`⚠️ Image has zero dimensions for page ${pageNumber}`);
      return { x: 0, y: 0, width: 200, height: 30 };
    }
    
    // Get page dimensions - ensure it's a valid object with width and height
    let pageDims = pdfPageDimensions[pageIndex];
    if (!pageDims || typeof pageDims !== 'object' || !pageDims.width || !pageDims.height) {
      console.warn(`⚠️ Invalid page dimensions for page ${pageNumber}, using defaults`);
      pageDims = { width: 612, height: 792 };
    }
    
    // Ensure width and height are valid numbers
    const pageWidth = parseFloat(String(pageDims.width)) || 612;
    const pageHeight = parseFloat(String(pageDims.height)) || 792;
    
    // Calculate separate scales for X and Y based on actual image dimensions
    // This must match the conversion used in FormBuilder
    const scaleX = viewportWidth / pageWidth;
    const scaleY = viewportHeight / pageHeight;
    
    const coords = {
      x: parseFloat(String(field.x)) * scaleX,
      y: parseFloat(String(field.y)) * scaleY,
      width: parseFloat(String(field.width || 200)) * scaleX,
      height: parseFloat(String(field.height || 30)) * scaleY,
    };
    
    if (isNaN(coords.x) || isNaN(coords.y) || isNaN(scaleX) || isNaN(scaleY)) {
      console.warn(`⚠️ Invalid coordinates for field ${field.id}:`, {
        fieldX: field.x,
        fieldY: field.y,
        scaleX,
        scaleY,
        pageWidth,
        pageHeight,
        pageDims,
        viewportWidth,
        viewportHeight,
        pageIndex,
        pdfPageDimensionsLength: pdfPageDimensions.length
      });
    }
    
    return coords;
  };

  const setPdfContainerRef = (pageNumber: number) => (ref: HTMLDivElement | null) => {
    if (ref) {
      pdfContainerRefs.current.set(pageNumber, ref);
    } else {
      pdfContainerRefs.current.delete(pageNumber);
    }
  };

  const getFieldIcon = (fieldType: string) => {
    switch (fieldType) {
      case 'fullname':
      case 'customText':
        return <Type className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'date':
        return <Calendar className="h-4 w-4" />;
      case 'checkbox':
        return <CheckSquare className="h-4 w-4" />;
      case 'signature':
        return <PenTool className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const renderFieldInput = (field: FieldMapping) => {
    const value = fieldValues[field.id] || '';

    switch (field.fieldType) {
      case 'fullname':
      case 'email':
      case 'customText':
        return (
          <Input
            type={field.fieldType === 'email' ? 'email' : 'text'}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={`Enter ${field.fieldName}`}
            required={field.required}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
            />
            <Label>{field.fieldName}</Label>
          </div>
        );

      case 'radio':
        return (
          <RadioGroup
            value={value}
            onValueChange={(val) => handleFieldChange(field.id, val)}
          >
            {field.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(val) => handleFieldChange(field.id, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.fieldName}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={`Enter ${field.fieldName}`}
            required={field.required}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Document not found</p>
            <Button onClick={() => navigate('/forms')} className="mt-4">
              Back to Documents
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/forms')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{document.fileName}</h1>
            <p className="text-sm text-muted-foreground">
              Complete and sign this document
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving} size="lg">
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Save className="h-4 w-4 mr-2" />
          Save Document
        </Button>
      </div>

      {/* Main Content - All Pages Stacked Vertically with Smooth Scrolling */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {previewImages.map((image, pageIndex) => {
              const pageNumber = pageIndex + 1;
              const pageFields = document.fieldMappings?.filter(
                (field) => (field.pageNumber || 1) === pageNumber
              ) || [];

              if (pageFields.length > 0) {
                console.log(`📄 Page ${pageNumber} fields:`, pageFields.map(f => ({
                  id: f.id,
                  fieldName: f.fieldName,
                  assignedTo: f.assignedTo,
                  x: f.x,
                  y: f.y
                })));
              }

              return (
                <div key={pageNumber} className="relative">
                  <div
                    ref={setPdfContainerRef(pageNumber)}
                    className="relative bg-white rounded-lg shadow-lg"
                    style={{ aspectRatio: '8.5/11' }}
                  >
                    {/* PDF Image */}
                    <img
                      src={image}
                      alt={`Page ${pageNumber}`}
                      className="w-full h-full rounded-lg"
                      draggable={false}
                      onLoad={() => {
                        // Mark this image as loaded
                        setImagesLoaded(prev => new Set(prev).add(pageNumber));
                        // Force re-render to recalculate field positions
                        setFieldValues(prev => ({ ...prev }));
                      }}
                    />

                    {/* Field Overlays - Only render if image has loaded */}
                    {imagesLoaded.has(pageNumber) && pageFields.map((field) => {
                      const coords = convertPdfToViewportCoordinates(field, pageNumber);
                      const value = fieldValues[field.id];
                      const isFilled = value && (typeof value !== 'string' || value.trim() !== '');
                      const isExternal = field.assignedTo === 'external';

                      return (
                        <div
                          key={field.id}
                          className="absolute cursor-pointer group z-10"
                          style={{
                            left: `${coords.x}px`,
                            top: `${coords.y}px`,
                            userSelect: 'none',
                          }}
                          onClick={() => handleFieldClick(field)}
                        >
                          {/* Field Box */}
                          <div
                            className={`flex items-center gap-2 px-3 py-2 bg-white border-2 rounded shadow-sm hover:shadow-md transition-shadow ${
                              isFilled
                                ? isExternal
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-green-500 bg-green-50'
                                : field.required
                                  ? isExternal
                                    ? 'border-yellow-400 bg-yellow-50'
                                    : 'border-blue-400 bg-blue-50'
                                  : isExternal
                                    ? 'border-yellow-200 bg-yellow-50'
                                    : 'border-blue-200 bg-blue-50'
                            }`}
                            style={{
                              minWidth: '120px',
                            }}
                          >
                            {/* Field Icon */}
                            <div className={isFilled ? 'text-green-600' : isExternal ? 'text-yellow-600' : 'text-blue-600'}>
                              {getFieldIcon(field.fieldType)}
                            </div>

                            {/* Field Label */}
                            <span className={`text-sm font-medium flex-1 ${isFilled ? 'text-green-700' : isExternal ? 'text-yellow-700' : 'text-blue-600'}`}>
                              {field.fieldName}
                              {field.required && !isFilled && <span className="text-red-500 ml-1">*</span>}
                            </span>

                            {/* Filled Indicator */}
                            {isFilled && (
                              <CheckSquare className="h-4 w-4 text-green-600" />
                            )}
                          </div>

                          {/* Tooltip */}
                          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-20">
                            <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Click to {isFilled ? 'edit' : 'fill'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Page Number Indicator */}
                  <div className="text-center mt-2 text-sm text-muted-foreground">
                    Page {pageNumber} of {previewImages.length}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Field Edit Dialog */}
      <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedField?.fieldName}
              {selectedField?.required && <span className="text-red-500 ml-1">*</span>}
            </DialogTitle>
            <DialogDescription>
              Enter the value for this field
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedField && renderFieldInput(selectedField)}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFieldDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveFieldValue}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Signature Dialog */}
      <Dialog open={isSignatureOpen} onOpenChange={setIsSignatureOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Sign Here</DialogTitle>
            <DialogDescription>
              Draw your signature using your mouse or touchpad
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <canvas
              ref={signatureCanvasRef}
              width={600}
              height={200}
              className="border rounded-lg cursor-crosshair bg-white w-full touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={clearSignature}>
              Clear
            </Button>
            <Button variant="outline" onClick={() => setIsSignatureOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSignature}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to make changes to this file? Once saved, the changes cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Yes, Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
