/**
 * 095 — Namespace (legacy)
 * @tags modules, namespace
 * @difficulty medium
 *
 * ## Теория
 * namespace Foo { export function bar() {} } — устаревший способ организации кода до ES modules. Сейчас предпочтительны modules. namespace всё ещё встречается в .d.ts и declaration merging.
 *
 * ## На собеседовании
 * namespace vs module keyword history. Когда namespace оправдан? Вложенные namespace, merging. Почему не использовать в новом коде?
 *
 * ## Связанные темы
 * declare module, augmentation.
 */

/** Имитация namespace через объект — runtime-паттерн */
export const MathKit = {
  clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  },
  lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  },
} as const;

export type MathKit = typeof MathKit;

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(MathKit.clamp(5, 0, 3) === 3);
  assert(MathKit.lerp(0, 10, 0.5) === 5);
  console.log('095-namespace-legacy: ok');
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
