/**
 * 137 — event emitter
 * @tags dom, patterns
 * @difficulty medium
 *
 * EventEmitter: on, off, emit.
 */

export function createEventEmitter() {
  const map = new Map();
  return {
    on(event, fn) {
      if (!map.has(event)) map.set(event, new Set());
      map.get(event).add(fn);
      return () => this.off(event, fn);
    },
    off(event, fn) {
      map.get(event)?.delete(fn);
    },
    emit(event, ...args) {
      map.get(event)?.forEach((fn) => fn(...args));
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
  const ee = createEventEmitter();
  let v = 0;
  ee.on('x', (n) => { v = n; });
  ee.emit('x', 5);
  assert(v === 5);
  console.log('137-event-emitter: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
