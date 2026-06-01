/**
 * 011 — Union types basics
 * @tags unions, types
 * @difficulty easy
 *
 * ## Теория
 * Union A | B — значение одного из типов; доступны только общие операции без сужения.
 * Сужение (narrowing) обязательно перед методами конкретного типа: typeof, in, discriminant.
 * Union из литералов — основа для статусов, ролей, вариантов UI без enum.
 * Порядок union в отображении не важен: string | number ≡ number | string.
 * При присваивании переменной union нужно подходящее значение любой ветки.
 * Большие union замедляют компилятор — группируйте или используйте базовый тип + литералы.
 *
 * ## На собеседовании
 * - Что общего у string | number без narrowing? — Только операции, допустимые для обоих.
 * - Union vs enum на runtime? — Union исчезает; enum может оставить объект.
 * - Как безопасно вызвать .toFixed на string | number? — if (typeof x === 'number').
 *
 * ## Связанные темы
 * webdev/14. ts/007-tipy-v-typescript.md
 */

export type StringOrNumber = string | number;

export function formatId(value: StringOrNumber): string {
  if (typeof value === 'number') return '#' + value.toFixed(0);
  return value.toUpperCase();
}

export type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };

export function area(shape: Shape): number {
  if (shape.kind === 'circle') return Math.PI * shape.radius ** 2;
  return shape.side ** 2;
}

export function describe(value: string | boolean): string {
  return typeof value === 'string' ? value : value ? 'yes' : 'no';
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(formatId(42) === '#42');
  assert(formatId('ab') === 'AB');
  assert(Math.round(area({ kind: 'square', side: 2 })) === 4);
  assert(describe(true) === 'yes');
  assert(describe('hi') === 'hi');
  console.log('011-union-basics: ok');
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
