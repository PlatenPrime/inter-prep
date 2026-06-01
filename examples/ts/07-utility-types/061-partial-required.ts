/**
 * 061 — Partial и Required
 * @tags utility-types, partial, required
 * @difficulty easy
 *
 * ## Теория
 * Partial<T> делает каждое свойство T опциональным — удобно для PATCH и форм обновления. Required<T> обратная операция: все поля становятся обязательными. На уровне типов это mapped type с модификатором ?.
 *
 * ## На собеседовании
 * Partial для DTO обновления; runtime всё равно валидируй, какие поля пришли. Required<Pick<T,K>> — сделать обязательными только часть полей. DeepPartial — кастомный тип, встроенного нет.
 *
 * ## Связанные темы
 * Pick, Omit, Readonly — другие built-in utility types.
 */

type User = { id: string; name: string; email?: string };

/** Runtime-аналог Partial: поверхностная копия без изменения вложенных объектов */
export function shallowPartial<T extends object>(obj: T): Partial<T> {
  return { ...obj };
}

/** Заполняет отсутствующие ключи значением по умолчанию (аналог Required на одном уровне) */
export function withDefaults<T extends object>(
  partial: Partial<T>,
  defaults: Required<T>,
): T {
  return { ...defaults, ...partial } as T;
}

const _demo: Partial<User> = { name: 'Ann' };
void _demo;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const full = { id: '1', name: 'Ann', email: 'a@x.com' };
  const p = shallowPartial(full);
  assert(p.name === 'Ann');
  const merged = withDefaults({ name: 'Bob' }, full);
  assert(merged.id === '1' && merged.name === 'Bob');
  console.log('061-partial-required: ok');
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
