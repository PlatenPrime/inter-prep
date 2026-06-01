/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 71,
    slug: 'mapped-basics',
    folder: '08-mapped-conditional',
    title: 'Mapped types — основы',
    tags: ['mapped-types', 'keyof'],
    difficulty: 'medium',
    theory:
      '[K in keyof T]: T[K] — цикл по ключам. Можно добавить readonly или ? через модификаторы. Создаёт новый объектный тип с теми же или преобразованными свойствами.',
    interview:
      'Как Partial реализован через mapped type? keyof T vs string для index signature. Ограничение: только известные ключи T.',
    related: 'Utility types Partial, Record, Pick.',
    demo: `type User = { id: string; name: string };

type Nullable<T> = { [K in keyof T]: T[K] | null };

export function mapValues<T extends object, R>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => R,
): { [K in keyof T]: R } {
  const out = {} as { [K in keyof T]: R };
  for (const k of Object.keys(obj) as (keyof T)[]) {
    out[k] = fn(obj[k], k);
  }
  return out;
}

type NullableUser = Nullable<User>;
const _nu: NullableUser = { id: null, name: 'Ann' };
void _nu;`,
    test: `const doubled = mapValues({ a: 1, b: 2 }, (v) => v * 2);
assert(doubled.a === 2 && doubled.b === 4);`,
  },
  {
    num: 72,
    slug: 'optional-mapped-modifiers',
    folder: '08-mapped-conditional',
    title: 'Модификаторы ? и readonly',
    tags: ['mapped-types', 'modifiers'],
    difficulty: 'medium',
    theory:
      'В mapped type: +? делает опциональным, -? убирает optional, +readonly / -readonly управляют мутабельностью. Required<T> = { [K in keyof T]-?: T[K] }.',
    interview:
      'Синтаксис -? в Required. Как сделать все поля readonly кроме одного? Комбинация Pick + mapped modifiers.',
    related: 'Partial, Required, Readonly utilities.',
    demo: `type Optionalize<T> = { [K in keyof T]?: T[K] };
type Definite<T> = { [K in keyof T]-?: T[K] };

export function pickDefined<T extends object>(obj: T): Definite<Partial<T>> {
  const out = {} as Record<string, unknown>;
  for (const k of Object.keys(obj) as (keyof T)[]) {
    if (obj[k] !== undefined) out[k as string] = obj[k];
  }
  return out as Definite<Partial<T>>;
}

type Loose = Optionalize<{ x: number }>;
const _l: Loose = {};
void _l;`,
    test: `const r = pickDefined({ a: 1, b: undefined as number | undefined });
assert(r.a === 1 && !('b' in r));`,
  },
  {
    num: 73,
    slug: 'template-literal-types',
    folder: '08-mapped-conditional',
    title: 'Template literal types',
    tags: ['template-literal', 'strings'],
    difficulty: 'medium',
    theory:
      'Строковые типы можно собирать как шаблоны: \`get\${Capitalize<Name>}\`. Uppercase, Lowercase, Capitalize, Uncapitalize — встроенные преобразования. Полезно для event names и CSS keys.',
    interview:
      'Как типизировать onClick/onFocus из union событий? Intrinsic string manipulation types. Ограничение: только string literal unions.',
    related: 'Mapped types с as clause, satisfies.',
    demo: `type EventName = 'click' | 'focus';
type HandlerName = \`on\${Capitalize<EventName>}\`;

export function toHandlerName(event: EventName): HandlerName {
  const cap = (event.charAt(0).toUpperCase() + event.slice(1)) as Capitalize<EventName>;
  return ('on' + cap) as HandlerName;
}

export function joinPath<S extends string, T extends string>(a: S, b: T): \`\${S}/\${T}\` {
  return (a + '/' + b) as \`\${S}/\${T}\`;
}

const _h: HandlerName = 'onClick';
void _h;`,
    test: `assert(toHandlerName('click') === 'onClick');
assert(joinPath('api', 'users') === 'api/users');`,
  },
  {
    num: 74,
    slug: 'conditional-basics',
    folder: '08-mapped-conditional',
    title: 'Conditional types — основы',
    tags: ['conditional', 'generics'],
    difficulty: 'medium',
    theory:
      'T extends U ? X : Y — условный тип. Проверка assignability. Распространяется на union слева (distributive) если T — naked type parameter.',
    interview:
      'Чем conditional отличается от if в runtime? extends проверяет совместимость, не runtime значение. never в ветках.',
    related: 'infer, distributive conditional, Exclude.',
    demo: `type IsString<T> = T extends string ? true : false;

export type TypeName<T> =
  T extends string ? 'string' :
  T extends number ? 'number' :
  T extends boolean ? 'boolean' :
  'object';

export function typeNameOf(value: unknown): TypeName<typeof value> {
  if (typeof value === 'string') return 'string' as TypeName<typeof value>;
  if (typeof value === 'number') return 'number' as TypeName<typeof value>;
  if (typeof value === 'boolean') return 'boolean' as TypeName<typeof value>;
  return 'object' as TypeName<typeof value>;
}

const _s: IsString<'hi'> = true;
void _s;`,
    test: `assert(typeNameOf('x') === 'string');
assert(typeNameOf(1) === 'number');
assert(typeNameOf(true) === 'boolean');`,
  },
  {
    num: 75,
    slug: 'infer-keyword',
    folder: '08-mapped-conditional',
    title: 'infer в conditional types',
    tags: ['conditional', 'infer'],
    difficulty: 'hard',
    theory:
      'infer R внутри extends позволяет вывести тип из позиции: Array<infer E> → E. infer только в true-ветке conditional. Можно infer несколько раз в одном типе.',
    interview:
      'Как извлечь element type из Promise<T>? UnpackPromise. infer в contravariant позициях — ограничения. ReturnType реализация через infer.',
    related: 'ReturnType, Awaited, tuple infer.',
    demo: `type UnpackArray<T> = T extends readonly (infer E)[] ? E : never;
type UnpackPromise<T> = T extends Promise<infer R> ? R : T;

export function firstOf<T>(arr: readonly T[]): T | undefined {
  return arr[0];
}

export async function awaitTyped<T>(p: Promise<T>): Promise<UnpackPromise<Promise<T>>> {
  return await p;
}

type Elem = UnpackArray<string[]>;
const _e: Elem = 'x';
void _e;`,
    test: `assert(firstOf([1, 2]) === 1);
assert(await awaitTyped(Promise.resolve(9)) === 9);`,
    runAsync: true,
  },
  {
    num: 76,
    slug: 'distributive-conditional',
    folder: '08-mapped-conditional',
    title: 'Distributive conditional types',
    tags: ['conditional', 'unions'],
    difficulty: 'hard',
    theory:
      'Если T — голый type parameter и T extends U, то T распределяется по union: (A|B) extends U ? X : Y → (A extends U ? X : Y) | (B extends U ? X : Y). Отключить: [T] extends [U].',
    interview:
      'Почему Exclude работает? Distributive law. Как обернуть T в tuple чтобы отключить distribution? [T] extends [string].',
    related: 'Exclude, Extract, union filtering.',
    demo: `type ToArray<T> = T extends unknown ? T[] : never;

export function filterByKind<T extends { kind: string }>(
  items: readonly T[],
  kind: T['kind'],
): Extract<T, { kind: typeof kind }>[] {
  return items.filter((i) => i.kind === kind) as Extract<T, { kind: typeof kind }>[];
}

type StrArr = ToArray<'a' | 'b'>;
const _sa: StrArr = ['a'];
void _sa;`,
    test: `const items = [{ kind: 'a' as const, v: 1 }, { kind: 'b' as const, v: 2 }];
const onlyA = filterByKind(items, 'a');
assert(onlyA.length === 1 && onlyA[0].v === 1);`,
  },
  {
    num: 77,
    slug: 'exclude-extract',
    folder: '08-mapped-conditional',
    title: 'Exclude и Extract через conditional',
    tags: ['conditional', 'utility-types'],
    difficulty: 'medium',
    theory:
      'Exclude<T,U> = T extends U ? never : T. Extract<T,U> = T extends U ? T : never. Реализованы distributive conditional. Фильтрация union без runtime.',
    interview:
      'Написать Exclude руками. Разница с Omit: Omit для object keys, Exclude для unions. never исчезает из union.',
    related: 'NonNullable, Pick, keyof.',
    demo: `type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;

export function tagsWithout<T extends string, E extends string>(
  all: readonly T[],
  remove: readonly E[],
): MyExclude<T, E>[] {
  const set = new Set(remove as readonly string[]);
  return all.filter((t) => !set.has(t)) as MyExclude<T, E>[];
}

type Colors = 'red' | 'green' | 'blue';
type Primary = MyExtract<Colors, 'red' | 'blue'>;
const _p: Primary = 'red';
void _p;`,
    test: `const left = tagsWithout(['a', 'b', 'c'] as const, ['b'] as const);
assert(left.length === 2 && left[0] === 'a');`,
  },
  {
    num: 78,
    slug: 'recursive-type-lite',
    folder: '08-mapped-conditional',
    title: 'Рекурсивные типы (lite)',
    tags: ['recursive', 'json'],
    difficulty: 'hard',
    theory:
      'Тип может ссылаться на себя: JsonValue = string | number | JsonValue[] | { [k: string]: JsonValue }. Ограничение глубины — compiler recursion limit. Для деревьев и nested API.',
    interview:
      'DeepPartial рекурсивно. Когда TS выдаёт "type instantiation excessively deep"? Остановка через interface + extends вместо alias.',
    related: 'JSON.parse typing, tree structures.',
    demo: `export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export function isJsonPrimitive(v: unknown): v is JsonPrimitive {
  return (
    v === null ||
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean'
  );
}

export function deepCloneJson<T extends JsonValue>(value: T): T {
  if (!isJsonPrimitive(value) && typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.map((x) => deepCloneJson(x as JsonValue)) as T;
    }
    const out: Record<string, JsonValue> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = deepCloneJson(v as JsonValue);
    }
    return out as T;
  }
  return value;
}`,
    test: `const tree = { a: [1, { b: true }] };
const copy = deepCloneJson(tree);
copy.a[1].b = false;
assert(tree.a[1].b === true);
assert(isJsonPrimitive(null));`,
  },
  {
    num: 79,
    slug: 'branded-types',
    folder: '08-mapped-conditional',
    title: 'Branded / nominal types',
    tags: ['branded', 'safety'],
    difficulty: 'medium',
    theory:
      'Structural typing не различает string userId и productId. Brand: type UserId = string & { readonly __brand: unique symbol }. Runtime — обычная строка, compile-time — несовместимы.',
    interview:
      'Brand vs validation (zod). Когда brand достаточно? opaque type pattern. Не путать с class wrapper.',
    related: 'as const, satisfies, validation libs.',
    demo: `declare const UserIdBrand: unique symbol;
export type UserId = string & { readonly [UserIdBrand]: true };

declare const EmailBrand: unique symbol;
export type Email = string & { readonly [EmailBrand]: true };

export function userId(id: string): UserId {
  if (!id) throw new Error('empty id');
  return id as UserId;
}

export function email(value: string): Email {
  if (!value.includes('@')) throw new Error('invalid email');
  return value as Email;
}

export function sameUser(a: UserId, b: UserId): boolean {
  return a === b;
}`,
    test: `const u1 = userId('u1');
const u2 = userId('u2');
assert(sameUser(u1, u1));
assert(email('a@b.co').includes('@'));
let bad = false;
try { email('nope'); } catch { bad = true; }
assert(bad);`,
  },
  {
    num: 80,
    slug: 'satisfies-mapped',
    folder: '08-mapped-conditional',
    title: 'satisfies и точные ключи',
    tags: ['satisfies', 'mapped'],
    difficulty: 'medium',
    theory:
      'expr satisfies T проверяет соответствие T, но сохраняет inferred literal тип (ключи, as const). Лучше as T, когда нужны узкие литералы без потери autocomplete.',
    interview:
      'satisfies vs as const vs annotation : Type. Record с satisfies для theme tokens. Ошибка на лишний ключ при satisfies + excess property check.',
    related: 'as const, Record, keyof.',
    demo: `type Theme = Record<'primary' | 'secondary', string>;

export function defineTheme<const T extends Theme>(theme: T): T {
  return theme;
}

export function keysOf<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

const palette = defineTheme({
  primary: '#2563eb',
  secondary: '#64748b',
} as const satisfies Theme);

void palette;`,
    test: `const t = defineTheme({ primary: '#000', secondary: '#fff' });
assert(keysOf(t).length === 2);
assert(t.primary === '#000');`,
  },
];
