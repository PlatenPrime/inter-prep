/**
 * 055 — property descriptor
 * @tags prototypes
 * @difficulty easy
 *
 * Получи descriptor свойства или null.
 */

export function propertyDescriptor(obj, key) {
  return Object.getOwnPropertyDescriptor(obj, key) ?? null;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const d = propertyDescriptor({ a: 1 }, 'a');
  assert(d && d.value === 1);
  console.log('055-property-descriptor: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
