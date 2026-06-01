/**
 * 035 — hybrid types
 * @tags interface, callable
 * @difficulty hard
 *
 * ## Теория
 * Hybrid type — объект, который одновременно функция и носитель свойств/методов.
 * В TS: call signature + property signatures в одном interface/type.
 * Примеры: jQuery $(...), промис с .then, маршрутизатор Express app().
 * Типизация: отдельно описать (args)=>R и поля; реализация через Object.assign или cast.
 * Осторожно с this и bind при присвоении методов на функцию.
 *
 * ## На собеседовании
 * - Пример hybrid в экосистеме? — Function с полями .displayName, router.handle.
 * - Как типизировать? — Callable interface + поля в том же типе.
 * - Альтернатива? — Класс со static, если не нужен call как primary API.
 *
 * ## Связанные темы
 * - webdev/14. ts/007-tipy-v-typescript.md
 * - webdev/14. ts/008-raznica-type-i-interface.md
 */

export interface TaggedFn<T> {
  (input: T): T;
  tag: string;
  timesCalled: number;
}

export function createTagged<T>(tag: string, fn: (input: T) => T): TaggedFn<T> {
  const wrapped = ((input: T) => {
    wrapped.timesCalled += 1;
    return fn(input);
  }) as TaggedFn<T>;
  wrapped.tag = tag;
  wrapped.timesCalled = 0;
  return wrapped;
}

export function describeTagged<T>(f: TaggedFn<T>): string {
  return `${f.tag}(${f.timesCalled})`;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const double = createTagged('double', (n: number) => n * 2);
  assert(double(5) === 10);
  assert(double(1) === 2);
  assert(describeTagged(double) === 'double(2)');
  console.log('035-hybrid-types: ok');
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
