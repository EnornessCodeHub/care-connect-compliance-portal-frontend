import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CheckCircle, Calendar, Clock, User, FileText, Download, TrendingUp, ThumbsUp } from "lucide-react";

const resolvedComplaints = [
  {
    id: "CMP-2024-003",
    title: "Service scheduling flexibility request",
    client: "Lisa Brown",
    staff: "Tom Martinez",
    openedDate: "2024-01-12",
    resolvedDate: "2024-01-14",
    severity: "Low",
    category: "Service Quality",
    resolutionTime: "2 days",
    satisfactionRating: 5,
    outcome: "Schedule adjusted to client preferences",
  },
  {
    id: "CMP-2024-002",
    title: "Billing inquiry resolved",
    client: "Michael Johnson",
    staff: "Sarah Wilson",
    openedDate: "2024-01-10",
    resolvedDate: "2024-01-11",
    severity: "Low",
    category: "Billing",
    resolutionTime: "1 day",
    satisfactionRating: 4,
    outcome: "Billing explanation provided, charges clarified",
  },
  {
    id: "CMP-2024-001",
    title: "Staff communication improvement",
    client: "Emma Davis",
    staff: "David Lee",
    openedDate: "2024-01-08",
    resolvedDate: "2024-01-11",
    severity: "Medium",
    category: "Communication",
    resolutionTime: "3 days",
    satisfactionRating: 5,
    outcome: "Communication protocol updated, family satisfied",
  },
  {
    id: "CMP-2023-095",
    title: "Care plan customization",
    client: "John Williams",
    staff: "Anna Thompson",
    openedDate: "2023-12-28",
    resolvedDate: "2024-01-03",
    severity: "Medium",
    category: "Service Quality",
    resolutionTime: "6 days",
    satisfactionRating: 4,
    outcome: "Care plan modified to better suit client needs",
  },
];

export default function ResolvedComplaints() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
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
          <h1 className="text-3xl font-bold mb-2">Resolved Complaints</h1>
          <p className="text-muted-foreground">
            Successfully resolved complaints with client satisfaction ratings and outcomes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.0 days</div>
            <p className="text-xs text-muted-foreground">-0.5 days improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5/5</div>
            <p className="text-xs text-muted-foreground">+0.1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">Within SLA targets</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently Resolved Complaints</CardTitle>
          <CardDescription>
            Complete history of resolved complaints with outcomes and client feedback
          </CardDescription>
          <div className="flex gap-4">
            <Input placeholder="Search complaints..." className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="service">Service Quality</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="staff">Staff Conduct</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
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
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Resolution Time</TableHead>
                <TableHead>Resolved Date</TableHead>
                <TableHead>Satisfaction</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resolvedComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{complaint.id}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={complaint.outcome}>
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
                    <Badge variant="outline">{complaint.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(complaint.severity) as any}>
                      {complaint.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {complaint.resolutionTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {complaint.resolvedDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {renderStars(complaint.satisfactionRating)}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({complaint.satisfactionRating}/5)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
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