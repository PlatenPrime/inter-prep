/**
 * 159 — object fromEntries
 * @tags polyfills
 * @difficulty easy
 *
 * Object.fromEntries polyfill.
 */

export function objectFromEntries(entries) {
  const o = {};
  for (const [k, v] of entries) o[k] = v;
  return o;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(objectFromEntries([['a', 1]]).a === 1);
  console.log('159-object-from-entries: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
