import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { User, Calendar, Clock, MessageSquareWarning, Phone, Mail, FileText } from "lucide-react";

const openComplaintTickets = [
  {
    id: "CMP-TKT-2024-008",
    client: "John Williams",
    clientId: "CLI-004",
    complaintType: "Service delivery delay",
    priority: "High",
    openedDate: "2024-01-19",
    assignedTo: "Sarah Wilson",
    lastUpdate: "1 hour ago",
    status: "In Progress",
    description: "Client reporting consistent delays in scheduled service visits",
  },
  {
    id: "CMP-TKT-2024-007",
    client: "Emma Davis",
    clientId: "CLI-003",
    complaintType: "Communication issues",
    priority: "Medium",
    openedDate: "2024-01-18",
    assignedTo: "Michael Davis",
    lastUpdate: "3 hours ago",
    status: "Under Review",
    description: "Family not receiving adequate updates about care plan modifications",
  },
  {
    id: "CMP-TKT-2024-006",
    client: "Robert Smith",
    clientId: "CLI-002",
    complaintType: "Billing concerns",
    priority: "Low",
    openedDate: "2024-01-17",
    assignedTo: "Emily Chen",
    lastUpdate: "1 day ago",
    status: "Pending Response",
    description: "Questions about charges for additional services not discussed",
  },
  {
    id: "CMP-TKT-2024-005",
    client: "Maria Garcia",
    clientId: "CLI-001",
    complaintType: "Staff conduct",
    priority: "High",
    openedDate: "2024-01-16",
    assignedTo: "Jessica Brown",
    lastUpdate: "2 days ago",
    status: "Escalated",
    description: "Concerns about professionalism of assigned care worker",
  },
];

export default function ComplaintTicketsByClient() {
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
      case "Escalated": return "destructive";
      case "In Progress": return "default";
      case "Under Review": return "secondary";
      case "Pending Response": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Open Complaint Tickets by Client</h1>
          <p className="text-muted-foreground">
            Active complaint tickets organized by client for efficient tracking and resolution
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
            <p className="text-xs text-muted-foreground">With open complaint tickets</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Open Tickets</CardTitle>
            <MessageSquareWarning className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Across all clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <MessageSquareWarning className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">2</div>
            <p className="text-xs text-muted-foreground">Requires urgent attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8 days</div>
            <p className="text-xs text-muted-foreground">Target: 2 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Complaint Tickets</CardTitle>
          <CardDescription>
            All active complaint tickets requiring resolution, organized by client
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
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="pending">Pending Response</SelectItem>
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
                <TableHead>Complaint Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Opened Date</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openComplaintTickets.map((ticket) => (
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
                    {ticket.complaintType}
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