import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import StaffDataInitializer from "@/components/StaffDataInitializer";
import { 
  MapPin, 
  Users, 
  Clock, 
  Activity, 
  Search,
  RefreshCw,
  Navigation,
  Phone,
  CheckCircle,
  AlertTriangle,
  Calendar,
  UserCheck,
  LogIn,
  LogOut
} from "lucide-react";
import { format } from "date-fns";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
}

interface StaffLocation {
  staff_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  last_updated: string;
  is_active: boolean;
}

interface StaffStatus {
  staff_id: string;
  current_shift?: any;
  current_appointment?: any;
  recent_checkin?: any;
  location?: StaffLocation;
}

interface CheckIn {
  id: string;
  staff_id: string;
  checkin_type: string;
  action: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

export default function LiveStaffDashboard() {
  const [staffStatuses, setStaffStatuses] = useState<Record<string, StaffStatus>>({});
  const [recentCheckins, setRecentCheckins] = useState<CheckIn[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { toast } = useToast();

  // Mock staff data - in real app this would come from your staff table
  const staffMembers: StaffMember[] = [
    { id: "STAFF-001", name: "John Smith", role: "Support Worker", phone: "+61 400 123 456" },
    { id: "STAFF-002", name: "Sarah Johnson", role: "Care Coordinator", phone: "+61 400 234 567" },
    { id: "STAFF-003", name: "Mike Chen", role: "Support Worker", phone: "+61 400 345 678" },
    { id: "STAFF-004", name: "Emma Davis", role: "Team Leader", phone: "+61 400 456 789" },
  ];

  useEffect(() => {
    fetchStaffStatuses();
    fetchRecentCheckins();

    // Set up real-time subscriptions
    const locationsChannel = supabase
      .channel('staff-locations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'staff_locations'
        },
        () => {
          fetchStaffStatuses();
        }
      )
      .subscribe();

    const checkinsChannel = supabase
      .channel('staff-checkins-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'staff_checkins'
        },
        () => {
          fetchStaffStatuses();
          fetchRecentCheckins();
        }
      )
      .subscribe();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStaffStatuses();
      setLastUpdated(new Date());
    }, 30000);

    return () => {
      supabase.removeChannel(locationsChannel);
      supabase.removeChannel(checkinsChannel);
      clearInterval(interval);
    };
  }, []);

  const fetchStaffStatuses = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // Fetch current locations
      const { data: locations } = await supabase
        .from('staff_locations')
        .select('*')
        .eq('is_active', true);

      // Fetch today's shifts
      const { data: shifts } = await supabase
        .from('staff_shifts')
        .select('*')
        .eq('shift_date', today)
        .in('status', ['checked_in', 'scheduled']);

      // Fetch today's appointments
      const { data: appointments } = await supabase
        .from('staff_appointments')
        .select('*')
        .eq('appointment_date', today)
        .in('status', ['checked_in', 'in_progress', 'scheduled']);

      // Fetch recent check-ins (last 2 hours)
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      const { data: checkins } = await supabase
        .from('staff_checkins')
        .select('*')
        .gte('timestamp', twoHoursAgo)
        .order('timestamp', { ascending: false });

      // Combine data for each staff member
      const statusMap: Record<string, StaffStatus> = {};

      staffMembers.forEach(staff => {
        const location = locations?.find(loc => loc.staff_id === staff.id);
        const currentShift = shifts?.find(shift => shift.staff_id === staff.id);
        const currentAppointment = appointments?.find(apt => apt.staff_id === staff.id);
        const recentCheckin = checkins?.find(checkin => checkin.staff_id === staff.id);

        statusMap[staff.id] = {
          staff_id: staff.id,
          location,
          current_shift: currentShift,
          current_appointment: currentAppointment,
          recent_checkin: recentCheckin
        };
      });

      setStaffStatuses(statusMap);
    } catch (error) {
      console.error('Error fetching staff statuses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch staff data",
        variant: "destructive"
      });
    }
  };

  const fetchRecentCheckins = async () => {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('staff_checkins')
      .select('*')
      .gte('timestamp', sixHoursAgo)
      .order('timestamp', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching recent check-ins:', error);
      return;
    }

    setRecentCheckins(data || []);
  };

  const getStaffCurrentStatus = (status: StaffStatus) => {
    const { current_shift, current_appointment, recent_checkin } = status;
    
    if (current_shift?.status === 'checked_in') {
      return { text: 'On Shift', variant: 'default' as const, icon: CheckCircle };
    }
    
    if (current_appointment?.status === 'checked_in' || current_appointment?.status === 'in_progress') {
      return { text: 'At Appointment', variant: 'default' as const, icon: Calendar };
    }
    
    if (recent_checkin && new Date(recent_checkin.timestamp) > new Date(Date.now() - 30 * 60 * 1000)) {
      return { text: 'Recently Active', variant: 'secondary' as const, icon: Activity };
    }
    
    return { text: 'Offline', variant: 'outline' as const, icon: AlertTriangle };
  };

  const filteredStaff = staffMembers.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    fetchStaffStatuses();
    fetchRecentCheckins();
    setLastUpdated(new Date());
    toast({
      title: "Refreshed",
      description: "Staff data has been updated"
    });
  };

  const openInMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const adminCheckIn = async (staffId: string, type: 'shift' | 'appointment') => {
    try {
      // Find the staff member's current shift or appointment
      const status = staffStatuses[staffId];
      let referenceId = '';
      
      if (type === 'shift' && status.current_shift) {
        referenceId = status.current_shift.id;
      } else if (type === 'appointment' && status.current_appointment) {
        referenceId = status.current_appointment.id;
      } else {
        toast({
          title: "Error",
          description: `No scheduled ${type} found for this staff member`,
          variant: "destructive"
        });
        return;
      }

      // Create check-in record
      const { error: checkinError } = await supabase
        .from('staff_checkins')
        .insert({
          staff_id: staffId,
          checkin_type: type,
          action: 'check_in',
          reference_id: referenceId,
          notes: 'Admin check-in'
        });

      if (checkinError) throw checkinError;

      // Update the shift/appointment status
      const table = type === 'shift' ? 'staff_shifts' : 'staff_appointments';
      const { error: updateError } = await supabase
        .from(table)
        .update({ status: 'checked_in' })
        .eq('id', referenceId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Staff member checked in to ${type}`,
      });

      // Refresh data
      fetchStaffStatuses();
      fetchRecentCheckins();
    } catch (error) {
      console.error('Error checking in staff:', error);
      toast({
        title: "Error",
        description: "Failed to check in staff member",
        variant: "destructive"
      });
    }
  };

  const createSampleShift = async (staffId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase
      .from('staff_shifts')
      .insert({
        staff_id: staffId,
        shift_date: today,
        start_time: '09:00',
        end_time: '17:00',
        status: 'scheduled',
        location: 'Main Office'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create sample shift",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Sample shift created",
      });
      fetchStaffStatuses();
    }
  };

  const createSampleAppointment = async (staffId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase
      .from('staff_appointments')
      .insert({
        staff_id: staffId,
        appointment_date: today,
        start_time: '14:00',
        end_time: '15:00',
        status: 'scheduled',
        client_id: 'CLIENT-001',
        service_type: 'Support Visit'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create sample appointment",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Sample appointment created",
      });
      fetchStaffStatuses();
    }
  };

  const adminCheckOut = async (staffId: string, type: 'shift' | 'appointment') => {
    try {
      const status = staffStatuses[staffId];
      let referenceId = '';
      
      if (type === 'shift' && status.current_shift) {
        referenceId = status.current_shift.id;
      } else if (type === 'appointment' && status.current_appointment) {
        referenceId = status.current_appointment.id;
      } else {
        toast({
          title: "Error",
          description: `No active ${type} found for this staff member`,
          variant: "destructive"
        });
        return;
      }

      // Create check-out record
      const { error: checkinError } = await supabase
        .from('staff_checkins')
        .insert({
          staff_id: staffId,
          checkin_type: type,
          action: 'check_out',
          reference_id: referenceId,
          notes: 'Admin check-out'
        });

      if (checkinError) throw checkinError;

      // Update the status
      const table = type === 'shift' ? 'staff_shifts' : 'staff_appointments';
      const newStatus = type === 'shift' ? 'completed' : 'completed';
      const { error: updateError } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', referenceId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Staff member checked out of ${type}`,
      });

      // Refresh data
      fetchStaffStatuses();
      fetchRecentCheckins();
    } catch (error) {
      console.error('Error checking out staff:', error);
      toast({
        title: "Error",
        description: "Failed to check out staff member",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Live Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Last updated: {format(lastUpdated, 'HH:mm:ss')}
          </p>
        </div>
        <Button onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search staff members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Show data initializer if no staff data exists */}
      {Object.keys(staffStatuses).length === 0 && recentCheckins.length === 0 && (
        <Card className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No Staff Data Available</h3>
            <p className="text-muted-foreground mb-4">
              Initialize sample staff data to see the live dashboard in action.
            </p>
            <StaffDataInitializer />
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => {
          const status = staffStatuses[staff.id] || { staff_id: staff.id };
          const currentStatus = getStaffCurrentStatus(status);
          const StatusIcon = currentStatus.icon;

          return (
            <Card key={staff.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{staff.name}</CardTitle>
                    <CardDescription>{staff.role}</CardDescription>
                  </div>
                  <Badge variant={currentStatus.variant} className="gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {currentStatus.text}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{staff.phone}</span>
                </div>

                {/* Location */}
                {status.location ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span>Location tracked</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div>Lat: {status.location.latitude.toFixed(6)}</div>
                      <div>Lng: {status.location.longitude.toFixed(6)}</div>
                      <div>Updated: {format(new Date(status.location.last_updated), 'HH:mm')}</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => openInMaps(status.location!.latitude, status.location!.longitude)}
                      className="gap-2"
                    >
                      <Navigation className="h-3 w-3" />
                      View on Map
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Location not available</span>
                  </div>
                )}

                {/* Current Activity */}
                {status.current_shift && (
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4" />
                      Current Shift
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {status.current_shift.start_time} - {status.current_shift.end_time}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {status.current_shift.location}
                    </div>
                  </div>
                )}

                {status.current_appointment && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      Current Appointment
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {status.current_appointment.start_time} - {status.current_appointment.end_time}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Client: {status.current_appointment.client_id}
                    </div>
                  </div>
                )}

                {/* Admin Check-in Controls */}
                <div className="border-t pt-4 space-y-3">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Admin Controls
                  </div>
                  
                  {/* Show current activities if any */}
                  {status.current_shift && (
                    <div className="text-xs text-muted-foreground bg-primary/5 p-2 rounded">
                      <strong>Shift:</strong> {status.current_shift.start_time} - {status.current_shift.end_time} 
                      <span className="ml-2 font-medium">({status.current_shift.status})</span>
                    </div>
                  )}
                  
                  {status.current_appointment && (
                    <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                      <strong>Appointment:</strong> {status.current_appointment.start_time} - {status.current_appointment.end_time}
                      <span className="ml-2 font-medium">({status.current_appointment.status})</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    {/* Shift Controls */}
                    {!status.current_shift ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => createSampleShift(staff.id)}
                        className="gap-1 text-xs"
                      >
                        <Calendar className="h-3 w-3" />
                        Add Shift
                      </Button>
                    ) : status.current_shift.status === 'scheduled' ? (
                      <Button 
                        size="sm" 
                        variant="default" 
                        onClick={() => adminCheckIn(staff.id, 'shift')}
                        className="gap-1 text-xs"
                      >
                        <LogIn className="h-3 w-3" />
                        Check In
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => adminCheckOut(staff.id, 'shift')}
                        className="gap-1 text-xs"
                      >
                        <LogOut className="h-3 w-3" />
                        Check Out
                      </Button>
                    )}
                    
                    {/* Appointment Controls */}
                    {!status.current_appointment ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => createSampleAppointment(staff.id)}
                        className="gap-1 text-xs"
                      >
                        <UserCheck className="h-3 w-3" />
                        Add Appt
                      </Button>
                    ) : status.current_appointment.status === 'scheduled' ? (
                      <Button 
                        size="sm" 
                        variant="default" 
                        onClick={() => adminCheckIn(staff.id, 'appointment')}
                        className="gap-1 text-xs"
                      >
                        <LogIn className="h-3 w-3" />
                        Check In
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => adminCheckOut(staff.id, 'appointment')}
                        className="gap-1 text-xs"
                      >
                        <LogOut className="h-3 w-3" />
                        Check Out
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Check-ins
          </CardTitle>
          <CardDescription>
            Latest check-ins and check-outs from staff members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCheckins.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No recent check-ins
              </p>
            ) : (
              recentCheckins.map((checkin) => {
                const staff = staffMembers.find(s => s.id === checkin.staff_id);
                return (
                  <div key={checkin.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        checkin.action === 'check_in' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <div className="font-medium">{staff?.name || checkin.staff_id}</div>
                        <div className="text-sm text-muted-foreground">
                          {checkin.action === 'check_in' ? 'Checked in' : 'Checked out'} 
                          {' '}to {checkin.checkin_type}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(checkin.timestamp), 'HH:mm')}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}