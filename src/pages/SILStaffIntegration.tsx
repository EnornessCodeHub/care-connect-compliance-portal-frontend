import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, DollarSign, Clock, TrendingUp, Calendar, FileText, Plus, Download } from "lucide-react";

const SILStaffIntegration = () => {
  const [activeTab, setActiveTab] = useState("payroll");

  const staffCosts = [
    { name: "Emma Wilson", house: "Maple House", hoursWorked: 38, hourlyRate: 28, grossPay: 1064, superannuation: 106.4, totalCost: 1170.4, efficiency: 92 },
    { name: "David Park", house: "Oak Gardens", hoursWorked: 40, hourlyRate: 30, grossPay: 1200, superannuation: 120, totalCost: 1320, efficiency: 95 },
    { name: "Lisa Clarke", house: "Pine Vista", hoursWorked: 36, hourlyRate: 26, grossPay: 936, superannuation: 93.6, totalCost: 1029.6, efficiency: 88 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SIL Staff Integration</h1>
          <p className="text-muted-foreground">Integration with payroll and HR for staffing cost control</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Staff Costs (MTD)</p>
                <p className="text-2xl font-bold">$48,520</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Staff</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">1,847</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost Efficiency</p>
                <p className="text-2xl font-bold">92%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payroll">Payroll Integration</TabsTrigger>
          <TabsTrigger value="hr">HR Management</TabsTrigger>
          <TabsTrigger value="analytics">Cost Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Costs by House</CardTitle>
              <CardDescription>Detailed payroll breakdown for SIL houses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>House</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Hourly Rate</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Efficiency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffCosts.map((staff, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{staff.house}</TableCell>
                      <TableCell>{staff.hoursWorked}h</TableCell>
                      <TableCell>${staff.hourlyRate}/hr</TableCell>
                      <TableCell>${staff.grossPay}</TableCell>
                      <TableCell className="font-medium">${staff.totalCost}</TableCell>
                      <TableCell>
                        <Badge className={staff.efficiency >= 90 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {staff.efficiency}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>HR Management Integration</CardTitle>
              <CardDescription>Staff management and performance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <p>HR integration features will be displayed here</p>
                <p className="text-sm">Staff scheduling, performance metrics, and compliance tracking</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Control Analytics</CardTitle>
              <CardDescription>Staffing cost analysis and optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>Cost analytics and optimization recommendations will be displayed here</p>
                <p className="text-sm">Staffing efficiency metrics, budget variance analysis, and cost forecasting</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SILStaffIntegration;