import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardTile } from "@/components/dashboard/DashboardTile";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { QuickLinksPanel } from "@/components/dashboard/QuickLinksPanel";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { PendingTasksPanel } from "@/components/dashboard/PendingTasksPanel";
import { mockDashboardData, generateRandomData } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { 
  AlertTriangle, 
  MessageSquareWarning, 
  ShieldAlert, 
  ClockAlert, 
  UserX, 
  UserCheck, 
  Users2, 
  FileX2, 
  CreditCard, 
  TrendingUp,
  Activity,
  CalendarX2,
  Stethoscope,
  BarChart3,
  ThumbsUp,
  Building2,
  FolderOpen,
  Star,
  Timer,
  DollarSign,
  CheckCircle2,
  AlertOctagon,
  Zap
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useUser();
  const [data, setData] = useState(mockDashboardData);
  const [dateRange, setDateRange] = useState("today");
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateRandomData());
      setLastUpdated(new Date().toLocaleTimeString());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setData(generateRandomData());
    setLastUpdated(new Date().toLocaleTimeString());
    toast({
      title: "Dashboard Updated",
      description: "Data has been refreshed successfully.",
    });
  };

  const handleExport = (type: "excel" | "pdf") => {
    toast({
      title: `Exporting to ${type.toUpperCase()}`,
      description: `Dashboard data export initiated.`,
    });
  };

  const handleTileClick = (title: string, route?: string) => {
    if (route) {
      navigate(route);
    } else {
      toast({
        title: "Drill Down",
        description: `Opening detailed view for ${title}`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-primary/3 to-accent/3 rounded-full blur-3xl animate-[spin_20s_linear_infinite]" />
      </div>

      {/* Hero Header Section */}
      <div className="relative overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 animate-gradient-x bg-[length:400%_400%]" />
        <div className="relative">
          <div className="flex items-center justify-between p-6 pb-4 animate-fade-in">
            <div className="animate-scale-in">
              <DashboardHeader
                onRefresh={handleRefresh}
                onExport={handleExport}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                lastUpdated={lastUpdated}
              />
            </div>
            <div className="flex items-center space-x-3 animate-slide-in-right">
              <Button 
                onClick={() => navigate("/incidents/tickets")} 
                variant="outline"
                className="group gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <AlertTriangle className="h-4 w-4 group-hover:animate-bounce" />
                New Incident
              </Button>
              <Button 
                onClick={() => navigate("/complaints/tickets")} 
                variant="outline"
                className="group gap-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <MessageSquareWarning className="h-4 w-4 group-hover:animate-bounce" />
                New Complaint
              </Button>
              <Button 
                onClick={() => navigate("/team/new")} 
                variant="outline"
                className="group gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Building2 className="h-4 w-4 group-hover:animate-bounce" />
                New Employee
              </Button>
              <Button 
                onClick={() => navigate("/clients/new")} 
                className="group gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <UserPlus className="h-4 w-4 relative z-10" />
                <span className="relative z-10">New Client</span>
              </Button>
            </div>
          </div>
          
          {/* Live Stats Bar */}
          <div className="px-6 pb-6">
            <div className="bg-white/70 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg animate-fade-in">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-muted-foreground">System Status: </span>
                    <span className="font-medium text-green-600">All Systems Operational</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-muted-foreground">Active Users: </span>
                    <span className="font-medium">247</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Today's Revenue: </span>
                    <span className="font-medium text-green-600">$47,825</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last updated: {lastUpdated}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        {/* Personalized Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - User Profile & Quick Links */}
          <div className="lg:col-span-1 space-y-6">
            <UserProfileCard />
            <QuickLinksPanel />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Overview */}
            <div className="group">
              <div className="p-8 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-3xl backdrop-blur-sm border border-white/10">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Performance Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-2 transform hover:scale-110 transition-all duration-300">
                      <div className="text-3xl font-bold text-green-600">98.7%</div>
                      <div className="text-sm text-muted-foreground">System Uptime</div>
                    </div>
                    <div className="space-y-2 transform hover:scale-110 transition-all duration-300">
                      <div className="text-3xl font-bold text-blue-600">247</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                    <div className="space-y-2 transform hover:scale-110 transition-all duration-300">
                      <div className="text-3xl font-bold text-purple-600">1,847</div>
                      <div className="text-sm text-muted-foreground">Tasks Completed</div>
                    </div>
                    <div className="space-y-2 transform hover:scale-110 transition-all duration-300">
                      <div className="text-3xl font-bold text-orange-600">$2.4M</div>
                      <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Alerts Section */}
            <div className="group">
              <DashboardSection title="🚨 Quick Alerts (Compliance & Safeguards)">
                <DashboardTile
                  title="New Incidents"
                  value={data.quickAlerts.newIncidents.value}
                  subtitle="Requiring immediate attention"
                  icon={<AlertOctagon className="h-5 w-5" />}
                  status={data.quickAlerts.newIncidents.status}
                  onClick={() => handleTileClick("New Incidents", "/incidents/tickets")}
                />
                <DashboardTile
                  title="New Complaints"
                  value={data.quickAlerts.newComplaints.value}
                  subtitle="Past 24 hours"
                  icon={<MessageSquareWarning className="h-5 w-5" />}
                  status={data.quickAlerts.newComplaints.status}
                  onClick={() => handleTileClick("New Complaints", "/complaints/tickets")}
                />
                <DashboardTile
                  title="High-Risk Alerts"
                  value={data.quickAlerts.highRiskAlerts.value}
                  subtitle="Active safeguarding cases"
                  icon={<ShieldAlert className="h-5 w-5" />}
                  status={data.quickAlerts.highRiskAlerts.status}
                  onClick={() => handleTileClick("High-Risk Alerts", "/incidents/escalated")}
                />
                <DashboardTile
                  title="Restrictive Practice Alerts"
                  value={data.quickAlerts.restrictivePracticeAlerts.value}
                  subtitle="Requiring reporting"
                  icon={<Zap className="h-5 w-5" />}
                  status={data.quickAlerts.restrictivePracticeAlerts.status}
                  onClick={() => handleTileClick("Restrictive Practice Alerts", "/incidents/ndis-reportable")}
                />
              </DashboardSection>
            </div>
          </div>

          {/* Right Sidebar - Notifications & Tasks */}
          <div className="lg:col-span-1 space-y-6">
            <NotificationsPanel />
            <PendingTasksPanel />
          </div>
        </div>

        {/* Additional Dashboard Sections */}
        <div className="space-y-12">
          {/* Daily Operations Section */}
          <div className="group">
            <DashboardSection title="📋 Daily Operations">
              <DashboardTile
                title="Late Check-ins"
                value={data.dailyOperations.lateCheckIns.value}
                subtitle="Staff members"
                icon={<ClockAlert className="h-5 w-5" />}
                status={data.dailyOperations.lateCheckIns.status}
                onClick={() => handleTileClick("Late Check-ins", "/timesheets")}
              />
              <DashboardTile
                title="Late Check-outs"
                value={data.dailyOperations.lateCheckOuts.value}
                subtitle="Staff members"
                icon={<Timer className="h-5 w-5" />}
                status={data.dailyOperations.lateCheckOuts.status}
                onClick={() => handleTileClick("Late Check-outs", "/timesheets")}
              />
              <DashboardTile
                title="Staff Cancellations"
                value={data.dailyOperations.todayCancellationsStaff.value}
                subtitle="Today's shifts"
                icon={<UserX className="h-5 w-5" />}
                status={data.dailyOperations.todayCancellationsStaff.status}
                onClick={() => handleTileClick("Staff Cancellations", "/team")}
              />
              <DashboardTile
                title="Client Cancellations"
                value={data.dailyOperations.todayCancellationsClient.value}
                subtitle="Today's appointments"
                icon={<CalendarX2 className="h-5 w-5" />}
                status={data.dailyOperations.todayCancellationsClient.status}
                onClick={() => handleTileClick("Client Cancellations", "/appointments")}
              />
              <DashboardTile
                title="Shift Coverage Gaps"
                value={data.dailyOperations.shiftCoverageGaps.value}
                subtitle="Unallocated shifts"
                icon={<Users2 className="h-5 w-5" />}
                status={data.dailyOperations.shiftCoverageGaps.status}
                onClick={() => handleTileClick("Shift Coverage Gaps", "/team")}
              />
            </DashboardSection>
          </div>

          {/* Compliance Tracking Section */}
          <div className="group">
            <DashboardSection title="📄 Compliance Tracking">
              <DashboardTile
                title="Expired Staff Documents"
                value={data.compliance.expiredStaffDocs.value}
                subtitle="Immediate action required"
                icon={<FileX2 className="h-5 w-5" />}
                status={data.compliance.expiredStaffDocs.status}
                onClick={() => handleTileClick("Expired Staff Documents", "/documents")}
              />
              <DashboardTile
                title="Staff Docs (30 days)"
                value={data.compliance.staffDocsExpiring30.value}
                subtitle="Expiring soon"
                icon={<AlertTriangle className="h-5 w-5" />}
                status={data.compliance.staffDocsExpiring30.status}
                onClick={() => handleTileClick("Staff Documents Expiring", "/documents")}
              />
              <DashboardTile
                title="Expired Client Documents"
                value={data.compliance.expiredClientDocs.value}
                subtitle="Immediate action required"
                icon={<FileX2 className="h-5 w-5" />}
                status={data.compliance.expiredClientDocs.status}
                onClick={() => handleTileClick("Expired Client Documents", "/clients/expired-documents")}
              />
              <DashboardTile
                title="Client Docs (30 days)"
                value={data.compliance.clientDocsExpiring30.value}
                subtitle="Expiring soon"
                icon={<AlertTriangle className="h-5 w-5" />}
                status={data.compliance.clientDocsExpiring30.status}
                onClick={() => handleTileClick("Client Documents Expiring", "/clients/expired-documents")}
              />
              <DashboardTile
                title="Overdue Tasks"
                value={data.compliance.overdueTasks.value}
                subtitle="Across all departments"
                icon={<ClockAlert className="h-5 w-5" />}
                status={data.compliance.overdueTasks.status}
                onClick={() => handleTileClick("Overdue Tasks", "/reports")}
              />
            </DashboardSection>
          </div>

          {/* Financial Snapshot Section */}
          <div className="group">
            <DashboardSection title="💰 Financial Snapshot">
              <DashboardTile
                title="Unvoiced Costs"
                value={data.financial.unvoicedCosts.value}
                subtitle="Pending invoicing"
                icon={<CreditCard className="h-5 w-5" />}
                status={data.financial.unvoicedCosts.status}
                onClick={() => handleTileClick("Unvoiced Costs", "/invoices")}
              />
              <DashboardTile
                title="Invoiced Costs"
                value={data.financial.invoicedCosts.value}
                subtitle="This period"
                icon={<CheckCircle2 className="h-5 w-5" />}
                status={data.financial.invoicedCosts.status}
                onClick={() => handleTileClick("Invoiced Costs", "/invoices")}
              />
              <DashboardTile
                title="Outstanding (60+ days)"
                value={data.financial.outstandingPayments60.value}
                subtitle="Critical collection"
                icon={<AlertOctagon className="h-5 w-5" />}
                status={data.financial.outstandingPayments60.status}
                onClick={() => handleTileClick("Outstanding Payments", "/invoices")}
              />
              <DashboardTile
                title="Pending Approvals"
                value={data.financial.pendingApprovals.value}
                subtitle="Financial approvals"
                icon={<Timer className="h-5 w-5" />}
                status={data.financial.pendingApprovals.status}
                onClick={() => handleTileClick("Pending Approvals", "/invoices")}
              />
              <DashboardTile
                title="Funding Utilisation"
                value={data.financial.fundingUtilisation.value}
                subtitle="Current period"
                icon={<TrendingUp className="h-5 w-5" />}
                status={data.financial.fundingUtilisation.status}
                onClick={() => handleTileClick("Funding Utilisation", "/invoices/ndis-claims")}
              />
            </DashboardSection>
          </div>

          {/* Workforce & Service Delivery Section */}
          <div className="group">
            <DashboardSection title="👥 Workforce & Service Delivery">
              <DashboardTile
                title="Staff Availability"
                value={data.workforce.staffAvailabilityToday.value}
                subtitle="Today's capacity"
                icon={<Activity className="h-5 w-5" />}
                status={data.workforce.staffAvailabilityToday.status}
                onClick={() => handleTileClick("Staff Availability", "/team")}
              />
              <DashboardTile
                title="Leave Requests"
                value={data.workforce.leaveRequests.value}
                subtitle="Pending approval"
                icon={<CalendarX2 className="h-5 w-5" />}
                status={data.workforce.leaveRequests.status}
                onClick={() => handleTileClick("Leave Requests", "/team")}
              />
              <DashboardTile
                title="Ratio Alerts"
                value={data.workforce.staffParticipantRatioAlerts.value}
                subtitle="Staff-to-participant breaches"
                icon={<Users2 className="h-5 w-5" />}
                status={data.workforce.staffParticipantRatioAlerts.status}
                onClick={() => handleTileClick("Staff-Participant Ratio", "/reports")}
              />
              <DashboardTile
                title="Service Hours Delivered"
                value={data.workforce.serviceHoursDelivered.value}
                subtitle="vs Forecast"
                icon={<Stethoscope className="h-5 w-5" />}
                status={data.workforce.serviceHoursDelivered.status}
                onClick={() => handleTileClick("Service Hours", "/reports")}
              />
              <DashboardTile
                title="Attendance Rate"
                value={data.workforce.attendanceRate.value}
                subtitle="Overall performance"
                icon={<UserCheck className="h-5 w-5" />}
                status={data.workforce.attendanceRate.status}
                onClick={() => handleTileClick("Attendance Rate", "/team")}
              />
            </DashboardSection>
          </div>

          {/* Strategic KPIs Section */}
          <div className="group">
            <DashboardSection title="📊 Strategic KPIs (Management)">
              <DashboardTile
                title="Top Referrers"
                value={data.strategic.topReferrers.value}
                subtitle="Active partnerships"
                icon={<Building2 className="h-5 w-5" />}
                status={data.strategic.topReferrers.status}
                onClick={() => handleTileClick("Top Referrers", "/reports")}
              />
              <DashboardTile
                title="Open Cases"
                value={data.strategic.openCasesByStatus.value}
                subtitle="All statuses"
                icon={<FolderOpen className="h-5 w-5" />}
                status={data.strategic.openCasesByStatus.status}
                onClick={() => handleTileClick("Open Cases", "/clients")}
              />
              <DashboardTile
                title="Participant Satisfaction"
                value={data.strategic.participantSatisfaction.value}
                subtitle="Latest survey results"
                icon={<ThumbsUp className="h-5 w-5" />}
                status={data.strategic.participantSatisfaction.status}
                onClick={() => handleTileClick("Participant Satisfaction", "/reports")}
              />
            </DashboardSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
