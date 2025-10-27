import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket, User, Calendar, Clock, MessageSquareWarning, Plus, Filter, FileText, MessageSquare } from "lucide-react";

const complaintTickets = [
  {
    id: "CMP-TKT-2024-012",
    type: "Complaint",
    title: "Service quality concerns",
    client: "Emma Davis",
    assignee: "Sarah Wilson",
    priority: "High",
    status: "Open",
    created: "2024-01-20",
    lastUpdate: "1 hour ago",
    category: "Service Quality",
    description: "Client expressing ongoing concerns about consistency of care delivery",
  },
  {
    id: "CMP-TKT-2024-011",
    type: "Complaint",
    title: "Family communication issues",
    client: "John Williams",
    assignee: "Michael Davis",
    priority: "Medium",
    status: "In Progress",
    created: "2024-01-19",
    lastUpdate: "3 hours ago",
    category: "Communication",
    description: "Family not receiving adequate updates about care plan changes",
  },
  {
    id: "CMP-TKT-2024-010",
    type: "Complaint",
    title: "Billing inquiry resolved",
    client: "Lisa Brown",
    assignee: "Emily Chen",
    priority: "Low",
    status: "Resolved",
    created: "2024-01-18",
    lastUpdate: "1 day ago",
    category: "Billing",
    description: "Questions about additional service charges, resolved with explanation",
  },
  {
    id: "CMP-TKT-2024-009",
    type: "Feedback",
    title: "Staff appreciation feedback",
    client: "Michael Johnson",
    assignee: "David Lee",
    priority: "Low",
    status: "Closed",
    created: "2024-01-17",
    lastUpdate: "2 days ago",
    category: "Positive Feedback",
    description: "Client expressing satisfaction with recent improvements in service",
  },
];

export default function ComplaintTickets() {
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
      case "Resolved": return "secondary";
      case "Closed": return "secondary";
      default: return "outline";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Complaint": return "default";
      case "Feedback": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Complaint Tickets</h1>
          <p className="text-muted-foreground">
            Centralized ticket management system for complaints and client feedback
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
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
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
            <MessageSquareWarning className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Needs urgent attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.1 days</div>
            <p className="text-xs text-muted-foreground">Within SLA</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="complaints">Complaints Only</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Only</TabsTrigger>
          <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Complaint Tickets</CardTitle>
              <CardDescription>
                Complete list of complaint and feedback tickets across all categories
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
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
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
                    <SelectItem value="sarah">Sarah Wilson</SelectItem>
                    <SelectItem value="michael">Michael Davis</SelectItem>
                    <SelectItem value="emily">Emily Chen</SelectItem>
                    <SelectItem value="david">David Lee</SelectItem>
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
                  {complaintTickets.map((ticket) => (
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

        <TabsContent value="complaints">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Tickets Only</CardTitle>
              <CardDescription>
                Tickets specifically related to client complaints and concerns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquareWarning className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Complaint Tickets</h3>
                <p className="text-muted-foreground">
                  Filtered view showing only complaint-related tickets
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Tickets Only</CardTitle>
              <CardDescription>
                Tickets specifically related to client feedback and suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Feedback Tickets</h3>
                <p className="text-muted-foreground">
                  Filtered view showing only feedback and positive comments
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
                Complaint tickets assigned to you for resolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">My Tickets</h3>
                <p className="text-muted-foreground">
                  Personal view of complaint tickets assigned to your account
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}