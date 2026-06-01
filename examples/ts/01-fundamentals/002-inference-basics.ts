/**
 * 002 — Type inference basics
 * @tags fundamentals, inference
 * @difficulty easy
 *
 * ## Теория
 * Компилятор выводит типы там, где аннотация не обязательна: let x = 1 → number, const arr = [1, 'a'] → (string | number)[].
 * Параметры функций выводятся из тела и мест вызова; возвращаемый тип часто выводится из return.
 * Контекстная типизация: в колбэке .map(x => ...) тип x берётся из сигнатуры map.
 * При включённом noImplicitAny переменные без выводимого типа требуют аннотации.
 * Явная аннотация нужна, когда вывод слишком широкий (const → string | number) или когда API должно быть стабильным.
 * Generics усиливают вывод: createPair(1, 'a') даёт [number, string] без указания T, U.
 *
 * ## На собеседовании
 * - Когда TypeScript выводит тип без аннотации? — При инициализации, return, generic-вызовах и контексте (колбэки).
 * - Что такое contextual typing? — Тип параметра выводится из ожидаемой сигнатуры снаружи.
 * - Зачем писать аннотацию вручную, если есть вывод? — Сузить тип, задокументировать контракт, обойти слишком широкий вывод.
 *
 * ## Связанные темы
 * webdev/14. ts/002-osnovnye-komponenty-typescript.md
 */

export function createPair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

export function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

export function mapValues<T, U>(items: readonly T[], fn: (item: T) => U): U[] {
  const out: U[] = [];
  for (const item of items) {
    out.push(fn(item));
  }
  return out;
}

export function sum(numbers: readonly number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

export type InferredPair = ReturnType<typeof createPair<number, string>>;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const p = createPair(1, 'x');
  assert(p[0] === 1 && p[1] === 'x');
  assert(first([10, 20]) === 10);
  assert(first([]) === undefined);
  assert(mapValues([1, 2], (n) => n * 2).join(',') === '2,4');
  assert(sum([1, 2, 3]) === 6);
  console.log('002-inference-basics: ok');
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
