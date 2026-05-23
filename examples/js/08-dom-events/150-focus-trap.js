/**
 * 150 — focus trap
 * @tags dom, a11y
 * @difficulty medium
 *
 * getFocusOrder(elements, current, direction): следующий индекс.
 */

export function getFocusOrder(length, current, direction = 1) {
  if (!length) return -1;
  return (current + direction + length) % length;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(getFocusOrder(3, 2, 1) === 0);
  assert(getFocusOrder(3, 0, -1) === 2);
  console.log('150-focus-trap: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
