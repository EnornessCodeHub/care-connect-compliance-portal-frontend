import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, MapPin, Phone, Mail, FileText, Plus, Search, Filter, AlertTriangle, CheckCircle, Clock, UserCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const clients = [
  {
    id: "CLI-001",
    name: "Sarah Johnson",
    ndisNumber: "NDIS-001234567",
    dateOfBirth: "1985-03-15",
    address: "123 Main Street, Melbourne VIC 3000",
    phone: "+61 3 9123 4567",
    email: "sarah.johnson@email.com",
    emergencyContact: "John Johnson - 0412 345 678",
    planType: "Self-Managed",
    status: "Active",
    lastServiceDate: "2024-01-20",
    nextReview: "2024-07-15",
    totalBudget: 45000.00,
    budgetUtilized: 32500.00,
    riskLevel: "Low",
    primarySupport: "Personal Care",
    assignedTo: "Michael Chen",
    caseManager: "Sarah Johnson",
  },
  {
    id: "CLI-002", 
    name: "Robert Smith",
    ndisNumber: "NDIS-002345678",
    dateOfBirth: "1978-11-22",
    address: "456 Oak Avenue, Sydney NSW 2000",
    phone: "+61 2 8234 5678",
    email: "robert.smith@email.com",
    emergencyContact: "Mary Smith - 0423 456 789",
    planType: "Plan Managed",
    status: "Active",
    lastServiceDate: "2024-01-19",
    nextReview: "2024-08-22",
    totalBudget: 52000.00,
    budgetUtilized: 28000.00,
    riskLevel: "Medium",
    primarySupport: "Community Access",
    assignedTo: "Emma Wilson",
    caseManager: "Michael Chen",
  },
  {
    id: "CLI-003",
    name: "Maria Garcia",
    ndisNumber: "NDIS-003456789", 
    dateOfBirth: "1992-07-08",
    address: "789 Pine Road, Brisbane QLD 4000",
    phone: "+61 7 3345 6789",
    email: "maria.garcia@email.com",
    emergencyContact: "Carlos Garcia - 0434 567 890",
    planType: "NDIA Managed",
    status: "Active",
    lastServiceDate: "2024-01-18",
    nextReview: "2024-09-08",
    totalBudget: 38000.00,
    budgetUtilized: 35000.00,
    riskLevel: "High",
    primarySupport: "Nursing Care",
    assignedTo: "Michael Chen",
    caseManager: "James Miller",
  },
  {
    id: "CLI-004",
    name: "John Williams",
    ndisNumber: "NDIS-004567890",
    dateOfBirth: "1965-12-03",
    address: "321 Elm Street, Perth WA 6000",
    phone: "+61 8 6456 7890",
    email: "john.williams@email.com",
    emergencyContact: "Lisa Williams - 0445 678 901",
    planType: "Self-Managed",
    status: "Inactive",
    lastServiceDate: "2023-12-15",
    nextReview: "2024-06-03",
    totalBudget: 41000.00,
    budgetUtilized: 15000.00,
    riskLevel: "Low",
    primarySupport: "Social Support",
    assignedTo: "Emma Wilson",
    caseManager: "Sarah Johnson",
  },
  {
    id: "CLI-005",
    name: "Emma Davis",
    ndisNumber: "NDIS-005678901",
    dateOfBirth: "1989-04-27",
    address: "654 Maple Drive, Adelaide SA 5000",
    phone: "+61 8 8567 8901",
    email: "emma.davis@email.com",
    emergencyContact: "Peter Davis - 0456 789 012",
    planType: "Plan Managed",
    status: "Active",
    lastServiceDate: "2024-01-21",
    nextReview: "2024-10-27",
    totalBudget: 47000.00,
    budgetUtilized: 22000.00,
    riskLevel: "Medium",
    primarySupport: "Physiotherapy",
    assignedTo: "Michael Chen",
    caseManager: "Emma Wilson",
  },
];

const recentActivities = [
  {
    id: "ACT-001",
    client: "Sarah Johnson",
    activity: "Service Agreement Renewal",
    date: "2024-01-20",
    type: "Document",
    status: "Completed",
  },
  {
    id: "ACT-002",
    client: "Robert Smith", 
    activity: "Care Plan Review",
    date: "2024-01-19",
    type: "Assessment",
    status: "In Progress",
  },
  {
    id: "ACT-003",
    client: "Maria Garcia",
    activity: "Risk Assessment Update",
    date: "2024-01-18",
    type: "Assessment", 
    status: "Pending",
  },
];

const Clients = () => {
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const navigate = useNavigate();
  const currentUser = "Michael Chen"; // This would come from auth context in real app
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "secondary";
      case "Inactive": return "outline";
      case "Suspended": return "destructive";
      default: return "outline";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "outline";
    }
  };

  const getPlanTypeColor = (planType: string) => {
    switch (planType) {
      case "Self-Managed": return "default";
      case "Plan Managed": return "secondary";
      case "NDIA Managed": return "outline";
      default: return "outline";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const calculateBudgetPercentage = (utilized: number, total: number) => {
    return Math.round((utilized / total) * 100);
  };

  // Filter clients based on assignment
  const getFilteredClients = () => {
    switch (assignmentFilter) {
      case "assigned-to-me":
        return clients.filter(client => client.assignedTo === currentUser);
      case "my-cases":
        return clients.filter(client => client.caseManager === currentUser);
      default:
        return clients;
    }
  };

  const filteredClients = getFilteredClients();
  const activeClients = filteredClients.filter(client => client.status === "Active").length;
  const totalBudget = filteredClients.reduce((sum, client) => sum + client.totalBudget, 0);
  const utilizedBudget = filteredClients.reduce((sum, client) => sum + client.budgetUtilized, 0);
  const highRiskClients = filteredClients.filter(client => client.riskLevel === "High").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Clients</h1>
          <p className="text-muted-foreground">
            View and manage all client records, documents, and information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredClients.length}</div>
            <p className="text-xs text-muted-foreground">{activeClients} active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">Across all plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilized</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(utilizedBudget)}</div>
            <p className="text-xs text-muted-foreground">{Math.round((utilizedBudget/totalBudget)*100)}% utilization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highRiskClients}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Clients</TabsTrigger>
          <TabsTrigger value="active">Active Clients</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Clients</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Clients</CardTitle>
              <CardDescription>
                Complete list of clients with their details and current status
              </CardDescription>
              <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search clients..." className="pl-8" />
                </div>
                <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Assignment filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="assigned-to-me">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Assigned to Me
                      </div>
                    </SelectItem>
                    <SelectItem value="my-cases">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        My Cases
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="self">Self-Managed</SelectItem>
                    <SelectItem value="plan">Plan Managed</SelectItem>
                    <SelectItem value="ndia">NDIA Managed</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>NDIS Number</TableHead>
                    <TableHead>Plan Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Case Manager</TableHead>
                    <TableHead>Budget Utilization</TableHead>
                    <TableHead>Next Review</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 cursor-pointer hover:text-primary" onClick={() => navigate(`/clients/${client.id}`)}>
                          <User className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-xs text-muted-foreground">{client.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{client.ndisNumber}</TableCell>
                      <TableCell>
                        <Badge variant={getPlanTypeColor(client.planType) as any}>
                          {client.planType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(client.status) as any}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRiskColor(client.riskLevel) as any}>
                          {client.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          <span className="text-sm">{client.assignedTo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="text-sm">{client.caseManager}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-sm">
                            {formatCurrency(client.budgetUtilized)} / {formatCurrency(client.totalBudget)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ({calculateBudgetPercentage(client.budgetUtilized, client.totalBudget)}%)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {client.nextReview}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/clients/${client.id}`)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Clients</CardTitle>
              <CardDescription>
                Clients currently receiving services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Active Clients</h3>
                <p className="text-muted-foreground">
                  {activeClients} clients currently receiving active services
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Clients</CardTitle>
              <CardDescription>
                Clients not currently receiving services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Inactive Clients</h3>
                <p className="text-muted-foreground">
                  Clients who have temporarily suspended or completed services
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Latest client-related activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div>
                        <div className="font-medium">{activity.activity}</div>
                        <div className="text-sm text-muted-foreground">{activity.client}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{activity.type}</Badge>
                      <Badge variant={activity.status === "Completed" ? "secondary" : activity.status === "In Progress" ? "default" : "outline"}>
                        {activity.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground">{activity.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Clients;