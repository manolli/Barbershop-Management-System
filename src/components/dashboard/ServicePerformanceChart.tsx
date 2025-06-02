import React from 'react';
import { Appointment, Service } from '../../types';

interface ServicePerformanceChartProps {
  appointments: Appointment[];
  services: Service[];
}

const ServicePerformanceChart: React.FC<ServicePerformanceChartProps> = ({ 
  appointments, 
  services 
}) => {
  // Calculate completed appointments per service
  const calculateServicePerformance = () => {
    const serviceMap = new Map<string, number>();
    
    // Initialize with all services
    services.forEach(service => {
      serviceMap.set(service.id, 0);
    });
    
    // Count completed appointments per service
    appointments
      .filter(app => app.status === 'completed')
      .forEach(app => {
        const count = serviceMap.get(app.serviceId) || 0;
        serviceMap.set(app.serviceId, count + 1);
      });
    
    // Convert to array sorted by count
    const result = Array.from(serviceMap.entries())
      .map(([serviceId, count]) => {
        const service = services.find(s => s.id === serviceId);
        return {
          id: serviceId,
          name: service ? service.name : 'Serviço desconhecido',
          count
        };
      })
      .sort((a, b) => b.count - a.count);
    
    return result;
  };
  
  const servicePerformance = calculateServicePerformance();
  const maxCount = Math.max(...servicePerformance.map(s => s.count), 1);
  
  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <h3 className="text-lg font-medium text-gray-900">Desempenho por Serviço</h3>
      <div className="mt-6">
        {servicePerformance.map((service) => (
          <div key={service.id} className="mb-4 last:mb-0">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-900 truncate">
                {service.name}
              </div>
              <div className="text-sm font-medium text-gray-500">
                {service.count} {service.count === 1 ? 'cliente' : 'clientes'}
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ 
                  width: `${(service.count / maxCount) * 100}%`,
                  transition: 'width 0.3s ease'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicePerformanceChart;