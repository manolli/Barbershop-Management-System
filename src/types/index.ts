export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisit?: Date;
  preferredBarber?: string;
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'barber' | 'admin';
  specialties: string[];
  workingHours: {
    [key: string]: { start: string; end: string } | null; // null means day off
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  promotional?: {
    isActive: boolean;
    discountedPrice: number;
    validUntil?: Date;
  };
}

export interface Appointment {
  id: string;
  clientId: string;
  employeeId: string;
  serviceId: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  paymentStatus?: 'pending' | 'paid';
}

export interface Report {
  type: 'daily' | 'weekly' | 'monthly';
  period: {
    start: Date;
    end: Date;
  };
  totalRevenue: number;
  appointmentCount: number;
  completionRate: number;
  popularServices: Array<{
    serviceId: string;
    count: number;
  }>;
  employeePerformance: Array<{
    employeeId: string;
    appointmentCount: number;
    revenue: number;
  }>;
}