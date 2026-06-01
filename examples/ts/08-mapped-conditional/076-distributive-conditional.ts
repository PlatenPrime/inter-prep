/**
 * 076 — Distributive conditional types
 * @tags conditional, unions
 * @difficulty hard
 *
 * ## Теория
 * Если T — голый type parameter и T extends U, то T распределяется по union: (A|B) extends U ? X : Y → (A extends U ? X : Y) | (B extends U ? X : Y). Отключить: [T] extends [U].
 *
 * ## На собеседовании
 * Почему Exclude работает? Distributive law. Как обернуть T в tuple чтобы отключить distribution? [T] extends [string].
 *
 * ## Связанные темы
 * Exclude, Extract, union filtering.
 */

type ToArray<T> = T extends unknown ? T[] : never;

export function filterByKind<T extends { kind: string }>(
  items: readonly T[],
  kind: T['kind'],
): Extract<T, { kind: typeof kind }>[] {
  return items.filter((i) => i.kind === kind) as Extract<T, { kind: typeof kind }>[];
}

type StrArr = ToArray<'a' | 'b'>;
const _sa: StrArr = ['a'];
void _sa;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const items = [{ kind: 'a' as const, v: 1 }, { kind: 'b' as const, v: 2 }];
  const onlyA = filterByKind(items, 'a');
  assert(onlyA.length === 1 && onlyA[0].v === 1);
  console.log('076-distributive-conditional: ok');
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
