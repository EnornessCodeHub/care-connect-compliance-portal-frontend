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
import { Shield, AlertTriangle, Clock, FileText, Plus, Search, Filter, Eye, Edit } from "lucide-react";

const BSPRestrictivePractices = () => {
  const [activeTab, setActiveTab] = useState("practices");
  
  const restrictivePractices = [
    {
      id: "RP001",
      participant: "Sarah Johnson",
      ndisNumber: "1234567890",
      practiceType: "Environmental Restraint",
      description: "Locked door during behavioural episodes",
      approvalDate: "15/Jan/2024",
      expiryDate: "15/Jan/2025",
      reviewFrequency: "Monthly",
      lastReview: "15/Dec/2024",
      nextReview: "15/Jan/2025",
      status: "Expired",
      authorizedBy: "Dr. Emma Clarke",
      usageThisMonth: 3,
      totalUsage: 45,
      riskLevel: "Medium"
    },
    {
      id: "RP002",
      participant: "Michael Chen", 
      ndisNumber: "0987654321",
      practiceType: "Physical Restraint",
      description: "Brief physical holding during emergency situations",
      approvalDate: "01/Mar/2024",
      expiryDate: "01/Mar/2025",
      reviewFrequency: "Bi-weekly",
      lastReview: "10/Jan/2025",
      nextReview: "24/Jan/2025",
      status: "Active",
      authorizedBy: "Dr. James Wilson",
      usageThisMonth: 1,
      totalUsage: 12,
      riskLevel: "High"
    },
    {
      id: "RP003",
      participant: "Emma Thompson",
      ndisNumber: "5555666777",
      practiceType: "Mechanical Restraint",
      description: "Specialized wheelchair restraint during transport",
      approvalDate: "20/Aug/2024",
      expiryDate: "20/Aug/2025",
      reviewFrequency: "Monthly",
      lastReview: "20/Dec/2024",
      nextReview: "20/Jan/2025",
      status: "Active",
      authorizedBy: "Dr. Lisa Martin",
      usageThisMonth: 8,
      totalUsage: 96,
      riskLevel: "Low"
    },
    {
      id: "RP004",
      participant: "David Williams",
      ndisNumber: "1111222333",
      practiceType: "Chemical Restraint",
      description: "PRN medication for severe agitation",
      approvalDate: "05/Nov/2024",
      expiryDate: "05/Nov/2025",
      reviewFrequency: "Weekly",
      lastReview: "18/Jan/2025",
      nextReview: "25/Jan/2025",
      status: "Under Review",
      authorizedBy: "Dr. Sarah Ahmed",
      usageThisMonth: 2,
      totalUsage: 18,
      riskLevel: "High"
    }
  ];

  const usageIncidents = [
    {
      id: "UI001",
      participant: "Sarah Johnson",
      practiceId: "RP001",
      practiceType: "Environmental Restraint",
      date: "22/Jan/2025",
      time: "14:30",
      duration: "25 minutes",
      triggerEvent: "Aggressive behaviour towards other residents",
      staffInvolved: ["Emma Wilson", "David Park"],
      outcome: "Participant calmed down, episode ended peacefully",
      followUpRequired: true,
      reportedBy: "Emma Wilson",
      reviewStatus: "Pending"
    },
    {
      id: "UI002",
      participant: "Michael Chen",
      practiceId: "RP002", 
      practiceType: "Physical Restraint",
      date: "20/Jan/2025",
      time: "09:15",
      duration: "3 minutes",
      triggerEvent: "Risk of self-harm during emotional crisis",
      staffInvolved: ["Lisa Clarke", "Tom Mitchell"],
      outcome: "Crisis de-escalated, participant self-regulated",
      followUpRequired: true,
      reportedBy: "Lisa Clarke",
      reviewStatus: "Completed"
    },
    {
      id: "UI003",
      participant: "Emma Thompson",
      practiceId: "RP003",
      practiceType: "Mechanical Restraint",
      date: "21/Jan/2025",
      time: "10:00",
      duration: "45 minutes",
      triggerEvent: "Community transport to medical appointment",
      staffInvolved: ["Support Worker A"],
      outcome: "Safe transport completed, no incidents",
      followUpRequired: false,
      reportedBy: "Support Worker A",
      reviewStatus: "Completed"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "Expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case "Under Review":
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case "Suspended":
        return <Badge className="bg-orange-100 text-orange-800">Suspended</Badge>;
      case "Pending":
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "High":
        return <Badge variant="destructive">High Risk</Badge>;
      case "Medium":
        return <Badge className="bg-orange-100 text-orange-800">Medium Risk</Badge>;
      case "Low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
      default:
        return <Badge variant="secondary">{risk}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Restrictive Practices Management</h1>
          <p className="text-muted-foreground">Track types, approvals, expiry dates, and usage logs</p>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Log Usage
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Log Restrictive Practice Usage</DialogTitle>
                <DialogDescription>Record an incident where a restrictive practice was used</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="participant">Participant</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select participant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Johnson</SelectItem>
                      <SelectItem value="michael">Michael Chen</SelectItem>
                      <SelectItem value="emma">Emma Thompson</SelectItem>
                      <SelectItem value="david">David Williams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="practice">Restrictive Practice</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select practice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="environmental">Environmental Restraint</SelectItem>
                      <SelectItem value="physical">Physical Restraint</SelectItem>
                      <SelectItem value="mechanical">Mechanical Restraint</SelectItem>
                      <SelectItem value="chemical">Chemical Restraint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" placeholder="e.g., 15 minutes" />
                </div>
                <div>
                  <Label htmlFor="staff">Staff Involved</Label>
                  <Input id="staff" placeholder="Staff member names" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="trigger">Trigger Event</Label>
                  <Textarea id="trigger" placeholder="Describe what led to the use of restrictive practice" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="outcome">Outcome</Label>
                  <Textarea id="outcome" placeholder="Describe the outcome and any follow-up actions" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Log Incident</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Authorization
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Practices</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired/Due</p>
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
                <p className="text-sm text-muted-foreground">Usage This Month</p>
                <p className="text-2xl font-bold">14</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reviews Due</p>
                <p className="text-2xl font-bold text-orange-600">5</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="practices">Authorized Practices</TabsTrigger>
          <TabsTrigger value="usage">Usage Tracking</TabsTrigger>
          <TabsTrigger value="reviews">Reviews & Approvals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="practices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authorized Restrictive Practices</CardTitle>
              <CardDescription>Current authorizations and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search practices..." className="pl-10" />
                  </div>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Practices</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Practice Type</TableHead>
                    <TableHead>Authorized By</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Next Review</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restrictivePractices.map((practice) => (
                    <TableRow key={practice.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{practice.participant}</div>
                          <div className="text-sm text-muted-foreground">{practice.ndisNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{practice.practiceType}</div>
                          <div className="text-sm text-muted-foreground">{practice.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{practice.authorizedBy}</TableCell>
                      <TableCell>{practice.expiryDate}</TableCell>
                      <TableCell>{practice.nextReview}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{practice.usageThisMonth} this month</div>
                          <div className="text-sm text-muted-foreground">{practice.totalUsage} total</div>
                        </div>
                      </TableCell>
                      <TableCell>{getRiskBadge(practice.riskLevel)}</TableCell>
                      <TableCell>{getStatusBadge(practice.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
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

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Incidents</CardTitle>
              <CardDescription>Detailed log of restrictive practice usage</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Participant</TableHead>
                    <TableHead>Practice Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Trigger Event</TableHead>
                    <TableHead>Staff Involved</TableHead>
                    <TableHead>Review Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{incident.date}</div>
                          <div className="text-sm text-muted-foreground">{incident.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>{incident.participant}</TableCell>
                      <TableCell>{incident.practiceType}</TableCell>
                      <TableCell>{incident.duration}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="truncate">{incident.triggerEvent}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {incident.staffInvolved.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(incident.reviewStatus)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Urgent Reviews Required</CardTitle>
                <CardDescription>Practices requiring immediate review or reauthorization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {restrictivePractices.filter(p => p.status === "Expired" || p.status === "Under Review").map((practice) => (
                    <div key={practice.id} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-red-900">{practice.participant}</div>
                          <div className="text-sm text-red-700">{practice.practiceType}</div>
                          <div className="text-xs text-red-600">
                            {practice.status === "Expired" ? `Expired: ${practice.expiryDate}` : `Review due: ${practice.nextReview}`}
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(practice.status)}
                          <div className="mt-1">
                            <Button size="sm" variant="outline" className="text-red-700 border-red-200">
                              Review Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Schedule</CardTitle>
                <CardDescription>Upcoming review dates for all practices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {restrictivePractices.filter(p => p.status === "Active").map((practice) => (
                    <div key={practice.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{practice.participant}</div>
                        <div className="text-sm text-muted-foreground">{practice.practiceType}</div>
                        <div className="text-xs text-blue-600">Next review: {practice.nextReview}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{practice.reviewFrequency}</Badge>
                        <div className="mt-1">
                          <Button size="sm" variant="outline">Schedule</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Review History</CardTitle>
              <CardDescription>Past reviews and their outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>Review history and documentation will be displayed here</p>
                <p className="text-sm">Track all review decisions and modifications</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">14</div>
                    <div className="text-sm font-medium text-blue-700">Total Uses This Month</div>
                    <div className="text-xs text-muted-foreground">-22% from last month</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">8.5</div>
                    <div className="text-sm font-medium text-green-700">Avg Duration (minutes)</div>
                    <div className="text-xs text-muted-foreground">-15% from last month</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Practice Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Environmental</span>
                    <span className="font-medium">6 (43%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Mechanical</span>
                    <span className="font-medium">4 (29%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Chemical</span>
                    <span className="font-medium">3 (21%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Physical</span>
                    <span className="font-medium">1 (7%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">94%</div>
                  <div className="text-sm font-medium text-green-700">Current Compliance</div>
                  <div className="text-xs text-muted-foreground">2 practices need renewal</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>Monthly usage patterns and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Shield className="h-12 w-12 mx-auto mb-4" />
                <p>Usage trend charts and analytics will be displayed here</p>
                <p className="text-sm">Showing usage patterns, effectiveness metrics, and compliance trends</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BSPRestrictivePractices;