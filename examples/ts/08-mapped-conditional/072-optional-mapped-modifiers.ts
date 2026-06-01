/**
 * 072 — Модификаторы ? и readonly
 * @tags mapped-types, modifiers
 * @difficulty medium
 *
 * ## Теория
 * В mapped type: +? делает опциональным, -? убирает optional, +readonly / -readonly управляют мутабельностью. Required<T> = { [K in keyof T]-?: T[K] }.
 *
 * ## На собеседовании
 * Синтаксис -? в Required. Как сделать все поля readonly кроме одного? Комбинация Pick + mapped modifiers.
 *
 * ## Связанные темы
 * Partial, Required, Readonly utilities.
 */

type Optionalize<T> = { [K in keyof T]?: T[K] };
type Definite<T> = { [K in keyof T]-?: T[K] };

export function pickDefined<T extends object>(obj: T): Definite<Partial<T>> {
  const out = {} as Record<string, unknown>;
  for (const k of Object.keys(obj) as (keyof T)[]) {
    if (obj[k] !== undefined) out[k as string] = obj[k];
  }
  return out as Definite<Partial<T>>;
}

type Loose = Optionalize<{ x: number }>;
const _l: Loose = {};
void _l;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const r = pickDefined({ a: 1, b: undefined as number | undefined });
  assert(r.a === 1 && !('b' in r));
  console.log('072-optional-mapped-modifiers: ok');
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
