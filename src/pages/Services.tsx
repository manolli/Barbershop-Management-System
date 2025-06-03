import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, AlertCircle, Tag } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { supabase } from '../lib/supabaseClient';
import { Service } from '../../types';
// import { formatDate } from '../utils/dateUtils'; // Not used for service dates directly unless for created_at/updated_at

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from('services')
          .select('*')
          .order('name', { ascending: true });

        if (supabaseError) {
          throw supabaseError;
        }
        setServices(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch services.');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // TODO: Implement Add New Service functionality
  const handleAddNewService = () => {
    console.log("Add new service clicked");
    // This would typically open a modal or navigate to a form
  };

  // TODO: Implement Edit Service functionality
  const handleEditService = (service: Service) => {
    console.log("Edit service:", service);
    // This would typically open a modal or navigate to a form with service data
  };

  // TODO: Implement Delete Service functionality
  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        // Check if any appointments are using this service
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('id')
          .eq('service_id', serviceId)
          .limit(1);

        if (appointmentsError) throw appointmentsError;

        if (appointments && appointments.length > 0) {
          setError('Este serviço não pode ser excluído pois está associado a agendamentos existentes.');
          return;
        }

        const { error: supabaseError } = await supabase
          .from('services')
          .delete()
          .match({ id: serviceId });

        if (supabaseError) {
          throw supabaseError;
        }
        setServices(services.filter(s => s.id !== serviceId));
      } catch (err: any) {
        setError(err.message || 'Falha ao excluir serviço.');
        console.error('Error deleting service:', err);
      }
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600">Gerencie os serviços oferecidos</p>
        </div>
        <button
          onClick={handleAddNewService}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Serviço
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar serviços por nome ou descrição..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Carregando serviços...</p>
          </div>
        ) : filteredServices.length === 0 && !error ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Nenhum serviço encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar Serviço"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir Serviço"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-1 text-sm text-gray-600 h-16 overflow-y-auto">
                    {service.description || 'Sem descrição.'}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Duração: {service.duration_minutes} min
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        R$ {Number(service.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-4 pt-2 border-t border-gray-200">
                    <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        service.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {service.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Services;