import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Info
} from "lucide-react";
import adminService, { Admin as AdminType } from "@/services/adminService";
import authService from "@/services/authService";

const Admin = () => {
  const { toast } = useToast();
  const [isNewAdminDialogOpen, setIsNewAdminDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  const [adminMembers, setAdminMembers] = useState<AdminType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get current logged-in admin ID
  const currentAdminId = useMemo(() => {
    const userData = authService.getUserData();
    return userData?.id ? Number(userData.id) : null;
  }, []);
  
  // Edit dialog state
  const [editId, setEditId] = useState<number>(0);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editSubmitted, setEditSubmitted] = useState(false);

  // Load admin on mount
  useEffect(() => {
    loadAdmin();
  }, []);

  const loadAdmin = async () => {
    try {
      setLoading(true);
      const response = await adminService.listAdmin();
      if (response.success && response.data) {
        setAdminMembers(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to load admin members";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (id: number) => {
    // Prevent editing current user
    if (currentAdminId && id === currentAdminId) {
      toast({
        variant: "destructive",
        title: "Cannot Edit",
        description: "You cannot edit your own account from this page. Please use Profile settings."
      });
      return;
    }
    const admin = adminMembers.find((m) => m.id === id);
    if (!admin) return;
    setEditId(admin.id);
    setEditName(admin.fullname || "");
    setEditUsername(admin.username);
    setEditEmail(admin.email);
    setEditSubmitted(false);
    setEditPassword("");
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    setEditSubmitted(true);
    if (!editName.trim() || !editUsername.trim() || !editEmail.trim()) return;

    try {
      const updateData: any = {
        fullname: editName,
        username: editUsername,
        email: editEmail,
      };
      
      // Only include password if it's provided
      if (editPassword.trim()) {
        updateData.password = editPassword;
      }

      const response = await adminService.updateAdmin(editId, updateData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Admin member updated successfully"
        });
        setIsEditDialogOpen(false);
        loadAdmin(); // Reload the list
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to update admin member";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    // Prevent toggling current user's status
    if (currentAdminId && id === currentAdminId) {
      toast({
        variant: "destructive",
        title: "Cannot Change Status",
        description: "You cannot change your own account status."
      });
      return;
    }
    try {
      const response = await adminService.toggleAdminStatus(id);
      if (response.success) {
        toast({
          title: "Success",
          description: response.message
        });
        loadAdmin(); // Reload to get updated status
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to toggle admin status";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
    }
  };

  const handleDelete = async (id: number) => {
    // Prevent deleting current user
    if (currentAdminId && id === currentAdminId) {
      toast({
        variant: "destructive",
        title: "Cannot Delete",
        description: "You cannot delete your own account."
      });
      return;
    }
    if (!confirm("Are you sure you want to delete this admin member?")) return;

    try {
      const response = await adminService.deleteAdmin(id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Admin member deleted successfully"
        });
        loadAdmin(); // Reload the list
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to delete admin member";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
    }
  };

  const filteredAdmin = adminMembers.filter(admin => 
    admin.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <Dialog open={isNewAdminDialogOpen} onOpenChange={setIsNewAdminDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center space-x-2">
                <ChevronLeft className="h-5 w-5" />
                <div>
                  <DialogTitle className="text-2xl">New Admin</DialogTitle>
                  <p className="text-sm text-muted-foreground">Admin</p>
                </div>
              </div>
            </DialogHeader>
            <NewAdminForm 
              onClose={() => setIsNewAdminDialogOpen(false)} 
              onSuccess={loadAdmin}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search admin"
            className="pl-10 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Admin Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredAdmin.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No admin members found
                </TableCell>
              </TableRow>
            ) : (
              filteredAdmin.map((admin) => {
                const isCurrentUser = currentAdminId !== null && admin.id === currentAdminId;
                return (
                  <TableRow 
                    key={admin.id}
                    className={isCurrentUser ? "opacity-60 bg-muted/30" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{admin.fullname || '-'}</span>
                        {isCurrentUser && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  <Info className="h-3 w-3" />
                                  You
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>This is your account. Actions are disabled for security.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{admin.username}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Switch 
                                  checked={admin.status} 
                                  onCheckedChange={() => toggleActive(admin.id, admin.status)}
                                  disabled={isCurrentUser}
                                />
                              </div>
                            </TooltipTrigger>
                            {isCurrentUser && (
                              <TooltipContent>
                                <p>Cannot change your own status</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                        <span className={`text-sm ${isCurrentUser ? "text-muted-foreground" : ""}`}>
                          {admin.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => openEdit(admin.id)}
                                  disabled={isCurrentUser}
                                  className={isCurrentUser ? "cursor-not-allowed opacity-50" : ""}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                            </TooltipTrigger>
                            {isCurrentUser && (
                              <TooltipContent>
                                <p>Cannot edit your own account. Use Profile settings instead.</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDelete(admin.id)}
                                  disabled={isCurrentUser}
                                  className={isCurrentUser ? "cursor-not-allowed opacity-50" : ""}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TooltipTrigger>
                            {isCurrentUser && (
                              <TooltipContent>
                                <p>Cannot delete your own account</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Enter admin name" />
              {editSubmitted && !editName.trim() && <p className="text-xs text-destructive">Please enter full name</p>}
            </div>
            <div className="space-y-2">
              <Label>Username *</Label>
              <Input value={editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder="Enter username" />
              {editSubmitted && !editUsername.trim() && <p className="text-xs text-destructive">Please enter username</p>}
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Enter email" />
              {editSubmitted && !editEmail.trim() && <p className="text-xs text-destructive">Please enter email</p>}
            </div>
            <div className="space-y-2">
              <Label>Password (optional)</Label>
              <div className="relative">
                <Input type={showEditPassword ? "text" : "password"} value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="Set new password (optional)" className="pr-10" />
                <button type="button" onClick={() => setShowEditPassword(!showEditPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit} className="bg-blue-500 hover:bg-blue-600">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Showing {filteredAdmin.length} of {adminMembers.length} items
          </span>
          <Select value={recordsPerPage} onValueChange={setRecordsPerPage}>
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">records per page</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-blue-500">1</span>
          <Button variant="outline" size="sm" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// New Admin Form Component
const NewAdminForm = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) return;

    try {
      setLoading(true);
      const response = await adminService.createAdmin({
        fullname: fullName,
        username,
        email,
        password,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Admin member created successfully"
        });
        // Reset form
        setFullName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setSubmitted(false);
        onClose();
        onSuccess(); // Reload the admin list
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to create admin member";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const errorClass = "text-xs text-destructive mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Full Name *</Label>
          <Input
            placeholder="Enter admin name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
          {submitted && !fullName.trim() && <p className={errorClass}>Please enter full name</p>}
        </div>

        <div className="space-y-2">
          <Label>Username *</Label>
          <Input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          {submitted && !username.trim() && <p className={errorClass}>Please enter username</p>}
        </div>

        <div className="space-y-2">
          <Label>Email *</Label>
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          {submitted && !email.trim() && <p className={errorClass}>Please enter email</p>}
        </div>

        <div className="space-y-2">
          <Label>Password *</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              disabled={loading}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {submitted && !password.trim() && <p className={errorClass}>Please enter password</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Admin"
          )}
        </Button>
      </div>
    </form>
  );
};

export default Admin;

