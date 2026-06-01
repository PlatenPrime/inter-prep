/**
 * 015 — Nullish coalescing
 * @tags unions, operators
 * @difficulty easy
 *
 * ## Теория
 * Оператор ?? возвращает правый операнд только если левый null или undefined.
 * В отличие от ||, ?? не заменяет 0, '' и false — важно для конфигов и чисел.
 * ??= присваивает только при nullish: x ??= y.
 * Комбинируйте с ?.: user?.settings?.theme ?? 'light'.
 * Не смешивайте ?? и || без скобок — правило группировки запрещает без parentheses.
 * Для default пустой строки используйте ??, не ||, если '' допустим.
 *
 * ## На собеседовании
 * - '' ?? 'default'? — '' (пустая строка не nullish).
 * - 0 || 10 vs 0 ?? 10? — || → 10; ?? → 0.
 * - Зачем ?? в React default props? — Не перетирать переданный 0 или false.
 */

export function withDefaultCount(count: number | null | undefined): number {
  return count ?? 0;
}

export function withDefaultName(name: string | null | undefined): string {
  return name ?? 'Guest';
}

export function flagEnabled(flag: boolean | null | undefined): boolean {
  return flag ?? false;
}

export type Config = { port?: number; host?: string };

export function resolvePort(config: Config): number {
  return config.port ?? 3000;
}

export function resolveHost(config: Config): string {
  return config.host ?? 'localhost';
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(withDefaultCount(null) === 0);
  assert(withDefaultCount(5) === 5);
  assert(withDefaultName('') === '');
  assert(flagEnabled(null) === false);
  assert(resolvePort({}) === 3000);
  assert(resolveHost({ host: '0.0.0.0' }) === '0.0.0.0');
  console.log('015-nullish-coalescing: ok');
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
