import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Calendar, Clock, AlertTriangle, FileText, Upload, CheckCircle, XCircle } from "lucide-react";

const ndisReportableIncidents = [
  {
    id: "NDIS-2024-001",
    incidentId: "INC-2024-001",
    title: "Client fall resulting in injury requiring medical attention",
    client: "Sarah Johnson",
    date: "2024-01-15",
    reportedDate: "2024-01-15",
    severity: "High",
    category: "Injury",
    reportingStatus: "Submitted",
    ndisReference: "NDIS-REF-240115-001",
    reportedBy: "Emily Chen",
    followUpRequired: true,
    deadline: "2024-01-17",
  },
  {
    id: "NDIS-2024-002",
    incidentId: "INC-2024-002",
    title: "Medication administration error - incorrect dosage",
    client: "Robert Smith",
    date: "2024-01-14",
    reportedDate: "2024-01-14",
    severity: "Critical",
    category: "Medication Error",
    reportingStatus: "Submitted",
    ndisReference: "NDIS-REF-240114-001",
    reportedBy: "Michael Davis",
    followUpRequired: true,
    deadline: "2024-01-16",
  },
  {
    id: "NDIS-2024-003",
    incidentId: "INC-2024-008",
    title: "Allegation of inappropriate conduct",
    client: "Maria Garcia",
    date: "2024-01-12",
    reportedDate: "2024-01-13",
    severity: "Critical",
    category: "Allegation",
    reportingStatus: "Under Review",
    ndisReference: "NDIS-REF-240113-001",
    reportedBy: "Jessica Brown",
    followUpRequired: true,
    deadline: "2024-01-14",
  },
  {
    id: "NDIS-2024-004",
    incidentId: "INC-2024-005",
    title: "Unexplained injury discovered during care",
    client: "John Williams",
    date: "2024-01-10",
    reportedDate: "2024-01-11",
    severity: "High",
    category: "Unexplained Injury",
    reportingStatus: "Pending Submission",
    ndisReference: "PENDING",
    reportedBy: "Sarah Wilson",
    followUpRequired: true,
    deadline: "2024-01-12",
  },
];

export default function NDISReportable() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "default";
      default: return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted": return "secondary";
      case "Under Review": return "default";
      case "Pending Submission": return "destructive";
      case "Overdue": return "destructive";
      default: return "outline";
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">NDIS Reportable Incidents</h1>
          <p className="text-muted-foreground">
            Incidents requiring mandatory reporting to the NDIS Commission
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New NDIS Report
          </Button>
        </div>
      </div>

      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> All NDIS reportable incidents must be reported within 24 hours. 
          Failure to report may result in compliance penalties.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">1</div>
            <p className="text-xs text-muted-foreground">Requires immediate action</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">All within deadline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <XCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">NDIS Commission review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98%</div>
            <p className="text-xs text-muted-foreground">Last 12 months</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>NDIS Reportable Incidents</CardTitle>
          <CardDescription>
            All incidents that meet NDIS Commission reporting criteria
          </CardDescription>
          <div className="flex gap-4">
            <Input placeholder="Search by incident ID or client..." className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="pending">Pending Submission</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="injury">Injury</SelectItem>
                <SelectItem value="medication">Medication Error</SelectItem>
                <SelectItem value="allegation">Allegation</SelectItem>
                <SelectItem value="unexplained">Unexplained Injury</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NDIS ID</TableHead>
                <TableHead>Incident ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>NDIS Reference</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ndisReportableIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.id}</TableCell>
                  <TableCell>{incident.incidentId}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={incident.title}>
                    {incident.title}
                  </TableCell>
                  <TableCell>{incident.client}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {incident.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{incident.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(incident.severity) as any}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(incident.reportingStatus) as any}>
                      {incident.reportingStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-2 ${isOverdue(incident.deadline) ? 'text-red-600' : ''}`}>
                      <Clock className="h-4 w-4" />
                      {incident.deadline}
                      {isOverdue(incident.deadline) && (
                        <Badge variant="destructive" className="ml-1">Overdue</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {incident.ndisReference}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {incident.reportingStatus === "Pending Submission" && (
                        <Button size="sm">
                          <Upload className="h-4 w-4 mr-1" />
                          Submit
                        </Button>
                      )}
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