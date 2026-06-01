/**
 * 043 — rest and tuple params
 * @tags functions, rest
 * @difficulty medium
 *
 * ## Теория
 * ...args: T[] — rest как массив; ...args: [number, number] — tuple rest (TS 4+).
 * Tuple rest фиксирует минимальную форму хвоста: (head: string, ...rest: number[]).
 * Spread при вызове требует совместимости tuple с параметром.
 * Связь с arguments в JS — rest предпочтительнее, типобезопасно.
 * Комбинация с generics: function join<T extends string>(...parts: T[])
 *
 * ## На собеседовании
 * - rest array vs tuple? — Tuple rest для фиксированного «хвоста» после обязательных args.
 * - Типизация apply/call? — Tuple types + Parameters utility.
 * - rest последний? — Да, только один rest parameter.
 *
 * ## Связанные темы
 * - webdev/14. ts/022-opcjonalnye-i-defaultnye-parametry.md
 * - webdev/14. ts/007-tipy-v-typescript.md
 */

export function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

export function pairHead<T, U>(head: T, ...tail: [U, ...U[]]): [T, U] {
  return [head, tail[0]];
}

export function logTagged(tag: string, ...messages: string[]): string {
  return messages.map((m) => `[${tag}] ${m}`).join(' | ');
}

export function minMax(...nums: [number, ...number[]]): { min: number; max: number } {
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(sum(1, 2, 3) === 6);
  assert(pairHead('a', 1, 2)[1] === 1);
  assert(logTagged('app', 'ok', 'done') === '[app] ok | [app] done');
  const mm = minMax(3, 1, 9);
  assert(mm.min === 1 && mm.max === 9);
  console.log('043-rest-tuple: ok');
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
