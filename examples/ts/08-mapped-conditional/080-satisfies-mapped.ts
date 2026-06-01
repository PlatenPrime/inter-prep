/**
 * 080 — satisfies и точные ключи
 * @tags satisfies, mapped
 * @difficulty medium
 *
 * ## Теория
 * expr satisfies T проверяет соответствие T, но сохраняет inferred literal тип (ключи, as const). Лучше as T, когда нужны узкие литералы без потери autocomplete.
 *
 * ## На собеседовании
 * satisfies vs as const vs annotation : Type. Record с satisfies для theme tokens. Ошибка на лишний ключ при satisfies + excess property check.
 *
 * ## Связанные темы
 * as const, Record, keyof.
 */

type Theme = Record<'primary' | 'secondary', string>;

export function defineTheme<const T extends Theme>(theme: T): T {
  return theme;
}

export function keysOf<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

const palette = defineTheme({
  primary: '#2563eb',
  secondary: '#64748b',
} as const satisfies Theme);

void palette;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const t = defineTheme({ primary: '#000', secondary: '#fff' });
  assert(keysOf(t).length === 2);
  assert(t.primary === '#000');
  console.log('080-satisfies-mapped: ok');
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
