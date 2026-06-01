/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 11,
    slug: 'union-basics',
    folder: '02-unions-nullability',
    title: 'Union types basics',
    tags: ['unions', 'types'],
    difficulty: 'easy',
    theory: `Union A | B — значение одного из типов; доступны только общие операции без сужения.
Сужение (narrowing) обязательно перед методами конкретного типа: typeof, in, discriminant.
Union из литералов — основа для статусов, ролей, вариантов UI без enum.
Порядок union в отображении не важен: string | number ≡ number | string.
При присваивании переменной union нужно подходящее значение любой ветки.
Большие union замедляют компилятор — группируйте или используйте базовый тип + литералы.`,
    interview: `- Что общего у string | number без narrowing? — Только операции, допустимые для обоих.
- Union vs enum на runtime? — Union исчезает; enum может оставить объект.
- Как безопасно вызвать .toFixed на string | number? — if (typeof x === 'number').`,
    related: 'webdev/14. ts/007-tipy-v-typescript.md',
    demo: `export type StringOrNumber = string | number;

export function formatId(value: StringOrNumber): string {
  if (typeof value === 'number') return '#' + value.toFixed(0);
  return value.toUpperCase();
}

export type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };

export function area(shape: Shape): number {
  if (shape.kind === 'circle') return Math.PI * shape.radius ** 2;
  return shape.side ** 2;
}

export function describe(value: string | boolean): string {
  return typeof value === 'string' ? value : value ? 'yes' : 'no';
}`,
    test: `assert(formatId(42) === '#42');
assert(formatId('ab') === 'AB');
assert(Math.round(area({ kind: 'square', side: 2 })) === 4);
assert(describe(true) === 'yes');
assert(describe('hi') === 'hi');`,
  },
  {
    num: 12,
    slug: 'intersection',
    folder: '02-unions-nullability',
    title: 'Intersection types',
    tags: ['unions', 'intersection'],
    difficulty: 'medium',
    theory: `Intersection A & B — значение должно удовлетворять обоим типам одновременно (merge полей).
Часто комбинируют object types: User & Timestamps → id, name, createdAt.
С примитивами intersection обычно даёт never: string & number — невозможно.
interface A extends B — номинальное наследование; A & B — композиция структур.
Mixin-паттерн: function withTimestamps<T>(obj: T): T & { createdAt: Date }.
Пересечение с union распределяется: (A | B) & C → (A & C) | (B & C) (в ряде случаев).`,
    interview: `- A & B для двух object types? — Объединение всех свойств; конфликт имён → never на поле.
- Intersection vs extends? — & композиция без иерархии; extends — один родитель interface.
- string & number — что это? — never; значение не существует.`,
    demo: `export type Timestamps = { createdAt: Date; updatedAt: Date };

export type Named = { name: string };

export type NamedEntity = Named & Timestamps;

export function withTimestamps<T extends object>(obj: T): T & Timestamps {
  const now = new Date(0);
  return { ...obj, createdAt: now, updatedAt: now };
}

export type Admin = { role: 'admin'; permissions: string[] };
export type Member = { role: 'member'; teamId: string };
export type Staff = Admin | Member;

export function staffLabel(person: Staff & Named): string {
  return person.name + ' (' + person.role + ')';
}`,
    test: `const e = withTimestamps({ name: 'Doc' });
assert(e.name === 'Doc' && e.createdAt instanceof Date);
const admin: Admin & Named = { role: 'admin', permissions: ['*'], name: 'Root' };
assert(staffLabel(admin) === 'Root (admin)');`,
  },
  {
    num: 13,
    slug: 'optional-props',
    folder: '02-unions-nullability',
    title: 'Optional properties',
    tags: ['unions', 'optional'],
    difficulty: 'easy',
    theory: `Свойство foo?: T означает T | undefined; поле может отсутствовать в литерале.
Отличие от foo: T | undefined — при strict optional поле может быть явно undefined.
Required<T> и Partial<T> — utility для всех полей обязательных / опциональных.
При деструктуризации задавайте default: { timeout = 3000 }.
exactOptionalPropertyTypes (флаг) запрещает присвоить undefined туда, где только «отсутствие».
В API документируйте, означает ли отсутствие поля «по умолчанию» или «не задано».`,
    interview: `- ?. vs optional property? — ? на поле — тип; ?. — оператор доступа.
- Partial<User> делает что? — Все ключи User опциональными.
- Можно ли передать { name: 'a', bio: undefined } в { name: string; bio?: string }? — Зависит от exactOptionalPropertyTypes.`,
    demo: `export type CreatePostInput = {
  title: string;
  body?: string;
  tags?: string[];
};

export function normalizePost(input: CreatePostInput): { title: string; body: string; tags: string[] } {
  return {
    title: input.title,
    body: input.body ?? '',
    tags: input.tags ?? [],
  };
}

export type Pagination = { page?: number; pageSize?: number };

export function offset({ page = 1, pageSize = 10 }: Pagination): number {
  return (page - 1) * pageSize;
}

export function hasTags(input: CreatePostInput): boolean {
  return (input.tags?.length ?? 0) > 0;
}`,
    test: `const p = normalizePost({ title: 'Hi' });
assert(p.body === '' && p.tags.length === 0);
assert(offset({}) === 0);
assert(offset({ page: 2, pageSize: 5 }) === 5);
assert(hasTags({ title: 'T', tags: ['a'] }) === true);`,
  },
  {
    num: 14,
    slug: 'null-undefined',
    folder: '02-unions-nullability',
    title: 'null vs undefined',
    tags: ['unions', 'null'],
    difficulty: 'medium',
    theory: `undefined — «не задано»: необъявленное поле, отсутствующий return, несуществующий ключ.
null — явное «пустое значение» в JSON и API; нужно намеренно присваивать.
С strictNullChecks оба не входят в другие типы без union.
Стили кода: использовать только undefined для опциональности или null для API — быть консистентным.
== сравнивает null с undefined; === различает.
TypeScript 3.7+ optional chaining и nullish coalescing снижают путаницу.`,
    interview: `- Когда выбрать null вместо undefined? — Контракт API/JSON, явное «значение отсутствует».
- typeof null в JS? — 'object' (исторический баг); в TS тип null отдельный.
- T | null | undefined — избыточно? — Часто да; сузьте контракт до одного «пустого».`,
    demo: `export type ApiUser = {
  id: string;
  nickname: string | null;
  bio?: string;
};

export function nicknameLabel(user: ApiUser): string {
  if (user.nickname === null) return 'Anonymous';
  return user.nickname;
}

export function bioLength(user: ApiUser): number {
  const bio = user.bio;
  if (bio === undefined) return 0;
  return bio.length;
}

export function coalesce<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
}

export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}`,
    test: `assert(nicknameLabel({ id: '1', nickname: null }) === 'Anonymous');
assert(nicknameLabel({ id: '1', nickname: 'neo' }) === 'neo');
assert(bioLength({ id: '1', nickname: null }) === 0);
assert(coalesce(null, 5) === 5);
assert(isNullish(undefined) === true);`,
  },
  {
    num: 15,
    slug: 'nullish-coalescing',
    folder: '02-unions-nullability',
    title: 'Nullish coalescing',
    tags: ['unions', 'operators'],
    difficulty: 'easy',
    theory: `Оператор ?? возвращает правый операнд только если левый null или undefined.
В отличие от ||, ?? не заменяет 0, '' и false — важно для конфигов и чисел.
??= присваивает только при nullish: x ??= y.
Комбинируйте с ?.: user?.settings?.theme ?? 'light'.
Не смешивайте ?? и || без скобок — правило группировки запрещает без parentheses.
Для default пустой строки используйте ??, не ||, если '' допустим.`,
    interview: `- '' ?? 'default'? — '' (пустая строка не nullish).
- 0 || 10 vs 0 ?? 10? — || → 10; ?? → 0.
- Зачем ?? в React default props? — Не перетирать переданный 0 или false.`,
    demo: `export function withDefaultCount(count: number | null | undefined): number {
  return count ?? 0;
}

export function withDefaultName(name: string | null | undefined): string {
  return name ?? 'Guest';
}

export function flagEnabled(flag: boolean | null | undefined): boolean {
  return flag ?? false;
}

export type Config = { port?: number; host?: string };

export function resolvePort(config: Config): number {
  return config.port ?? 3000;
}

export function resolveHost(config: Config): string {
  return config.host ?? 'localhost';
}`,
    test: `assert(withDefaultCount(null) === 0);
assert(withDefaultCount(5) === 5);
assert(withDefaultName('') === '');
assert(flagEnabled(null) === false);
assert(resolvePort({}) === 3000);
assert(resolveHost({ host: '0.0.0.0' }) === '0.0.0.0');`,
  },
  {
    num: 16,
    slug: 'discriminated-union',
    folder: '02-unions-nullability',
    title: 'Discriminated unions',
    tags: ['unions', 'discriminant'],
    difficulty: 'medium',
    theory: `Дискриминированный union — общее литеральное поле kind/type/status для сужения switch.
Компилятор сужает поля в каждой ветке; exhaustive check ловит новые варианты.
Предпочтительнее enum для доменных событий и state machines в Redux/Zustand.
Каждая ветка должна иметь уникальный дискриминант; иначе narrowing ломается.
Можно комбинировать с generics: Result<T> = { ok: true; value: T } | { ok: false; error: Error }.
Теги должны быть readonly литералами для надёжного сравнения.`,
    interview: `- Что делает switch по kind? — Сужает union до одной ветки.
- Как проверить исчерпывающность? — default: assertNever(x).
- Discriminated union vs class hierarchy? — Нет runtime vtable; проще сериализация.`,
    demo: `export type ApiResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }
  | { status: 'loading' };

export function unwrapResult<T>(result: ApiResult<T>): T | null {
  if (result.status === 'success') return result.data;
  if (result.status === 'loading') return null;
  return null;
}

export function resultMessage<T>(result: ApiResult<T>): string {
  switch (result.status) {
    case 'success':
      return 'ok';
    case 'error':
      return result.message;
    case 'loading':
      return '...';
  }
}

export type Payment = { type: 'card'; last4: string } | { type: 'cash' };

export function charge(p: Payment): number {
  return p.type === 'card' ? 100 : 50;
}`,
    test: `const ok: ApiResult<number> = { status: 'success', data: 7 };
assert(unwrapResult(ok) === 7);
assert(resultMessage({ status: 'error', message: 'fail' }) === 'fail');
assert(charge({ type: 'cash' }) === 50);
assert(charge({ type: 'card', last4: '4242' }) === 100);`,
  },
  {
    num: 17,
    slug: 'enum-vs-union',
    folder: '02-unions-nullability',
    title: 'enum vs string union',
    tags: ['unions', 'enum'],
    difficulty: 'medium',
    theory: `enum генерирует JS-объект (кроме const enum при inline) — влияет на bundle.
String union type — только compile-time, нулевой runtime overhead.
const enum подставляет значения при компиляции — нет reverse mapping, осторожно с isolatedModules.
Для публичных API библиотек union + as const читаемее и tree-shake-friendly.
Numeric enum имеет reverse mapping и неожиданные числовые значения.
Biome/ESLint часто рекомендуют union вместо enum в application code.`,
    interview: `- Когда enum оправдан? — Legacy interop, битовые флаги, соглашение команды.
- Почему union лучше для REST статусов? — Совпадает с JSON без трансформации.
- const enum минус? — Нельзя импортировать как значение в некоторых bundler-сценариях.`,
    demo: `export const OrderStatus = {
  Pending: 'pending',
  Shipped: 'shipped',
  Delivered: 'delivered',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export function nextStatus(current: OrderStatus): OrderStatus | null {
  if (current === OrderStatus.Pending) return OrderStatus.Shipped;
  if (current === OrderStatus.Shipped) return OrderStatus.Delivered;
  return null;
}

export function isOrderStatus(value: string): value is OrderStatus {
  return (Object.values(OrderStatus) as string[]).includes(value);
}

export function labelStatus(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'В обработке';
    case 'shipped':
      return 'Отправлен';
    case 'delivered':
      return 'Доставлен';
  }
}`,
    test: `assert(nextStatus('pending') === 'shipped');
assert(nextStatus('delivered') === null);
assert(isOrderStatus('shipped') === true);
assert(isOrderStatus('x') === false);
assert(labelStatus('pending') === 'В обработке');`,
  },
  {
    num: 18,
    slug: 'const-enum',
    folder: '02-unions-nullability',
    title: 'const enum',
    tags: ['unions', 'enum'],
    difficulty: 'hard',
    theory: `const enum члены инлайнятся в использование — нет объекта Direction в JS (при preserveConstEnums: false).
Ускоряет runtime и уменьшает bundle, но ломает runtime-итерацию по enum.
preserveConstEnums: true оставляет объект для отладки — редко включают.
С isolatedModules Babel не может инлайнить — предпочитайте union или обычный enum.
const enum Direction { Up, Down } → в коде станет 0, 1.
Для совместимости с vite/esbuild часто избегают const enum.`,
    interview: `- Виден ли const enum в runtime? — Обычно нет, значения подставлены.
- Почему const enum спорен? — Плохая совместимость с transpile-only пайплайнами.
- Альтернатива? — as const object + union typeof values.`,
    demo: `export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export function opposite(dir: Direction): Direction {
  switch (dir) {
    case Direction.Up:
      return Direction.Down;
    case Direction.Down:
      return Direction.Up;
    case Direction.Left:
      return Direction.Right;
    case Direction.Right:
      return Direction.Left;
  }
}

export function isVertical(dir: Direction): boolean {
  return dir === Direction.Up || dir === Direction.Down;
}

export function parseDirection(raw: string): Direction | null {
  const values = Object.values(Direction) as string[];
  if (!values.includes(raw)) return null;
  return raw as Direction;
}`,
    test: `assert(opposite(Direction.Up) === Direction.Down);
assert(isVertical(Direction.Left) === false);
assert(parseDirection('UP') === Direction.Up);
assert(parseDirection('diag') === null);`,
  },
  {
    num: 19,
    slug: 'keyof-basics',
    folder: '02-unions-nullability',
    title: 'keyof operator',
    tags: ['unions', 'keyof'],
    difficulty: 'medium',
    theory: `keyof T — union всех ключей объекта: keyof { a: 1; b: 2 } → 'a' | 'b'.
Для индексных сигнатур keyof включает string | number | symbol.
С generics: function pick<T, K extends keyof T>(obj: T, key: K): T[K].
keyof any → string | number | symbol; keyof never → never.
С union объектов keyof — пересечение ключей (общие поля).
Record<keyof T, boolean> — типичный флаговый объект по всем полям.`,
    interview: `- keyof (A | B) для объектов? — keyof A & keyof B (пересечение).
- Зачем extends keyof T? — Безопасный доступ к свойству по имени.
- keyof array? — 'length' | 'push' | ... union методов и индексов.`,
    demo: `export type User = { id: string; name: string; email: string };

export function pick<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export function keysOf<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function hasKey<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj;
}

export type UserKeys = keyof User;

export function isUserKey(key: string): key is UserKeys {
  return key === 'id' || key === 'name' || key === 'email';
}`,
    test: `const user: User = { id: '1', name: 'Ann', email: 'a@b.c' };
assert(pick(user, 'name') === 'Ann');
assert(keysOf(user).length === 3);
assert(hasKey(user, 'email') === true);
assert(isUserKey('name') === true);
assert(isUserKey('age') === false);`,
  },
  {
    num: 20,
    slug: 'indexed-access',
    folder: '02-unions-nullability',
    title: 'Indexed access types',
    tags: ['unions', 'indexed'],
    difficulty: 'medium',
    theory: `T[K] — тип свойства K в T: User['id'] → string.
Можно индексировать union ключей: User['id' | 'name'] → string.
Массивы: MyArray[number] — тип элемента.
Вложенный доступ: Config['server']['port'] при вложенной структуре.
typeof + indexed: (typeof obj)[keyof typeof obj] для значений as const объекта.
Часто комбинируют с generics ReturnType, Parameters, Awaited.`,
    interview: `- T[K] когда K union? — Union типов соответствующих свойств.
- Чем отличается от obj[key] в runtime? — Только compile-time; в JS обычный доступ.
- Array[number] vs Array[0]? — number — элемент; 0 — конкретный tuple slot.`,
    demo: `export type ApiEndpoints = {
  users: { list: '/users'; get: '/users/:id' };
  posts: { list: '/posts'; create: '/posts' };
};

export type UsersPaths = ApiEndpoints['users'][keyof ApiEndpoints['users']];

export function pathUsersList(): UsersPaths {
  return '/users';
}

export type Tuple = [string, number, boolean];

export type Second = Tuple[1];

export function getSecond(t: Tuple): Second {
  return t[1];
}

export const MODES = { view: 'view', edit: 'edit' } as const;
export type Mode = (typeof MODES)[keyof typeof MODES];`,
    test: `assert(pathUsersList() === '/users');
const t: Tuple = ['a', 2, true];
assert(getSecond(t) === 2);
assert((MODES.edit as Mode) === 'edit');`,
  },
];
