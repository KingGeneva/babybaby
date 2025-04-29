
import { MedicalAppointment, AppointmentType } from '@/types/medical';

export const convertAppointments = (appointments: MedicalAppointment[]): AppointmentType[] => {
  return appointments.map(appointment => {
    const appointmentType: "vaccine" | "checkup" | "specialist" | "other" = 
      appointment.type === "vaccination" ? "vaccine" :
      appointment.type === "checkup" ? "checkup" :
      appointment.type === "specialist" ? "specialist" : "other";
    
    return {
      ...appointment,
      doctor: appointment.doctor || "",
      type: appointmentType
    };
  });
};
