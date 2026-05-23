/**
 * 004 — loose equal
 * @tags types, coercion
 * @difficulty medium
 *
 * Реализуй == без использования оператора ==.
 */

export function looseEqual(a, b) {
  if (a === b) return true;
  if (a === null && b === undefined) return true;
  if (a === undefined && b === null) return true;
  if (a == null || b == null) return a === b;
  const ta = typeof a;
  const tb = typeof b;
  if (ta === 'number' || tb === 'number') {
    return Number(a) === Number(b);
  }
  if (ta === 'string' || tb === 'string') {
    return String(a) === String(b);
  }
  if (ta === 'boolean' || tb === 'boolean') {
    return Number(a) === Number(b);
  }
  if (ta === 'object' && tb === 'object') {
    return false;
  }
  return false;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(looseEqual(1, '1') === true);
  assert(looseEqual(null, undefined) === true);
  assert(looseEqual(0, false) === true);
  assert(looseEqual({}, {}) === false);
  console.log('004-loose-equal: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
