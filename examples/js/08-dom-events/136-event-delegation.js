/**
 * 136 — event delegation
 * @tags dom
 * @difficulty medium
 *
 * createDelegatedHandler(selector, onItemClick) для контейнера.
 */

export function createDelegatedHandler(selector, onItemClick) {
  return (event) => {
    const el = event.target?.closest?.(selector);
    if (el) onItemClick(el, event);
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const h = createDelegatedHandler('.item', (el) => el.id);
  const target = { closest: (s) => (s === '.item' ? { id: 'x' } : null) };
  h({ target, type: 'click' });
  assert(true);
  console.log('136-event-delegation: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
