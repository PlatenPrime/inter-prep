/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 51,
    slug: 'generic-basics',
    folder: '06-generics',
    title: 'generic basics',
    tags: ['generics'],
    difficulty: 'easy',
    theory: `Generic <T> параметризует тип: один код — много конкретных типов без any.
T выводится из аргумента: identity(42) → T = number.
Имена T, K, V — конвенция; можно несколько букв (TItem).
Generics работают для function, class, interface, type alias.
Цель — сохранить связь между входом и выходом типа.`,
    interview: `- Generic vs any? — any теряет проверки; generic сохраняет T.
- Когда явный <T>? — Нет аргумента для inference или только в return type.
- Runtime generics? — Стираются; только compile-time.`,
    related: '- webdev/14. ts/013-genericheskie-tipy-generic.md',
    demo: `export function identity<T>(value: T): T {
  return value;
}

export function wrap<T>(value: T): { value: T } {
  return { value };
}

export function isArrayOf<T>(value: unknown, guard: (x: unknown) => x is T): value is T[] {
  return Array.isArray(value) && value.every(guard);
}

export function swap<T, U>(pair: [T, U]): [U, T] {
  return [pair[1], pair[0]];
}`,
    test: `assert(identity('ts') === 'ts');
assert(wrap(1).value === 1);
assert(swap([1, 'a'])[0] === 'a');
assert(isArrayOf([1, 2], (x): x is number => typeof x === 'number'));`,
  },
  {
    num: 52,
    slug: 'constraints-extends',
    folder: '06-generics',
    title: 'generic constraints',
    tags: ['generics', 'extends'],
    difficulty: 'medium',
    theory: `<T extends HasLength> ограничивает T: только типы, совместимые с constraint.
Constraint может быть interface, union bound, keyof object.
Компилятор разрешает доступ к полям constraint: T extends { id: string } → value.id.
Множественные bounds через intersection: T extends A & B.
Слишком широкий constraint → снова потеря точности; слишком узкий → не переиспользуется.`,
    interview: `- extends в generic vs extends interface? — Разный синтаксис; generic — upper bound для T.
- keyof в constraint? — T extends keyof Obj для безопасного доступа к ключам.
- default constraint? — T extends unknown по сути без ограничения.`,
    related: '- webdev/14. ts/013-genericheskie-tipy-generic.md',
    demo: `export interface HasId {
  id: string;
}

export function byId<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}

export function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}`,
    test: `const users = [{ id: '1', name: 'A' }, { id: '2', name: 'B' }];
assert(byId(users, '2')?.name === 'B');
assert(pluck({ x: 1, y: 2 }, 'y') === 2);
assert(longest('abc', 'de') === 'abc');`,
  },
  {
    num: 53,
    slug: 'default-type-param',
    folder: '06-generics',
    title: 'default type parameters',
    tags: ['generics', 'defaults'],
    difficulty: 'medium',
    theory: `<T = string> — если T не выведен и не указан, используется string.
Defaults для нескольких params справа налево: <T, U = T>.
Работает в functions, classes, interfaces, type aliases.
Полезно для контейнеров: ApiResponse<TData = unknown>.
Явное указание части params: fn<number>(...) при нескольких generics.`,
    interview: `- Когда default type param? — Разумный fallback (unknown, string, never).
- Можно ли T = U? — Да, если U объявлен раньше в списке.
- Default vs optional value param? — Разные уровни: тип vs значение.`,
    related: '- webdev/14. ts/013-genericheskie-tipy-generic.md\n- webdev/14. ts/022-opcjonalnye-i-defaultnye-parametry.md',
    demo: `export interface ApiResult<TData = unknown, TError = string> {
  data?: TData;
  error?: TError;
}

export function success<TData = unknown>(data: TData): ApiResult<TData> {
  return { data };
}

export function failure<TError = string>(error: TError): ApiResult<never, TError> {
  return { error };
}

export function createStore<TState = Record<string, unknown>>(initial?: TState) {
  let state = (initial ?? {}) as TState;
  return {
    get(): TState {
      return state;
    },
    set(next: TState) {
      state = next;
    },
  };
}`,
    test: `const ok = success(42);
assert(ok.data === 42);
const err = failure('fail');
assert(err.error === 'fail');
const store = createStore({ count: 0 });
store.set({ count: 1 });
assert(store.get().count === 1);`,
  },
  {
    num: 54,
    slug: 'multiple-params',
    folder: '06-generics',
    title: 'multiple type parameters',
    tags: ['generics'],
    difficulty: 'medium',
    theory: `Несколько params: <K, V> для ключей и значений Map-like API.
Связь между params: function merge<T, U>(a: T, b: U): T & U.
Tuple generics: function zip<T, U>(a: T[], b: U[]): [T, U][].
Порядок важен при partial explicit: fn<string, number>(...).
Избегай избыточных params — если U = T['key'], используй indexed access.`,
    interview: `- Сколько type params норм? — 1–3 часто; больше — сигнал упростить API.
- Связанные generics? — U extends T или U = keyof T patterns.
- Inference нескольких T? — Из разных аргументов, должен быть один solution.`,
    related: '- webdev/14. ts/013-genericheskie-tipy-generic.md',
    demo: `export function tuple<T, U>(a: T, b: U): [T, U] {
  return [a, b];
}

export function mapPair<T, U, V>(pair: [T, U], fn: (t: T, u: U) => V): V {
  return fn(pair[0], pair[1]);
}

export function buildMap<K extends string, V>(
  entries: [K, V][],
): Record<K, V> {
  const out = {} as Record<K, V>;
  for (const [k, v] of entries) out[k] = v;
  return out;
}

export function zip<T, U>(as: T[], bs: U[]): [T, U][] {
  const len = Math.min(as.length, bs.length);
  const out: [T, U][] = [];
  for (let i = 0; i < len; i++) out.push([as[i], bs[i]]);
  return out;
}`,
    test: `assert(mapPair(tuple(1, 'a'), (n, s) => \`\${n}\${s}\`) === '1a');
assert(buildMap([['x', 1], ['y', 2]]).y === 2);
assert(zip([1, 2], ['a', 'b'])[1][1] === 'b');`,
  },
  {
    num: 55,
    slug: 'generic-class',
    folder: '06-generics',
    title: 'generic class',
    tags: ['generics', 'class'],
    difficulty: 'medium',
    theory: `class Box<T> { value: T } — T на уровне экземпляра и методов.
static members не могут использовать class type param T напрямую (нужен отдельный static generic).
new Box<number>(1) — inference через constructor.
Наследование: class StringBox extends Box<string> { }.
Generic class vs generic factory function — выбор по ООП vs functional style.`,
    interview: `- Generic class vs interface? — Class — value + type; interface — только type.
- static <T> method? — Отдельный method-level generic, не class T.
- private fields + generic? — Поля типизируются T как обычно.`,
    related: '- webdev/14. ts/013-genericheskie-tipy-generic.md\n- webdev/14. ts/018-elementy-oop-v-typescript.md',
    demo: `export class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}

export class Pair<T, U> {
  constructor(
    readonly first: T,
    readonly second: U,
  ) {}

  swap(): Pair<U, T> {
    return new Pair(this.second, this.first);
  }
}`,
    test: `const s = new Stack<number>();
s.push(1);
s.push(2);
assert(s.pop() === 2);
assert(s.peek() === 1);
const p = new Pair('a', 1).swap();
assert(p.first === 1 && p.second === 'a');`,
  },
  {
    num: 56,
    slug: 'generic-interface',
    folder: '06-generics',
    title: 'generic interface',
    tags: ['generics', 'interface'],
    difficulty: 'medium',
    theory: `interface Repository<T> { get(id: string): Promise<T | null> } — контракт для любой сущности.
Generic interface реализуют классы: class UserRepo implements Repository<User>.
Default type params в interface: interface Page<TItem = unknown>.
Type alias с generics эквивалентен для объектных форм: type Repo<T> = { ... }.`,
    interview: `- interface generic vs class generic? — Interface — только shape; class — runtime.
- implements Repository<T>? — Класс должен совпасть по всем методам.
- Covariance в interface? — См. variance-intro (readonly помогает).`,
    related: '- webdev/14. ts/013-genericheskie-tipy-generic.md\n- webdev/14. ts/008-raznica-type-i-interface.md',
    demo: `export interface Repository<T> {
  findById(id: string): T | undefined;
  save(entity: T): void;
}

export interface Identified {
  id: string;
}

export class MemoryRepo<T extends Identified> implements Repository<T> {
  private store = new Map<string, T>();

  findById(id: string): T | undefined {
    return this.store.get(id);
  }

  save(entity: T): void {
    this.store.set(entity.id, entity);
  }

  count(): number {
    return this.store.size;
  }
}

export function loadOrCreate<T extends Identified>(
  repo: Repository<T>,
  id: string,
  factory: () => T,
): T {
  const existing = repo.findById(id);
  if (existing) return existing;
  const created = factory();
  repo.save(created);
  return created;
}`,
    test: `const repo = new MemoryRepo<{ id: string; v: number }>();
repo.save({ id: '1', v: 10 });
assert(repo.findById('1')?.v === 10);
const e = loadOrCreate(repo, '2', () => ({ id: '2', v: 0 }));
assert(e.id === '2' && repo.count() === 2);`,
  },
  {
    num: 57,
    slug: 'keyof-constraint',
    folder: '06-generics',
    title: 'keyof constraint',
    tags: ['generics', 'keyof'],
    difficulty: 'hard',
    theory: `keyof T — union всех ключей объекта; T[K] — indexed access type.
<T, K extends keyof T> safeGet(obj, key) возвращает T[K].
const keys: (keyof User)[] — только валидные ключи.
keyof any → string | number | symbol; keyof never → never.
Связка с generics — основа typed pick/omit/get utilities.`,
    interview: `- keyof union object? — keyof (A | B) = keyof A & keyof B.
- Почему K extends keyof T? — Чтобы key и return type связаны.
- keyof vs Object.keys? — keyof compile-time; keys runtime string[].`,
    related: '- webdev/14. ts/013-genericheskie-tipy-generic.md\n- webdev/14. ts/014-utilitarnye-tipy-utility-types.md',
    demo: `export function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export function setProp<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value };
}

export function pickKeys<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) out[k] = obj[k];
  return out;
}

export function hasKey<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj;
}`,
    test: `const user = { id: '1', name: 'Ann', age: 30 };
assert(getProp(user, 'name') === 'Ann');
assert(setProp(user, 'age', 31).age === 31);
assert(pickKeys(user, ['id', 'name']).name === 'Ann');
assert(hasKey(user, 'id'));`,
  },
  {
    num: 58,
    slug: 'typeof-value-types',
    folder: '06-generics',
    title: 'typeof value types',
    tags: ['generics', 'typeof'],
    difficulty: 'medium',
    theory: `typeof variable в type position — тип значения (не JS typeof).
const config = { ... } as const → typeof config с readonly literals.
Связка с generics: function createApi<T extends typeof defaults>(partial: Partial<T>).
typeof import('./mod') для типов модуля.
Отличие: type-only typeof vs runtime typeof operator в value position.`,
    interview: `- typeof в type vs value? — Разные пространства; одно имя — два смысла.
- Зачем typeof defaults? — DRY: тип конфига из эталонного объекта.
- as const + typeof? — Узкие literal types для ключей и значений.`,
    related: '- webdev/14. ts/013-genericheskie-tipy-generic.md\n- webdev/14. ts/007-tipy-v-typescript.md',
    demo: `export const defaultOptions = {
  mode: 'strict' as const,
  retries: 3,
  timeoutMs: 1000,
} as const;

export type DefaultOptions = typeof defaultOptions;
export type Mode = DefaultOptions['mode'];

export function mergeOptions(
  overrides: Partial<DefaultOptions>,
): DefaultOptions {
  return { ...defaultOptions, ...overrides };
}

export function getModeLabel(mode: Mode): string {
  return mode === 'strict' ? 'Strict' : 'Strict';
}

export function optionsFrom<T extends typeof defaultOptions>(base: T): T {
  return base;
}`,
    test: `const merged = mergeOptions({ retries: 5 });
assert(merged.retries === 5);
assert(merged.mode === 'strict');
assert(getModeLabel('strict') === 'Strict');
assert(optionsFrom(defaultOptions).timeoutMs === 1000);`,
  },
  {
    num: 59,
    slug: 'conditional-in-generic',
    folder: '06-generics',
    title: 'conditional in generics',
    tags: ['generics', 'conditional'],
    difficulty: 'hard',
    theory: `Условный тип: T extends U ? X : Y — зависит от совместимости T и U.
В generic: type Unwrap<T> = T extends Promise<infer U> ? U : T.
Distributive conditional: T extends Array<infer E> ? E[] : T при T union.
Используется в utility types, overload-like type logic.
infer — извлечь тип изнутри Promise/Array в conditional branch.`,
    interview: `- Distributive когда? — T naked type parameter слева от extends.
- infer где? — Только в extends ветке conditional type.
- Conditional vs function overload? — Type-level vs call-level.`,
    related: '- webdev/14. ts/013-genericheskie-tipy-generic.md\n- webdev/14. ts/014-utilitarnye-tipy-utility-types.md',
    demo: `export type IsString<T> = T extends string ? true : false;

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export function unwrapValue<T>(value: T): UnwrapPromise<T> {
  if (value instanceof Promise) {
    throw new Error('use unwrapValueAsync for promises');
  }
  return value as UnwrapPromise<T>;
}

export async function unwrapValueAsync<T>(value: T): Promise<UnwrapPromise<T>> {
  return (await value) as UnwrapPromise<T>;
}

export type Flatten<T> = T extends readonly (infer E)[] ? E : T;

export function flattenOne<T>(value: T): Flatten<T> {
  return (Array.isArray(value) ? value[0] : value) as Flatten<T>;
}`,
    test: `assert(unwrapValue(42) === 42);
assert(flattenOne([1, 2, 3]) === 1);
const p = await unwrapValueAsync(Promise.resolve('ok'));
assert(p === 'ok');`,
    runAsync: true,
  },
  {
    num: 60,
    slug: 'variance-intro',
    folder: '06-generics',
    title: 'variance intro',
    tags: ['generics', 'variance'],
    difficulty: 'hard',
    theory: `Variance — как подтип связи T ↔ подтип F<T>.
Ковариантность: Dog <: Animal → Producer<Dog> usable as Producer<Animal> (readonly).
Контравариантность: для input (function params) направление обратное.
Инвариантность: Mutable<Box<Dog>> не assignable to Mutable<Box<Animal>>.
TS проверяет variance в strictFunctionTypes; readonly массивы ковариантны.`,
    interview: `- Почему Array<Dog> не Array<Animal>? — push(string) сломает типы (инвариантность).
- readonly T[]? — Ковариантны — нельзя мутировать чужой элемент.
- Где contravariance? — Параметры функций в strict mode.`,
    related: '- webdev/14. ts/013-genericheskie-tipy-generic.md\n- webdev/14. ts/003-osobennosti-typescript.md',
    demo: `export type Animal = { name: string };
export type Dog = Animal & { breed: string };

export function readFirst<T extends Animal>(items: readonly T[]): T | undefined {
  return items[0];
}

export function describeAnimal(getName: (a: Animal) => string, dog: Dog): string {
  return getName(dog);
}

export function animalNames(animals: readonly Animal[]): string[] {
  return animals.map((a) => a.name);
}

export function isDog(a: Animal): a is Dog {
  return 'breed' in a;
}`,
    test: `const dogs: Dog[] = [
  { name: 'Rex', breed: 'corgi' },
  { name: 'Max', breed: 'lab' },
];
assert(readFirst(dogs)?.name === 'Rex');
assert(describeAnimal((a) => a.name, dogs[0]) === 'Rex');
assert(animalNames(dogs).length === 2);
assert(isDog(dogs[0]));`,
  },
];
