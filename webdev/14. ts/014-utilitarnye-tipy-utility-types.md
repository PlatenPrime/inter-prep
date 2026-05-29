# Q014. Что такое утилитарные типы в TypeScript (Utility Types)?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

**Utility Types** — встроенные в TypeScript generic-типы для трансформации существующих типов: `Partial<T>`, `Required<T>`, `Readonly<T>`, `Pick<T,K>`, `Omit<T,K>`, `Record<K,V>`, `Exclude<T,U>`, `Extract<T,U>`, `NonNullable<T>`, `ReturnType<T>` и другие. Они позволяют создавать новые типы на основе существующих без дублирования кода.

---

## Развёрнутый ответ

### Суть и определение

Utility Types — это библиотека типов, поставляемая вместе с TypeScript (`lib.es5.d.ts` и др.). Все они реализованы через mapped и conditional types, которые разработчик может изучить как образец для создания собственных утилит.

### Как это работает

#### Трансформация объектных типов

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Partial<T> — все поля необязательные
type UserUpdate = Partial<User>;
// { id?: string; name?: string; email?: string; age?: number }

// Required<T> — все поля обязательные (убирает ?)
interface Config {
  host?: string;
  port?: number;
}
type RequiredConfig = Required<Config>;
// { host: string; port: number }

// Readonly<T> — все поля только для чтения
type ImmutableUser = Readonly<User>;
// { readonly id: string; readonly name: string; ... }

// Pick<T, K> — выбрать подмножество полей
type UserPreview = Pick<User, "id" | "name">;
// { id: string; name: string }

// Omit<T, K> — исключить поля
type UserWithoutId = Omit<User, "id">;
// { name: string; email: string; age: number }
```

#### Работа с типами значений

```typescript
// Record<K, V> — объект с ключами K и значениями V
type RolePermissions = Record<"admin" | "user" | "guest", string[]>;
// { admin: string[]; user: string[]; guest: string[] }

const permissions: RolePermissions = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"],
};

// Record с keyof
type UserFlags = Record<keyof User, boolean>;
// { id: boolean; name: boolean; email: boolean; age: boolean }
```

#### Работа с union типами

```typescript
type Status = "active" | "inactive" | "pending" | "banned";

// Exclude<T, U> — убрать из T варианты, входящие в U
type ActiveStatuses = Exclude<Status, "banned" | "inactive">;
// "active" | "pending"

// Extract<T, U> — оставить только варианты из T, входящие в U
type NegativeStatuses = Extract<Status, "inactive" | "banned">;
// "inactive" | "banned"

// NonNullable<T> — убрать null и undefined
type SafeString = NonNullable<string | null | undefined>;
// string
```

#### Работа с функциями и классами

```typescript
function createUser(name: string, email: string, age: number): User {
  return { id: crypto.randomUUID(), name, email, age };
}

// ReturnType<T> — тип возвращаемого значения функции
type CreatedUser = ReturnType<typeof createUser>; // User

// Parameters<T> — кортеж параметров функции
type CreateUserParams = Parameters<typeof createUser>;
// [name: string, email: string, age: number]

// ConstructorParameters<T> — параметры конструктора
class HttpClient {
  constructor(public baseUrl: string, public timeout: number) {}
}
type HttpClientArgs = ConstructorParameters<typeof HttpClient>;
// [baseUrl: string, timeout: number]

// InstanceType<T> — тип экземпляра класса
type HttpClientInstance = InstanceType<typeof HttpClient>;
// HttpClient
```

#### Awaited (TS 4.5+)

```typescript
// Awaited<T> — разворачивает Promise
type Result = Awaited<Promise<string>>;        // string
type Nested = Awaited<Promise<Promise<number>>>; // number
```

#### Реализация под капотом

```typescript
// Как это устроено — можно понять и писать свои утилиты
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;

type MyRecord<K extends keyof any, V> = {
  [P in K]: V;
};

type MyNonNullable<T> = T extends null | undefined ? never : T;
```

### Практика и применение

```typescript
// DTO паттерн — разные представления одной сущности
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

type CreateProductDto = Omit<Product, "id" | "createdAt">;
// Для создания: name, price, stock

type UpdateProductDto = Partial<Omit<Product, "id" | "createdAt">>;
// Для обновления: все поля необязательны

type ProductPreview = Pick<Product, "id" | "name" | "price">;
// Для списка: только нужные поля
```

### Важные нюансы и краеугольные камни

- **`Omit` не всегда идеален с union**: `Omit<A | B, "field">` может дать неожиданный результат; лучше `DistributiveOmit`
- **`Partial` — поверхностный**: вложенные объекты не становятся partial; нужен `DeepPartial<T>` кастомный
- **`Readonly` — поверхностный**: вложенные объекты остаются мутабельными; нужен `DeepReadonly<T>`
- **`Record<string, V>` vs индексный тип**: `Record<string, V>` означает, что все строки — валидные ключи, доступ всегда даёт V (без undefined)
- При `noUncheckedIndexedAccess: true` индексный доступ к `Record<string, V>` возвращает `V | undefined`

### Примеры

```typescript
// Продвинутый паттерн: DeepPartial
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

// Строго типизированный Object.entries
function typedEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

// Строго типизированный Object.fromEntries
type FromEntries<T extends readonly [PropertyKey, unknown][]> = {
  [K in T[number] as K[0]]: K[1];
};

// Паттерн: строгая типизация env переменных
type Env = {
  DATABASE_URL: string;
  PORT: string;
  NODE_ENV: string;
};
type RequiredEnv = Required<Env>; // все обязательны

function getEnv(): RequiredEnv {
  const { DATABASE_URL, PORT, NODE_ENV } = process.env;
  if (!DATABASE_URL || !PORT || !NODE_ENV) {
    throw new Error("Missing environment variables");
  }
  return { DATABASE_URL, PORT, NODE_ENV };
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `Omit` отличается от `Exclude`?** — `Omit` работает с объектными типами (убирает поля); `Exclude` — с union типами (убирает варианты)
- **Что такое `ReturnType` и где используется?** — тип возвращаемого значения функции; полезен когда тип хочется переиспользовать, не объявляя отдельно
- **Как сделать `DeepPartial`?** — рекурсивный mapped type с conditional проверкой `extends object`
- **Что такое `Awaited` и зачем нужен?** — разворачивает вложенные Promise; полезен для типизации async функций и utils

### Красные флаги (чего не говорить)

- «`Partial` делает все вложенные поля необязательными» — только поверхностно; для глубокого — нужен кастомный `DeepPartial`
- «`Record<string, T>` гарантирует, что ключ существует» — нет; с `noUncheckedIndexedAccess` возвращает `T | undefined`
- «Utility Types — это сторонняя библиотека» — встроены в TypeScript, не требуют установки

### Связанные темы

- `013-genericheskie-tipy-generic.md`
- `008-raznica-type-i-interface.md`
- `003-osobennosti-typescript.md`
