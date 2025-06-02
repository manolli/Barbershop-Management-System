import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Home, Users, Scissors, Calendar, BarChart2, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  return (
    <div className="h-full flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <div className="flex items-center">
          <Scissors className="h-8 w-8 text-white" />
          <span className="ml-2 text-white text-2xl font-bold">BarberPro</span>
        </div>
        <button
          type="button"
          className="ml-auto flex-shrink-0 text-white lg:hidden"
          onClick={onClose}
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-8 flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-1" aria-label="Sidebar">
          <NavItem to="/dashboard" icon={<Home />} text="Dashboard" />
          <NavItem to="/appointments" icon={<Calendar />} text="Agendamentos" />
          <NavItem to="/clients" icon={<Users />} text="Clientes" />
          <NavItem to="/employees" icon={<Users />} text="Funcionários" />
          <NavItem to="/services" icon={<Scissors />} text="Serviços" />
          <NavItem to="/reports" icon={<BarChart2 />} text="Relatórios" />
          <NavItem to="/settings" icon={<Settings />} text="Configurações" />
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
        <button className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="User"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Marcelo Costa</p>
              <p className="text-xs font-medium text-blue-200">Administrador</p>
            </div>
            <LogOut className="ml-auto h-5 w-5 text-blue-200" />
          </div>
        </button>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, text }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
          isActive
            ? 'bg-blue-800 text-white'
            : 'text-blue-100 hover:bg-blue-800 hover:text-white'
        }`
      }
    >
      <span className="mr-3 h-6 w-6">{icon}</span>
      {text}
    </NavLink>
  );
};

export default Sidebar;