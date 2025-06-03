import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import DashboardStats from '../components/dashboard/DashboardStats';
import AppointmentsList from '../components/dashboard/AppointmentsList';
import UpcomingAppointmentsChart from '../components/dashboard/UpcomingAppointmentsChart';
import ServicePerformanceChart from '../components/dashboard/ServicePerformanceChart';
import { supabase } from '../lib/supabaseClient';
import { Appointment, Client, Employee, Service } from '../../types';
import { formatDate } from '../utils/dateUtils';
import { AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [currentDate] = useState(new Date());
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]); // For charts and stats
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Today's date range
        const todayStart = new Date(currentDate);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(currentDate);
        todayEnd.setHours(23, 59, 59, 999);

        // Tomorrow's date start
        const tomorrowStart = new Date(currentDate);
        tomorrowStart.setDate(currentDate.getDate() + 1);
        tomorrowStart.setHours(0, 0, 0, 0);

        // Fetch all data in parallel
        const [
          appointmentsData,
          clientsData,
          employeesData,
          servicesData
        ] = await Promise.all([
          supabase
            .from('appointments')
            .select('*, clients(*), employees(*), services(*)') // Fetch all related data
            .order('appointment_time', { ascending: true }),
          supabase.from('clients').select('*'),
          supabase.from('employees').select('*'),
          supabase.from('services').select('*')
        ]);

        if (appointmentsData.error) throw appointmentsData.error;
        if (clientsData.error) throw clientsData.error;
        if (employeesData.error) throw employeesData.error;
        if (servicesData.error) throw servicesData.error;

        const allFetchedAppointments = (appointmentsData.data as Appointment[]) || [];
        setAllAppointments(allFetchedAppointments);
        setClients((clientsData.data as Client[]) || []);
        setEmployees((employeesData.data as Employee[]) || []);
        setServices((servicesData.data as Service[]) || []);

        // Filter for Today's Appointments
        const todayApps = allFetchedAppointments.filter(app => {
          const appDate = new Date(app.appointment_time);
          return appDate >= todayStart && appDate <= todayEnd;
        });
        setTodayAppointments(todayApps);

        // Filter for Upcoming Appointments (from tomorrow onwards, limit 5)
        const upcomingApps = allFetchedAppointments
          .filter(app => {
            const appDate = new Date(app.appointment_time);
            return appDate >= tomorrowStart && app.status === 'scheduled';
          })
          .slice(0, 5);
        setUpcomingAppointments(upcomingApps);

      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-center text-gray-500">Carregando dashboard...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="m-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo! Hoje é {formatDate(currentDate)}.</p>
      </div>
      
      <DashboardStats 
        appointments={allAppointments}
        clients={clients}
        services={services}
        currentDate={currentDate} // Pass current date for filtering within DashboardStats if needed
      />
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AppointmentsList
          appointments={todayAppointments}
          // No need to pass all clients, employees, services if Appointment type includes them
          // clients={clients}
          // employees={employees}
          // services={services}
          title="Agendamentos de Hoje"
          emptyMessage="Não há agendamentos para hoje."
        />
        
        <AppointmentsList
          appointments={upcomingAppointments}
          // clients={clients}
          // employees={employees}
          // services={services}
          title="Próximos Agendamentos (Top 5)"
          emptyMessage="Não há próximos agendamentos."
        />
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* UpcomingAppointmentsChart might need all appointments or a specific range */}
        <UpcomingAppointmentsChart appointments={allAppointments} />
        <ServicePerformanceChart 
          appointments={allAppointments}
          services={services}
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;