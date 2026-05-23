/**
 * 056 — delay
 * @tags async
 * @difficulty easy
 *
 * delay(ms): Promise, резолвится через ms.
 */

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  const t = Date.now();
  await delay(5);
  assert(Date.now() - t >= 4);
  console.log('056-delay: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
