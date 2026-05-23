/**
 * 062 — sequence
 * @tags async
 * @difficulty medium
 *
 * sequence(tasks): выполни async-функции по очереди.
 */

export async function sequence(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  const r = await sequence([() => Promise.resolve(1), () => Promise.resolve(2)]);
  assert(r.join() === '1,2');
  console.log('062-sequence: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
