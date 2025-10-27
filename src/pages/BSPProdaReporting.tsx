import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Send, FileText, CheckCircle2, Clock, Plus, Download, Upload } from "lucide-react";

const BSPProdaReporting = () => {
  const [activeTab, setActiveTab] = useState("reports");

  const reports = [
    { id: "QR2024Q4", type: "Quarterly BSP Report", period: "Q4 2024", participants: 15, status: "Overdue", dueDate: "31/Jan/2025", submissionDate: null },
    { id: "MRP202501", type: "Monthly Restrictive Practice", period: "January 2025", participants: 8, status: "Ready", dueDate: "05/Feb/2025", submissionDate: null },
    { id: "QR2024Q3", type: "Quarterly BSP Report", period: "Q3 2024", participants: 14, status: "Submitted", dueDate: "31/Oct/2024", submissionDate: "29/Oct/2024" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted": return <Badge className="bg-green-100 text-green-800">Submitted</Badge>;
      case "Ready": return <Badge className="bg-blue-100 text-blue-800">Ready</Badge>;
      case "Overdue": return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case "Draft": return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PRODA Reporting</h1>
          <p className="text-muted-foreground">NDIS Commission behaviour support reporting integration</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Access PRODA
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reports Due</p>
                <p className="text-2xl font-bold text-red-600">2</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ready to Submit</p>
                <p className="text-2xl font-bold text-blue-600">1</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Submitted (YTD)</p>
                <p className="text-2xl font-bold text-green-600">4</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold text-green-600">90%</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Report Queue</TabsTrigger>
          <TabsTrigger value="submission">PRODA Submission</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NDIS Commission Reports</CardTitle>
              <CardDescription>Manage behaviour support and restrictive practice reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.type}</TableCell>
                      <TableCell>{report.period}</TableCell>
                      <TableCell>{report.participants}</TableCell>
                      <TableCell>{report.dueDate}</TableCell>
                      <TableCell>{report.submissionDate || "Not submitted"}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            {report.status === "Ready" ? "Submit" : "Edit"}
                          </Button>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>PRODA Portal Integration</CardTitle>
              <CardDescription>Direct submission to NDIS Commission via PRODA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Send className="h-12 w-12 mx-auto mb-4" />
                <p>PRODA integration interface will be displayed here</p>
                <p className="text-sm">Secure submission portal for NDIS Commission reports</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Dashboard</CardTitle>
              <CardDescription>Track submission deadlines and compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Clock className="h-12 w-12 mx-auto mb-4" />
                <p>Compliance tracking and alerts will be displayed here</p>
                <p className="text-sm">Automated reminders, deadline tracking, and compliance metrics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BSPProdaReporting;