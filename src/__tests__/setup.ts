const store = new Map<string, string>();

const testLocalStorage: Storage = {
  get length() {
    return store.size;
  },
  clear() {
    store.clear();
  },
  getItem(key: string) {
    return store.has(key) ? store.get(key)! : null;
  },
  key(index: number) {
    return Array.from(store.keys())[index] ?? null;
  },
  removeItem(key: string) {
    store.delete(key);
  },
  setItem(key: string, value: string) {
    store.set(key, String(value));
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: testLocalStorage,
  configurable: true,
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: testLocalStorage,
    configurable: true,
  });
}
