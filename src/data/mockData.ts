import { Client, Employee, Service, Appointment } from '../types';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '(11) 98765-4321',
    email: 'joao.silva@email.com',
    lastVisit: new Date('2023-09-15'),
    preferredBarber: '1',
    notes: 'Prefere corte degradê'
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    phone: '(11) 91234-5678',
    email: 'carlos.oliveira@email.com',
    lastVisit: new Date('2023-10-05'),
    preferredBarber: '2',
  },
  {
    id: '3',
    name: 'Pedro Santos',
    phone: '(11) 95555-9999',
    email: 'pedro.santos@email.com',
  },
  {
    id: '4',
    name: 'Lucas Mendes',
    phone: '(11) 97777-8888',
    email: 'lucas.mendes@email.com',
    lastVisit: new Date('2023-10-20'),
    notes: 'Cliente fidelidade'
  },
];

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'André Barbosa',
    phone: '(11) 97777-6666',
    email: 'andre.barbosa@barbearia.com',
    role: 'barber',
    specialties: ['Corte Degradê', 'Barba', 'Sobrancelha'],
    workingHours: {
      'monday': { start: '09:00', end: '18:00' },
      'tuesday': { start: '09:00', end: '18:00' },
      'wednesday': { start: '09:00', end: '18:00' },
      'thursday': { start: '09:00', end: '18:00' },
      'friday': { start: '09:00', end: '18:00' },
      'saturday': { start: '09:00', end: '14:00' },
      'sunday': null,
    }
  },
  {
    id: '2',
    name: 'Rafael Gomes',
    phone: '(11) 96666-5555',
    email: 'rafael.gomes@barbearia.com',
    role: 'barber',
    specialties: ['Corte Clássico', 'Barba', 'Tratamento Capilar'],
    workingHours: {
      'monday': { start: '10:00', end: '19:00' },
      'tuesday': { start: '10:00', end: '19:00' },
      'wednesday': { start: '10:00', end: '19:00' },
      'thursday': { start: '10:00', end: '19:00' },
      'friday': { start: '10:00', end: '19:00' },
      'saturday': { start: '09:00', end: '14:00' },
      'sunday': null,
    }
  },
  {
    id: '3',
    name: 'Marcelo Costa',
    phone: '(11) 95555-4444',
    email: 'marcelo.costa@barbearia.com',
    role: 'admin',
    specialties: ['Corte Degradê', 'Barba Completa'],
    workingHours: {
      'monday': { start: '08:00', end: '17:00' },
      'tuesday': { start: '08:00', end: '17:00' },
      'wednesday': { start: '08:00', end: '17:00' },
      'thursday': { start: '08:00', end: '17:00' },
      'friday': { start: '08:00', end: '17:00' },
      'saturday': null,
      'sunday': null,
    }
  },
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Corte Degradê',
    description: 'Corte com máquina e tesoura, com degradê nas laterais.',
    duration: 30,
    price: 45,
    promotional: {
      isActive: true,
      discountedPrice: 35,
      validUntil: new Date('2023-12-31'),
    },
  },
  {
    id: '2',
    name: 'Barba Completa',
    description: 'Aparo e modelagem de barba com toalha quente e produtos especiais.',
    duration: 30,
    price: 35,
  },
  {
    id: '3',
    name: 'Corte + Barba',
    description: 'Combo de corte de cabelo e barba completa.',
    duration: 60,
    price: 75,
    promotional: {
      isActive: true,
      discountedPrice: 65,
    },
  },
  {
    id: '4',
    name: 'Sobrancelha',
    description: 'Modelagem de sobrancelha masculina.',
    duration: 15,
    price: 20,
  },
  {
    id: '5',
    name: 'Tratamento Capilar',
    description: 'Hidratação e tratamento para cabelo e couro cabeludo.',
    duration: 45,
    price: 60,
  },
];

// Function to generate appointments for the next 7 days
export const generateMockAppointments = (): Appointment[] => {
  const appointments: Appointment[] = [];
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
  
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(startOfDay);
    currentDate.setDate(currentDate.getDate() + day);
    
    // Skip Sundays
    if (currentDate.getDay() === 0) continue;
    
    // Generate 2-5 appointments per day
    const appointmentsPerDay = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < appointmentsPerDay; i++) {
      const hour = 9 + Math.floor(Math.random() * 9); // 9AM - 6PM
      const minute = Math.random() > 0.5 ? 0 : 30; // 0 or 30 minutes
      
      const appointmentDate = new Date(currentDate);
      appointmentDate.setHours(hour, minute, 0);
      
      const clientId = mockClients[Math.floor(Math.random() * mockClients.length)].id;
      const employeeId = mockEmployees[Math.floor(Math.random() * (mockEmployees.length - 1))].id; // Exclude admin
      const serviceId = mockServices[Math.floor(Math.random() * mockServices.length)].id;
      
      let status: Appointment['status'] = 'scheduled';
      
      // If appointment is in the past, mark as completed or no-show
      if (appointmentDate < now) {
        status = Math.random() > 0.1 ? 'completed' : 'no-show';
      }
      
      appointments.push({
        id: `appointment-${day}-${i}`,
        clientId,
        employeeId,
        serviceId,
        date: appointmentDate,
        status,
        paymentStatus: status === 'completed' ? 'paid' : 'pending',
      });
    }
  }
  
  return appointments;
};

export const mockAppointments = generateMockAppointments();