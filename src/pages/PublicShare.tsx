import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, File as FileIcon, Folder, Loader2, ArrowLeft, Eye, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import documentService from "@/services/documentService";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PublicFolder {
  id: string;
  name: string;
}

interface PublicFile {
  id: string;
  name: string;
  fileSize: number;
  mimeType: string;
}

interface PublicResource {
  type: 'folder' | 'file';
  id: string;
  name: string;
  subfolders?: PublicFolder[];
  files?: PublicFile[];
  fileSize?: number;
  mimeType?: string;
  fileUrl?: string;
}

export default function PublicShare() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [resource, setResource] = useState<PublicResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    loadResource();
  }, [token]);

  const loadResource = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await documentService.getPublicResource(token);
      
      if (response.success && response.data) {
        setResource(response.data);
      } else {
        toast({
          variant: "destructive",
          title: "Not Found",
          description: response.message || "This shared link is invalid or has expired"
        });
      }
    } catch (error: any) {
      console.error('Error loading public resource:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load shared content"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!token || !resource) return;
    
    try {
      setDownloading(true);
      const blob = await documentService.downloadPublicResource(token, resource.name);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resource.type === 'folder' ? `${resource.name}.zip` : resource.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: resource.type === 'folder' 
          ? "Folder is being downloaded as a ZIP file"
          : "File is being downloaded"
      });
    } catch (error: any) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: error.message || "An error occurred while downloading"
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleFileDownload = async (file: PublicFile) => {
    if (!token) return;
    
    try {
      const blob = await documentService.getPublicFile(token, file.id);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "File is being downloaded"
      });
    } catch (error: any) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: error.message || "An error occurred while downloading"
      });
    }
  };

  const handleFileView = async (file: PublicFile) => {
    if (!token) return;
    
    try {
      const blob = await documentService.getPublicFile(token, file.id);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Clean up after a delay
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to open file"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading shared content...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">This shared link is invalid or has expired.</p>
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter folders and files based on search query
  const filteredSubfolders = (resource.subfolders || []).filter(f => 
    f.name.toLowerCase().includes(query.toLowerCase())
  );
  const filteredFiles = (resource.files || []).filter(f => 
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">{resource.name}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleDownload} disabled={downloading}>
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download {resource.type === 'folder' ? 'Folder' : 'File'}
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base">{resource.name}</CardTitle>
            <div className="w-full max-w-md">
              <Input 
                placeholder="Search..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {resource.type === "folder" ? (
            <FolderPublicView 
              resource={resource} 
              token={token!}
              onFileDownload={handleFileDownload}
              onFileView={handleFileView}
              filteredSubfolders={filteredSubfolders}
              filteredFiles={filteredFiles}
            />
          ) : (
            <FilePublicView resource={resource} token={token!} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Component for folder view
function FolderPublicView({ 
  resource, 
  token,
  onFileDownload,
  onFileView,
  filteredSubfolders,
  filteredFiles
}: { 
  resource: PublicResource; 
  token: string;
  onFileDownload: (file: PublicFile) => void;
  onFileView: (file: PublicFile) => void;
  filteredSubfolders: PublicFolder[];
  filteredFiles: PublicFile[];
}) {
  const subfolders = resource.subfolders || [];
  const files = resource.files || [];

  return (
    <div className="space-y-6">
      {/* Show subfolders */}
      {filteredSubfolders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Folders</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {filteredSubfolders.map((folder) => (
              <div key={folder.id} className="relative group flex flex-col items-center">
                <div className="w-full flex flex-col items-center">
                  <div className="w-20 h-16 rounded-md bg-blue-200 group-hover:bg-blue-300 transition-colors" />
                  <div className="mt-2 text-sm font-medium text-center max-w-[10rem] truncate">{folder.name}</div>
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
            {filteredFiles.map((file) => (
              <div key={file.id} className="relative border rounded-lg p-4">
                <div className="font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  {(file.fileSize / 1024).toFixed(1)} KB
                </div>
                <div className="absolute top-2 right-2">
                  <FileActions 
                    onView={(file.mimeType?.startsWith('image/') || file.mimeType === 'application/pdf' || file.mimeType?.startsWith('text/')) ? () => onFileView(file) : undefined}
                    onDownload={() => onFileDownload(file)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {subfolders.length === 0 && files.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          This folder is empty
        </div>
      )}

      {/* No results from search */}
      {subfolders.length > 0 && files.length > 0 && filteredSubfolders.length === 0 && filteredFiles.length === 0 && (
        <div className="text-center text-muted-foreground py-4">
          No items match your search query
        </div>
      )}
    </div>
  );
}

// Component for file view
function FilePublicView({ resource, token }: { resource: PublicResource; token: string }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (resource.type === 'file' && resource.fileUrl) {
      // For files, use the fileUrl directly if available
      setPreviewUrl(resource.fileUrl);
      setLoadingPreview(false);
    } else if (resource.type === 'file') {
      // If no fileUrl, try to fetch the file blob and create object URL
      loadFilePreview();
    }
  }, [resource, token]);

  const loadFilePreview = async () => {
    if (!token || resource.type !== 'file') return;
    
    try {
      setLoadingPreview(true);
      const blob = await documentService.getPublicFile(token, resource.id);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (error: any) {
      console.error('Error loading file preview:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load file preview"
      });
    } finally {
      setLoadingPreview(false);
    }
  };

  const renderPreview = () => {
    if (loadingPreview) {
      return (
        <div className="text-center text-muted-foreground py-12">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4" />
          <p>Loading preview...</p>
        </div>
      );
    }

    if (!previewUrl) {
      return (
        <div className="text-center text-muted-foreground py-12">
          Preview not available
        </div>
      );
    }

    const mimeType = resource.mimeType?.toLowerCase() || '';
    
    if (mimeType.startsWith('image/')) {
      return (
        <div className="flex justify-center">
          <img 
            src={previewUrl} 
            alt={resource.name}
            className="max-w-full max-h-[600px] object-contain rounded-lg"
          />
        </div>
      );
    }
    
    if (mimeType === 'application/pdf') {
      return (
        <div className="w-full h-[600px] border rounded-lg overflow-hidden">
          <iframe
            src={previewUrl}
            className="w-full h-full"
            title={resource.name}
          />
        </div>
      );
    }
    
    if (mimeType.startsWith('text/') || mimeType === 'application/json' || resource.name.endsWith('.txt')) {
      // For text files, show a message to download
      return (
        <div className="border rounded-lg p-4 bg-muted">
          <p className="text-sm text-muted-foreground">Text file preview not available. Please download to view.</p>
        </div>
      );
    }
    
    return (
      <div className="text-center text-muted-foreground py-12">
        <FileIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Preview not available for this file type</p>
        <p className="text-xs mt-2">You can download the file to view it</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Size: {resource.fileSize ? (resource.fileSize / 1024).toFixed(1) : 'Unknown'} KB</span>
        {resource.mimeType && (
          <>
            <span>•</span>
            <span>Type: {resource.mimeType}</span>
          </>
        )}
      </div>
      <div className="border rounded-lg p-4 bg-muted/50">
        {renderPreview()}
      </div>
    </div>
  );
}

// 3-dot menu components for public share
type PublicActionsProps = {
  onDownload?: () => void;
  onView?: () => void;
};

function FolderActions({ onDownload }: PublicActionsProps) {
  if (!onDownload) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-muted" aria-label="Folder actions">
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FileActions({ onView, onDownload }: PublicActionsProps) {
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
        {onDownload && (
          <DropdownMenuItem onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
