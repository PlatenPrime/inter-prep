# Q007. Типы в TypeScript?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

TypeScript имеет богатую систему типов: **примитивы** (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`), **объектные типы** (`object`, массивы, кортежи), **специальные типы** (`any`, `unknown`, `never`, `void`), **составные типы** (union `|`, intersection `&`) и **литеральные типы**. Все они выстраиваются в иерархию совместимости.

---

## Развёрнутый ответ

### Суть и определение

Система типов TypeScript — **структурная и постепенная (gradual)**. Каждое значение имеет тип; компилятор отслеживает их совместимость на этапе статического анализа.

### Как это работает

#### Примитивные типы

```typescript
let str: string = "hello";
let num: number = 42;           // включает NaN и Infinity
let bool: boolean = true;
let undef: undefined = undefined;
let nul: null = null;           // требует strictNullChecks для изоляции
let sym: symbol = Symbol("id");
let big: bigint = 9007199254740993n;
```

#### Специальные типы

| Тип | Описание |
|-----|----------|
| `any` | Отключает проверку; присваиваем что угодно, используем как угодно |
| `unknown` | «Безопасный any»: перед использованием нужно сузить тип |
| `never` | Недостижимый тип: пустой union, функция никогда не возвращает |
| `void` | Функция ничего не возвращает (может вернуть `undefined`) |

#### Объектные типы

```typescript
// Объект — через interface или type alias
interface Point { x: number; y: number; }
type Rect = { width: number; height: number };

// Массив
let nums: number[] = [1, 2, 3];
let strs: Array<string> = ["a", "b"];

// Кортеж (Tuple) — фиксированная длина и типы
let pair: [string, number] = ["age", 30];
let rest: [string, ...number[]] = ["values", 1, 2, 3];

// Функция
type Predicate<T> = (value: T) => boolean;

// Индексируемый тип
type StringMap = { [key: string]: string };
// или
type StringRecord = Record<string, string>;
```

#### Литеральные типы

```typescript
type Direction = "north" | "south" | "east" | "west";
type HttpStatus = 200 | 201 | 400 | 404 | 500;
type Enabled = true; // только true

const dir: Direction = "north"; // OK
const bad: Direction = "up";    // Error: "up" не входит в тип
```

#### Union (объединение) и Intersection (пересечение)

```typescript
type StringOrNumber = string | number; // или одно, или другое
type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged; // и то, и другое одновременно
```

#### Тип `object` и связанные

```typescript
let obj: object = {};         // любой не-примитив
let obj2: {} = "hello";       // {} = любое ненулевое значение (!)
let obj3: Object = 42;        // Object = обёртка примитивов — избегать
```

> `{}` (пустой объектный тип) — не означает «пустой объект»; означает «любое значение, кроме null/undefined». Это частая ловушка.

#### Специальные составные типы

```typescript
// Conditional type
type IsArray<T> = T extends any[] ? true : false;

// Mapped type
type Optional<T> = { [K in keyof T]?: T[K] };

// Template literal type
type EventName = `on${Capitalize<string>}`;
```

### Практика и применение

- `string | null` — возвращаемый тип функции, которая может не найти результат
- Литеральные типы — для строгих значений: статусы, направления, события
- Кортежи — для `useState` в React: `[T, Dispatch<SetStateAction<T>>]`
- `Record<K, V>` — словари с известными типами ключа и значения

### Важные нюансы и краеугольные камни

- `null` и `undefined` — разные типы; при `strictNullChecks` они не присваиваемы другим типам
- **`number` включает `NaN` и `Infinity`** — TypeScript не различает их на уровне типа
- **`{}` ≠ пустой объект** — это «что угодно, кроме null/undefined»; используйте `Record<string, never>` для пустого
- **Массив vs кортеж**: `[string, number]` — кортеж с фиксированными позициями; `Array<string | number>` — массив переменной длины
- `symbol` и `bigint` полностью поддерживаются, но требуют `ES2015+` как target

### Примеры

```typescript
// Полный обзор в одном месте
type ID = string | number;                    // Union
type AdminUser = User & { role: "admin" };    // Intersection

function parseId(raw: unknown): ID {          // unknown требует проверки
  if (typeof raw === "string" || typeof raw === "number") {
    return raw;
  }
  throw new Error("Invalid ID");
}

// Exhaustive check с never
type Shape = { kind: "circle"; r: number } | { kind: "rect"; w: number; h: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.r ** 2;
    case "rect":   return shape.w * shape.h;
    default: {
      const _exhaustive: never = shape; // ошибка если добавили вид без case
      return _exhaustive;
    }
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем отличается `null` от `undefined` в TypeScript?** — семантически: `null` — намеренное отсутствие, `undefined` — не инициализировано; в TS — разные типы при `strictNullChecks`
- **Что такое `never` и где используется?** — тип пустого множества; в exhaustive checks, в типах функций, бросающих исключения
- **Чем `{}` отличается от `object`?** — `{}` допускает примитивы (кроме null/undefined); `object` — только не-примитивы
- **Что такое литеральные типы?** — конкретные значения как типы; в union дают discriminated unions

### Красные флаги (чего не говорить)

- «`number` не включает NaN» — включает; проверяйте `Number.isNaN()` в рантайме
- «`{}` — это тип пустого объекта» — нет, это тип «ненулевое значение»
- «`any` и `unknown` одно и то же» — `any` отключает проверки, `unknown` требует сужения перед использованием

### Связанные темы

- `011-raznica-void-never-unknown.md`
- `012-raznica-any-i-unknown.md`
- `010-raznica-obedinenie-i-peresechenie.md`
- `015-suzhenie-tipov-type-narrowing.md`
