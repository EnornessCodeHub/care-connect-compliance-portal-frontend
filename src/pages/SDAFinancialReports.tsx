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
import { BarChart3, DollarSign, TrendingUp, TrendingDown, FileText, Plus, Download, Calendar, Building } from "lucide-react";

const SDAFinancialReports = () => {
  const [activeTab, setActiveTab] = useState("occupancy");
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");

  const occupancyData = [
    {
      property: "Sunrise Villa - Unit 1",
      address: "123 Main St, Melbourne VIC",
      occupancyRate: 100,
      daysOccupied: 31,
      daysVacant: 0,
      monthlyRevenue: 9100,
      targetRevenue: 9100,
      variance: 0
    },
    {
      property: "Garden Court - Unit 3", 
      address: "456 Oak Ave, Brisbane QLD",
      occupancyRate: 67,
      daysOccupied: 21,
      daysVacant: 10,
      monthlyRevenue: 5180,
      targetRevenue: 7400,
      variance: -2220
    },
    {
      property: "Harmony House - Unit 2",
      address: "789 Pine Rd, Perth WA",
      occupancyRate: 100,
      daysOccupied: 31,
      daysVacant: 0,
      monthlyRevenue: 8450,
      targetRevenue: 8450,
      variance: 0
    },
    {
      property: "Serenity Place - Unit 1",
      address: "123 River St, Adelaide SA",
      occupancyRate: 0,
      daysOccupied: 0,
      daysVacant: 31,
      monthlyRevenue: 0,
      targetRevenue: 9520,
      variance: -9520
    }
  ];

  const fundingClaims = [
    {
      month: "January 2025",
      ndisPayments: 38400,
      topUpPayments: 7280,
      totalRevenue: 45680,
      claimsSubmitted: 24,
      claimsApproved: 22,
      claimsPending: 2,
      claimsRejected: 0,
      averageProcessingDays: 12
    },
    {
      month: "December 2024", 
      ndisPayments: 41200,
      topUpPayments: 6890,
      totalRevenue: 48090,
      claimsSubmitted: 24,
      claimsApproved: 24,
      claimsPending: 0,
      claimsRejected: 0,
      averageProcessingDays: 9
    },
    {
      month: "November 2024",
      ndisPayments: 39800,
      topUpPayments: 7150,
      totalRevenue: 46950,
      claimsSubmitted: 24,
      claimsApproved: 23,
      claimsPending: 0,
      claimsRejected: 1,
      averageProcessingDays: 11
    }
  ];

  const propertyCosts = [
    {
      property: "Sunrise Villa - Unit 1",
      monthlyRent: 9100,
      maintenance: 450,
      utilities: 320,
      insurance: 180,
      management: 455,
      totalCosts: 1405,
      netIncome: 7695,
      profitMargin: 84.6
    },
    {
      property: "Garden Court - Unit 3",
      monthlyRent: 5180,
      maintenance: 280,
      utilities: 220,
      insurance: 120,
      management: 259,
      totalCosts: 879,
      netIncome: 4301,
      profitMargin: 83.0
    },
    {
      property: "Harmony House - Unit 2", 
      monthlyRent: 8450,
      maintenance: 380,
      utilities: 290,
      insurance: 160,
      management: 422,
      totalCosts: 1252,
      netIncome: 7198,
      profitMargin: 85.2
    },
    {
      property: "Serenity Place - Unit 1",
      monthlyRent: 0,
      maintenance: 150,
      utilities: 180,
      insurance: 140,
      management: 0,
      totalCosts: 470,
      netIncome: -470,
      profitMargin: 0
    }
  ];

  const getOccupancyBadge = (rate: number) => {
    if (rate >= 95) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (rate >= 80) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (rate >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (variance < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SDA Financial Reports</h1>
          <p className="text-muted-foreground">Occupancy rates, funding claims, and property costs analysis</p>
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
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">$45,680</p>
                <p className="text-xs text-green-600">+5.2% vs last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Occupancy</p>
                <p className="text-2xl font-bold">67%</p>
                <p className="text-xs text-red-600">-8% vs target</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">$34,524</p>
                <p className="text-xs text-green-600">84.2% margin</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Claims Processed</p>
                <p className="text-2xl font-bold">22/24</p>
                <p className="text-xs text-blue-600">92% approval rate</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="occupancy">Occupancy Analysis</TabsTrigger>
          <TabsTrigger value="funding">Funding Claims</TabsTrigger>
          <TabsTrigger value="costs">Property Costs</TabsTrigger>
          <TabsTrigger value="analytics">Financial Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="occupancy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Occupancy Report</CardTitle>
              <CardDescription>Detailed occupancy rates and revenue performance by property</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Occupancy Rate</TableHead>
                    <TableHead>Days Occupied/Vacant</TableHead>
                    <TableHead>Monthly Revenue</TableHead>
                    <TableHead>Target Revenue</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {occupancyData.map((property, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{property.property}</div>
                          <div className="text-sm text-muted-foreground">{property.address}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{property.occupancyRate}%</span>
                          {getOccupancyBadge(property.occupancyRate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm"><span className="text-green-600">{property.daysOccupied} occupied</span></div>
                          <div className="text-sm"><span className="text-red-600">{property.daysVacant} vacant</span></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">${property.monthlyRevenue.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">${property.targetRevenue.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getVarianceIcon(property.variance)}
                          <span className={property.variance >= 0 ? "text-green-600" : "text-red-600"}>
                            {property.variance >= 0 ? "+" : ""}${property.variance.toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getOccupancyBadge(property.occupancyRate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NDIS Funding Claims</CardTitle>
              <CardDescription>Monthly breakdown of NDIS payments and top-up collections</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>NDIS Payments</TableHead>
                    <TableHead>Top-up Payments</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Claims Status</TableHead>
                    <TableHead>Processing Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fundingClaims.map((claim, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{claim.month}</TableCell>
                      <TableCell>${claim.ndisPayments.toLocaleString()}</TableCell>
                      <TableCell>${claim.topUpPayments.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">${claim.totalRevenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-green-600">{claim.claimsApproved} approved</span> • 
                            <span className="text-blue-600 ml-1">{claim.claimsPending} pending</span>
                            {claim.claimsRejected > 0 && (
                              <span className="text-red-600 ml-1"> • {claim.claimsRejected} rejected</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {claim.claimsSubmitted} total submitted
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{claim.averageProcessingDays} days avg</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Breakdown</CardTitle>
                <CardDescription>Current month revenue sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">NDIS SDA Payments</div>
                      <div className="text-sm text-muted-foreground">84.1% of total revenue</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">$38,400</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium">Participant Top-ups</div>
                      <div className="text-sm text-muted-foreground">15.9% of total revenue</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">$7,280</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Claims Performance</CardTitle>
                <CardDescription>Processing efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">92%</div>
                      <div className="text-sm text-green-700">Approval Rate</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-sm text-blue-700">Avg Days to Process</div>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">$45,680</div>
                    <div className="text-sm text-purple-700">Total Claims Value (MTD)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Cost Analysis</CardTitle>
              <CardDescription>Detailed breakdown of property expenses and profitability</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Monthly Rent</TableHead>
                    <TableHead>Maintenance</TableHead>
                    <TableHead>Utilities</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Management</TableHead>
                    <TableHead>Total Costs</TableHead>
                    <TableHead>Net Income</TableHead>
                    <TableHead>Profit Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propertyCosts.map((cost, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{cost.property}</TableCell>
                      <TableCell>${cost.monthlyRent.toLocaleString()}</TableCell>
                      <TableCell>${cost.maintenance}</TableCell>
                      <TableCell>${cost.utilities}</TableCell>
                      <TableCell>${cost.insurance}</TableCell>
                      <TableCell>${cost.management}</TableCell>
                      <TableCell className="font-medium">${cost.totalCosts.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={cost.netIncome >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                          ${cost.netIncome.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cost.profitMargin >= 80 ? "text-green-600" : cost.profitMargin >= 70 ? "text-blue-600" : "text-red-600"}>
                          {cost.profitMargin.toFixed(1)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Category Breakdown</CardTitle>
                <CardDescription>Total monthly expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Maintenance</span>
                    <span className="font-medium">$1,260 (31%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Management Fees</span>
                    <span className="font-medium">$1,136 (28%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Utilities</span>
                    <span className="font-medium">$1,010 (25%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Insurance</span>
                    <span className="font-medium">$600 (15%)</span>
                  </div>
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between items-center font-medium">
                      <span>Total Monthly Costs</span>
                      <span>$4,006</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profitability Summary</CardTitle>
                <CardDescription>Overall financial performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">84.2%</div>
                    <div className="text-sm font-medium text-green-700">Average Profit Margin</div>
                    <div className="text-xs text-muted-foreground">Across all properties</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">$22,830</div>
                      <div className="text-xs text-blue-700">Total Revenue</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">$18,824</div>
                      <div className="text-xs text-purple-700">Net Profit</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">January 2025</span>
                    <span className="font-medium">$45,680</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">December 2024</span>
                    <span className="font-medium">$48,090</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">November 2024</span>
                    <span className="font-medium">$46,950</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">October 2024</span>
                    <span className="font-medium">$44,200</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Occupancy Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Current</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Month</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">3 Months Ago</span>
                    <span className="font-medium">82%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">6 Months Ago</span>
                    <span className="font-medium">89%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Cost per Unit</span>
                    <span className="font-medium">$1,001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue per Unit</span>
                    <span className="font-medium">$11,420</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Profit per Unit</span>
                    <span className="font-medium">$5,706</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">ROI</span>
                    <span className="font-medium text-green-600">570%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Performance Dashboard</CardTitle>
              <CardDescription>Comprehensive financial analytics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Advanced financial charts and analytics will be displayed here</p>
                <p className="text-sm">Revenue trends, cost analysis, and profitability forecasting</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SDAFinancialReports;