import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquareWarning, Calendar, User, Clock, FileText, TrendingUp, Activity, Plus } from "lucide-react";

const recentComplaints = [
  {
    id: "CMP-2024-010",
    title: "Service delivery delay",
    client: "John Williams",
    staff: "Anna Thompson",
    date: "2024-01-20",
    severity: "Medium",
    status: "In Progress",
    category: "Service Quality",
    description: "Client expressed concern about recurring delays in scheduled service delivery",
  },
  {
    id: "CMP-2024-009",
    title: "Communication breakdown with family",
    client: "Emma Davis",
    staff: "David Lee",
    date: "2024-01-19",
    severity: "High",
    status: "Under Review",
    category: "Communication",
    description: "Family members not being adequately informed of care plan changes",
  },
  {
    id: "CMP-2024-008",
    title: "Billing discrepancy concerns",
    client: "Michael Johnson",
    staff: "Sarah Wilson",
    date: "2024-01-18",
    severity: "Low",
    status: "Resolved",
    category: "Billing",
    description: "Client questioned charges on monthly invoice, resolved after explanation",
  },
  {
    id: "CMP-2024-007",
    title: "Staff punctuality issues",
    client: "Lisa Brown",
    staff: "Tom Martinez",
    date: "2024-01-17",
    severity: "Medium",
    status: "Resolved",
    category: "Staff Conduct",
    description: "Concerns raised about consistent lateness of assigned care worker",
  },
];

const complaintsByCategory = [
  { category: "Service Quality", count: 15, trend: "+8%" },
  { category: "Communication", count: 9, trend: "-2%" },
  { category: "Staff Conduct", count: 7, trend: "+15%" },
  { category: "Billing", count: 4, trend: "-25%" },
  { category: "Facilities", count: 3, trend: "0%" },
];

export default function ComplaintsOverview() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "secondary";
      case "In Progress": return "default";
      case "Under Review": return "outline";
      case "Escalated": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Complaints Overview</h1>
          <p className="text-muted-foreground">
            Comprehensive view of all complaints across your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Complaint
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
            <MessageSquareWarning className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">2 escalated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 days</div>
            <p className="text-xs text-muted-foreground">-0.8 days improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.3/5</div>
            <p className="text-xs text-muted-foreground">Post-resolution rating</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Complaints</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Complaints</CardTitle>
              <CardDescription>
                Latest complaints reported across all service areas
              </CardDescription>
              <div className="flex gap-4">
                <Input placeholder="Search complaints..." className="max-w-sm" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="progress">In Progress</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
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
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.id}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {complaint.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {complaint.client}
                        </div>
                      </TableCell>
                      <TableCell>{complaint.staff}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {complaint.date}
                        </div>
                      </TableCell>
                      <TableCell>{complaint.category}</TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(complaint.severity) as any}>
                          {complaint.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(complaint.status) as any}>
                          {complaint.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Complaints by Category</CardTitle>
              <CardDescription>
                Breakdown of complaints by type with monthly trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaintsByCategory.map((item) => (
                  <div key={item.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold">{item.count}</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className={`text-sm ${item.trend.startsWith('+') ? 'text-red-600' : item.trend.startsWith('-') ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {item.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Trends</CardTitle>
              <CardDescription>
                Monthly complaint trends and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Trends Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed charts and analytics coming soon
                </p>
                <Button variant="outline">
                  Generate Trends Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}