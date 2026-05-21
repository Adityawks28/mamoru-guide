const STORAGE_KEY = 'a11y-reduced-motion';
const MEDIA_QUERY = '(prefers-reduced-motion: reduce)';

export function motionAllowed(): boolean {
  if (typeof window === 'undefined') return true;
  const mql = window.matchMedia(MEDIA_QUERY);
  if (mql.matches) return false;
  if (localStorage.getItem(STORAGE_KEY) === 'true') return false;
  return true;
}

export function onMotionChange(cb: (allowed: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia(MEDIA_QUERY);
  const onMql = () => cb(motionAllowed());
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb(motionAllowed());
  };
  mql.addEventListener('change', onMql);
  window.addEventListener('storage', onStorage);
  return () => {
    mql.removeEventListener('change', onMql);
    window.removeEventListener('storage', onStorage);
  };
}
