# Q015. Что такое сужение типов (Type narrowing)?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

**Type narrowing** — процесс, при котором TypeScript уточняет (сужает) тип переменной в определённой ветке кода на основе проверок. После `if (typeof x === "string")` TypeScript знает, что внутри блока `x` точно `string`. Это позволяет безопасно работать с union-типами, `unknown` и nullable значениями.

---

## Развёрнутый ответ

### Суть и определение

TypeScript **отслеживает поток управления** (control flow analysis): в каждой точке программы компилятор знает, какой набор типов возможен для переменной с учётом всех пройденных проверок. Narrowing — это сужение этого набора.

### Как это работает

#### 1. `typeof` narrowing

```typescript
function pad(value: string | number, padding: string | number): string {
  if (typeof padding === "string") {
    return padding + value; // padding: string
  }
  // Здесь padding: number (string исключён выше)
  return " ".repeat(padding) + value;
}
```

#### 2. `instanceof` narrowing

```typescript
function formatDate(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString(); // value: Date
  }
  return value;                 // value: string
}
```

#### 3. Narrowing через `in`

```typescript
interface Cat { meow(): void; }
interface Dog { bark(): void; }

function speak(animal: Cat | Dog): void {
  if ("meow" in animal) {
    animal.meow(); // animal: Cat
  } else {
    animal.bark(); // animal: Dog
  }
}
```

#### 4. Discriminated Union narrowing

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function handleResult<T>(result: Result<T>): T {
  if (result.success) {
    return result.data;  // result: { success: true; data: T }
  }
  throw new Error(result.error); // result: { success: false; error: string }
}
```

#### 5. Проверка на null / undefined (Truthiness narrowing)

```typescript
function greet(name: string | null | undefined): string {
  if (name) {
    return `Hello, ${name.toUpperCase()}`; // name: string (null и undefined исключены)
  }
  return "Hello, stranger";
}

// Оператор ?. и ?? не сужают тип, но безопасно обращаются
const upper = name?.toUpperCase(); // string | undefined — не narrowing
```

#### 6. User-defined Type Guards (`is`)

```typescript
// Type predicate — функция, сужающая тип
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as User).id === "string" &&
    typeof (value as User).name === "string"
  );
}

function processInput(input: unknown): string {
  if (isString(input)) {
    return input.toUpperCase(); // input: string
  }
  if (isUser(input)) {
    return input.name;          // input: User
  }
  return String(input);
}
```

#### 7. Assertion Functions (TS 3.7+)

```typescript
// asserts x is T — бросает если не соответствует, иначе сужает
function assertIsString(x: unknown): asserts x is string {
  if (typeof x !== "string") {
    throw new TypeError(`Expected string, got ${typeof x}`);
  }
}

function processValue(value: unknown) {
  assertIsString(value);
  // После assertion — value: string
  console.log(value.toUpperCase());
}
```

#### 8. `never` в exhaustive check

```typescript
type Color = "red" | "green" | "blue";

function getHex(color: Color): string {
  switch (color) {
    case "red":   return "#FF0000";
    case "green": return "#00FF00";
    case "blue":  return "#0000FF";
    default: {
      const _: never = color; // TS ругнётся, если добавить "yellow" без case
      throw new Error(`Unhandled color: ${_}`);
    }
  }
}
```

### Практика и применение

- **API ответы**: `unknown` → narrowing → конкретный тип (вместо `as`)
- **React state**: discriminated union для `idle | loading | success | error`
- **Event handlers**: `e.target instanceof HTMLInputElement` перед `e.target.value`
- **Defensive programming**: проверки перед использованием данных из `JSON.parse`

### Важные нюансы и краеугольные камни

- **Truthiness narrowing**: `if (value)` исключает `null`, `undefined`, `0`, `""`, `NaN`, `false` — не только null/undefined
- **`typeof null === "object"`** — JavaScript quirk; всегда проверяй `value !== null` при narrowing объектов
- **Type guards с `in`**: только проверяют наличие ключа, но не тип значения — `"meow" in animal` не гарантирует тип `meow`
- **Assertion functions** сужают тип, только если функция не бросает — компилятор доверяет контракту
- **Control flow** отслеживается на уровне блоков (`if`, `switch`, `while`), но не через колбэки и async/await без дополнительных проверок

### Примеры

```typescript
// Паттерн: безопасная работа с данными из fetch
interface ApiUser {
  id: string;
  name: string;
  email: string;
}

function isApiUser(value: unknown): value is ApiUser {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    typeof v.email === "string"
  );
}

async function getUser(id: string): Promise<ApiUser> {
  const res = await fetch(`/api/users/${id}`);
  const data: unknown = await res.json();

  if (!isApiUser(data)) {
    throw new Error("Invalid API response shape");
  }

  return data; // ApiUser — безопасно
}

// Паттерн: State machine с discriminated union
type LoadingState<T> =
  | { status: "idle" }
  | { status: "loading"; controller: AbortController }
  | { status: "success"; data: T; timestamp: number }
  | { status: "error"; error: Error; retries: number };

function renderState<T>(state: LoadingState<T>): string {
  switch (state.status) {
    case "idle":    return "Ready";
    case "loading": return `Loading... (abort: ${!!state.controller})`;
    case "success": return `Data loaded at ${state.timestamp}`;
    case "error":   return `Error: ${state.error.message} (retry ${state.retries})`;
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое type predicate (`value is Type`)?** — возвращаемый тип функции-guard; TypeScript использует его для сужения в месте вызова
- **Чем `as` отличается от type guard?** — `as` — принудительное утверждение без проверки; type guard — реальная проверка в рантайме, безопасна
- **Что такое control flow analysis?** — TypeScript отслеживает возможные типы в каждой точке кода с учётом всех условий
- **Как сделать exhaustive check?** — в default ветке присвоить переменную типу `never`; TS ругнётся при необработанных вариантах

### Красные флаги (чего не говорить)

- «Для проверки типа используй `as`» — `as` не проверяет тип, просто переопределяет; используй type guards
- «Truthiness narrowing убирает только null» — убирает всё falsy: `null`, `undefined`, `0`, `""`, `NaN`, `false`
- «`typeof null === "null"`» — нет, это `"object"` из-за JS-багажа; всегда добавляй `&& value !== null`

### Связанные темы

- `007-tipy-v-typescript.md`
- `010-raznica-obedinenie-i-peresechenie.md`
- `011-raznica-void-never-unknown.md`
- `012-raznica-any-i-unknown.md`
