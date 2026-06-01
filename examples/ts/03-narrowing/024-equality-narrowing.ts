/**
 * 024 — Equality narrowing
 * @tags narrowing, equality
 * @difficulty easy
 *
 * ## Теория
 * Сравнение ===, !==, ==, != сужает union: if (x === null) x: null.
 * Сравнение с литералом: status === 'loading' сужает discriminated union.
 * Сравнение двух переменных одного union может сузить обе: if (a === b).
 * switch (x) с case литералами — форма equality narrowing.
 * undefined и null проверяйте явно под strictNullChecks.
 * После return в ветке оставшийся тип сужается (control flow analysis).
 *
 * ## На собеседовании
 * - === сужает лучше ==? — == дополнительная coercion; в TS предпочтите ===.
 * - x === true сужает boolean? — До true в ветке, false в else.
 * - Почему switch удобен для union? — Каждый case сужает автоматически.
 */

export type LoadState =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'done'; data: string };

export function stateLabel(s: LoadState): string {
  if (s.state === 'idle') return 'idle';
  if (s.state === 'loading') return 'loading';
  return s.data;
}

export function equalsId(a: string | null, b: string | null): boolean {
  if (a === null || b === null) return a === b;
  return a === b;
}

export function normalizeRole(role: 'admin' | 'user' | 'guest'): 'admin' | 'user' {
  if (role === 'guest') return 'user';
  return role;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(stateLabel({ state: 'idle' }) === 'idle');
  assert(stateLabel({ state: 'done', data: 'ok' }) === 'ok');
  assert(equalsId(null, null) === true);
  assert(equalsId('a', 'a') === true);
  assert(normalizeRole('guest') === 'user');
  console.log('024-equality-narrowing: ok');
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
