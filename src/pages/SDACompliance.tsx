import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, AlertTriangle, CheckCircle2, Clock, FileText, Plus, Search, Filter } from "lucide-react";

const SDACompliance = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const complianceItems = [
    {
      id: "C001",
      property: "Sunrise Villa - Unit 1",
      address: "123 Main St, Melbourne VIC",
      checkType: "Fire Safety Inspection",
      dueDate: "15/Feb/2025",
      lastCompleted: "15/Feb/2024",
      status: "Overdue",
      inspector: "Fire Safety Solutions",
      certificationValid: "31/Dec/2024",
      priority: "Critical"
    },
    {
      id: "C002", 
      property: "Garden Court - Unit 3",
      address: "456 Oak Ave, Brisbane QLD",
      checkType: "Accessibility Audit",
      dueDate: "28/Feb/2025",
      lastCompleted: "20/Jan/2025",
      status: "Completed",
      inspector: "Access Consultants QLD",
      certificationValid: "20/Jan/2026",
      priority: "Medium"
    },
    {
      id: "C003",
      property: "Harmony House - Unit 2", 
      address: "789 Pine Rd, Perth WA",
      checkType: "HVAC Maintenance",
      dueDate: "05/Mar/2025",
      lastCompleted: "05/Dec/2024",
      status: "Scheduled",
      inspector: "Cool Climate Services",
      certificationValid: "05/Mar/2025",
      priority: "Medium"
    },
    {
      id: "C004",
      property: "Serenity Place - Unit 1",
      address: "123 River St, Adelaide SA",
      checkType: "Electrical Safety Check", 
      dueDate: "12/Mar/2025",
      lastCompleted: "12/Mar/2024",
      status: "Due Soon",
      inspector: "ElectroSafe SA",
      certificationValid: "12/Mar/2025",
      priority: "High"
    }
  ];

  const maintenanceSchedule = [
    {
      id: "M001",
      property: "All Properties",
      task: "Smoke Detector Testing",
      frequency: "Monthly",
      nextDue: "01/Feb/2025",
      assignedTo: "Maintenance Team A",
      status: "Scheduled",
      estimatedHours: 2
    },
    {
      id: "M002",
      property: "Sunrise Villa",
      task: "Ceiling Hoist Inspection",
      frequency: "Quarterly", 
      nextDue: "15/Feb/2025",
      assignedTo: "Hoist Specialists",
      status: "In Progress",
      estimatedHours: 4
    },
    {
      id: "M003",
      property: "Garden Court",
      task: "Ramp Surface Check",
      frequency: "Bi-annually",
      nextDue: "20/Jun/2025",
      assignedTo: "Access Team",
      status: "Planned",
      estimatedHours: 1
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "Scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "Due Soon":
        return <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>;
      case "Overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case "In Progress":
        return <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>;
      case "Planned":
        return <Badge className="bg-gray-100 text-gray-800">Planned</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "High":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case "Medium":
        return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
      case "Low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SDA Compliance Management</h1>
          <p className="text-muted-foreground">Building safety checks, fire compliance, and maintenance schedules</p>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Inspection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Inspection</DialogTitle>
                <DialogDescription>Schedule a compliance inspection or maintenance task</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="property">Property</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunrise1">Sunrise Villa - Unit 1</SelectItem>
                      <SelectItem value="garden3">Garden Court - Unit 3</SelectItem>
                      <SelectItem value="harmony2">Harmony House - Unit 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="checkType">Inspection Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fire">Fire Safety Inspection</SelectItem>
                      <SelectItem value="electrical">Electrical Safety Check</SelectItem>
                      <SelectItem value="accessibility">Accessibility Audit</SelectItem>
                      <SelectItem value="hvac">HVAC Maintenance</SelectItem>
                      <SelectItem value="plumbing">Plumbing Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="inspector">Inspector/Company</Label>
                  <Input id="inspector" placeholder="Inspector or company name" />
                </div>
                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="biannually">Bi-annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea id="notes" placeholder="Special requirements or notes" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Schedule Inspection</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Log Completion
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue Items</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due This Month</p>
                <p className="text-2xl font-bold text-orange-600">8</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">12</p>
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
                <p className="text-2xl font-bold text-blue-600">87%</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inspections">Safety Inspections</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Critical & Overdue Items</CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceItems.filter(item => item.status === "Overdue" || item.priority === "Critical").map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium text-red-900">{item.checkType}</div>
                        <div className="text-sm text-red-700">{item.property}</div>
                        <div className="text-xs text-red-600">Due: {item.dueDate}</div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(item.status)}
                        <div className="mt-1">{getPriorityBadge(item.priority)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Upcoming This Month</CardTitle>
                <CardDescription>Scheduled inspections and maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceItems.filter(item => item.status === "Scheduled" || item.status === "Due Soon").map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-orange-200 bg-orange-50 rounded-lg">
                      <div>
                        <div className="font-medium text-orange-900">{item.checkType}</div>
                        <div className="text-sm text-orange-700">{item.property}</div>
                        <div className="text-xs text-orange-600">Due: {item.dueDate}</div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(item.status)}
                        <div className="mt-1">{getPriorityBadge(item.priority)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Calendar</CardTitle>
              <CardDescription>Upcoming inspections and maintenance across all properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-center font-medium text-sm p-2 bg-gray-100 rounded">
                    {day}
                  </div>
                ))}
              </div>
              <div className="text-center text-muted-foreground py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4" />
                <p>Interactive calendar view will be implemented here</p>
                <p className="text-sm">Showing all scheduled compliance activities</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safety Inspections</CardTitle>
              <CardDescription>Manage building safety checks and compliance inspections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search inspections..." className="pl-10" />
                  </div>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Inspections</SelectItem>
                    <SelectItem value="fire">Fire Safety</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="accessibility">Accessibility</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Inspection Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Inspector</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.property}</div>
                          <div className="text-sm text-muted-foreground">{item.address}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.checkType}</TableCell>
                      <TableCell>{item.dueDate}</TableCell>
                      <TableCell>{item.inspector}</TableCell>
                      <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Complete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>Regular maintenance tasks and schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Est. Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceSchedule.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.property}</TableCell>
                      <TableCell>{task.task}</TableCell>
                      <TableCell>{task.frequency}</TableCell>
                      <TableCell>{task.nextDue}</TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{task.estimatedHours}h</TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Complete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certifications & Compliance</CardTitle>
              <CardDescription>Track certification validity and compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {complianceItems.map((item) => (
                  <Card key={item.id} className="border-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{item.checkType}</CardTitle>
                      <CardDescription>{item.property}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Valid Until:</span>
                          <span className="font-medium">{item.certificationValid}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Completed:</span>
                          <span className="font-medium">{item.lastCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Inspector:</span>
                          <span className="font-medium">{item.inspector}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {getStatusBadge(item.status)}
                        <Button size="sm" variant="outline">View Certificate</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SDACompliance;