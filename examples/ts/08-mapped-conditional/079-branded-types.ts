/**
 * 079 — Branded / nominal types
 * @tags branded, safety
 * @difficulty medium
 *
 * ## Теория
 * Structural typing не различает string userId и productId. Brand: type UserId = string & { readonly __brand: unique symbol }. Runtime — обычная строка, compile-time — несовместимы.
 *
 * ## На собеседовании
 * Brand vs validation (zod). Когда brand достаточно? opaque type pattern. Не путать с class wrapper.
 *
 * ## Связанные темы
 * as const, satisfies, validation libs.
 */

declare const UserIdBrand: unique symbol;
export type UserId = string & { readonly [UserIdBrand]: true };

declare const EmailBrand: unique symbol;
export type Email = string & { readonly [EmailBrand]: true };

export function userId(id: string): UserId {
  if (!id) throw new Error('empty id');
  return id as UserId;
}

export function email(value: string): Email {
  if (!value.includes('@')) throw new Error('invalid email');
  return value as Email;
}

export function sameUser(a: UserId, b: UserId): boolean {
  return a === b;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const u1 = userId('u1');
  const u2 = userId('u2');
  assert(sameUser(u1, u1));
  assert(email('a@b.co').includes('@'));
  let bad = false;
  try { email('nope'); } catch { bad = true; }
  assert(bad);
  console.log('079-branded-types: ok');
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
