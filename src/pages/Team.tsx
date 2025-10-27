import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Team = () => {
  const navigate = useNavigate();
  const [isNewStaffDialogOpen, setIsNewStaffDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState("25");
  
  // Mock staff data (stateful for edits)
  const [staffMembers, setStaffMembers] = useState([
    {
      id: "1",
      name: "Marko Bajic",
      username: "marko.bajic",
      email: "markobajic@live.com.au",
      active: true
    }
  ] as Array<{ id: string; name: string; username: string; email: string; active: boolean }>);

  // Edit dialog state
  const [editId, setEditId] = useState<string>("");
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState(""); // optional
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editSubmitted, setEditSubmitted] = useState(false);

  const openEdit = (id: string) => {
    const s = staffMembers.find((m) => m.id === id);
    if (!s) return;
    setEditId(s.id);
    setEditName(s.name);
    setEditUsername(s.username);
    setEditEmail(s.email);
    setEditSubmitted(false);
    setEditPassword("");
    setIsEditDialogOpen(true);
  };

  const saveEdit = () => {
    setEditSubmitted(true);
    if (!editName.trim() || !editUsername.trim() || !editEmail.trim()) return;
    setStaffMembers((prev) => prev.map((m) => (m.id === editId ? { ...m, name: editName, username: editUsername, email: editEmail } : m)));
    setIsEditDialogOpen(false);
  };

  const toggleActive = (id: string, value: boolean) => {
    setStaffMembers((prev) => prev.map((m) => (m.id === id ? { ...m, active: value } : m)));
  };

  // simplified actions can be wired later

  // removed onboarding icons in simplified flow

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff</h1>
        <Dialog open={isNewStaffDialogOpen} onOpenChange={setIsNewStaffDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center space-x-2">
                <ChevronLeft className="h-5 w-5" />
                <div>
                  <DialogTitle className="text-2xl">New Employee</DialogTitle>
                  <p className="text-sm text-muted-foreground">Staff</p>
                </div>
              </div>
            </DialogHeader>
            <NewStaffForm onClose={() => setIsNewStaffDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search staff"
            className="pl-10 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Staff Table */}
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
            {staffMembers.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.username}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={staff.active} onCheckedChange={(v) => toggleActive(staff.id, v as boolean)} />
                    <span className="text-sm">{staff.active ? "Active" : "Inactive"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(staff.id)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Staff</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Enter staff name" />
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
            Showing 1 of 1 items
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

// New Employee Form Component (simplified to 4 fields)
const NewStaffForm = ({ onClose }: { onClose: () => void }) => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) return;
    console.log({ fullName, username, email, password });
    onClose();
  };

  const errorClass = "text-xs text-destructive mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogTitle className="sr-only">Add Staff Member</DialogTitle>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Full Name *</Label>
          <Input
            placeholder="Enter staff name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        {submitted && !fullName.trim() && <p className={errorClass}>Please enter full name</p>}

        <div className="space-y-2">
          <Label>Username *</Label>
          <Input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        {submitted && !username.trim() && <p className={errorClass}>Please enter username</p>}

        <div className="space-y-2">
          <Label>Email *</Label>
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {submitted && !email.trim() && <p className={errorClass}>Please enter email</p>}

        <div className="space-y-2">
          <Label>Password *</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {submitted && !password.trim() && <p className={errorClass}>Please enter password</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">Add Staff</Button>
      </div>
    </form>
  );
};

export default Team;