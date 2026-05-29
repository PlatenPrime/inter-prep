# Q021. Поддерживает ли TypeScript перегрузку функций?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

Да, TypeScript поддерживает **перегрузку функций (function overloading)**, но только на уровне типов. Определяются несколько сигнатур вызова, а затем одна **реализующая сигнатура** с общей логикой. В JavaScript-рантайме остаётся единственная функция — перегрузка полностью compile-time.

---

## Развёрнутый ответ

### Суть и определение

В языках вроде C++ или Java перегрузка — это несколько функций с одним именем, но разными параметрами. В TypeScript перегрузка реализована иначе: **несколько сигнатур типов** + **одна реализация**. Компилятор проверяет соответствие вызова одной из сигнатур, но в рантайме выполняется единая функция.

### Как это работает

#### Базовый синтаксис

```typescript
// Сигнатуры перегрузки (только типы, без тела)
function format(value: string): string;
function format(value: number, decimals?: number): string;
function format(value: Date): string;

// Реализующая сигнатура — должна быть совместима со ВСЕМИ сигнатурами выше
function format(value: string | number | Date, decimals?: number): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number") {
    return value.toFixed(decimals ?? 2);
  }
  return value.toISOString();
}

// Вызов — компилятор выбирает подходящую сигнатуру
const s = format("hello ");   // string
const n = format(3.14159, 2); // string
const d = format(new Date()); // string

// Реализующая сигнатура недоступна напрямую:
// format(true); // Error — не совпадает ни с одной из трёх сигнатур
```

#### Перегрузка методов класса

```typescript
class EventEmitter {
  private handlers = new Map<string, Set<Function>>();

  on(event: "data", handler: (data: Buffer) => void): this;
  on(event: "end", handler: () => void): this;
  on(event: "error", handler: (err: Error) => void): this;
  on(event: string, handler: Function): this {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return this;
  }
}

const emitter = new EventEmitter();
emitter
  .on("data", (data) => console.log(data.length)) // data: Buffer
  .on("end", () => console.log("done"))            // handler: () => void
  .on("error", (err) => console.error(err.message)); // err: Error
```

#### Перегрузка с разным числом параметров

```typescript
function createElement(tag: "a"): HTMLAnchorElement;
function createElement(tag: "canvas"): HTMLCanvasElement;
function createElement(tag: "table"): HTMLTableElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const anchor = createElement("a");    // HTMLAnchorElement — полная типизация
const canvas = createElement("canvas"); // HTMLCanvasElement
```

#### Альтернатива: generic или union

```typescript
// Иногда перегрузка избыточна — можно обойтись generic или union

// Вместо перегрузки:
function identity(x: string): string;
function identity(x: number): number;
function identity(x: string | number): string | number { return x; }

// Через generic (лаконичнее):
function identity<T extends string | number>(x: T): T { return x; }

// Результат одинаковый, generic предпочтительнее когда тип входа = типу выхода
```

### Практика и применение

- **Перегрузка уместна** когда одна функция ведёт себя по-разному в зависимости от типов аргументов — и разные вызовы должны возвращать разные типы
- **DOM API** TypeScript использует перегрузки повсюду: `document.querySelector`, `element.addEventListener`, `fetch`
- **Чейнинг**: методы, возвращающие `this`, часто перегружены для точного типа возврата

### Важные нюансы и краеугольные камни

- **Реализующая сигнатура невидима снаружи**: компилятор показывает только объявленные сигнатуры перегрузки
- **Порядок сигнатур важен**: компилятор проверяет их сверху вниз и берёт первую совпавшую — более специфичные должны идти первыми
- **Реализация должна обрабатывать все кейсы**: если сигнатура допускает `string | number`, реализация обязана обработать оба
- **Перегрузка сложнее, чем кажется**: часто достаточно union типов или generics; злоупотребление перегрузками усложняет читаемость
- **Arrow functions** не поддерживают синтаксис перегрузки функций напрямую; перегружаются через тип

```typescript
// Перегрузка через тип для arrow function
type FormatFn = {
  (value: string): string;
  (value: number): string;
};

const formatValue: FormatFn = (value: string | number): string => {
  return typeof value === "string" ? value.trim() : value.toFixed(2);
};
```

### Примеры

```typescript
// Реальный пример: fetch-обёртка с типизированным ответом
function apiFetch(url: string): Promise<unknown>;
function apiFetch<T>(url: string, schema: ZodSchema<T>): Promise<T>;
function apiFetch<T>(url: string, schema?: ZodSchema<T>): Promise<T | unknown> {
  return fetch(url)
    .then(r => r.json())
    .then(data => schema ? schema.parse(data) : data);
}

// Вызов без схемы — Promise<unknown>, заставляет проверять
const raw = await apiFetch("/api/data");

// Вызов со схемой — типизированный результат
const user = await apiFetch("/api/user/1", UserSchema); // Promise<User>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Сколько реализаций может быть у перегруженной функции?** — ровно одна; несколько сигнатур, одна реализация
- **Видна ли реализующая сигнатура при вызове?** — нет; IDE показывает только задекларированные сигнатуры перегрузки
- **Когда использовать перегрузку vs generic?** — generic — когда тип выхода зависит от типа входа одинаково; перегрузка — когда логика/типы выхода принципиально разные
- **Работает ли перегрузка для стрелочных функций?** — синтаксически нет; нужен отдельный тип с call signatures

### Красные флаги (чего не говорить)

- «В TypeScript можно написать несколько реализаций функции с одним именем» — нет, только одна реализация; перегрузка — это декларации типов
- «Перегрузка работает в рантайме» — нет, это compile-time feature; в JS остаётся одна функция
- «Реализующую сигнатуру можно вызвать напрямую» — нет, она недоступна снаружи; компилятор работает только с объявленными сигнатурами

### Связанные темы

- `022-opcjonalnye-i-defaultnye-parametry.md`
- `013-genericheskie-tipy-generic.md`
- `007-tipy-v-typescript.md`
