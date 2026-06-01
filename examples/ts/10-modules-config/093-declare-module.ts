/**
 * 093 — declare module
 * @tags modules, ambient
 * @difficulty medium
 *
 * ## Теория
 * declare module "name" описывает форму импорта для JS без типов (.d.ts). Wildcard declare module "*.css". Позволяет типизировать legacy пакеты без @types.
 *
 * ## На собеседовании
 * Где класть declare module — global.d.ts vs types/. moduleResolution bundler vs node. Типизация default export vs namespace.
 *
 * ## Связанные темы
 * ambient global, module augmentation.
 */

/** Локальная «заглушка» для демо — в реальном проекте это был бы .d.ts */
export type LegacyConfig = {
  apiUrl: string;
  timeout: number;
};

export function parseLegacyConfig(raw: Record<string, unknown>): LegacyConfig {
  const apiUrl = raw.apiUrl;
  const timeout = raw.timeout;
  if (typeof apiUrl !== 'string' || typeof timeout !== 'number') {
    throw new Error('invalid legacy config');
  }
  return { apiUrl, timeout };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const cfg = parseLegacyConfig({ apiUrl: 'https://x', timeout: 1000 });
  assert(cfg.timeout === 1000);
  console.log('093-declare-module: ok');
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
