import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import { Appointment } from '../../types'; // Client, Employee, Service no longer needed here directly
import { formatTime } from '../../utils/dateUtils';

interface AppointmentsListProps {
  appointments: Appointment[]; // Appointments should now contain nested client, employee, service data
  title: string;
  emptyMessage: string;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  title,
  emptyMessage
}) => {

  const getStatusIcon = (status?: Appointment['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      case 'no-show':
        return <X className="h-5 w-5 text-amber-500" />; // Changed from amber to yellow to match page
      case 'scheduled':
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusText = (status?: Appointment['status']) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      case 'no-show':
        return 'Não Compareceu';
      case 'scheduled':
      default:
        return 'Agendado';
    }
  };

  const getStatusClass = (status?: Appointment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800'; // Changed from amber to yellow
      case 'scheduled':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      </div>
      {appointments.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="font-medium text-lg text-gray-900 truncate">
                    {/* Ensure appointment_time is correctly formatted from string if needed */}
                    {formatTime(new Date(appointment.appointment_time))}
                  </p>
                  <span className={`ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap inline-flex items-center gap-1 ${getStatusClass(appointment.status)}`}>
                    {getStatusIcon(appointment.status)}
                    {getStatusText(appointment.status)}
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  R$ {appointment.services?.price ? Number(appointment.services.price).toFixed(2) : '0.00'}
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-700">
                    Cliente: {appointment.clients?.name || 'N/A'}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-700 sm:mt-0 sm:ml-6">
                    Profissional: {appointment.employees?.name || 'N/A'}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p className="text-sm font-medium text-blue-600">
                    {appointment.services?.name || 'N/A'}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-4 py-6 text-center text-gray-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;