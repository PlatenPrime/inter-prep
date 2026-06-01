/**
 * 054 — multiple type parameters
 * @tags generics
 * @difficulty medium
 *
 * ## Теория
 * Несколько params: <K, V> для ключей и значений Map-like API.
 * Связь между params: function merge<T, U>(a: T, b: U): T & U.
 * Tuple generics: function zip<T, U>(a: T[], b: U[]): [T, U][].
 * Порядок важен при partial explicit: fn<string, number>(...).
 * Избегай избыточных params — если U = T['key'], используй indexed access.
 *
 * ## На собеседовании
 * - Сколько type params норм? — 1–3 часто; больше — сигнал упростить API.
 * - Связанные generics? — U extends T или U = keyof T patterns.
 * - Inference нескольких T? — Из разных аргументов, должен быть один solution.
 *
 * ## Связанные темы
 * - webdev/14. ts/013-genericheskie-tipy-generic.md
 */

export function tuple<T, U>(a: T, b: U): [T, U] {
  return [a, b];
}

export function mapPair<T, U, V>(pair: [T, U], fn: (t: T, u: U) => V): V {
  return fn(pair[0], pair[1]);
}

export function buildMap<K extends string, V>(
  entries: [K, V][],
): Record<K, V> {
  const out = {} as Record<K, V>;
  for (const [k, v] of entries) out[k] = v;
  return out;
}

export function zip<T, U>(as: T[], bs: U[]): [T, U][] {
  const len = Math.min(as.length, bs.length);
  const out: [T, U][] = [];
  for (let i = 0; i < len; i++) out.push([as[i], bs[i]]);
  return out;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(mapPair(tuple(1, 'a'), (n, s) => `${n}${s}`) === '1a');
  assert(buildMap([['x', 1], ['y', 2]]).y === 2);
  assert(zip([1, 2], ['a', 'b'])[1][1] === 'b');
  console.log('054-multiple-params: ok');
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
