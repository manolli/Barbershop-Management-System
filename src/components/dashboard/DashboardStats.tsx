import React from 'react';
import { Calendar, Users, DollarSign, Scissors } from 'lucide-react';
import { Appointment, Client, Service } from '../../types'; // Types are fine

interface DashboardStatsProps {
  appointments: Appointment[]; // These appointments will have nested client/service/employee data
  clients: Client[];
  services: Service[]; // This is the full list of services from the DB
  currentDate: Date;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  appointments, 
  clients, 
  services,
  currentDate
}) => {
  // Filter appointments for today
  const todayAppointments = appointments.filter(app => {
    const appDate = new Date(app.appointment_time); // Use appointment_time
    return appDate.toDateString() === currentDate.toDateString();
  });
  
  // Filter completed appointments for today
  const completedTodayAppointments = todayAppointments.filter(
    app => app.status === 'completed'
  );
  
  // Calculate daily revenue from completed appointments today
  const calculateDailyRevenue = () => {
    return completedTodayAppointments.reduce((total, app) => {
      // Access nested service and its price directly
      if (app.services && typeof app.services.price === 'number') {
        return total + app.services.price;
      }
      return total;
    }, 0);
  };

  // Count active services
  const activeServicesCount = services.filter(service => service.is_active).length;

  const stats = [
    {
      name: 'Agendamentos Hoje',
      value: todayAppointments.length,
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      // "change" is mock, will leave as is
      change: '+5%',
      changeType: 'increase',
    },
    {
      name: 'Total de Clientes',
      value: clients.length, // This is total clients from the clients prop
      icon: <Users className="h-6 w-6 text-orange-500" />,
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Faturamento Diário',
      value: `R$ ${calculateDailyRevenue().toFixed(2)}`,
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      change: '+3%',
      changeType: 'increase',
    },
    {
      name: 'Serviços Ativos',
      value: activeServicesCount, // Use the count of active services
      icon: <Scissors className="h-6 w-6 text-purple-500" />,
      change: '', // No change metric for this one or could be calculated if historical data existed
      changeType: 'none', // Or remove change display
    },
  ];

  return (
    <div>
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Visão Geral
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <dt>
              <div className="absolute bg-gray-100 rounded-md p-3">
                {stat.icon}
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'increase' ? 'text-green-600' :
                  stat.changeType === 'decrease' ? 'text-red-600' :
                  'text-gray-500'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default DashboardStats;