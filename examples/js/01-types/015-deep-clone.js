/**
 * 015 — deep clone
 * @tags types
 * @difficulty medium
 *
 * Deep clone объектов/массивов/Date (lite, без циклов).
 */

export function deepClone(value) {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value.getTime());
  if (Array.isArray(value)) return value.map(deepClone);
  const out = {};
  for (const key of Object.keys(value)) {
    out[key] = deepClone(value[key]);
  }
  return out;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const d = new Date('2020-01-01');
  const o = { a: [1], d };
  const c = deepClone(o);
  assert(c !== o && c.a !== o.a);
  assert(c.d.getTime() === d.getTime());
  console.log('015-deep-clone: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
