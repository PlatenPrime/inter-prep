/**
 * 143 — storage wrapper
 * @tags dom
 * @difficulty easy
 *
 * createStorage(backend): get/set JSON.
 */

export function createStorage(store = new Map()) {
  return {
    get(key, fallback = null) {
      const raw = store.get(key);
      if (raw == null) return fallback;
      try { return JSON.parse(raw); } catch { return fallback; }
    },
    set(key, value) {
      store.set(key, JSON.stringify(value));
    },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const s = createStorage();
  s.set('a', { x: 1 });
  assert(s.get('a').x === 1);
  console.log('143-storage-wrapper: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
