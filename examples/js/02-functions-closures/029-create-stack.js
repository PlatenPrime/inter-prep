/**
 * 029 — create stack
 * @tags closures
 * @difficulty easy
 *
 * Stack API: push, pop, peek, size.
 */

export function createStack() {
  const items = [];
  return {
    push(v) { items.push(v); },
    pop() { return items.pop(); },
    peek() { return items[items.length - 1]; },
    get size() { return items.length; },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const s = createStack();
  s.push(1); s.push(2);
  assert(s.pop() === 2 && s.peek() === 1);
  console.log('029-create-stack: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
