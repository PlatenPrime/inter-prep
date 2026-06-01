/**
 * 075 — infer в conditional types
 * @tags conditional, infer
 * @difficulty hard
 *
 * ## Теория
 * infer R внутри extends позволяет вывести тип из позиции: Array<infer E> → E. infer только в true-ветке conditional. Можно infer несколько раз в одном типе.
 *
 * ## На собеседовании
 * Как извлечь element type из Promise<T>? UnpackPromise. infer в contravariant позициях — ограничения. ReturnType реализация через infer.
 *
 * ## Связанные темы
 * ReturnType, Awaited, tuple infer.
 */

type UnpackArray<T> = T extends readonly (infer E)[] ? E : never;
type UnpackPromise<T> = T extends Promise<infer R> ? R : T;

export function firstOf<T>(arr: readonly T[]): T | undefined {
  return arr[0];
}

export async function awaitTyped<T>(p: Promise<T>): Promise<UnpackPromise<Promise<T>>> {
  return await p;
}

type Elem = UnpackArray<string[]>;
const _e: Elem = 'x';
void _e;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

async function runTests() {
  assert(firstOf([1, 2]) === 1);
  assert(await awaitTyped(Promise.resolve(9)) === 9);
  console.log('075-infer-keyword: ok');
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
