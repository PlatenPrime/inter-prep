/**
 * 199 — pub sub
 * @tags patterns
 * @difficulty easy
 *
 * createPubSub(): publish/subscribe.
 */

export function createPubSub() {
  const subs = new Map();
  return {
    subscribe(topic, fn) {
      if (!subs.has(topic)) subs.set(topic, new Set());
      subs.get(topic).add(fn);
      return () => subs.get(topic)?.delete(fn);
    },
    publish(topic, data) {
      subs.get(topic)?.forEach((fn) => fn(data));
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
  const ps = createPubSub();
  let v = 0;
  ps.subscribe('t', (d) => { v = d; });
  ps.publish('t', 42);
  assert(v === 42);
  console.log('199-pub-sub: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
