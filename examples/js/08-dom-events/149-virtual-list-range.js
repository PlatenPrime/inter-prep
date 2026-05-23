/**
 * 149 — virtual list range
 * @tags dom
 * @difficulty easy
 *
 * virtualListRange(items, start, size).
 */

export function virtualListRange(items, start, size) {
  return { items: items.slice(start, start + size), start, end: start + size };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(virtualListRange([1, 2, 3, 4], 1, 2).items.join() === '2,3');
  console.log('149-virtual-list-range: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
