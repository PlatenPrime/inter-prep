/**
 * 138 — once listener
 * @tags dom
 * @difficulty easy
 *
 * onOnce(emitter, event, fn).
 */

export function onOnce(emitter, event, fn) {
  const wrapper = (...args) => {
    emitter.off(event, wrapper);
    fn(...args);
  };
  emitter.on(event, wrapper);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const ee = createEventEmitter();
  let c = 0;
  onOnce(ee, 'e', () => c++);
  ee.emit('e'); ee.emit('e');
  assert(c === 1);

  function createEventEmitter() {
    const map = new Map();
    return {
      on(event, fn) { (map.get(event) ?? map.set(event, new Set()).get(event)).add(fn); },
      off(event, fn) { map.get(event)?.delete(fn); },
      emit(event, ...args) { map.get(event)?.forEach((fn) => fn(...args)); },
    };
  }
  console.log('138-once-listener: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
