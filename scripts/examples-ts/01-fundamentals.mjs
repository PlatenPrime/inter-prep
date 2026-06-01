/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 1,
    slug: 'structural-typing',
    folder: '01-fundamentals',
    title: 'Structural typing',
    tags: ['fundamentals', 'types'],
    difficulty: 'easy',
    theory: `TypeScript использует структурную (утиную) типизацию: совместимость определяется формой значения, а не именем типа.
Если у объекта есть все обязательные поля с подходящими типами — он подходит, даже если тип объявлен иначе.
Имена типов и интерфейсов — подсказки для разработчика; на этапе проверки важна только структура.
Лишние свойства при присваивании литерала могут вызвать ошибку excess property check, но через переменную — нет.
Строки, массивы и многие встроенные типы тоже структурны: у string есть length, поэтому string подходит туда, где ожидают { length: number }.
На собеседовании часто сравнивают с номинальной типизацией Java/C#.`,
    interview: `- Чем структурная типизация отличается от номинальной? — Совместимость по форме полей, а не по объявленному имени типа.
- Почему { x: 1, y: 2, z: 3 } иногда нельзя присвоить { x: number; y: number }? — Excess property check для свежих объектных литералов.
- Подойдёт ли string к типу { length: number }? — Да, структурно у строки есть length.`,
    related: 'webdev/14. ts/007-tipy-v-typescript.md',
    demo: `type HasLength = { length: number };

export function getLength(value: HasLength): number {
  return value.length;
}

export function lengthOfString(text: string): number {
  return getLength(text);
}

export function lengthOfArray(items: readonly unknown[]): number {
  return getLength(items);
}

type Point2D = { x: number; y: number };

export function magnitude(p: Point2D): number {
  return Math.hypot(p.x, p.y);
}

export function useLikePoint(obj: { x: number; y: number; label?: string }): number {
  return magnitude(obj);
}`,
    test: `assert(getLength('abc') === 3);
assert(getLength([1, 2, 3]) === 3);
assert(lengthOfString('hi') === 2);
assert(magnitude({ x: 3, y: 4 }) === 5);
assert(useLikePoint({ x: 0, y: 0, label: 'origin' }) === 0);`,
  },
  {
    num: 2,
    slug: 'inference-basics',
    folder: '01-fundamentals',
    title: 'Type inference basics',
    tags: ['fundamentals', 'inference'],
    difficulty: 'easy',
    theory: `Компилятор выводит типы там, где аннотация не обязательна: let x = 1 → number, const arr = [1, 'a'] → (string | number)[].
Параметры функций выводятся из тела и мест вызова; возвращаемый тип часто выводится из return.
Контекстная типизация: в колбэке .map(x => ...) тип x берётся из сигнатуры map.
При включённом noImplicitAny переменные без выводимого типа требуют аннотации.
Явная аннотация нужна, когда вывод слишком широкий (const → string | number) или когда API должно быть стабильным.
Generics усиливают вывод: createPair(1, 'a') даёт [number, string] без указания T, U.`,
    interview: `- Когда TypeScript выводит тип без аннотации? — При инициализации, return, generic-вызовах и контексте (колбэки).
- Что такое contextual typing? — Тип параметра выводится из ожидаемой сигнатуры снаружи.
- Зачем писать аннотацию вручную, если есть вывод? — Сузить тип, задокументировать контракт, обойти слишком широкий вывод.`,
    related: 'webdev/14. ts/002-osnovnye-komponenty-typescript.md',
    demo: `export function createPair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

export function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

export function mapValues<T, U>(items: readonly T[], fn: (item: T) => U): U[] {
  const out: U[] = [];
  for (const item of items) {
    out.push(fn(item));
  }
  return out;
}

export function sum(numbers: readonly number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

export type InferredPair = ReturnType<typeof createPair<number, string>>;`,
    test: `const p = createPair(1, 'x');
assert(p[0] === 1 && p[1] === 'x');
assert(first([10, 20]) === 10);
assert(first([]) === undefined);
assert(mapValues([1, 2], (n) => n * 2).join(',') === '2,4');
assert(sum([1, 2, 3]) === 6);`,
  },
  {
    num: 3,
    slug: 'literal-types',
    folder: '01-fundamentals',
    title: 'Literal types',
    tags: ['fundamentals', 'literals'],
    difficulty: 'easy',
    theory: `Литеральные типы — точные значения: 'ok', 42, true вместо string, number, boolean.
const x = 'left' с as const или без widening даёт union литералов или один литерал.
Литералы часто комбинируют в union: type Dir = 'up' | 'down' для дискриминантов и API.
Шаблонные литеральные типы (TS 4.1+): \`item-\${string}\` для префиксов в строках.
Без as const let status = 'idle' расширяется до string; с as const остаётся 'idle'.
Литералы помогают автодополнению и исчерпывающим switch без enum.`,
    interview: `- Чем literal type отличается от string? — Допускает только одно конкретное значение.
- Почему let mode = 'dark' имеет тип string? — Widening при let; const или as const сохраняют литерал.
- Зачем union литералов вместо enum? — Нет runtime, tree-shaking, проще для JSON API.`,
    demo: `export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type Theme = 'light' | 'dark';

export function buildUrl(path: string, method: HttpMethod): string {
  return method + ' ' + path;
}

export function themeLabel(theme: Theme): string {
  return theme === 'dark' ? 'Тёмная' : 'Светлая';
}

export function statusCodeMessage(code: 200 | 404 | 500): string {
  switch (code) {
    case 200:
      return 'OK';
    case 404:
      return 'Not Found';
    default:
      return 'Server Error';
  }
}

export const DEFAULT_THEME: Theme = 'light';`,
    test: `assert(buildUrl('/api', 'GET') === 'GET /api');
assert(themeLabel('dark') === 'Тёмная');
assert(themeLabel('light') === 'Светлая');
assert(statusCodeMessage(200) === 'OK');
assert(statusCodeMessage(404) === 'Not Found');`,
  },
  {
    num: 4,
    slug: 'readonly-mutable',
    folder: '01-fundamentals',
    title: 'readonly vs mutable',
    tags: ['fundamentals', 'immutability'],
    difficulty: 'medium',
    theory: `readonly запрещает присваивание полям и элементам на уровне типов; в runtime массив всё ещё можно мутировать без ReadonlyArray.
Readonly<T> делает все свойства объекта readonly; ReadonlyArray<T> — только чтение по индексу и методам.
readonly vs const: const — на уровне переменной (нельзя переназначить ссылку), readonly — на уровне свойства.
Глубокая иммутабельность требует рекурсивных mapped types (DeepReadonly) или библиотек.
При передаче в функцию readonly-массив совместим с mutable, но не наоборот без копии.
В React props часто помечают readonly для предотвращения мутаций в дочерних компонентах.`,
    interview: `- readonly защищает в runtime? — Нет, только compile-time; Object.freeze — отдельно.
- Можно ли передать number[] в readonly number[]? — Да (ковариантность чтения); обратно — нет.
- Чем ReadonlyArray отличается от readonly T[]? — Почти синонимы; ReadonlyArray — встроенный интерфейс.`,
    demo: `export type User = {
  readonly id: string;
  name: string;
};

export function renameUser(user: User, name: string): User {
  return { ...user, name };
}

export function total(nums: readonly number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

export function firstItem<T>(items: ReadonlyArray<T>): T | undefined {
  return items[0];
}

export function freezeCopy<T extends object>(obj: T): Readonly<T> {
  return Object.freeze({ ...obj }) as Readonly<T>;
}`,
    test: `const u: User = { id: '1', name: 'Ann' };
const u2 = renameUser(u, 'Bob');
assert(u2.name === 'Bob' && u2.id === '1');
assert(total([1, 2, 3]) === 6);
assert(firstItem(['a', 'b']) === 'a');
const frozen = freezeCopy({ x: 1 });
assert((frozen as { x: number }).x === 1);`,
  },
  {
    num: 5,
    slug: 'as-const',
    folder: '01-fundamentals',
    title: 'as const assertions',
    tags: ['fundamentals', 'const'],
    difficulty: 'medium',
    theory: `as const — утверждение const для выражения: все поля readonly, литералы не расширяются до примитивов.
Массив [1, 2] as const → readonly [1, 2], tuple, не number[].
Объект { role: 'admin' } as const → role: 'admin', не string.
Удобно для конфигов, routes, action types в Redux без enum.
typeof CONFIG as const даёт точный тип объекта для keyof и indexed access.
Комбинация с satisfies (TS 4.9): проверить форму и сохранить узкие литералы.`,
    interview: `- Что меняет as const для объекта? — Readonly, литеральные типы полей, tuple для массивов.
- as const vs satisfies? — as const сужает вывод; satisfies проверяет соответствие типу без потери литералов.
- Можно ли изменить as const массив? — Нет по типу; в runtime массив обычный, но TS запретит push.`,
    demo: `export const ROUTES = {
  home: '/',
  profile: '/profile',
  settings: '/settings',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export const STATUS = ['idle', 'loading', 'done'] as const;

export type AppStatus = (typeof STATUS)[number];

export function isRoute(path: string): path is RoutePath {
  return (Object.values(ROUTES) as string[]).includes(path);
}

export function statusIndex(status: AppStatus): number {
  return STATUS.indexOf(status);
}`,
    test: `assert(ROUTES.home === '/');
assert(isRoute('/profile') === true);
assert(isRoute('/unknown') === false);
assert(statusIndex('idle') === 0);
assert(statusIndex('done') === 2);`,
  },
  {
    num: 6,
    slug: 'satisfies',
    folder: '01-fundamentals',
    title: 'satisfies operator',
    tags: ['fundamentals', 'satisfies'],
    difficulty: 'medium',
    theory: `Оператор satisfies (TS 4.9) проверяет, что значение соответствует типу, но сохраняет узкий выведенный тип.
theme satisfies Record<string, Theme> — все значения Theme, но ключи остаются конкретными для автодополнения.
Альтернатива: as ThemeConfig теряет литералы ключей; аннотация : ThemeConfig расширяет всё поле.
Типичный кейс: палитра цветов, словарь локалей, map статусов с проверкой полноты.
Ошибки satisfies указывают на конкретное несоответствие, не меняя inferred type.
Часто используют вместе с as const для строгих конфигов.`,
    interview: `- satisfies vs : Type на переменной? — satisfies не расширяет литералы; аннотация сужает до объявленного типа.
- satisfies vs as? — satisfies проверяет структуру; as — принудительное утверждение без проверки.
- Когда satisfies бесполезен? — Когда и так нужен широкий тип Record<string, unknown>.`,
    related: 'webdev/14. ts/003-osobennosti-typescript.md',
    demo: `type Color = '#000' | '#fff' | '#f00';

type ColorPalette = Record<string, Color>;

export const palette = {
  text: '#000',
  bg: '#fff',
  danger: '#f00',
} satisfies ColorPalette;

export type PaletteKey = keyof typeof palette;

export function pickColor(key: PaletteKey): Color {
  return palette[key];
}

export const ENDPOINTS = {
  users: '/api/users',
  posts: '/api/posts',
} as const satisfies Record<string, \`/\${string}\`>;

export function endpointKeys(): (keyof typeof ENDPOINTS)[] {
  return Object.keys(ENDPOINTS) as (keyof typeof ENDPOINTS)[];
}`,
    test: `assert(pickColor('text') === '#000');
assert(pickColor('danger') === '#f00');
assert(ENDPOINTS.users === '/api/users');
const keys = endpointKeys();
assert(keys.includes('users') && keys.includes('posts'));`,
  },
  {
    num: 7,
    slug: 'annotations-when',
    folder: '01-fundamentals',
    title: 'When to annotate',
    tags: ['fundamentals', 'best-practices'],
    difficulty: 'medium',
    theory: `Аннотируйте публичный API функций и экспортируемых сущностей — контракт виден без чтения тела.
Внутри функции полагайтесь на вывод, если он точный; иначе укажите тип для промежуточных переменных.
Параметры колбэков часто не нужны — contextual typing подставит тип из .filter, .map.
Явный возвращаемый тип функции ловит ошибки return и стабилизирует API при рефакторинге.
Избегайте избыточных : string у очевидных литералов и дублирования того, что уже вывелось.
В tsconfig включайте noImplicitAny и strict — они заставляют аннотировать только проблемные места.`,
    interview: `- Нужен ли return type у private функции? — Желателен при сложной логике; иначе вывод достаточен.
- Зачем аннотация при пустом массиве []? — Без неё тип never[]; нужен number[] или generic.
- Где аннотация вредна? — Когда дублирует вывод и мешает сужению (лишний string вместо литерала).`,
    demo: `export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export function parsePositive(input: string): Result<number> {
  const n = Number(input);
  if (!Number.isFinite(n) || n <= 0) {
    return { ok: false, error: 'not a positive number' };
  }
  return { ok: true, value: n };
}

export function filterEvens(values: readonly number[]): number[] {
  return values.filter((n): n is number => n % 2 === 0);
}

export function createEmpty<T>(): T[] {
  const items: T[] = [];
  return items;
}

export function last<T>(arr: readonly T[]): T | undefined {
  return arr[arr.length - 1];
}`,
    test: `const ok = parsePositive('42');
assert(ok.ok === true && ok.ok && ok.value === 42);
const bad = parsePositive('-1');
assert(bad.ok === false);
assert(filterEvens([1, 2, 3, 4]).join(',') === '2,4');
assert(createEmpty<number>().length === 0);
assert(last([1, 2, 3]) === 3);`,
  },
  {
    num: 8,
    slug: 'any-unknown-never-void',
    folder: '01-fundamentals',
    title: 'any, unknown, never, void',
    tags: ['fundamentals', 'top-types'],
    difficulty: 'medium',
    theory: `any отключает проверку — избегайте; unknown — безопасный «всё»: сначала сузьте, потом используйте.
never — пустое множество: функция, которая всегда бросает, или ветка, которой не должно быть.
void — отсутствие полезного return; отличается от undefined (который значение).
unknown требует typeof, in, type guard перед доступом к свойствам.
never в union исчезает: string | never → string; в intersection доминирует.
Параметр rest never[] в unreachable helper — паттерн для assertNever.`,
    interview: `- unknown vs any? — unknown требует сужения; any пропускает всё.
- Когда функция возвращает never? — throw, бесконечный цикл, exhaustive default.
- void vs undefined в return? — void игнорирует возвращаемое значение; undefined — конкретное значение.`,
    related: 'webdev/14. ts/007-tipy-v-typescript.md',
    demo: `export function assertNever(x: never): never {
  throw new Error('Unexpected: ' + String(x));
}

export function parseJsonSafe(raw: string): unknown {
  return JSON.parse(raw);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function logAndReturnVoid(message: string): void {
  void message;
}

export function fail(msg: string): never {
  throw new Error(msg);
}

export type Unwrap<T> = T extends readonly (infer U)[] ? U : T;`,
    test: `assert(isRecord({ a: 1 }) === true);
assert(isRecord(null) === false);
assert(logAndReturnVoid('x') === undefined);
let parsed: unknown = parseJsonSafe('{"n":1}');
assert(isRecord(parsed));
try { fail('oops'); assert(false); } catch { assert(true); }`,
  },
  {
    num: 9,
    slug: 'strict-null',
    folder: '01-fundamentals',
    title: 'strictNullChecks',
    tags: ['fundamentals', 'null'],
    difficulty: 'medium',
    theory: `При strictNullChecks null и undefined — отдельные значения, не входящие в number, string, object.
Обращение к свойству без проверки на null — ошибка компиляции.
Опциональное поле T? эквивалентно T | undefined (не null, если явно не указан).
Non-null assertion obj!.prop — только если уверены; злоупотребление скрывает баги.
Optional chaining ?. и nullish ?? — идиоматичная работа с отсутствующими значениями.
Включайте strict в tsconfig для новых проектов — это стандарт индустрии.`,
    interview: `- Чем ?. отличается от &&? — ?. не срабатывает на 0 и ''; && может «проглотить» falsy.
- Можно ли присвоить null полю string? — Только если тип string | null.
- Зачем strictNullChecks? — Ловит NPE на этапе компиляции, особенно в API и DOM.`,
    demo: `export type UserProfile = {
  name: string;
  email?: string;
};

export function displayName(profile: UserProfile | null): string {
  if (profile === null) return 'Guest';
  return profile.name;
}

export function emailOrPlaceholder(profile: UserProfile): string {
  return profile.email ?? 'no-email@example.com';
}

export function firstChar(text: string | null | undefined): string {
  return text?.charAt(0) ?? '';
}

export function requireName(profile: UserProfile | null): string {
  if (!profile) throw new Error('profile required');
  return profile.name;
}`,
    test: `assert(displayName(null) === 'Guest');
assert(displayName({ name: 'Ann' }) === 'Ann');
assert(emailOrPlaceholder({ name: 'A' }) === 'no-email@example.com');
assert(emailOrPlaceholder({ name: 'A', email: 'a@b.c' }) === 'a@b.c');
assert(firstChar(null) === '');
assert(firstChar('hi') === 'h');`,
  },
  {
    num: 10,
    slug: 'compile-vs-check',
    folder: '01-fundamentals',
    title: 'Compile vs typecheck',
    tags: ['fundamentals', 'tooling'],
    difficulty: 'easy',
    theory: `TypeScript в типичном проекте: tsc или esbuild/swc компилируют TS → JS; типы стираются в runtime.
tsc --noEmit только проверяет типы без вывода файлов — CI и IDE.
Babel/swc могут transpile без проверки типов — тогда нужен отдельный tsc --noEmit.
declaration (.d.ts) генерируется tsc для библиотек; implements/extends существуют только в compile time.
Ошибки типов не попадают в браузер — если сборка не блокируется на типах, баги возможны в prod.
tsx запускает TS напрямую через esbuild — быстро, подходит для примеров и скриптов.`,
    interview: `- Есть ли типы в скомпилированном JS? — Нет, erasure; остаётся только JS.
- Зачем --noEmit в CI? — Быстрая проверка без артефактов; параллельно с bundler.
- Можно ли писать .ts без компиляции? — Deno/tsx выполняют на лету; Node — через transpile.`,
    related: 'webdev/14. ts/001-chto-takoe-typescript.md',
    demo: `export type Id = string & { readonly __brand: unique symbol };

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
}`,
    test: `const id1 = createId('abc');
const id2 = createId('abc');
assert(sameId(id1, id2) === true);
assert(add(2, 3) === 5);
assert(runGreeter(greeter) === 'Hello, TypeScript');`,
  },
];
