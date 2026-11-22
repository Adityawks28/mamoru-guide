// plan-model.ts: typed shape for the v2 emergency plan

// The nine 特定原材料 (mandatory allergen labeling) of 消費者庁, April 2026.
export type FoodAllergen =
  | 'ebi' | 'kashu' | 'kani' | 'kurumi' | 'komugi' | 'soba' | 'tamago' | 'nyu' | 'rakkasei';
export type DietNeed = 'halal' | 'vegetarian' | 'vegan' | 'no-pork' | 'no-beef' | 'no-alcohol';

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

export interface PlanNeeds {
  foodAllergies:  FoodAllergen[];
  otherAllergies: string;
  medicines:      string;
  diet:           DietNeed[];
  dietOther:      string;
  languages:      string[]; // keys of NEED_LANGUAGES
  languagesOther: string;
  contactName:    string;
  contactRelation: string;  // key of CONTACT_RELATIONS, or ''
  contactPhone:   string;
  notes:          string;
}

export interface EmergencyPlan {
  version:   2;
  profile:   PlanProfile;
  medical:   PlanMedical;
  contacts:  PlanContacts;
  shelters:  PlanShelters;
  supplies:  PlanSupplies;
  documents: PlanDocuments;
  needs:     PlanNeeds;
  notes:     string;
  legacy:    Record<string, string>; // unmapped v1 fields, never discarded
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
    needs:     emptyNeeds(),
    notes:     '',
    legacy:    {},
  };
}

export function emptyNeeds(): PlanNeeds {
  return {
    foodAllergies: [], otherAllergies: '', medicines: '',
    diet: [], dietOther: '',
    languages: [], languagesOther: '',
    contactName: '', contactRelation: '', contactPhone: '',
    notes: '',
  };
}

export function hasNeeds(n: PlanNeeds): boolean {
  return Object.values(n).some(v => (Array.isArray(v) ? v.length > 0 : v.trim() !== ''));
}
