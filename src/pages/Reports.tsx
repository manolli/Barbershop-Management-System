import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { supabase } from '../../lib/supabaseClient';
import { Appointment, Service, Employee } from '../../types';

// Helper to ensure date objects are consistently handled for Supabase
const getUtcDateString = (date: Date) => {
  return date.toISOString();
};

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(1); // First day of the current month
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0]; // Today
  });

  const [appointmentsInRange, setAppointmentsInRange] = useState<Appointment[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rangeStart = new Date(startDate + 'T00:00:00.000Z');
      const rangeEnd = new Date(endDate + 'T23:59:59.999Z');

      const [appointmentsData, servicesData, employeesData] = await Promise.all([
        supabase
          .from('appointments')
          .select('*, services(*), employees(*), clients(*)') // services and employees are crucial here
          .gte('appointment_time', getUtcDateString(rangeStart))
          .lte('appointment_time', getUtcDateString(rangeEnd)),
        supabase.from('services').select('*'),
        supabase.from('employees').select('*')
      ]);

      if (appointmentsData.error) throw appointmentsData.error;
      if (servicesData.error) throw servicesData.error;
      if (employeesData.error) throw employeesData.error;

      setAppointmentsInRange((appointmentsData.data as Appointment[]) || []);
      setAllServices((servicesData.data as Service[]) || []);
      setAllEmployees((employeesData.data as Employee[]) || []);

    } catch (err: any) {
      setError(err.message || 'Failed to fetch report data.');
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const calculateMetrics = useCallback(() => {
    if (loading || error) { // Don't calculate if loading or error
        return {
            totalAppointments: 0,
            completedAppointmentsCount: 0,
            totalRevenue: 0,
            servicePerformance: [],
            employeePerformance: []
        };
    }

    const completedAppointments = appointmentsInRange.filter(
      app => app.status === 'completed'
    );

    const totalRevenue = completedAppointments.reduce((total, app) => {
      // Use price from nested service data within the appointment
      return total + (app.services?.price || 0);
    }, 0);

    const servicePerformance = allServices.map(service => {
      const serviceAppointments = completedAppointments.filter(
        app => app.service_id === service.id
      );
      const serviceRevenue = serviceAppointments.reduce((total, app) => {
        // Price from app.services is already known due to the filter above
        return total + (app.services?.price || 0);
      },0);
      return {
        id: service.id, // Added for key prop
        name: service.name,
        count: serviceAppointments.length,
        revenue: serviceRevenue
      };
    }).sort((a, b) => b.count - a.count);

    const employeePerformance = allEmployees
      .filter(emp => emp.job_title === 'barber') // Use job_title
      .map(employee => {
        const employeeAppointments = completedAppointments.filter(
          app => app.employee_id === employee.id
        );
        const employeeRevenue = employeeAppointments.reduce((total, app) => {
            // Price from app.services is already known
            return total + (app.services?.price || 0);
        },0);
        return {
          id: employee.id, // Added for key prop
          name: employee.name,
          count: employeeAppointments.length,
          revenue: employeeRevenue
        };
      }).sort((a, b) => b.count - a.count);

    return {
      totalAppointments: appointmentsInRange.length,
      completedAppointmentsCount: completedAppointments.length,
      totalRevenue,
      servicePerformance,
      employeePerformance
    };
  }, [appointmentsInRange, allServices, allEmployees, loading, error]);

  const metrics = calculateMetrics();

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Análise de desempenho do negócio</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
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