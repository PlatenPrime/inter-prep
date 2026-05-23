/**
 * 037 — make iterable
 * @tags closures
 * @difficulty medium
 *
 * Объект с Symbol.iterator по массиву items.
 */

export function makeIterable(items) {
  return {
    [Symbol.iterator]() {
      let i = 0;
      return {
        next() {
          if (i < items.length) return { value: items[i++], done: false };
          return { done: true };
        },
      };
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
  assert([...makeIterable([1, 2])].join() === '1,2');
  console.log('037-make-iterable: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
