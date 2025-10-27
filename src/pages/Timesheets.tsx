import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Calendar, User, CheckCircle, XCircle, AlertTriangle, FileText, Download, Play, Square, Plus, Timer } from "lucide-react";

const timesheets = [
  {
    id: "TS-2024-001",
    employee: "Sarah Wilson",
    employeeId: "EMP-001",
    weekEnding: "2024-01-21",
    totalHours: 38.5,
    regularHours: 35.0,
    overtimeHours: 3.5,
    status: "Approved",
    submittedDate: "2024-01-22",
    approvedBy: "Manager",
    client: "Multiple Clients",
    payRate: 28.50,
  },
  {
    id: "TS-2024-002",
    employee: "Michael Davis",
    employeeId: "EMP-002",
    weekEnding: "2024-01-21",
    totalHours: 40.0,
    regularHours: 40.0,
    overtimeHours: 0.0,
    status: "Pending Review",
    submittedDate: "2024-01-22",
    approvedBy: null,
    client: "Sarah Johnson",
    payRate: 26.75,
  },
  {
    id: "TS-2024-003",
    employee: "Emily Chen",
    employeeId: "EMP-003",
    weekEnding: "2024-01-21",
    totalHours: 35.0,
    regularHours: 35.0,
    overtimeHours: 0.0,
    status: "Draft",
    submittedDate: null,
    approvedBy: null,
    client: "Robert Smith",
    payRate: 29.00,
  },
  {
    id: "TS-2024-004",
    employee: "David Lee",
    employeeId: "EMP-004",
    weekEnding: "2024-01-21",
    totalHours: 42.5,
    regularHours: 38.0,
    overtimeHours: 4.5,
    status: "Rejected",
    submittedDate: "2024-01-20",
    approvedBy: "Manager",
    client: "Maria Garcia",
    payRate: 31.25,
  },
];

const activeShifts = [
  {
    id: "SHIFT-001",
    employee: "Anna Thompson",
    client: "John Williams",
    clockInTime: "07:30",
    location: "Client Home",
    duration: "3h 45m",
    status: "In Progress",
  },
  {
    id: "SHIFT-002",
    employee: "Tom Martinez",
    client: "Emma Davis",
    clockInTime: "09:15",
    location: "Community Center",
    duration: "2h 30m",
    status: "In Progress",
  },
  {
    id: "SHIFT-003",
    employee: "Jessica Brown",
    client: "Lisa Brown",
    clockInTime: "10:00",
    location: "Client Home",
    duration: "1h 45m",
    status: "Break",
  },
];

const weeklySchedule = [
  {
    day: "Monday",
    date: "2024-01-22",
    shifts: [
      { employee: "Sarah Wilson", client: "Sarah Johnson", time: "08:00-16:00", hours: 8 },
      { employee: "Michael Davis", client: "Robert Smith", time: "09:00-15:00", hours: 6 },
    ],
  },
  {
    day: "Tuesday", 
    date: "2024-01-23",
    shifts: [
      { employee: "Emily Chen", client: "Maria Garcia", time: "07:30-15:30", hours: 8 },
      { employee: "David Lee", client: "John Williams", time: "10:00-18:00", hours: 8 },
    ],
  },
  {
    day: "Wednesday",
    date: "2024-01-24", 
    shifts: [
      { employee: "Anna Thompson", client: "Emma Davis", time: "08:00-16:00", hours: 8 },
      { employee: "Tom Martinez", client: "Lisa Brown", time: "09:00-17:00", hours: 8 },
    ],
  },
];

export default function Timesheets() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "secondary";
      case "Pending Review": return "default";
      case "Draft": return "outline";
      case "Rejected": return "destructive";
      case "In Progress": return "default";
      case "Break": return "secondary";
      default: return "outline";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const totalHours = timesheets.reduce((sum, timesheet) => sum + timesheet.totalHours, 0);
  const totalPay = timesheets.reduce((sum, timesheet) => sum + (timesheet.totalHours * timesheet.payRate), 0);
  const pendingTimesheets = timesheets.filter(ts => ts.status === "Pending Review").length;
  const activeStaffCount = activeShifts.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Timesheets</h1>
          <p className="text-muted-foreground">
            Manage staff timesheets, clock in/out, and payroll processing
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Payroll
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Timesheet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}h</div>
            <p className="text-xs text-muted-foreground">This pay period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPay)}</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTimesheets}</div>
            <p className="text-xs text-muted-foreground">Requires approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff On Duty</CardTitle>
            <Timer className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStaffCount}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timesheets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
          <TabsTrigger value="active">Active Shifts</TabsTrigger>
          <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="clock">Clock In/Out</TabsTrigger>
        </TabsList>

        <TabsContent value="timesheets">
          <Card>
            <CardHeader>
              <CardTitle>Staff Timesheets</CardTitle>
              <CardDescription>
                Review and approve staff timesheets for payroll processing
              </CardDescription>
              <div className="flex gap-4">
                <Input placeholder="Search by employee name..." className="max-w-sm" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Week ending" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Week</SelectItem>
                    <SelectItem value="last">Last Week</SelectItem>
                    <SelectItem value="2weeks">2 Weeks Ago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timesheet ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Week Ending</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Regular Hours</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Pay Rate</TableHead>
                    <TableHead>Total Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timesheets.map((timesheet) => (
                    <TableRow key={timesheet.id}>
                      <TableCell className="font-medium">{timesheet.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{timesheet.employee}</div>
                            <div className="text-xs text-muted-foreground">{timesheet.employeeId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {timesheet.weekEnding}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{timesheet.totalHours}h</TableCell>
                      <TableCell>{timesheet.regularHours}h</TableCell>
                      <TableCell className={timesheet.overtimeHours > 0 ? "text-orange-600 font-medium" : ""}>
                        {timesheet.overtimeHours}h
                      </TableCell>
                      <TableCell>{formatCurrency(timesheet.payRate)}/hr</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(timesheet.totalHours * timesheet.payRate)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(timesheet.status) as any}>
                          {timesheet.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {timesheet.status === "Pending Review" && (
                            <>
                              <Button size="sm" variant="default">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive">
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Shifts</CardTitle>
              <CardDescription>
                Staff currently on duty and their shift details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeShifts.map((shift) => (
                  <Card key={shift.id} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{shift.employee}</CardTitle>
                        <Badge variant={getStatusColor(shift.status) as any}>
                          {shift.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" />
                        <span>{shift.client}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>Started at {shift.clockInTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Timer className="h-4 w-4" />
                        <span>{shift.duration} elapsed</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Location: {shift.location}
                      </div>
                      <div className="flex gap-2 pt-2">
                        {shift.status === "In Progress" && (
                          <Button size="sm" variant="outline">
                            <Square className="h-4 w-4 mr-1" />
                            Clock Out
                          </Button>
                        )}
                        {shift.status === "Break" && (
                          <Button size="sm" variant="default">
                            <Play className="h-4 w-4 mr-1" />
                            Resume
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>
                Upcoming shifts and staff assignments for the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklySchedule.map((day) => (
                  <div key={day.day} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{day.day}</h3>
                      <div className="text-sm text-muted-foreground">{day.date}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {day.shifts.map((shift, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                          <div>
                            <div className="font-medium">{shift.employee}</div>
                            <div className="text-sm text-muted-foreground">{shift.client}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{shift.time}</div>
                            <div className="text-xs text-muted-foreground">{shift.hours}h</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clock">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Clock In/Out</CardTitle>
                <CardDescription>
                  Clock in or out for staff members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Employee</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Wilson</SelectItem>
                      <SelectItem value="michael">Michael Davis</SelectItem>
                      <SelectItem value="emily">Emily Chen</SelectItem>
                      <SelectItem value="david">David Lee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Client Assignment</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client1">Sarah Johnson</SelectItem>
                      <SelectItem value="client2">Robert Smith</SelectItem>
                      <SelectItem value="client3">Maria Garcia</SelectItem>
                      <SelectItem value="client4">John Williams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Clock In
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Square className="h-4 w-4 mr-2" />
                    Clock Out
                  </Button>
                </div>

                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Current time: {new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timesheet Actions</CardTitle>
                <CardDescription>
                  Quick actions for timesheet management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Pending Timesheets
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Payroll Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Weekly Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Pay Period Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Manual Entry
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}