# Q011. Разница между типами `void`, `never` и `unknown`?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

`void` — функция намеренно ничего не возвращает (может вернуть `undefined`). `never` — функция **никогда** не завершается нормально (throws или бесконечный цикл) или тип является **недостижимым**. `unknown` — значение есть, но тип неизвестен; перед использованием обязательно нужна проверка типа. В иерархии типов: `unknown` — «вершина» (supertype of all), `never` — «дно» (subtype of all).

---

## Развёрнутый ответ

### Суть и определение

#### `void` — «намеренное отсутствие возвращаемого значения»

```typescript
function logMessage(msg: string): void {
  console.log(msg);
  // return undefined; — допустимо, но не нужно
}

// void ≠ undefined: функция с типом void может технически вернуть undefined,
// но по контракту "ничего не возвращает"

// Практический смысл: void используется для коллбэков,
// которые не должны использовать возвращаемое значение
type Callback = () => void;
const fn: Callback = () => 42; // OK! void в callback разрешает возвращать что угодно
```

#### `never` — «недостижимый тип»

```typescript
// Функция, бросающая исключение, никогда не возвращает
function throwError(message: string): never {
  throw new Error(message);
}

// Бесконечный цикл
function infiniteLoop(): never {
  while (true) {}
}

// Исчерпывающая проверка (exhaustive check)
type Direction = "north" | "south" | "east";

function move(dir: Direction): string {
  switch (dir) {
    case "north": return "Moving north";
    case "south": return "Moving south";
    case "east":  return "Moving east";
    default: {
      const exhaustiveCheck: never = dir;
      // Если добавить "west" без case — ошибка компиляции здесь
      throw new Error(`Unknown direction: ${exhaustiveCheck}`);
    }
  }
}
```

`never` — **подтип всех типов**: `never` присваиваем любому типу, но ничто не присваиваемо `never`.

#### `unknown` — «безопасный any»

```typescript
function processInput(value: unknown): string {
  // value.toString() — Error: Object is of type 'unknown'
  // Нельзя использовать без проверки

  if (typeof value === "string") {
    return value.toUpperCase(); // OK: сужен до string
  }
  if (typeof value === "number") {
    return value.toFixed(2);    // OK: сужен до number
  }
  if (value instanceof Date) {
    return value.toISOString(); // OK: сужен до Date
  }

  return String(value); // крайний случай
}
```

`unknown` — **супертип всех типов**: любое значение присваиваемо `unknown`, но `unknown` не присваиваемо ничему без сужения.

### Как это работает

#### Иерархия типов

```
unknown (top type — принимает всё)
  ├── string
  ├── number
  ├── boolean
  ├── object
  │   └── ...
  └── never (bottom type — не принимает ничего)

void — не в иерархии; специальный тип для функций
```

#### Сравнение поведения

```typescript
// void
const a: void = undefined; // OK
const b: void = null;       // Error при strictNullChecks

// never
const unreachable: never = (() => { throw new Error(); })(); // OK
// Любое присваивание к never — ошибка:
const bad: never = "hello"; // Error: Type 'string' is not assignable to 'never'

// unknown
const u: unknown = "anything"; // OK — любое значение
const s: string = u;           // Error: Type 'unknown' is not assignable to 'string'
const s2: string = u as string; // OK с assertion, но опасно
```

#### `void` в контексте коллбэков

```typescript
// Особое поведение: void в position return type callback не запрещает return
type ForEachCb = (value: number, index: number) => void;

const numbers = [1, 2, 3];
// Это OK! Потому что forEach использует void — «результат не важен»
numbers.forEach((n): void => {
  return n * 2; // технически возвращает, но void говорит "игнорировать"
});

// Но если явно объявить функцию с void — она не должна return с значением
function explicitVoid(): void {
  return 42; // Error: Type 'number' is not assignable to type 'void'
}
```

### Практика и применение

- **`void`**: тип возвращаемого значения функций-обработчиков, event listeners, side-effect функций
- **`never`**: exhaustive checks в switch/discriminated unions; тип после `throw`; в условных типах для отфильтровывания вариантов
- **`unknown`**: входящие данные из внешних источников (API ответы, `JSON.parse`, параметры `catch`, `event.data`)

### Важные нюансы и краеугольные камни

- **`catch` блок**: до TS 4.0 параметр `e` имел тип `any`; с TS 4.0+ — `unknown` при `useUnknownInCatchVariables: true` (входит в `strict`)
- **`void` ≠ `undefined`**: `undefined` — конкретное значение; `void` — «этим значением не пользуются»
- **`never` в union**: `string | never = string` — `never` поглощается (нейтральный элемент union)
- **`never` в intersection**: `string & never = never` — `never` поглощает всё
- **`any` vs `unknown`**: `any` отключает проверки; `unknown` требует проверки — предпочтительно

### Примеры

```typescript
// never для фильтрации типов
type NonNullable<T> = T extends null | undefined ? never : T;
type Filtered = NonNullable<string | null | undefined | number>;
// = string | number

// unknown в обработчике ошибок (TS 4.0+)
async function fetchUser(id: string) {
  try {
    const res = await fetch(`/api/users/${id}`);
    return await res.json() as User;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // безопасно
    } else {
      console.error("Unknown error", err);
    }
    throw err;
  }
}

// void для event listeners
document.addEventListener("click", (e): void => {
  console.log(e.target);
  // return something; — игнорируется, void сигнализирует об этом
});
```

---

## Сравнение

| Критерий | `void` | `never` | `unknown` |
|----------|--------|---------|-----------|
| Позиция в иерархии | Отдельный | Bottom type | Top type |
| Что присваиваем к нему | `undefined` | Ничего | Всё |
| Что из него присваиваем | Только `void` | Что угодно | Только `unknown` / `any` |
| Основное применение | Возврат функций | Недостижимый код | Неизвестные входные данные |
| Требует сужения | Нет | — | Да, перед использованием |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что происходит с `never` в conditional types?** — используется для фильтрации в union: `T extends Condition ? never : T`
- **Зачем `unknown` лучше `any` для параметров catch?** — `any` позволит вызвать любой метод без проверки; `unknown` заставит обработать все случаи
- **Почему `void`-коллбэк может возвращать значение?** — `void` в позиции типа функции значит «возвращаемое значение игнорируется»; это позволяет передавать `() => number` туда, где ожидается `() => void`
- **Как `never` помогает в exhaustive check?** — при добавлении нового варианта в union без соответствующего case компилятор ругается, что новый тип не присваиваем `never`

### Красные флаги (чего не говорить)

- «`void` и `undefined` — одно и то же» — `void` сигнализирует «результат не используется»; `undefined` — конкретное значение
- «`never` — это как `null` или `undefined`» — `never` означает недостижимость, а не отсутствие значения
- «`unknown` — это то же самое что `any`» — `unknown` требует явной проверки перед использованием; `any` всё разрешает

### Связанные темы

- `012-raznica-any-i-unknown.md`
- `007-tipy-v-typescript.md`
- `015-suzhenie-tipov-type-narrowing.md`
