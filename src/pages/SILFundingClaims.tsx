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
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, AlertCircle, FileText, Plus, Download, Calendar, Target } from "lucide-react";

const SILFundingClaims = () => {
  const [activeTab, setActiveTab] = useState("quotes");
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");

  const silQuotes = [
    {
      id: "SQ001",
      participant: "Sarah Mitchell",
      ndisNumber: "1234567890",
      house: "Maple House",
      quoteAmount: 4200,
      usedAmount: 3680,
      remainingAmount: 520,
      utilizationRate: 87.6,
      period: "January 2025",
      status: "Active",
      approvedHours: 168,
      usedHours: 147,
      hourlyRate: 25,
      lastClaimDate: "20/Jan/2025",
      nextClaimDue: "27/Jan/2025"
    },
    {
      id: "SQ002",
      participant: "John Davis", 
      ndisNumber: "0987654321",
      house: "Maple House",
      quoteAmount: 3800,
      usedAmount: 3800,
      remainingAmount: 0,
      utilizationRate: 100,
      period: "January 2025",
      status: "Fully Utilized",
      approvedHours: 152,
      usedHours: 152,
      hourlyRate: 25,
      lastClaimDate: "22/Jan/2025",
      nextClaimDue: "29/Jan/2025"
    },
    {
      id: "SQ003",
      participant: "Emma Thompson",
      ndisNumber: "5555666777",
      house: "Maple House", 
      quoteAmount: 5600,
      usedAmount: 2240,
      remainingAmount: 3360,
      utilizationRate: 40,
      period: "January 2025",
      status: "Under-utilized",
      approvedHours: 224,
      usedHours: 89.6,
      hourlyRate: 25,
      lastClaimDate: "18/Jan/2025",
      nextClaimDue: "25/Jan/2025"
    },
    {
      id: "SQ004",
      participant: "Michael Chen",
      ndisNumber: "1111222333",
      house: "Oak Gardens",
      quoteAmount: 3200,
      usedAmount: 2880,
      remainingAmount: 320,
      utilizationRate: 90,
      period: "January 2025",
      status: "Active",
      approvedHours: 128,
      usedHours: 115.2,
      hourlyRate: 25,
      lastClaimDate: "21/Jan/2025",
      nextClaimDue: "28/Jan/2025"
    }
  ];

  const claimsHistory = [
    {
      id: "CL001",
      participant: "Sarah Mitchell",
      claimPeriod: "Week 3 - Jan 2025",
      hoursProvided: 38,
      lineItems: [
        { category: "Personal Care", hours: 14, rate: 25, amount: 350 },
        { category: "Community Access", hours: 12, rate: 25, amount: 300 },
        { category: "Household Tasks", hours: 8, rate: 25, amount: 200 },
        { category: "Social Participation", hours: 4, rate: 25, amount: 100 }
      ],
      totalAmount: 950,
      submissionDate: "20/Jan/2025",
      approvalDate: "22/Jan/2025",
      paymentDate: "25/Jan/2025",
      status: "Paid",
      ndisPlan: "Self-Managed"
    },
    {
      id: "CL002",
      participant: "John Davis",
      claimPeriod: "Week 3 - Jan 2025",
      hoursProvided: 40,
      lineItems: [
        { category: "Personal Care", hours: 16, rate: 25, amount: 400 },
        { category: "Life Skills Development", hours: 12, rate: 25, amount: 300 },
        { category: "Community Access", hours: 8, rate: 25, amount: 200 },
        { category: "Meal Preparation", hours: 4, rate: 25, amount: 100 }
      ],
      totalAmount: 1000,
      submissionDate: "22/Jan/2025",
      approvalDate: "24/Jan/2025",
      paymentDate: "Pending",
      status: "Approved",
      ndisPlan: "Plan Managed"
    }
  ];

  const utilizationMonitoring = [
    {
      house: "Maple House",
      totalBudget: 13600,
      totalUsed: 9720,
      totalRemaining: 3880,
      utilizationRate: 71.5,
      participants: 3,
      riskLevel: "Medium",
      projectedEndDate: "28/Feb/2025",
      averageWeeklySpend: 2430,
      targetWeeklySpend: 3400
    },
    {
      house: "Oak Gardens", 
      totalBudget: 6400,
      totalUsed: 5760,
      totalRemaining: 640,
      utilizationRate: 90,
      participants: 2,
      riskLevel: "High",
      projectedEndDate: "31/Jan/2025",
      averageWeeklySpend: 1440,
      targetWeeklySpend: 1600
    },
    {
      house: "Pine Vista",
      totalBudget: 8800,
      totalUsed: 6160,
      totalRemaining: 2640,
      utilizationRate: 70,
      participants: 4,
      riskLevel: "Low",
      projectedEndDate: "15/Feb/2025",
      averageWeeklySpend: 1540,
      targetWeeklySpend: 2200
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "Fully Utilized":
        return <Badge className="bg-red-100 text-red-800">Fully Utilized</Badge>;
      case "Under-utilized":
        return <Badge className="bg-yellow-100 text-yellow-800">Under-utilized</Badge>;
      case "Paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "Approved":
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "Low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case "High":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
      default:
        return <Badge variant="secondary">{risk}</Badge>;
    }
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 90) return "text-red-600";
    if (rate >= 70) return "text-green-600";
    return "text-yellow-600";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SIL Funding Claims</h1>
          <p className="text-muted-foreground">Quote tracking, line items, and utilisation monitoring</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Submit Claim
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit New Claim</DialogTitle>
                <DialogDescription>Create a new funding claim for SIL services</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="participant">Participant</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select participant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Mitchell</SelectItem>
                      <SelectItem value="john">John Davis</SelectItem>
                      <SelectItem value="emma">Emma Thompson</SelectItem>
                      <SelectItem value="michael">Michael Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="period">Claim Period</Label>
                  <Input id="period" placeholder="e.g., Week 3 - Jan 2025" />
                </div>
                <div>
                  <Label htmlFor="startDate">Period Start</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">Period End</Label>
                  <Input id="endDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="totalHours">Total Hours</Label>
                  <Input id="totalHours" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate</Label>
                  <Input id="hourlyRate" type="number" placeholder="25.00" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="services">Services Provided</Label>
                  <Textarea id="services" placeholder="List the services provided during this period" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Save Draft</Button>
                <Button>Submit Claim</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Quote Value</p>
                <p className="text-2xl font-bold">$128,400</p>
                <p className="text-xs text-green-600">Active this month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Amount Utilized</p>
                <p className="text-2xl font-bold">$112,000</p>
                <p className="text-xs text-blue-600">87.2% of budget</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Claims Pending</p>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-orange-600">$12,400 value</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-xs text-green-600">Last 30 days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quotes">SIL Quotes</TabsTrigger>
          <TabsTrigger value="claims">Claims History</TabsTrigger>
          <TabsTrigger value="utilization">Utilization Monitoring</TabsTrigger>
          <TabsTrigger value="analytics">Financial Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SIL Quote Tracking</CardTitle>
              <CardDescription>Monitor approved funding amounts and current utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>House</TableHead>
                    <TableHead>Quote Amount</TableHead>
                    <TableHead>Used / Remaining</TableHead>
                    <TableHead>Utilization Rate</TableHead>
                    <TableHead>Hours Progress</TableHead>
                    <TableHead>Next Claim Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {silQuotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quote.participant}</div>
                          <div className="text-sm text-muted-foreground">{quote.ndisNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>{quote.house}</TableCell>
                      <TableCell className="font-medium">${quote.quoteAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">
                            <span className="text-green-600">${quote.usedAmount.toLocaleString()} used</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-blue-600">${quote.remainingAmount.toLocaleString()} remaining</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Progress value={quote.utilizationRate} className="flex-1" />
                            <span className={`text-sm font-medium ${getUtilizationColor(quote.utilizationRate)}`}>
                              {quote.utilizationRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{quote.usedHours} / {quote.approvedHours} hours</div>
                          <div className="text-muted-foreground">@ ${quote.hourlyRate}/hr</div>
                        </div>
                      </TableCell>
                      <TableCell>{quote.nextClaimDue}</TableCell>
                      <TableCell>{getStatusBadge(quote.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Claim</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Claims History</CardTitle>
              <CardDescription>Detailed breakdown of submitted claims and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {claimsHistory.map((claim) => (
                  <Card key={claim.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{claim.participant}</h4>
                          <p className="text-sm text-muted-foreground">{claim.claimPeriod}</p>
                          <div className="flex gap-2 mt-1">
                            {getStatusBadge(claim.status)}
                            <Badge variant="outline">{claim.ndisPlan}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">${claim.totalAmount}</div>
                          <div className="text-sm text-muted-foreground">{claim.hoursProvided} hours</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="font-medium mb-2">Service Breakdown</h5>
                          <div className="space-y-1">
                            {claim.lineItems.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.category}</span>
                                <span>{item.hours}h × ${item.rate} = ${item.amount}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Processing Timeline</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Submitted:</span>
                              <span>{claim.submissionDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Approved:</span>
                              <span>{claim.approvalDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Payment:</span>
                              <span>{claim.paymentDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Invoice</Button>
                        <Button size="sm" variant="outline">Download Receipt</Button>
                        {claim.status === "Approved" && (
                          <Button size="sm" variant="outline">Track Payment</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utilization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Utilization Monitoring</CardTitle>
              <CardDescription>Track spending patterns and budget consumption across houses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {utilizationMonitoring.map((house, index) => (
                  <Card key={index} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{house.house}</CardTitle>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{house.utilizationRate.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">Utilized</div>
                        </div>
                      </div>
                      <CardDescription>{house.participants} participants • {getRiskBadge(house.riskLevel)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">${house.totalBudget.toLocaleString()}</div>
                          <div className="text-sm text-blue-700">Total Budget</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-green-600">${house.totalUsed.toLocaleString()}</div>
                          <div className="text-sm text-green-700">Amount Used</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-xl font-bold text-orange-600">${house.totalRemaining.toLocaleString()}</div>
                          <div className="text-sm text-orange-700">Remaining</div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Progress value={house.utilizationRate} className="flex-1" />
                          <span className={`text-sm font-medium ${getUtilizationColor(house.utilizationRate)}`}>
                            {house.utilizationRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span>Projected End Date:</span>
                          <span className="font-medium">{house.projectedEndDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weekly Spend Rate:</span>
                          <span className="font-medium">${house.averageWeeklySpend} / ${house.targetWeeklySpend}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">$112k</div>
                    <div className="text-sm font-medium text-green-700">Total Claims (MTD)</div>
                    <div className="text-xs text-muted-foreground">87.2% of budget</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">94%</div>
                      <div className="text-xs text-blue-700">Approval Rate</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">5.2</div>
                      <div className="text-xs text-purple-700">Avg Days to Pay</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Personal Care</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Life Skills Development</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Community Access</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Household Tasks</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Social Participation</span>
                    <span className="font-medium">8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Cost per Hour</span>
                    <span className="font-medium">$25.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Hours per Participant</span>
                    <span className="font-medium">147/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Claim Processing Time</span>
                    <span className="font-medium">2.8 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Budget Variance</span>
                    <span className="font-medium text-green-600">-2.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Funding Trends & Forecasting</CardTitle>
              <CardDescription>Budget utilization patterns and projections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>Advanced funding analytics and forecasting charts will be displayed here</p>
                <p className="text-sm">Showing spending trends, budget projections, and utilization forecasts</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SILFundingClaims;