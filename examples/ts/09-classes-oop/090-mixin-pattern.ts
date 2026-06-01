/**
 * 090 — Mixin pattern
 * @tags classes, mixin
 * @difficulty hard
 *
 * ## Теория
 * TS не поддерживает множественное наследование классов. Mixin — функция, принимающая Base и возвращающая class extends Base с доп. поведением. Типизация через intersection конструкторов.
 *
 * ## На собеседовании
 * Mixin vs composition (объект с делегированием). Как типизировать applyMixins? Generic constructor constraints.
 *
 * ## Связанные темы
 * intersection types, composition.
 */

type Constructor<T = object> = new (...args: never[]) => T;

export function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    readonly mixedAt = Date.now();
  };
}

export function Loggable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    log(msg: string): void {
      console.log('[log]', msg);
    }
  };
}

class BaseEntity {
  constructor(public id: string) {}
}

export const Entity = Timestamped(Loggable(BaseEntity));

export function createEntity(id: string) {
  return new Entity(id);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const e = createEntity('e1');
  assert(e.id === 'e1');
  assert(typeof e.mixedAt === 'number');
  assert(typeof e.log === 'function');
  console.log('090-mixin-pattern: ok');
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
