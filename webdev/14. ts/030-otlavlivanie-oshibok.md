# Q030. Как вы отлавливаете ошибки в TypeScript коде?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

Ошибки в TypeScript отлавливаются на нескольких уровнях: **статический анализ компилятора** (`tsc`, IDE) поймает ошибки типов; **ESLint с TypeScript плагином** — code quality проблемы; **runtime try/catch с `unknown`** — исключения; **Zod/Valibot** — ошибки валидации данных из внешних источников. Комплексный подход перекрывает все уровни.

---

## Развёрнутый ответ

### Суть и определение

Обработка ошибок в TypeScript — многоуровневая задача. TypeScript добавляет compile-time проверки, но не убирает необходимость runtime обработки.

### Как это работает

#### Уровень 1: Compile-time — TypeScript компилятор

```bash
# Только проверка типов, без генерации JS
npx tsc --noEmit

# Проверка в watch режиме при разработке
npx tsc --noEmit --watch
```

```typescript
// Ошибки, которые поймает компилятор:
function divide(a: number, b: number): number {
  return a / b;
}

divide("10", 2);   // Error: Argument of type 'string' is not assignable to 'number'
divide(10);        // Error: Expected 2 arguments, but got 1

const result = divide(10, 2);
result.toUpperCase(); // Error: Property 'toUpperCase' does not exist on type 'number'
```

#### Уровень 2: ESLint + @typescript-eslint

```bash
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

```json
// eslint.config.js (flat config)
{
  "extends": ["@typescript-eslint/recommended", "@typescript-eslint/recommended-type-checked"],
  "parserOptions": { "project": true }
}
```

Поймает:
- `@typescript-eslint/no-floating-promises` — забытый `await`
- `@typescript-eslint/no-unsafe-assignment` — присваивание `any`
- `@typescript-eslint/no-explicit-any` — запрет явного `any`
- `@typescript-eslint/prefer-nullish-coalescing` — `||` вместо `??`

#### Уровень 3: Runtime — try/catch с `unknown`

```typescript
// TypeScript 4.0+ с useUnknownInCatchVariables: true (в strict)
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      throw new HttpError(response.status, `User ${id} not found`);
    }

    return response.json() as Promise<User>;
  } catch (err: unknown) {
    // err: unknown — безопасно; нужна проверка перед использованием

    if (err instanceof HttpError) {
      console.error(`HTTP ${err.status}: ${err.message}`);
      throw err;
    }

    if (err instanceof TypeError) {
      // Сетевая ошибка (fetch failed)
      console.error("Network error:", err.message);
      throw new NetworkError("Connection failed", { cause: err });
    }

    // Неизвестная ошибка
    throw err;
  }
}
```

#### Уровень 4: Кастомные классы ошибок

```typescript
// Иерархия ошибок домена
class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = this.constructor.name;
    // Нужно для корректного instanceof в TS при target < ES2015
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class HttpError extends AppError {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message, `HTTP_${status}`);
  }
}

class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly fields: Record<string, string[]>
  ) {
    super(message, "VALIDATION_ERROR");
  }
}

class NetworkError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, "NETWORK_ERROR", options);
  }
}
```

#### Уровень 5: Zod для валидации внешних данных

```typescript
import { z, ZodError } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150).optional(),
});

type User = z.infer<typeof UserSchema>;

async function parseUser(data: unknown): Promise<User> {
  try {
    return UserSchema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      // Структурированные ошибки валидации
      const fields = err.flatten().fieldErrors;
      throw new ValidationError("Invalid user data", fields);
    }
    throw err;
  }
}
```

#### Уровень 6: Result/Either паттерн (функциональный подход)

```typescript
// Явный тип ошибки — без исключений
type Result<T, E extends Error = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function safeParseNumber(s: string): Result<number, TypeError> {
  const n = Number(s);
  if (Number.isNaN(n)) {
    return { ok: false, error: new TypeError(`"${s}" is not a valid number`) };
  }
  return { ok: true, value: n };
}

const result = safeParseNumber("42");
if (result.ok) {
  console.log(result.value * 2); // result.value: number
} else {
  console.error(result.error.message); // result.error: TypeError
}
```

#### Уровень 7: Global error handlers

```typescript
// Browser
window.addEventListener("error", (event: ErrorEvent) => {
  const { message, filename, lineno, colno, error } = event;
  errorReporter.captureException(error ?? new Error(message), {
    context: { filename, lineno, colno },
  });
});

window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
  event.preventDefault();
  errorReporter.captureException(
    event.reason instanceof Error ? event.reason : new Error(String(event.reason))
  );
});

// Node.js
process.on("uncaughtException", (err: Error) => {
  logger.error("Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled rejection:", reason);
});
```

### Практика и применение

**Стратегия по слоям:**

```
Compile time: tsc --noEmit + ESLint → ловим типовые и code quality ошибки
Runtime validation: Zod на границах (API, forms, env) → ловим data ошибки
Domain errors: custom Error classes → структурированные бизнес-ошибки
Global handlers: window/process error events → ловим непойманные
Monitoring: Sentry/Datadog → production observability
```

### Важные нюансы и краеугольные камни

- **`err instanceof Error`** не всегда работает: можно `throw "string"` или `throw { message: "..." }` — проверяй `instanceof Error` перед `.message`
- **`Error.cause`** (Node 16.9+, TS 4.6+): цепочка ошибок `new Error("wrap", { cause: originalErr })`
- **`Object.setPrototypeOf(this, new.target.prototype)`** — нужен в кастомных Error классах при target ES5 для корректного `instanceof`
- **ZodError.flatten()** vs `.format()** — разные представления ошибок валидации для UI и логов
- **Floating promises**: `@typescript-eslint/no-floating-promises` — ловит неожиданно «упавшие» промисы без `await`/`.catch()`

### Примеры

```typescript
// Комплексный пример: типобезопасный API клиент
class ApiClient {
  private async request<T>(url: string, schema: z.ZodSchema<T>): Promise<T> {
    let response: Response;

    try {
      response = await fetch(url, {
        signal: AbortSignal.timeout(10_000),
      });
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "TimeoutError") {
        throw new NetworkError("Request timed out", { cause: err });
      }
      throw new NetworkError("Network unavailable", { cause: err instanceof Error ? err : undefined });
    }

    if (!response.ok) {
      throw new HttpError(response.status, `${url} returned ${response.status}`);
    }

    let rawData: unknown;
    try {
      rawData = await response.json();
    } catch (err: unknown) {
      throw new AppError("Invalid JSON response", "PARSE_ERROR", { cause: err instanceof Error ? err : undefined });
    }

    const parsed = schema.safeParse(rawData);
    if (!parsed.success) {
      throw new ValidationError("Unexpected response shape", parsed.error.flatten().fieldErrors);
    }

    return parsed.data;
  }

  async getUser(id: string): Promise<User> {
    return this.request(`/api/users/${id}`, UserSchema);
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое `useUnknownInCatchVariables`?** — флаг TypeScript 4.4+ (в `strict`): параметр catch получает тип `unknown` вместо `any`; нужна проверка перед использованием
- **Зачем `Object.setPrototypeOf` в кастомных Error?** — при target ES5 TypeScript ломает цепочку прототипов в extends; `setPrototypeOf` исправляет `instanceof`
- **Чем Result паттерн лучше try/catch?** — явный тип ошибки в сигнатуре функции; нет неожиданных исключений; компилятор заставляет обработать оба исхода
- **Что такое `no-floating-promises`?** — ESLint правило, требующее `await` или `.catch()` для всех Promise; предотвращает тихие unhandled rejections

### Красные флаги (чего не говорить)

- «TypeScript ловит все ошибки» — только типовые ошибки на этапе компиляции; рантайм-ошибки нужно обрабатывать вручную
- «В catch блоке `e.message` безопасно без проверки» — `e` может быть не `Error`; с `useUnknownInCatchVariables` — ошибка компиляции; нужен `instanceof Error`
- «`JSON.parse` возвращает типизированные данные» — возвращает `any`; нужна Zod-схема для безопасности

### Связанные темы

- `011-raznica-void-never-unknown.md`
- `012-raznica-any-i-unknown.md`
- `015-suzhenie-tipov-type-narrowing.md`
- `014-utilitarnye-tipy-utility-types.md`
