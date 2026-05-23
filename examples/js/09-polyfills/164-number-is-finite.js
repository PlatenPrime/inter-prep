/**
 * 164 — number isFinite
 * @tags polyfills
 * @difficulty easy
 *
 * Number.isFinite polyfill.
 */

export function numberIsFinite(value) {
  return typeof value === 'number' && isFinite(value);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(numberIsFinite(1) === true);
  assert(numberIsFinite('1') === false);
  console.log('164-number-is-finite: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
