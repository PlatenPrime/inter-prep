/**
 * 076 — waterfall
 * @tags async
 * @difficulty medium
 *
 * waterfall(tasks, initial): цепочка async (value) => value.
 */

export async function waterfall(tasks, initial) {
  let value = initial;
  for (const task of tasks) {
    value = await task(value);
  }
  return value;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  const r = await waterfall([(v) => v + 1, async (v) => v * 2], 1);
  assert(r === 4);
  console.log('076-waterfall: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
