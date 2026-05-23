/**
 * 197 — rate limiter
 * @tags patterns
 * @difficulty medium
 *
 * createRateLimiter(max, windowMs): tryAcquire().
 */

export function createRateLimiter(max, windowMs) {
  const timestamps = [];
  return {
    tryAcquire() {
      const now = Date.now();
      while (timestamps.length && timestamps[0] <= now - windowMs) timestamps.shift();
      if (timestamps.length >= max) return false;
      timestamps.push(now);
      return true;
    },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const rl = createRateLimiter(2, 10000);
  assert(rl.tryAcquire() && rl.tryAcquire() && !rl.tryAcquire());
  console.log('197-rate-limiter: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
