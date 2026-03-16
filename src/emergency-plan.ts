import { showToast } from './toast';

const PLAN_STORAGE_KEY = 'mamoru-emergency-plan';

function loadPlan(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(PLAN_STORAGE_KEY) || '{}');
  } catch { return {}; }
}

export function savePlan(): void {
  const form = document.getElementById('emergencyPlanForm');
  if (!form) return;
  const data: Record<string, string> = {};
  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select').forEach(el => {
    data[el.name] = el.value;
  });
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(data));
  showToast('Plan saved!');
}

function restorePlan(): void {
  const data = loadPlan();
  const form = document.getElementById('emergencyPlanForm');
  if (!form) return;
  Object.entries(data).forEach(([key, value]) => {
    const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[name="${key}"]`);
    if (el) el.value = value;
  });
}

export function clearPlan(): void {
  if (!confirm('Clear your emergency plan? This cannot be undone.\n避難計画を消去しますか？\nHapus rencana darurat Anda?')) return;
  localStorage.removeItem(PLAN_STORAGE_KEY);
  const form = document.getElementById('emergencyPlanForm') as HTMLFormElement | null;
  if (form) form.reset();
  showToast('Plan cleared');
}

export function printPlan(): void {
  document.body.classList.add('print-plan-only');
  window.print();
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-plan-only');
  }, { once: true });
}

export function initEmergencyPlan(): void {
  restorePlan();
  const form = document.getElementById('emergencyPlanForm');
  if (!form) return;
  let saveTimer: ReturnType<typeof setTimeout>;
  form.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(savePlan, 1000);
  });
}
