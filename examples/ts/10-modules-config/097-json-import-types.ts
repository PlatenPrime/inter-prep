/**
 * 097 — Импорт JSON и типы
 * @tags modules, json
 * @difficulty medium
 *
 * ## Теория
 * resolveJsonModule + import data from "./x.json" с типом. assert { type: "json" } в import attributes (ES). Тип выводится из содержимого или задаётся вручную.
 *
 * ## На собеседовании
 * JSON import vs fetch + zod parse. readonly deep объекты из JSON. bundler (Vite) vs tsc paths для json.
 *
 * ## Связанные темы
 * satisfies, zod validation.
 */

export type PackageMeta = {
  name: string;
  version: string;
  private?: boolean;
};

export function parsePackageMeta(json: unknown): PackageMeta {
  if (typeof json !== 'object' || json === null) throw new Error('not object');
  const o = json as Record<string, unknown>;
  if (typeof o.name !== 'string' || typeof o.version !== 'string') {
    throw new Error('invalid package.json shape');
  }
  return {
    name: o.name,
    version: o.version,
    private: typeof o.private === 'boolean' ? o.private : undefined,
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const meta = parsePackageMeta({ name: 'app', version: '2.0.0', private: true });
  assert(meta.name === 'app' && meta.private === true);
  console.log('097-json-import-types: ok');
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
