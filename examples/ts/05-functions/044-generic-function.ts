/**
 * 044 — generic function
 * @tags functions, generics
 * @difficulty medium
 *
 * ## Теория
 * function id<T>(x: T): T сохраняет тип аргумента вместо any.
 * Generic параметр выводится (inference) из аргумента при вызове.
 * Явное указание: id<string>('x') когда inference недостаточен.
 * Несколько type params: function map<T, U>(arr: T[], fn: (t: T) => U): U[].
 * Ограничения: <T extends HasId> — в следующих темах каталога 06.
 *
 * ## На собеседовании
 * - Зачем generic function? — Переиспользование без потери типа.
 * - Когда писать <T> явно? — Когда T только в return или контекст ambiguous.
 * - Generic vs any? — any отключает проверки; generic сохраняет связь типов.
 *
 * ## Связанные темы
 * - webdev/14. ts/013-genericheskie-tipy-generic.md
 */

export function identity<T>(value: T): T {
  return value;
}

export function firstOf<T>(items: readonly T[]): T | undefined {
  return items[0];
}

export function mapArray<T, U>(items: T[], fn: (item: T) => U): U[] {
  const out: U[] = [];
  for (const item of items) out.push(fn(item));
  return out;
}

export function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(identity(42) === 42);
  assert(firstOf([10, 20]) === 10);
  assert(mapArray([1, 2], (n) => String(n)).join('') === '12');
  assert(pair('x', 1)[1] === 1);
  console.log('044-generic-function: ok');
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
