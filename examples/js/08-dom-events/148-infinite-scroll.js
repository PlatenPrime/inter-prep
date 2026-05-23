/**
 * 148 — infinite scroll
 * @tags dom
 * @difficulty easy
 *
 * shouldLoadMore(scrollTop, clientHeight, scrollHeight, threshold).
 */

export function shouldLoadMore(scrollTop, clientHeight, scrollHeight, threshold = 100) {
  return scrollTop + clientHeight >= scrollHeight - threshold;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(shouldLoadMore(900, 100, 1000, 50) === true);
  console.log('148-infinite-scroll: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
