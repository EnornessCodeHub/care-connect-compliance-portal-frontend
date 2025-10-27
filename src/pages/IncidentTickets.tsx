import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket, User, Calendar, Clock, AlertTriangle, Plus, Filter, FileText, MessageSquare } from "lucide-react";

const tickets = [
  {
    id: "TKT-2024-015",
    type: "Incident",
    title: "Equipment malfunction in Room 12",
    client: "Emma Davis",
    assignee: "David Lee",
    priority: "High",
    status: "Open",
    created: "2024-01-20",
    lastUpdate: "2 hours ago",
    category: "Equipment",
    description: "Bed adjustment mechanism stuck, client unable to adjust position",
  },
  {
    id: "TKT-2024-014",
    type: "Incident",
    title: "Medication delivery delay",
    client: "John Williams",
    assignee: "Anna Thompson",
    priority: "Medium",
    status: "In Progress",
    created: "2024-01-19",
    lastUpdate: "4 hours ago",
    category: "Medication",
    description: "Evening medication round delayed due to pharmacy supply issue",
  },
  {
    id: "TKT-2024-013",
    type: "Incident",
    title: "Client transport cancellation",
    client: "Lisa Brown",
    assignee: "Tom Martinez",
    priority: "Low",
    status: "Resolved",
    created: "2024-01-18",
    lastUpdate: "1 day ago",
    category: "Transport",
    description: "Medical appointment transport cancelled last minute, rescheduled",
  },
  {
    id: "TKT-2024-012",
    type: "Complaint",
    title: "Food quality concern",
    client: "Michael Johnson",
    assignee: "Sarah Wilson",
    priority: "Medium",
    status: "Under Review",
    created: "2024-01-17",
    lastUpdate: "6 hours ago",
    category: "Catering",
    description: "Client expressed dissatisfaction with meal temperature and variety",
  },
];

export default function IncidentTickets() {
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
      case "Open": return "destructive";
      case "In Progress": return "default";
      case "Under Review": return "secondary";
      case "Resolved": return "secondary";
      default: return "outline";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Incident": return "default";
      case "Complaint": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Incident Tickets</h1>
          <p className="text-muted-foreground">
            Centralized ticket management system for incidents and complaints
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5 days</div>
            <p className="text-xs text-muted-foreground">Within SLA</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="incidents">Incidents Only</TabsTrigger>
          <TabsTrigger value="complaints">Complaints Only</TabsTrigger>
          <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Tickets</CardTitle>
              <CardDescription>
                Complete list of incident and complaint tickets across all categories
              </CardDescription>
              <div className="flex gap-4">
                <Input placeholder="Search tickets..." className="max-w-sm" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="progress">In Progress</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectValue placeholder="Filter by assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    <SelectItem value="david">David Lee</SelectItem>
                    <SelectItem value="anna">Anna Thompson</SelectItem>
                    <SelectItem value="tom">Tom Martinez</SelectItem>
                    <SelectItem value="sarah">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeColor(ticket.type) as any}>
                          {ticket.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={ticket.description}>
                        {ticket.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {ticket.client}
                        </div>
                      </TableCell>
                      <TableCell>{ticket.assignee}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(ticket.priority) as any}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(ticket.status) as any}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {ticket.created}
                        </div>
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
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Comment
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

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Incident Tickets Only</CardTitle>
              <CardDescription>
                Tickets specifically related to incident management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Incident Tickets</h3>
                <p className="text-muted-foreground">
                  Filtered view showing only incident-related tickets
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Tickets Only</CardTitle>
              <CardDescription>
                Tickets specifically related to complaint management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Complaint Tickets</h3>
                <p className="text-muted-foreground">
                  Filtered view showing only complaint-related tickets
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-tickets">
          <Card>
            <CardHeader>
              <CardTitle>My Assigned Tickets</CardTitle>
              <CardDescription>
                Tickets assigned to you for resolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">My Tickets</h3>
                <p className="text-muted-foreground">
                  Personal view of tickets assigned to your account
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}