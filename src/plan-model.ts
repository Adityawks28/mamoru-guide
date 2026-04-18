// plan-model.ts — typed shape for the v2 emergency plan

export interface PlanProfile {
  name:          string;
  nameKana:      string;
  nationality:   string;
  languages:     string;
  bloodType:     string;
  dob:           string;
  address:       string;
  university:    string;
  residenceCard: string;
  insurance:     string;
}

export interface PlanMedical {
  conditions: string; // conditions + allergies combined
  medications: string;
}

export interface PlanContacts {
  contact1:     string;
  contact2:     string;
  familyAbroad: string;
  embassy:      string;
}

export interface PlanShelters {
  primary:     string;
  backup:      string;
  highGround:  string;
  meetingPoint: string;
  walkTime:    string;
  routeNotes:  string;
}

export interface PlanSupplies {
  supplyDays:  string;
  waterLiters: string;
  foodList:    string;
  toolsList:   string;
  bagLocation: string;
}

export interface PlanDocuments {
  copiedDocs:      string;
  storageLocation: string;
}

export interface EmergencyPlan {
  version:   2;
  profile:   PlanProfile;
  medical:   PlanMedical;
  contacts:  PlanContacts;
  shelters:  PlanShelters;
  supplies:  PlanSupplies;
  documents: PlanDocuments;
  notes:     string;
  legacy:    Record<string, string>; // unmapped v1 fields — never discarded
}

export function emptyPlan(): EmergencyPlan {
  return {
    version: 2,
    profile:   { name: '', nameKana: '', nationality: '', languages: '', bloodType: '', dob: '', address: '', university: '', residenceCard: '', insurance: '' },
    medical:   { conditions: '', medications: '' },
    contacts:  { contact1: '', contact2: '', familyAbroad: '', embassy: '' },
    shelters:  { primary: '', backup: '', highGround: '', meetingPoint: '', walkTime: '', routeNotes: '' },
    supplies:  { supplyDays: '', waterLiters: '', foodList: '', toolsList: '', bagLocation: '' },
    documents: { copiedDocs: '', storageLocation: '' },
    notes:     '',
    legacy:    {},
  };
}
