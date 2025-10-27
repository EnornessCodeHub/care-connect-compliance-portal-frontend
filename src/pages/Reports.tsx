import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar as CalendarIcon,
  FileText,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter,
  Search,
  RefreshCw,
  Target,
  Activity,
  Heart,
  Shield
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Reports() {
  const [selectedDateFrom, setSelectedDateFrom] = useState<Date>();
  const [selectedDateTo, setSelectedDateTo] = useState<Date>();
  const [selectedReport, setSelectedReport] = useState("overview");
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data for reports
  const kpiMetrics = [
    {
      title: "Total Clients",
      value: "247",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Care Plans",
      value: "198",
      change: "+8%",
      trend: "up",
      icon: Heart,
      color: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: "$89,430",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "text-yellow-600"
    },
    {
      title: "Incidents This Month",
      value: "12",
      change: "-20%",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      title: "Staff Utilization",
      value: "87%",
      change: "+3%",
      trend: "up",
      icon: Activity,
      color: "text-purple-600"
    },
    {
      title: "Compliance Rate",
      value: "96%",
      change: "+2%",
      trend: "up",
      icon: Shield,
      color: "text-indigo-600"
    }
  ];

  const clientReports = [
    {
      clientName: "Sarah Thompson",
      planType: "Daily Living Support",
      hoursThisMonth: 84,
      utilizationRate: 95,
      lastService: "2024-01-15",
      status: "Active"
    },
    {
      clientName: "Michael Chen",
      planType: "Community Access",
      hoursThisMonth: 42,
      utilizationRate: 78,
      lastService: "2024-01-14",
      status: "Active"
    },
    {
      clientName: "Emma Wilson",
      planType: "Respite Care",
      hoursThisMonth: 28,
      utilizationRate: 90,
      lastService: "2024-01-13",
      status: "Review Due"
    },
    {
      clientName: "James Miller",
      planType: "Skills Development",
      hoursThisMonth: 56,
      utilizationRate: 82,
      lastService: "2024-01-12",
      status: "Active"
    }
  ];

  const staffPerformance = [
    {
      name: "Lisa Anderson",
      role: "Support Worker",
      hoursWorked: 156,
      clientsSeen: 12,
      rating: 4.8,
      onTimeRate: 98
    },
    {
      name: "David Rodriguez",
      role: "Care Coordinator",
      hoursWorked: 162,
      clientsSeen: 18,
      rating: 4.9,
      onTimeRate: 96
    },
    {
      name: "Maria Santos",
      role: "Support Worker",
      hoursWorked: 148,
      clientsSeen: 10,
      rating: 4.7,
      onTimeRate: 94
    },
    {
      name: "Robert Kim",
      role: "Senior Support Worker",
      hoursWorked: 172,
      clientsSeen: 15,
      rating: 4.9,
      onTimeRate: 99
    }
  ];

  const financialSummary = [
    {
      category: "NDIS Funding",
      budgeted: 125000,
      actual: 118500,
      variance: -6500,
      utilizationRate: 95
    },
    {
      category: "Private Pay",
      budgeted: 35000,
      actual: 38200,
      variance: 3200,
      utilizationRate: 109
    },
    {
      category: "Other Funding",
      budgeted: 15000,
      actual: 12800,
      variance: -2200,
      utilizationRate: 85
    }
  ];

  const generateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your healthcare operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={generateReport} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </>
            )}
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">From:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-32 justify-start text-left font-normal",
                      !selectedDateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDateFrom ? format(selectedDateFrom, "MMM dd") : "Select"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDateFrom}
                    onSelect={setSelectedDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">To:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-32 justify-start text-left font-normal",
                      !selectedDateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDateTo ? format(selectedDateTo, "MMM dd") : "Select"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDateTo}
                    onSelect={setSelectedDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview Dashboard</SelectItem>
                <SelectItem value="client">Client Performance</SelectItem>
                <SelectItem value="staff">Staff Performance</SelectItem>
                <SelectItem value="financial">Financial Summary</SelectItem>
                <SelectItem value="compliance">Compliance Report</SelectItem>
              </SelectContent>
            </Select>

            <Button>
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={cn("h-4 w-4", metric.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {metric.change}
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Reports Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Client Reports</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Delivery Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Daily Living Support</span>
                    <span className="text-sm">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Community Access</span>
                    <span className="text-sm">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Skills Development</span>
                    <span className="text-sm">32%</span>
                  </div>
                  <Progress value={32} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Respite Care</span>
                    <span className="text-sm">28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Targets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Service Hours</span>
                    </div>
                    <Badge variant="default">92% Complete</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Revenue Target</span>
                    </div>
                    <Badge variant="default">87% Complete</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm font-medium">Quality Goals</span>
                    </div>
                    <Badge variant="default">96% Complete</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Compliance</span>
                    </div>
                    <Badge variant="default">98% Complete</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Client Reports Tab */}
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Client Service Summary</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search clients..." className="pl-8 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Plan Type</TableHead>
                    <TableHead>Hours This Month</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Last Service</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientReports.map((client, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{client.clientName}</TableCell>
                      <TableCell>{client.planType}</TableCell>
                      <TableCell>{client.hoursThisMonth}h</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={client.utilizationRate} className="h-2 w-16" />
                          <span className="text-sm">{client.utilizationRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{client.lastService}</TableCell>
                      <TableCell>
                        <Badge variant={client.status === "Active" ? "default" : "secondary"}>
                          {client.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Performance Tab */}
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Clients Seen</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>On-Time Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffPerformance.map((staff, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell>{staff.hoursWorked}h</TableCell>
                      <TableCell>{staff.clientsSeen}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">★</span>
                          <span>{staff.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={staff.onTimeRate >= 95 ? "default" : "secondary"}>
                          {staff.onTimeRate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funding Category</TableHead>
                    <TableHead>Budgeted</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialSummary.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell>${item.budgeted.toLocaleString()}</TableCell>
                      <TableCell>${item.actual.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={item.variance >= 0 ? "text-green-600" : "text-red-600"}>
                          {item.variance >= 0 ? "+" : ""}${item.variance.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={item.utilizationRate} className="h-2 w-16" />
                          <span className="text-sm">{item.utilizationRate}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Documentation Complete</span>
                    <Badge variant="default">96%</Badge>
                  </div>
                  <Progress value={96} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Training Up to Date</span>
                    <Badge variant="default">94%</Badge>
                  </div>
                  <Progress value={94} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quality Audits Passed</span>
                    <Badge variant="default">98%</Badge>
                  </div>
                  <Progress value={98} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Incident Response Time</span>
                    <Badge variant="default">92%</Badge>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Audit Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">NDIS Quality Standards</p>
                      <p className="text-xs text-muted-foreground">Completed: Jan 10, 2024</p>
                    </div>
                    <Badge variant="default">Passed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Staff Training Compliance</p>
                      <p className="text-xs text-muted-foreground">Completed: Jan 8, 2024</p>
                    </div>
                    <Badge variant="default">Passed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Documentation Review</p>
                      <p className="text-xs text-muted-foreground">Completed: Jan 5, 2024</p>
                    </div>
                    <Badge variant="secondary">Minor Issues</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Safety Protocol Check</p>
                      <p className="text-xs text-muted-foreground">Completed: Jan 3, 2024</p>
                    </div>
                    <Badge variant="default">Passed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}