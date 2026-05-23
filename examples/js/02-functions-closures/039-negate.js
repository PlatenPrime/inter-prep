/**
 * 039 — negate
 * @tags closures
 * @difficulty easy
 *
 * negate(pred): инвертируй предикат.
 */

export function negate(pred) {
  return (...args) => !pred(...args);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const isEven = (n) => n % 2 === 0;
  assert(negate(isEven)(3) === true);
  console.log('039-negate: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
