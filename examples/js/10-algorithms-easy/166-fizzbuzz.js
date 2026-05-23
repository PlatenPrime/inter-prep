/**
 * 166 — fizzbuzz
 * @tags algorithms
 * @difficulty easy
 *
 * fizzbuzz(n): массив строк 1..n.
 */

export function fizzbuzz(n) {
  return Array.from({ length: n }, (_, i) => {
    const x = i + 1;
    if (x % 15 === 0) return 'FizzBuzz';
    if (x % 3 === 0) return 'Fizz';
    if (x % 5 === 0) return 'Buzz';
    return String(x);
  });
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(fizzbuzz(5).join() === '1,2,Fizz,4,Buzz');
  console.log('166-fizzbuzz: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
