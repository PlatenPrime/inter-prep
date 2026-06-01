/**
 * 039 — readonly tuple
 * @tags tuple, readonly
 * @difficulty medium
 *
 * ## Теория
 * readonly [string, number] запрещает push/pop и присвоение по индексу на уровне типов.
 * as const на массиве литерале даёт deep readonly tuple с literal types.
 * Readonly<T> для tuple делает readonly версию; ReadonlyArray<T> — только для обычных массивов.
 * Иммутабельные кортежи полезны для координат, ключей routes, фиксированных конфигов.
 *
 * ## На собеседовании
 * - readonly tuple vs ReadonlyArray? — Tuple сохраняет длину и позиционные типы.
 * - Можно ли мутировать в runtime? — Да, если объект не Object.freeze; TS только static check.
 * - as const vs readonly modifier? — as const выводит литералы и readonly автоматически.
 *
 * ## Связанные темы
 * - webdev/14. ts/007-tipy-v-typescript.md
 * - webdev/14. ts/004-plyusy-ispolzovaniya-typescript.md
 */

export type ReadonlyPoint = readonly [number, number];

export function movePoint(p: ReadonlyPoint, dx: number, dy: number): ReadonlyPoint {
  return [p[0] + dx, p[1] + dy] as const;
}

export function freezePoint(p: [number, number]): ReadonlyPoint {
  return Object.freeze([...p]) as ReadonlyPoint;
}

export function pointsEqual(a: ReadonlyPoint, b: ReadonlyPoint): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const p = freezePoint([1, 2]);
  const moved = movePoint(p, 1, 1);
  assert(moved[0] === 2 && moved[1] === 3);
  assert(movePoint([0, 0], 3, 4)[0] === 3);
  console.log('039-readonly-tuple: ok');
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
