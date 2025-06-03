import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Calendar as CalendarIcon, AlertCircle, Edit, Trash2 } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { supabase } from '../lib/supabaseClient';
import { Appointment, Client, Employee, Service } from '../../types'; // Ensure these types can handle nullable nested objects
import { formatDateTime, formatDate } from '../utils/dateUtils'; // formatDateTime might need adjustment for string dates from Supabase

// Helper function to get the start and end of a given date string (YYYY-MM-DD)
const getDayRange = (dateStr: string) => {
  const startDate = new Date(dateStr + 'T00:00:00.000Z'); // Start of day in UTC
  const endDate = new Date(dateStr + 'T23:59:59.999Z'); // End of day in UTC
  return { startDate, endDate };
};


const Appointments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0] // Default to today in YYYY-MM-DD format
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = getDayRange(selectedDate);

      const { data, error: supabaseError } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (id, name, phone),
          employees (id, name),
          services (id, name, duration_minutes)
        `)
        .gte('appointment_time', startDate.toISOString())
        .lte('appointment_time', endDate.toISOString())
        .order('appointment_time', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }
      // Make sure nested objects are correctly typed, they might be null if FK is null
      setAppointments(data as Appointment[] || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch appointments.');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const filteredAppointments = appointments.filter(appointment => {
    const clientName = appointment.clients?.name || '';
    const employeeName = appointment.employees?.name || '';
    const serviceName = appointment.services?.name || '';

    return (
      !searchTerm ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // TODO: Implement Add New Appointment functionality
  const handleAddNewAppointment = () => {
    console.log("Add new appointment clicked");
  };

  // TODO: Implement Edit Appointment functionality
  const handleEditAppointment = (appointment: Appointment) => {
    console.log("Edit appointment:", appointment);
  };

  // TODO: Implement Delete Appointment functionality
  const handleDeleteAppointment = async (appointmentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        const { error: supabaseError } = await supabase
          .from('appointments')
          .delete()
          .match({ id: appointmentId });

        if (supabaseError) throw supabaseError;
        setAppointments(prev => prev.filter(app => app.id !== appointmentId));
      } catch (err: any) {
        setError(err.message || 'Falha ao excluir agendamento.');
        console.error('Error deleting appointment:', err);
      }
    }
  };


  const getStatusClass = (status?: Appointment['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status?: Appointment['status']) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      case 'no-show': return 'Não Compareceu';
      case 'scheduled':
      default:
        return 'Agendado';
    }
  };


  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600">Gerencie os agendamentos</p>
        </div>
        <button
          onClick={handleAddNewAppointment}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Agendamento
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por cliente, profissional ou serviço..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="date"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Carregando agendamentos...</p>
          </div>
        ) : filteredAppointments.length === 0 && !error ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Nenhum agendamento para a data selecionada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profissional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDateTime(new Date(appointment.appointment_time))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.clients?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.clients?.phone || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.employees?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.services?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.services?.duration_minutes ? `${appointment.services.duration_minutes} min` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditAppointment(appointment)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Editar Agendamento"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir Agendamento"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Appointments;