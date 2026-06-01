/**
 * 051 — generic basics
 * @tags generics
 * @difficulty easy
 *
 * ## Теория
 * Generic <T> параметризует тип: один код — много конкретных типов без any.
 * T выводится из аргумента: identity(42) → T = number.
 * Имена T, K, V — конвенция; можно несколько букв (TItem).
 * Generics работают для function, class, interface, type alias.
 * Цель — сохранить связь между входом и выходом типа.
 *
 * ## На собеседовании
 * - Generic vs any? — any теряет проверки; generic сохраняет T.
 * - Когда явный <T>? — Нет аргумента для inference или только в return type.
 * - Runtime generics? — Стираются; только compile-time.
 *
 * ## Связанные темы
 * - webdev/14. ts/013-genericheskie-tipy-generic.md
 */

export function identity<T>(value: T): T {
  return value;
}

export function wrap<T>(value: T): { value: T } {
  return { value };
}

export function isArrayOf<T>(value: unknown, guard: (x: unknown) => x is T): value is T[] {
  return Array.isArray(value) && value.every(guard);
}

export function swap<T, U>(pair: [T, U]): [U, T] {
  return [pair[1], pair[0]];
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(identity('ts') === 'ts');
  assert(wrap(1).value === 1);
  assert(swap([1, 'a'])[0] === 'a');
  assert(isArrayOf([1, 2], (x): x is number => typeof x === 'number'));
  console.log('051-generic-basics: ok');
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
