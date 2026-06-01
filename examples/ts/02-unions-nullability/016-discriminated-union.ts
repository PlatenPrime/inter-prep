/**
 * 016 — Discriminated unions
 * @tags unions, discriminant
 * @difficulty medium
 *
 * ## Теория
 * Дискриминированный union — общее литеральное поле kind/type/status для сужения switch.
 * Компилятор сужает поля в каждой ветке; exhaustive check ловит новые варианты.
 * Предпочтительнее enum для доменных событий и state machines в Redux/Zustand.
 * Каждая ветка должна иметь уникальный дискриминант; иначе narrowing ломается.
 * Можно комбинировать с generics: Result<T> = { ok: true; value: T } | { ok: false; error: Error }.
 * Теги должны быть readonly литералами для надёжного сравнения.
 *
 * ## На собеседовании
 * - Что делает switch по kind? — Сужает union до одной ветки.
 * - Как проверить исчерпывающность? — default: assertNever(x).
 * - Discriminated union vs class hierarchy? — Нет runtime vtable; проще сериализация.
 */

export type ApiResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }
  | { status: 'loading' };

export function unwrapResult<T>(result: ApiResult<T>): T | null {
  if (result.status === 'success') return result.data;
  if (result.status === 'loading') return null;
  return null;
}

export function resultMessage<T>(result: ApiResult<T>): string {
  switch (result.status) {
    case 'success':
      return 'ok';
    case 'error':
      return result.message;
    case 'loading':
      return '...';
  }
}

export type Payment = { type: 'card'; last4: string } | { type: 'cash' };

export function charge(p: Payment): number {
  return p.type === 'card' ? 100 : 50;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const ok: ApiResult<number> = { status: 'success', data: 7 };
  assert(unwrapResult(ok) === 7);
  assert(resultMessage({ status: 'error', message: 'fail' }) === 'fail');
  assert(charge({ type: 'cash' }) === 50);
  assert(charge({ type: 'card', last4: '4242' }) === 100);
  console.log('016-discriminated-union: ok');
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
