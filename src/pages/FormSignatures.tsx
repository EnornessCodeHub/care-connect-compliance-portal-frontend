import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Upload,
  FileText,
  Eye,
  Edit,
  Loader2,
  FileUp,
  X,
} from 'lucide-react';
import eSignatureService, { Template } from '@/services/eSignatureService';
import authService from '@/services/authService';
import { formatDistanceToNow } from 'date-fns';

export default function FormSignatures() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isAdmin = authService.isAdmin();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Upload dialog
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Use Template - Document name modal
  const [isUseTemplateModalOpen, setIsUseTemplateModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [creatingDocument, setCreatingDocument] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await eSignatureService.getTemplates();
      if (response.success && response.data) {
        setTemplates(response.data);
      } else {
        setTemplates([]);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load templates',
      });
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a PDF file only.',
        });
        return;
      }
      setSelectedFile(file);
      if (!templateName) {
        setTemplateName(file.name.replace('.pdf', ''));
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a PDF file only.',
        });
        return;
      }
      setSelectedFile(file);
      if (!templateName) {
        setTemplateName(file.name.replace('.pdf', ''));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a file to upload',
      });
      return;
    }

    if (!templateName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a template name',
      });
      return;
    }

    try {
      setUploading(true);
      const response = await eSignatureService.uploadTemplate(
        selectedFile,
        templateName
      );
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Template uploaded successfully',
        });
        setIsUploadOpen(false);
        setSelectedFile(null);
        setTemplateName('');
        loadTemplates();
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to upload template',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUseTemplate = (templateId: string) => {
    // Get template to pre-fill document name
    const template = templates.find(t => t.id === templateId);
    setDocumentName(template?.templateName || '');
    setSelectedTemplateId(templateId);
    setIsUseTemplateModalOpen(true);
  };

  const handleCreateDocumentFromTemplate = async () => {
    if (!selectedTemplateId || !documentName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a document name',
      });
      return;
    }

    try {
      setCreatingDocument(true);
      const response = await eSignatureService.createFromTemplate(selectedTemplateId, documentName.trim());
      if (response.success && response.data) {
        toast({
          title: 'Success',
          description: 'Document created from template successfully',
        });
        setIsUseTemplateModalOpen(false);
        setDocumentName('');
        setSelectedTemplateId(null);
        // Navigate to document list (not editor)
        navigate('/forms');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create document from template',
      });
    } finally {
      setCreatingDocument(false);
    }
  };

  const handleEditTemplate = (templateId: string) => {
    // Navigate to edit template directly (not create a new document)
    navigate(`/forms/create?templateId=${templateId}&editTemplate=true`);
  };

  const handleViewPDF = (template: Template) => {
    if (template.fileUrl) {
      window.open(template.fileUrl, '_blank');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'PDF URL is not available',
      });
    }
  };

  const paginatedTemplates = templates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(templates.length / itemsPerPage);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/forms')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Templates</h1>
            <p className="text-muted-foreground mt-1">
              Manage document templates for quick document creation
            </p>
          </div>
        </div>
        {isAdmin && (
          <Button onClick={() => setIsUploadOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Template
          </Button>
        )}
      </div>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : paginatedTemplates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No templates found</p>
              {isAdmin && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsUploadOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First Template
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Original File</TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">
                          {template.templateName}
                        </TableCell>
                        <TableCell>{template.originalFile}</TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => handleViewPDF(template)}
                          >
                            View PDF
                          </Button>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(template.createdAt), {
                            addSuffix: true,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleUseTemplate(template.id)}
                            >
                              Use Template
                            </Button>
                            {isAdmin && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditTemplate(template.id)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Template
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Upload Template Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Template Name</Label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name"
              />
            </div>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-primary" />
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <>
                  <FileUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Click to select a PDF file
                  </p>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="template-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('template-upload')?.click()}
                  >
                    Select File
                  </Button>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadOpen(false);
                setSelectedFile(null);
                setTemplateName('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile || !templateName.trim() || uploading}>
              {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Use Template - Document Name Modal */}
      <Dialog open={isUseTemplateModalOpen} onOpenChange={setIsUseTemplateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Document from Template</DialogTitle>
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
                    handleCreateDocumentFromTemplate();
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
                setIsUseTemplateModalOpen(false);
                setDocumentName('');
                setSelectedTemplateId(null);
              }}
              disabled={creatingDocument}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateDocumentFromTemplate}
              disabled={creatingDocument || !documentName.trim()}
            >
              {creatingDocument && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
