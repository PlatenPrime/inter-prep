/**
 * 017 — enum vs string union
 * @tags unions, enum
 * @difficulty medium
 *
 * ## Теория
 * enum генерирует JS-объект (кроме const enum при inline) — влияет на bundle.
 * String union type — только compile-time, нулевой runtime overhead.
 * const enum подставляет значения при компиляции — нет reverse mapping, осторожно с isolatedModules.
 * Для публичных API библиотек union + as const читаемее и tree-shake-friendly.
 * Numeric enum имеет reverse mapping и неожиданные числовые значения.
 * Biome/ESLint часто рекомендуют union вместо enum в application code.
 *
 * ## На собеседовании
 * - Когда enum оправдан? — Legacy interop, битовые флаги, соглашение команды.
 * - Почему union лучше для REST статусов? — Совпадает с JSON без трансформации.
 * - const enum минус? — Нельзя импортировать как значение в некоторых bundler-сценариях.
 */

export const OrderStatus = {
  Pending: 'pending',
  Shipped: 'shipped',
  Delivered: 'delivered',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export function nextStatus(current: OrderStatus): OrderStatus | null {
  if (current === OrderStatus.Pending) return OrderStatus.Shipped;
  if (current === OrderStatus.Shipped) return OrderStatus.Delivered;
  return null;
}

export function isOrderStatus(value: string): value is OrderStatus {
  return (Object.values(OrderStatus) as string[]).includes(value);
}

export function labelStatus(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'В обработке';
    case 'shipped':
      return 'Отправлен';
    case 'delivered':
      return 'Доставлен';
  }
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(nextStatus('pending') === 'shipped');
  assert(nextStatus('delivered') === null);
  assert(isOrderStatus('shipped') === true);
  assert(isOrderStatus('x') === false);
  assert(labelStatus('pending') === 'В обработке');
  console.log('017-enum-vs-union: ok');
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
