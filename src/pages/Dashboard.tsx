import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import DashboardStats from '../components/dashboard/DashboardStats';
import AppointmentsList from '../components/dashboard/AppointmentsList';
import UpcomingAppointmentsChart from '../components/dashboard/UpcomingAppointmentsChart';
import ServicePerformanceChart from '../components/dashboard/ServicePerformanceChart';
import { mockAppointments, mockClients, mockEmployees, mockServices } from '../data/mockData';
import { formatDate } from '../utils/dateUtils';

const Dashboard: React.FC = () => {
  const [currentDate] = useState(new Date());
  
  // Get today's appointments
  const todayAppointments = mockAppointments.filter(
    app => new Date(app.date).toDateString() === currentDate.toDateString()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Get upcoming appointments (excluding today)
  const upcomingAppointments = mockAppointments
    .filter(app => {
      const appDate = new Date(app.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const isAfterToday = appDate > today && appDate.toDateString() !== currentDate.toDateString();
      const isScheduled = app.status === 'scheduled';
      
      return isAfterToday && isScheduled;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5); // Only show 5 upcoming appointments
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo! Hoje é {formatDate(currentDate)}.</p>
      </div>
      
      <DashboardStats 
        appointments={mockAppointments} 
        clients={mockClients} 
        services={mockServices}
        currentDate={currentDate}
      />
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AppointmentsList
          appointments={todayAppointments}
          clients={mockClients}
          employees={mockEmployees}
          services={mockServices}
          title="Agendamentos de Hoje"
          emptyMessage="Não há agendamentos para hoje."
        />
        
        <AppointmentsList
          appointments={upcomingAppointments}
          clients={mockClients}
          employees={mockEmployees}
          services={mockServices}
          title="Próximos Agendamentos"
          emptyMessage="Não há agendamentos futuros."
        />
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingAppointmentsChart appointments={mockAppointments} />
        <ServicePerformanceChart 
          appointments={mockAppointments} 
          services={mockServices} 
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;