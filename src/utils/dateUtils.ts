// Format date to Brazilian format (DD/MM/YYYY)
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR');
};

// Format time to Brazilian format (HH:MM)
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

// Format date and time together
export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} às ${formatTime(date)}`;
};

// Get day of week in Portuguese
export const getDayOfWeek = (date: Date): string => {
  const days = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 
    'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];
  return days[date.getDay()];
};

// Convert string time (HH:MM) to minutes
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Check if a given time slot is available
export const isTimeSlotAvailable = (
  date: Date, 
  duration: number, 
  appointments: Array<{ date: Date; duration: number }>,
  workingHours: { start: string; end: string } | null
): boolean => {
  if (!workingHours) return false; // Day off
  
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0) return false; // Sunday is closed
  
  const timeInMinutes = date.getHours() * 60 + date.getMinutes();
  const startInMinutes = timeToMinutes(workingHours.start);
  const endInMinutes = timeToMinutes(workingHours.end);
  
  // Check if time is within working hours
  if (timeInMinutes < startInMinutes || timeInMinutes + duration > endInMinutes) {
    return false;
  }
  
  // Check if time slot overlaps with existing appointments
  for (const appointment of appointments) {
    const appointmentDate = appointment.date;
    const appointmentDuration = appointment.duration;
    
    if (appointmentDate.getDate() === date.getDate() && 
        appointmentDate.getMonth() === date.getMonth() && 
        appointmentDate.getFullYear() === date.getFullYear()) {
      
      const appointmentTime = appointmentDate.getHours() * 60 + appointmentDate.getMinutes();
      
      // Check for overlap
      if (
        (timeInMinutes >= appointmentTime && timeInMinutes < appointmentTime + appointmentDuration) ||
        (timeInMinutes + duration > appointmentTime && timeInMinutes < appointmentTime)
      ) {
        return false;
      }
    }
  }
  
  return true;
};

// Generate available time slots for a specific date and barber
export const generateTimeSlots = (
  date: Date,
  barberWorkingHours: { start: string; end: string } | null,
  appointments: Array<{ date: Date; duration: number }>,
  serviceDuration: number
): Date[] => {
  const slots: Date[] = [];
  
  if (!barberWorkingHours) return slots; // Day off
  
  const startTime = timeToMinutes(barberWorkingHours.start);
  const endTime = timeToMinutes(barberWorkingHours.end);
  
  // Generate slots in 30-minute intervals
  for (let time = startTime; time <= endTime - serviceDuration; time += 30) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    
    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);
    
    if (isTimeSlotAvailable(slotDate, serviceDuration, appointments, barberWorkingHours)) {
      slots.push(slotDate);
    }
  }
  
  return slots;
};