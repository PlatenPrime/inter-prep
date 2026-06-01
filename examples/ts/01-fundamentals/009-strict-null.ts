/**
 * 009 — strictNullChecks
 * @tags fundamentals, null
 * @difficulty medium
 *
 * ## Теория
 * При strictNullChecks null и undefined — отдельные значения, не входящие в number, string, object.
 * Обращение к свойству без проверки на null — ошибка компиляции.
 * Опциональное поле T? эквивалентно T | undefined (не null, если явно не указан).
 * Non-null assertion obj!.prop — только если уверены; злоупотребление скрывает баги.
 * Optional chaining ?. и nullish ?? — идиоматичная работа с отсутствующими значениями.
 * Включайте strict в tsconfig для новых проектов — это стандарт индустрии.
 *
 * ## На собеседовании
 * - Чем ?. отличается от &&? — ?. не срабатывает на 0 и ''; && может «проглотить» falsy.
 * - Можно ли присвоить null полю string? — Только если тип string | null.
 * - Зачем strictNullChecks? — Ловит NPE на этапе компиляции, особенно в API и DOM.
 */

export type UserProfile = {
  name: string;
  email?: string;
};

export function displayName(profile: UserProfile | null): string {
  if (profile === null) return 'Guest';
  return profile.name;
}

export function emailOrPlaceholder(profile: UserProfile): string {
  return profile.email ?? 'no-email@example.com';
}

export function firstChar(text: string | null | undefined): string {
  return text?.charAt(0) ?? '';
}

export function requireName(profile: UserProfile | null): string {
  if (!profile) throw new Error('profile required');
  return profile.name;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(displayName(null) === 'Guest');
  assert(displayName({ name: 'Ann' }) === 'Ann');
  assert(emailOrPlaceholder({ name: 'A' }) === 'no-email@example.com');
  assert(emailOrPlaceholder({ name: 'A', email: 'a@b.c' }) === 'a@b.c');
  assert(firstChar(null) === '');
  assert(firstChar('hi') === 'h');
  console.log('009-strict-null: ok');
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
