import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardTile } from "@/components/dashboard/DashboardTile";
import { Calendar, Users, DollarSign, Home, Target, Clock, FileText, Plus } from "lucide-react";

const SILManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SIL Management</h1>
          <p className="text-muted-foreground">Supported Independent Living coordination and care management</p>
        </div>
        <div className="flex gap-3">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Care Plan
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Shift
          </Button>
        </div>
      </div>

      <DashboardSection title="SIL Overview" className="mb-8">
        <DashboardTile
          title="Active Homes"
          value="8"
          subtitle="SIL properties managed"
          status="success"
        />
        <DashboardTile
          title="Participants"
          value="22"
          subtitle="People supported"
          status="success"
        />
        <DashboardTile
          title="Monthly Funding"
          value="$128,400"
          subtitle="SIL quotes active"
          status="success"
        />
        <DashboardTile
          title="Staff Coverage"
          value="94%"
          subtitle="Shifts filled this week"
          status="success"
        />
      </DashboardSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Staff Roster & Scheduling
            </CardTitle>
            <CardDescription>24/7 coverage, sleepovers, and active night shifts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Maple House - Active Night</h4>
                  <p className="text-sm text-muted-foreground">Tonight 22:00 - 06:00</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">Emma Wilson</Badge>
                    <Badge variant="outline">High Support</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">Confirmed</div>
                  <div className="text-xs text-muted-foreground">3 participants</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Oak Gardens - Sleepover</h4>
                  <p className="text-sm text-muted-foreground">Tomorrow 18:00 - 10:00</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">David Park</Badge>
                    <Badge variant="outline">Medium Support</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-orange-600">Needs Cover</div>
                  <div className="text-xs text-muted-foreground">2 participants</div>
                </div>
              </div>
            </div>
            <Button className="w-full" variant="outline">View Full Roster</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              House Management
            </CardTitle>
            <CardDescription>Shared costs, household tasks, and utilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Maple House</h4>
                  <p className="text-sm text-muted-foreground">3 participants, shared living</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">Utilities: $340/month</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Groceries Due</div>
                  <div className="text-xs text-muted-foreground">Budget: $450/week</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Oak Gardens</h4>
                  <p className="text-sm text-muted-foreground">2 participants, semi-independent</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">Cleaning: Weekly</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">Up to Date</div>
                  <div className="text-xs text-muted-foreground">Budget: $280/week</div>
                </div>
              </div>
            </div>
            <Button className="w-full" variant="outline">Manage Households</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Participant Plans
            </CardTitle>
            <CardDescription>Daily living goals and functional assessments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Sarah M. - Cooking Skills</h4>
                  <p className="text-sm text-muted-foreground">Daily living goal - Progress tracking</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">75% Complete</Badge>
                    <Badge variant="outline">Review Due</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Next Session</div>
                  <div className="text-xs text-muted-foreground">Tomorrow 2:00 PM</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">John D. - Community Access</h4>
                  <p className="text-sm text-muted-foreground">Social participation goal</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">New Goal</Badge>
                    <Badge variant="outline">Assessment</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Planning Phase</div>
                  <div className="text-xs text-muted-foreground">Start: 20/Feb/25</div>
                </div>
              </div>
            </div>
            <Button className="w-full" variant="outline">View All Plans</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Funding & Claims
            </CardTitle>
            <CardDescription>SIL quote tracking and utilisation monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">87%</div>
                <div className="text-sm text-blue-700">Quote Utilisation</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$112k</div>
                <div className="text-sm text-green-700">Claims Submitted</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Budget</span>
                <span className="font-medium">$128,400</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Used to Date</span>
                <span className="font-medium">$112,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining</span>
                <span className="font-medium text-green-600">$16,400</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">Generate Utilisation Report</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SILManagement;