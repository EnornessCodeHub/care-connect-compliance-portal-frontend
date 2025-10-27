import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Award, Clock, TrendingUp, FileText, Mail, Phone, MessageSquareWarning } from "lucide-react";

const staffComplaintPerformance = [
  {
    id: "STAFF-001",
    name: "Sarah Wilson",
    role: "Senior Care Coordinator",
    totalComplaints: 8,
    resolved: 7,
    pending: 1,
    avgResolutionTime: "2.5 days",
    satisfactionRating: 4.6,
    specializations: ["Service Quality", "Communication"],
  },
  {
    id: "STAFF-002",
    name: "Michael Davis",
    role: "Care Coordinator",
    totalComplaints: 6,
    resolved: 5,
    pending: 1,
    avgResolutionTime: "3.1 days",
    satisfactionRating: 4.4,
    specializations: ["Billing Issues", "Service Delivery"],
  },
  {
    id: "STAFF-003",
    name: "Emily Chen",
    role: "Frontline Employee",
    totalComplaints: 5,
    resolved: 4,
    pending: 1,
    avgResolutionTime: "2.8 days",
    satisfactionRating: 4.7,
    specializations: ["Client Care", "Family Communication"],
  },
  {
    id: "STAFF-004",
    name: "David Lee",
    role: "Operations Manager",
    totalComplaints: 3,
    resolved: 3,
    pending: 0,
    avgResolutionTime: "1.8 days",
    satisfactionRating: 4.9,
    specializations: ["Operations", "Quality Assurance"],
  },
];

const recentComplaintsByStaff = [
  {
    id: "CMP-2024-010",
    staffMember: "Sarah Wilson",
    client: "John Smith",
    type: "Service delivery concern",
    status: "Resolved",
    date: "2024-01-19",
    resolutionTime: "2 days",
  },
  {
    id: "CMP-2024-009",
    staffMember: "Michael Davis",
    client: "Emma Johnson",
    type: "Billing inquiry",
    status: "In Progress",
    date: "2024-01-18",
    resolutionTime: "3 days",
  },
  {
    id: "CMP-2024-008",
    staffMember: "Emily Chen",
    client: "Robert Brown",
    type: "Communication issue",
    status: "Resolved",
    date: "2024-01-17",
    resolutionTime: "1 day",
  },
];

export default function ComplaintsByStaff() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "secondary";
      case "In Progress": return "default";
      case "Pending": return "outline";
      default: return "outline";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>★</span>
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Complaints by Staff</h1>
          <p className="text-muted-foreground">
            Staff performance tracking and complaint resolution analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Performance Report
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Send Updates
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Handling complaints</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">David Lee</div>
            <p className="text-xs text-muted-foreground">4.9/5 satisfaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Team Resolution</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.6 days</div>
            <p className="text-xs text-muted-foreground">Good performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.65/5</div>
            <p className="text-xs text-muted-foreground">Above target</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Staff Performance</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="workload">Workload Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Staff Complaint Handling Performance</CardTitle>
              <CardDescription>
                Individual staff member complaint resolution performance and metrics
              </CardDescription>
              <div className="flex gap-4">
                <Input placeholder="Search staff members..." className="max-w-sm" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="coordinator">Care Coordinator</SelectItem>
                    <SelectItem value="manager">Operations Manager</SelectItem>
                    <SelectItem value="frontline">Frontline Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Total Complaints</TableHead>
                    <TableHead>Resolved</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Avg. Resolution Time</TableHead>
                    <TableHead>Satisfaction Rating</TableHead>
                    <TableHead>Specializations</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffComplaintPerformance.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-xs text-muted-foreground">{staff.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell className="text-center">{staff.totalComplaints}</TableCell>
                      <TableCell className="text-center text-green-600">{staff.resolved}</TableCell>
                      <TableCell className="text-center text-orange-600">{staff.pending}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {staff.avgResolutionTime}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {renderStars(Math.floor(staff.satisfactionRating))}
                          <span className="text-sm text-muted-foreground ml-1">
                            ({staff.satisfactionRating}/5)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {staff.specializations.map((spec, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
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
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Staff Activity</CardTitle>
              <CardDescription>
                Latest complaints handled by staff members across all categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Complaint Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Resolution Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentComplaintsByStaff.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {complaint.staffMember}
                        </div>
                      </TableCell>
                      <TableCell>{complaint.client}</TableCell>
                      <TableCell>{complaint.type}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(complaint.status) as any}>
                          {complaint.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{complaint.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {complaint.resolutionTime}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workload">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Workload Distribution</CardTitle>
              <CardDescription>
                Current complaint workload distribution across team members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {staffComplaintPerformance.map((staff) => (
                <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-sm text-muted-foreground">{staff.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Active</div>
                      <div className="font-medium">{staff.pending}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="font-medium">{staff.totalComplaints}</div>
                    </div>
                    <Badge variant={staff.pending > 1 ? "destructive" : "secondary"}>
                      {staff.pending > 1 ? "High Load" : "Normal"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}