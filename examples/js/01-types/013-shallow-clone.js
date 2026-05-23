/**
 * 013 — shallow clone
 * @tags types
 * @difficulty easy
 *
 * Поверхностное копирование объекта или массива.
 */

export function shallowClone(value) {
  if (Array.isArray(value)) return [...value];
  if (value !== null && typeof value === 'object') return { ...value };
  return value;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const o = { a: 1 };
  const c = shallowClone(o);
  assert(c !== o && c.a === 1);
  const arr = [1, 2];
  assert(shallowClone(arr).join() === '1,2');
  console.log('013-shallow-clone: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
