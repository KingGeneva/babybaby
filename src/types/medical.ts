
export interface AppointmentType {
  id: string;
  title: string;
  date: string;
  time?: string;
  doctor: string;
  location?: string;
  notes?: string;
  type: "vaccine" | "checkup" | "specialist";
  completed?: boolean;
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
  completed?: boolean;
  childId?: string;
}

// Function to convert MedicalAppointment to AppointmentType
export function convertMedicalAppointmentToAppointmentType(appointment: MedicalAppointment): AppointmentType {
  const typeMap: Record<string, "vaccine" | "checkup" | "specialist"> = {
    "vaccination": "vaccine",
    "checkup": "checkup",
    "specialist": "specialist",
    "other": "checkup" // Default to checkup for 'other' type
  };
  
  return {
    ...appointment,
    doctor: appointment.doctor || "",
    type: typeMap[appointment.type] || "checkup"
  };
}

// Vaccination interface and data
export interface Vaccination {
  id: string;
  name: string;
  recommendedAge: string;
  description?: string;
  mandatory: boolean;
  administeredDate?: string;
}

interface VaccineInfo {
  name: string;
  description?: string;
  mandatory: boolean;
}

interface AgeSchedule {
  ageGroup: string;
  vaccines: VaccineInfo[];
}

export const VACCINATION_SCHEDULE: AgeSchedule[] = [
  {
    ageGroup: "Naissance",
    vaccines: [
      { name: "BCG", description: "Protection contre la tuberculose", mandatory: false },
      { name: "Hépatite B (1ère dose)", description: "Protection contre l'hépatite B", mandatory: true }
    ]
  },
  {
    ageGroup: "2 mois",
    vaccines: [
      { name: "Hexavalent (1ère dose)", description: "Diphtérie, Tétanos, Poliomyélite, Coqueluche, Haemophilus influenzae b, Hépatite B", mandatory: true },
      { name: "Pneumocoque (1ère dose)", description: "Protection contre les infections à pneumocoque", mandatory: true },
      { name: "Rotavirus (1ère dose)", description: "Protection contre les gastro-entérites à rotavirus", mandatory: false }
    ]
  },
  {
    ageGroup: "4 mois",
    vaccines: [
      { name: "Hexavalent (2ème dose)", description: "Diphtérie, Tétanos, Poliomyélite, Coqueluche, Haemophilus influenzae b, Hépatite B", mandatory: true },
      { name: "Pneumocoque (2ème dose)", description: "Protection contre les infections à pneumocoque", mandatory: true },
      { name: "Rotavirus (2ème dose)", description: "Protection contre les gastro-entérites à rotavirus", mandatory: false }
    ]
  },
  {
    ageGroup: "11 mois",
    vaccines: [
      { name: "Hexavalent (3ème dose)", description: "Diphtérie, Tétanos, Poliomyélite, Coqueluche, Haemophilus influenzae b, Hépatite B", mandatory: true },
      { name: "Pneumocoque (3ème dose)", description: "Protection contre les infections à pneumocoque", mandatory: true }
    ]
  },
  {
    ageGroup: "12 mois",
    vaccines: [
      { name: "ROR (1ère dose)", description: "Rougeole, Oreillons, Rubéole", mandatory: true },
      { name: "Méningocoque C", description: "Protection contre les méningites à méningocoque C", mandatory: true }
    ]
  },
  {
    ageGroup: "16-18 mois",
    vaccines: [
      { name: "ROR (2ème dose)", description: "Rougeole, Oreillons, Rubéole", mandatory: true }
    ]
  },
  {
    ageGroup: "6 ans",
    vaccines: [
      { name: "DTPolio", description: "Diphtérie, Tétanos, Poliomyélite", mandatory: true }
    ]
  },
  {
    ageGroup: "11-13 ans",
    vaccines: [
      { name: "DTPolio et Coqueluche", description: "Diphtérie, Tétanos, Poliomyélite, Coqueluche", mandatory: true },
      { name: "HPV", description: "Papillomavirus humain", mandatory: false }
    ]
  }
];
