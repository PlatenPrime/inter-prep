/**
 * 001 — typeof detailed
 * @tags types
 * @difficulty easy
 *
 * Верни расширенный type tag: null, array, date, иначе typeof.
 */

export function typeofDetailed(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  return typeof value;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(typeofDetailed(null) === 'null');
  assert(typeofDetailed([]) === 'array');
  assert(typeofDetailed(new Date()) === 'date');
  assert(typeofDetailed(42) === 'number');
  console.log('001-typeof-detailed: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
