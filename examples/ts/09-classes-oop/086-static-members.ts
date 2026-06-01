/**
 * 086 — Статические члены
 * @tags classes, static
 * @difficulty easy
 *
 * ## Теория
 * static принадлежит конструктору, не экземпляру. typeof Class для типа конструктора. Статические блоки (static {}) — инициализация при загрузке класса.
 *
 * ## На собеседовании
 * Static vs singleton. Как типизировать static side? interface с constructor signature + static members.
 *
 * ## Связанные темы
 * InstanceType, factory patterns.
 */

export class IdGenerator {
  private static next = 1;

  static create(prefix = 'id'): string {
    const id = IdGenerator.next++;
    return `${prefix}-${id}`;
  }

  static reset(): void {
    IdGenerator.next = 1;
  }
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  IdGenerator.reset();
  assert(IdGenerator.create('u') === 'u-1');
  assert(IdGenerator.create('u') === 'u-2');
  console.log('086-static-members: ok');
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
