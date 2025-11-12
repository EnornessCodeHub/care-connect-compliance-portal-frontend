import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  MoreVertical,
  Share2,
  Trash2,
  Eye,
  Loader2,
  Search,
  FileUp,
  Layers,
  X,
  PenTool,
} from 'lucide-react';
import eSignatureService, { ESignatureDocument } from '@/services/eSignatureService';
import staffService, { Staff } from '@/services/staffService';
import authService from '@/services/authService';
import { useUser } from '@/contexts/UserContext';
import { formatDistanceToNow } from 'date-fns';

export default function FormLibrary() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUser();
  const isAdmin = authService.isAdmin();
  const currentUserId = user?.id;
  
  const [documents, setDocuments] = useState<ESignatureDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialogs
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Share dialog
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<ESignatureDocument | null>(null);
  const [shareType, setShareType] = useState<'internal' | 'external'>('internal');
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedInternalUsers, setSelectedInternalUsers] = useState<number[]>([]);
  const [externalEmailsInput, setExternalEmailsInput] = useState('');
  const [internalStaffPopoverOpen, setInternalStaffPopoverOpen] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [isAdmin, currentUserId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await eSignatureService.getDocuments();
      if (response.success && response.data) {
        let filteredDocuments = response.data;
        
        // For staff users, only show documents assigned to them
        if (!isAdmin && currentUserId) {
          filteredDocuments = filteredDocuments.filter(doc => {
            // Check if document is assigned to current user
            const isAssigned = doc.internalUsers?.some(
              internalUser => internalUser.id === currentUserId
            );
            return isAssigned;
          });
        }
        
        // Sort by lastUpdatedAt descending (newest first)
        const sortedDocuments = [...filteredDocuments].sort((a, b) => {
          const dateA = new Date(a.lastUpdatedAt).getTime();
          const dateB = new Date(b.lastUpdatedAt).getTime();
          return dateB - dateA; // Descending order (newest first)
        });
        setDocuments(sortedDocuments);
      } else {
        setDocuments([]);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load documents',
      });
      setDocuments([]);
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

    try {
      setUploading(true);
      const response = await eSignatureService.uploadDocument(selectedFile);
      console.log('Upload response:', response);
      
      if (response.success && response.data) {
        toast({
          title: 'Success',
          description: 'Document uploaded successfully',
        });
        setIsUploadOpen(false);
        setSelectedFile(null);
        loadDocuments();
        // Navigate to create/edit page to configure fields
        // Pass document data in state to avoid another API call
        if (response.data.id) {
          console.log('Navigating to document:', response.data.id);
          navigate(`/forms/create?id=${response.data.id}`, { 
            replace: false,
            state: { documentData: response.data } // Pass document data to avoid reload
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.message || 'Failed to upload document',
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to upload document',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;

    try {
      setDeleting(true);
      const response = await eSignatureService.deleteDocument(pendingDeleteId);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Document deleted successfully',
        });
        setPendingDeleteId(null);
        loadDocuments();
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete document',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleView = (document: ESignatureDocument) => {
    // For signed documents, show the signed PDF; otherwise show the original PDF
    const pdfUrl = document.status === 'signed' && document.signedFileUrl 
      ? document.signedFileUrl 
      : document.fileUrl;
    
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: document.status === 'signed' 
          ? 'Signed PDF is not available' 
          : 'File URL is not available',
      });
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

  const toggleStaff = (staffId: number) => {
    // Only allow one internal staff member
    if (selectedInternalUsers.includes(staffId)) {
      setSelectedInternalUsers([]);
    } else {
      setSelectedInternalUsers([staffId]); // Replace with single selection
    }
  };

  const handleShare = (document: ESignatureDocument) => {
    setSelectedDocument(document);
    // Only get the first internal user (single assignment)
    setSelectedInternalUsers(document.internalUsers?.length > 0 ? [document.internalUsers[0].id] : []);
    // Only get the first external user (single assignment)
    setExternalEmailsInput(document.externalUsers?.length > 0 ? document.externalUsers[0].email : '');
    setShareType('internal');
    setIsShareOpen(true);
    loadStaff();
  };

  const handleShareSubmit = async () => {
    if (!selectedDocument) return;

    try {
      setSharing(true);
      // Only take the first email (single external user assignment)
      const externalEmail = externalEmailsInput.trim();
      const externalEmails = externalEmail ? [externalEmail] : [];

      const response = await eSignatureService.shareDocument(selectedDocument.id, {
        internalUserIds: shareType === 'internal' ? selectedInternalUsers : [],
        externalEmails: shareType === 'external' ? externalEmails : [],
      });
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Document shared successfully',
        });
        setIsShareOpen(false);
        setSelectedDocument(null);
        setSelectedInternalUsers([]);
        setExternalEmailsInput('');
        loadDocuments();
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

  const getSelectedStaffNames = () => {
    if (selectedInternalUsers.length === 0) return 'Select staff member';
    const selected = staffList.find(s => selectedInternalUsers.includes(s.id));
    if (selected) {
      return selected.fullname || selected.username;
    }
    return 'Select staff member';
  };

  const handleSignDocument = (document: ESignatureDocument) => {
    // Navigate to signing page/interface
    navigate(`/forms/sign/${document.id}`);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      signed: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-green-100 text-green-800 border-green-200', // Support legacy "completed" status
    };
    
    // Map "completed" to "signed" for display
    const displayStatus = status === 'completed' ? 'signed' : status;
    
    return (
      <Badge className={colors[status] || colors[displayStatus] || 'bg-gray-100 text-gray-800'}>
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
      </Badge>
    );
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">E-Sign Documents</h1>
          <p className="text-muted-foreground mt-1">
            Manage your e-signature documents and track signing progress
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button
              variant="outline"
              onClick={() => navigate('/forms/templates')}
            >
              <Layers className="h-4 w-4 mr-2" />
              Templates
            </Button>
          )}
          {isAdmin && (
            <Button onClick={() => setIsUploadOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : paginatedDocuments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents found</p>
              {isAdmin && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsUploadOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First Document
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Shared to Internal</TableHead>
                      <TableHead>Shared to External</TableHead>
                      <TableHead>Last Updated on</TableHead>
                      <TableHead>File Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">
                          {document.fileName}
                        </TableCell>
                        <TableCell>
                          {document.internalUsers && document.internalUsers.length > 0 ? (
                            <span className="text-sm text-foreground">
                              {document.internalUsers[0].email}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {document.externalUsers && document.externalUsers.length > 0 ? (
                            <span className="text-sm text-foreground">
                              {document.externalUsers[0].email}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(document.lastUpdatedAt), {
                            addSuffix: true,
                          })}
                        </TableCell>
                        <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                        <TableCell>{getStatusBadge(document.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(document)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              {!isAdmin && document.status === 'pending' && (
                                <DropdownMenuItem onClick={() => handleSignDocument(document)}>
                                  <PenTool className="h-4 w-4 mr-2" />
                                  Sign Document
                                </DropdownMenuItem>
                              )}
                              {isAdmin && (
                                <>
                                  <DropdownMenuItem onClick={() => handleShare(document)}>
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => setPendingDeleteId(document.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload PDF</DialogTitle>
            <DialogDescription>
              Upload a PDF document to create an e-signature form.
            </DialogDescription>
          </DialogHeader>
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
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Select File
                </Button>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadOpen(false);
                setSelectedFile(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
              {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!pendingDeleteId} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <p>Are you sure you want to delete this document? This action cannot be undone.</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingDeleteId(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Share this document with internal staff or external users for signing.
            </DialogDescription>
          </DialogHeader>
          
          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={shareType === 'internal' ? 'default' : 'outline'}
              className={cn(
                'flex-1',
                shareType === 'internal' && 'bg-primary text-primary-foreground'
              )}
              onClick={() => setShareType('internal')}
            >
              Internal
            </Button>
            <Button
              type="button"
              variant={shareType === 'external' ? 'default' : 'outline'}
              className={cn(
                'flex-1',
                shareType === 'external' && 'bg-primary text-primary-foreground'
              )}
              onClick={() => setShareType('external')}
            >
              External
            </Button>
          </div>

          {/* Internal Staff Selection */}
          {shareType === 'internal' && (
            <div className="space-y-2">
              <Label>Select internal staff (one staff member only)</Label>
              <Popover open={internalStaffPopoverOpen} onOpenChange={setInternalStaffPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {getSelectedStaffNames()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[400px] p-0" align="start">
                  <div className="max-h-64 overflow-auto">
                    {staffList.length === 0 ? (
                      <div className="py-8 text-center text-muted-foreground">
                        No staff members found
                      </div>
                    ) : (
                      staffList.map((staff) => {
                        const active = selectedInternalUsers.includes(staff.id);
                        return (
                          <button
                            key={staff.id}
                            type="button"
                            onClick={() => toggleStaff(staff.id)}
                            className={cn(
                              'w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors',
                              active && 'bg-primary/10'
                            )}
                          >
                            <div className="font-medium">{staff.fullname || staff.username}</div>
                            <div className="text-xs text-muted-foreground">{staff.email}</div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* External Emails Selection */}
          {shareType === 'external' && (
            <div className="space-y-2">
              <Label>External email (one email only)</Label>
              <Input
                type="text"
                placeholder="name@example.com"
                value={externalEmailsInput}
                onChange={(e) => setExternalEmailsInput(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareOpen(false)}>
              Close
            </Button>
            <Button onClick={handleShareSubmit} disabled={sharing}>
              {sharing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
