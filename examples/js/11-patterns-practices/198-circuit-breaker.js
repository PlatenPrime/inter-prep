/**
 * 198 — circuit breaker
 * @tags patterns
 * @difficulty medium
 *
 * createCircuitBreaker(fn, { threshold, resetMs }).
 */

export function createCircuitBreaker(fn, { threshold = 3, resetMs = 1000 } = {}) {
  let failures = 0;
  let openUntil = 0;
  return async function (...args) {
    if (Date.now() < openUntil) throw new Error('Circuit open');
    try {
      const result = await fn(...args);
      failures = 0;
      return result;
    } catch (e) {
      failures++;
      if (failures >= threshold) openUntil = Date.now() + resetMs;
      throw e;
    }
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  let n = 0;
  const fn = createCircuitBreaker(async () => { if (++n < 4) throw new Error('fail'); return 'ok'; }, { threshold: 2, resetMs: 1 });
  try { await fn(); } catch {}
  try { await fn(); } catch {}
  try { await fn(); assert(false); } catch (e) { assert(e.message === 'Circuit open'); }
  console.log('198-circuit-breaker: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
