# Q012. Разница между `any` и `unknown` в TypeScript?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

`any` — «отключает» систему типов: с `any` можно делать всё что угодно без проверок, TypeScript доверяет разработчику. `unknown` — «безопасный any»: тип присутствует, но прежде чем использовать значение, **обязательно нужно сузить тип** через проверку. `unknown` сохраняет защиту компилятора; `any` — нет.

---

## Развёрнутый ответ

### Суть и определение

**`any`** — escape hatch из системы типов. Значение типа `any` можно использовать как угодно: вызывать методы, индексировать, передавать куда угодно — компилятор не проверяет.

**`unknown`** — «я не знаю тип, но хочу работать с ним безопасно». TypeScript не позволит использовать значение без явной проверки типа.

### Как это работает

#### `any` — полное отключение проверок

```typescript
let a: any = "hello";

// Всё допустимо — компилятор не проверяет:
a.foo.bar.baz;       // OK (рантайм-ошибка потенциально)
a();                  // OK
a[42].method();       // OK
const n: number = a;  // OK — присваиваем без конвертации
const s: string = a;  // OK

// any "заражает" окружающий код
function process(x: any) {
  return x.value; // возвращает any — тип теряется
}
const result = process({ value: 42 });
result.anything(); // OK — result тоже any
```

#### `unknown` — требует сужения

```typescript
let u: unknown = "hello";

// Нельзя использовать без проверки:
u.toUpperCase();       // Error: Object is of type 'unknown'
u();                   // Error
const n: number = u;   // Error: Type 'unknown' is not assignable to type 'number'

// Можно присвоить только unknown или any:
const a: any = u;      // OK
const u2: unknown = u; // OK

// Чтобы использовать — нужно сужение:
if (typeof u === "string") {
  u.toUpperCase(); // OK: здесь u: string
}
if (u instanceof Date) {
  u.toISOString(); // OK: здесь u: Date
}
// Или type assertion (осторожно!):
const s = u as string; // OK синтаксически, но небезопасно
```

#### Поведение при присваивании

```typescript
// any принимает всё и отдаёт всё
let anyVal: any;
anyVal = 42;           // OK
anyVal = "hello";      // OK
anyVal = {};           // OK
const n: number = anyVal; // OK — опасно!

// unknown принимает всё, но отдаёт только unknown/any
let unknownVal: unknown;
unknownVal = 42;             // OK
unknownVal = "hello";        // OK
const n2: number = unknownVal; // Error!
```

### Практика и применение

**Когда `any` оправдан:**
- Миграция с JS на TS — временное решение
- Работа с очень динамическими библиотеками без типов
- Тесты с моками сложных объектов (с осторожностью)
- `// @ts-ignore` + `any` в крайних случаях

**Когда использовать `unknown`:**
- Параметры `catch (err: unknown)` — входные данные неизвестны
- `JSON.parse()` — возвращает `any`, но лучше приводить к `unknown`
- Обобщённые функции, принимающие данные из внешних источников
- Публичные API: входные данные от пользователя

```typescript
// Хорошая практика: JSON.parse → unknown → Zod
import { z } from "zod";

const UserSchema = z.object({ id: z.string(), name: z.string() });

function parseUser(rawJson: string): User {
  const parsed: unknown = JSON.parse(rawJson); // unknown, не any
  return UserSchema.parse(parsed);              // validates + types
}

// catch: unknown вместо any
try {
  await riskyOperation();
} catch (err: unknown) {
  if (err instanceof Error) {
    logger.error(err.message); // безопасно
  }
}
```

### Важные нюансы и краеугольные камни

- **`any` заразен**: функция, принимающая/возвращающая `any`, распространяет потерю типов
- **`noImplicitAny: true`** (входит в `strict`) запрещает неявный `any` в параметрах и возвращаемых значениях
- **`@typescript-eslint/no-explicit-any`** — линтер-правило, запрещающее явный `any`
- **Type assertions (`as`)** с `unknown` — допустимо, но несёт риск: лучше пройти через реальную проверку
- `JSON.parse()` возвращает `any` — это историческое решение; рекомендуется немедленно присваивать к `unknown`
- `any` не поднимает ошибки в рантайме — только молча позволяет код, который упадёт позже

### Примеры

```typescript
// Пример: почему any опасен
function getLength(value: any): number {
  return value.length; // Компилятор доволен, но что если value — number?
}
getLength(42); // Рантайм: undefined (у числа нет .length)

// Исправление с unknown
function getLengthSafe(value: unknown): number {
  if (typeof value === "string" || Array.isArray(value)) {
    return value.length; // безопасно
  }
  throw new TypeError("Value has no length");
}

// Паттерн: type guard для unknown
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
}

async function fetchAndValidate(url: string): Promise<User> {
  const res = await fetch(url);
  const data: unknown = await res.json();

  if (!isUser(data)) {
    throw new Error("Invalid user data");
  }

  return data; // data: User — безопасно
}
```

---

## Сравнение

| Критерий | `any` | `unknown` |
|----------|-------|-----------|
| Принимает любое значение | Да | Да |
| Можно использовать без проверки | Да | Нет — ошибка компиляции |
| Присваивается другим типам | Да | Только `any` и `unknown` |
| «Заражает» соседний код | Да | Нет |
| Требует сужения типа | Нет | Да |
| Безопасность | Нет | Да |
| Когда использовать | Крайний случай / миграция | Данные неизвестного типа |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое `noImplicitAny`?** — флаг компилятора, запрещающий параметрам/переменным иметь неявный тип `any`
- **Как `unknown` используется в catch?** — с TS 4.0 `useUnknownInCatchVariables: true` делает параметр catch `unknown` вместо `any`
- **Чем type assertion опасна с `unknown`?** — `u as User` обходит проверки; если данные не соответствуют User — рантайм-ошибка без предупреждения
- **Что такое type guard?** — функция `value is Type` — функция, сужающая тип; позволяет безопасно работать с `unknown`

### Красные флаги (чего не говорить)

- «`any` и `unknown` — одно и то же, только `unknown` строже» — не просто строже: `any` отключает защиту полностью
- «Используй `any` для быстроты» — это технический долг; `unknown` с Zod/type guard не намного сложнее
- «`JSON.parse` возвращает правильный тип» — возвращает `any`; нужна runtime-валидация

### Связанные темы

- `011-raznica-void-never-unknown.md`
- `015-suzhenie-tipov-type-narrowing.md`
- `017-noimplicitany.md`
- `005-minusy-ispolzovaniya-typescript.md`
