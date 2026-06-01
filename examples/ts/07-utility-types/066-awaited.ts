/**
 * 066 — Awaited<T>
 * @tags utility-types, async
 * @difficulty medium
 *
 * ## Теория
 * Awaited<T> рекурсивно разворачивает Promise: Promise<string> → string, Promise<Promise<number>> → number. Полезно для типизации результатов async без ручного unwrap.
 *
 * ## На собеседовании
 * Awaited vs ReturnType для async: ReturnType даёт Promise<T>, Awaited — T. unwrap один уровень vs рекурсивно. С custom Thenable — осторожно.
 *
 * ## Связанные темы
 * ReturnType, async/await, Promise.all typing.
 */

export async function fetchValue(): Promise<number> {
  return 42;
}

/** Runtime unwrap одного уровня Promise (демо идеи Awaited) */
export async function unwrapPromise<T>(value: T | Promise<T>): Promise<T> {
  return await value;
}

export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    'then' in value &&
    typeof (value as PromiseLike<unknown>).then === 'function'
  );
}

type Resolved = Awaited<ReturnType<typeof fetchValue>>;
const _r: Resolved = 0;
void _r;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

async function runTests() {
  const n = await unwrapPromise(Promise.resolve(7));
  assert(n === 7);
  assert(isPromiseLike(Promise.resolve(1)) === true);
  assert(isPromiseLike(1) === false);
  console.log('066-awaited: ok');
}

const isMain =
  process.argv[1] &&
  (() => {
    const a = path.normalize(fileURLToPath(import.meta.url));
    const b = path.normalize(path.resolve(process.argv[1]));
    return a === b;
  })();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
