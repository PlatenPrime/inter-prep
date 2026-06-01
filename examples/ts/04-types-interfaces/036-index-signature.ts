/**
 * 036 — index signature
 * @tags interface, index
 * @difficulty medium
 *
 * ## Теория
 * [key: string]: T — индексная сигнатура: любые строковые ключи с значением T.
 * string | number | symbol — допустимые типы ключа в современном TS.
 * Все явные свойства должны быть совместимы с индексной сигнатурой.
 * Record<string, T> — type-алиас для словаря; по смыслу близок к index signature.
 * readonly [key: string]: T запрещает присвоение новых ключей на уровне типов.
 *
 * ## На собеседовании
 * - Index signature vs Record? — Record удобнее для чистых словарей; interface — когда есть фиксированные поля + индекс.
 * - Почему number index редок? — number ключи приводятся к string в объектах JS.
 * - Ограничение значений? — Явные поля не могут быть уже, чем индексный тип.
 *
 * ## Связанные темы
 * - webdev/14. ts/007-tipy-v-typescript.md
 */

export interface StringDict {
  [key: string]: string;
}

export interface Scores extends StringDict {
  total?: string;
}

export function sumNumericValues(dict: Record<string, number>): number {
  return Object.values(dict).reduce((acc, n) => acc + n, 0);
}

export function pickKeys<T extends Record<string, unknown>>(
  obj: T,
  keys: string[],
): Partial<T> {
  const out: Partial<T> = {};
  for (const k of keys) {
    if (k in obj) out[k as keyof T] = obj[k as keyof T];
  }
  return out;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(sumNumericValues({ a: 1, b: 2, c: 3 }) === 6);
  const partial = pickKeys({ x: 1, y: 2, z: 3 }, ['x', 'z']);
  assert(partial.x === 1 && partial.y === undefined);
  console.log('036-index-signature: ok');
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
