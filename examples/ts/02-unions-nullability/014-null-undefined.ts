/**
 * 014 — null vs undefined
 * @tags unions, null
 * @difficulty medium
 *
 * ## Теория
 * undefined — «не задано»: необъявленное поле, отсутствующий return, несуществующий ключ.
 * null — явное «пустое значение» в JSON и API; нужно намеренно присваивать.
 * С strictNullChecks оба не входят в другие типы без union.
 * Стили кода: использовать только undefined для опциональности или null для API — быть консистентным.
 * == сравнивает null с undefined; === различает.
 * TypeScript 3.7+ optional chaining и nullish coalescing снижают путаницу.
 *
 * ## На собеседовании
 * - Когда выбрать null вместо undefined? — Контракт API/JSON, явное «значение отсутствует».
 * - typeof null в JS? — 'object' (исторический баг); в TS тип null отдельный.
 * - T | null | undefined — избыточно? — Часто да; сузьте контракт до одного «пустого».
 */

export type ApiUser = {
  id: string;
  nickname: string | null;
  bio?: string;
};

export function nicknameLabel(user: ApiUser): string {
  if (user.nickname === null) return 'Anonymous';
  return user.nickname;
}

export function bioLength(user: ApiUser): number {
  const bio = user.bio;
  if (bio === undefined) return 0;
  return bio.length;
}

export function coalesce<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
}

export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(nicknameLabel({ id: '1', nickname: null }) === 'Anonymous');
  assert(nicknameLabel({ id: '1', nickname: 'neo' }) === 'neo');
  assert(bioLength({ id: '1', nickname: null }) === 0);
  assert(coalesce(null, 5) === 5);
  assert(isNullish(undefined) === true);
  console.log('014-null-undefined: ok');
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
