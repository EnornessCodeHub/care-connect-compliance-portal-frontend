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
import { Home, DollarSign, Users, Zap, Plus, ShoppingCart, Calendar, AlertCircle } from "lucide-react";

const SILHouseManagement = () => {
  const [activeTab, setActiveTab] = useState("houses");

  const houses = [
    {
      id: "H001",
      name: "Maple House",
      address: "45 Maple St, Melbourne VIC",
      participants: ["Sarah M.", "John D.", "Emma T."],
      participantCount: 3,
      weeklyBudget: 450,
      utilities: 340,
      groceries: 380,
      cleaning: 120,
      maintenance: 80,
      status: "Active",
      houseManager: "Lisa Wilson",
      lastInspection: "10/Jan/2025"
    },
    {
      id: "H002",
      name: "Oak Gardens",
      address: "123 Oak Ave, Brisbane QLD", 
      participants: ["Michael C.", "Amy R."],
      participantCount: 2,
      weeklyBudget: 280,
      utilities: 220,
      groceries: 260,
      cleaning: 100,
      maintenance: 60,
      status: "Active",
      houseManager: "David Park",
      lastInspection: "15/Jan/2025"
    },
    {
      id: "H003",
      name: "Pine Vista",
      address: "789 Pine Rd, Perth WA",
      participants: ["Rachel L.", "Tom K.", "Sophie W.", "Ben M."],
      participantCount: 4,
      weeklyBudget: 520,
      utilities: 410,
      groceries: 480,
      cleaning: 150,
      maintenance: 100,
      status: "Maintenance Required",
      houseManager: "Emma Clarke",
      lastInspection: "05/Jan/2025"
    }
  ];

  const householdTasks = [
    {
      id: "T001",
      house: "Maple House",
      task: "Weekly Grocery Shopping",
      assignedTo: "Sarah M. & Support Worker",
      dueDate: "25/Jan/2025",
      frequency: "Weekly",
      budget: 90,
      status: "Scheduled",
      notes: "Include items for meal prep session"
    },
    {
      id: "T002",
      house: "Oak Gardens", 
      task: "Utilities Payment",
      assignedTo: "House Manager",
      dueDate: "30/Jan/2025",
      frequency: "Monthly",
      budget: 220,
      status: "Due Soon",
      notes: "Electricity and gas bill"
    },
    {
      id: "T003",
      house: "Pine Vista",
      task: "Deep Cleaning Service",
      assignedTo: "Professional Cleaners",
      dueDate: "02/Feb/2025",
      frequency: "Monthly",
      budget: 150,
      status: "Overdue",
      notes: "Focus on common areas and bathrooms"
    },
    {
      id: "T004",
      house: "Maple House",
      task: "Garden Maintenance",
      assignedTo: "Tom K. & Support Worker",
      dueDate: "28/Jan/2025",
      frequency: "Bi-weekly",
      budget: 40,
      status: "In Progress",
      notes: "Lawn mowing and plant watering"
    }
  ];

  const sharedCosts = [
    {
      house: "Maple House",
      month: "January 2025",
      utilities: 340,
      groceries: 380,
      cleaning: 120,
      maintenance: 80,
      internet: 80,
      insurance: 45,
      total: 1045,
      perParticipant: 348
    },
    {
      house: "Oak Gardens", 
      month: "January 2025",
      utilities: 220,
      groceries: 260,
      cleaning: 100,
      maintenance: 60,
      internet: 70,
      insurance: 30,
      total: 740,
      perParticipant: 370
    },
    {
      house: "Pine Vista",
      month: "January 2025",
      utilities: 410,
      groceries: 480,
      cleaning: 150,
      maintenance: 100,
      internet: 90,
      insurance: 60,
      total: 1290,
      perParticipant: 323
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "Maintenance Required":
        return <Badge className="bg-orange-100 text-orange-800">Maintenance Required</Badge>;
      case "Scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "Due Soon":
        return <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>;
      case "Overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case "In Progress":
        return <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>;
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SIL House Management</h1>
          <p className="text-muted-foreground">Shared costs, household tasks, and utilities management</p>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Household Task</DialogTitle>
                <DialogDescription>Schedule a new household task or expense</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="house">House</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select house" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maple">Maple House</SelectItem>
                      <SelectItem value="oak">Oak Gardens</SelectItem>
                      <SelectItem value="pine">Pine Vista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="taskType">Task Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="groceries">Grocery Shopping</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="garden">Garden Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="taskName">Task Description</Label>
                  <Input id="taskName" placeholder="Describe the task" />
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input id="assignedTo" placeholder="Person or service responsible" />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="How often?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input id="budget" type="number" placeholder="0.00" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional details or instructions" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Add Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add House
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Houses</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Home className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-bold">22</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Shared Costs</p>
                <p className="text-2xl font-bold">$12,450</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasks Due</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="houses">Houses</TabsTrigger>
          <TabsTrigger value="tasks">Household Tasks</TabsTrigger>
          <TabsTrigger value="costs">Shared Costs</TabsTrigger>
          <TabsTrigger value="utilities">Utilities</TabsTrigger>
        </TabsList>

        <TabsContent value="houses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {houses.map((house) => (
              <Card key={house.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{house.name}</CardTitle>
                    {getStatusBadge(house.status)}
                  </div>
                  <CardDescription>{house.address}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Participants:</span>
                      <span className="ml-2 font-medium">{house.participantCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Weekly Budget:</span>
                      <span className="ml-2 font-medium">${house.weeklyBudget}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Manager:</span>
                      <span className="ml-2 font-medium">{house.houseManager}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Residents:</p>
                    <div className="flex flex-wrap gap-1">
                      {house.participants.map((participant, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {participant}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-medium">${house.utilities}</div>
                      <div className="text-muted-foreground">Utilities</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-medium">${house.groceries}</div>
                      <div className="text-muted-foreground">Groceries</div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">Manage</Button>
                    <Button size="sm" variant="outline" className="flex-1">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Household Tasks</CardTitle>
              <CardDescription>Manage recurring tasks and household responsibilities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>House</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {householdTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.house}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.task}</div>
                          {task.notes && (
                            <div className="text-sm text-muted-foreground">{task.notes}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>{task.frequency}</TableCell>
                      <TableCell>${task.budget}</TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Complete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shared Costs Breakdown</CardTitle>
              <CardDescription>Monthly cost allocation across all SIL houses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sharedCosts.map((cost, index) => (
                  <Card key={index} className="border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {cost.house}
                        <span className="text-lg font-bold">${cost.total}/month</span>
                      </CardTitle>
                      <CardDescription>{cost.month} • ${cost.perParticipant} per participant</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <Zap className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                          <div className="font-medium">${cost.utilities}</div>
                          <div className="text-xs text-muted-foreground">Utilities</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <ShoppingCart className="h-6 w-6 mx-auto mb-1 text-green-600" />
                          <div className="font-medium">${cost.groceries}</div>
                          <div className="text-xs text-muted-foreground">Groceries</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <Home className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                          <div className="font-medium">${cost.cleaning}</div>
                          <div className="text-xs text-muted-foreground">Cleaning</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="font-medium">${cost.maintenance}</div>
                          <div className="text-xs text-muted-foreground">Maintenance</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium">${cost.internet}</div>
                          <div className="text-xs text-muted-foreground">Internet</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="font-medium">${cost.insurance}</div>
                          <div className="text-xs text-muted-foreground">Insurance</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utilities" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Utility Management</CardTitle>
                <CardDescription>Track and manage utility costs across all houses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Electricity - All Houses</div>
                      <div className="text-sm text-muted-foreground">Average monthly usage</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$970/month</div>
                      <div className="text-sm text-green-600">-5% vs last month</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Gas - All Houses</div>
                      <div className="text-sm text-muted-foreground">Heating and hot water</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$540/month</div>
                      <div className="text-sm text-orange-600">+12% vs last month</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Water - All Houses</div>
                      <div className="text-sm text-muted-foreground">Water and sewerage</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$320/month</div>
                      <div className="text-sm text-blue-600">No change</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bills</CardTitle>
                <CardDescription>Bills due in the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border-l-4 border-l-red-500 bg-red-50 rounded">
                    <div>
                      <div className="font-medium text-red-900">Maple House - Electricity</div>
                      <div className="text-sm text-red-700">Due: 28/Jan/2025</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-900">$235</div>
                      <Badge variant="destructive" className="text-xs">Overdue</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border-l-4 border-l-orange-500 bg-orange-50 rounded">
                    <div>
                      <div className="font-medium text-orange-900">Oak Gardens - Gas</div>
                      <div className="text-sm text-orange-700">Due: 30/Jan/2025</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-orange-900">$145</div>
                      <Badge className="bg-orange-100 text-orange-800 text-xs">Due Soon</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border-l-4 border-l-blue-500 bg-blue-50 rounded">
                    <div>
                      <div className="font-medium text-blue-900">Pine Vista - Water</div>
                      <div className="text-sm text-blue-700">Due: 05/Feb/2025</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-blue-900">$98</div>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">Scheduled</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Utility Usage Trends</CardTitle>
              <CardDescription>Monitor utility consumption patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Zap className="h-12 w-12 mx-auto mb-4" />
                <p>Usage charts and analytics will be displayed here</p>
                <p className="text-sm">Showing consumption trends and cost comparisons</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SILHouseManagement;