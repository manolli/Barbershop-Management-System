import React, { useState } from 'react';
import { BarChart, Calendar as CalendarIcon } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { mockAppointments, mockServices, mockEmployees } from '../data/mockData';

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setDate(1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const calculateMetrics = () => {
    const filteredAppointments = mockAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate >= new Date(startDate) &&
        appointmentDate <= new Date(endDate)
      );
    });

    const completedAppointments = filteredAppointments.filter(
      app => app.status === 'completed'
    );

    const totalRevenue = completedAppointments.reduce((total, app) => {
      const service = mockServices.find(s => s.id === app.serviceId);
      if (service) {
        return total + (service.promotional?.isActive 
          ? service.promotional.discountedPrice 
          : service.price);
      }
      return total;
    }, 0);

    const servicePerformance = mockServices.map(service => {
      const serviceAppointments = completedAppointments.filter(
        app => app.serviceId === service.id
      );
      return {
        name: service.name,
        count: serviceAppointments.length,
        revenue: serviceAppointments.reduce((total, app) => {
          return total + (service.promotional?.isActive 
            ? service.promotional.discountedPrice 
            : service.price);
        }, 0)
      };
    }).sort((a, b) => b.count - a.count);

    const employeePerformance = mockEmployees
      .filter(emp => emp.role === 'barber')
      .map(employee => {
        const employeeAppointments = completedAppointments.filter(
          app => app.employeeId === employee.id
        );
        return {
          name: employee.name,
          count: employeeAppointments.length,
          revenue: employeeAppointments.reduce((total, app) => {
            const service = mockServices.find(s => s.id === app.serviceId);
            if (service) {
              return total + (service.promotional?.isActive 
                ? service.promotional.discountedPrice 
                : service.price);
            }
            return total;
          }, 0)
        };
      }).sort((a, b) => b.count - a.count);

    return {
      totalAppointments: filteredAppointments.length,
      completedAppointments: completedAppointments.length,
      totalRevenue,
      servicePerformance,
      employeePerformance
    };
  };

  const metrics = calculateMetrics();

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Análise de desempenho do negócio</p>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="date"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="date"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <BarChart className="h-8 w-8 text-blue-600" />
            <h3 className="ml-3 text-lg font-medium text-gray-900">Total de Agendamentos</h3>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{metrics.totalAppointments}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <BarChart className="h-8 w-8 text-green-600" />
            <h3 className="ml-3 text-lg font-medium text-gray-900">Agendamentos Concluídos</h3>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{metrics.completedAppointments}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <BarChart className="h-8 w-8 text-purple-600" />
            <h3 className="ml-3 text-lg font-medium text-gray-900">Taxa de Conclusão</h3>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">
            {metrics.totalAppointments > 0
              ? `${((metrics.completedAppointments / metrics.totalAppointments) * 100).toFixed(1)}%`
              : '0%'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <BarChart className="h-8 w-8 text-yellow-600" />
            <h3 className="ml-3 text-lg font-medium text-gray-900">Faturamento Total</h3>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">
            R$ {metrics.totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Desempenho por Serviço</h3>
          <div className="space-y-4">
            {metrics.servicePerformance.map((service, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">{service.name}</span>
                  <span className="text-sm text-gray-600">
                    {service.count} agendamentos • R$ {service.revenue.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(service.count / Math.max(...metrics.servicePerformance.map(s => s.count))) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Desempenho por Profissional</h3>
          <div className="space-y-4">
            {metrics.employeePerformance.map((employee, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">{employee.name}</span>
                  <span className="text-sm text-gray-600">
                    {employee.count} agendamentos • R$ {employee.revenue.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(employee.count / Math.max(...metrics.employeePerformance.map(e => e.count))) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;