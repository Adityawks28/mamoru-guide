let toastTimer: ReturnType<typeof setTimeout>;

export type ToastType = 'success' | 'error' | 'warn' | 'info';

const TYPE_CLASSES = ['toast--success', 'toast--error', 'toast--warn', 'toast--info'];

export function showToast(msg: string, type: ToastType = 'success'): void {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove(...TYPE_CLASSES);
  t.classList.add('toast--' + type, 'show');
  clearTimeout(toastTimer);
  // Errors/warnings persist longer so users (and screen readers) don't miss them.
  const duration = type === 'error' || type === 'warn' ? 5000 : 2200;
  toastTimer = setTimeout(() => t.classList.remove('show'), duration);
}
