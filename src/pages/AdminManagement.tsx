import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Settings, 
  Users, 
  Shield, 
  Key, 
  Database, 
  Activity, 
  AlertTriangle,
  UserPlus,
  Edit3,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  FileText,
  CheckCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [parsedNDISData, setParsedNDISData] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDataPreview, setShowDataPreview] = useState(false);
  const [ndisTableData] = useState([
    {
      itemNumber: "01_002_0107_1_1",
      itemName: "Assistance With Self-Care Activities - Standard - Weekday Night",
      registrationGroup: "Daily Personal Activities",
      category: "Assistance with Daily Life (Includes SIL)",
      unit: "H",
      priceVIC: 78.81,
      remote: 110.33,
      veryRemote: 118.22,
      type: "Price Limited Supports"
    },
    {
      itemNumber: "01_004_0107_1_1", 
      itemName: "Assistance with Personal Domestic Activities",
      registrationGroup: "Daily Personal Activities",
      category: "Assistance with Daily Life (Includes SIL)",
      unit: "H",
      priceVIC: 59.06,
      remote: 82.68,
      veryRemote: 88.59,
      type: "Price Limited Supports"
    },
    {
      itemNumber: "01_011_0107_1_1",
      itemName: "Assistance With Self-Care Activities - Standard - Weekday Daytime",
      registrationGroup: "Daily Personal Activities",
      category: "Assistance with Daily Life (Includes SIL)",
      unit: "H", 
      priceVIC: 70.23,
      remote: 98.32,
      veryRemote: 105.35,
      type: "Price Limited Supports"
    },
    {
      itemNumber: "01_013_0107_1_1",
      itemName: "Assistance With Self-Care Activities - Standard - Saturday",
      registrationGroup: "Daily Personal Activities",
      category: "Assistance with Daily Life (Includes SIL)",
      unit: "H",
      priceVIC: 98.83,
      remote: 138.36,
      veryRemote: 148.25,
      type: "Price Limited Supports"
    },
    {
      itemNumber: "01_019_0120_1_1",
      itemName: "House or Yard Maintenance",
      registrationGroup: "Household Tasks",
      category: "Assistance with Daily Life (Includes SIL)",
      unit: "H",
      priceVIC: 56.98,
      remote: 79.77,
      veryRemote: 85.47,
      type: "Price Limited Supports"
    },
    {
      itemNumber: "01_020_0120_1_1",
      itemName: "House Cleaning And Other Household Activities",
      registrationGroup: "Household Tasks",
      category: "Assistance with Daily Life (Includes SIL)",
      unit: "H",
      priceVIC: 58.03,
      remote: 81.24,
      veryRemote: 87.05,
      type: "Price Limited Supports"
    }
  ]);

  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@healthcare.com",
      role: "System Administrator",
      status: "Active",
      lastLogin: "2024-01-15 09:30 AM",
      permissions: ["Full Access", "User Management", "System Config"]
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@healthcare.com",
      role: "Care Manager",
      status: "Active",
      lastLogin: "2024-01-15 08:45 AM",
      permissions: ["Client Management", "Reports", "Scheduling"]
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emma.wilson@healthcare.com",
      role: "Support Worker",
      status: "Inactive",
      lastLogin: "2024-01-10 03:20 PM",
      permissions: ["Client Care", "Timesheets"]
    },
    {
      id: 4,
      name: "James Miller",
      email: "james.miller@healthcare.com",
      role: "Compliance Officer",
      status: "Active",
      lastLogin: "2024-01-15 10:15 AM",
      permissions: ["Compliance", "Auditing", "Reports"]
    }
  ];

  const systemStats = [
    { label: "Total Users", value: "47", icon: Users, status: "success" },
    { label: "Active Sessions", value: "23", icon: Activity, status: "info" },
    { label: "Failed Logins", value: "3", icon: AlertTriangle, status: "warning" },
    { label: "System Alerts", value: "1", icon: Shield, status: "critical" }
  ];

  const handleUserAction = (action: string, userId: number) => {
    toast({
      title: `User ${action}`,
      description: `Action "${action}" performed for user ID: ${userId}`,
    });
  };

  const handleSystemAction = (action: string) => {
    toast({
      title: "System Action",
      description: `${action} initiated successfully`,
    });
  };

  const handleFileUpload = (file: File) => {
    const validTypes = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    
    if (!validTypes.includes(file.type) && !validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV or Excel file (.csv, .xlsx, .xls).",
        variant: "destructive",
      });
      return;
    }
    
    setUploadedFile(file);
    
    // Detect file type for better user feedback
    const isNDISFile = file.name.toLowerCase().includes('ndis') || file.name.toLowerCase().includes('support') || file.name.toLowerCase().includes('catalogue');
    
    toast({
      title: "File Uploaded",
      description: `${file.name} uploaded successfully. ${isNDISFile ? 'NDIS Support Catalogue' : 'Standard pricing'} format detected.`,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const processCsvImport = () => {
    if (!uploadedFile) return;
    
    const isNDISFile = uploadedFile.name.toLowerCase().includes('ndis') || uploadedFile.name.toLowerCase().includes('support') || uploadedFile.name.toLowerCase().includes('catalogue');
    
    if (isNDISFile) {
      // For NDIS files, show preview first
      toast({
        title: "Processing NDIS File",
        description: "Loading NDIS pricing data for review...",
      });
      
      // Simulate parsing NDIS data
      setTimeout(() => {
        const mockNDISData = [
          {
            itemNumber: "01_011_0107_1_1",
            itemName: "Assistance With Self-Care Activities - Standard - Weekday Daytime",
            registrationGroup: "Daily Personal Activities",
            category: "Assistance with Daily Life",
            unit: "H",
            priceACT: 70.23,
            priceNSW: 70.23,
            priceQLD: 70.23,
            priceVIC: 70.23,
            remote: 98.32,
            veryRemote: 105.35,
            startDate: "2025-07-01",
            endDate: "9999-12-31"
          },
          {
            itemNumber: "01_004_0107_1_1",
            itemName: "Assistance with Personal Domestic Activities",
            registrationGroup: "Daily Personal Activities", 
            category: "Assistance with Daily Life",
            unit: "H",
            priceACT: 59.06,
            priceNSW: 59.06,
            priceQLD: 59.06,
            priceVIC: 59.06,
            remote: 82.68,
            veryRemote: 88.59,
            startDate: "2025-07-01",
            endDate: "9999-12-31"
          }
        ];
        
        setParsedNDISData(mockNDISData);
        setShowDataPreview(true);
        toast({
          title: "NDIS Data Loaded",
          description: `${mockNDISData.length} pricing items ready for review and selection.`,
        });
      }, 2000);
    } else {
      // Standard CSV processing
      toast({
        title: "Processing CSV",
        description: "Importing pricing data from CSV file...",
      });
      
      setTimeout(() => {
        toast({
          title: "Import Complete", 
          description: "Pricing schedules have been updated successfully.",
        });
        setUploadedFile(null);
      }, 2000);
    }
  };

  const handleItemSelection = (itemNumber: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(itemNumber);
    } else {
      newSelected.delete(itemNumber);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(ndisTableData.map(item => item.itemNumber)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const importSelectedItems = () => {
    const selectedData = ndisTableData.filter(item => selectedItems.has(item.itemNumber));
    
    toast({
      title: "Importing Selected Items",
      description: `Adding ${selectedData.length} NDIS pricing items to your system...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Import Successful",
        description: `${selectedData.length} NDIS pricing items have been added to your pricing schedules.`,
      });
      setSelectedItems(new Set());
    }, 2000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground">System administration and user management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => handleSystemAction("System Backup")}>
            <Download className="h-4 w-4 mr-2" />
            Backup
          </Button>
          <Button onClick={() => handleSystemAction("Add New User")}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Badge 
                variant={stat.status === "success" ? "default" : stat.status === "warning" ? "secondary" : stat.status === "critical" ? "destructive" : "outline"}
                className="mt-2"
              >
                {stat.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Admin Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Schedules</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-semibold">{user.name}</h4>
                          <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.role} • Last login: {user.lastLogin}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleUserAction("View", user.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleUserAction("Edit", user.id)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleUserAction("Delete", user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Role & Permission Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">System Administrator</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge variant="default">Full Access</Badge>
                        <Badge variant="default">User Management</Badge>
                        <Badge variant="default">System Configuration</Badge>
                        <Badge variant="default">Audit Logs</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Role
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Care Manager</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge variant="secondary">Client Management</Badge>
                        <Badge variant="secondary">Scheduling</Badge>
                        <Badge variant="secondary">Reports</Badge>
                        <Badge variant="secondary">Team Management</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Role
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Support Worker</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge variant="outline">Client Care</Badge>
                        <Badge variant="outline">Timesheets</Badge>
                        <Badge variant="outline">Incident Reporting</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Role
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Schedules Tab */}
        <TabsContent value="pricing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pricing Schedules Management</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure pricing schedules available across all funding periods
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => handleSystemAction("Download Standard CSV Template")}>
                      <Download className="h-4 w-4 mr-2" />
                      CSV Template
                    </Button>
                    <Button variant="outline" onClick={() => handleSystemAction("Download NDIS Template")}>
                      <Download className="h-4 w-4 mr-2" />
                      NDIS Template
                    </Button>
                    <Button onClick={() => handleSystemAction("Add New Pricing Schedule")}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Schedule
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* CSV Upload Section */}
                <div className="mb-6 p-4 border-2 border-dashed rounded-lg bg-muted/20">
                  <div className="text-center">
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                        isDragOver 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted-foreground/25 hover:border-primary/50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Upload Pricing Schedule</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Support CSV files and Excel files including NDIS Support Catalogue format
                      </p>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileInputChange}
                        className="hidden"
                        id="csv-upload"
                      />
                      <label htmlFor="csv-upload">
                        <Button variant="outline" className="cursor-pointer" asChild>
                          <span>
                            <FileText className="h-4 w-4 mr-2" />
                            Choose File (CSV/Excel)
                          </span>
                        </Button>
                      </label>
                    </div>
                    
                    {uploadedFile && (
                      <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-center justify-center space-x-2 text-success-foreground">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium">{uploadedFile.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          File size: {(uploadedFile.size / 1024).toFixed(1)} KB • 
                          Type: {uploadedFile.name.toLowerCase().includes('ndis') ? 'NDIS Support Catalogue' : 'Standard Pricing'}
                        </p>
                        <div className="flex space-x-2 mt-3">
                          <Button onClick={processCsvImport} size="sm">
                            {uploadedFile.name.toLowerCase().includes('ndis') ? 'Import NDIS Data' : 'Import Pricing Data'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setUploadedFile(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 text-xs text-muted-foreground">
                      <p><strong>Standard CSV:</strong> Service Type, Rate, Unit, Effective Date, Notes</p>
                      <p><strong>NDIS Format:</strong> Support Item Number, Support Item Name, Unit, State Pricing, Start Date, End Date</p>
                      <p>Supported formats: .csv, .xlsx (NDIS Support Catalogue)</p>
                      <p>Maximum file size: 10MB</p>
                    </div>
                  </div>
                </div>

                {/* NDIS Data Preview Section */}
                {showDataPreview && parsedNDISData.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>NDIS Pricing Data Preview</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Select the items you want to import into your pricing schedules
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{selectedItems.size} selected</Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowDataPreview(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={importSelectedItems}
                            disabled={selectedItems.size === 0}
                            size="sm"
                          >
                            Import {selectedItems.size} Items
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="select-all"
                            checked={selectedItems.size === parsedNDISData.length && parsedNDISData.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                          <Label htmlFor="select-all" className="text-sm font-medium">
                            Select All ({parsedNDISData.length} items)
                          </Label>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg max-h-96 overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">Select</TableHead>
                              <TableHead>Item Number</TableHead>
                              <TableHead>Service Name</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Unit</TableHead>
                              <TableHead>Standard Rate</TableHead>
                              <TableHead>Remote Rate</TableHead>
                              <TableHead>Very Remote</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {parsedNDISData.map((item) => (
                              <TableRow key={item.itemNumber}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedItems.has(item.itemNumber)}
                                    onCheckedChange={(checked) => 
                                      handleItemSelection(item.itemNumber, checked as boolean)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="font-mono text-xs">{item.itemNumber}</TableCell>
                                <TableCell className="max-w-xs">
                                  <div className="truncate" title={item.itemName}>
                                    {item.itemName}
                                  </div>
                                </TableCell>
                                <TableCell>{item.registrationGroup}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>${item.priceVIC}</TableCell>
                                <TableCell>${item.remote}</TableCell>
                                <TableCell>${item.veryRemote}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="mt-4 text-xs text-muted-foreground">
                        <p>Preview showing standard VIC pricing. Full state-specific pricing will be imported.</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Universal Pricing Schedules Section */}
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Universal Pricing Schedules</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          These schedules are available across all funding periods
                        </p>
                      </div>
                      <Badge variant="secondary">Active for All Periods</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">NDIS Support Catalogue 2025-26</h4>
                            <Badge variant="default">Universal</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Effective: 01/07/2025 - 30/06/2026 • Available across all client funding periods
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Items
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">NDIS Support Catalogue 2024-25</h4>
                            <Badge variant="outline">Legacy</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Effective: 01/07/2024 - 30/06/2025 • Available for historical periods
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Items
                          </Button>
                          <Button variant="outline" size="sm" disabled>
                            <Edit3 className="h-4 w-4 mr-1" />
                            Archive
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* NDIS Support Catalogue Table */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>NDIS Support Catalogue 2025-26</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Select support items to add to your pricing schedules
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{selectedItems.size} selected</Badge>
                        <Button 
                          onClick={() => importSelectedItems()}
                          disabled={selectedItems.size === 0}
                          size="sm"
                        >
                          Add {selectedItems.size} Items to System
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="select-all-ndis"
                            checked={selectedItems.size === ndisTableData.length && ndisTableData.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                          <Label htmlFor="select-all-ndis" className="text-sm font-medium">
                            Select All ({ndisTableData.length} items)
                          </Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Search support items..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-64"
                        />
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg max-h-96 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Select</TableHead>
                            <TableHead>Item Number</TableHead>
                            <TableHead>Service Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>VIC Rate</TableHead>
                            <TableHead>Remote</TableHead>
                            <TableHead>Very Remote</TableHead>
                            <TableHead>Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ndisTableData
                            .filter(item => 
                              searchTerm === '' || 
                              item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.itemNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.registrationGroup.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((item) => (
                            <TableRow key={item.itemNumber}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedItems.has(item.itemNumber)}
                                  onCheckedChange={(checked) => 
                                    handleItemSelection(item.itemNumber, checked as boolean)
                                  }
                                />
                              </TableCell>
                              <TableCell className="font-mono text-xs">{item.itemNumber}</TableCell>
                              <TableCell className="max-w-xs">
                                <div className="truncate" title={item.itemName}>
                                  {item.itemName}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {item.registrationGroup}
                                </Badge>
                              </TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell className="font-medium">${item.priceVIC}</TableCell>
                              <TableCell>${item.remote}</TableCell>
                              <TableCell>${item.veryRemote}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-xs">
                                  {item.type.replace(' Supports', '')}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-4 text-xs text-muted-foreground">
                      <p>Showing VIC standard rates. All state-specific pricing will be imported when items are added to your system.</p>
                      <p>Effective: July 1, 2025 - December 31, 9999</p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" defaultValue="Healthcare CRM System" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Administrator Email</Label>
                  <Input id="admin-email" defaultValue="admin@healthcare.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" />
                </div>
                <Button onClick={() => handleSystemAction("Save Configuration")}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Two-Factor Authentication</Label>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Password Complexity</Label>
                  <Badge variant="default">High</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Login Attempts</Label>
                  <Badge variant="secondary">5 Max</Badge>
                </div>
                <Button variant="outline" onClick={() => handleSystemAction("Update Security")}>
                  <Shield className="h-4 w-4 mr-2" />
                  Update Security
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Audit Logs</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Logs
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter by Type
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2 md:grid-cols-4 text-xs">
                  <Badge variant="outline" className="justify-center">Login Activity</Badge>
                  <Badge variant="outline" className="justify-center">File Access</Badge>
                  <Badge variant="outline" className="justify-center">System Changes</Badge>
                  <Badge variant="outline" className="justify-center">Data Export</Badge>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">User Login: sarah.johnson@healthcare.com</p>
                        <p className="text-xs text-muted-foreground">IP: 192.168.1.105 • 2024-01-15 09:30:45 AM</p>
                      </div>
                    </div>
                    <Badge variant="default">Login</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Client File Accessed: John Smith - Care Plan.pdf</p>
                        <p className="text-xs text-muted-foreground">Accessed by: michael.chen@healthcare.com • 2024-01-15 09:15:22 AM</p>
                      </div>
                    </div>
                    <Badge variant="secondary">File Access</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Employee Document Downloaded: Emma Wilson - Training Certificate.pdf</p>
                        <p className="text-xs text-muted-foreground">Downloaded by: sarah.johnson@healthcare.com • 2024-01-15 09:10:33 AM</p>
                      </div>
                    </div>
                    <Badge variant="secondary">File Download</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}