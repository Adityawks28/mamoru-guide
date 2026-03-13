const PLAN_STORAGE_KEY = 'mamoru-emergency-plan';

function loadPlan() {
  try {
    return JSON.parse(localStorage.getItem(PLAN_STORAGE_KEY)) || {};
  } catch { return {}; }
}

function savePlan() {
  const form = document.getElementById('emergencyPlanForm');
  if (!form) return;
  const data = {};
  form.querySelectorAll('input, textarea, select').forEach(el => {
    data[el.name] = el.value;
  });
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(data));
  showToast('Plan saved!');
}

function restorePlan() {
  const data = loadPlan();
  const form = document.getElementById('emergencyPlanForm');
  if (!form) return;
  Object.entries(data).forEach(([key, value]) => {
    const el = form.querySelector(`[name="${key}"]`);
    if (el) el.value = value;
  });
}

function clearPlan() {
  if (!confirm('Clear your emergency plan? This cannot be undone.\n避難計画を消去しますか？\nHapus rencana darurat Anda?')) return;
  localStorage.removeItem(PLAN_STORAGE_KEY);
  const form = document.getElementById('emergencyPlanForm');
  if (form) form.reset();
  showToast('Plan cleared');
}

function printPlan() {
  window.print();
}

function initEmergencyPlan() {
  restorePlan();
  const form = document.getElementById('emergencyPlanForm');
  if (!form) return;
  // Auto-save on input change (debounced)
  let saveTimer;
  form.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(savePlan, 1000);
  });
}
