/**
 * 069 — debounce async
 * @tags async
 * @difficulty medium
 *
 * debounceAsync(fn, wait): debounce для async fn.
 */

export function debounceAsync(fn, wait) {
  let timer;
  return function (...args) {
    return new Promise((resolve, reject) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        Promise.resolve(fn.apply(this, args)).then(resolve, reject);
      }, wait);
    });
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  assert(typeof debounceAsync(async () => 1, 0) === 'function');
  console.log('069-debounce-async: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
