/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 31,
    slug: 'type-vs-interface',
    folder: '04-types-interfaces',
    title: 'type vs interface',
    tags: ['types', 'interface'],
    difficulty: 'medium',
    theory: `type и interface описывают форму объектов и во многом взаимозаменяемы.
interface удобен для публичных API: extends, declaration merging, лучше сообщения об ошибках при implements.
type мощнее для union, intersection, tuple, conditional и mapped types — interface так не выразить.
На собеседовании важно: structural typing — совместимость по форме, не по имени декларации.
Для React props часто type; для библиотечных расширяемых объектов — interface.
Оба поддерживают extends / intersection (&) для композиции полей.`,
    interview: `- Когда выбрать interface? — Публичный объектный контракт, merging, class implements.
- Когда type? — Union, tuple, utility-комбинации, branded/nominal-lite.
- Одинакова ли проверка структуры? — Да, structural typing для обоих.`,
    related: '- webdev/14. ts/008-raznica-type-i-interface.md\n- webdev/14. ts/007-tipy-v-typescript.md',
    demo: `export interface PointI {
  x: number;
  y: number;
}

export type PointT = { x: number; y: number };

/** Structural: любой объект с x,y подходит */
export function distanceFromOrigin(p: { x: number; y: number }): number {
  return Math.hypot(p.x, p.y);
}

export function sameCoords(a: PointI, b: PointT): boolean {
  return a.x === b.x && a.y === b.y;
}`,
    test: `assert(distanceFromOrigin({ x: 3, y: 4 }) === 5);
assert(sameCoords({ x: 1, y: 2 }, { x: 1, y: 2 }));`,
  },
  {
    num: 32,
    slug: 'extends-merging',
    folder: '04-types-interfaces',
    title: 'extends and intersection',
    tags: ['interface', 'extends'],
    difficulty: 'medium',
    theory: `interface Admin extends User добавляет поля к базе; компилятор объединяет формы.
type Admin = User & { role: string } — intersection для type-алиасов.
extends для interface — иерархия с понятными ошибками; & — гибче, но при конфликте свойств получаем never на ключе.
Множественное extends: interface C extends A, B { } — все поля должны быть совместимы.
Intersection с примитивами даёт never — осторожно с & string.`,
    interview: `- extends vs & для объектов? — Похожий результат; extends только у interface, & у type.
- Конфликт типов в &? — Свойство становится never, ошибка при использовании.
- Можно ли extends type? — interface extends только interface/type alias к объекту.`,
    related: '- webdev/14. ts/008-raznica-type-i-interface.md\n- webdev/14. ts/010-raznica-obedinenie-i-peresechenie.md',
    demo: `export interface User {
  id: string;
  name: string;
}

export interface Admin extends User {
  role: 'admin' | 'super';
}

export type Guest = User & { readonly guest: true };

export function isAdmin(u: User): u is Admin {
  return 'role' in u && (u as Admin).role !== undefined;
}

export function displayName(u: User): string {
  return isAdmin(u) ? \`[\${u.role}] \${u.name}\` : u.name;
}`,
    test: `const admin: Admin = { id: '1', name: 'Ann', role: 'admin' };
assert(displayName(admin) === '[admin] Ann');
assert(isAdmin(admin));
assert(!isAdmin({ id: '2', name: 'Bob' }));`,
  },
  {
    num: 33,
    slug: 'declaration-merging',
    folder: '04-types-interfaces',
    title: 'declaration merging',
    tags: ['interface', 'merging'],
    difficulty: 'medium',
    theory: `Одинаковые interface с одним именем в одной области сливаются (declaration merging).
Полезно для расширения глобальных типов и ambient-деклараций (@types).
type не сливается — повторное объявление type с тем же именем — ошибка.
Функции и namespace тоже участвуют в merging в advanced-сценариях.
В прикладном коде merging — для module augmentation, не для «дописать поля в рантайме».`,
    interview: `- Почему merging только у interface? — Историческая модель TS для расширяемых деклараций.
- Опасность merging? — Неожиданные поля при одинаковых именах в больших проектах.
- type можно «дополнить»? — Нет; только новый алиас или intersection.`,
    related: '- webdev/14. ts/008-raznica-type-i-interface.md\n- webdev/14. ts/025-klyuchevoe-slovo-declare.md',
    demo: `export interface AppConfig {
  host: string;
}

export interface AppConfig {
  port: number;
  debug?: boolean;
}

export function buildBaseUrl(cfg: AppConfig): string {
  const proto = cfg.debug ? 'http' : 'https';
  return \`\${proto}://\${cfg.host}:\${cfg.port}\`;
}

export function mergeRuntimeFlags(
  cfg: AppConfig,
  flags: Partial<Pick<AppConfig, 'debug'>>,
): AppConfig {
  return { ...cfg, ...flags };
}`,
    test: `const cfg: AppConfig = { host: 'api.local', port: 3000, debug: true };
assert(buildBaseUrl(cfg) === 'http://api.local:3000');
assert(mergeRuntimeFlags(cfg, { debug: false }).debug === false);`,
  },
  {
    num: 34,
    slug: 'callable-interface',
    folder: '04-types-interfaces',
    title: 'callable interface',
    tags: ['interface', 'function'],
    difficulty: 'medium',
    theory: `Интерфейс может описать вызываемый объект через call signature: (args) => R.
Синтаксис: interface Fn { (x: number): string; } — аналог type Fn = (x: number) => string.
Несколько call/overload-сигнатур в одном interface — как у function overload types.
Constructor signature: new (...args) => Instance — для фабрик и классов.`,
    interview: `- interface vs type для функции? — Эквивалентно для простой сигнатуры.
- Зачем callable interface? — Объект-функция с полями (например, debounced fn + .cancel).
- new () в interface? — Constructor signature для типизации new Expression.`,
    related: '- webdev/14. ts/007-tipy-v-typescript.md\n- webdev/14. ts/021-peregruzka-funkcij.md',
    demo: `export interface Formatter {
  (value: number): string;
  precision: number;
}

export function createFormatter(precision: number): Formatter {
  const fn = ((value: number) => value.toFixed(precision)) as Formatter;
  fn.precision = precision;
  return fn;
}

export interface CompareFn {
  (a: string, b: string): number;
}

export function sortWith(copy: string[], cmp: CompareFn): string[] {
  return [...copy].sort(cmp);
}`,
    test: `const fmt = createFormatter(2);
assert(fmt(3.14159) === '3.14');
assert(fmt.precision === 2);
assert(sortWith(['b', 'a'], (a, b) => a.localeCompare(b)).join('') === 'ab');`,
  },
  {
    num: 35,
    slug: 'hybrid-types',
    folder: '04-types-interfaces',
    title: 'hybrid types',
    tags: ['interface', 'callable'],
    difficulty: 'hard',
    theory: `Hybrid type — объект, который одновременно функция и носитель свойств/методов.
В TS: call signature + property signatures в одном interface/type.
Примеры: jQuery $(...), промис с .then, маршрутизатор Express app().
Типизация: отдельно описать (args)=>R и поля; реализация через Object.assign или cast.
Осторожно с this и bind при присвоении методов на функцию.`,
    interview: `- Пример hybrid в экосистеме? — Function с полями .displayName, router.handle.
- Как типизировать? — Callable interface + поля в том же типе.
- Альтернатива? — Класс со static, если не нужен call как primary API.`,
    related: '- webdev/14. ts/007-tipy-v-typescript.md\n- webdev/14. ts/008-raznica-type-i-interface.md',
    demo: `export interface TaggedFn<T> {
  (input: T): T;
  tag: string;
  timesCalled: number;
}

export function createTagged<T>(tag: string, fn: (input: T) => T): TaggedFn<T> {
  const wrapped = ((input: T) => {
    wrapped.timesCalled += 1;
    return fn(input);
  }) as TaggedFn<T>;
  wrapped.tag = tag;
  wrapped.timesCalled = 0;
  return wrapped;
}

export function describeTagged<T>(f: TaggedFn<T>): string {
  return \`\${f.tag}(\${f.timesCalled})\`;
}`,
    test: `const double = createTagged('double', (n: number) => n * 2);
assert(double(5) === 10);
assert(double(1) === 2);
assert(describeTagged(double) === 'double(2)');`,
  },
  {
    num: 36,
    slug: 'index-signature',
    folder: '04-types-interfaces',
    title: 'index signature',
    tags: ['interface', 'index'],
    difficulty: 'medium',
    theory: `[key: string]: T — индексная сигнатура: любые строковые ключи с значением T.
string | number | symbol — допустимые типы ключа в современном TS.
Все явные свойства должны быть совместимы с индексной сигнатурой.
Record<string, T> — type-алиас для словаря; по смыслу близок к index signature.
readonly [key: string]: T запрещает присвоение новых ключей на уровне типов.`,
    interview: `- Index signature vs Record? — Record удобнее для чистых словарей; interface — когда есть фиксированные поля + индекс.
- Почему number index редок? — number ключи приводятся к string в объектах JS.
- Ограничение значений? — Явные поля не могут быть уже, чем индексный тип.`,
    related: '- webdev/14. ts/007-tipy-v-typescript.md',
    demo: `export interface StringDict {
  [key: string]: string;
}

export interface Scores extends StringDict {
  total?: string;
}

export function sumNumericValues(dict: Record<string, number>): number {
  return Object.values(dict).reduce((acc, n) => acc + n, 0);
}

export function pickKeys<T extends Record<string, unknown>>(
  obj: T,
  keys: string[],
): Partial<T> {
  const out: Partial<T> = {};
  for (const k of keys) {
    if (k in obj) out[k as keyof T] = obj[k as keyof T];
  }
  return out;
}`,
    test: `assert(sumNumericValues({ a: 1, b: 2, c: 3 }) === 6);
const partial = pickKeys({ x: 1, y: 2, z: 3 }, ['x', 'z']);
assert(partial.x === 1 && partial.y === undefined);`,
  },
  {
    num: 37,
    slug: 'branded-lite',
    folder: '04-types-interfaces',
    title: 'branded types (lite)',
    tags: ['types', 'branded'],
    difficulty: 'hard',
    theory: `Structural typing не различает string и string на уровне домена (UserId vs OrderId).
Branded type: type UserId = string & { readonly __brand: 'UserId' } — номинальный маркер без рантайма.
Создание только через фабрику createUserId(s), иначе случайно не перепутать id.
Полноценные branded — через unique symbol; lite-вариант с __brand достаточен на собеседовании.
В рантайме это обычная строка; защита только на этапе компиляции.`,
    interview: `- Зачем brand, если string? — Запретить смешивание доменных идентификаторов.
- Есть ли overhead? — Нет в JS; только проверка TS.
- brand vs class wrapper? — Brand дешевле; class — если нужна валидация в рантайме.`,
    related: '- webdev/14. ts/008-raznica-type-i-interface.md\n- webdev/14. ts/014-utilitarnye-tipy-utility-types.md',
    demo: `export type UserId = string & { readonly __brand: 'UserId' };
export type OrderId = string & { readonly __brand: 'OrderId' };

export function createUserId(raw: string): UserId {
  if (!raw.startsWith('u_')) throw new Error('invalid user id');
  return raw as UserId;
}

export function createOrderId(raw: string): OrderId {
  if (!raw.startsWith('o_')) throw new Error('invalid order id');
  return raw as OrderId;
}

export function linkOrderToUser(orderId: OrderId, userId: UserId): string {
  return \`\${orderId}@\${userId}\`;
}`,
    test: `const u = createUserId('u_42');
const o = createOrderId('o_99');
assert(linkOrderToUser(o, u) === 'o_99@u_42');
let threw = false;
try { createUserId('bad'); } catch { threw = true; }
assert(threw);`,
  },
  {
    num: 38,
    slug: 'tuple-types',
    folder: '04-types-interfaces',
    title: 'tuple types',
    tags: ['tuple', 'types'],
    difficulty: 'medium',
    theory: `Tuple — массив фиксированной длины с типом на каждой позиции: [string, number].
Отличие от array T[]: длина и позиции часть контракта; [T, ...T[]] — variadic tuple.
Деструктуризация сохраняет точные типы элементов.
React useState возвращает tuple [state, setter]; координаты [x, y, z].
as const делает tuple из readonly литералов.`,
    interview: `- Tuple vs array? — Tuple фиксирует длину/позиции; T[] — любое количество.
- Optional/rest в tuple? — [string, ...number[]] — rest element.
- Почему не object {x,y}? — Tuple удобен для порядка и деструктуризации.`,
    related: '- webdev/14. ts/007-tipy-v-typescript.md',
    demo: `export type Rgb = [number, number, number];
export type NamedSize = [name: string, width: number, height: number];

export function toHex([r, g, b]: Rgb): string {
  const h = (n: number) => n.toString(16).padStart(2, '0');
  return \`#\${h(r)}\${h(g)}\${h(b)}\`;
}

export function area([, w, h]: NamedSize): number {
  return w * h;
}

export function first<T extends readonly unknown[]>(tuple: T): T[0] {
  return tuple[0];
}`,
    test: `assert(toHex([255, 0, 128]) === '#ff0080');
assert(area(['box', 4, 5]) === 20);
assert(first(['a', 'b'] as const) === 'a');`,
  },
  {
    num: 39,
    slug: 'readonly-tuple',
    folder: '04-types-interfaces',
    title: 'readonly tuple',
    tags: ['tuple', 'readonly'],
    difficulty: 'medium',
    theory: `readonly [string, number] запрещает push/pop и присвоение по индексу на уровне типов.
as const на массиве литерале даёт deep readonly tuple с literal types.
Readonly<T> для tuple делает readonly версию; ReadonlyArray<T> — только для обычных массивов.
Иммутабельные кортежи полезны для координат, ключей routes, фиксированных конфигов.`,
    interview: `- readonly tuple vs ReadonlyArray? — Tuple сохраняет длину и позиционные типы.
- Можно ли мутировать в runtime? — Да, если объект не Object.freeze; TS только static check.
- as const vs readonly modifier? — as const выводит литералы и readonly автоматически.`,
    related: '- webdev/14. ts/007-tipy-v-typescript.md\n- webdev/14. ts/004-plyusy-ispolzovaniya-typescript.md',
    demo: `export type ReadonlyPoint = readonly [number, number];

export function movePoint(p: ReadonlyPoint, dx: number, dy: number): ReadonlyPoint {
  return [p[0] + dx, p[1] + dy] as const;
}

export function freezePoint(p: [number, number]): ReadonlyPoint {
  return Object.freeze([...p]) as ReadonlyPoint;
}

export function pointsEqual(a: ReadonlyPoint, b: ReadonlyPoint): boolean {
  return a[0] === b[0] && a[1] === b[1];
}`,
    test: `const p = freezePoint([1, 2]);
const moved = movePoint(p, 1, 1);
assert(moved[0] === 2 && moved[1] === 3);
assert(movePoint([0, 0], 3, 4)[0] === 3);`,
  },
  {
    num: 40,
    slug: 'recursive-interface-lite',
    folder: '04-types-interfaces',
    title: 'recursive interface (lite)',
    tags: ['interface', 'recursive'],
    difficulty: 'hard',
    theory: `interface может ссылаться на себя: TreeNode { children: TreeNode[] }.
Нужно для деревьев, JSON, AST, меню навигации.
type alias тоже рекурсивен: type Json = string | number | Json[] | { [k: string]: Json }.
Ограничение глубины — только логика приложения; TS не лимитирует рекурсию типов (кроме complexity).
Для optional children используй children?: TreeNode[].`,
    interview: `- interface vs type для рекурсии? — Оба работают; type удобнее для union-рекурсии (JSON).
- Опасность? — Бесконечная вложенность в данных, не в типе.
- JSON type на собеседовании? — Классический recursive union type.`,
    related: '- webdev/14. ts/007-tipy-v-typescript.md\n- webdev/14. ts/008-raznica-type-i-interface.md',
    demo: `export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export function countNodes(root: TreeNode): number {
  let n = 1;
  for (const child of root.children ?? []) n += countNodes(child);
  return n;
}

export function findById(root: TreeNode, id: string): TreeNode | undefined {
  if (root.id === id) return root;
  for (const child of root.children ?? []) {
    const found = findById(child, id);
    if (found) return found;
  }
  return undefined;
}

export function maxDepth(root: TreeNode): number {
  const kids = root.children ?? [];
  if (kids.length === 0) return 1;
  return 1 + Math.max(...kids.map(maxDepth));
}`,
    test: `const tree: TreeNode = {
  id: 'r', label: 'root', children: [
    { id: 'a', label: 'a' },
    { id: 'b', label: 'b', children: [{ id: 'b1', label: 'b1' }] },
  ],
};
assert(countNodes(tree) === 4);
assert(findById(tree, 'b1')?.label === 'b1');
assert(maxDepth(tree) === 3);`,
  },
];
