/**
 * 192 — factory
 * @tags patterns
 * @difficulty easy
 *
 * createUserFactory(defaults).
 */

export function createUserFactory(defaults = {}) {
  return (overrides = {}) => ({ ...defaults, ...overrides, id: overrides.id ?? crypto.randomUUID?.() ?? String(Math.random()) });
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const create = createUserFactory({ role: 'user' });
  const u = create({ name: 'Ann' });
  assert(u.role === 'user' && u.name === 'Ann');
  console.log('192-factory: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
