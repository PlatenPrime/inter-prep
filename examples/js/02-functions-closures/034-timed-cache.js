/**
 * 034 — timed cache
 * @tags closures
 * @difficulty medium
 *
 * get(key) / set(key, val, ttlMs): кэш с TTL.
 */

export function timedCache() {
  const store = new Map();
  return {
    get(key) {
      const entry = store.get(key);
      if (!entry) return undefined;
      if (Date.now() > entry.expires) {
        store.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set(key, value, ttlMs) {
      store.set(key, { value, expires: Date.now() + ttlMs });
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
  const c = timedCache();
  c.set('a', 1, 10000);
  assert(c.get('a') === 1);
  console.log('034-timed-cache: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
