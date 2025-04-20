
export interface Vaccination {
  id: string;
  name: string;
  recommendedAge: string; // e.g. "2 mois", "4 mois"
  description: string;
  administeredDate?: string;
  nextDose?: string;
  notes?: string;
  mandatory: boolean;
}

export interface MedicalAppointment {
  id: string;
  title: string;
  date: string;
  time?: string;
  doctor: string;
  location?: string;
  notes?: string;
  completed: boolean;
  type: 'vaccination' | 'check-up' | 'specialist' | 'other';
  childId: string;
}

export interface VaccinationSchedule {
  ageGroup: string;
  vaccines: {
    name: string;
    description: string;
    mandatory: boolean;
  }[];
}

export const VACCINATION_SCHEDULE: VaccinationSchedule[] = [
  {
    ageGroup: "Naissance",
    vaccines: [
      {
        name: "BCG",
        description: "Vaccin contre la tuberculose",
        mandatory: false
      },
      {
        name: "Hépatite B",
        description: "Première dose du vaccin contre l'hépatite B",
        mandatory: true
      }
    ]
  },
  {
    ageGroup: "2 mois",
    vaccines: [
      {
        name: "Hexavalent (DTP-Coqueluche-Hib-Hépatite B)",
        description: "Première dose du vaccin hexavalent",
        mandatory: true
      },
      {
        name: "Pneumocoque",
        description: "Première dose du vaccin contre le pneumocoque",
        mandatory: true
      },
      {
        name: "Méningocoque C",
        description: "Vaccination contre le méningocoque de type C",
        mandatory: true
      },
      {
        name: "Rotavirus",
        description: "Première dose du vaccin contre les gastro-entérites à rotavirus",
        mandatory: false
      }
    ]
  },
  {
    ageGroup: "4 mois",
    vaccines: [
      {
        name: "Hexavalent (DTP-Coqueluche-Hib-Hépatite B)",
        description: "Deuxième dose du vaccin hexavalent",
        mandatory: true
      },
      {
        name: "Pneumocoque",
        description: "Deuxième dose du vaccin contre le pneumocoque",
        mandatory: true
      },
      {
        name: "Rotavirus",
        description: "Deuxième dose du vaccin contre les gastro-entérites à rotavirus",
        mandatory: false
      }
    ]
  },
  {
    ageGroup: "5 mois",
    vaccines: [
      {
        name: "Méningocoque B",
        description: "Première dose du vaccin contre le méningocoque B",
        mandatory: false
      }
    ]
  },
  {
    ageGroup: "11 mois",
    vaccines: [
      {
        name: "Hexavalent (DTP-Coqueluche-Hib-Hépatite B)",
        description: "Troisième dose du vaccin hexavalent",
        mandatory: true
      },
      {
        name: "Pneumocoque",
        description: "Troisième dose du vaccin contre le pneumocoque",
        mandatory: true
      },
      {
        name: "Méningocoque B",
        description: "Deuxième dose du vaccin contre le méningocoque B",
        mandatory: false
      }
    ]
  },
  {
    ageGroup: "12 mois",
    vaccines: [
      {
        name: "ROR",
        description: "Première dose du vaccin contre la rougeole, les oreillons et la rubéole",
        mandatory: true
      },
      {
        name: "Méningocoque C",
        description: "Deuxième dose du vaccin contre le méningocoque de type C",
        mandatory: true
      }
    ]
  },
  {
    ageGroup: "16-18 mois",
    vaccines: [
      {
        name: "Méningocoque B",
        description: "Troisième dose du vaccin contre le méningocoque B",
        mandatory: false
      }
    ]
  }
];
