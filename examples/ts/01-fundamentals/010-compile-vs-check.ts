/**
 * 010 — Compile vs typecheck
 * @tags fundamentals, tooling
 * @difficulty easy
 *
 * ## Теория
 * TypeScript в типичном проекте: tsc или esbuild/swc компилируют TS → JS; типы стираются в runtime.
 * tsc --noEmit только проверяет типы без вывода файлов — CI и IDE.
 * Babel/swc могут transpile без проверки типов — тогда нужен отдельный tsc --noEmit.
 * declaration (.d.ts) генерируется tsc для библиотек; implements/extends существуют только в compile time.
 * Ошибки типов не попадают в браузер — если сборка не блокируется на типах, баги возможны в prod.
 * tsx запускает TS напрямую через esbuild — быстро, подходит для примеров и скриптов.
 *
 * ## На собеседовании
 * - Есть ли типы в скомпилированном JS? — Нет, erasure; остаётся только JS.
 * - Зачем --noEmit в CI? — Быстрая проверка без артефактов; параллельно с bundler.
 * - Можно ли писать .ts без компиляции? — Deno/tsx выполняют на лету; Node — через transpile.
 *
 * ## Связанные темы
 * webdev/14. ts/001-chto-takoe-typescript.md
 */

export type Id = string & { readonly __brand: unique symbol };

export function createId(raw: string): Id {
  return raw as Id;
}

export function sameId(a: Id, b: Id): boolean {
  return a === b;
}

export function add(a: number, b: number): number {
  return a + b;
}

export interface Greeter {
  greet(name: string): string;
}

export const greeter: Greeter = {
  greet(name) {
    return 'Hello, ' + name;
  },
};

export function runGreeter(g: Greeter): string {
  return g.greet('TypeScript');
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const id1 = createId('abc');
  const id2 = createId('abc');
  assert(sameId(id1, id2) === true);
  assert(add(2, 3) === 5);
  assert(runGreeter(greeter) === 'Hello, TypeScript');
  console.log('010-compile-vs-check: ok');
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
