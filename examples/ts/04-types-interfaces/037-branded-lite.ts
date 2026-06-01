/**
 * 037 — branded types (lite)
 * @tags types, branded
 * @difficulty hard
 *
 * ## Теория
 * Structural typing не различает string и string на уровне домена (UserId vs OrderId).
 * Branded type: type UserId = string & { readonly __brand: 'UserId' } — номинальный маркер без рантайма.
 * Создание только через фабрику createUserId(s), иначе случайно не перепутать id.
 * Полноценные branded — через unique symbol; lite-вариант с __brand достаточен на собеседовании.
 * В рантайме это обычная строка; защита только на этапе компиляции.
 *
 * ## На собеседовании
 * - Зачем brand, если string? — Запретить смешивание доменных идентификаторов.
 * - Есть ли overhead? — Нет в JS; только проверка TS.
 * - brand vs class wrapper? — Brand дешевле; class — если нужна валидация в рантайме.
 *
 * ## Связанные темы
 * - webdev/14. ts/008-raznica-type-i-interface.md
 * - webdev/14. ts/014-utilitarnye-tipy-utility-types.md
 */

export type UserId = string & { readonly __brand: 'UserId' };
export type OrderId = string & { readonly __brand: 'OrderId' };

export function createUserId(raw: string): UserId {
  if (!raw.startsWith('u_')) throw new Error('invalid user id');
  return raw as UserId;
}

export function createOrderId(raw: string): OrderId {
  if (!raw.startsWith('o_')) throw new Error('invalid order id');
  return raw as OrderId;
}

export function linkOrderToUser(orderId: OrderId, userId: UserId): string {
  return `${orderId}@${userId}`;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const u = createUserId('u_42');
  const o = createOrderId('o_99');
  assert(linkOrderToUser(o, u) === 'o_99@u_42');
  let threw = false;
  try { createUserId('bad'); } catch { threw = true; }
  assert(threw);
  console.log('037-branded-lite: ok');
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
