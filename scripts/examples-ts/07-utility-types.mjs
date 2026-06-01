/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 61,
    slug: 'partial-required',
    folder: '07-utility-types',
    title: 'Partial и Required',
    tags: ['utility-types', 'partial', 'required'],
    difficulty: 'easy',
    theory:
      'Partial<T> делает каждое свойство T опциональным — удобно для PATCH и форм обновления. Required<T> обратная операция: все поля становятся обязательными. На уровне типов это mapped type с модификатором ?.',
    interview:
      'Partial для DTO обновления; runtime всё равно валидируй, какие поля пришли. Required<Pick<T,K>> — сделать обязательными только часть полей. DeepPartial — кастомный тип, встроенного нет.',
    related: 'Pick, Omit, Readonly — другие built-in utility types.',
    demo: `type User = { id: string; name: string; email?: string };

/** Runtime-аналог Partial: поверхностная копия без изменения вложенных объектов */
export function shallowPartial<T extends object>(obj: T): Partial<T> {
  return { ...obj };
}

/** Заполняет отсутствующие ключи значением по умолчанию (аналог Required на одном уровне) */
export function withDefaults<T extends object>(
  partial: Partial<T>,
  defaults: Required<T>,
): T {
  return { ...defaults, ...partial } as T;
}

const _demo: Partial<User> = { name: 'Ann' };
void _demo;`,
    test: `const full = { id: '1', name: 'Ann', email: 'a@x.com' };
const p = shallowPartial(full);
assert(p.name === 'Ann');
const merged = withDefaults({ name: 'Bob' }, full);
assert(merged.id === '1' && merged.name === 'Bob');`,
  },
  {
    num: 62,
    slug: 'pick-omit',
    folder: '07-utility-types',
    title: 'Pick и Omit',
    tags: ['utility-types', 'pick', 'omit'],
    difficulty: 'easy',
    theory:
      'Pick<T, K> оставляет только перечисленные ключи K. Omit<T, K> исключает ключи — эквивалент Pick<T, Exclude<keyof T, K>>. Работают только на первом уровне объекта.',
    interview:
      'Pick для публичного API и DTO; Omit чтобы убрать password/hash. Omit не удаляет вложенные поля. Для вложенности — кастомный mapped type.',
    related: 'Exclude, Extract — фильтрация union ключей.',
    demo: `type User = { id: string; name: string; password: string };

export function pickKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) {
    if (k in obj) out[k] = obj[k];
  }
  return out;
}

export function omitKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const out = { ...obj } as Record<string, unknown>;
  for (const k of keys) delete out[k as string];
  return out as Omit<T, K>;
}

type PublicUser = Pick<User, 'id' | 'name'>;
const _pu: PublicUser = { id: '1', name: 'Ann' };
void _pu;`,
    test: `const u = { id: '1', name: 'Ann', password: 'secret' };
const pub = pickKeys(u, ['id', 'name'] as const);
assert(pub.id === '1' && !('password' in pub));
const safe = omitKeys(u, ['password'] as const);
assert(safe.name === 'Ann' && !('password' in safe));`,
  },
  {
    num: 63,
    slug: 'record',
    folder: '07-utility-types',
    title: 'Record<K, V>',
    tags: ['utility-types', 'record'],
    difficulty: 'easy',
    theory:
      'Record<Keys, Value> строит объект с ключами из union Keys и одинаковым типом значения Value. Безопаснее index signature Record<string, unknown> для известного набора ключей.',
    interview:
      'Record<Role, string[]> для lookup-таблиц. Record vs Map: Record — plain object, Map — любые ключи. Partial<Record<K,V>> когда не все ключи заданы.',
    related: 'keyof, as const объекты для ключей.',
    demo: `type Role = 'admin' | 'user' | 'guest';

export function buildRecord<K extends string, V>(
  keys: readonly K[],
  valueFactory: (key: K) => V,
): Record<K, V> {
  const out = {} as Record<K, V>;
  for (const k of keys) out[k] = valueFactory(k);
  return out;
}

export function getFromRecord<K extends string, V>(
  table: Record<K, V>,
  key: K,
): V {
  return table[key];
}

const permissions: Record<Role, string[]> = buildRecord(
  ['admin', 'user', 'guest'] as const,
  (r) => [r + ':read'],
);
void permissions;`,
    test: `const t = buildRecord(['a', 'b'] as const, (k) => k.length);
assert(t.a === 1 && t.b === 1);
assert(getFromRecord(t, 'a') === 1);`,
  },
  {
    num: 64,
    slug: 'readonly-utility',
    folder: '07-utility-types',
    title: 'Readonly<T>',
    tags: ['utility-types', 'readonly'],
    difficulty: 'easy',
    theory:
      'Readonly<T> делает свойства readonly на первом уровне. Массивы становятся readonly T[]. Для глубокой иммутабельности нужен DeepReadonly (кастом). Object.freeze — runtime аналог поверхности.',
    interview:
      'Readonly не deep-freeze вложенных объектов. as const на объекте даёт readonly литералы. ReadonlyArray vs readonly T[].',
    related: 'const assertions, Object.freeze.',
    demo: `export function shallowFreeze<T extends object>(obj: T): Readonly<T> {
  return Object.freeze({ ...obj }) as Readonly<T>;
}

export function toMutableArray<T>(arr: readonly T[]): T[] {
  return [...arr];
}

type Config = Readonly<{ host: string; port: number }>;
const cfg: Config = { host: 'localhost', port: 3000 };
void cfg;`,
    test: `const o = shallowFreeze({ x: 1 });
assert(Object.isFrozen(o));
const m = toMutableArray([1, 2] as const);
m.push(3);
assert(m.length === 3);`,
  },
  {
    num: 65,
    slug: 'returntype-parameters',
    folder: '07-utility-types',
    title: 'ReturnType и Parameters',
    tags: ['utility-types', 'functions'],
    difficulty: 'medium',
    theory:
      'ReturnType<F> извлекает тип возвращаемого значения функции F. Parameters<F> — кортеж аргументов. Работают с typeof fn, не вызывая функцию. На перегрузках берёт последнюю сигнатуру.',
    interview:
      'Обёртки над библиотечными функциями без дублирования типов. ConstructorParameters для new. ThisParameterType для bind/call контекста.',
    related: 'Awaited для Promise, generics inference.',
    demo: `export function createLogger(prefix: string) {
  return (message: string, level: 'info' | 'error' = 'info') => {
    return \`[\${prefix}] \${level}: \${message}\`;
  };
}

type LogFn = ReturnType<typeof createLogger>;
type LogArgs = Parameters<LogFn>;

export function callWithArgs<F extends (...args: never[]) => unknown>(
  fn: F,
  args: Parameters<F>,
): ReturnType<F> {
  return fn(...args) as ReturnType<F>;
}

const _fn: LogFn = createLogger('app');
void (_fn as LogFn);`,
    test: `const log = createLogger('test');
const msg = callWithArgs(log, ['hello', 'info']);
assert(msg.includes('test') && msg.includes('hello'));`,
  },
  {
    num: 66,
    slug: 'awaited',
    folder: '07-utility-types',
    title: 'Awaited<T>',
    tags: ['utility-types', 'async'],
    difficulty: 'medium',
    theory:
      'Awaited<T> рекурсивно разворачивает Promise: Promise<string> → string, Promise<Promise<number>> → number. Полезно для типизации результатов async без ручного unwrap.',
    interview:
      'Awaited vs ReturnType для async: ReturnType даёт Promise<T>, Awaited — T. unwrap один уровень vs рекурсивно. С custom Thenable — осторожно.',
    related: 'ReturnType, async/await, Promise.all typing.',
    demo: `export async function fetchValue(): Promise<number> {
  return 42;
}

/** Runtime unwrap одного уровня Promise (демо идеи Awaited) */
export async function unwrapPromise<T>(value: T | Promise<T>): Promise<T> {
  return await value;
}

export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    'then' in value &&
    typeof (value as PromiseLike<unknown>).then === 'function'
  );
}

type Resolved = Awaited<ReturnType<typeof fetchValue>>;
const _r: Resolved = 0;
void _r;`,
    test: `const n = await unwrapPromise(Promise.resolve(7));
assert(n === 7);
assert(isPromiseLike(Promise.resolve(1)) === true);
assert(isPromiseLike(1) === false);`,
    runAsync: true,
  },
  {
    num: 67,
    slug: 'nonnullable-exclude-extract',
    folder: '07-utility-types',
    title: 'NonNullable, Exclude, Extract',
    tags: ['utility-types', 'unions'],
    difficulty: 'medium',
    theory:
      'NonNullable<T> убирает null и undefined. Exclude<T, U> удаляет из union T члены, присваиваемые U. Extract<T, U> оставляет только присваиваемые U. Основа фильтрации string literal unions.',
    interview:
      'Exclude для «все кроме error». Extract для выбора подмножества тегов. NonNullable после optional chaining в типах API.',
    related: 'infer, conditional types, discriminated unions.',
    demo: `type Status = 'idle' | 'loading' | 'success' | 'error';
type OkStatus = Exclude<Status, 'error'>;
type ErrOnly = Extract<Status, 'error'>;

export function excludeTag<T extends string, E extends T>(
  value: T,
  excluded: readonly E[],
): Exclude<T, E> {
  if ((excluded as readonly string[]).includes(value)) {
    throw new Error('excluded value');
  }
  return value as Exclude<T, E>;
}

export function stripNullish<T>(value: T | null | undefined): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('nullish');
  }
  return value as NonNullable<T>;
}

const _ok: OkStatus = 'success';
void _ok;`,
    test: `assert(excludeTag('idle' as Status, ['error'] as const) === 'idle');
assert(stripNullish('x') === 'x');
let threw = false;
try { stripNullish(null); } catch { threw = true; }
assert(threw);`,
  },
  {
    num: 68,
    slug: 'instancetype',
    folder: '07-utility-types',
    title: 'InstanceType<T>',
    tags: ['utility-types', 'classes'],
    difficulty: 'medium',
    theory:
      'InstanceType<typeof Class> — тип экземпляра конструктора. Работает с newable: abstract constructor тоже. Полезно для фабрик и DI без дублирования имени класса.',
    interview:
      'InstanceType vs ReturnType: второй для обычных функций. new (...args) => T pattern. Ограничение: нужен конструктор, не object literal.',
    related: 'ConstructorParameters, abstract class.',
    demo: `export class UserService {
  constructor(public readonly name: string) {}
  greet() {
    return 'Hello, ' + this.name;
  }
}

type ServiceInstance = InstanceType<typeof UserService>;

export function createInstance<C extends new (...args: never[]) => unknown>(
  Ctor: C,
  ...args: ConstructorParameters<C>
): InstanceType<C> {
  return new Ctor(...args) as InstanceType<C>;
}

const _inst: ServiceInstance = createInstance(UserService, 'Ann');
void _inst;`,
    test: `const s = createInstance(UserService, 'Bob');
assert(s.greet() === 'Hello, Bob');
assert(s.name === 'Bob');`,
  },
  {
    num: 69,
    slug: 'omit-indexed',
    folder: '07-utility-types',
    title: 'Omit по индексу и фильтр ключей',
    tags: ['utility-types', 'mapped'],
    difficulty: 'hard',
    theory:
      'Omit<T, K> реализуется через Pick + Exclude<keyof T, K>. Для фильтра по префиксу/суффиксу ключа — mapped type с as и template literal: OmitByPrefix<T, "set">.',
    interview:
      'Как написать OmitByPrefix без built-in Omit? keyof T + conditional на string. as clause в mapped types (TS 4.1+).',
    related: 'Mapped types, template literal types, Pick.',
    demo: `type Keys = 'id' | 'setName' | 'setAge' | 'getName';

type OmitSetters<T, P extends string> = {
  [K in keyof T as K extends \`\${P}\${string}\` ? never : K]: T[K];
};

export function omitKeysByPrefix<T extends object, P extends string>(
  obj: T,
  prefix: P,
): OmitSetters<T, P> {
  const out = {} as Record<string, unknown>;
  for (const k of Object.keys(obj) as (keyof T)[]) {
    if (typeof k === 'string' && k.startsWith(prefix)) continue;
    out[k as string] = obj[k];
  }
  return out as OmitSetters<T, P>;
}

type Api = { id: number; setName: (v: string) => void; getName: () => string };
type ApiReadonly = OmitSetters<Api, 'set'>;
const _a: ApiReadonly = { id: 1, getName: () => 'x' };
void _a;`,
    test: `const o = { id: 1, setX: 2, keep: 3 };
const trimmed = omitKeysByPrefix(o, 'set');
assert(trimmed.id === 1 && trimmed.keep === 3 && !('setX' in trimmed));`,
  },
  {
    num: 70,
    slug: 'combine-intersection',
    folder: '07-utility-types',
    title: 'Intersection и merge типов',
    tags: ['utility-types', 'intersection'],
    difficulty: 'medium',
    theory:
      'A & B — intersection: объект должен удовлетворять обоим типам. При конфликте свойств получаем never на этом ключе. Runtime merge — spread; типы — intersection или Overwrite utility.',
    interview:
      'Intersection vs extends. Почему { a: string } & { a: number } → never на a. Overwrite<T,U> для замены полей. Spread merge и потеря точности типов.',
    related: 'Union vs intersection, type compatibility.',
    demo: `type A = { id: string };
type B = { name: string };
type AB = A & B;

export function mergeObjects<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b };
}

/** Overwrite: поля U перекрывают T */
export type Overwrite<T, U> = Omit<T, keyof U & keyof T> & U;

export function overwriteField<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K],
): T {
  return { ...obj, [key]: value };
}

const _ab: AB = { id: '1', name: 'Ann' };
void _ab;`,
    test: `const m = mergeObjects({ id: '1' }, { name: 'Ann' });
assert(m.id === '1' && m.name === 'Ann');
const u = overwriteField({ id: '1', n: 0 }, 'n', 2);
assert(u.n === 2);`,
  },
];
