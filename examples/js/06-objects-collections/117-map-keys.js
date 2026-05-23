/**
 * 117 — mapKeys
 * @tags objects
 * @difficulty easy
 *
 * mapKeys(obj, fn).
 */

export function mapKeys(obj, fn) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [fn(k, v), v]));
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(mapKeys({ a: 1 }, (k) => k.toUpperCase()).A === 1);
  console.log('117-map-keys: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
