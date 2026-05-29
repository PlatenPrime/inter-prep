# Q008. Разница между типом (`type`) и интерфейсом (`interface`)?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

`interface` и `type` во многом взаимозаменяемы, но имеют ключевые различия: `interface` поддерживает **декларативное слияние (declaration merging)** и **расширение через `extends`**, что делает его предпочтительным для публичных API и объектных форм. `type` мощнее для **составных типов**: union, intersection, conditional, mapped, tuple — это невозможно выразить через `interface`.

---

## Развёрнутый ответ

### Суть и определение

Оба инструмента описывают форму объектов. Разница — в возможностях и семантике.

### Как это работает

#### Общее — что умеют оба

```typescript
// Описание объекта
interface UserI { name: string; age: number; }
type UserT = { name: string; age: number; };

// Расширение
interface AdminI extends UserI { role: string; }
type AdminT = UserT & { role: string; };

// Опциональные поля
interface ConfigI { host: string; port?: number; }
type ConfigT = { host: string; port?: number; };

// Методы
interface ServiceI { fetch(): Promise<void>; }
type ServiceT = { fetch(): Promise<void>; };

// Generics
interface Box<T> { value: T; }
type Box2<T> = { value: T; };
```

#### Только `interface` — Declaration Merging

```typescript
interface Window {
  myPlugin: { init(): void };
}

interface Window {           // второе объявление СЛИВАЕТСЯ с первым
  analytics: Analytics;
}

// Итоговый тип Window содержит и myPlugin, и analytics
// Используется для расширения глобальных типов (module augmentation)
```

#### Только `type` — составные типы

```typescript
// Union — невозможно через interface
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

// Tuple
type Pair<A, B> = [A, B];

// Conditional type
type Flatten<T> = T extends Array<infer U> ? U : T;

// Mapped type
type Readonly<T> = { readonly [K in keyof T]: T[K] };

// Template literal
type EventKey = `on${Capitalize<string>}`;

// Примитив как alias
type ID = string;
type Timestamp = number;

// Intersection в type vs interface extends — разные семантики при конфликте
type A = { x: string } & { x: number }; // x: never — конфликт → never
interface B extends { x: string }, { x: number } {} // Ошибка компиляции
```

#### `interface` vs `type` при extends с конфликтующими полями

```typescript
interface Base { x: string; }
interface Extended extends Base { x: string | number; } // OK если совместимо

type Base2 = { x: string };
type Extended2 = Base2 & { x: string | number }; // x: string — пересечение сужает
```

### Практика и применение

**Когда использовать `interface`:**
- Описание публичного API библиотеки — поддерживает module augmentation
- Объектные формы с возможным расширением
- Контракты для классов (`class Foo implements IFoo`)
- Когда важна читаемость ошибок (ошибки с `interface` читаемее)

**Когда использовать `type`:**
- Union типы: `type Status = "active" | "inactive"`
- Tuple: `type RGB = [number, number, number]`
- Сложные трансформации: conditional, mapped, template literal
- Alias для примитивов: `type UserId = string`
- Когда нужно запретить declaration merging (закрытый тип)

### Важные нюансы и краеугольные камни

- В большинстве случаев **выбор не принципиален**; главное — консистентность в команде
- `interface` нельзя использовать в левой части условных и mapped типов
- При конфликте полей в intersection (`&`) тип сужается до `never`; `extends` даст ошибку
- **Ошибки компилятора** с `interface` обычно лаконичнее — он показывает имя, а не разворачивает структуру
- TypeScript team рекомендует `interface` для объектов по умолчанию (performance: чуть быстрее в проверке)

### Примеры

```typescript
// interface — module augmentation (расширение сторонней библиотеки)
declare module "express-serve-static-core" {
  interface Request {
    user?: AuthenticatedUser;
  }
}
// Теперь req.user типизирован везде в приложении

// type — discriminated union (невозможно через interface)
type ApiResponse<T> =
  | { status: "success"; data: T; }
  | { status: "error"; message: string; code: number; }
  | { status: "loading"; };

function handleResponse<T>(res: ApiResponse<T>) {
  switch (res.status) {
    case "success": console.log(res.data); break;
    case "error":   console.error(res.message); break;
    case "loading": console.log("..."); break;
  }
}
```

---

## Сравнение

| Критерий | `interface` | `type` |
|----------|-------------|--------|
| Declaration merging | Да | Нет |
| Union типы | Нет | Да |
| Tuple | Нет | Да |
| Conditional types | Нет | Да |
| Mapped types | Нет | Да |
| `implements` в классе | Да | Да |
| Расширение | `extends` | `&` |
| Alias примитива | Нет | Да |
| Ошибки компилятора | Лаконичнее | Разворачивает структуру |
| Рекурсивные типы | Да | Да (в TS 3.7+) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое declaration merging?** — повторное объявление `interface` с тем же именем сливается в одно; используется для module augmentation
- **Можно ли реализовать `type` в классе через `implements`?** — да, если `type` описывает объектную форму (не union/primitive)
- **Что такое branded/opaque types?** — `type UserId = string & { readonly _brand: "UserId" }` — только через `type`, не `interface`
- **Когда `extends` лучше `&`?** — `extends` проверяет совместимость и даёт ошибку при конфликте; `&` молча сужает до `never`

### Красные флаги (чего не говорить)

- «`interface` — для классов, `type` — для объектов» — оба описывают объектные формы; оба работают с `implements`
- «`type` расширяется через `extends`» — нет, через `&`; `extends` — только для `interface` и классов
- «Declaration merging — это плохо» — это полезный паттерн для module augmentation; плохо только неожиданное слияние

### Связанные темы

- `009-raznica-abstract-class-i-interface.md`
- `010-raznica-obedinenie-i-peresechenie.md`
- `007-tipy-v-typescript.md`
- `013-genericheskie-tipy-generic.md`
