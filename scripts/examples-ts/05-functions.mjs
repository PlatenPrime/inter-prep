/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 41,
    slug: 'overloads',
    folder: '05-functions',
    title: 'function overloads',
    tags: ['functions', 'overloads'],
    difficulty: 'medium',
    theory: `Перегрузка в TS — несколько call signatures + одна implementing signature.
Компилятор проверяет вызовы по overloads; в JS остаётся одна функция.
Реализация должна быть совместима со всеми overloads (часто union в параметрах).
Порядок overloads важен: от более специфичных к общим.
Альтернатива: union параметров + conditional types — сложнее, но без overload list.`,
    interview: `- Есть ли overload в runtime? — Нет, только типы.
- Почему реализация «шире»? — Одна функция обслуживает все варианты вызова.
- Overload vs union arg? — Overload даёт точный return type per call shape.`,
    related: '- webdev/14. ts/021-peregruzka-funkcij.md',
    demo: `export function format(value: string): string;
export function format(value: number, decimals?: number): string;
export function format(value: Date): string;
export function format(value: string | number | Date, decimals = 0): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'number') return value.toFixed(decimals);
  return value.trim();
}

export function len(value: string): number;
export function len(value: unknown[]): number;
export function len(value: string | unknown[]): number {
  return value.length;
}`,
    test: `assert(format('  hi  ') === 'hi');
assert(format(3.14159, 2) === '3.14');
assert(len('abc') === 3);
assert(len([1, 2, 3]) === 3);`,
  },
  {
    num: 42,
    slug: 'optional-default-params',
    folder: '05-functions',
    title: 'optional and default params',
    tags: ['functions', 'params'],
    difficulty: 'easy',
    theory: `param?: T эквивалентно param: T | undefined с optional call.
Значение по умолчанию: param = value — тип выводится из default expression.
Optional параметры должны идти после обязательных (или иметь default).
undefined при вызове с ? — отдельно от «аргумент не передан» только с exactOptionalPropertyTypes.
Default в деструктуризации объекта — частый паттерн для options.`,
    interview: `- ? vs default? — ? допускает omit; default подставляет значение при undefined/omit.
- Порядок параметров? — Required → optional → rest.
- optional property vs optional param? — Разные места; оба про отсутствие значения.`,
    related: '- webdev/14. ts/022-opcjonalnye-i-defaultnye-parametry.md',
    demo: `export function greet(name: string, title?: string): string {
  const t = title ? \`\${title} \` : '';
  return \`Hello, \${t}\${name}\`;
}

export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 10,
): { page: number; items: T[] } {
  const start = (page - 1) * pageSize;
  return { page, items: items.slice(start, start + pageSize) };
}

export function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}`,
    test: `assert(greet('Ann') === 'Hello, Ann');
assert(greet('Ann', 'Dr.') === 'Hello, Dr. Ann');
assert(paginate([1, 2, 3, 4, 5], 2, 2).items.join('') === '34');
assert(clamp(150) === 100);`,
  },
  {
    num: 43,
    slug: 'rest-tuple',
    folder: '05-functions',
    title: 'rest and tuple params',
    tags: ['functions', 'rest'],
    difficulty: 'medium',
    theory: `...args: T[] — rest как массив; ...args: [number, number] — tuple rest (TS 4+).
Tuple rest фиксирует минимальную форму хвоста: (head: string, ...rest: number[]).
Spread при вызове требует совместимости tuple с параметром.
Связь с arguments в JS — rest предпочтительнее, типобезопасно.
Комбинация с generics: function join<T extends string>(...parts: T[])`,
    interview: `- rest array vs tuple? — Tuple rest для фиксированного «хвоста» после обязательных args.
- Типизация apply/call? — Tuple types + Parameters utility.
- rest последний? — Да, только один rest parameter.`,
    related: '- webdev/14. ts/022-opcjonalnye-i-defaultnye-parametry.md\n- webdev/14. ts/007-tipy-v-typescript.md',
    demo: `export function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

export function pairHead<T, U>(head: T, ...tail: [U, ...U[]]): [T, U] {
  return [head, tail[0]];
}

export function logTagged(tag: string, ...messages: string[]): string {
  return messages.map((m) => \`[\${tag}] \${m}\`).join(' | ');
}

export function minMax(...nums: [number, ...number[]]): { min: number; max: number } {
  return { min: Math.min(...nums), max: Math.max(...nums) };
}`,
    test: `assert(sum(1, 2, 3) === 6);
assert(pairHead('a', 1, 2)[1] === 1);
assert(logTagged('app', 'ok', 'done') === '[app] ok | [app] done');
const mm = minMax(3, 1, 9);
assert(mm.min === 1 && mm.max === 9);`,
  },
  {
    num: 44,
    slug: 'generic-function',
    folder: '05-functions',
    title: 'generic function',
    tags: ['functions', 'generics'],
    difficulty: 'medium',
    theory: `function id<T>(x: T): T сохраняет тип аргумента вместо any.
Generic параметр выводится (inference) из аргумента при вызове.
Явное указание: id<string>('x') когда inference недостаточен.
Несколько type params: function map<T, U>(arr: T[], fn: (t: T) => U): U[].
Ограничения: <T extends HasId> — в следующих темах каталога 06.`,
    interview: `- Зачем generic function? — Переиспользование без потери типа.
- Когда писать <T> явно? — Когда T только в return или контекст ambiguous.
- Generic vs any? — any отключает проверки; generic сохраняет связь типов.`,
    related: '- webdev/14. ts/013-genericheskie-tipy-generic.md',
    demo: `export function identity<T>(value: T): T {
  return value;
}

export function firstOf<T>(items: readonly T[]): T | undefined {
  return items[0];
}

export function mapArray<T, U>(items: T[], fn: (item: T) => U): U[] {
  const out: U[] = [];
  for (const item of items) out.push(fn(item));
  return out;
}

export function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}`,
    test: `assert(identity(42) === 42);
assert(firstOf([10, 20]) === 10);
assert(mapArray([1, 2], (n) => String(n)).join('') === '12');
assert(pair('x', 1)[1] === 1);`,
  },
  {
    num: 45,
    slug: 'infer-return',
    folder: '05-functions',
    title: 'infer return type',
    tags: ['functions', 'inference'],
    difficulty: 'medium',
    theory: `ReturnType<F> и typeof fn выводят тип возврата из сигнатуры функции.
satisfies и const context помогают сохранить узкие return types.
Явная аннотация return : T иногда нужна для публичного API и рекурсии.
async function возвращает Promise<T>; ReturnType оборачивает в Promise.
Избегай лишних аннотаций там, где inference даёт точный union/literal.`,
    interview: `- ReturnType vs ручной тип? — DRY при рефакторинге реализации.
- Почему async return Promise? — Спецификация TS для async.
- infer в conditional? — Связано с ReturnType implementation (см. тему 071+).`,
    related: '- webdev/14. ts/014-utilitarnye-tipy-utility-types.md\n- webdev/14. ts/013-genericheskie-tipy-generic.md',
    demo: `export function makeCounter(start = 0) {
  let n = start;
  return () => ++n;
}

export type CounterFn = ReturnType<typeof makeCounter>;

export function invoke<T extends (...args: never[]) => unknown>(
  fn: T,
): ReturnType<T> {
  return fn() as ReturnType<T>;
}

export function parseResult(input: string): { ok: true; value: number } | { ok: false; error: string } {
  const n = Number(input);
  if (Number.isNaN(n)) return { ok: false, error: 'NaN' };
  return { ok: true, value: n };
}`,
    test: `const c = makeCounter(10);
assert(c() === 11);
assert(invoke(() => 'ts') === 'ts');
const r = parseResult('42');
assert(r.ok && r.value === 42);`,
  },
  {
    num: 46,
    slug: 'higher-order-typing',
    folder: '05-functions',
    title: 'higher-order typing',
    tags: ['functions', 'higher-order'],
    difficulty: 'hard',
    theory: `Функция, принимающая или возвращающая функцию — higher-order.
Типизация: (x: T) => R, generic HOF сохраняет связь T→U.
compose(f, g) требует что output g совпадает с input f.
Currying: <A,B,C>(f: (a: A, b: B) => C) => (a: A) => (b: B) => C.
Event handlers, middleware, map/filter — ежедневные HOF в TS/React.`,
    interview: `- Как типизировать callback? — Явная сигнатура или generic constraint.
- compose типы? — Пересечение Parameters/ReturnType или tuple pipeline.
- HOF vs method? — Method может иметь this parameter type.`,
    related: '- webdev/14. ts/013-genericheskie-tipy-generic.md\n- webdev/09. js/029-chto-takoe-funkcii-vysshego-poryadka.md',
    demo: `export function twice<T>(fn: (x: T) => T): (x: T) => T {
  return (x) => fn(fn(x));
}

export function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
  return (a) => f(g(a));
}

export function filterMap<T, U>(
  items: T[],
  pred: (item: T) => boolean,
  map: (item: T) => U,
): U[] {
  const out: U[] = [];
  for (const item of items) {
    if (pred(item)) out.push(map(item));
  }
  return out;
}

export function debounceTyped<F extends (arg: string) => void>(
  fn: F,
  ms: number,
): (arg: string) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (arg) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(arg), ms);
  };
}`,
    test: `assert(twice((n: number) => n + 1)(3) === 5);
const len = compose((s: string) => s.length, (n: number) => String(n));
assert(len(42) === 2);
assert(filterMap([1, 2, 3], (n) => n % 2 === 0, (n) => n * 10).join('') === '20');`,
  },
  {
    num: 47,
    slug: 'this-parameter',
    folder: '05-functions',
    title: 'this parameter',
    tags: ['functions', 'this'],
    difficulty: 'hard',
    theory: `Первый параметр this: Context — только для типизации, не в runtime args.
Указывает ожидаемый this при call/bind; function(this: User) { this.name }.
Стрелочные функции не имеют own this — this parameter к ним не применяют.
noImplicitThis требует явного this type или стрелки/замыкания.
Методы в interface: method(): void vs fn(this: T): void — разная проверка this.`,
    interview: `- this parameter в сигнатуре? — Compile-time only; не передаётся вызывающим.
- Зачем? — Безопасный bind и callback с известным this.
- Arrow vs function this? — Arrow lexically captures; function — dynamic this.`,
    related: '- webdev/14. ts/018-elementy-oop-v-typescript.md\n- webdev/09. js/031-pochemu-funkcii-nazyvayut-obektami-pervogo-klassa.md',
    demo: `export interface Logger {
  prefix: string;
  log(this: Logger, message: string): string;
}

export const consoleLogger: Logger = {
  prefix: '[app]',
  log(message) {
    return \`\${this.prefix} \${message}\`;
  },
};

export function callWithLogger(
  logger: Logger,
  fn: (this: Logger, msg: string) => string,
  msg: string,
): string {
  return fn.call(logger, msg);
}

export function bindLog(logger: Logger): (msg: string) => string {
  return logger.log.bind(logger);
}`,
    test: `assert(consoleLogger.log('ok') === '[app] ok');
assert(callWithLogger(consoleLogger, consoleLogger.log, 'x') === '[app] x');
assert(bindLog(consoleLogger)('y') === '[app] y');`,
  },
  {
    num: 48,
    slug: 'constructor-type',
    folder: '05-functions',
    title: 'constructor type',
    tags: ['functions', 'constructor'],
    difficulty: 'medium',
    theory: `type Factory = new (...args: number[]) => Date — constructor signature.
Отличается от call signature: new Foo() vs Foo().
abstract class / interface с new — для DI и фабрик.
InstanceType<C> извлекает тип экземпляра (utility, тема 07).
class expression совместим с typeof MyClass для value+type merge.`,
    interview: `- new signature vs call? — new для конструкторов; call для обычных функций.
- typeof Class vs InstanceType? — typeof — value constructor; InstanceType — instance.
- interface с new? — Описание конструктора без реализации.`,
    related: '- webdev/14. ts/018-elementy-oop-v-typescript.md\n- webdev/14. ts/009-raznica-abstract-class-i-interface.md',
    demo: `export interface Timestamped {
  createdAt: Date;
}

export interface TimestampedCtor {
  new (ms: number): Timestamped;
}

export class EventRecord implements Timestamped {
  createdAt: Date;
  constructor(ms: number) {
    this.createdAt = new Date(ms);
  }
}

export function createMany(
  Ctor: TimestampedCtor,
  values: number[],
): Timestamped[] {
  return values.map((ms) => new Ctor(ms));
}

export function isCtor(v: unknown): v is TimestampedCtor {
  return typeof v === 'function';
}`,
    test: `const list = createMany(EventRecord, [0, 1000]);
assert(list.length === 2);
assert(list[0] instanceof EventRecord);
assert(isCtor(EventRecord));`,
  },
  {
    num: 49,
    slug: 'async-promise-typing',
    folder: '05-functions',
    title: 'async and Promise typing',
    tags: ['functions', 'async', 'promise'],
    difficulty: 'medium',
    theory: `async function всегда возвращает Promise<T>, даже если return 1.
await сужает Promise<T> до T; try/catch для rejected promise.
Promise<void> — fire-and-forget side effects.
Типизация .then: then<TResult>(onfulfilled?: (value: T) => TResult).
never throw в async — rejection; Result pattern для явных ошибок.`,
    interview: `- return T vs return Promise<T> в async? — Оба оборачиваются в Promise.
- void vs undefined в Promise? — void игнорирует значение; undefined — явное.
- Awaited<T> utility? — Рекурсивно разворачивает Promise (тема 07).`,
    related: '- webdev/14. ts/014-utilitarnye-tipy-utility-types.md\n- webdev/10. async-js/001-raznica-mezhdu-sinhronnymi-i-asinhronnymi-funkciyami.md',
    runAsync: true,
    demo: `export async function delay(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

export async function fetchJson(url: string): Promise<{ ok: boolean; status: number }> {
  const res = await fetch(url);
  return { ok: res.ok, status: res.status };
}

export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number,
): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
    }
  }
  throw last;
}

export function okValue(): Promise<number> {
  return Promise.resolve(42);
}`,
    test: `await delay(1);
const v = await okValue();
assert(v === 42);
const once = await retry(async () => 7, 3);
assert(once === 7);`,
  },
  {
    num: 50,
    slug: 'void-callback',
    folder: '05-functions',
    title: 'void callback',
    tags: ['functions', 'void'],
    difficulty: 'medium',
    theory: `void в return callback означает: результат вызова игнорируется, не «должен вернуть undefined».
Поэтому () => [1,2,3] допустим как () => void — лишний return value отбрасывается.
forEach, addEventListener типизируют listener как void return.
Отличие void от undefined: undefined — конкретное значение; void — «не используй return».
never — функция не завершается (throw/loop).`,
    interview: `- Почему forEach callback может return number? — void return type allows ignored values.
- void vs undefined parameter? — param?: T vs param: T | undefined — разные strict rules.
- Когда never? — exhaustive throw, бесконечный цикл.`,
    related: '- webdev/14. ts/011-raznica-void-never-unknown.md\n- webdev/14. ts/022-opcjonalnye-i-defaultnye-parametry.md',
    demo: `export type VoidListener<T> = (event: T) => void;

export function subscribe<T>(listeners: VoidListener<T>[]): VoidListener<T> {
  return (event) => {
    for (const fn of listeners) fn(event);
  };
}

export function forEachVoid<T>(items: T[], fn: (item: T) => void): void {
  for (const item of items) fn(item);
}

export function tap<T>(value: T, fn: (v: T) => void): T {
  fn(value);
  return value;
}

export function runHandlers(events: string[], onEvent: (e: string) => void): number {
  forEachVoid(events, onEvent);
  return events.length;
}`,
    test: `let count = 0;
runHandlers(['a', 'b'], () => { count += 1; });
assert(count === 2);
assert(tap(5, (n) => { count += n; }) === 5);
assert(count === 7);
const emit = subscribe([(e: string) => { count += e.length; }]);
emit('zz');
assert(count === 9);`,
  },
];
