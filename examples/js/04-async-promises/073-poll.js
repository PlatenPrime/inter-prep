/**
 * 073 — poll
 * @tags async
 * @difficulty medium
 *
 * poll(fn, intervalMs): опрашивай пока fn() !== true.
 */

export async function poll(fn, intervalMs, maxAttempts = 100) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await fn()) return true;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  let n = 0;
  const ok = await poll(async () => ++n >= 2, 1);
  assert(ok === true);
  console.log('073-poll: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
