# Q016. Что такое перечисление (`enum`)?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

**`enum`** (перечисление) — TypeScript-конструкция для задания набора именованных констант. В отличие от большинства TypeScript-конструкций, `enum` **генерирует реальный JavaScript-код** (объект), а не стирается при компиляции. Существует несколько видов: числовые, строковые, `const enum` (инлайн) и гетерогенные.

---

## Развёрнутый ответ

### Суть и определение

`enum` решает задачу документирования набора связанных значений и делает код более читаемым. Вместо «магических чисел» или строк — понятные имена.

### Как это работает

#### Числовые enum (Numeric enum)

```typescript
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

const dir: Direction = Direction.Up; // 0
console.log(Direction.Up);    // 0
console.log(Direction[0]);    // "Up" — обратное отображение!

// Кастомный стартовый индекс
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500,
}
```

**Числовые enum компилируются в объект с обратным отображением:**

```javascript
// Скомпилированный JS:
var Direction;
(function (Direction) {
  Direction[Direction["Up"] = 0] = "Up";
  Direction[Direction["Down"] = 1] = "Down";
  Direction[Direction["Left"] = 2] = "Left";
  Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
```

#### Строковые enum (String enum)

```typescript
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warning = "WARNING",
  Error = "ERROR",
}

// Нет обратного отображения у строковых enum
console.log(LogLevel.Error); // "ERROR"
// LogLevel["ERROR"] — undefined (в отличие от числовых)
```

Строковые enum предпочтительнее числовых: значения читаемы в логах/дебаггере.

#### `const enum` — инлайн замена

```typescript
const enum Flags {
  Read = 1,
  Write = 2,
  Execute = 4,
}

const permission = Flags.Read | Flags.Write;

// Компилируется в:
// const permission = 1 /* Read */ | 2 /* Write */;
// Объект Flags в JS не создаётся — только инлайн значения
```

`const enum` не генерирует объект: компилятор встраивает числовые значения напрямую. Не совместим с `isolatedModules: true` (используется в Babel, esbuild, Vite).

#### Гетерогенные enum (смешанные)

```typescript
// Антипаттерн — избегать
enum Mixed {
  No = 0,
  Yes = "YES",
}
```

#### Ambient enum (в `.d.ts`)

```typescript
// Объявление типов для существующего JS-кода
declare enum FileAccess {
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
}
```

### Практика и применение

```typescript
// Практический пример: состояния заказа
enum OrderStatus {
  Pending = "PENDING",
  Processing = "PROCESSING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED",
}

interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
}

function canCancelOrder(order: Order): boolean {
  return order.status === OrderStatus.Pending ||
         order.status === OrderStatus.Processing;
}

// Строгий тип: принимает только OrderStatus, не просто string
function updateStatus(orderId: string, status: OrderStatus): Promise<void> {
  // ...
}
```

### Важные нюансы и краеугольные камни

- **`enum` генерирует JS-код** — влияет на bundle size (несколько строк); `const enum` — нет
- **Числовые enum**: `if (status === 0)` работает — числа как значения; риск «магических чисел» возвращается
- **Строковый enum не имеет обратного отображения** — `Direction["Up"]` — undefined (только числовые имеют)
- **`const enum` + `isolatedModules: false`**: несовместимы; в проектах с Vite/esbuild используй string union или обычный enum
- **Числовые enum — не type-safe с числами**: `enum Direction { Up = 0 }` + `const d: Direction = 42` — TypeScript не ругается (!), числовые enum открыты
- **Альтернатива enum**: `as const` объект или string union — без рантайм кода, полностью совместим с isolatedModules

```typescript
// Альтернатива: as const + typeof
const OrderStatus = {
  Pending: "PENDING",
  Processing: "PROCESSING",
  Shipped: "SHIPPED",
} as const;

type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
// "PENDING" | "PROCESSING" | "SHIPPED"
```

### Примеры

```typescript
// Числовые bit flags
enum Permission {
  None    = 0,
  Read    = 1 << 0, // 1
  Write   = 1 << 1, // 2
  Execute = 1 << 2, // 4
  All     = Read | Write | Execute, // 7
}

function hasPermission(userPerms: number, required: Permission): boolean {
  return (userPerms & required) === required;
}

const adminPerms = Permission.All;
hasPermission(adminPerms, Permission.Write); // true

// Строковые enum с exhaustive check
enum Tier {
  Free = "FREE",
  Pro = "PRO",
  Enterprise = "ENTERPRISE",
}

function getLimit(tier: Tier): number {
  switch (tier) {
    case Tier.Free:       return 10;
    case Tier.Pro:        return 100;
    case Tier.Enterprise: return Infinity;
    default: {
      const _: never = tier;
      throw new Error(`Unknown tier: ${_}`);
    }
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `const enum` отличается от обычного?** — `const enum` инлайнит значения, не создаёт JS-объект; не работает с `isolatedModules`
- **Почему числовые enum не type-safe?** — TypeScript позволяет присвоить любое число типу числового enum без ошибки
- **Чем union string literals лучше enum?** — не генерирует код, совместим с `isolatedModules`, более идиоматичен в современном TS
- **Что такое обратное отображение enum?** — числовые enum дают `Direction[0] === "Up"`; строковые — нет

### Красные флаги (чего не говорить)

- «Enum — это просто объект» — числовые enum генерируют объект с обратным отображением; строковые — без; `const enum` — вообще без объекта
- «Все enum одинаковы» — числовые, строковые, const, ambient — разная семантика и компиляция
- «Enum стирается как interface» — нет, большинство enum генерируют реальный JS-код

### Связанные темы

- `007-tipy-v-typescript.md`
- `003-osobennosti-typescript.md`
- `015-suzhenie-tipov-type-narrowing.md`
