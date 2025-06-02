import React from 'react';
import { Calendar, Users, DollarSign, Scissors } from 'lucide-react';
import { Appointment, Client, Service } from '../../types';

interface DashboardStatsProps {
  appointments: Appointment[];
  clients: Client[];
  services: Service[];
  currentDate: Date;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  appointments, 
  clients, 
  services,
  currentDate
}) => {
  const todayAppointments = appointments.filter(
    app => new Date(app.date).toDateString() === currentDate.toDateString()
  );
  
  const completedTodayAppointments = todayAppointments.filter(
    app => app.status === 'completed'
  );
  
  const calculateDailyRevenue = () => {
    return completedTodayAppointments.reduce((total, app) => {
      const service = services.find(s => s.id === app.serviceId);
      if (service) {
        const price = service.promotional?.isActive 
          ? service.promotional.discountedPrice 
          : service.price;
        return total + price;
      }
      return total;
    }, 0);
  };

  const stats = [
    {
      name: 'Agendamentos Hoje',
      value: todayAppointments.length,
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      change: '+5%',
      changeType: 'increase',
    },
    {
      name: 'Total de Clientes',
      value: clients.length,
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
      value: services.length,
      icon: <Scissors className="h-6 w-6 text-purple-500" />,
      change: '0%',
      changeType: 'none',
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