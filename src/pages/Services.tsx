import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { mockServices } from '../data/mockData';
import { formatDate } from '../utils/dateUtils';

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = mockServices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600">Gerencie os serviços oferecidos</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Novo Serviço
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar serviços..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <p className="mt-2 text-sm text-gray-600">{service.description}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Duração: {service.duration} min
                  </div>
                  <div className="text-right">
                    {service.promotional?.isActive ? (
                      <div>
                        <span className="text-sm line-through text-gray-500">
                          R$ {service.price.toFixed(2)}
                        </span>
                        <span className="ml-2 text-lg font-bold text-green-600">
                          R$ {service.promotional.discountedPrice.toFixed(2)}
                        </span>
                        {service.promotional.validUntil && (
                          <div className="text-xs text-gray-500">
                            Válido até {formatDate(service.promotional.validUntil)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        R$ {service.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Services;