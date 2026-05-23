/**
 * 033 — retry sync
 * @tags closures
 * @difficulty medium
 *
 * retrySync(fn, times): повтори синхронную fn до успеха.
 */

export function retrySync(fn, times) {
  let lastError;
  for (let i = 0; i < times; i++) {
    try {
      return fn();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  let n = 0;
  const v = retrySync(() => { if (++n < 3) throw new Error('fail'); return 'ok'; }, 5);
  assert(v === 'ok' && n === 3);
  console.log('033-retry-sync: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
