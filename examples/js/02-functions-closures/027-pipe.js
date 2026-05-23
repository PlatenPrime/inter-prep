/**
 * 027 — pipe
 * @tags closures
 * @difficulty easy
 *
 * pipe(...fns): композиция слева направо.
 */

export function pipe(...fns) {
  return (x) => fns.reduce((v, fn) => fn(v), x);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const f = pipe((x) => x * 2, (x) => x + 1);
  assert(f(3) === 7);
  console.log('027-pipe: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
