/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 21,
    slug: 'typeof-narrowing',
    folder: '03-narrowing',
    title: 'typeof narrowing',
    tags: ['narrowing', 'typeof'],
    difficulty: 'easy',
    theory: `typeof в type guard позиции сужает union примитивов: string, number, boolean, bigint, symbol, undefined.
typeof null в JS — 'object'; для null используйте === null отдельно.
typeof function — для callable; typeof array не существует (будет 'object') — нужен Array.isArray.
После if (typeof x === 'string') в блоке x: string.
Комбинируйте ветки для нескольких typeof в одной функции format.
Не полагайтесь на typeof для различения объектных типов — только примитивы.`,
    interview: `- typeof []? — 'object'; как сузить массив? — Array.isArray.
- typeof null? — 'object'; проверка: value === null.
- Сужает ли typeof union object types? — Нет, все объекты 'object'.`,
    demo: `export function stringify(value: string | number | boolean): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toFixed(2);
  return value ? 'true' : 'false';
}

export function double(value: string | number): string | number {
  if (typeof value === 'number') return value * 2;
  return value + value;
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

export function byteLength(value: string | ArrayBuffer): number {
  if (typeof value === 'string') return value.length;
  return value.byteLength;
}`,
    test: `assert(stringify(3.14159) === '3.14');
assert(stringify('hi') === 'hi');
assert(double(4) === 8);
assert(double('a') === 'aa');
assert(isNonEmptyString('x') === true);
assert(byteLength(new ArrayBuffer(8)) === 8);`,
  },
  {
    num: 22,
    slug: 'instanceof',
    folder: '03-narrowing',
    title: 'instanceof narrowing',
    tags: ['narrowing', 'instanceof'],
    difficulty: 'easy',
    theory: `instanceof проверяет цепочку прототипов: value instanceof Date → Date.
Работает с классами и встроенными конструкторами (Error, Array — лучше Array.isArray).
Для interface нет runtime — нужен user-defined type guard.
instanceof с union: if (x instanceof Foo) x сужается до Foo в ветке.
Кастомные классы в разных realm (iframe) могут ломать instanceof.
Symbol.hasInstance позволяет переопределить поведение на классе.`,
    interview: `- instanceof для interface? — Нельзя; только type predicate.
- [] instanceof Array? — true; предпочтительнее Array.isArray.
- Почему instanceof не для plain object? — Нет единого конструктора.`,
    demo: `export class ApiError extends Error {
  readonly code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return '[' + err.code + '] ' + err.message;
  if (err instanceof Error) return err.message;
  return String(err);
}

export function toDate(value: Date | number): Date {
  if (value instanceof Date) return value;
  return new Date(value);
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}`,
    test: `assert(errorMessage(new ApiError(404, 'Not found')).includes('404'));
assert(errorMessage(new Error('x')) === 'x');
assert(toDate(0).getTime() === 0);
assert(isDate(new Date()) === true);`,
  },
  {
    num: 23,
    slug: 'in-operator',
    folder: '03-narrowing',
    title: 'in operator narrowing',
    tags: ['narrowing', 'in'],
    difficulty: 'medium',
    theory: `'prop' in obj сужает union объектов по наличию поля — дискриминант не обязателен.
Работает на уровне ключей: 'swim' in duck → ветка с swim.
На примитивах in не используют — TypeError в runtime для null/undefined.
Различайте in (ключ в объекте) и hasOwnProperty (собственное свойство).
С optional полями in может быть true, а значение undefined.
Для deep shape лучше discriminated union или schema (zod).`,
    interview: `- 'a' in obj vs obj.a? — in проверяет цепочку прототипа; .a — значение.
- in сужает union? — Да, до веток, где поле обязательно.
- in на массиве 'length'? — true; для элементов — индексные ключи.`,
    demo: `type Fish = { swim: () => void };
type Bird = { fly: () => void };

export function move(animal: Fish | Bird): string {
  if ('swim' in animal) {
    animal.swim();
    return 'swim';
  }
  animal.fly();
  return 'fly';
}

type Admin = { role: 'admin'; level: number };
type Guest = { role: 'guest' };

export function accessLevel(user: Admin | Guest): number {
  if ('level' in user) return user.level;
  return 0;
}

export function hasProp<T extends object>(obj: T, key: PropertyKey): boolean {
  return key in obj;
}`,
    test: `const fish: Fish = { swim: () => {} };
const bird: Bird = { fly: () => {} };
assert(move(fish) === 'swim');
assert(move(bird) === 'fly');
assert(accessLevel({ role: 'admin', level: 3 }) === 3);
assert(accessLevel({ role: 'guest' }) === 0);`,
  },
  {
    num: 24,
    slug: 'equality-narrowing',
    folder: '03-narrowing',
    title: 'Equality narrowing',
    tags: ['narrowing', 'equality'],
    difficulty: 'easy',
    theory: `Сравнение ===, !==, ==, != сужает union: if (x === null) x: null.
Сравнение с литералом: status === 'loading' сужает discriminated union.
Сравнение двух переменных одного union может сузить обе: if (a === b).
switch (x) с case литералами — форма equality narrowing.
undefined и null проверяйте явно под strictNullChecks.
После return в ветке оставшийся тип сужается (control flow analysis).`,
    interview: `- === сужает лучше ==? — == дополнительная coercion; в TS предпочтите ===.
- x === true сужает boolean? — До true в ветке, false в else.
- Почему switch удобен для union? — Каждый case сужает автоматически.`,
    demo: `export type LoadState =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'done'; data: string };

export function stateLabel(s: LoadState): string {
  if (s.state === 'idle') return 'idle';
  if (s.state === 'loading') return 'loading';
  return s.data;
}

export function equalsId(a: string | null, b: string | null): boolean {
  if (a === null || b === null) return a === b;
  return a === b;
}

export function normalizeRole(role: 'admin' | 'user' | 'guest'): 'admin' | 'user' {
  if (role === 'guest') return 'user';
  return role;
}`,
    test: `assert(stateLabel({ state: 'idle' }) === 'idle');
assert(stateLabel({ state: 'done', data: 'ok' }) === 'ok');
assert(equalsId(null, null) === true);
assert(equalsId('a', 'a') === true);
assert(normalizeRole('guest') === 'user');`,
  },
  {
    num: 25,
    slug: 'user-type-guard',
    folder: '03-narrowing',
    title: 'User-defined type guards',
    tags: ['narrowing', 'type-guard'],
    difficulty: 'medium',
    theory: `Предикат value is Type сообщает компилятору сужение при true.
function isUser(x: unknown): x is User { return ... }
Можно isArrayOfStrings(x): x is string[] с Array.isArray + every.
Type guards должны быть честными — ложный true ломает типобезопасность.
Комбинируйте несколько guard в цепочке if.
Generic guards: function isOfShape<T>(...): x is T — осторожно, легко соврать.
В React hooks и API валидации guards — стандартный паттерн.`,
    interview: `- Синтаксис type guard? — param is Type в return type.
- Чем отличается от boolean функции? — Компилятор сужает тип в if.
- Можно ли guard для generic? — Да, но нет runtime проверки T.`,
    demo: `export type User = { id: string; name: string };

export function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false;
  const o = value as Record<string, unknown>;
  return typeof o.id === 'string' && typeof o.name === 'string';
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((x) => typeof x === 'string');
}

export function assertUser(value: unknown): asserts value is User {
  if (!isUser(value)) throw new Error('not a user');
}

export function greetUser(value: unknown): string {
  if (!isUser(value)) return 'stranger';
  return 'Hi, ' + value.name;
}`,
    test: `assert(isUser({ id: '1', name: 'Ann' }) === true);
assert(isUser({ id: 1 }) === false);
assert(isStringArray(['a']) === true);
assert(greetUser({ id: '1', name: 'Bob' }) === 'Hi, Bob');
assert(greetUser(null) === 'stranger');`,
  },
  {
    num: 26,
    slug: 'assert-function',
    folder: '03-narrowing',
    title: 'Assertion functions',
    tags: ['narrowing', 'asserts'],
    difficulty: 'medium',
    theory: `asserts value is T — функция либо завершает нормально (тип сужен), либо throw.
asserts value is NonNullable<T> убирает null/undefined после вызова.
В отличие от type guard, assert не возвращает boolean — управление потоком через throw.
Паттерн Node assert.ok — можно обернуть в asserts cond.
Не злоупотребляйте — предпочитайте явные if для пользовательского ввода.
asserts this is ... — assertion methods в классах (инициализация полей).`,
    interview: `- asserts vs is guard? — asserts бросает; guard возвращает boolean.
- Сужается ли тип после assert? — Да, в коде ниже по потоку.
- Можно ли asserts для условия? — asserts condition is true (TS 3.7+).`,
    demo: `export function assertDefined<T>(value: T | null | undefined, msg?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(msg ?? 'value is nullish');
  }
}

export function assertString(value: unknown, msg?: string): asserts value is string {
  if (typeof value !== 'string') throw new Error(msg ?? 'expected string');
}

export function len(value: string | null): number {
  assertDefined(value);
  return value.length;
}

export function parseLabel(raw: unknown): string {
  assertString(raw);
  return raw.trim();
}`,
    test: `assert(len('abc') === 3);
assert(parseLabel('  x ') === 'x');
let threw = false;
try { assertDefined(null); } catch { threw = true; }
assert(threw === true);`,
  },
  {
    num: 27,
    slug: 'exhaustive-switch',
    folder: '03-narrowing',
    title: 'Exhaustive switch',
    tags: ['narrowing', 'switch'],
    difficulty: 'medium',
    theory: `switch по discriminant должен покрывать все варианты union.
В default: const _exhaustive: never = value — ошибка при новом варианте.
Функция assertNever(x: never): never в default — runtime + compile check.
Без default компилятор проверяет исчерпывание, если strict и union конечен.
При fall-through используйте break или return в каждом case.
Исчерпывающий switch — must-have в code review для state machine.`,
    interview: `- Зачем never в default? — Упасть при compile, если забыли case.
- switch(true) паттерн? — Условия в case для сложных guard.
- Что если добавить ветку union? — never в default подсветит все switch.`,
    demo: `export type Shape =
  | { kind: 'circle'; r: number }
  | { kind: 'rect'; w: number; h: number };

export function assertNever(x: never): never {
  throw new Error('Unhandled: ' + JSON.stringify(x));
}

export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.r ** 2;
    case 'rect':
      return shape.w * shape.h;
    default:
      return assertNever(shape);
  }
}

export type Msg = { type: 'ping' } | { type: 'pong' };

export function handle(msg: Msg): string {
  switch (msg.type) {
    case 'ping':
      return 'ping';
    case 'pong':
      return 'pong';
    default:
      return assertNever(msg);
  }
}`,
    test: `assert(Math.round(area({ kind: 'rect', w: 2, h: 3 })) === 6);
assert(handle({ type: 'ping' }) === 'ping');
assert(handle({ type: 'pong' }) === 'pong');`,
  },
  {
    num: 28,
    slug: 'narrow-unknown',
    folder: '03-narrowing',
    title: 'Narrowing unknown',
    tags: ['narrowing', 'unknown'],
    difficulty: 'medium',
    theory: `unknown — вход по умолчанию для JSON.parse, catch, внешних API.
Перед использованием: typeof, instanceof, custom guard, schema validation.
Нельзя читать свойства без сужения — в отличие от any.
Паттерн: if (!isUser(data)) return; дальше data: User.
Zod/io-ts поверх unknown — промышленный стандарт.
В catch (e: unknown) сужайте до Error через instanceof.`,
    interview: `- Почему не any для API? — any отключает проверку; unknown заставляет сузить.
- unknown в catch? — TS 4.4+ default; раньше any.
- Как сузить unknown[]? — Array.isArray + guard на элементы.`,
    demo: `export function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  return new Error(String(value));
}

export function readNumber(value: unknown): number | null {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  return value;
}

export function readStringProp(obj: unknown, key: string): string | null {
  if (typeof obj !== 'object' || obj === null) return null;
  const record = obj as Record<string, unknown>;
  const v = record[key];
  return typeof v === 'string' ? v : null;
}

export function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}`,
    test: `assert(toError('x').message === 'x');
assert(readNumber(42) === 42);
assert(readNumber('x') === null);
assert(readStringProp({ name: 'a' }, 'name') === 'a');
assert(safeJsonParse('{"n":1}') !== null);`,
  },
  {
    num: 29,
    slug: 'nullable-flow',
    folder: '03-narrowing',
    title: 'Nullable control flow',
    tags: ['narrowing', 'null'],
    difficulty: 'medium',
    theory: `Control flow analysis отслеживает сужение после if, return, throw, assignment.
if (!user) return — дальше user без null/undefined.
Повторное присваивание может расширить тип обратно — осторожно с замыканиями.
Closure в async callback может не видеть сужение снаружи — сохраните в const.
Optional chaining не сужает тип переменной — только результат выражения.
TypeScript 5+ улучшения для narrowing в destructuring и else веток.`,
    interview: `- Почему сужение теряется в callback? — Анализ не через границы функции.
- !. non-null assertion vs if? — !. без проверки; if безопаснее.
- Сужается ли после Array.find? — T | undefined; нужна проверка.`,
    demo: `export function firstNonNull<T>(a: T | null, b: T | null): T | null {
  if (a !== null) return a;
  if (b !== null) return b;
  return null;
}

export function pluck<T, K extends keyof T>(obj: T | null, key: K): T[K] | null {
  if (obj === null) return null;
  return obj[key];
}

export function findById<T extends { id: string }>(items: readonly T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}

export function requireFound<T>(value: T | undefined, msg: string): T {
  if (value === undefined) throw new Error(msg);
  return value;
}`,
    test: `assert(firstNonNull(null, 5) === 5);
assert(pluck({ id: '1', name: 'a' }, 'name') === 'a');
assert(pluck(null, 'name') === null);
const items = [{ id: '1', name: 'x' }];
assert(requireFound(findById(items, '1'), 'missing').name === 'x');`,
  },
  {
    num: 30,
    slug: 'truthiness',
    folder: '03-narrowing',
    title: 'Truthiness narrowing',
    tags: ['narrowing', 'truthiness'],
    difficulty: 'easy',
    theory: `if (value) сужает тип, убирая falsy: '', 0, false, null, undefined, NaN, document.all legacy.
Для строк if (s) отсекает ''; для чисел — 0; осторожно, если 0 валиден.
Boolean(value) не сужает так же агрессивно в некоторых позициях — предпочтите явные проверки.
!!value — приведение к boolean без сужения union в TS (часто).
Для optional string используйте s !== undefined && s !== '' если пустая строка допустима.
Различайте truthiness narrowing и nullish проверки (??, === null).`,
    interview: `- if (count) проблема? — Отфильтрует 0; используйте count != null.
- Truthiness vs ?? — ?? только null/undefined; if (!x) все falsy.
- Сужает ли if (arr.length)? — arr всё ещё массив; length truthy не меняет тип элементов.`,
    demo: `export function nonEmpty(value: string | null | undefined): value is string {
  return Boolean(value);
}

export function trimOptional(value: string | undefined): string {
  if (!value) return '';
  return value.trim();
}

export function countTruthy(values: readonly (string | number | false | null)[]): number {
  let n = 0;
  for (const v of values) {
    if (v) n++;
  }
  return n;
}

export function pickName(user: { name: string } | null): string {
  if (!user) return 'Guest';
  return user.name;
}`,
    test: `assert(nonEmpty('a') === true);
assert(nonEmpty('') === false);
assert(trimOptional(undefined) === '');
assert(trimOptional('  hi ') === 'hi');
assert(countTruthy([0, '', 'x', null, 1]) === 2);
assert(pickName(null) === 'Guest');`,
  },
];
