# Q024. Разница между внутренним (Internal Module) и внешним модулями (External Module)?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

**Internal Module** — устаревшее название для `namespace` в TypeScript: организация кода внутри одного или нескольких файлов без внешней системы модулей. **External Module** — современный стандарт: файл с `import`/`export` — отдельный модуль (ES Module, CommonJS и т.д.). В современном TypeScript-коде используются только external modules (ES modules).

---

## Развёрнутый ответ

### Суть и определение

Разграничение Internal/External Module — историческое. До ES2015 у JavaScript не было стандартной системы модулей. TypeScript реализовал собственный механизм (`module`/`namespace`) — **internal modules**. После появления ES modules (`import`/`export`) они стали называться **external modules**, а internal module переименован в `namespace`.

### Как это работает

#### Internal Module = `namespace` (устарело)

```typescript
// math.ts — без import/export — это "script" файл
namespace MathUtils {
  // Видно снаружи namespace только с export
  export function add(a: number, b: number): number {
    return a + b;
  }

  export function multiply(a: number, b: number): number {
    return a * b;
  }

  // Приватно — без export
  function internal(x: number): number {
    return x * 2;
  }
}

// Использование через имя namespace
const result = MathUtils.add(2, 3); // 5

// Вложенные namespace
namespace Geometry {
  export namespace TwoD {
    export function area(w: number, h: number): number {
      return w * h;
    }
  }
  export namespace ThreeD {
    export function volume(w: number, h: number, d: number): number {
      return w * h * d;
    }
  }
}

Geometry.TwoD.area(4, 5);
Geometry.ThreeD.volume(2, 3, 4);
```

**Компилируется в IIFE:**

```javascript
var MathUtils;
(function (MathUtils) {
  function add(a, b) { return a + b; }
  MathUtils.add = add;
})(MathUtils || (MathUtils = {}));
```

#### Многофайловые namespace (через `/// <reference>`)

```typescript
// validators.ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}

// emailValidator.ts
/// <reference path="validators.ts" />
namespace Validation {         // Declaration merging — объединяется с выше
  export class EmailValidator implements StringValidator {
    isAcceptable(s: string): boolean {
      return /\S+@\S+\.\S+/.test(s);
    }
  }
}
```

#### External Module = ES Module (современный стандарт)

```typescript
// math-utils.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

// Именованные экспорты
export type MathOperation = (a: number, b: number) => number;
export const PI = Math.PI;

// Default export
export default class Calculator {
  add = add;
  multiply = multiply;
}
```

```typescript
// main.ts
import Calculator, { add, multiply, type MathOperation, PI } from "./math-utils";
// или
import * as MathUtils from "./math-utils";

const result = add(2, 3);
const calc = new Calculator();
```

#### Форматы external modules

TypeScript компилирует `import`/`export` в разные форматы через `module` в tsconfig:

| `module` | Формат | Применение |
|----------|--------|-----------|
| `CommonJS` | `require`/`module.exports` | Node.js (legacy) |
| `ESNext` / `ES2020` | `import`/`export` | браузер, Vite, современный Node |
| `NodeNext` | ESM + CJS, авто по `.mjs`/`.cjs` | Node.js 16+ |
| `UMD` | Universal | библиотеки |
| `AMD` | `define`/`require` | RequireJS (очень legacy) |

### Практика и применение

**Internal module (namespace) сегодня:**
- Только в `.d.ts` для описания глобальных namespace-библиотек (jQuery, D3 старые версии)
- `declare namespace MyLib { ... }` — ambient declaration
- Никогда для организации нового TypeScript-кода

**External module сегодня:**
- Каждый `.ts` файл — модуль (если содержит `import`/`export`)
- ES modules — стандарт для всего: фронтенд, Node.js 16+, библиотеки

### Важные нюансы и краеугольные камни

- **Файл без `import`/`export`** — это скрипт (не модуль); все объявления глобальны; чтобы сделать пустой модуль: `export {}`
- **`namespace` в модульных файлах** — допустим, но бессмысленен; модуль уже изолирован
- **`module` в tsconfig** ≠ ES module в коде: это настройка формата компиляции
- **`moduleResolution`** — алгоритм поиска модулей: `node` (legacy), `bundler`, `NodeNext` — влияет на расширения в импортах
- **`import type`** — импортирует только тип, стирается при компиляции; безопасен с `isolatedModules`

### Примеры

```typescript
// Современный External Module паттерн
// services/user-service.ts
import { z } from "zod";
import type { Database } from "../database";

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
});

export type User = z.infer<typeof UserSchema>;

export class UserService {
  constructor(private db: Database) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (!row) return null;
    return UserSchema.parse(row);
  }
}

// Ambient namespace для legacy JS библиотеки (только в .d.ts)
// types/jquery.d.ts
declare namespace jQuery {
  function ajax(url: string, settings?: AjaxSettings): JQueryXHR;
  interface AjaxSettings {
    method?: string;
    data?: unknown;
  }
}
declare const $: typeof jQuery;
```

---

## Сравнение

| Критерий | Internal Module (namespace) | External Module (ES module) |
|----------|----------------------------|----------------------------|
| Синтаксис | `namespace Foo { }` | `import`/`export` |
| JS-вывод | IIFE объект | Нативный ESM или CJS |
| Изоляция | Только внутри namespace | Весь файл |
| Разбивка по файлам | `/// <reference>` | `import` |
| Современность | Устарело | Стандарт |
| Где применять | Ambient `.d.ts` | Весь новый код |
| Поддержка инструментами | Слабая | Полная |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда namespace всё ещё используется?** — только в ambient `.d.ts` для описания глобальных JS-библиотек без ESM
- **Чем ES module лучше namespace?** — стандарт языка, поддержка tree-shaking, статический анализ, lazy loading, отдельные файлы
- **Что такое `export {}` в пустом файле?** — превращает скрипт в модуль; без него объявления попадают в глобальный скоп
- **Как настроить модульную систему в tsconfig?** — `module: "NodeNext"` для Node.js 18+; `module: "ESNext"` + `moduleResolution: "bundler"` для Vite/webpack

### Красные флаги (чего не говорить)

- «Используем namespace для организации кода» — устарело; это должны быть папки и ES modules
- «Internal module — это `import`» — нет, это `namespace`; `import` — external module
- «`namespace` и `module` в TypeScript — одно и то же» — исторически `module` — старый синтаксис для namespace; сейчас `namespace` — правильное ключевое слово

### Связанные темы

- `023-oblasti-vidimosti.md`
- `025-klyuchevoe-slovo-declare.md`
- `027-triple-slash-directives.md`
