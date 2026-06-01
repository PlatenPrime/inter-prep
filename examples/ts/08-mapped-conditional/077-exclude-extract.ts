/**
 * 077 — Exclude и Extract через conditional
 * @tags conditional, utility-types
 * @difficulty medium
 *
 * ## Теория
 * Exclude<T,U> = T extends U ? never : T. Extract<T,U> = T extends U ? T : never. Реализованы distributive conditional. Фильтрация union без runtime.
 *
 * ## На собеседовании
 * Написать Exclude руками. Разница с Omit: Omit для object keys, Exclude для unions. never исчезает из union.
 *
 * ## Связанные темы
 * NonNullable, Pick, keyof.
 */

type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;

export function tagsWithout<T extends string, E extends string>(
  all: readonly T[],
  remove: readonly E[],
): MyExclude<T, E>[] {
  const set = new Set(remove as readonly string[]);
  return all.filter((t) => !set.has(t)) as MyExclude<T, E>[];
}

type Colors = 'red' | 'green' | 'blue';
type Primary = MyExtract<Colors, 'red' | 'blue'>;
const _p: Primary = 'red';
void _p;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const left = tagsWithout(['a', 'b', 'c'] as const, ['b'] as const);
  assert(left.length === 2 && left[0] === 'a');
  console.log('077-exclude-extract: ok');
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
