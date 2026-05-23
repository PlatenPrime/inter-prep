/**
 * 074 — exponential backoff
 * @tags async
 * @difficulty easy
 *
 * backoffDelay(attempt, baseMs): экспоненциальная задержка.
 */

export function backoffDelay(attempt, baseMs = 100) {
  return baseMs * 2 ** attempt;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(backoffDelay(0) === 100);
  assert(backoffDelay(2) === 400);
  console.log('074-exponential-backoff: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
