/**
 * 050 — void callback
 * @tags functions, void
 * @difficulty medium
 *
 * ## Теория
 * void в return callback означает: результат вызова игнорируется, не «должен вернуть undefined».
 * Поэтому () => [1,2,3] допустим как () => void — лишний return value отбрасывается.
 * forEach, addEventListener типизируют listener как void return.
 * Отличие void от undefined: undefined — конкретное значение; void — «не используй return».
 * never — функция не завершается (throw/loop).
 *
 * ## На собеседовании
 * - Почему forEach callback может return number? — void return type allows ignored values.
 * - void vs undefined parameter? — param?: T vs param: T | undefined — разные strict rules.
 * - Когда never? — exhaustive throw, бесконечный цикл.
 *
 * ## Связанные темы
 * - webdev/14. ts/011-raznica-void-never-unknown.md
 * - webdev/14. ts/022-opcjonalnye-i-defaultnye-parametry.md
 */

export type VoidListener<T> = (event: T) => void;

export function subscribe<T>(listeners: VoidListener<T>[]): VoidListener<T> {
  return (event) => {
    for (const fn of listeners) fn(event);
  };
}

export function forEachVoid<T>(items: T[], fn: (item: T) => void): void {
  for (const item of items) fn(item);
}

export function tap<T>(value: T, fn: (v: T) => void): T {
  fn(value);
  return value;
}

export function runHandlers(events: string[], onEvent: (e: string) => void): number {
  forEachVoid(events, onEvent);
  return events.length;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  let count = 0;
  runHandlers(['a', 'b'], () => { count += 1; });
  assert(count === 2);
  assert(tap(5, (n) => { count += n; }) === 5);
  assert(count === 7);
  const emit = subscribe([(e: string) => { count += e.length; }]);
  emit('zz');
  assert(count === 9);
  console.log('050-void-callback: ok');
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
