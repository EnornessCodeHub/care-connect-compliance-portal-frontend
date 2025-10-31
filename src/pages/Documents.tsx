import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addFile, createFolder, getFolder, listFiles, listFolders, loadDocState, saveDocState, updateFolderShare, renameFolder, deleteFolder } from "@/lib/docCenter";
import { FolderPlus, Upload, UploadCloud, Share2, ArrowLeft, Download, MoreVertical, Loader2, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import staffService, { Staff } from "@/services/staffService";
import { useToast } from "@/hooks/use-toast";

export default function Documents() {
  const { toast } = useToast();
  const [state, setState] = useState(() => loadDocState());
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // dialogs
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState<number>(0); // bytes
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareTab, setShareTab] = useState<"internal" | "external">("internal");
  const [internal, setInternal] = useState<number[]>([]);
  const [external, setExternal] = useState<string[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // folder actions
  const [folderMenuOpenId, setFolderMenuOpenId] = useState<string | null>(null);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const folder = currentFolderId ? getFolder(currentFolderId, state) : undefined;
  const folders = useMemo(() => listFolders(currentFolderId, state), [currentFolderId, state]);
  const files = useMemo(() => listFiles(currentFolderId ?? state.rootFolderIds[0]!, state), [currentFolderId, state]);

  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));
  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));

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
  const create = () => {
    if (!newFolderName.trim()) return;
    const next = createFolder(newFolderName, currentFolderId, state);
    setState(next);
    setIsCreateOpen(false);
  };

  const openUpload = () => { setFileName(""); setFileSize(0); setSelectedFile(null); setUploadError(null); setIsUploadOpen(true); };
  const upload = () => {
    if (!fileName.trim()) return;
    if (fileSize > 5 * 1024 * 1024) { setUploadError("File exceeds 5MB limit"); return; }
    const folderId = currentFolderId ?? state.rootFolderIds[0]!;
    const next = addFile(fileName, fileSize || Math.floor(Math.random() * 1024 * 3000), folderId, state);
    setState(next);
    setIsUploadOpen(false);
  };

  const openShare = () => {
    const f = currentFolderId ? getFolder(currentFolderId, state) : undefined;
    // Convert stored internal IDs to numbers if they're strings
    const internalIds = f?.shared.internal ?? [];
    setInternal(Array.isArray(internalIds) ? internalIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id).filter(id => !isNaN(id)) : []);
    setExternal(f?.shared.external ?? []);
    setIsShareOpen(true);
  };
  const saveShare = () => {
    if (!currentFolderId) return setIsShareOpen(false);
    const next = updateFolderShare(currentFolderId, { internal, external }, state);
    setState(next);
    setIsShareOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentFolderId && (
            <Button variant="ghost" size="sm" onClick={() => setCurrentFolderId(null)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Root
            </Button>
          )}
          <h2 className="text-xl font-semibold">Document Center</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2" onClick={openCreate}><FolderPlus className="h-4 w-4" /> Create Folder</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base">{currentFolderId ? folder?.name : 'Folders'}</CardTitle>
            <div className="w-full max-w-md">
              <Input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!currentFolderId && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
              {filteredFolders.map((f) => (
                <div key={f.id} className="relative group flex flex-col items-center">
                  <button className="w-full flex flex-col items-center" onClick={() => setCurrentFolderId(f.id)}>
                    <div className="w-20 h-16 rounded-md bg-blue-200 group-hover:bg-blue-300 transition-colors" />
                    <div className="mt-2 text-sm font-medium text-center max-w-[10rem] truncate">{f.name}</div>
                  </button>
                  <div className="absolute top-1 right-1">
                    <FolderActions 
                      onRename={() => { setRenameValue(f.name); setIsRenameOpen(true); setFolderMenuOpenId(f.id); }}
                      onDelete={() => setPendingDeleteId(f.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentFolderId && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 justify-end">
                <Button variant="outline" className="gap-2" onClick={() => { /* placeholder for download all */ }}><Download className="h-4 w-4" /> Download Folder</Button>
                <Button variant="outline" className="gap-2" onClick={openShare}><Share2 className="h-4 w-4" /> Share Folder</Button>
                <Button variant="secondary" className="gap-2" onClick={openUpload}><Upload className="h-4 w-4" /> Upload File</Button>
                <Button className="gap-2" onClick={openCreate}><FolderPlus className="h-4 w-4" /> Create Folder</Button>
                <Button variant="outline" className="gap-2"><UploadCloud className="h-4 w-4" /> Upload Folder</Button>
              </div>

              <Separator />

              {filteredFiles.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">No Files Available</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFiles.map(file => (
                    <div key={file.id} className="border rounded-lg p-4">
                      <div className="font-medium">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • Uploaded {new Date(file.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))}
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
            <Button onClick={create} disabled={!newFolderName.trim()}>Create</Button>
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
                  setUploadError(f.size > 5 * 1024 * 1024 ? "File exceeds 5MB limit" : null);
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
              <div className="text-xs text-muted-foreground">Only a single file is supported. Max 5MB.</div>
              {selectedFile && (
                <div className="mt-3 text-xs">Selected: <span className="font-medium">{selectedFile.name}</span> • {(selectedFile.size / 1024).toFixed(1)} KB</div>
              )}
              <input id="doc-upload-input" type="file" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                if (f) {
                  setSelectedFile(f);
                  setFileName(f.name);
                  setFileSize(f.size);
                  setUploadError(f.size > 5 * 1024 * 1024 ? "File exceeds 5MB limit" : null);
                }
              }} />
            </div>
            {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button onClick={upload} disabled={!fileName.trim() || (!!uploadError)}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Folder */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Share Folder</DialogTitle>
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
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsShareOpen(false)}>Cancel</Button>
            <Button onClick={saveShare}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Folder */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>New Folder Name</Label>
            <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} placeholder="Enter new folder name" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRenameOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (!folderMenuOpenId || !renameValue.trim()) { setIsRenameOpen(false); return; }
              const next = renameFolder(folderMenuOpenId, renameValue, state);
              setState(next);
              setIsRenameOpen(false);
              setFolderMenuOpenId(null);
            }} disabled={!renameValue.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={!!pendingDeleteId} onOpenChange={(v) => { if (!v) setPendingDeleteId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">This will permanently remove the folder and its contents.</div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPendingDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (!pendingDeleteId) return;
              const next = deleteFolder(pendingDeleteId, state);
              setState(next);
              setPendingDeleteId(null);
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type ActionsProps = { onRename: () => void; onDelete: () => void };
function FolderActions({ onRename, onDelete }: ActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-muted" aria-label="Folder actions">
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={onRename}>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={onDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}