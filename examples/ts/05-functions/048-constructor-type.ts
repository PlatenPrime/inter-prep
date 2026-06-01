/**
 * 048 — constructor type
 * @tags functions, constructor
 * @difficulty medium
 *
 * ## Теория
 * type Factory = new (...args: number[]) => Date — constructor signature.
 * Отличается от call signature: new Foo() vs Foo().
 * abstract class / interface с new — для DI и фабрик.
 * InstanceType<C> извлекает тип экземпляра (utility, тема 07).
 * class expression совместим с typeof MyClass для value+type merge.
 *
 * ## На собеседовании
 * - new signature vs call? — new для конструкторов; call для обычных функций.
 * - typeof Class vs InstanceType? — typeof — value constructor; InstanceType — instance.
 * - interface с new? — Описание конструктора без реализации.
 *
 * ## Связанные темы
 * - webdev/14. ts/018-elementy-oop-v-typescript.md
 * - webdev/14. ts/009-raznica-abstract-class-i-interface.md
 */

export interface Timestamped {
  createdAt: Date;
}

export interface TimestampedCtor {
  new (ms: number): Timestamped;
}

export class EventRecord implements Timestamped {
  createdAt: Date;
  constructor(ms: number) {
    this.createdAt = new Date(ms);
  }
}

export function createMany(
  Ctor: TimestampedCtor,
  values: number[],
): Timestamped[] {
  return values.map((ms) => new Ctor(ms));
}

export function isCtor(v: unknown): v is TimestampedCtor {
  return typeof v === 'function';
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const list = createMany(EventRecord, [0, 1000]);
  assert(list.length === 2);
  assert(list[0] instanceof EventRecord);
  assert(isCtor(EventRecord));
  console.log('048-constructor-type: ok');
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
