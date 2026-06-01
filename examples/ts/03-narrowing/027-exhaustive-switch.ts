/**
 * 027 — Exhaustive switch
 * @tags narrowing, switch
 * @difficulty medium
 *
 * ## Теория
 * switch по discriminant должен покрывать все варианты union.
 * В default: const _exhaustive: never = value — ошибка при новом варианте.
 * Функция assertNever(x: never): never в default — runtime + compile check.
 * Без default компилятор проверяет исчерпывание, если strict и union конечен.
 * При fall-through используйте break или return в каждом case.
 * Исчерпывающий switch — must-have в code review для state machine.
 *
 * ## На собеседовании
 * - Зачем never в default? — Упасть при compile, если забыли case.
 * - switch(true) паттерн? — Условия в case для сложных guard.
 * - Что если добавить ветку union? — never в default подсветит все switch.
 */

export type Shape =
  | { kind: 'circle'; r: number }
  | { kind: 'rect'; w: number; h: number };

export function assertNever(x: never): never {
  throw new Error('Unhandled: ' + JSON.stringify(x));
}

export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.r ** 2;
    case 'rect':
      return shape.w * shape.h;
    default:
      return assertNever(shape);
  }
}

export type Msg = { type: 'ping' } | { type: 'pong' };

export function handle(msg: Msg): string {
  switch (msg.type) {
    case 'ping':
      return 'ping';
    case 'pong':
      return 'pong';
    default:
      return assertNever(msg);
  }
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(Math.round(area({ kind: 'rect', w: 2, h: 3 })) === 6);
  assert(handle({ type: 'ping' }) === 'ping');
  assert(handle({ type: 'pong' }) === 'pong');
  console.log('027-exhaustive-switch: ok');
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
