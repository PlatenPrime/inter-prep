/**
 * 064 — retry async
 * @tags async
 * @difficulty medium
 *
 * retryAsync(fn, times): повтори async fn.
 */

export async function retryAsync(fn, times) {
  let lastError;
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
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

async function runTests() {
  let n = 0;
  const v = await retryAsync(async () => { if (++n < 2) throw new Error(); return 1; }, 3);
  assert(v === 1);
  console.log('064-retry-async: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
