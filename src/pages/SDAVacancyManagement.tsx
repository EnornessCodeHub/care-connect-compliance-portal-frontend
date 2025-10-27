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
import { Home, Users, MapPin, Plus, Calendar, DollarSign, Filter, Search, Star } from "lucide-react";

const SDAVacancyManagement = () => {
  const [activeTab, setActiveTab] = useState("vacancies");
  
  const vacantProperties = [
    {
      id: "P001",
      name: "Garden Court - Unit 3",
      address: "456 Oak Ave, Brisbane QLD",
      bedrooms: 1,
      supportCategory: "Fully Accessible",
      targetRent: "$1,850",
      availableFrom: "15/Feb/2025",
      lastTenant: "Moved to family care",
      features: ["Wheelchair accessible", "Bathroom modifications", "Kitchen adaptations"],
      status: "Available",
      applications: 3
    },
    {
      id: "P002", 
      name: "Serenity Place - Unit 1",
      address: "123 River St, Adelaide SA",
      bedrooms: 2,
      supportCategory: "High Physical Support",
      targetRent: "$2,200",
      availableFrom: "01/Mar/2025",
      lastTenant: "Lease expired",
      features: ["Ceiling hoist", "Emergency alert system", "Accessible bathroom"],
      status: "Maintenance",
      applications: 0
    },
    {
      id: "P003",
      name: "Harmony Heights - Studio",
      address: "789 Hill Rd, Perth WA", 
      bedrooms: 0,
      supportCategory: "Intellectual Disability",
      targetRent: "$1,650",
      availableFrom: "20/Feb/2025",
      lastTenant: "Moved to SIL",
      features: ["Visual aids", "Simplified controls", "Community access"],
      status: "Available",
      applications: 2
    }
  ];

  const applications = [
    {
      id: "A001",
      applicantName: "Emma Thompson",
      ndisNumber: "1111222333",
      currentLocation: "Family home",
      preferredProperty: "Garden Court - Unit 3",
      supportNeeds: "Fully Accessible",
      applicationDate: "05/Jan/2025",
      status: "Under Review",
      priority: "High",
      notes: "Urgent housing need - current accommodation unsuitable"
    },
    {
      id: "A002",
      applicantName: "James Wilson", 
      ndisNumber: "4444555666",
      currentLocation: "Supported accommodation",
      preferredProperty: "Any suitable",
      supportNeeds: "High Physical Support",
      applicationDate: "12/Jan/2025", 
      status: "Matched",
      priority: "Medium",
      notes: "Seeking increased independence"
    },
    {
      id: "A003",
      applicantName: "Maria Garcia",
      ndisNumber: "7777888999",
      currentLocation: "Temporary housing",
      preferredProperty: "Harmony Heights - Studio",
      supportNeeds: "Intellectual Disability",
      applicationDate: "18/Jan/2025",
      status: "Documents Required",
      priority: "High", 
      notes: "All documentation submitted, awaiting verification"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case "Maintenance":
        return <Badge className="bg-orange-100 text-orange-800">Maintenance</Badge>;
      case "Under Review":
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>;
      case "Matched":
        return <Badge className="bg-purple-100 text-purple-800">Matched</Badge>;
      case "Documents Required":
        return <Badge className="bg-yellow-100 text-yellow-800">Documents Required</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High Priority</Badge>;
      case "Medium":
        return <Badge className="bg-orange-100 text-orange-800">Medium Priority</Badge>;
      case "Low":
        return <Badge variant="secondary">Low Priority</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SDA Vacancy Management</h1>
          <p className="text-muted-foreground">Property matching and vacancy management tools</p>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Housing Application</DialogTitle>
                <DialogDescription>Register a new applicant for SDA housing</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicantName">Applicant Name</Label>
                  <Input id="applicantName" placeholder="Full name" />
                </div>
                <div>
                  <Label htmlFor="ndisNum">NDIS Number</Label>
                  <Input id="ndisNum" placeholder="NDIS participant number" />
                </div>
                <div>
                  <Label htmlFor="currentLoc">Current Location</Label>
                  <Input id="currentLoc" placeholder="Current accommodation" />
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
                  <Label htmlFor="supportNeeds">Support Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select support category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Physical Support</SelectItem>
                      <SelectItem value="accessible">Fully Accessible</SelectItem>
                      <SelectItem value="intellectual">Intellectual Disability</SelectItem>
                      <SelectItem value="sensory">Sensory Impairment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Application Notes</Label>
                  <Textarea id="notes" placeholder="Additional information or special requirements" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Submit Application</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            List Property
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vacant Properties</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Home className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Applications</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Successful Matches</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Star className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Vacancy Days</p>
                <p className="text-2xl font-bold">28</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vacancies">Vacant Properties</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="matching">Smart Matching</TabsTrigger>
        </TabsList>

        <TabsContent value="vacancies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Properties</CardTitle>
              <CardDescription>Manage vacant SDA properties and their availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search properties..." className="pl-10" />
                  </div>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="maintenance">In Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vacantProperties.map((property) => (
                  <Card key={property.id} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{property.name}</CardTitle>
                        {getStatusBadge(property.status)}
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {property.address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Bedrooms:</span>
                          <span className="ml-2 font-medium">{property.bedrooms === 0 ? 'Studio' : property.bedrooms}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rent:</span>
                          <span className="ml-2 font-medium">{property.targetRent}/wk</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Support:</span>
                          <span className="ml-2 font-medium">{property.supportCategory}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Available:</span>
                          <span className="ml-2 font-medium">{property.availableFrom}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Key Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {property.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {property.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{property.features.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Applications:</span>
                          <span className="ml-2 font-medium">{property.applications}</span>
                        </div>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Housing Applications</CardTitle>
              <CardDescription>Manage participant applications for SDA housing</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>NDIS Number</TableHead>
                    <TableHead>Support Needs</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{app.applicantName}</div>
                          <div className="text-sm text-muted-foreground">{app.currentLocation}</div>
                        </div>
                      </TableCell>
                      <TableCell>{app.ndisNumber}</TableCell>
                      <TableCell>{app.supportNeeds}</TableCell>
                      <TableCell>{app.applicationDate}</TableCell>
                      <TableCell>{getPriorityBadge(app.priority)}</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Review</Button>
                          <Button variant="outline" size="sm">Match</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Property Matching</CardTitle>
              <CardDescription>AI-powered matching system for optimal tenant-property pairing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Recommended Matches</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <div className="font-medium">Emma Thompson → Garden Court - Unit 3</div>
                      <div className="text-sm text-muted-foreground">97% compatibility match</div>
                      <div className="text-xs text-blue-600">Perfect accessibility features match</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Approve Match</Button>
                      <Button variant="outline" size="sm">Review</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <div className="font-medium">Maria Garcia → Harmony Heights - Studio</div>
                      <div className="text-sm text-muted-foreground">85% compatibility match</div>
                      <div className="text-xs text-green-600">Support category and location match</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Approve Match</Button>
                      <Button variant="outline" size="sm">Review</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Matching Criteria</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Support category compatibility</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location preference</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accessibility requirements</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget compatibility</span>
                      <span className="font-medium">15%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Matching Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Successful matches this month</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average match score</span>
                      <span className="font-medium">91%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time to match (avg)</span>
                      <span className="font-medium">14 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Match success rate</span>
                      <span className="font-medium">89%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SDAVacancyManagement;