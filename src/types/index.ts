export interface Client {
  id: string; // Corresponds to uuid in Supabase
  name: string;
  phone: string;
  email: string;
  notes?: string;
  created_at?: string; // timestamp with time zone
  updated_at?: string; // timestamp with time zone
}

export interface Employee {
  id: string; // Corresponds to uuid in Supabase
  name: string;
  phone: string;
  email: string;
  job_title?: 'barber' | 'admin' | string; // Allow for other titles, but suggest common ones
  specialties?: string[]; // Assuming this might be stored as jsonb or text array
  availability?: { // Corresponds to jsonb in Supabase
    [key: string]: { start: string; end: string } | null; // null means day off
  };
  created_at?: string; // timestamp with time zone
  updated_at?: string; // timestamp with time zone
}

export interface Service {
  id: string; // Corresponds to uuid in Supabase
  name: string;
  description?: string;
  duration_minutes: number; // in minutes
  price: number;
  is_active?: boolean; // default true
  created_at?: string; // timestamp with time zone
  updated_at?: string; // timestamp with time zone
}

export interface Appointment {
  id: string; // Corresponds to uuid in Supabase
  client_id: string; // Foreign key
  employee_id: string; // Foreign key
  service_id: string; // Foreign key
  appointment_time: string; // timestamp with time zone
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no-show'; // default 'scheduled'
  notes?: string;
  payment_status?: 'pending' | 'paid'; // default 'pending'
  created_at?: string; // timestamp with time zone
  updated_at?: string; // timestamp with time zone

  // Optional: For easier data handling in the frontend, you might want to include expanded objects
  // These would be populated by joining tables in your Supabase queries
  clients?: Client;
  employees?: Employee;
  services?: Service;
}

export interface Report {
  // This type is for client-side representation of aggregated data.
  // It doesn't directly map to a single Supabase table.
  // It will be constructed by querying and processing data from other tables.
  type: 'daily' | 'weekly' | 'monthly';
  period: {
    start: string; // Date as string
    end: string;   // Date as string
  };
  totalRevenue: number;
  appointmentCount: number;
  completionRate: number;
  popularServices: Array<{
    serviceId: string;
    name?: string; // For display
    count: number;
  }>;
  employeePerformance: Array<{
    employeeId: string;
    name?: string; // For display
    appointmentCount: number;
    revenue: number;
  }>;
}