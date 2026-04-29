import { describe, it, expect, beforeEach } from 'vitest';
import { loadPlanV2, savePlanV2, clearPlanV2, migrateV1ToV2 } from '../plan-storage';
import { emptyPlan } from '../plan-model';

beforeEach(() => {
  localStorage.removeItem('mamoru-plan-v2');
  localStorage.removeItem('mamoru-emergency-plan');
});

// ─── loadPlanV2 ────────────────────────────────────────────────────────────

describe('loadPlanV2()', () => {
  it('returns emptyPlan() when nothing is stored', () => {
    expect(loadPlanV2()).toEqual(emptyPlan());
  });

  it('returns emptyPlan() on corrupt JSON', () => {
    localStorage.setItem('mamoru-plan-v2', '{bad json');
    expect(loadPlanV2()).toEqual(emptyPlan());
  });

  it('returns emptyPlan() when stored object has wrong version', () => {
    localStorage.setItem('mamoru-plan-v2', JSON.stringify({ version: 1, profile: {} }));
    expect(loadPlanV2()).toEqual(emptyPlan());
  });

  it('returns the saved plan on a clean round-trip', () => {
    const plan = emptyPlan();
    plan.profile.name = 'Aditya';
    savePlanV2(plan);
    expect(loadPlanV2().profile.name).toBe('Aditya');
  });
});

// ─── savePlanV2 + loadPlanV2 round-trip ────────────────────────────────────

describe('savePlanV2() + loadPlanV2() round-trip', () => {
  it('preserves all sub-interface fields', () => {
    const plan = emptyPlan();
    plan.profile.name          = 'Aditya';
    plan.profile.nameKana      = 'アディティヤ';
    plan.profile.bloodType     = 'O+';
    plan.profile.address       = 'Kobe-shi, Chuo-ku';
    plan.medical.conditions    = 'Peanut allergy';
    plan.medical.medications   = 'Ventolin';
    plan.shelters.primary      = 'Higashi Park';
    plan.shelters.backup       = 'Ward Office';
    plan.shelters.routeNotes   = 'North on Flower Road';
    plan.contacts.contact1     = 'Mom: +62-812-xxx';
    plan.contacts.embassy      = 'KJRI Osaka';
    plan.contacts.familyAbroad = 'Dad: +62-811-xxx';
    plan.supplies.supplyDays   = '3';
    plan.supplies.waterLiters  = '6';
    plan.supplies.foodList     = 'Canned tuna × 4';
    plan.documents.copiedDocs  = 'both';
    plan.notes                 = 'Keep calm';
    plan.legacy['toBuyList']   = 'buy gloves';

    savePlanV2(plan);
    const loaded = loadPlanV2();

    expect(loaded.version).toBe(2);
    expect(loaded.profile.name).toBe('Aditya');
    expect(loaded.profile.nameKana).toBe('アディティヤ');
    expect(loaded.profile.bloodType).toBe('O+');
    expect(loaded.profile.address).toBe('Kobe-shi, Chuo-ku');
    expect(loaded.medical.conditions).toBe('Peanut allergy');
    expect(loaded.medical.medications).toBe('Ventolin');
    expect(loaded.shelters.primary).toBe('Higashi Park');
    expect(loaded.shelters.backup).toBe('Ward Office');
    expect(loaded.shelters.routeNotes).toBe('North on Flower Road');
    expect(loaded.contacts.contact1).toBe('Mom: +62-812-xxx');
    expect(loaded.contacts.embassy).toBe('KJRI Osaka');
    expect(loaded.contacts.familyAbroad).toBe('Dad: +62-811-xxx');
    expect(loaded.supplies.supplyDays).toBe('3');
    expect(loaded.supplies.waterLiters).toBe('6');
    expect(loaded.supplies.foodList).toBe('Canned tuna × 4');
    expect(loaded.documents.copiedDocs).toBe('both');
    expect(loaded.notes).toBe('Keep calm');
    expect(loaded.legacy['toBuyList']).toBe('buy gloves');
  });
});

// ─── migrateV1ToV2 ─────────────────────────────────────────────────────────

describe('migrateV1ToV2()', () => {
  it('returns null when no v1 key exists', () => {
    expect(migrateV1ToV2()).toBeNull();
  });

  it('returns null on corrupt v1 JSON', () => {
    localStorage.setItem('mamoru-emergency-plan', '{bad');
    expect(migrateV1ToV2()).toBeNull();
  });

  it('maps all known v1 fields to correct v2 paths', () => {
    localStorage.setItem('mamoru-emergency-plan', JSON.stringify({
      fullName: 'Aditya',
      nameKana: 'アディティヤ',
      bloodType: 'O+',
      city: 'Kobe',
      medicalNotes: 'Peanut allergy',
      shelter1: 'Higashi Park',
      shelter2: 'Ward Office',
      evacRoute: 'North on Flower Road',
      contactHome: 'Dad: +62-811-xxx',
      embassy: 'KJRI Osaka',
      docsCopies: 'both',
      supplyDays: '3',
      bagLocation: 'Genkan',
    }));
    const plan = migrateV1ToV2()!;
    expect(plan.profile.name).toBe('Aditya');
    expect(plan.profile.nameKana).toBe('アディティヤ');
    expect(plan.profile.bloodType).toBe('O+');
    expect(plan.profile.address).toBe('Kobe');
    expect(plan.medical.conditions).toBe('Peanut allergy');
    expect(plan.shelters.primary).toBe('Higashi Park');
    expect(plan.shelters.backup).toBe('Ward Office');
    expect(plan.shelters.routeNotes).toBe('North on Flower Road');
    expect(plan.contacts.familyAbroad).toBe('Dad: +62-811-xxx');
    expect(plan.contacts.embassy).toBe('KJRI Osaka');
    expect(plan.documents.copiedDocs).toBe('both');
    expect(plan.supplies.supplyDays).toBe('3');
    expect(plan.supplies.bagLocation).toBe('Genkan');
  });

  it('puts unmapped fields in the legacy bucket', () => {
    localStorage.setItem('mamoru-emergency-plan', JSON.stringify({
      toBuyList: 'buy gloves',
      mysterField: 'unknown value',
      fullName: 'Aditya',
    }));
    const plan = migrateV1ToV2()!;
    expect(plan.legacy['toBuyList']).toBe('buy gloves');
    expect(plan.legacy['mysterField']).toBe('unknown value');
    expect(plan.legacy['fullName']).toBeUndefined();
  });

  it('result has version === 2', () => {
    localStorage.setItem('mamoru-emergency-plan', JSON.stringify({ fullName: 'X' }));
    expect(migrateV1ToV2()!.version).toBe(2);
  });

  it('does NOT remove the v1 key from localStorage', () => {
    localStorage.setItem('mamoru-emergency-plan', JSON.stringify({ fullName: 'X' }));
    migrateV1ToV2();
    expect(localStorage.getItem('mamoru-emergency-plan')).not.toBeNull();
  });
});

// ─── clearPlanV2 ───────────────────────────────────────────────────────────

describe('clearPlanV2()', () => {
  it('removes the v2 plan from storage', () => {
    savePlanV2(emptyPlan());
    clearPlanV2();
    expect(localStorage.getItem('mamoru-plan-v2')).toBeNull();
    expect(loadPlanV2()).toEqual(emptyPlan());
  });
});
