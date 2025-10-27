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
import { Target, TrendingUp, Calendar, Users, Plus, Search, Filter, CheckCircle2, Clock } from "lucide-react";

const SILParticipantPlans = () => {
  const [activeTab, setActiveTab] = useState("plans");

  const participantPlans = [
    {
      id: "PP001",
      participant: "Sarah Mitchell",
      ndisNumber: "1234567890",
      house: "Maple House",
      planStart: "01/Jan/2025",
      planEnd: "31/Dec/2025",
      planManager: "Lisa Wilson",
      status: "Active",
      totalGoals: 8,
      achievedGoals: 5,
      progressPercentage: 62,
      lastReview: "15/Jan/2025",
      nextReview: "15/Apr/2025",
      riskLevel: "Low"
    },
    {
      id: "PP002",
      participant: "John Davis",
      ndisNumber: "0987654321", 
      house: "Maple House",
      planStart: "15/Feb/2024",
      planEnd: "14/Feb/2025",
      planManager: "Lisa Wilson",
      status: "Review Due",
      totalGoals: 6,
      achievedGoals: 4,
      progressPercentage: 67,
      lastReview: "15/Nov/2024",
      nextReview: "15/Feb/2025",
      riskLevel: "Medium"
    },
    {
      id: "PP003",
      participant: "Emma Thompson",
      ndisNumber: "5555666777",
      house: "Maple House",
      planStart: "01/Sep/2024",
      planEnd: "31/Aug/2025", 
      planManager: "Lisa Wilson",
      status: "Active",
      totalGoals: 10,
      achievedGoals: 3,
      progressPercentage: 30,
      lastReview: "01/Jan/2025",
      nextReview: "01/Apr/2025",
      riskLevel: "High"
    },
    {
      id: "PP004",
      participant: "Michael Chen",
      ndisNumber: "1111222333",
      house: "Oak Gardens",
      planStart: "01/Jun/2024",
      planEnd: "31/May/2025",
      planManager: "David Park",
      status: "Active",
      totalGoals: 7,
      achievedGoals: 6,
      progressPercentage: 86,
      lastReview: "01/Dec/2024",
      nextReview: "01/Mar/2025",
      riskLevel: "Low"
    }
  ];

  const dailyLivingGoals = [
    {
      id: "DLG001",
      participant: "Sarah Mitchell",
      category: "Cooking Skills",
      goal: "Prepare 3 different meals independently",
      startDate: "01/Jan/2025",
      targetDate: "30/Jun/2025",
      progress: 40,
      status: "In Progress",
      milestones: ["Basic meal prep", "Cooking with supervision", "Independent cooking"],
      completedMilestones: 1,
      supportWorker: "Amy Clarke",
      lastSession: "20/Jan/2025",
      nextSession: "27/Jan/2025",
      notes: "Shows good understanding of kitchen safety. Needs practice with timing multiple dishes."
    },
    {
      id: "DLG002",
      participant: "Sarah Mitchell", 
      category: "Personal Hygiene",
      goal: "Maintain personal hygiene routine independently",
      startDate: "01/Jan/2025",
      targetDate: "31/Mar/2025",
      progress: 75,
      status: "In Progress",
      milestones: ["Morning routine", "Evening routine", "Weekly deep clean"],
      completedMilestones: 2,
      supportWorker: "Amy Clarke",
      lastSession: "22/Jan/2025",
      nextSession: "25/Jan/2025",
      notes: "Excellent progress. Weekly routine needs reinforcement."
    },
    {
      id: "DLG003",
      participant: "John Davis",
      category: "Community Access", 
      goal: "Use public transport independently for familiar routes",
      startDate: "15/Feb/2024",
      targetDate: "15/May/2024",
      progress: 100,
      status: "Achieved",
      milestones: ["Learn bus routes", "Practice with support", "Independent travel"],
      completedMilestones: 3,
      supportWorker: "Tom Mitchell",
      lastSession: "10/May/2024",
      nextSession: "N/A",
      notes: "Goal successfully achieved. Travels to work independently daily."
    },
    {
      id: "DLG004",
      participant: "Emma Thompson",
      category: "Social Skills",
      goal: "Initiate and maintain conversations with peers",
      startDate: "01/Sep/2024",
      targetDate: "31/Aug/2025",
      progress: 25,
      status: "Needs Support",
      milestones: ["Eye contact", "Greeting others", "Extended conversations"],
      completedMilestones: 0,
      supportWorker: "Sophie Wilson",
      lastSession: "18/Jan/2025",
      nextSession: "25/Jan/2025",
      notes: "Slow progress. Consider adjusting approach or extending timeframe."
    }
  ];

  const functionalAssessments = [
    {
      participant: "Sarah Mitchell",
      assessmentDate: "15/Dec/2024",
      assessor: "Occupational Therapist - Dr. Jane Smith",
      domains: {
        mobility: { score: 8, level: "Independent" },
        selfCare: { score: 6, level: "Minimal Support" },
        communication: { score: 9, level: "Independent" },
        socialSkills: { score: 7, level: "Minimal Support" },
        cognitiveFunction: { score: 8, level: "Independent" }
      },
      overallScore: 76,
      recommendations: [
        "Continue independence in mobility and communication",
        "Focus on advanced self-care skills",
        "Develop peer relationship building"
      ],
      nextAssessment: "15/Jun/2025"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "Review Due":
        return <Badge className="bg-orange-100 text-orange-800">Review Due</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "Achieved":
        return <Badge className="bg-green-100 text-green-800">Achieved</Badge>;
      case "Needs Support":
        return <Badge className="bg-red-100 text-red-800">Needs Support</Badge>;
      case "On Hold":
        return <Badge className="bg-gray-100 text-gray-800">On Hold</Badge>;
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

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Independent":
        return <Badge className="bg-green-100 text-green-800">Independent</Badge>;
      case "Minimal Support":
        return <Badge className="bg-blue-100 text-blue-800">Minimal Support</Badge>;
      case "Moderate Support":
        return <Badge className="bg-yellow-100 text-yellow-800">Moderate Support</Badge>;
      case "High Support":
        return <Badge className="bg-red-100 text-red-800">High Support</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SIL Participant Plans</h1>
          <p className="text-muted-foreground">Daily living goals and functional assessments</p>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Goal</DialogTitle>
                <DialogDescription>Create a new daily living goal for a participant</DialogDescription>
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
                  <Label htmlFor="category">Goal Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cooking">Cooking Skills</SelectItem>
                      <SelectItem value="hygiene">Personal Hygiene</SelectItem>
                      <SelectItem value="community">Community Access</SelectItem>
                      <SelectItem value="social">Social Skills</SelectItem>
                      <SelectItem value="financial">Financial Management</SelectItem>
                      <SelectItem value="household">Household Tasks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="goal">Goal Description</Label>
                  <Textarea id="goal" placeholder="Describe the specific goal and what success looks like" />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input id="targetDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="supportWorker">Support Worker</Label>
                  <Input id="supportWorker" placeholder="Assigned support worker" />
                </div>
                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="milestones">Milestones (comma separated)</Label>
                  <Input id="milestones" placeholder="List key milestones to track progress" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create Goal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Plan
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Plans</p>
                <p className="text-2xl font-bold">22</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Goals in Progress</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Goals Achieved</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reviews Due</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Participant Plans</TabsTrigger>
          <TabsTrigger value="goals">Daily Living Goals</TabsTrigger>
          <TabsTrigger value="assessments">Functional Assessments</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Participant Support Plans</CardTitle>
              <CardDescription>Overview of all participant support plans and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search participants..." className="pl-10" />
                  </div>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="review">Review Due</SelectItem>
                    <SelectItem value="high-risk">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>House</TableHead>
                    <TableHead>Plan Manager</TableHead>
                    <TableHead>Plan Period</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Next Review</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participantPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plan.participant}</div>
                          <div className="text-sm text-muted-foreground">{plan.ndisNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>{plan.house}</TableCell>
                      <TableCell>{plan.planManager}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{plan.planStart} to</div>
                          <div>{plan.planEnd}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Progress value={plan.progressPercentage} className="flex-1" />
                            <span className="text-sm font-medium">{plan.progressPercentage}%</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {plan.achievedGoals}/{plan.totalGoals} goals achieved
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{plan.nextReview}</TableCell>
                      <TableCell>{getRiskBadge(plan.riskLevel)}</TableCell>
                      <TableCell>{getStatusBadge(plan.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Living Goals</CardTitle>
              <CardDescription>Individual goals and their progress across all participants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyLivingGoals.map((goal) => (
                  <Card key={goal.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{goal.participant}</h4>
                            <Badge variant="outline">{goal.category}</Badge>
                            {getStatusBadge(goal.status)}
                          </div>
                          <p className="text-sm mb-3">{goal.goal}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <div className="text-xs text-muted-foreground">Progress</div>
                              <div className="flex items-center gap-2">
                                <Progress value={goal.progress} className="flex-1" />
                                <span className="text-sm font-medium">{goal.progress}%</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {goal.completedMilestones}/{goal.milestones.length} milestones completed
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Timeline</div>
                              <div className="text-sm">
                                <div>Started: {goal.startDate}</div>
                                <div>Target: {goal.targetDate}</div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-muted-foreground">Support Worker</div>
                              <div className="text-sm font-medium">{goal.supportWorker}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Next Session</div>
                              <div className="text-sm font-medium">{goal.nextSession}</div>
                            </div>
                          </div>

                          {goal.notes && (
                            <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                              <strong>Notes:</strong> {goal.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline">Update</Button>
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Functional Assessments</CardTitle>
              <CardDescription>Comprehensive functional capacity assessments for each participant</CardDescription>
            </CardHeader>
            <CardContent>
              {functionalAssessments.map((assessment, index) => (
                <Card key={index} className="mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{assessment.participant}</CardTitle>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{assessment.overallScore}/100</div>
                        <div className="text-sm text-muted-foreground">Overall Score</div>
                      </div>
                    </div>
                    <CardDescription>
                      Assessed by {assessment.assessor} on {assessment.assessmentDate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                      {Object.entries(assessment.domains).map(([domain, data]) => (
                        <div key={domain} className="text-center p-3 border rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{data.score}/10</div>
                          <div className="text-sm font-medium capitalize">{domain}</div>
                          <div className="mt-1">{getLevelBadge(data.level)}</div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {assessment.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Next Assessment: {assessment.nextAssessment}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Full Report</Button>
                        <Button size="sm" variant="outline">Schedule Review</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Goal Achievement Rates</CardTitle>
                <CardDescription>Progress across all participants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Cooking Skills</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="w-24" />
                      <span className="text-sm font-medium">65%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Personal Hygiene</span>
                    <div className="flex items-center gap-2">
                      <Progress value={78} className="w-24" />
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Community Access</span>
                    <div className="flex items-center gap-2">
                      <Progress value={52} className="w-24" />
                      <span className="text-sm font-medium">52%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Social Skills</span>
                    <div className="flex items-center gap-2">
                      <Progress value={43} className="w-24" />
                      <span className="text-sm font-medium">43%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress Summary</CardTitle>
                <CardDescription>Key achievements this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-sm text-green-700">Goals Achieved</div>
                    <div className="text-xs text-muted-foreground">This month</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">18</div>
                      <div className="text-xs text-blue-700">New Goals Started</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">156</div>
                      <div className="text-xs text-purple-700">Active Goals</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Progress Trends</CardTitle>
              <CardDescription>Monthly progress tracking and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <p>Progress tracking charts and analytics will be displayed here</p>
                <p className="text-sm">Showing goal achievement trends, participant progress patterns, and outcome measurements</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SILParticipantPlans;