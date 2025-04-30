
import { MedicalAppointment, AppointmentType } from '@/types/medical';

export const convertAppointments = (appointments: MedicalAppointment[]): AppointmentType[] => {
  return appointments.map(appointment => {
    const appointmentType: "vaccine" | "checkup" | "specialist" = 
      appointment.type === "vaccination" ? "vaccine" :
      appointment.type === "checkup" ? "checkup" :
      appointment.type === "specialist" ? "specialist" : "checkup";
    
    return {
      ...appointment,
      doctor: appointment.doctor || "",
      type: appointmentType
    };
  });
};
