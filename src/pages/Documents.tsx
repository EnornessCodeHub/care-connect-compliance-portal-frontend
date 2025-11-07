import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FolderPlus, Upload, UploadCloud, Share2, ArrowLeft, Download, MoreVertical, Loader2, X, Pencil, Trash2, Eye, File as FileIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import staffService, { Staff } from "@/services/staffService";
import documentService, { DocumentFolder, DocumentFile } from "@/services/documentService";
import { useToast } from "@/hooks/use-toast";
import authService from '@/services/authService';

export default function Documents() {
  const { toast } = useToast();
  const isAdmin = authService.isAdmin();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [currentFolder, setCurrentFolder] = useState<DocumentFolder | null>(null);

  // dialogs
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<number>(0); // bytes
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareTargetId, setShareTargetId] = useState<string | null>(null);
  const [shareTargetType, setShareTargetType] = useState<"folder" | "file">("folder");
  const [shareTab, setShareTab] = useState<"internal" | "external">("internal");
  const [internal, setInternal] = useState<number[]>([]);
  const [external, setExternal] = useState<string[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [sharing, setSharing] = useState(false);

  // folder/file actions
  const [folderMenuOpenId, setFolderMenuOpenId] = useState<string | null>(null);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const [renameTargetType, setRenameTargetType] = useState<"folder" | "file">("folder");
  const [renaming, setRenaming] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteType, setPendingDeleteType] = useState<"folder" | "file">("folder");
  const [deleting, setDeleting] = useState(false);
  

  const filteredFolders = Array.isArray(folders) ? folders.filter(f => f.name.toLowerCase().includes(query.toLowerCase())) : [];
  const filteredFiles = Array.isArray(files) ? files.filter(f => f.name.toLowerCase().includes(query.toLowerCase())) : [];

  // Determine if we're in a subfolder (subfolders cannot have further subfolders)
  const isInSubfolder = currentFolder ? (currentFolder.parentId !== null) : false;
  const canCreateSubfolder = !isInSubfolder; // Can only create subfolders if we're not already in a subfolder

  // Load folders and files
  const loadData = async () => {
    try {
      setLoading(true);
      const parentId = currentFolderId || null;
      
      // Load folders (subfolders if we're inside a folder, root folders if not)
      const foldersResponse = await documentService.getFolders(parentId);
      if (foldersResponse.success && Array.isArray(foldersResponse.data)) {
        setFolders(foldersResponse.data);
      } else {
        setFolders([]);
      }

      // Note: currentFolder should be set when clicking on a folder
      // If it's not set, we'll keep it as is (it will be set when user clicks)

      // Load files if we're in a folder
      if (currentFolderId) {
        try {
          const filesResponse = await documentService.getFiles(currentFolderId);
          console.log('Files response:', filesResponse);
          if (filesResponse.success && Array.isArray(filesResponse.data)) {
            console.log('Setting files:', filesResponse.data);
            setFiles(filesResponse.data);
          } else {
            console.log('No files data or invalid response');
            setFiles([]);
          }
        } catch (fileError: any) {
          console.error('Error loading files:', fileError);
          setFiles([]);
          // Don't show toast for file loading errors during normal load, only show for critical errors
          if (fileError.response?.status !== 404) {
            toast({
              variant: "destructive",
              title: "Error",
              description: fileError.message || "Failed to load files"
            });
          }
        }
      } else {
        setFiles([]);
      }
    } catch (error: any) {
      console.error('Error loading documents:', error);
      setFolders([]);
      setFiles([]);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load documents"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data when folder changes
  useEffect(() => {
    loadData();
  }, [currentFolderId]);

  // Load staff list when share dialog opens
  useEffect(() => {
    if (isShareOpen && shareTab === "internal" && staffList.length === 0) {
      loadStaffList();
    }
  }, [isShareOpen, shareTab]);

  const loadStaffList = async () => {
    try {
      setLoadingStaff(true);
      const response = await staffService.listStaff();
      if (response.success && response.data) {
        setStaffList(response.data);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load staff list"
      });
    } finally {
      setLoadingStaff(false);
    }
  };

  const toggleStaff = (staffId: number) => {
    setInternal(prev => prev.includes(staffId) ? prev.filter(id => id !== staffId) : [...prev, staffId]);
  };

  const getSelectedStaffLabel = () => {
    if (internal.length === 0) return 'Select staff members';
    if (internal.length === 1) {
      const staff = staffList.find(s => s.id === internal[0]);
      return staff?.fullname || staff?.username || '1 staff member';
    }
    return `${internal.length} staff members selected`;
  };

  const openCreate = () => { setNewFolderName(""); setIsCreateOpen(true); };
  const create = async () => {
    if (!newFolderName.trim()) return;
    try {
      setCreatingFolder(true);
      const response = await documentService.createFolder({
        name: newFolderName.trim(),
        parentId: currentFolderId || null
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "Folder created successfully"
        });
        setIsCreateOpen(false);
        setNewFolderName("");
        await loadData(); // Reload data
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create folder"
      });
    } finally {
      setCreatingFolder(false);
    }
  };

  const openUpload = () => { 
    setFileName(""); 
    setFileSize(0); 
    setSelectedFile(null); 
    setFileContent(null);
    setUploadError(null); 
    setIsUploadOpen(true); 
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  const upload = async () => {
    if (!fileName.trim()) return;
    if (!currentFolderId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a folder first"
      });
      return;
    }
    if (fileSize > 10 * 1024 * 1024) { 
      setUploadError("File exceeds 10MB limit"); 
      return; 
    }
    
    let content: string | undefined;
    let fileType: string | undefined;
    
    if (selectedFile) {
      try {
        content = await fileToBase64(selectedFile);
        fileType = selectedFile.type;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to read file content"
        });
        return;
      }
    } else if (!fileContent) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file to upload"
      });
      return;
    } else {
      content = fileContent;
    }
    
    try {
      setUploading(true);
      const response = await documentService.uploadFile({
        name: fileName.trim(),
        folderId: currentFolderId,
        file: content,
        mimeType: fileType
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "File uploaded successfully"
        });
        setIsUploadOpen(false);
        setFileName("");
        setFileSize(0);
        setSelectedFile(null);
        setFileContent(null);
        setUploadError(null);
        
        // Force reload files immediately after upload
        if (currentFolderId) {
          try {
            console.log('Reloading files after upload for folder:', currentFolderId);
            const filesResponse = await documentService.getFiles(currentFolderId);
            console.log('Files response after upload:', filesResponse);
            if (filesResponse.success && Array.isArray(filesResponse.data)) {
              console.log('Setting files after upload:', filesResponse.data);
              setFiles(filesResponse.data);
            } else {
              console.log('Invalid files response after upload');
              // Still reload all data
              await loadData();
            }
          } catch (reloadError) {
            console.error('Error reloading files after upload:', reloadError);
            // Fallback to full reload
            await loadData();
          }
        } else {
          // If no folder selected, just reload all data
          await loadData();
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to upload file"
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload file"
      });
    } finally {
      setUploading(false);
    }
  };

  const openShare = async (targetId?: string, targetType?: "folder" | "file") => {
    const shareId = targetId || currentFolderId;
    const shareType = targetType || "folder";
    if (!shareId) return;
    
    setShareTargetId(shareId);
    setShareTargetType(shareType);
    
    try {
      // Load existing share info
      const shareResponse = await documentService.getShares(shareType, shareId);
      if (shareResponse.success && shareResponse.data) {
        setInternal(shareResponse.data.internal.map(s => s.userId));
        setExternal(shareResponse.data.external.map(s => s.email));
        setPublicUrl(shareResponse.data.publicUrl || null);
      } else {
        setInternal([]);
        setExternal([]);
        setPublicUrl(null);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load share information"
      });
      setInternal([]);
      setExternal([]);
      setPublicUrl(null);
    }
    
    setIsShareOpen(true);
  };

  const saveShare = async () => {
    if (!shareTargetId) return setIsShareOpen(false);
    
    try {
      setSharing(true);
      const response = await documentService.shareResource(shareTargetType, shareTargetId, {
        internal: internal.length > 0 ? internal : undefined,
        external: external.length > 0 ? external : undefined
      });
      
      if (response.success && response.data) {
        setPublicUrl(response.data.publicUrl || null);
        toast({
          title: "Shared Successfully",
          description: external.length > 0 
            ? "Public URL generated. You can copy it from the dialog."
            : "Resource shared successfully"
        });
        if (external.length === 0 && internal.length === 0) {
          setIsShareOpen(false);
          setShareTargetId(null);
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to share resource"
      });
    } finally {
      setSharing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      toast({
        title: "Copied!",
        description: "Public URL copied to clipboard"
      });
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy URL"
      });
    });
  };

  const openRename = (targetId: string, targetType: "folder" | "file", currentName: string) => {
    setRenameValue(currentName);
    setRenameTargetId(targetId);
    setRenameTargetType(targetType);
    setIsRenameOpen(true);
  };

  const saveRename = async () => {
    if (!renameTargetId || !renameValue.trim()) {
      setIsRenameOpen(false);
      return;
    }
    try {
      setRenaming(true);
      if (renameTargetType === "folder") {
        const response = await documentService.updateFolder(renameTargetId, { name: renameValue.trim() });
        if (response.success) {
          toast({
            title: "Success",
            description: "Folder renamed successfully"
          });
          setIsRenameOpen(false);
          setRenameTargetId(null);
          await loadData(); // Reload data
        }
      } else {
        const response = await documentService.updateFile(renameTargetId, { name: renameValue.trim() });
        if (response.success) {
          toast({
            title: "Success",
            description: "File renamed successfully"
          });
          setIsRenameOpen(false);
          setRenameTargetId(null);
          await loadData(); // Reload data
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to rename"
      });
    } finally {
      setRenaming(false);
    }
  };

  const handleDelete = (targetId: string, targetType: "folder" | "file") => {
    setPendingDeleteId(targetId);
    setPendingDeleteType(targetType);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      setDeleting(true);
      if (pendingDeleteType === "folder") {
        const response = await documentService.deleteFolder(pendingDeleteId);
        if (response.success) {
          toast({
            title: "Success",
            description: "Folder deleted successfully"
          });
          // If we deleted the current folder, go back
          if (pendingDeleteId === currentFolderId) {
            setCurrentFolderId(null);
            setCurrentFolder(null);
          } else {
            await loadData(); // Reload data
          }
        }
      } else {
        const response = await documentService.deleteFile(pendingDeleteId);
        if (response.success) {
          toast({
            title: "Success",
            description: "File deleted successfully"
          });
          await loadData(); // Reload data
        }
      }
      setPendingDeleteId(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleViewFile = (file: DocumentFile) => {
    if (file.fileUrl) {
      // Open file in new tab
      window.open(file.fileUrl, '_blank');
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File URL is not available. Please try downloading the file."
      });
    }
  };

  const handleDownload = async (item: DocumentFile | { id: string; name: string; type: "folder" }) => {
    try {
      if (item.type === "folder") {
        // Download folder as ZIP from API
        const folder = folders.find(f => f.id === item.id) || currentFolder;
        if (!folder) return;
        
        // Use public download endpoint (backend generates ZIP on the fly)
        // For authenticated users, we can still use the public endpoint if token exists
        // Or create a temporary share token
        if (folder.publicToken) {
          const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
          const downloadUrl = `${baseUrl}/api/v1/documents/public/${folder.publicToken}/download`;
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `${folder.name}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast({
            title: "Download",
            description: `Downloading folder "${folder.name}" as ZIP`
          });
        } else {
          // For folders without public token, we need to share them first
          // Or the backend could add an authenticated download endpoint
          toast({
            variant: "destructive",
            title: "Error",
            description: "Please share this folder publicly first to enable downloads"
          });
        }
      } else {
        // Download file from API
        const file = item as DocumentFile;
        
        try {
          const blob = await documentService.downloadFile(file.id);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast({
            title: "Download",
            description: `Downloading ${file.name}`
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to download file"
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentFolderId && (
            <Button variant="ghost" size="sm" onClick={() => {
              setCurrentFolderId(null);
              setCurrentFolder(null);
            }} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Root
            </Button>
          )}
          <h2 className="text-xl font-semibold">Document Center</h2>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && !currentFolderId && (
            <Button className="gap-2" onClick={openCreate}><FolderPlus className="h-4 w-4" /> Create Folder</Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base">{currentFolderId ? currentFolder?.name : 'Folders'}</CardTitle>
            <div className="w-full max-w-md">
              <Input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && !currentFolderId && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
              {filteredFolders.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  No folders found
                </div>
              ) : (
                filteredFolders.map((f) => (
                <div key={f.id} className="relative group flex flex-col items-center">
                  <button className="w-full flex flex-col items-center" onClick={() => {
                    setCurrentFolder(f);
                    setCurrentFolderId(f.id);
                  }}>
                    <div className="w-20 h-16 rounded-md bg-blue-200 group-hover:bg-blue-300 transition-colors" />
                    <div className="mt-2 text-sm font-medium text-center max-w-[10rem] truncate">{f.name}</div>
                  </button>
                      <div className="absolute top-1 right-1">
                        <FolderActions 
                          onRename={isAdmin ? () => openRename(f.id, "folder", f.name) : undefined}
                          onDelete={isAdmin ? () => handleDelete(f.id, "folder") : undefined}
                          onShare={isAdmin ? () => openShare(f.id, "folder") : undefined}
                          onDownload={() => handleDownload({ id: f.id, name: f.name, type: "folder" })}
                          isAdmin={isAdmin}
                        />
                      </div>
                </div>
              ))
              )}
            </div>
          )}

          {!loading && currentFolderId && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 justify-end">
                <Button variant="outline" className="gap-2" onClick={() => currentFolderId && handleDownload({ id: currentFolderId, name: currentFolder?.name || "Folder", type: "folder" })}><Download className="h-4 w-4" /> Download Folder</Button>
                {isAdmin && (
                  <>
                    <Button variant="outline" className="gap-2" onClick={() => openShare(currentFolderId, "folder")}><Share2 className="h-4 w-4" /> Share Folder</Button>
                    <Button variant="secondary" className="gap-2" onClick={openUpload}><Upload className="h-4 w-4" /> Upload File</Button>
                    {canCreateSubfolder && (
                      <Button className="gap-2" onClick={openCreate}><FolderPlus className="h-4 w-4" /> Create Folder</Button>
                    )}
                  </>
                )}
              </div>

              <Separator />

              {/* Show subfolders if any exist */}
              {filteredFolders.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Folders</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {filteredFolders.map((f) => (
                      <div key={f.id} className="relative group flex flex-col items-center">
                        <button className="w-full flex flex-col items-center" onClick={() => setCurrentFolderId(f.id)}>
                          <div className="w-20 h-16 rounded-md bg-blue-200 group-hover:bg-blue-300 transition-colors" />
                          <div className="mt-2 text-sm font-medium text-center max-w-[10rem] truncate">{f.name}</div>
                        </button>
                      <div className="absolute top-1 right-1">
                        <FolderActions 
                          onRename={() => openRename(f.id, "folder", f.name)}
                          onDelete={() => handleDelete(f.id, "folder")}
                          onShare={() => openShare(f.id, "folder")}
                          onDownload={() => handleDownload({ id: f.id, name: f.name, type: "folder" })}
                        />
                      </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show files */}
              {files.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Files</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFiles.map(file => (
                      <div key={file.id} className="relative border rounded-lg p-4">
                        <div className="font-medium">{file.name}</div>
                        <div className="text-xs text-muted-foreground">{(file.fileSize / 1024).toFixed(1)} KB • Uploaded {new Date(file.createdAt).toLocaleDateString()}</div>
                        <div className="absolute top-2 right-2">
                          <FileActions 
                            onRename={isAdmin ? () => openRename(file.id, "file", file.name) : undefined}
                            onDelete={isAdmin ? () => handleDelete(file.id, "file") : undefined}
                            onShare={isAdmin ? () => openShare(file.id, "file") : undefined}
                            onDownload={() => handleDownload(file)}
                            onView={() => handleViewFile(file)}
                            isAdmin={isAdmin}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Debug: Show if files exist but are filtered */}
              {files.length > 0 && filteredFiles.length === 0 && query && (
                <div className="text-center text-muted-foreground py-4">
                  No files match your search query
                </div>
              )}

              {/* Show empty state if no folders and no files */}
              {filteredFolders.length === 0 && filteredFiles.length === 0 && !loading && (
                <div className="text-center text-muted-foreground py-12">
                  {isInSubfolder ? "No files available" : "No folders or files available"}
                  {/* Debug info */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 text-xs">
                      <p>Files array length: {files.length}</p>
                      <p>Folders array length: {folders.length}</p>
                      <p>Current folder ID: {currentFolderId || 'null'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Folder */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Folder Name</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Create New Folder</Label>
            <Input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Enter folder name" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={create} disabled={!newFolderName.trim() || creatingFolder}>
              {creatingFolder ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload File */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>File Name</Label>
              <Input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Enter file name" />
            </div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const f = e.dataTransfer.files?.[0];
                if (f) {
                  setSelectedFile(f);
                  setFileName(f.name);
                  setFileSize(f.size);
                  setUploadError(f.size > 10 * 1024 * 1024 ? "File exceeds 10MB limit" : null);
                  // Read file content for preview
                  fileToBase64(f).then(content => setFileContent(content)).catch(() => {});
                }
              }}
              onClick={() => document.getElementById('doc-upload-input')?.click()}
              className={cn(
                "border-2 border-dashed rounded-md p-6 text-center cursor-pointer",
                dragActive ? "border-primary bg-primary/5" : "border-muted"
              )}
            >
              <UploadCloud className="mx-auto h-8 w-8 text-primary mb-2" />
              <div className="text-sm">Click or drag file to upload</div>
              <div className="text-xs text-muted-foreground">Only a single file is supported. Max 10MB.</div>
              {selectedFile && (
                <div className="mt-3 text-xs">Selected: <span className="font-medium">{selectedFile.name}</span> • {(selectedFile.size / 1024).toFixed(1)} KB</div>
              )}
              <input id="doc-upload-input" type="file" className="hidden" onChange={async (e) => {
                const f = e.target.files?.[0] ?? null;
                if (f) {
                  setSelectedFile(f);
                  setFileName(f.name);
                  setFileSize(f.size);
                  setUploadError(f.size > 10 * 1024 * 1024 ? "File exceeds 10MB limit" : null);
                  // Read file content for preview
                  try {
                    const content = await fileToBase64(f);
                    setFileContent(content);
                  } catch (error) {
                    // Silent fail
                  }
                }
              }} />
            </div>
            {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button onClick={upload} disabled={!fileName.trim() || (!!uploadError) || uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Folder/File */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Share {shareTargetType === "folder" ? "Folder" : "File"}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Button variant={shareTab === 'internal' ? 'default' : 'outline'} onClick={() => setShareTab('internal')} size="sm">Internal</Button>
            <Button variant={shareTab === 'external' ? 'default' : 'outline'} onClick={() => setShareTab('external')} size="sm">External</Button>
          </div>
          <div className="mt-3 space-y-3">
            {shareTab === 'internal' ? (
              <div className="space-y-2">
                <Label>Select internal staff</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between w-full" disabled={loadingStaff}>
                      {loadingStaff ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading staff...
                        </>
                      ) : (
                        getSelectedStaffLabel()
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-80">
                    {loadingStaff ? (
                      <div className="py-8 text-center text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Loading staff...
                      </div>
                    ) : staffList.length === 0 ? (
                      <div className="py-8 text-center text-muted-foreground">
                        No staff members found
                      </div>
                    ) : (
                      <>
                        <div className="max-h-64 overflow-auto pr-1">
                          {staffList.map(staff => {
                            const active = internal.includes(staff.id);
                            return (
                              <button
                                key={staff.id}
                                type="button"
                                onClick={() => toggleStaff(staff.id)}
                                className={cn(
                                  'w-full text-left px-3 py-2 rounded-md hover:bg-muted',
                                  active && 'bg-primary/10'
                                )}
                              >
                                <div className="font-medium">{staff.fullname || staff.username}</div>
                                <div className="text-xs text-muted-foreground">{staff.email}</div>
                              </button>
                            );
                          })}
                        </div>
                        {internal.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                            {internal.map(id => {
                              const staff = staffList.find(s => s.id === id);
                              if (!staff) return null;
                              return (
                                <span key={id} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                                  {staff.fullname || staff.username}
                                  <button className="hover:text-destructive" onClick={() => toggleStaff(id)}>
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>External emails (comma separated)</Label>
                <Input value={external.join(', ')} onChange={(e) => setExternal(e.target.value.split(',').map(v => v.trim()).filter(Boolean))} placeholder="name@example.com, ..." />
              </div>
            )}
          </div>
          {publicUrl && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <Label className="text-sm font-medium">Public Share URL</Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={publicUrl} 
                  readOnly 
                  className="flex-1 font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(publicUrl)}
                >
                  {copySuccess ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This URL can be shared with external users. They can view and download the content without logging in.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => {
              setIsShareOpen(false);
              setPublicUrl(null);
              setShareTargetId(null);
            }}>Close</Button>
            <Button onClick={saveShare} disabled={sharing}>
              {sharing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Folder/File */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {renameTargetType === "folder" ? "Folder" : "File"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>New {renameTargetType === "folder" ? "Folder" : "File"} Name</Label>
            <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} placeholder={`Enter new ${renameTargetType} name`} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRenameOpen(false)}>Cancel</Button>
            <Button onClick={saveRename} disabled={!renameValue.trim() || renaming}>
              {renaming ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={!!pendingDeleteId} onOpenChange={(v) => { if (!v) setPendingDeleteId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {pendingDeleteType === "folder" ? "Folder" : "File"}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            {pendingDeleteType === "folder" 
              ? "This will permanently remove the folder and its contents."
              : "This will permanently remove the file."
            }
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPendingDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

type ActionsProps = { 
  onRename?: () => void; 
  onDelete?: () => void;
  onShare?: () => void;
  onDownload: () => void;
  onView?: () => void;
  isAdmin?: boolean;
};
function FolderActions({ onRename, onDelete, onShare, onDownload, isAdmin = true }: ActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-muted" aria-label="Folder actions">
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {isAdmin && onRename && (
          <DropdownMenuItem onClick={onRename}>
            <Pencil className="h-4 w-4 mr-2" />
            Rename
          </DropdownMenuItem>
        )}
        {isAdmin && onShare && (
          <DropdownMenuItem onClick={onShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </DropdownMenuItem>
        {isAdmin && onDelete && (
          <DropdownMenuItem className="text-red-600" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FileActions({ onRename, onDelete, onShare, onDownload, onView, isAdmin = true }: ActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-muted" aria-label="File actions">
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </DropdownMenuItem>
        )}
        {isAdmin && onRename && (
          <DropdownMenuItem onClick={onRename}>
            <Pencil className="h-4 w-4 mr-2" />
            Rename
          </DropdownMenuItem>
        )}
        {isAdmin && onShare && (
          <DropdownMenuItem onClick={onShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </DropdownMenuItem>
        {isAdmin && onDelete && (
          <DropdownMenuItem className="text-red-600" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}