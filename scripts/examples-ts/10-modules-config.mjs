/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 91,
    slug: 'esm-import-export',
    folder: '10-modules-config',
    title: 'ESM import / export',
    tags: ['modules', 'esm'],
    difficulty: 'easy',
    theory:
      'ES modules: export, export default, import { named }, import * as ns. Статический анализ импортов, tree-shaking. .ts компилируется в ESM или CJS по module в tsconfig.',
    interview:
      'ESM vs CommonJS: require dynamic, import() async. __dirname в ESM через import.meta.url. default export и рефакторинг имени.',
    related: 'type-only imports, package.json "type": "module".',
    demo: `export const VERSION = '1.0.0';

export function add(a: number, b: number): number {
  return a + b;
}

export default function multiply(a: number, b: number): number {
  return a * b;
}

export function describeOps(): string {
  return 'named:add, default:multiply';
}`,
    test: `assert(add(2, 3) === 5);
assert(multiply(2, 3) === 6);
assert(VERSION === '1.0.0');`,
  },
  {
    num: 92,
    slug: 'type-only-imports',
    folder: '10-modules-config',
    title: 'Type-only imports',
    tags: ['modules', 'types'],
    difficulty: 'medium',
    theory:
      'import type { T } и export type { T } — стираются при emit, не попадают в JS bundle. import { type T, value } — inline type modifier. Предотвращает циклические runtime зависимости ради типов.',
    interview:
      'import type vs import { type }. verbatimModuleSyntax в strict projects. Когда type import обязателен?',
    related: 'isolatedModules, enums emit.',
    demo: `export type Point = { x: number; y: number };

export type DistanceFn = (a: Point, b: Point) => number;

export const ORIGIN: Point = { x: 0, y: 0 };

export function manhattan(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function makePoint(x: number, y: number): Point {
  return { x, y };
}`,
    test: `const p = makePoint(3, 4);
assert(manhattan(ORIGIN, p) === 7);`,
  },
  {
    num: 93,
    slug: 'declare-module',
    folder: '10-modules-config',
    title: 'declare module',
    tags: ['modules', 'ambient'],
    difficulty: 'medium',
    theory:
      'declare module "name" описывает форму импорта для JS без типов (.d.ts). Wildcard declare module "*.css". Позволяет типизировать legacy пакеты без @types.',
    interview:
      'Где класть declare module — global.d.ts vs types/. moduleResolution bundler vs node. Типизация default export vs namespace.',
    related: 'ambient global, module augmentation.',
    demo: `/** Локальная «заглушка» для демо — в реальном проекте это был бы .d.ts */
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
}`,
    test: `const cfg = parseLegacyConfig({ apiUrl: 'https://x', timeout: 1000 });
assert(cfg.timeout === 1000);`,
  },
  {
    num: 94,
    slug: 'ambient-global',
    folder: '10-modules-config',
    title: 'Ambient global declarations',
    tags: ['modules', 'global'],
    difficulty: 'medium',
    theory:
      'declare global { interface Window { myApp: ... } } расширяет глобальные типы. declare const process в node types. Файл без import/export — script / ambient scope.',
    interview:
      'export {} чтобы файл стал module и можно было declare global. Разница window vs globalThis. Загрязнение global namespace — минимизировать.',
    related: 'declare module, namespace legacy.',
    demo: `export type AppGlobals = {
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
}`,
    test: `setAppGlobals({ buildId: 'b1', env: 'dev' });
assert(getAppGlobals().buildId === 'b1');`,
  },
  {
    num: 95,
    slug: 'namespace-legacy',
    folder: '10-modules-config',
    title: 'Namespace (legacy)',
    tags: ['modules', 'namespace'],
    difficulty: 'medium',
    theory:
      'namespace Foo { export function bar() {} } — устаревший способ организации кода до ES modules. Сейчас предпочтительны modules. namespace всё ещё встречается в .d.ts и declaration merging.',
    interview:
      'namespace vs module keyword history. Когда namespace оправдан? Вложенные namespace, merging. Почему не использовать в новом коде?',
    related: 'declare module, augmentation.',
    demo: `/** Имитация namespace через объект — runtime-паттерн */
export const MathKit = {
  clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  },
  lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  },
} as const;

export type MathKit = typeof MathKit;`,
    test: `assert(MathKit.clamp(5, 0, 3) === 3);
assert(MathKit.lerp(0, 10, 0.5) === 5);`,
  },
  {
    num: 96,
    slug: 'module-augmentation',
    folder: '10-modules-config',
    title: 'Module augmentation',
    tags: ['modules', 'augmentation'],
    difficulty: 'hard',
    theory:
      'declare module "express" { interface Request { user?: User } } — дополняет существующий модуль. Работает при module augmentation и interface merging. Нельзя менять уже использованные примитивные поля.',
    interview:
      'Augment third-party vs wrapper type. global augmentation vs module. Риск при обновлении библиотеки — конфликт типов.',
    related: 'declare module, interface merging.',
    demo: `export interface ApiClient {
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
}`,
    test: `const c = createClient('https://api', { Authorization: 'Bearer x' });
assert(c.defaultHeaders?.Authorization === 'Bearer x');`,
  },
  {
    num: 97,
    slug: 'json-import-types',
    folder: '10-modules-config',
    title: 'Импорт JSON и типы',
    tags: ['modules', 'json'],
    difficulty: 'medium',
    theory:
      'resolveJsonModule + import data from "./x.json" с типом. assert { type: "json" } в import attributes (ES). Тип выводится из содержимого или задаётся вручную.',
    interview:
      'JSON import vs fetch + zod parse. readonly deep объекты из JSON. bundler (Vite) vs tsc paths для json.',
    related: 'satisfies, zod validation.',
    demo: `export type PackageMeta = {
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
}`,
    test: `const meta = parsePackageMeta({ name: 'app', version: '2.0.0', private: true });
assert(meta.name === 'app' && meta.private === true);`,
  },
  {
    num: 98,
    slug: 'tsconfig-strict',
    folder: '10-modules-config',
    title: 'tsconfig strict options',
    tags: ['config', 'strict'],
    difficulty: 'medium',
    theory:
      'strict включает noImplicitAny, strictNullChecks, strictFunctionTypes и др. noUncheckedIndexedAccess, exactOptionalPropertyTypes — дополнительная строгость. strict — baseline для production TS.',
    interview:
      'Что ломает strictNullChecks? Как мигрировать legacy проект? strict: true vs отдельные флаги. useUnknownInCatchVariables.',
    related: 'narrowing, unknown, never.',
    demo: `export function strictPick<T extends object, K extends keyof T>(
  obj: T,
  key: K,
): T[K] {
  const value = obj[key];
  if (value === undefined && !(key in obj)) {
    throw new Error('missing key');
  }
  return value;
}

export function assertDefined<T>(value: T | null | undefined, msg?: string): T {
  if (value === null || value === undefined) {
    throw new Error(msg ?? 'expected defined value');
  }
  return value;
}`,
    test: `const o = { a: 1, b: undefined as number | undefined };
assert(strictPick(o, 'a') === 1);
assert(assertDefined(0) === 0);`,
  },
  {
    num: 99,
    slug: 'paths-aliases',
    folder: '10-modules-config',
    title: 'paths и алиасы',
    tags: ['config', 'paths'],
    difficulty: 'medium',
    theory:
      'compilerOptions.paths: { "@app/*": ["src/*"] } — разрешение импортов для tsc и IDE. Bundler (Vite) дублирует alias в resolve.alias. baseUrl обязателен для относительных paths.',
    interview:
      'paths не меняют emit без tsc-alias / bundler. @/* vs ~/*. monorepo references и project references.',
    related: 'moduleResolution, project references.',
    demo: `/** Логическое разрешение алиаса @app/* → src/* (как в tsconfig paths) */
export function resolveLogicalImport(specifier: string): string {
  if (specifier.startsWith('@app/')) {
    return specifier.replace('@app/', 'src/');
  }
  return specifier;
}

export function isAliasSpecifier(specifier: string): boolean {
  return specifier.startsWith('@') && !specifier.startsWith('@types/');
}`,
    test: `assert(resolveLogicalImport('@app/utils') === 'src/utils');
assert(resolveLogicalImport('./local') === './local');
assert(isAliasSpecifier('@app/x') === true);
assert(isAliasSpecifier('./x') === false);`,
  },
  {
    num: 100,
    slug: 'result-api-typing',
    folder: '10-modules-config',
    title: 'Result API typing',
    tags: ['config', 'result', 'api'],
    difficulty: 'medium',
    theory:
      'Discriminated union Result<T,E> = { ok: true; value: T } | { ok: false; error: E } — явные ошибки без throw. Сужение по ok. Альтернатива exceptions и Go-style errors.',
    interview:
      'Result vs throw vs Either from fp-ts. Типизация HTTP client с Result. ok narrowing в switch. never в exhaustive default.',
    related: 'discriminated unions, narrowing, assertNever.',
    demo: `export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E = Error> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

export function parsePositiveInt(input: string): Result<number, 'not-a-number' | 'not-positive'> {
  const n = Number(input);
  if (Number.isNaN(n)) return err('not-a-number');
  if (n <= 0) return err('not-positive');
  return ok(n);
}

export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  return result.ok ? result.value : fallback;
}`,
    test: `assert(parsePositiveInt('42').ok === true);
const bad = parsePositiveInt('-1');
assert(bad.ok === false);
if (!bad.ok) assert(bad.error === 'not-positive');
assert(unwrapOr(ok(1), 0) === 1);
assert(unwrapOr(err('x'), 0) === 0);`,
  },
];
