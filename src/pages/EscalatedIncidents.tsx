import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Calendar, User, Clock, FileText, Phone } from "lucide-react";

const escalatedIncidents = [
  {
    id: "INC-2024-001",
    title: "Client fall resulting in injury",
    client: "Sarah Johnson",
    staff: "Emily Chen",
    date: "2024-01-15",
    escalatedDate: "2024-01-16",
    severity: "High",
    status: "Under Investigation",
    priority: "Urgent",
    description: "Client experienced a fall in the bathroom area, resulting in minor injury to left arm.",
  },
  {
    id: "INC-2024-002", 
    title: "Medication administration error",
    client: "Robert Smith",
    staff: "Michael Davis",
    date: "2024-01-14",
    escalatedDate: "2024-01-15",
    severity: "Critical",
    status: "Action Required",
    priority: "Critical",
    description: "Incorrect dosage of medication administered. Medical review required immediately.",
  },
  {
    id: "INC-2024-003",
    title: "Equipment malfunction during care",
    client: "Maria Garcia",
    staff: "Jessica Brown",
    date: "2024-01-13",
    escalatedDate: "2024-01-14",
    severity: "Medium",
    status: "Pending Review",
    priority: "High",
    description: "Wheelchair brake mechanism failed during transfer, no injuries reported.",
  },
];

export default function EscalatedIncidents() {
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
      case "Under Investigation": return "default";
      case "Action Required": return "destructive";
      case "Pending Review": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Escalated Incidents</h1>
          <p className="text-muted-foreground">
            High-priority incidents requiring immediate attention and management oversight
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Escalated</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">1</div>
            <p className="text-xs text-muted-foreground">Requires immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48hrs</div>
            <p className="text-xs text-muted-foreground">Target: 24hrs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NDIS Reportable</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Must report to NDIS</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Escalated Incidents</CardTitle>
          <CardDescription>
            Incidents that have been escalated and require management intervention
          </CardDescription>
          <div className="flex gap-4">
            <Input placeholder="Search incidents..." className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="investigation">Under Investigation</SelectItem>
                <SelectItem value="action">Action Required</SelectItem>
                <SelectItem value="review">Pending Review</SelectItem>
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
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Staff Member</TableHead>
                <TableHead>Escalated Date</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escalatedIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.id}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={incident.description}>
                    {incident.title}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {incident.client}
                    </div>
                  </TableCell>
                  <TableCell>{incident.staff}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {incident.escalatedDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(incident.severity) as any}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(incident.status) as any}>
                      {incident.status}
                    </Badge>
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