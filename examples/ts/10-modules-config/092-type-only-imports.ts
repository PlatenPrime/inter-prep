/**
 * 092 — Type-only imports
 * @tags modules, types
 * @difficulty medium
 *
 * ## Теория
 * import type { T } и export type { T } — стираются при emit, не попадают в JS bundle. import { type T, value } — inline type modifier. Предотвращает циклические runtime зависимости ради типов.
 *
 * ## На собеседовании
 * import type vs import { type }. verbatimModuleSyntax в strict projects. Когда type import обязателен?
 *
 * ## Связанные темы
 * isolatedModules, enums emit.
 */

export type Point = { x: number; y: number };

export type DistanceFn = (a: Point, b: Point) => number;

export const ORIGIN: Point = { x: 0, y: 0 };

export function manhattan(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function makePoint(x: number, y: number): Point {
  return { x, y };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const p = makePoint(3, 4);
  assert(manhattan(ORIGIN, p) === 7);
  console.log('092-type-only-imports: ok');
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
