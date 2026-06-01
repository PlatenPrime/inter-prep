/**
 * 074 — Conditional types — основы
 * @tags conditional, generics
 * @difficulty medium
 *
 * ## Теория
 * T extends U ? X : Y — условный тип. Проверка assignability. Распространяется на union слева (distributive) если T — naked type parameter.
 *
 * ## На собеседовании
 * Чем conditional отличается от if в runtime? extends проверяет совместимость, не runtime значение. never в ветках.
 *
 * ## Связанные темы
 * infer, distributive conditional, Exclude.
 */

type IsString<T> = T extends string ? true : false;

export type TypeName<T> =
  T extends string ? 'string' :
  T extends number ? 'number' :
  T extends boolean ? 'boolean' :
  'object';

export function typeNameOf(value: unknown): TypeName<typeof value> {
  if (typeof value === 'string') return 'string' as TypeName<typeof value>;
  if (typeof value === 'number') return 'number' as TypeName<typeof value>;
  if (typeof value === 'boolean') return 'boolean' as TypeName<typeof value>;
  return 'object' as TypeName<typeof value>;
}

const _s: IsString<'hi'> = true;
void _s;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(typeNameOf('x') === 'string');
  assert(typeNameOf(1) === 'number');
  assert(typeNameOf(true) === 'boolean');
  console.log('074-conditional-basics: ok');
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
