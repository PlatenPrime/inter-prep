/**
 * 026 — compose
 * @tags closures
 * @difficulty easy
 *
 * compose(...fns): композиция справа налево.
 */

export function compose(...fns) {
  return (x) => fns.reduceRight((v, fn) => fn(v), x);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const f = compose((x) => x + 1, (x) => x * 2);
  assert(f(3) === 7);
  console.log('026-compose: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
