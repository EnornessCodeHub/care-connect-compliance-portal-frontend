import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageSquareWarning, Clock, CheckCircle, XCircle, TrendingUp, Users, FileText, AlertTriangle, Plus } from "lucide-react";

export default function ComplaintsDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Complaints Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time overview of all complaint management activities and client feedback
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Complaint
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Complaints</CardTitle>
            <MessageSquareWarning className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Target: 3 per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalated</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2h</div>
            <p className="text-xs text-muted-foreground">Avg. first response</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Complaint Categories</CardTitle>
            <CardDescription>Distribution of complaint types this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Service Quality</span>
                <span>40%</span>
              </div>
              <Progress value={40} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Communication</span>
                <span>25%</span>
              </div>
              <Progress value={25} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Staff Conduct</span>
                <span>20%</span>
              </div>
              <Progress value={20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Billing</span>
                <span>15%</span>
              </div>
              <Progress value={15} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resolution Performance</CardTitle>
            <CardDescription>Complaint resolution by staff members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">Sarah Wilson</span>
              </div>
              <Badge variant="secondary">6 resolved</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">Michael Davis</span>
              </div>
              <Badge variant="secondary">4 resolved</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">Emily Chen</span>
              </div>
              <Badge variant="secondary">3 resolved</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">David Lee</span>
              </div>
              <Badge variant="secondary">2 resolved</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Priority Complaints</CardTitle>
            <CardDescription>High-priority complaints requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
              <MessageSquareWarning className="h-4 w-4 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Service delay complaint</p>
                <p className="text-xs text-muted-foreground">Client J.Smith - 3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border border-orange-200 rounded-lg bg-orange-50">
              <MessageSquareWarning className="h-4 w-4 text-orange-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Communication breakdown</p>
                <p className="text-xs text-muted-foreground">Client M.Johnson - 5 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Satisfaction</CardTitle>
            <CardDescription>Post-resolution satisfaction metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">This Month</span>
              <Badge variant="secondary">4.3/5</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Resolution Rate</span>
              <Badge variant="secondary">94%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">First Contact Resolution</span>
              <Badge variant="secondary">78%</Badge>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Satisfaction Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Complaint trends and patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Complaints</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-red-500" />
                <span className="text-sm">+8%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Resolution Time</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">-12%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Client Satisfaction</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">+0.3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}