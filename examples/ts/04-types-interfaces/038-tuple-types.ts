/**
 * 038 — tuple types
 * @tags tuple, types
 * @difficulty medium
 *
 * ## Теория
 * Tuple — массив фиксированной длины с типом на каждой позиции: [string, number].
 * Отличие от array T[]: длина и позиции часть контракта; [T, ...T[]] — variadic tuple.
 * Деструктуризация сохраняет точные типы элементов.
 * React useState возвращает tuple [state, setter]; координаты [x, y, z].
 * as const делает tuple из readonly литералов.
 *
 * ## На собеседовании
 * - Tuple vs array? — Tuple фиксирует длину/позиции; T[] — любое количество.
 * - Optional/rest в tuple? — [string, ...number[]] — rest element.
 * - Почему не object {x,y}? — Tuple удобен для порядка и деструктуризации.
 *
 * ## Связанные темы
 * - webdev/14. ts/007-tipy-v-typescript.md
 */

export type Rgb = [number, number, number];
export type NamedSize = [name: string, width: number, height: number];

export function toHex([r, g, b]: Rgb): string {
  const h = (n: number) => n.toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

export function area([, w, h]: NamedSize): number {
  return w * h;
}

export function first<T extends readonly unknown[]>(tuple: T): T[0] {
  return tuple[0];
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(toHex([255, 0, 128]) === '#ff0080');
  assert(area(['box', 4, 5]) === 20);
  assert(first(['a', 'b'] as const) === 'a');
  console.log('038-tuple-types: ok');
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
