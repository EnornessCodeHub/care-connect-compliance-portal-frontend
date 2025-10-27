import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { User, Calendar, Clock, AlertTriangle, Phone, Mail, FileText } from "lucide-react";

const openTickets = [
  {
    id: "TKT-2024-001",
    client: "Sarah Johnson",
    clientId: "CLI-001",
    incidentType: "Fall with injury",
    priority: "High",
    openedDate: "2024-01-18",
    assignedTo: "Emily Chen",
    lastUpdate: "2 hours ago",
    status: "In Progress",
    description: "Client experienced fall in bathroom, minor injury to left arm",
  },
  {
    id: "TKT-2024-002", 
    client: "Robert Smith",
    clientId: "CLI-002",
    incidentType: "Medication issue",
    priority: "Critical",
    openedDate: "2024-01-17",
    assignedTo: "Michael Davis",
    lastUpdate: "30 minutes ago",
    status: "Urgent Review",
    description: "Incorrect medication dosage administered",
  },
  {
    id: "TKT-2024-003",
    client: "Maria Garcia", 
    clientId: "CLI-003",
    incidentType: "Equipment malfunction",
    priority: "Medium",
    openedDate: "2024-01-16",
    assignedTo: "Jessica Brown",
    lastUpdate: "4 hours ago",
    status: "Awaiting Parts",
    description: "Wheelchair brake mechanism failed during transfer",
  },
  {
    id: "TKT-2024-004",
    client: "John Williams",
    clientId: "CLI-004", 
    incidentType: "Behavioral incident",
    priority: "Medium",
    openedDate: "2024-01-15",
    assignedTo: "Sarah Wilson",
    lastUpdate: "1 day ago",
    status: "Assessment",
    description: "Client exhibited aggressive behavior towards other residents",
  },
];

export default function OpenTicketsByClient() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Urgent Review": return "destructive";
      case "In Progress": return "default";
      case "Assessment": return "secondary";
      case "Awaiting Parts": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Open Tickets by Client</h1>
          <p className="text-muted-foreground">
            Active incident tickets organized by client for easy tracking and resolution
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Export Client Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">With open tickets</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Open Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Across all clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">1</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 days</div>
            <p className="text-xs text-muted-foreground">Target: 2 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Incident Tickets</CardTitle>
          <CardDescription>
            All active incident tickets requiring resolution, organized by client
          </CardDescription>
          <div className="flex gap-4">
            <Input placeholder="Search by client name or ticket ID..." className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="urgent">Urgent Review</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="awaiting">Awaiting Parts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Incident Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Opened Date</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{ticket.client}</div>
                        <div className="text-xs text-muted-foreground">{ticket.clientId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate" title={ticket.description}>
                    {ticket.incidentType}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(ticket.priority) as any}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {ticket.openedDate}
                    </div>
                  </TableCell>
                  <TableCell>{ticket.assignedTo}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(ticket.status) as any}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {ticket.lastUpdate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
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
    </div>
  );
}