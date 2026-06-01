/**
 * 096 — Module augmentation
 * @tags modules, augmentation
 * @difficulty hard
 *
 * ## Теория
 * declare module "express" { interface Request { user?: User } } — дополняет существующий модуль. Работает при module augmentation и interface merging. Нельзя менять уже использованные примитивные поля.
 *
 * ## На собеседовании
 * Augment third-party vs wrapper type. global augmentation vs module. Риск при обновлении библиотеки — конфликт типов.
 *
 * ## Связанные темы
 * declare module, interface merging.
 */

export interface ApiClient {
  baseUrl: string;
  get<T>(path: string): Promise<T>;
}

export interface ApiClient {
  /** augmentation-style: второе объявление interface сливается */
  defaultHeaders?: Record<string, string>;
}

export function createClient(baseUrl: string, defaultHeaders?: Record<string, string>): ApiClient {
  return {
    baseUrl,
    defaultHeaders,
    async get<T>(path: string): Promise<T> {
      const headers = defaultHeaders ?? {};
      void headers;
      return { path, baseUrl } as T;
    },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const c = createClient('https://api', { Authorization: 'Bearer x' });
  assert(c.defaultHeaders?.Authorization === 'Bearer x');
  console.log('096-module-augmentation: ok');
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
