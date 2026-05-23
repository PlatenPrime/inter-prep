/**
 * 119 — fromEntries
 * @tags objects
 * @difficulty easy
 *
 * Object.fromEntries polyfill.
 */

export function fromEntries(entries) {
  const obj = {};
  for (const [k, v] of entries) obj[k] = v;
  return obj;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(fromEntries([['a', 1]]).a === 1);
  console.log('119-from-entries: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
