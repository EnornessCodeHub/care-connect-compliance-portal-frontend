import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardTile } from "@/components/dashboard/DashboardTile";
import { FileText, Shield, TrendingUp, AlertCircle, Calendar, Users, Target, Plus } from "lucide-react";

const BehaviourSupportPlan = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Behaviour Support Plans</h1>
          <p className="text-muted-foreground">BSP management, restrictive practices, and NDIS Commission reporting</p>
        </div>
        <div className="flex gap-3">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New BSP
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Record Incident
          </Button>
        </div>
      </div>

      <DashboardSection title="BSP Overview" className="mb-8">
        <DashboardTile
          title="Active BSPs"
          value="15"
          subtitle="Approved plans"
          status="success"
        />
        <DashboardTile
          title="Restrictive Practices"
          value="8"
          subtitle="Currently authorised"
          status="warning"
        />
        <DashboardTile
          title="Due for Review"
          value="3"
          subtitle="Plans expiring soon"
          status="critical"
        />
        <DashboardTile
          title="PRODA Reports"
          value="2"
          subtitle="Pending submission"
          status="warning"
        />
      </DashboardSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              BSP Register
            </CardTitle>
            <CardDescription>Authorised plans, expiry dates, and approval status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Sarah Johnson - BSP v2.1</h4>
                  <p className="text-sm text-muted-foreground">Behaviour Specialist: Dr. Emma Clarke</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">Approved</Badge>
                    <Badge variant="outline">2 Restrictive Practices</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">Valid</div>
                  <div className="text-xs text-muted-foreground">Expires: 15/Aug/25</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Michael Chen - BSP v1.3</h4>
                  <p className="text-sm text-muted-foreground">Behaviour Specialist: Dr. James Wilson</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="destructive">Review Due</Badge>
                    <Badge variant="outline">1 Restrictive Practice</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-600">Expires Soon</div>
                  <div className="text-xs text-muted-foreground">Expires: 28/Feb/25</div>
                </div>
              </div>
            </div>
            <Button className="w-full" variant="outline">View All BSPs</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Restrictive Practices
            </CardTitle>
            <CardDescription>Types, approvals, and usage tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Environmental Restraint</h4>
                  <p className="text-sm text-muted-foreground">Sarah J. - Locked door during episodes</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">Active</Badge>
                    <Badge variant="outline">Used 3x this month</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Valid</div>
                  <div className="text-xs text-muted-foreground">Review: Monthly</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Physical Restraint</h4>
                  <p className="text-sm text-muted-foreground">Michael C. - Emergency situations only</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="destructive">Expired</Badge>
                    <Badge variant="outline">Last used: 2 weeks ago</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-600">Renewal Required</div>
                  <div className="text-xs text-muted-foreground">Expired: 20/Jan/25</div>
                </div>
              </div>
            </div>
            <Button className="w-full" variant="outline">Manage Practices</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goals & Progress
            </CardTitle>
            <CardDescription>Behaviour intervention goals and progress monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Reduce Aggressive Episodes</h4>
                  <p className="text-sm text-muted-foreground">Sarah J. - Target: &lt;50% reduction</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">62% Reduction</Badge>
                    <Badge variant="outline">On Track</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">Exceeding Goal</div>
                  <div className="text-xs text-muted-foreground">Review: 15/Mar/25</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Increase Communication</h4>
                  <p className="text-sm text-muted-foreground">Michael C. - Alternative communication</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">35% Improvement</Badge>
                    <Badge variant="outline">Steady Progress</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600">Progressing</div>
                  <div className="text-xs text-muted-foreground">Review: 28/Feb/25</div>
                </div>
              </div>
            </div>
            <Button className="w-full" variant="outline">View Progress Reports</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              PRODA & Reporting
            </CardTitle>
            <CardDescription>NDIS Commission reporting and compliance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Quarterly BSP Report</h4>
                  <p className="text-sm text-muted-foreground">Q4 2024 - All participants</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="destructive">Overdue</Badge>
                    <Badge variant="outline">15 BSPs</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-600">Due: 31/Jan/25</div>
                  <div className="text-xs text-muted-foreground">Submit to PRODA</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Restrictive Practice Report</h4>
                  <p className="text-sm text-muted-foreground">Monthly usage summary</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">Ready</Badge>
                    <Badge variant="outline">8 Practices</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">Draft Complete</div>
                  <div className="text-xs text-muted-foreground">Submit by: 5/Feb/25</div>
                </div>
              </div>
            </div>
            <Button className="w-full" variant="outline">Access PRODA Portal</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Data Visualisation
          </CardTitle>
          <CardDescription>Behaviour frequency, incident types, and intervention outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">47%</div>
              <div className="text-sm font-medium text-blue-700">Overall Reduction</div>
              <div className="text-xs text-muted-foreground">Behaviour incidents this quarter</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">12</div>
              <div className="text-sm font-medium text-green-700">Successful Goals</div>
              <div className="text-xs text-muted-foreground">Achieved this year</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">3.2</div>
              <div className="text-sm font-medium text-orange-700">Avg Response Time</div>
              <div className="text-xs text-muted-foreground">Minutes to intervention</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BehaviourSupportPlan;