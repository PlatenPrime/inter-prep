/**
 * 087 — Private fields (#)
 * @tags classes, private
 * @difficulty medium
 *
 * ## Теория
 * Синтаксис #field — настоящая приватность в runtime (WeakMap под капотом в старых движках). TypeScript private — только compile-time. # нельзя обратиться снаружи даже в JS.
 *
 * ## На собеседовании
 * private keyword vs #. Доступ из subclass к # — нет, только protected для наследования логики через методы.
 *
 * ## Связанные темы
 * access modifiers, encapsulation.
 */

export class SecretHolder {
  #secret: string;

  constructor(secret: string) {
    this.#secret = secret;
  }

  reveal(code: string): string | null {
    return code === 'ok' ? this.#secret : null;
  }

  rotate(next: string, code: string): boolean {
    if (code !== 'ok') return false;
    this.#secret = next;
    return true;
  }
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const h = new SecretHolder('pwd');
  assert(h.reveal('ok') === 'pwd');
  assert(h.reveal('bad') === null);
  assert(h.rotate('new', 'ok') === true);
  assert(h.reveal('ok') === 'new');
  console.log('087-private-fields: ok');
}

const isMain =
  process.argv[1] &&
  (() => {
    const a = path.normalize(fileURLToPath(import.meta.url));
    const b = path.normalize(path.resolve(process.argv[1]));
    return a === b;
  })();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
