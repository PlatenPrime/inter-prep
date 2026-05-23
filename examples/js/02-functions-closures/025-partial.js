/**
 * 025 — partial
 * @tags closures
 * @difficulty easy
 *
 * partial(fn, ...preset): частичное применение аргументов.
 */

export function partial(fn, ...preset) {
  return (...args) => fn(...preset, ...args);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const add = partial((a, b, c) => a + b + c, 1, 2);
  assert(add(3) === 6);
  console.log('025-partial: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
