import React from 'react';
import { Appointment } from '../../types';
import { getDayOfWeek } from '../../utils/dateUtils';

interface UpcomingAppointmentsChartProps {
  appointments: Appointment[];
}

const UpcomingAppointmentsChart: React.FC<UpcomingAppointmentsChartProps> = ({ appointments }) => {
  // Count appointments by day for the next 7 days
  const getNextSevenDaysData = () => {
    const counts = new Array(7).fill(0);
    const labels = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      labels.push(getDayOfWeek(date).substring(0, 3));
      
      // Count appointments for this day
      const dayCount = appointments.filter(app => {
        const appDate = new Date(app.appointment_time); // Changed app.date to app.appointment_time
        return (
          appDate.getDate() === date.getDate() &&
          appDate.getMonth() === date.getMonth() &&
          appDate.getFullYear() === date.getFullYear() &&
          app.status === 'scheduled'
        );
      }).length;
      
      counts[i] = dayCount;
    }
    
    return { labels, counts };
  };
  
  const { labels, counts } = getNextSevenDaysData();
  const maxCount = Math.max(...counts, 5); // Ensure min height even if no appointments
  
  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <h3 className="text-lg font-medium text-gray-900">Agendamentos Próximos</h3>
      <div className="mt-6">
        <div className="flex items-end justify-between h-48">
          {labels.map((label, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-8 sm:w-10 rounded-t ${counts[index] > 0 ? 'bg-blue-500' : 'bg-gray-200'}`} 
                style={{ 
                  height: `${Math.max((counts[index] / maxCount) * 100, 5)}%`,
                  transition: 'height 0.3s ease'
                }}
              ></div>
              <div className="text-xs font-medium mt-2 text-gray-500">{label}</div>
              <div className="text-sm font-semibold text-gray-800">{counts[index]}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            Total: {counts.reduce((sum, count) => sum + count, 0)} agendamentos
          </span>
        </div>
      </div>
    </div>
  );
};

export default UpcomingAppointmentsChart;