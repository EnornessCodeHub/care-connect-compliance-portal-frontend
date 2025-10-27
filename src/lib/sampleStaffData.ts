import { supabase } from "@/integrations/supabase/client";

export const sampleStaffData = [
  {
    id: "STAFF-001",
    name: "John Smith",
    role: "Support Worker",
    phone: "+61 400 123 456",
    email: "john.smith@company.com"
  },
  {
    id: "STAFF-002", 
    name: "Sarah Johnson",
    role: "Care Coordinator",
    phone: "+61 400 234 567",
    email: "sarah.johnson@company.com"
  },
  {
    id: "STAFF-003",
    name: "Mike Chen", 
    role: "Support Worker",
    phone: "+61 400 345 678",
    email: "mike.chen@company.com"
  },
  {
    id: "STAFF-004",
    name: "Emma Davis",
    role: "Team Leader", 
    phone: "+61 400 456 789",
    email: "emma.davis@company.com"
  }
];

export const createSampleShifts = async () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const shifts = [
    {
      staff_id: "STAFF-001",
      shift_date: today.toISOString().split('T')[0],
      start_time: "09:00",
      end_time: "17:00",
      location: "Community Center North",
      outlet_id: "OUTLET-001",
      status: "scheduled" as const,
      notes: "Regular day shift"
    },
    {
      staff_id: "STAFF-002",
      shift_date: today.toISOString().split('T')[0],
      start_time: "08:00",
      end_time: "16:00", 
      location: "Main Office",
      outlet_id: "OUTLET-001",
      status: "checked_in" as const,
      notes: "Coordinator duties"
    },
    {
      staff_id: "STAFF-003",
      shift_date: today.toISOString().split('T')[0],
      start_time: "10:00",
      end_time: "18:00",
      location: "Community Center South", 
      outlet_id: "OUTLET-002",
      status: "scheduled" as const,
      notes: "Afternoon shift"
    },
    {
      staff_id: "STAFF-004",
      shift_date: tomorrow.toISOString().split('T')[0],
      start_time: "07:00",
      end_time: "15:00",
      location: "Main Office",
      outlet_id: "OUTLET-001", 
      status: "scheduled" as const,
      notes: "Early morning shift"
    }
  ];

  const { data, error } = await supabase
    .from('staff_shifts')
    .upsert(shifts, { onConflict: 'staff_id,shift_date,start_time' });

  if (error) {
    console.error('Error creating sample shifts:', error);
    return null;
  }

  return data;
};

export const createSampleAppointments = async () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointments = [
    {
      staff_id: "STAFF-001",
      client_id: "CLIENT-001",
      appointment_date: today.toISOString().split('T')[0],
      start_time: "10:00",
      end_time: "11:00",
      location: "Client Home - 123 Main St",
      service_type: "Personal Care",
      status: "scheduled" as const,
      notes: "Weekly personal care session"
    },
    {
      staff_id: "STAFF-001",
      client_id: "CLIENT-002", 
      appointment_date: today.toISOString().split('T')[0],
      start_time: "14:00",
      end_time: "15:30",
      location: "Client Home - 456 Oak Ave",
      service_type: "Community Access",
      status: "scheduled" as const,
      notes: "Shopping assistance"
    },
    {
      staff_id: "STAFF-003",
      client_id: "CLIENT-003",
      appointment_date: today.toISOString().split('T')[0], 
      start_time: "11:00",
      end_time: "12:00",
      location: "Client Home - 789 Pine St",
      service_type: "Household Tasks",
      status: "checked_in" as const,
      notes: "Weekly cleaning support"
    },
    {
      staff_id: "STAFF-002",
      client_id: "CLIENT-004",
      appointment_date: tomorrow.toISOString().split('T')[0],
      start_time: "09:00", 
      end_time: "10:00",
      location: "Community Center",
      service_type: "Group Activity",
      status: "scheduled" as const,
      notes: "Art therapy session"
    }
  ];

  const { data, error } = await supabase
    .from('staff_appointments')
    .upsert(appointments, { onConflict: 'staff_id,client_id,appointment_date,start_time' });

  if (error) {
    console.error('Error creating sample appointments:', error);
    return null;
  }

  return data;
};

export const createSampleLocations = async () => {
  // Sample locations around a central point (e.g., Melbourne CBD)
  const baseLatitude = -37.8136;
  const baseLongitude = 144.9631;

  const locations = [
    {
      staff_id: "STAFF-001",
      latitude: baseLatitude + 0.01,
      longitude: baseLongitude + 0.01,
      accuracy: 10,
      address: "123 Collins Street, Melbourne",
      is_active: true,
      last_updated: new Date().toISOString()
    },
    {
      staff_id: "STAFF-002", 
      latitude: baseLatitude - 0.005,
      longitude: baseLongitude + 0.005,
      accuracy: 15,
      address: "456 Bourke Street, Melbourne",
      is_active: true,
      last_updated: new Date().toISOString()
    },
    {
      staff_id: "STAFF-003",
      latitude: baseLatitude + 0.008,
      longitude: baseLongitude - 0.008,
      accuracy: 8,
      address: "789 Flinders Street, Melbourne", 
      is_active: true,
      last_updated: new Date().toISOString()
    }
  ];

  const { data, error } = await supabase
    .from('staff_locations')
    .upsert(locations, { onConflict: 'staff_id' });

  if (error) {
    console.error('Error creating sample locations:', error);
    return null;
  }

  return data;
};

export const initializeSampleData = async () => {
  console.log('Initializing sample staff tracking data...');
  
  try {
    await createSampleShifts();
    await createSampleAppointments();
    await createSampleLocations();
    
    console.log('Sample data created successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing sample data:', error);
    return false;
  }
};