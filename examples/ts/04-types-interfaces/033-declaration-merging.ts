/**
 * 033 — declaration merging
 * @tags interface, merging
 * @difficulty medium
 *
 * ## Теория
 * Одинаковые interface с одним именем в одной области сливаются (declaration merging).
 * Полезно для расширения глобальных типов и ambient-деклараций (@types).
 * type не сливается — повторное объявление type с тем же именем — ошибка.
 * Функции и namespace тоже участвуют в merging в advanced-сценариях.
 * В прикладном коде merging — для module augmentation, не для «дописать поля в рантайме».
 *
 * ## На собеседовании
 * - Почему merging только у interface? — Историческая модель TS для расширяемых деклараций.
 * - Опасность merging? — Неожиданные поля при одинаковых именах в больших проектах.
 * - type можно «дополнить»? — Нет; только новый алиас или intersection.
 *
 * ## Связанные темы
 * - webdev/14. ts/008-raznica-type-i-interface.md
 * - webdev/14. ts/025-klyuchevoe-slovo-declare.md
 */

export interface AppConfig {
  host: string;
}

export interface AppConfig {
  port: number;
  debug?: boolean;
}

export function buildBaseUrl(cfg: AppConfig): string {
  const proto = cfg.debug ? 'http' : 'https';
  return `${proto}://${cfg.host}:${cfg.port}`;
}

export function mergeRuntimeFlags(
  cfg: AppConfig,
  flags: Partial<Pick<AppConfig, 'debug'>>,
): AppConfig {
  return { ...cfg, ...flags };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const cfg: AppConfig = { host: 'api.local', port: 3000, debug: true };
  assert(buildBaseUrl(cfg) === 'http://api.local:3000');
  assert(mergeRuntimeFlags(cfg, { debug: false }).debug === false);
  console.log('033-declaration-merging: ok');
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
