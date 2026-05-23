/**
 * 044 — my new
 * @tags this
 * @difficulty medium
 *
 * Реализуй оператор new.
 */

export function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result !== null && typeof result === 'object' ? result : obj;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  function Person(name) { this.name = name; }
  Person.prototype.greet = function () { return this.name; };
  const p = myNew(Person, 'Ann');
  assert(p.name === 'Ann' && p.greet() === 'Ann');
  console.log('044-my-new: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
