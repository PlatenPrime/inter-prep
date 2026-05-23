/**
 * 190 — lru cache
 * @tags algorithms
 * @difficulty medium
 *
 * createLRU(capacity): get/set O(1) amortized.
 */

export function createLRU(capacity) {
  const map = new Map();
  return {
    get(key) {
      if (!map.has(key)) return -1;
      const v = map.get(key);
      map.delete(key);
      map.set(key, v);
      return v;
    },
    set(key, value) {
      if (map.has(key)) map.delete(key);
      map.set(key, value);
      if (map.size > capacity) {
        const first = map.keys().next().value;
        map.delete(first);
      }
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
  const lru = createLRU(2);
  lru.set(1, 1); lru.set(2, 2);
  assert(lru.get(1) === 1);
  lru.set(3, 3);
  assert(lru.get(2) === -1);
  console.log('190-lru-cache: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
