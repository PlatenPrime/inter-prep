/**
 * 020 — debounce leading
 * @tags closures
 * @difficulty medium
 *
 * debounce с опцией { leading: true } — первый вызов сразу.
 */

export function debounceLeading(fn, wait, { leading = false } = {}) {
  let timer;
  return function (...args) {
    const callNow = leading && !timer;
    clearTimeout(timer);
    timer = setTimeout(() => { timer = null; }, wait);
    if (callNow) fn.apply(this, args);
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(typeof debounceLeading(() => {}, 10, { leading: true }) === 'function');
  console.log('020-debounce-leading: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
