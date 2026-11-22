import { getItem, setItem, removeItem } from './storage';
import { EmergencyPlan, PlanNeeds, emptyPlan, emptyNeeds } from './plan-model';
import { FOOD_ALLERGENS, DIET_NEEDS, NEED_LANGUAGES, CONTACT_RELATIONS } from './data/needs';

function pickKeys<T extends string>(raw: unknown, options: readonly { key: string }[]): T[] {
  if (!Array.isArray(raw)) return [];
  const allowed = new Set(options.map(o => o.key));
  return [...new Set(raw.filter((v): v is T => typeof v === 'string' && allowed.has(v)))];
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '');

export function normalizeNeeds(raw: unknown): PlanNeeds {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return emptyNeeds();
  const r = raw as Record<string, unknown>;
  const relation = str(r.contactRelation);
  return {
    foodAllergies:   pickKeys(r.foodAllergies, FOOD_ALLERGENS),
    otherAllergies:  str(r.otherAllergies),
    medicines:       str(r.medicines),
    diet:            pickKeys(r.diet, DIET_NEEDS),
    dietOther:       str(r.dietOther),
    languages:       pickKeys(r.languages, NEED_LANGUAGES),
    languagesOther:  str(r.languagesOther),
    contactName:     str(r.contactName),
    contactRelation: CONTACT_RELATIONS.some(o => o.key === relation) ? relation : '',
    contactPhone:    str(r.contactPhone),
    notes:           str(r.notes),
  };
}

export function loadPlanV2(): EmergencyPlan {
  const raw = getItem('mamoru-plan-v2');
  if (!raw) return emptyPlan();
  try {
    const parsed = JSON.parse(raw) as EmergencyPlan;
    if (parsed.version !== 2) return emptyPlan();
    return { ...parsed, needs: normalizeNeeds(parsed.needs) };
  } catch { return emptyPlan(); }
}

export function savePlanV2(plan: EmergencyPlan): void {
  setItem('mamoru-plan-v2', JSON.stringify(plan));
}

export function clearPlanV2(): void {
  removeItem('mamoru-plan-v2');
}

export function migrateV1ToV2(): EmergencyPlan | null {
  const raw = getItem('mamoru-emergency-plan');
  if (!raw) return null;
  let v1: Record<string, string>;
  try { v1 = JSON.parse(raw) as Record<string, string>; }
  catch { return null; }

  const plan = emptyPlan();

  plan.profile.name          = v1['fullName']      ?? '';
  plan.profile.nameKana      = v1['nameKana']       ?? '';
  plan.profile.nationality   = v1['nationality']    ?? '';
  plan.profile.languages     = v1['languages']      ?? '';
  plan.profile.bloodType     = v1['bloodType']      ?? '';
  plan.profile.dob           = v1['dob']            ?? '';
  plan.profile.address       = v1['city']           ?? '';
  plan.profile.university    = v1['university']     ?? '';
  plan.profile.residenceCard = v1['residenceCard']  ?? '';
  plan.profile.insurance     = v1['insurance']      ?? '';

  plan.medical.conditions    = v1['medicalNotes']   ?? '';
  plan.medical.medications   = v1['medications']    ?? '';

  plan.shelters.primary      = v1['shelter1']       ?? '';
  plan.shelters.backup       = v1['shelter2']       ?? '';
  plan.shelters.highGround   = v1['highGround']     ?? '';
  plan.shelters.routeNotes   = v1['evacRoute']      ?? '';
  plan.shelters.meetingPoint = v1['meetingPoint']   ?? '';
  plan.shelters.walkTime     = v1['walkTime']       ?? '';

  plan.contacts.contact1     = v1['contact1']       ?? '';
  plan.contacts.contact2     = v1['contact2']       ?? '';
  plan.contacts.familyAbroad = v1['contactHome']    ?? '';
  plan.contacts.embassy      = v1['embassy']        ?? '';

  plan.supplies.supplyDays   = v1['supplyDays']     ?? '';
  plan.supplies.waterLiters  = v1['waterLiters']    ?? '';
  plan.supplies.foodList     = v1['foodList']       ?? '';
  plan.supplies.toolsList    = v1['toolsList']      ?? '';
  plan.supplies.bagLocation  = v1['bagLocation']    ?? '';

  plan.documents.copiedDocs  = v1['docsCopies']     ?? '';

  const MAPPED = new Set([
    'fullName','nameKana','nationality','languages','bloodType','dob',
    'city','university','residenceCard','insurance',
    'medicalNotes','medications',
    'shelter1','shelter2','highGround','evacRoute','meetingPoint','walkTime',
    'contact1','contact2','contactHome','embassy',
    'supplyDays','waterLiters','foodList','toolsList','bagLocation','docsCopies',
  ]);
  for (const [k, v] of Object.entries(v1)) {
    if (!MAPPED.has(k)) plan.legacy[k] = v;
  }
  return plan;
  // NOTE: does NOT remove v1 key, caller owns cleanup
}
