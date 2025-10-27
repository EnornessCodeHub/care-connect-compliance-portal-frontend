import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  FileText,
  Car,
  LogIn,
  LogOut,
  CheckCircle,
  AlertTriangle,
  X
} from "lucide-react";

interface Appointment {
  id: string;
  staff_id: string;
  client_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  service_type?: string;
  status: 'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  created_at: string;
  updated_at: string;
}

interface CheckIn {
  id: string;
  staff_id: string;
  checkin_type: string;
  action: string;
  timestamp: string;
  reference_id: string;
  notes?: string;
}

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
  const [isAppointmentDetailOpen, setIsAppointmentDetailOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [isCostEntryOpen, setIsCostEntryOpen] = useState(false);
  const { toast } = useToast();

  const calculateDuration = (startTime: string, endTime: string, actualStart?: string, actualEnd?: string) => {
    const start = actualStart || startTime;
    const end = actualEnd || endTime;
    
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return { hours, minutes, totalMinutes: durationMinutes };
  };

  // Mock data for staff
  const staffMembers = [
    { id: "vacant", name: "Vacant Shift", status: "vacant", color: "bg-red-100 text-red-800" },
    { id: "job-board", name: "Job Board", status: "available", color: "bg-blue-100 text-blue-800" },
    { id: "STAFF-001", name: "John Smith", status: "available", hours: "0.00 Hours", color: "bg-green-100 text-green-800" },
    { id: "STAFF-002", name: "Sarah Johnson", status: "available", hours: "0.00 Hours", color: "bg-purple-100 text-purple-800" },
  ];

  useEffect(() => {
    fetchAppointments();
    
    // Set up real-time subscription for appointments
    const appointmentsChannel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'staff_appointments'
        },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsChannel);
    };
  }, [currentMonth]);

  const fetchAppointments = async () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const { data, error } = await supabase
      .from('staff_appointments')
      .select('*')
      .gte('appointment_date', startOfMonth.toISOString().split('T')[0])
      .lte('appointment_date', endOfMonth.toISOString().split('T')[0])
      .order('appointment_date')
      .order('start_time');

    if (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive"
      });
      return;
    }

    setAppointments(data || []);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.appointment_date === dateStr);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDetailOpen(true);
  };

  const handleCheckIn = async () => {
    if (!selectedAppointment) return;

    const now = new Date();
    const currentTime = format(now, 'HH:mm:ss');

    try {
      // Create check-in record
      const { error: checkinError } = await supabase
        .from('staff_checkins')
        .insert({
          staff_id: selectedAppointment.staff_id,
          checkin_type: 'appointment',
          action: 'check_in',
          reference_id: selectedAppointment.id,
          notes: 'Staff check-in'
        });

      if (checkinError) throw checkinError;

      // Update appointment status and actual start time
      const updateData: any = {
        status: 'checked_in',
        actual_start_time: currentTime
      };

      // If checking in early, update the scheduled start time
      const scheduledStart = selectedAppointment.start_time;
      if (currentTime < scheduledStart) {
        updateData.start_time = currentTime;
        toast({
          title: "Early Check-in",
          description: `Appointment start time adjusted from ${scheduledStart} to ${currentTime}`,
        });
      }

      const { error: updateError } = await supabase
        .from('staff_appointments')
        .update(updateData)
        .eq('id', selectedAppointment.id);

      if (updateError) throw updateError;

      toast({
        title: "Checked In",
        description: `Successfully checked in at ${currentTime}`,
      });

      // Refresh data
      fetchAppointments();
      setIsAppointmentDetailOpen(false);
    } catch (error) {
      console.error('Error checking in:', error);
      toast({
        title: "Error",
        description: "Failed to check in",
        variant: "destructive"
      });
    }
  };

  const handleCheckOut = async () => {
    if (!selectedAppointment) return;

    const now = new Date();
    const currentTime = format(now, 'HH:mm:ss');

    try {
      // Create check-out record
      const { error: checkinError } = await supabase
        .from('staff_checkins')
        .insert({
          staff_id: selectedAppointment.staff_id,
          checkin_type: 'appointment',
          action: 'check_out',
          reference_id: selectedAppointment.id,
          notes: 'Staff check-out'
        });

      if (checkinError) throw checkinError;

      // Update appointment status and actual end time
      const updateData: any = {
        status: 'completed',
        actual_end_time: currentTime
      };

      // If checking out late, update the scheduled end time
      const scheduledEnd = selectedAppointment.end_time;
      if (currentTime > scheduledEnd) {
        updateData.end_time = currentTime;
        toast({
          title: "Late Check-out",
          description: `Appointment end time adjusted from ${scheduledEnd} to ${currentTime}`,
        });
      }

      const { error: updateError } = await supabase
        .from('staff_appointments')
        .update(updateData)
        .eq('id', selectedAppointment.id);

      if (updateError) throw updateError;

      toast({
        title: "Checked Out",
        description: `Successfully checked out at ${currentTime}`,
      });

      // Refresh data
      fetchAppointments();
      setIsAppointmentDetailOpen(false);
      
      // Show cost entry option
      setTimeout(() => {
        setIsCostEntryOpen(true);
      }, 500);
    } catch (error) {
      console.error('Error checking out:', error);
      toast({
        title: "Error",
        description: "Failed to check out",
        variant: "destructive"
      });
    }
  };

  const handleClearCheckInOut = async () => {
    if (!selectedAppointment) return;

    try {
      // Update appointment to clear actual times and reset status
      const { error: updateError } = await supabase
        .from('staff_appointments')
        .update({
          status: 'scheduled',
          actual_start_time: null,
          actual_end_time: null
        })
        .eq('id', selectedAppointment.id);

      if (updateError) throw updateError;

      toast({
        title: "Check-in/Out Cleared",
        description: "Appointment times have been reset",
      });

      // Refresh data
      fetchAppointments();
      setIsAppointmentDetailOpen(false);
    } catch (error) {
      console.error('Error clearing check-in/out:', error);
      toast({
        title: "Error",
        description: "Failed to clear check-in/out",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      case 'checked_in':
        return <Badge variant="default">Checked In</Badge>;
      case 'in_progress':
        return <Badge variant="default">In Progress</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStaffName = (staffId: string) => {
    const staff = staffMembers.find(s => s.id === staffId);
    return staff?.name || staffId;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Staff List */}
      <div className="w-64 bg-card border-r border-border p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by team, staff or client..." 
              className="pl-10"
            />
          </div>
          
          <div className="space-y-2">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={staff.color}>
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{staff.name}</p>
                  {staff.hours && (
                    <p className="text-xs text-muted-foreground">{staff.hours}</p>
                  )}
                  {staff.status === "vacant" && (
                    <p className="text-xs text-muted-foreground">No vacant shift at the moment</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Carer
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Controls */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  <SelectItem value="STAFF-001">John Smith</SelectItem>
                  <SelectItem value="STAFF-002">Sarah Johnson</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="checked_in">Checked In</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="personal-care">Personal Care</SelectItem>
                  <SelectItem value="community">Community Access</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm">
                A-Z
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Today
              </Button>
              <Button variant="outline" size="sm">
                Publish shifts
              </Button>
              <Button variant="outline" size="sm">
                Weekly
              </Button>
              <Dialog open={isShiftDialogOpen} onOpenChange={setIsShiftDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Appointment</DialogTitle>
                  </DialogHeader>
                  <AppointmentCreationForm onClose={() => setIsShiftDialogOpen(false)} onSuccess={fetchAppointments} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1 p-4">
          <div className="bg-card rounded-lg border border-border p-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {/* Day Headers */}
              {dayNames.map((day) => (
                <div key={day} className="bg-muted p-3 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {getDaysInMonth(currentMonth).map((day, index) => (
                <div 
                  key={index} 
                  className={`bg-card min-h-[120px] p-2 ${
                    day ? 'hover:bg-accent cursor-pointer' : ''
                  }`}
                >
                  {day && (
                    <>
                      <div className="text-sm font-medium mb-2">
                        {day.getDate()}
                      </div>
                      {/* Appointments for this day */}
                      <div className="space-y-1">
                        {getAppointmentsForDay(day).map((appointment) => (
                          <div 
                            key={appointment.id}
                            className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${
                              appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              appointment.status === 'checked_in' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }`}
                            onClick={() => handleAppointmentClick(appointment)}
                          >
                            {appointment.start_time}-{appointment.end_time} {getStaffName(appointment.staff_id)}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Detail Dialog */}
      <Dialog open={isAppointmentDetailOpen} onOpenChange={setIsAppointmentDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Appointment Details
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAppointmentDetailOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {format(new Date(selectedAppointment.appointment_date), 'MMM dd, yyyy')}
                    </CardTitle>
                    {getStatusBadge(selectedAppointment.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {selectedAppointment.start_time} - {selectedAppointment.end_time}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{getStaffName(selectedAppointment.staff_id)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Client: {selectedAppointment.client_id}</span>
                  </div>
                  
                  {selectedAppointment.service_type && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedAppointment.service_type}</span>
                    </div>
                  )}
                  
                  {selectedAppointment.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedAppointment.location}</span>
                    </div>
                  )}

                  {/* Actual Times */}
                  {selectedAppointment.actual_start_time && (
                    <div className="pt-3 border-t">
                      <div className="text-sm font-medium mb-2">Actual Times:</div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>Check-in: {selectedAppointment.actual_start_time}</div>
                        {selectedAppointment.actual_end_time && (
                          <div>Check-out: {selectedAppointment.actual_end_time}</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Check-in/Check-out Buttons */}
                  <div className="pt-4 space-y-2">
                    {selectedAppointment.status === 'scheduled' && (
                      <Button 
                        onClick={handleCheckIn}
                        className="w-full gap-2"
                      >
                        <LogIn className="h-4 w-4" />
                        Check In
                      </Button>
                    )}
                    
                    {selectedAppointment.status === 'checked_in' && (
                      <Button 
                        onClick={handleCheckOut}
                        variant="secondary"
                        className="w-full gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Check Out
                      </Button>
                    )}
                    
                     {selectedAppointment.status === 'completed' && (
                       <div className="space-y-2">
                         <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                           <CheckCircle className="h-4 w-4" />
                           Appointment Completed
                         </div>
                         <Button 
                           onClick={() => setIsCostEntryOpen(true)}
                           variant="outline"
                           className="w-full gap-2"
                         >
                           <FileText className="h-4 w-4" />
                           Enter Cost
                         </Button>
                         <Button 
                           onClick={handleClearCheckInOut}
                           variant="destructive"
                           className="w-full gap-2"
                         >
                           <X className="h-4 w-4" />
                           Clear Check-in and Out
                         </Button>
                       </div>
                     )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cost Entry Dialog */}
      <Dialog open={isCostEntryOpen} onOpenChange={setIsCostEntryOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Cost</DialogTitle>
          </DialogHeader>
          
          {selectedAppointment && (
            <CostEntryForm 
              appointment={selectedAppointment}
              duration={calculateDuration(
                selectedAppointment.start_time,
                selectedAppointment.end_time,
                selectedAppointment.actual_start_time,
                selectedAppointment.actual_end_time
              )}
              onClose={() => setIsCostEntryOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Appointment Creation Form Component
const AppointmentCreationForm = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [serviceType, setServiceType] = useState("personal-care");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const calculateDuration = (startTime: string, endTime: string, actualStart?: string, actualEnd?: string) => {
    const start = actualStart || startTime;
    const end = actualEnd || endTime;
    
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return { hours, minutes, totalMinutes: durationMinutes };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedStaff || !selectedClient) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('staff_appointments')
        .insert({
          staff_id: selectedStaff,
          client_id: selectedClient,
          appointment_date: selectedDate.toISOString().split('T')[0],
          start_time: startTime,
          end_time: endTime,
          service_type: serviceType,
          location: location || undefined,
          notes: notes || undefined,
          status: 'scheduled'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment created successfully",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Client & Staff</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="client">Choose client *</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient} required>
              <SelectTrigger>
                <SelectValue placeholder="Select client..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLIENT-001">John Doe</SelectItem>
                <SelectItem value="CLIENT-002">Jane Smith</SelectItem>
                <SelectItem value="CLIENT-003">Bob Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="staff">Choose staff member *</Label>
            <Select value={selectedStaff} onValueChange={setSelectedStaff} required>
              <SelectTrigger>
                <SelectValue placeholder="Select staff..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STAFF-001">John Smith</SelectItem>
                <SelectItem value="STAFF-002">Sarah Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Appointment Details</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="service-type">Service type</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal-care">Personal Care</SelectItem>
                <SelectItem value="community-access">Community Access</SelectItem>
                <SelectItem value="support-visit">Support Visit</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input 
              type="date" 
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-time">Start Time *</Label>
              <Input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="end-time">End Time *</Label>
              <Input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Appointment location..."
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Create Appointment
        </Button>
      </div>
    </form>
  );
};

// Cost Entry Form Component
interface CostEntryFormProps {
  appointment: Appointment;
  duration: { hours: number; minutes: number; totalMinutes: number };
  onClose: () => void;
}

const CostEntryForm = ({ appointment, duration, onClose }: CostEntryFormProps) => {
  const [planPeriod, setPlanPeriod] = useState("");
  const [budgetCategory, setBudgetCategory] = useState("");
  const [ndisItem, setNdisItem] = useState("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [durationStr, setDurationStr] = useState(`${duration.hours.toString().padStart(2, '0')}:${duration.minutes.toString().padStart(2, '0')}`);
  const [unitPrice, setUnitPrice] = useState("");
  const [totalAmount, setTotalAmount] = useState("0.00");
  const [date, setDate] = useState(appointment.appointment_date);
  const [appointmentId, setAppointmentId] = useState(appointment.id);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const calculateTotalAmount = (unitPrice: string, duration: string) => {
    const rate = parseFloat(unitPrice) || 0;
    const [hours, minutes] = duration.split(':').map(Number);
    const totalHours = hours + (minutes / 60);
    return (rate * totalHours).toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceTitle.trim() || !ndisItem || !durationStr || !date || !budgetCategory || !planPeriod) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields including NDIS support item, duration, and plan period.",
        variant: "destructive",
      });
      return;
    }

    try {
      const costData = {
        appointment_id: appointment.id,
        staff_id: appointment.staff_id,
        client_id: appointment.client_id,
        plan_period: planPeriod,
        budget_category: budgetCategory,
        ndis_item: ndisItem,
        service_title: serviceTitle,
        duration: durationStr,
        unit_price: parseFloat(unitPrice),
        total_amount: parseFloat(totalAmount),
        date: date,
        appointment_id_link: appointmentId,
        notes: notes,
        status: 'uninvoiced'
      };

      const { error } = await supabase
        .from('documents')
        .insert({
          title: `Cost Entry - ${appointment.client_id} - ${appointment.appointment_date}`,
          client_id: appointment.client_id,
          document_type: 'cost_entry',
          notes: JSON.stringify(costData),
          uploaded_by: appointment.staff_id,
          file_name: `cost_entry_${appointment.id}.json`,
          file_path: `/cost_entries/${appointment.id}`,
          mime_type: 'application/json'
        });

      if (error) throw error;

      toast({
        title: "Cost Added",
        description: "Cost entry has been saved successfully.",
      });

      onClose();
    } catch (error) {
      console.error('Error saving cost entry:', error);
      toast({
        title: "Error",
        description: "Failed to save cost entry",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Plan Period Selection */}
      <div className="space-y-2">
        <Label htmlFor="cost-plan-period">Plan Period*</Label>
        <Select
          value={planPeriod}
          onValueChange={(value) => setPlanPeriod(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select plan period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024-2025">2024-2025 Plan Period (01/01/2024 to 31/12/2024)</SelectItem>
            <SelectItem value="2025-2026">2025-2026 Plan Period (01/01/2025 to 31/12/2025)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Budget Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="cost-budget-category">Budget Category*</Label>
        <Select
          value={budgetCategory}
          onValueChange={(value) => setBudgetCategory(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select budget category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="core-support">Core Support ($25,000 remaining)</SelectItem>
            <SelectItem value="capacity-building">Capacity Building ($15,000 remaining)</SelectItem>
            <SelectItem value="capital-support">Capital Support ($10,000 remaining)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* NDIS Support Item Selection */}
      <div className="space-y-2">
        <Label htmlFor="cost-ndis-item">NDIS Support Item*</Label>
        <Select
          value={ndisItem}
          onValueChange={(value) => {
            setNdisItem(value);
            // Auto-set unit price based on selected item
            if (value === "01_011_0107_1_1") {
              setUnitPrice("62.17");
            } else if (value === "01_015_0107_1_1") {
              setUnitPrice("68.26");
            } else if (value === "02_001_0107_1_1") {
              setUnitPrice("0.85");
            }
            setTotalAmount(calculateTotalAmount(unitPrice, durationStr));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select NDIS support item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="01_011_0107_1_1">01_011_0107_1_1 - Personal Care/Support (Universal Schedule)</SelectItem>
            <SelectItem value="01_015_0107_1_1">01_015_0107_1_1 - Community Access (Universal Schedule)</SelectItem>
            <SelectItem value="02_001_0107_1_1">02_001_0107_1_1 - Transport (Universal Schedule)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cost-service-title">Service Title*</Label>
        <Input
          id="cost-service-title"
          value={serviceTitle}
          onChange={(e) => setServiceTitle(e.target.value)}
          placeholder="Enter service title"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cost-duration">Duration (HH:MM)*</Label>
          <Input
            id="cost-duration"
            type="text"
            value={durationStr}
            onChange={(e) => {
              const duration = e.target.value;
              setDurationStr(duration);
              setTotalAmount(calculateTotalAmount(unitPrice, duration));
            }}
            placeholder="02:30"
            pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost-unit-price">Unit Price*</Label>
          <Input
            id="cost-unit-price"
            type="number"
            step="0.01"
            value={unitPrice}
            onChange={(e) => {
              const price = e.target.value;
              setUnitPrice(price);
              setTotalAmount(calculateTotalAmount(price, durationStr));
            }}
            placeholder="0.00"
            readOnly={!!ndisItem}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost-total-amount">Total Amount</Label>
          <Input
            id="cost-total-amount"
            type="text"
            value={`$${totalAmount}`}
            readOnly
            className="bg-muted"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cost-date">Date*</Label>
        <Input
          id="cost-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {date && (
          <p className="text-sm text-muted-foreground">
            Display: {formatDate(date)}
          </p>
        )}
      </div>

      {/* Appointment Link (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="cost-appointment">Link to Appointment (Optional)</Label>
        <Select
          value={appointmentId}
          onValueChange={(value) => setAppointmentId(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select related appointment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No appointment</SelectItem>
            <SelectItem value={appointment.id}>
              {appointment.service_type} - {appointment.appointment_date} at {appointment.start_time}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes Section */}
      <div className="space-y-2">
        <Label htmlFor="cost-notes">Notes</Label>
        <Textarea
          id="cost-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes about this cost..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Cost</Button>
      </div>
    </div>
  );
};

export default Appointments;