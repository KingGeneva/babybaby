
import { MedicalAppointment, AppointmentType } from '@/types/medical';

export const convertAppointments = (appointments: MedicalAppointment[]): AppointmentType[] => {
  return appointments.map(appointment => {
    const appointmentType: "vaccine" | "checkup" | "specialist" | "other" = 
      appointment.type === "vaccination" ? "vaccine" :
      appointment.type === "check-up" ? "checkup" :
      appointment.type === "specialist" ? "specialist" : "other";
    
    return {
      ...appointment,
      type: appointmentType
    };
  });
};
