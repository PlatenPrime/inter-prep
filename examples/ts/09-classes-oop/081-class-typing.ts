/**
 * 081 — Типизация классов
 * @tags classes, oop
 * @difficulty easy
 *
 * ## Теория
 * Класс задаёт и тип экземпляра, и тип конструктора. Поля в теле класса автоматически попадают в instance type. implements/interface описывает контракт без runtime.
 *
 * ## На собеседовании
 * Class vs interface для формы объекта. public fields в constructor vs property declarations. strictPropertyInitialization.
 *
 * ## Связанные темы
 * structural typing, interfaces.
 */

export class Counter {
  private value = 0;

  increment(by = 1): number {
    this.value += by;
    return this.value;
  }

  read(): number {
    return this.value;
  }
}

export type CounterInstance = Counter;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const c = new Counter();
  assert(c.read() === 0);
  assert(c.increment(3) === 3);
  console.log('081-class-typing: ok');
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
