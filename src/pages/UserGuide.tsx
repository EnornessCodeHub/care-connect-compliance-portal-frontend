import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Users, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  MessageSquare, 
  Settings, 
  Database,
  Workflow,
  UserPlus,
  ClipboardList,
  DollarSign,
  Shield,
  Building,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Play,
  BookOpen,
  Navigation,
  Clock,
  Activity
} from "lucide-react";

export default function UserGuide() {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Interactive User Guide
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Complete guide to understanding how the NDIS management system works and how all components connect together.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigateTo("/clients/new")} className="gap-2">
            <Play className="h-4 w-4" />
            Start Tutorial
          </Button>
          <Button variant="outline" onClick={() => navigateTo("/")} className="gap-2">
            <Navigation className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Guide</TabsTrigger>
          <TabsTrigger value="modules">Module Details</TabsTrigger>
          <TabsTrigger value="navigation">Navigation Help</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-6 w-6" />
                System Architecture & Data Flow
              </CardTitle>
              <CardDescription>
                Understanding how different modules connect and data flows through the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo("/clients")}>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Client Management</h3>
                    <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Central hub for all client data, profiles, and relationships
                  </p>
                  <Button size="sm" className="mt-2 w-full" onClick={(e) => { e.stopPropagation(); navigateTo("/clients"); }}>
                    Open Clients
                  </Button>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo("/documents")}>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Document System</h3>
                    <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Manages all client documents, compliance, and file storage
                  </p>
                  <Button size="sm" className="mt-2 w-full" onClick={(e) => { e.stopPropagation(); navigateTo("/documents"); }}>
                    Open Documents
                  </Button>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo("/invoices")}>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">NDIS Integration</h3>
                    <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pricing schedules, support catalogues, and claims management
                  </p>
                  <Button size="sm" className="mt-2 w-full" onClick={(e) => { e.stopPropagation(); navigateTo("/invoices"); }}>
                    Open Invoices
                  </Button>
                </Card>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Interactive Data Flow Matrix</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/clients/new")}>Client Creation</Button>
                      <ChevronRight className="h-4 w-4" />
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/clients/CLI-166371/setup")}>Setup Wizard</Button>
                      <ChevronRight className="h-4 w-4" />
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/clients/CLI-166371")}>Profile Completion</Button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/documents")}>Documents</Button>
                      <span>↔</span>
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/clients")}>Client Profile</Button>
                      <ChevronRight className="h-4 w-4" />
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/clients/expired-documents")}>Compliance Tracking</Button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/appointments")}>Services</Button>
                      <ChevronRight className="h-4 w-4" />
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/admin/pricing")}>NDIS Pricing</Button>
                      <ChevronRight className="h-4 w-4" />
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/invoices")}>Invoicing</Button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/incidents/dashboard")}>Incidents/Complaints</Button>
                      <ChevronRight className="h-4 w-4" />
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/reports")}>Reporting</Button>
                      <ChevronRight className="h-4 w-4" />
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/incidents/ndis-reportable")}>Compliance</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6" />
                Interactive Workflow Guide
              </CardTitle>
              <CardDescription>
                Step-by-step process for managing clients and services - click to try each step
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Collapsible open={openSections.includes("step1")} onOpenChange={() => toggleSection("step1")}>
                  <CollapsibleTrigger asChild>
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Client Onboarding
                            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes("step1") ? "rotate-180" : ""}`} />
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Create new client → Complete demographics → Run setup wizard
                          </p>
                        </div>
                      </div>
                    </Card>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <div className="ml-12 space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" onClick={() => navigateTo("/clients/new")} className="gap-2">
                          <UserPlus className="h-3 w-3" />
                          Create New Client
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => navigateTo("/admin/manage-fields")} className="gap-2">
                          <Settings className="h-3 w-3" />
                          Manage Custom Fields
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        The client onboarding process involves collecting basic demographic information, 
                        then guiding through a comprehensive setup wizard covering goals, documents, budgets, 
                        health information, consent forms, and cultural considerations.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={openSections.includes("step2")} onOpenChange={() => toggleSection("step2")}>
                  <CollapsibleTrigger asChild>
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Document Management
                            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes("step2") ? "rotate-180" : ""}`} />
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Upload documents → Track expiration → Ensure compliance
                          </p>
                        </div>
                      </div>
                    </Card>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <div className="ml-12 space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" onClick={() => navigateTo("/documents")} className="gap-2">
                          <FileText className="h-3 w-3" />
                          Manage Documents
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => navigateTo("/clients/expired-documents")} className="gap-2">
                          <AlertTriangle className="h-3 w-3" />
                          Check Expired Docs
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Document management includes uploading client files, categorizing by type, 
                        tracking expiration dates, and ensuring all compliance requirements are met 
                        for NDIS service delivery.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={openSections.includes("step3")} onOpenChange={() => toggleSection("step3")}>
                  <CollapsibleTrigger asChild>
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Service Delivery
                            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes("step3") ? "rotate-180" : ""}`} />
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Schedule appointments → Assign team → Track hours
                          </p>
                        </div>
                      </div>
                    </Card>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <div className="ml-12 space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" onClick={() => navigateTo("/appointments")} className="gap-2">
                          <Calendar className="h-3 w-3" />
                          Schedule Appointments
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => navigateTo("/team")} className="gap-2">
                          <Users className="h-3 w-3" />
                          Manage Team
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => navigateTo("/timesheets")} className="gap-2">
                          <Clock className="h-3 w-3" />
                          View Timesheets
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Service delivery involves scheduling client appointments, assigning appropriate 
                        team members, tracking service hours, and generating accurate timesheets 
                        for billing purposes.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={openSections.includes("step4")} onOpenChange={() => toggleSection("step4")}>
                  <CollapsibleTrigger asChild>
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            NDIS Claims & Invoicing
                            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes("step4") ? "rotate-180" : ""}`} />
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Reference pricing → Generate invoices → Submit claims
                          </p>
                        </div>
                      </div>
                    </Card>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <div className="ml-12 space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" onClick={() => navigateTo("/invoices/generate")} className="gap-2">
                          <DollarSign className="h-3 w-3" />
                          Generate Invoices
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => navigateTo("/invoices/ndis-claims")} className="gap-2">
                          <Shield className="h-3 w-3" />
                          NDIS Claims
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => navigateTo("/admin/pricing")} className="gap-2">
                          <BarChart3 className="h-3 w-3" />
                          Pricing Schedule
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        NDIS integration includes referencing current pricing schedules, generating 
                        service quotes, creating accurate invoices, and submitting claims through 
                        the proper NDIS channels.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={openSections.includes("step5")} onOpenChange={() => toggleSection("step5")}>
                  <CollapsibleTrigger asChild>
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">5</div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Incident & Complaint Management
                            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes("step5") ? "rotate-180" : ""}`} />
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Record incidents → Manage complaints → Generate reports
                          </p>
                        </div>
                      </div>
                    </Card>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <div className="ml-12 space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" onClick={() => navigateTo("/incidents/dashboard")} className="gap-2">
                          <AlertTriangle className="h-3 w-3" />
                          Incidents Dashboard
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => navigateTo("/complaints/dashboard")} className="gap-2">
                          <MessageSquare className="h-3 w-3" />
                          Complaints Dashboard
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => navigateTo("/reports")} className="gap-2">
                          <BarChart3 className="h-3 w-3" />
                          Generate Reports
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Incident and complaint management involves recording events, tracking resolution, 
                        managing escalations, and generating compliance reports for regulatory requirements.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6" />
                Module Interconnections
              </CardTitle>
              <CardDescription>
                How different system modules work together - click to explore
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Core Dependencies</h3>
                  <div className="space-y-3">
                    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo("/clients")}>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium">Client Profile</span>
                        <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Central to: Documents, Appointments, Incidents, Complaints, Invoices
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Explore Client Management
                      </Button>
                    </Card>
                    
                    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo("/admin/manage-fields")}>
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="h-4 w-4 text-primary" />
                        <span className="font-medium">Custom Fields</span>
                        <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Extends: Client Forms, Setup Wizard, Profile Management
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Configure Fields
                      </Button>
                    </Card>
                    
                    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo("/admin/pricing")}>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-medium">NDIS Pricing</span>
                        <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Powers: Service Quotes, Invoice Generation, Claims Processing
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        View Pricing
                      </Button>
                    </Card>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Data Relationships</h3>
                  <div className="space-y-3">
                    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo("/admin/outlets")}>
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-4 w-4 text-primary" />
                        <span className="font-medium">Multi-Outlet Support</span>
                        <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Clients → Outlets → Staff → Services → Reporting
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Manage Outlets
                      </Button>
                    </Card>
                    
                    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo("/reports")}>
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <span className="font-medium">Reporting Chain</span>
                        <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Services → Timesheets → Invoices → Claims → Reports
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Generate Reports
                      </Button>
                    </Card>
                    
                    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo("/incidents/dashboard")}>
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span className="font-medium">Communication Flow</span>
                        <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Incidents/Complaints → Escalation → Resolution → Documentation
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        View Incidents
                      </Button>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Interactive Navigation Guide
              </CardTitle>
              <CardDescription>
                Quick access to all system features - click any button to navigate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">Main Navigation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Dashboard</span>
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/")}>
                        Go to Dashboard
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Clients</span>
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/clients")}>
                        Manage Clients
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Team</span>
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/team")}>
                        View Team
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Appointments</span>
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/appointments")}>
                        Schedule
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Documents</span>
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/documents")}>
                        File Manager
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Admin Functions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>User Management</span>
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/admin/users")}>
                        Manage Users
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Outlets</span>
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/admin/outlets")}>
                        Setup Outlets
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Custom Fields</span>
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/admin/manage-fields")}>
                        Configure
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Reports</span>
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/reports")}>
                        Generate Reports
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>NDIS Management</span>
                      <Button size="sm" variant="outline" onClick={() => navigateTo("/admin/pricing")}>
                        Pricing & Claims
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button onClick={() => navigateTo("/clients/new")} className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  New Client
                </Button>
                <Button onClick={() => navigateTo("/team/new")} className="gap-2">
                  <Users className="h-4 w-4" />
                  New Employee
                </Button>
                <Button onClick={() => navigateTo("/staff-tracking")} className="gap-2">
                  <Navigation className="h-4 w-4" />
                  Staff Check-in
                </Button>
                <Button onClick={() => navigateTo("/live-staff-dashboard")} className="gap-2">
                  <Activity className="h-4 w-4" />
                  Live Dashboard
                </Button>
                <Button onClick={() => navigateTo("/invoices/generate")} className="gap-2">
                  <DollarSign className="h-4 w-4" />
                  Generate Invoice
                </Button>
                <Button onClick={() => navigateTo("/incidents/dashboard")} className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  View Incidents
                </Button>
              </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices & Tips</CardTitle>
          <CardDescription>
            Recommended workflows and system optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-green-700 flex items-center gap-2">
                ✅ Do This
                <Button size="sm" variant="outline" onClick={() => navigateTo("/clients/new")}>
                  Try Now
                </Button>
              </h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Complete client setup wizard fully</li>
                <li>• Keep documents up to date</li>
                <li>• Use custom fields for specific needs</li>
                <li>• Regular backup of important data</li>
                <li>• Track document expiration dates</li>
                <li>• Follow incident reporting procedures</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-red-700">❌ Avoid This</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Skipping required setup steps</li>
                <li>• Deleting clients with active services</li>
                <li>• Ignoring document compliance</li>
                <li>• Manual data entry errors</li>
                <li>• Incomplete incident reports</li>
                <li>• Not backing up important files</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div className="text-center space-y-4">
            <h3 className="font-semibold">Need Help Getting Started?</h3>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={() => navigateTo("/clients/new")} size="lg" className="gap-2">
                <UserPlus className="h-5 w-5" />
                Create Your First Client
              </Button>
              <Button onClick={() => navigateTo("/admin/manage-fields")} variant="outline" size="lg" className="gap-2">
                <Settings className="h-5 w-5" />
                Configure System
              </Button>
              <Button onClick={() => navigateTo("/")} variant="outline" size="lg" className="gap-2">
                <BarChart3 className="h-5 w-5" />
                View Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}