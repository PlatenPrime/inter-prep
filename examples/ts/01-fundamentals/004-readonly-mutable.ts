/**
 * 004 — readonly vs mutable
 * @tags fundamentals, immutability
 * @difficulty medium
 *
 * ## Теория
 * readonly запрещает присваивание полям и элементам на уровне типов; в runtime массив всё ещё можно мутировать без ReadonlyArray.
 * Readonly<T> делает все свойства объекта readonly; ReadonlyArray<T> — только чтение по индексу и методам.
 * readonly vs const: const — на уровне переменной (нельзя переназначить ссылку), readonly — на уровне свойства.
 * Глубокая иммутабельность требует рекурсивных mapped types (DeepReadonly) или библиотек.
 * При передаче в функцию readonly-массив совместим с mutable, но не наоборот без копии.
 * В React props часто помечают readonly для предотвращения мутаций в дочерних компонентах.
 *
 * ## На собеседовании
 * - readonly защищает в runtime? — Нет, только compile-time; Object.freeze — отдельно.
 * - Можно ли передать number[] в readonly number[]? — Да (ковариантность чтения); обратно — нет.
 * - Чем ReadonlyArray отличается от readonly T[]? — Почти синонимы; ReadonlyArray — встроенный интерфейс.
 */

export type User = {
  readonly id: string;
  name: string;
};

export function renameUser(user: User, name: string): User {
  return { ...user, name };
}

export function total(nums: readonly number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

export function firstItem<T>(items: ReadonlyArray<T>): T | undefined {
  return items[0];
}

export function freezeCopy<T extends object>(obj: T): Readonly<T> {
  return Object.freeze({ ...obj }) as Readonly<T>;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const u: User = { id: '1', name: 'Ann' };
  const u2 = renameUser(u, 'Bob');
  assert(u2.name === 'Bob' && u2.id === '1');
  assert(total([1, 2, 3]) === 6);
  assert(firstItem(['a', 'b']) === 'a');
  const frozen = freezeCopy({ x: 1 });
  assert((frozen as { x: number }).x === 1);
  console.log('004-readonly-mutable: ok');
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
