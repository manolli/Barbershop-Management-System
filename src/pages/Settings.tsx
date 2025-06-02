import React from 'react';
import { Save } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';

const Settings: React.FC = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do sistema</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Informações da Barbearia</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                Nome da Barbearia
              </label>
              <input
                type="text"
                id="businessName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue="BarberPro"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Endereço
              </label>
              <input
                type="text"
                id="address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue="Rua Example, 123"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="text"
                id="phone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue="(11) 99999-9999"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue="contato@barberpro.com"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Horário de Funcionamento</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'].map((day) => (
              <div key={day} className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">{day}</label>
                  <div className="mt-1 flex space-x-2">
                    <input
                      type="time"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      defaultValue={day === 'Domingo' ? '' : '09:00'}
                    />
                    <input
                      type="time"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      defaultValue={day === 'Domingo' ? '' : day === 'Sábado' ? '14:00' : '18:00'}
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked={day !== 'Domingo'}
                  />
                  <label className="ml-2 text-sm text-gray-600">Aberto</label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 text-right">
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 ml-auto"
          >
            <Save className="h-5 w-5 mr-2" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;