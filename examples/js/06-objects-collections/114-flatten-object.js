/**
 * 114 — flatten object
 * @tags objects
 * @difficulty medium
 *
 * flatten({ a: { b: 1 } }) → { "a.b": 1 }.
 */

export function flattenObject(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flattenObject(v, key));
    else out[key] = v;
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
  assert(flattenObject({ a: { b: 1 } })['a.b'] === 1);
  console.log('114-flatten-object: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
