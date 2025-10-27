import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, FileText, Plus, Search, Filter, Edit, Eye, AlertCircle } from "lucide-react";

const SDAtenantRegister = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const tenants = [
    {
      id: "T001",
      name: "Sarah Johnson",
      ndisNumber: "1234567890",
      email: "sarah.johnson@email.com",
      phone: "0412 345 678",
      property: "Sunrise Villa - Unit 1",
      address: "123 Main St, Melbourne VIC",
      leaseStart: "01/Jan/2024",
      leaseEnd: "31/Dec/2024",
      weeklyRent: "$2,100",
      status: "Active",
      supportLevel: "High Physical Support",
      emergencyContact: "Mary Johnson - 0455 123 456",
      lastReview: "15/Dec/2024"
    },
    {
      id: "T002", 
      name: "Michael Chen",
      ndisNumber: "0987654321",
      email: "michael.chen@email.com",
      phone: "0433 987 654",
      property: "Garden Court - Unit 3",
      address: "456 Oak Ave, Brisbane QLD",
      leaseStart: "15/Feb/2025",
      leaseEnd: "14/Feb/2026",
      weeklyRent: "$1,850",
      status: "Application",
      supportLevel: "Medium Support",
      emergencyContact: "Jenny Chen - 0488 987 654",
      lastReview: "10/Jan/2025"
    },
    {
      id: "T003",
      name: "David Williams",
      ndisNumber: "5555666777",
      email: "david.williams@email.com", 
      phone: "0422 555 888",
      property: "Harmony House - Unit 2",
      address: "789 Pine Rd, Perth WA",
      leaseStart: "01/Oct/2024",
      leaseEnd: "30/Sep/2025",
      weeklyRent: "$1,950",
      status: "Review Due",
      supportLevel: "Fully Accessible",
      emergencyContact: "Lisa Williams - 0466 555 888",
      lastReview: "01/Oct/2024"
    }
  ];

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.ndisNumber.includes(searchTerm) ||
                         tenant.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || tenant.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "Application":
        return <Badge className="bg-blue-100 text-blue-800">Application</Badge>;
      case "Review Due":
        return <Badge className="bg-orange-100 text-orange-800">Review Due</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SDA Tenant Register</h1>
          <p className="text-muted-foreground">Manage NDIS participant tenancies and lease agreements</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
              <DialogDescription>Enter tenant details and lease information</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Details</TabsTrigger>
                <TabsTrigger value="lease">Lease Information</TabsTrigger>
                <TabsTrigger value="support">Support Details</TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="ndis">NDIS Number</Label>
                    <Input id="ndis" placeholder="NDIS participant number" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="email@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="0400 000 000" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input id="emergency" placeholder="Name and phone number" />
                </div>
              </TabsContent>
              <TabsContent value="lease" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="property">Property</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunrise1">Sunrise Villa - Unit 1</SelectItem>
                        <SelectItem value="garden3">Garden Court - Unit 3</SelectItem>
                        <SelectItem value="harmony2">Harmony House - Unit 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rent">Weekly Rent</Label>
                    <Input id="rent" placeholder="$0.00" />
                  </div>
                  <div>
                    <Label htmlFor="leaseStart">Lease Start Date</Label>
                    <Input id="leaseStart" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="leaseEnd">Lease End Date</Label>
                    <Input id="leaseEnd" type="date" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Lease Notes</Label>
                  <Textarea id="notes" placeholder="Additional lease information" />
                </div>
              </TabsContent>
              <TabsContent value="support" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supportLevel">Support Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select support level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Physical Support</SelectItem>
                        <SelectItem value="medium">Medium Support</SelectItem>
                        <SelectItem value="accessible">Fully Accessible</SelectItem>
                        <SelectItem value="intellectual">Intellectual Disability Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="silService">SIL Service</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="SIL service required?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes - SIL Required</SelectItem>
                        <SelectItem value="no">No - Independent Living</SelectItem>
                        <SelectItem value="partial">Partial SIL Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="supportNotes">Support Requirements</Label>
                  <Textarea id="supportNotes" placeholder="Specific support needs and requirements" />
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Add Tenant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tenants</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Leases</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reviews Due</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Management</CardTitle>
          <CardDescription>Search and manage tenant records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, NDIS number, or property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Application">Application</SelectItem>
                <SelectItem value="Review Due">Review Due</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>NDIS Number</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Lease Period</TableHead>
                <TableHead>Weekly Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tenant.name}</div>
                      <div className="text-sm text-muted-foreground">{tenant.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{tenant.ndisNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tenant.property}</div>
                      <div className="text-sm text-muted-foreground">{tenant.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{tenant.leaseStart} -</div>
                      <div>{tenant.leaseEnd}</div>
                    </div>
                  </TableCell>
                  <TableCell>{tenant.weeklyRent}</TableCell>
                  <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SDAtenantRegister;