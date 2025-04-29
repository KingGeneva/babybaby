
export interface AppointmentType {
  id: string;
  title: string;
  date: string;
  time?: string;
  doctor?: string;
  location?: string;
  notes?: string;
  type: "vaccine" | "checkup" | "specialist" | "other";
}

export interface MedicalAppointment {
  id: string;
  title: string;
  date: string;
  time?: string;
  doctor?: string;
  location?: string;
  notes?: string;
  type: "specialist" | "checkup" | "vaccination" | "other";
}

// Fonction utilitaire pour convertir MedicalAppointment en AppointmentType
export function convertMedicalAppointmentToAppointmentType(appointment: MedicalAppointment): AppointmentType {
  const typeMap: Record<string, "vaccine" | "checkup" | "specialist" | "other"> = {
    "vaccination": "vaccine",
    "check-up": "checkup",
    "specialist": "specialist",
    "other": "other"
  };
  
  return {
    ...appointment,
    type: typeMap[appointment.type] || "other"
  };
}
