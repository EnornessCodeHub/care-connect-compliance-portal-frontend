import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Calendar, User, FileText, Download, Mail, Phone, Upload, Clock, CheckCircle } from "lucide-react";

const expiredDocuments = [
  {
    id: "DOC-EXP-001",
    client: "Sarah Johnson",
    clientId: "CLI-001",
    documentType: "Risk Assessment",
    expiryDate: "2024-01-15",
    daysOverdue: 6,
    lastReminder: "2024-01-10",
    status: "Overdue",
    priority: "High",
    renewalRequired: true,
  },
  {
    id: "DOC-EXP-002",
    client: "Robert Smith",
    clientId: "CLI-002",
    documentType: "Service Agreement",
    expiryDate: "2024-01-18",
    daysOverdue: 3,
    lastReminder: "2024-01-15",
    status: "Overdue",
    priority: "Critical",
    renewalRequired: true,
  },
  {
    id: "DOC-EXP-003",
    client: "Maria Garcia",
    clientId: "CLI-003",
    documentType: "Insurance Certificate",
    expiryDate: "2024-01-25",
    daysOverdue: 0,
    lastReminder: null,
    status: "Expiring Soon",
    priority: "Medium",
    renewalRequired: true,
  },
  {
    id: "DOC-EXP-004",
    client: "John Williams",
    clientId: "CLI-004",
    documentType: "Care Plan Review",
    expiryDate: "2024-01-30",
    daysOverdue: 0,
    lastReminder: null,
    status: "Expiring Soon",
    priority: "Medium",
    renewalRequired: false,
  },
  {
    id: "DOC-EXP-005",
    client: "Emma Davis",
    clientId: "CLI-005",
    documentType: "Risk Assessment",
    expiryDate: "2024-01-12",
    daysOverdue: 9,
    lastReminder: "2024-01-08",
    status: "Overdue",
    priority: "High",
    renewalRequired: true,
  },
];

const documentTypes = [
  "Risk Assessment",
  "Service Agreement", 
  "Insurance Certificate",
  "Care Plan Review",
  "Medical Assessment",
  "Vaccination Record",
  "Emergency Contact Form",
  "Support Plan",
];

export default function ExpiredDocuments() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Overdue": return "destructive";
      case "Expiring Soon": return "default";
      case "Renewed": return "secondary";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "outline";
    }
  };

  const overdueCount = expiredDocuments.filter(doc => doc.status === "Overdue").length;
  const expiringSoonCount = expiredDocuments.filter(doc => doc.status === "Expiring Soon").length;
  const criticalCount = expiredDocuments.filter(doc => doc.priority === "Critical").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Expired Documents</h1>
          <p className="text-muted-foreground">
            Monitor and manage client documents requiring renewal or updates
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Documents
          </Button>
        </div>
      </div>

      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Compliance Alert:</strong> {overdueCount} documents are overdue and {criticalCount} require immediate attention.
          Failure to maintain current documents may affect service delivery compliance.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Documents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">Requires immediate action</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiringSoonCount}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Urgent renewal needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">Current documentation</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expired & Expiring Documents</CardTitle>
          <CardDescription>
            Client documents requiring renewal or immediate attention
          </CardDescription>
          <div className="flex gap-4">
            <Input placeholder="Search by client name or document type..." className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="renewed">Renewed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
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
                <TableHead>Document ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Reminder</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">{document.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{document.client}</div>
                        <div className="text-xs text-muted-foreground">{document.clientId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{document.documentType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className={document.status === "Overdue" ? "text-red-600 font-medium" : ""}>
                        {document.expiryDate}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {document.daysOverdue > 0 ? (
                      <span className="text-red-600 font-medium">{document.daysOverdue} days</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(document.priority) as any}>
                      {document.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(document.status) as any}>
                      {document.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {document.lastReminder ? (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {document.lastReminder}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">None sent</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-1" />
                        Remind
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common document management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Send Bulk Reminders
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Expiry Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload Documents
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Set Renewal Reminders
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents by Type</CardTitle>
            <CardDescription>Breakdown of expired documents by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="font-medium">Risk Assessment</span>
              </div>
              <div className="text-right">
                <div className="font-medium">2 expired</div>
                <div className="text-xs text-muted-foreground">High priority</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="font-medium">Service Agreement</span>
              </div>
              <div className="text-right">
                <div className="font-medium">1 expired</div>
                <div className="text-xs text-muted-foreground">Critical priority</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span className="font-medium">Insurance Certificate</span>
              </div>
              <div className="text-right">
                <div className="font-medium">1 expiring</div>
                <div className="text-xs text-muted-foreground">4 days remaining</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span className="font-medium">Care Plan Review</span>
              </div>
              <div className="text-right">
                <div className="font-medium">1 expiring</div>
                <div className="text-xs text-muted-foreground">9 days remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}