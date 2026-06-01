/**
 * 031 — type vs interface
 * @tags types, interface
 * @difficulty medium
 *
 * ## Теория
 * type и interface описывают форму объектов и во многом взаимозаменяемы.
 * interface удобен для публичных API: extends, declaration merging, лучше сообщения об ошибках при implements.
 * type мощнее для union, intersection, tuple, conditional и mapped types — interface так не выразить.
 * На собеседовании важно: structural typing — совместимость по форме, не по имени декларации.
 * Для React props часто type; для библиотечных расширяемых объектов — interface.
 * Оба поддерживают extends / intersection (&) для композиции полей.
 *
 * ## На собеседовании
 * - Когда выбрать interface? — Публичный объектный контракт, merging, class implements.
 * - Когда type? — Union, tuple, utility-комбинации, branded/nominal-lite.
 * - Одинакова ли проверка структуры? — Да, structural typing для обоих.
 *
 * ## Связанные темы
 * - webdev/14. ts/008-raznica-type-i-interface.md
 * - webdev/14. ts/007-tipy-v-typescript.md
 */

export interface PointI {
  x: number;
  y: number;
}

export type PointT = { x: number; y: number };

/** Structural: любой объект с x,y подходит */
export function distanceFromOrigin(p: { x: number; y: number }): number {
  return Math.hypot(p.x, p.y);
}

export function sameCoords(a: PointI, b: PointT): boolean {
  return a.x === b.x && a.y === b.y;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(distanceFromOrigin({ x: 3, y: 4 }) === 5);
  assert(sameCoords({ x: 1, y: 2 }, { x: 1, y: 2 }));
  console.log('031-type-vs-interface: ok');
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
