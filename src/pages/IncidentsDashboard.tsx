import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Clock, CheckCircle, XCircle, TrendingUp, Users, FileText, Shield, Plus } from "lucide-react";

export default function IncidentsDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Incidents Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time overview of all incident management activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Incident
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Target: 5 per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalated</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">Avg. first response</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Incident Types</CardTitle>
            <CardDescription>Distribution of incident categories this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Falls/Injuries</span>
                <span>35%</span>
              </div>
              <Progress value={35} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Medication</span>
                <span>28%</span>
              </div>
              <Progress value={28} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Behavioral</span>
                <span>20%</span>
              </div>
              <Progress value={20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Equipment</span>
                <span>17%</span>
              </div>
              <Progress value={17} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Incident resolution by staff members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">Sarah Wilson</span>
              </div>
              <Badge variant="secondary">8 resolved</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">Michael Davis</span>
              </div>
              <Badge variant="secondary">6 resolved</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">Emily Chen</span>
              </div>
              <Badge variant="secondary">5 resolved</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">David Lee</span>
              </div>
              <Badge variant="secondary">4 resolved</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Critical Alerts</CardTitle>
            <CardDescription>Incidents requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Medication Error - Room 204</p>
                <p className="text-xs text-muted-foreground">Escalated 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border border-orange-200 rounded-lg bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Fall with Injury - Client J.Smith</p>
                <p className="text-xs text-muted-foreground">Pending medical review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>NDIS Reporting</CardTitle>
            <CardDescription>Reportable incidents status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">This Month</span>
              <Badge variant="outline">5 reported</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Reports</span>
              <Badge variant="destructive">2 overdue</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Compliance Rate</span>
              <Badge variant="secondary">92%</Badge>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              View NDIS Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Incident trends and patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Incidents</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">+12%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Resolution Time</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">-8%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Client Satisfaction</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">95%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}