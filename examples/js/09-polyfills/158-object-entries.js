/**
 * 158 — object entries
 * @tags polyfills
 * @difficulty easy
 *
 * Object.entries / values.
 */

export function objectEntries(obj) {
  return Object.keys(obj).map((k) => [k, obj[k]]);
}

export function objectValues(obj) {
  return objectEntries(obj).map(([, v]) => v);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(objectEntries({ a: 1 })[0][1] === 1);
  assert(objectValues({ a: 1 })[0] === 1);
  console.log('158-object-entries: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
