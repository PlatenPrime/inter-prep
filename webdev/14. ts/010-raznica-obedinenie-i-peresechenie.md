# Q010. Разница между типами "Объединение" (`|`) и "Пересечение" (`&`)?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

**Union (`|`)** — тип «или/или»: значение может быть **одним из** перечисленных типов. **Intersection (`&`)** — тип «и/и»: значение должно удовлетворять **всем** перечисленным типам одновременно. Union расширяет множество допустимых значений, intersection — сужает (требует больше).

---

## Развёрнутый ответ

### Суть и определение

С точки зрения теории множеств:
- `A | B` — **объединение**: все значения из A плюс все из B
- `A & B` — **пересечение**: только значения, принадлежащие одновременно A и B

Для объектных типов результат интуитивно противоположный ожиданиям новичков:
- Union объектов: доступны только **общие** поля (неизвестно, какой именно тип)
- Intersection объектов: доступны **все** поля из обоих типов

### Как это работает

#### Union (`|`) — «или»

```typescript
type StringOrNumber = string | number;

function formatId(id: StringOrNumber): string {
  // Без сужения доступны только общие методы string и number
  // id.toFixed(2)   // Error: number-метод не существует у string
  // id.toUpperCase() // Error: string-метод не существует у number

  // Нужно сужение (type narrowing)
  if (typeof id === "string") {
    return id.toUpperCase(); // здесь id: string
  }
  return id.toFixed(2);     // здесь id: number
}
```

```typescript
// Discriminated Union — паттерн с дискриминирующим полем
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":   return Math.PI * s.radius ** 2;
    case "rect":     return s.width * s.height;
    case "triangle": return 0.5 * s.base * s.height;
  }
}
```

#### Intersection (`&`) — «и»

```typescript
type Named = { name: string };
type Aged  = { age: number };
type Person = Named & Aged; // { name: string; age: number }

const p: Person = { name: "Alice", age: 30 }; // нужны ОБА поля

// Практический паттерн: добавить поля к существующему типу
type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

type UserRecord = WithTimestamps<{ id: string; email: string }>;
// { id: string; email: string; createdAt: Date; updatedAt: Date }
```

#### Пересечение конфликтующих типов

```typescript
// Конфликт примитивов → never
type Impossible = string & number; // never — нет значений, одновременно string и number

// Конфликт полей в объектах
type A = { x: string };
type B = { x: number };
type AB = A & B; // { x: never } — x должен быть string И number одновременно

const ab: AB = { x: "hello" }; // Error: Type 'string' is not assignable to type 'never'
```

### Практика и применение

**Union типы:**
- Возвращаемые значения, которые могут быть разными: `string | null`, `User | Error`
- Discriminated unions — основа state management (Redux actions, React reducer)
- Nullable значения при `strictNullChecks`: `string | undefined`

**Intersection типы:**
- Миксины и декораторы: `Base & Serializable & Loggable`
- Дженерики с дополнительными ограничениями: `T & { id: string }`
- Higher-order components и HOF в React: `ComponentProps & ExtraProps`

### Важные нюансы и краеугольные камни

- **Union объектов ≠ «все поля»**: при `A | B` доступны только поля, **общие** для A и B (без сужения)
- **Intersection объектов = «все поля»**: при `A & B` доступны поля из обоих (что и нужно)
- **`never` при конфликте**: `string & number = never`; это сигнал о неверной архитектуре типов
- **Union + narrowing**: для безопасного использования union нужно сужение (`typeof`, `instanceof`, discriminant)
- `A | never = A` и `A & unknown = A` — аналоги нуля и единицы в теории типов

### Примеры

```typescript
// Union в React — состояние компонента
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

function UserCard({ state }: { state: FetchState<User> }) {
  if (state.status === "loading") return <Spinner />;
  if (state.status === "error")   return <Error msg={state.error.message} />;
  if (state.status === "success") return <div>{state.data.name}</div>;
  return null;
}

// Intersection для HOC паттерна
type WithAuth = { userId: string; role: "admin" | "user" };

function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & WithAuth> {
  return function AuthenticatedComponent({ userId, role, ...props }) {
    if (!userId) return <Redirect to="/login" />;
    return <Component {...(props as P)} />;
  };
}
```

---

## Сравнение

| Критерий | Union (`\|`) | Intersection (`&`) |
|----------|-------------|-------------------|
| Смысл | «или» — одно из | «и» — все сразу |
| Для объектов: доступные поля | Только общие | Все из всех |
| Для примитивов | Широкий тип | `never` (при конфликте) |
| Сужение | Требуется (narrowing) | Не требуется |
| Множество значений | Расширяет | Сужает |
| Пустой случай | `never` (0 вариантов) | `unknown` (все значения) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему при `A | B` доступны только общие поля?** — компилятор не знает, какой именно тип у значения; безопасны только гарантированно присутствующие поля
- **Что такое discriminated union?** — union с общим литеральным полем-дискриминантом (`kind`, `type`, `status`); позволяет exhaustive проверку
- **Когда `A & B` = `never`?** — когда A и B описывают непересекающиеся примитивы или конфликтующие поля
- **Как сузить union тип?** — `typeof`, `instanceof`, проверка дискриминанта, user-defined type guards

### Красные флаги (чего не говорить)

- «`A | B` означает, что у значения есть поля и из A, и из B» — нет, только общие; `&` даёт все поля
- «Intersection объектов сужает тип» — для объектов intersection расширяет набор свойств
- «`string & number = string | number`» — нет, это `never`, так как нет значения одновременно string и number

### Связанные темы

- `015-suzhenie-tipov-type-narrowing.md`
- `007-tipy-v-typescript.md`
- `008-raznica-type-i-interface.md`
- `013-genericheskie-tipy-generic.md`
