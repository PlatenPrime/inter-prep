/**
 * 064 — Readonly<T>
 * @tags utility-types, readonly
 * @difficulty easy
 *
 * ## Теория
 * Readonly<T> делает свойства readonly на первом уровне. Массивы становятся readonly T[]. Для глубокой иммутабельности нужен DeepReadonly (кастом). Object.freeze — runtime аналог поверхности.
 *
 * ## На собеседовании
 * Readonly не deep-freeze вложенных объектов. as const на объекте даёт readonly литералы. ReadonlyArray vs readonly T[].
 *
 * ## Связанные темы
 * const assertions, Object.freeze.
 */

export function shallowFreeze<T extends object>(obj: T): Readonly<T> {
  return Object.freeze({ ...obj }) as Readonly<T>;
}

export function toMutableArray<T>(arr: readonly T[]): T[] {
  return [...arr];
}

type Config = Readonly<{ host: string; port: number }>;
const cfg: Config = { host: 'localhost', port: 3000 };
void cfg;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const o = shallowFreeze({ x: 1 });
  assert(Object.isFrozen(o));
  const m = toMutableArray([1, 2] as const);
  m.push(3);
  assert(m.length === 3);
  console.log('064-readonly-utility: ok');
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
