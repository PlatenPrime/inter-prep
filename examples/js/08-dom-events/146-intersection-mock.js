/**
 * 146 — intersection mock
 * @tags dom
 * @difficulty easy
 *
 * getVisibleItems(items, viewportStart, viewportSize).
 */

export function getVisibleItems(items, start, size) {
  return items.slice(start, start + size);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(getVisibleItems([1, 2, 3, 4], 1, 2).join() === '2,3');
  console.log('146-intersection-mock: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
