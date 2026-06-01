/**
 * 052 — generic constraints
 * @tags generics, extends
 * @difficulty medium
 *
 * ## Теория
 * <T extends HasLength> ограничивает T: только типы, совместимые с constraint.
 * Constraint может быть interface, union bound, keyof object.
 * Компилятор разрешает доступ к полям constraint: T extends { id: string } → value.id.
 * Множественные bounds через intersection: T extends A & B.
 * Слишком широкий constraint → снова потеря точности; слишком узкий → не переиспользуется.
 *
 * ## На собеседовании
 * - extends в generic vs extends interface? — Разный синтаксис; generic — upper bound для T.
 * - keyof в constraint? — T extends keyof Obj для безопасного доступа к ключам.
 * - default constraint? — T extends unknown по сути без ограничения.
 *
 * ## Связанные темы
 * - webdev/14. ts/013-genericheskie-tipy-generic.md
 */

export interface HasId {
  id: string;
}

export function byId<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}

export function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const users = [{ id: '1', name: 'A' }, { id: '2', name: 'B' }];
  assert(byId(users, '2')?.name === 'B');
  assert(pluck({ x: 1, y: 2 }, 'y') === 2);
  assert(longest('abc', 'de') === 'abc');
  console.log('052-constraints-extends: ok');
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
