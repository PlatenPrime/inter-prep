/**
 * 046 — higher-order typing
 * @tags functions, higher-order
 * @difficulty hard
 *
 * ## Теория
 * Функция, принимающая или возвращающая функцию — higher-order.
 * Типизация: (x: T) => R, generic HOF сохраняет связь T→U.
 * compose(f, g) требует что output g совпадает с input f.
 * Currying: <A,B,C>(f: (a: A, b: B) => C) => (a: A) => (b: B) => C.
 * Event handlers, middleware, map/filter — ежедневные HOF в TS/React.
 *
 * ## На собеседовании
 * - Как типизировать callback? — Явная сигнатура или generic constraint.
 * - compose типы? — Пересечение Parameters/ReturnType или tuple pipeline.
 * - HOF vs method? — Method может иметь this parameter type.
 *
 * ## Связанные темы
 * - webdev/14. ts/013-genericheskie-tipy-generic.md
 * - webdev/09. js/029-chto-takoe-funkcii-vysshego-poryadka.md
 */

export function twice<T>(fn: (x: T) => T): (x: T) => T {
  return (x) => fn(fn(x));
}

export function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
  return (a) => f(g(a));
}

export function filterMap<T, U>(
  items: T[],
  pred: (item: T) => boolean,
  map: (item: T) => U,
): U[] {
  const out: U[] = [];
  for (const item of items) {
    if (pred(item)) out.push(map(item));
  }
  return out;
}

export function debounceTyped<F extends (arg: string) => void>(
  fn: F,
  ms: number,
): (arg: string) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (arg) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(arg), ms);
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(twice((n: number) => n + 1)(3) === 5);
  const len = compose((s: string) => s.length, (n: number) => String(n));
  assert(len(42) === 2);
  assert(filterMap([1, 2, 3], (n) => n % 2 === 0, (n) => n * 10).join('') === '20');
  console.log('046-higher-order-typing: ok');
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
