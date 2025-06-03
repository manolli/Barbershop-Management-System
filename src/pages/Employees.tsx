import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, AlertCircle } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { supabase } from '../lib/supabaseClient';
import { Employee } from '../../types';

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from('employees')
          .select('*')
          .order('name', { ascending: true });

        if (supabaseError) {
          throw supabaseError;
        }
        setEmployees(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch employees.');
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (employee.phone && employee.phone.includes(searchTerm))
  );

  // TODO: Implement Add New Employee functionality
  const handleAddNewEmployee = () => {
    console.log("Add new employee clicked");
    // This would typically open a modal or navigate to a form
  };

  // TODO: Implement Edit Employee functionality
  const handleEditEmployee = (employee: Employee) => {
    console.log("Edit employee:", employee);
    // This would typically open a modal or navigate to a form with employee data
  };

  // TODO: Implement Delete Employee functionality
  const handleDeleteEmployee = async (employeeId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        // Check if any appointments are assigned to this employee
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('id')
          .eq('employee_id', employeeId)
          .limit(1);

        if (appointmentsError) throw appointmentsError;

        if (appointments && appointments.length > 0) {
          setError('Este funcionário não pode ser excluído pois está associado a agendamentos existentes.');
          return;
        }

        const { error: supabaseError } = await supabase
          .from('employees')
          .delete()
          .match({ id: employeeId });

        if (supabaseError) {
          throw supabaseError;
        }
        setEmployees(employees.filter(e => e.id !== employeeId));
      } catch (err: any) {
        setError(err.message || 'Falha ao excluir funcionário.');
        console.error('Error deleting employee:', err);
      }
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Funcionários</h1>
          <p className="text-gray-600">Gerencie sua equipe</p>
        </div>
        <button
          onClick={handleAddNewEmployee}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Funcionário
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
              placeholder="Buscar funcionários por nome, email ou telefone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Carregando funcionários...</p>
          </div>
        ) : filteredEmployees.length === 0 && !error ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Nenhum funcionário encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialidades
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.phone || '-'}</div>
                      <div className="text-sm text-gray-500">{employee.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.job_title === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : employee.job_title === 'barber'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {employee.job_title ? employee.job_title.charAt(0).toUpperCase() + employee.job_title.slice(1) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(employee.specialties && employee.specialties.length > 0) ? employee.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {specialty}
                          </span>
                        )) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Editar Funcionário"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir Funcionário"
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

export default Employees;