/**
 * 099 — paths и алиасы
 * @tags config, paths
 * @difficulty medium
 *
 * ## Теория
 * compilerOptions.paths: { "@app/*": ["src/*"] } — разрешение импортов для tsc и IDE. Bundler (Vite) дублирует alias в resolve.alias. baseUrl обязателен для относительных paths.
 *
 * ## На собеседовании
 * paths не меняют emit без tsc-alias / bundler. @/* vs ~/*. monorepo references и project references.
 *
 * ## Связанные темы
 * moduleResolution, project references.
 */

/** Логическое разрешение алиаса @app/* → src/* (как в tsconfig paths) */
export function resolveLogicalImport(specifier: string): string {
  if (specifier.startsWith('@app/')) {
    return specifier.replace('@app/', 'src/');
  }
  return specifier;
}

export function isAliasSpecifier(specifier: string): boolean {
  return specifier.startsWith('@') && !specifier.startsWith('@types/');
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  assert(resolveLogicalImport('@app/utils') === 'src/utils');
  assert(resolveLogicalImport('./local') === './local');
  assert(isAliasSpecifier('@app/x') === true);
  assert(isAliasSpecifier('./x') === false);
  console.log('099-paths-aliases: ok');
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
