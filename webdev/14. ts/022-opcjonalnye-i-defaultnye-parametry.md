# Q022. Как TypeScript поддерживает необязательные и дефолтные параметры в функции?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

TypeScript поддерживает **необязательные параметры** через `?` (тип становится `T | undefined`) и **параметры по умолчанию** через `= defaultValue` (как в JS, но с типовыводом). Оба варианта обязаны идти **после** обязательных параметров. Дефолтные параметры могут находиться перед обязательными, если явно передавать `undefined`.

---

## Развёрнутый ответ

### Суть и определение

JavaScript поддерживает дефолтные параметры с ES2015. TypeScript добавляет к ним **статическую типизацию** и дополнительный синтаксис `?` для явного обозначения необязательности.

### Как это работает

#### Необязательные параметры (`?`)

```typescript
function greet(name: string, greeting?: string): string {
  // greeting: string | undefined — TypeScript расширяет тип
  return `${greeting ?? "Hello"}, ${name}!`;
}

greet("Alice");           // "Hello, Alice!"
greet("Alice", "Hi");     // "Hi, Alice!"
greet("Alice", undefined); // "Hello, Alice!" — явный undefined допустим
// greet("Alice", null);  // Error: null не принимается (с strictNullChecks)
```

#### Дефолтные параметры (`= value`)

```typescript
function createUser(
  name: string,
  role: "admin" | "user" | "guest" = "user", // тип выводится из default
  active: boolean = true
): User {
  return { name, role, active };
}

createUser("Alice");                    // role: "user", active: true
createUser("Bob", "admin");             // role: "admin", active: true
createUser("Charlie", "guest", false);  // полный вызов
createUser("Dave", undefined, false);   // role: "user" (default при undefined)
```

**Тип параметра с дефолтом выводится автоматически**: `role` — `"admin" | "user" | "guest"`, не нужно явно аннотировать если тип очевиден из значения.

#### Разница: `?` vs `= value`

```typescript
// Необязательный: greeting?: string
// Внутри функции — greeting: string | undefined
function withOptional(greeting?: string) {
  greeting.toUpperCase(); // Error: greeting is possibly undefined
  greeting?.toUpperCase(); // OK — optional chaining
}

// Дефолтный: greeting: string = "Hello"
// Внутри функции — greeting: string (undefined уже обработан)
function withDefault(greeting: string = "Hello") {
  greeting.toUpperCase(); // OK — string гарантирован
}
```

#### Дефолтный параметр перед обязательным

```typescript
// Дефолтный до обязательного — можно, но нужно передавать undefined
function build(config: Config = {}, id: string): string {
  return `${id}:${JSON.stringify(config)}`;
}

build(undefined, "item-1"); // config получит {}
build({ debug: true }, "item-2");
```

Это редкий паттерн; лучше переставить параметры или использовать options object.

#### Options Object паттерн (рекомендуемый для 3+ параметров)

```typescript
interface CreateOrderOptions {
  userId: string;
  currency?: string;
  discount?: number;
  express?: boolean;
}

function createOrder({
  userId,
  currency = "USD",
  discount = 0,
  express = false,
}: CreateOrderOptions): Order {
  // все параметры с дефолтами безопасны
  return { userId, currency, discount, express };
}

// Вызов — любой порядок, только нужные поля
createOrder({ userId: "u-1" });
createOrder({ userId: "u-1", currency: "EUR", express: true });
```

#### Rest параметры

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

sum(1, 2, 3);        // 6
sum(...[1, 2, 3, 4]); // 10
```

### Практика и применение

- **Необязательный `?`** — когда параметр реально опционален и `undefined` — осмысленное значение
- **Дефолтный `=`** — когда есть разумное значение по умолчанию; предпочтительнее `?` с `?? defaultValue` внутри
- **Options Object** — для 3+ параметров или когда вероятно добавление новых опций; самодокументирующийся
- **Rest `...`** — для variadic функций (математика, форматирование, merge объектов)

### Важные нюансы и краеугольные камни

- **Необязательные параметры должны идти после обязательных** (кроме случая с явным `undefined`)
- **`undefined` активирует дефолт**: при дефолтном параметре передача `undefined` использует значение по умолчанию; `null` — нет
- **Деструктуризация с дефолтами** в options object: `{ value = 0 } = {}` — двойная дефолтность (параметр и поле)
- **Типизация options object**: лучше именованный `interface`, чем inline `{ a?: number, b?: string }` — для переиспользования и документации
- **Required fields в options**: если поле обязательно — не добавляй `?`; компилятор поймает отсутствие

### Примеры

```typescript
// Реальный паттерн: API клиент с опциями
interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

async function apiRequest<T>(
  url: string,
  {
    method = "GET",
    body,
    headers = {},
    timeout = 5000,
    retries = 0,
  }: FetchOptions = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Чистые вызовы
const user = await apiRequest<User>("/api/users/1");
const created = await apiRequest<User>("/api/users", {
  method: "POST",
  body: { name: "Alice" },
});
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница `param?: T` и `param: T | undefined`?** — `?` означает «параметр можно не передавать вообще»; `T | undefined` — параметр обязательно присутствует в вызове, но может быть undefined
- **Когда `undefined` активирует дефолт?** — дефолтный параметр: `undefined` → default; `null` → остаётся null
- **Почему options object предпочтительнее множества параметров?** — именованность, порядок не важен, легко добавлять новые опции без breaking change
- **Как типизировать rest-параметры?** — `...args: T[]` для однородных; `...args: [string, number, ...boolean[]]` для кортежа

### Красные флаги (чего не говорить)

- «Необязательный параметр и параметр с дефолтом — одно и то же» — `?` даёт `T | undefined` внутри; `= value` гарантирует `T`
- «`null` активирует дефолтное значение» — нет, только `undefined`; `null` — явное значение
- «Необязательные параметры можно ставить в любом месте» — только после обязательных (если не `undefined`-trick)

### Связанные темы

- `021-peregruzka-funkcij.md`
- `007-tipy-v-typescript.md`
- `023-oblasti-vidimosti.md`
