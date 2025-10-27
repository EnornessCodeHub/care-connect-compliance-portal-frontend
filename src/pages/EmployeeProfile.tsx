import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  ChevronDown,
  Camera,
  Info
} from "lucide-react";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock employee data - in real app this would come from an API
  const employee = {
    id: id || "1",
    name: "Marko Bajic",
    preferredName: "",
    email: "markobajic@live.com.au",
    phone: "+61431432162",
    emergencyContact: "",
    address: "",
    gender: "",
    employmentType: "Casual",
    dob: "21-09-2025",
    languageSpoken: "",
    lastLogin: "3 days ago",
    status: "Awaiting Response",
    role: "Admin",
    teams: "",
    jobTitle: "",
    avatar: "MB"
  };

  const complianceItems = [
    { category: "COVID-19 Compliance", expiresAt: "-", lastUpdate: "-", status: "Not Specified" },
    { category: "First Aid Certificate", expiresAt: "-", lastUpdate: "-", status: "Not Specified" },
    { category: "NDIS Worker Check (NDISWC)", expiresAt: "-", lastUpdate: "-", status: "Not Specified" },
    { category: "Police Check", expiresAt: "-", lastUpdate: "-", status: "Not Specified" },
    { category: "Working With Children Check", expiresAt: "-", lastUpdate: "-", status: "Not Specified" },
    { category: "Visa Documentation", expiresAt: "-", lastUpdate: "-", status: "Not Specified" }
  ];

  const emailCategories = [
    { name: "Clock error", color: "bg-red-100 text-red-800" },
    { name: "Enquiry", color: "bg-blue-100 text-blue-800" },
    { name: "Expense", color: "bg-purple-100 text-purple-800" },
    { name: "Feedback", color: "bg-green-100 text-green-800" },
    { name: "Incident", color: "bg-orange-100 text-orange-800" },
    { name: "Injury", color: "bg-red-100 text-red-800" },
    { name: "Mileage", color: "bg-blue-100 text-blue-800" },
    { name: "Notes", color: "bg-gray-100 text-gray-800" },
    { name: "Rating", color: "bg-yellow-100 text-yellow-800" },
    { name: "Shift accepted", color: "bg-green-100 text-green-800" },
    { name: "Shift declined", color: "bg-red-100 text-red-800" },
    { name: "Family Portal Shift Request", color: "bg-indigo-100 text-indigo-800" },
    { name: "Job Board Applications", color: "bg-cyan-100 text-cyan-800" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/team")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            BACK TO STAFF LIST
          </Button>
          
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 bg-blue-500">
              <AvatarFallback className="text-white font-bold">
                {employee.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{employee.name}</h1>
              <div className="flex items-center space-x-4">
                <p className="text-sm text-muted-foreground">Details</p>
                <span className="text-xs text-muted-foreground">•</span>
                <p className="text-sm text-muted-foreground">Last login: {employee.lastLogin}</p>
              </div>
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Manage <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit Profile</DropdownMenuItem>
            <DropdownMenuItem>Reset Password</DropdownMenuItem>
            <DropdownMenuItem>Deactivate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="payroll">Payroll & Notes</TabsTrigger>
          <TabsTrigger value="hr">HR Management</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          {/* Personal Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Details</CardTitle>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                EDIT
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Name:</Label>
                  <p className="font-medium">{employee.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Preferred Name:</Label>
                  <p className="font-medium">{employee.preferredName || "-"}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Phone number:</Label>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{employee.phone}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email:</Label>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{employee.email}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Emergency Contact:</Label>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Name:</Label>
                      <p className="text-sm">-</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Relation:</Label>
                      <p className="text-sm">-</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Contact:</Label>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span className="text-sm">-</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Email:</Label>
                      <p className="text-sm">-</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Address:</Label>
                  <p className="font-medium">{employee.address || "-"}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Gender:</Label>
                  <p className="font-medium">{employee.gender || "-"}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Employment Type:</Label>
                  <p className="font-medium">{employee.employmentType}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">DOB:</Label>
                  <p className="font-medium">{employee.dob}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Language Spoken:</Label>
                  <p className="font-medium">{employee.languageSpoken || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          {/* Availability */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Availability</CardTitle>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                EDIT
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Working Days:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">Monday</Badge>
                    <Badge variant="outline" className="text-xs">Tuesday</Badge>
                    <Badge variant="outline" className="text-xs">Wednesday</Badge>
                    <Badge variant="outline" className="text-xs">Thursday</Badge>
                    <Badge variant="outline" className="text-xs">Friday</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Working Hours:</Label>
                  <p className="text-sm font-medium">9:00 AM - 5:00 PM</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Break Time:</Label>
                  <p className="text-sm font-medium">12:00 PM - 1:00 PM</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Time Zone:</Label>
                  <p className="text-sm font-medium">AEST (UTC+10)</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Special Availability Notes:</Label>
                <p className="text-sm">Available for emergency calls after hours</p>
              </div>
              
              <div className="flex justify-between items-center">
                <Label className="text-sm">Available for Weekend Work:</Label>
                <Checkbox />
              </div>
              
              <div className="flex justify-between items-center">
                <Label className="text-sm">Available for Travel:</Label>
                <Checkbox checked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Compliance</CardTitle>
              <Button variant="outline" size="sm" className="text-blue-500">
                MANAGE ALL
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Expires At</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell>{item.expiresAt}</TableCell>
                      <TableCell>{item.lastUpdate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
            {/* Permissions and Settings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Permissions and settings</CardTitle>
                <Button variant="outline" size="sm" className="text-blue-500">
                  EDIT
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-sm">Status</Label>
                  <Badge variant="outline" className="text-blue-600">
                    {employee.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Role</Label>
                  <Badge variant="outline" className="text-blue-600">
                    {employee.role}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Teams</Label>
                  <span className="text-sm">{employee.teams || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Job Title</Label>
                  <span className="text-sm">{employee.jobTitle || "-"}</span>
                </div>

                {/* Granular Permissions */}
                <div className="border-t pt-4 mt-4">
                  <Label className="text-sm font-medium mb-3 block">Access Permissions</Label>
                  
                  {/* Personal Details Permissions */}
                  <div className="space-y-2 mb-4">
                    <Label className="text-xs text-muted-foreground font-medium">Personal Details</Label>
                    <div className="flex justify-between items-center pl-2">
                      <Label className="text-xs">Can view personal details</Label>
                      <Checkbox checked />
                    </div>
                    <div className="flex justify-between items-center pl-2">
                      <Label className="text-xs">Can edit personal details</Label>
                      <Checkbox />
                    </div>
                  </div>

                  {/* Availability Permissions */}
                  <div className="space-y-2 mb-4">
                    <Label className="text-xs text-muted-foreground font-medium">Availability</Label>
                    <div className="flex justify-between items-center pl-2">
                      <Label className="text-xs">Can view availability</Label>
                      <Checkbox checked />
                    </div>
                    <div className="flex justify-between items-center pl-2">
                      <Label className="text-xs">Can edit availability</Label>
                      <Checkbox />
                    </div>
                  </div>

                  {/* Compliance Permissions */}
                  <div className="space-y-2 mb-4">
                    <Label className="text-xs text-muted-foreground font-medium">Compliance</Label>
                    <div className="flex justify-between items-center pl-2">
                      <Label className="text-xs">Can view compliance</Label>
                      <Checkbox checked />
                    </div>
                    <div className="flex justify-between items-center pl-2">
                      <Label className="text-xs">Can edit compliance</Label>
                      <Checkbox />
                    </div>
                  </div>

                  {/* Payroll & Notes Permissions */}
                  <div className="space-y-2 mb-4">
                    <Label className="text-xs text-muted-foreground font-medium">Payroll & Notes</Label>
                    <div className="flex justify-between items-center pl-2">
                      <Label className="text-xs">Can view payroll and notes</Label>
                      <Checkbox />
                    </div>
                    <div className="flex justify-between items-center pl-2">
                      <Label className="text-xs">Can edit payroll and notes</Label>
                      <Checkbox />
                    </div>
                  </div>

                  {/* HR Management Permissions */}
                  <div className="space-y-2 mb-4">
                    <Label className="text-xs text-muted-foreground font-medium">HR Management</Label>
                    <div className="flex justify-between items-center pl-2">
                      <Label className="text-xs">Can view HR management</Label>
                      <Checkbox />
                    </div>
                    <div className="flex justify-between items-center pl-2">
                      <Label className="text-xs">Can edit HR management</Label>
                      <Checkbox />
                    </div>
                  </div>

                  {/* Team Permissions */}
                  <div className="space-y-2 mb-4">
                    <Label className="text-xs text-muted-foreground font-medium">Team Access</Label>
                    <div className="flex justify-between items-center pl-2">
                      <Label className="text-xs">Can view own team</Label>
                      <Checkbox checked />
                    </div>
                    <div className="flex justify-between items-center pl-2">
                      <Label className="text-xs">Can view all teams</Label>
                      <Checkbox />
                    </div>
                    <div className="flex justify-between items-center pl-2">
                      <Label className="text-xs">Can manage team members</Label>
                      <Checkbox />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Label className="text-sm">Notify Timesheet Approval</Label>
                  <Checkbox checked />
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Subscribe to Notifications</Label>
                  <Checkbox checked />
                </div>
                <div>
                  <Label className="text-sm mb-2 block">Assigned notifications</Label>
                  <div className="flex flex-wrap gap-1">
                    {emailCategories.map((category, index) => (
                      <Badge key={index} variant="outline" className={`text-xs ${category.color}`}>
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm">Read and write private notes</Label>
                    <Checkbox checked />
                  </div>
                  <div className="flex justify-between">
                    <Label className="text-xs text-muted-foreground">Client Notes</Label>
                    <Checkbox checked />
                  </div>
                  <div className="flex justify-between">
                    <Label className="text-xs text-muted-foreground">Staff Notes</Label>
                    <Checkbox checked />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Account Owner</Label>
                  <Checkbox checked />
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payroll Settings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Payroll Settings</CardTitle>
                <Button variant="outline" size="sm" className="text-blue-500">
                  EDIT
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-sm">Industry Award</Label>
                  <span className="text-sm">-</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Award Level</Label>
                  <Badge variant="outline" className="text-blue-600">None</Badge>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Base Rate</Label>
                  <span className="text-sm">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Classification</Label>
                  <span className="text-sm">-</span>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Notes</CardTitle>
                <Button variant="outline" size="sm" className="text-blue-500">
                  EDIT
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Add notes about this employee..." 
                  className="min-h-[100px] resize-none"
                  value=""
                  readOnly
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hr" className="space-y-6">
          {/* Documents Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">HR Documents</CardTitle>
              <Button variant="outline" size="sm" className="text-blue-500">
                <Camera className="h-4 w-4 mr-2" />
                UPLOAD DOCUMENT
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Performance Reviews</Label>
                    <Input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      className="mt-1"
                      placeholder="Upload performance review"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Training Certificates</Label>
                    <Input 
                      type="file" 
                      accept=".pdf,.jpg,.png" 
                      className="mt-1"
                      placeholder="Upload training certificate"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Disciplinary Documents</Label>
                    <Input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      className="mt-1"
                      placeholder="Upload disciplinary document"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Contract Documents</Label>
                    <Input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      className="mt-1"
                      placeholder="Upload contract document"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label className="text-sm font-medium">Uploaded Documents</Label>
                  <div className="mt-2 p-4 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-sm text-muted-foreground text-center">No documents uploaded yet</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance & Reviews */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Performance & Reviews</CardTitle>
                <Button variant="outline" size="sm" className="text-blue-500">
                  MANAGE
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-sm">Last Performance Review</Label>
                  <span className="text-sm">-</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Next Review Due</Label>
                  <span className="text-sm">-</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Performance Rating</Label>
                  <Badge variant="outline" className="text-green-600">Excellent</Badge>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Goals Set</Label>
                  <span className="text-sm">0</span>
                </div>
              </CardContent>
            </Card>

            {/* Training & Development */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Training & Development</CardTitle>
                <Button variant="outline" size="sm" className="text-blue-500">
                  MANAGE
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-sm">Training Hours (YTD)</Label>
                  <span className="text-sm">0 hrs</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Certifications</Label>
                  <span className="text-sm">0</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Upcoming Training</Label>
                  <span className="text-sm">None scheduled</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Learning Path</Label>
                  <span className="text-sm">-</span>
                </div>
              </CardContent>
            </Card>

            {/* Employment History */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Employment History</CardTitle>
                <Button variant="outline" size="sm" className="text-blue-500">
                  VIEW ALL
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-sm">Start Date</Label>
                  <span className="text-sm">-</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Contract Type</Label>
                  <Badge variant="outline" className="text-blue-600">{employee.employmentType}</Badge>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Probation Period</Label>
                  <span className="text-sm">Completed</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Position Changes</Label>
                  <span className="text-sm">0</span>
                </div>
              </CardContent>
            </Card>

            {/* HR Actions & Notes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">HR Actions & Notes</CardTitle>
                <Button variant="outline" size="sm" className="text-blue-500">
                  ADD NOTE
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-sm">Disciplinary Actions</Label>
                  <span className="text-sm">0</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">Warnings</Label>
                  <span className="text-sm">0</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm">HR Meetings</Label>
                  <span className="text-sm">0</span>
                </div>
                <div>
                  <Label className="text-sm mb-2 block">HR Notes</Label>
                  <Textarea 
                    placeholder="Add HR notes..." 
                    className="min-h-[60px] resize-none text-xs"
                    value=""
                    readOnly
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfile;