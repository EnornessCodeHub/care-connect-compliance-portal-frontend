import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users, 
  Calendar,
  Navigation,
  Phone,
  Activity
} from "lucide-react";
import { Geolocation } from '@capacitor/geolocation';

interface Shift {
  id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  location: string;
  status: string;
  notes?: string;
}

interface Appointment {
  id: string;
  client_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  location: string;
  service_type: string;
  status: string;
  notes?: string;
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

export default function StaffTracking() {
  const [activeTab, setActiveTab] = useState("shifts");
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const { toast } = useToast();

  // Mock staff ID - in real app this would come from authentication
  const staffId = "STAFF-001";

  useEffect(() => {
    fetchTodayShifts();
    fetchTodayAppointments();
    startLocationTracking();
  }, []);

  const fetchTodayShifts = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('staff_shifts')
      .select('*')
      .eq('staff_id', staffId)
      .eq('shift_date', today)
      .order('start_time');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch shifts",
        variant: "destructive"
      });
      return;
    }

    setShifts(data || []);
  };

  const fetchTodayAppointments = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('staff_appointments')
      .select('*')
      .eq('staff_id', staffId)
      .eq('appointment_date', today)
      .order('start_time');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive"
      });
      return;
    }

    setAppointments(data || []);
  };

  const startLocationTracking = async () => {
    try {
      const permission = await Geolocation.requestPermissions();
      
      if (permission.location === 'granted') {
        setIsLocationEnabled(true);
        
        // Get initial position
        const position = await Geolocation.getCurrentPosition();
        const { latitude, longitude } = position.coords;
        
        setCurrentLocation({ lat: latitude, lng: longitude });
        
        // Update location in database
        await updateLocationInDB(latitude, longitude, position.coords.accuracy);
        
        // Set up periodic location updates (every 30 seconds)
        const watchId = await Geolocation.watchPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }, (position) => {
          if (position) {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude });
            updateLocationInDB(latitude, longitude, position.coords.accuracy);
          }
        });

        // Store watch ID for cleanup
        return () => Geolocation.clearWatch({ id: watchId });
      } else {
        toast({
          title: "Location Permission Required",
          description: "Please enable location services to track your position",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error setting up location tracking:', error);
      toast({
        title: "Location Error",
        description: "Failed to enable location tracking",
        variant: "destructive"
      });
    }
  };

  const updateLocationInDB = async (latitude: number, longitude: number, accuracy?: number) => {
    const { error } = await supabase
      .from('staff_locations')
      .upsert({
        staff_id: staffId,
        latitude,
        longitude,
        accuracy,
        is_active: true,
        last_updated: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleCheckIn = async (type: 'shift' | 'appointment', referenceId: string) => {
    if (!currentLocation) {
      toast({
        title: "Location Required",
        description: "Please enable location services to check in",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create check-in record
      const { error: checkinError } = await supabase
        .from('staff_checkins')
        .insert({
          staff_id: staffId,
          checkin_type: type,
          reference_id: referenceId,
          action: 'check_in',
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          timestamp: new Date().toISOString()
        });

      if (checkinError) throw checkinError;

      // Update the shift or appointment status
      const table = type === 'shift' ? 'staff_shifts' : 'staff_appointments';
      const status = type === 'shift' ? 'checked_in' : 'checked_in';

      const { error: updateError } = await supabase
        .from(table)
        .update({ status })
        .eq('id', referenceId);

      if (updateError) throw updateError;

      toast({
        title: "Check-in Successful",
        description: `Successfully checked in to ${type}`,
      });

      // Refresh data
      if (type === 'shift') {
        fetchTodayShifts();
      } else {
        fetchTodayAppointments();
      }

    } catch (error) {
      console.error('Check-in error:', error);
      toast({
        title: "Check-in Failed",
        description: "Failed to check in. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCheckOut = async (type: 'shift' | 'appointment', referenceId: string) => {
    if (!currentLocation) {
      toast({
        title: "Location Required",
        description: "Please enable location services to check out",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create check-out record
      const { error: checkinError } = await supabase
        .from('staff_checkins')
        .insert({
          staff_id: staffId,
          checkin_type: type,
          reference_id: referenceId,
          action: 'check_out',
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          timestamp: new Date().toISOString()
        });

      if (checkinError) throw checkinError;

      // Update the shift or appointment status
      const table = type === 'shift' ? 'staff_shifts' : 'staff_appointments';
      const status = type === 'shift' ? 'checked_out' : 'completed';

      const { error: updateError } = await supabase
        .from(table)
        .update({ status })
        .eq('id', referenceId);

      if (updateError) throw updateError;

      toast({
        title: "Check-out Successful",
        description: `Successfully checked out of ${type}`,
      });

      // Refresh data
      if (type === 'shift') {
        fetchTodayShifts();
      } else {
        fetchTodayAppointments();
      }

    } catch (error) {
      console.error('Check-out error:', error);
      toast({
        title: "Check-out Failed",
        description: "Failed to check out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { variant: "secondary" as const, icon: Clock },
      checked_in: { variant: "default" as const, icon: CheckCircle },
      checked_out: { variant: "outline" as const, icon: CheckCircle },
      completed: { variant: "default" as const, icon: CheckCircle },
      in_progress: { variant: "default" as const, icon: Activity },
      cancelled: { variant: "destructive" as const, icon: XCircle },
      missed: { variant: "destructive" as const, icon: XCircle },
      no_show: { variant: "destructive" as const, icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Staff Tracking</h1>
        <div className="flex items-center gap-2">
          <MapPin className={`h-5 w-5 ${isLocationEnabled ? 'text-green-500' : 'text-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isLocationEnabled ? 'Location Active' : 'Location Disabled'}
          </span>
        </div>
      </div>

      {currentLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Current Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="shifts" className="gap-2">
            <Clock className="h-4 w-4" />
            Today's Shifts
          </TabsTrigger>
          <TabsTrigger value="appointments" className="gap-2">
            <Calendar className="h-4 w-4" />
            Today's Appointments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shifts" className="space-y-4">
          {shifts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No shifts scheduled for today</p>
              </CardContent>
            </Card>
          ) : (
            shifts.map((shift) => (
              <Card key={shift.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {shift.start_time} - {shift.end_time}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {shift.location}
                      </CardDescription>
                    </div>
                    {getStatusBadge(shift.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {shift.notes && (
                    <p className="text-sm text-muted-foreground mb-4">{shift.notes}</p>
                  )}
                  <div className="flex gap-2">
                    {shift.status === 'scheduled' && (
                      <Button 
                        onClick={() => handleCheckIn('shift', shift.id)}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Check In
                      </Button>
                    )}
                    {shift.status === 'checked_in' && (
                      <Button 
                        onClick={() => handleCheckOut('shift', shift.id)}
                        variant="outline"
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Check Out
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No appointments scheduled for today</p>
              </CardContent>
            </Card>
          ) : (
            appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {appointment.start_time} - {appointment.end_time}
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Client: {appointment.client_id}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {appointment.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          {appointment.service_type}
                        </div>
                      </CardDescription>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {appointment.notes && (
                    <p className="text-sm text-muted-foreground mb-4">{appointment.notes}</p>
                  )}
                  <div className="flex gap-2">
                    {appointment.status === 'scheduled' && (
                      <Button 
                        onClick={() => handleCheckIn('appointment', appointment.id)}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Check In
                      </Button>
                    )}
                    {appointment.status === 'checked_in' && (
                      <Button 
                        onClick={() => handleCheckOut('appointment', appointment.id)}
                        variant="outline"
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}