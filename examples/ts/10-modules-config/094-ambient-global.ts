/**
 * 094 — Ambient global declarations
 * @tags modules, global
 * @difficulty medium
 *
 * ## Теория
 * declare global { interface Window { myApp: ... } } расширяет глобальные типы. declare const process в node types. Файл без import/export — script / ambient scope.
 *
 * ## На собеседовании
 * export {} чтобы файл стал module и можно было declare global. Разница window vs globalThis. Загрязнение global namespace — минимизировать.
 *
 * ## Связанные темы
 * declare module, namespace legacy.
 */

export type AppGlobals = {
  buildId: string;
  env: 'dev' | 'prod';
};

const store: { current?: AppGlobals } = {};

export function setAppGlobals(globals: AppGlobals): void {
  store.current = globals;
}

export function getAppGlobals(): AppGlobals {
  if (!store.current) throw new Error('globals not set');
  return store.current;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  setAppGlobals({ buildId: 'b1', env: 'dev' });
  assert(getAppGlobals().buildId === 'b1');
  console.log('094-ambient-global: ok');
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
