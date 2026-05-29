# Q025. Для чего в TypeScript используют ключевое слово `declare`?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

`declare` сообщает TypeScript: «эта переменная/функция/класс существует, но её реализация находится вне TypeScript-кода» — не генерируй JS, только добавь тип. Используется для типизации JavaScript-библиотек без TS, глобальных переменных (браузера/Node.js), окружения и API, которые будут добавлены через другой механизм.

---

## Развёрнутый ответ

### Суть и определение

`declare` — ключевое слово для **ambient declarations** (внешних объявлений). Оно говорит компилятору:
- Тип этой вещи — такой-то
- Код реализации уже существует (в другом JS-файле, в браузере, в Node.js)
- Не генерируй никакой JavaScript для этого объявления

### Как это работает

#### `declare var` / `declare let` / `declare const`

```typescript
// Глобальная переменная, установленная через HTML script или bundler
declare const __APP_VERSION__: string;
declare let __DEBUG__: boolean;

// Теперь можно использовать:
console.log(__APP_VERSION__); // TS не выдаёт ошибку и типизирует как string
```

#### `declare function`

```typescript
// jQuery — пример легаси глобальной библиотеки
declare function $(selector: string): JQueryObject;
declare function $(element: HTMLElement): JQueryObject;

// Функция из C++ addon в Node.js
declare function nativeHash(data: Buffer): string;
```

#### `declare class`

```typescript
// Класс, реализованный в другом JS-файле
declare class EventEmitter {
  on(event: string, listener: (...args: any[]) => void): this;
  emit(event: string, ...args: any[]): boolean;
  removeListener(event: string, listener: Function): this;
}
```

#### `declare module`

```typescript
// Типизация JS-библиотеки без собственных типов
declare module "legacy-analytics" {
  export function track(event: string, properties?: Record<string, unknown>): void;
  export function identify(userId: string): void;
  export const version: string;
}

// Типизация нестандартных импортов (SVG, CSS Modules, изображения)
declare module "*.svg" {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export { ReactComponent };
  export default src;
}

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.png" {
  const src: string;
  export default src;
}
```

#### `declare namespace`

```typescript
// Глобальная namespace-библиотека (jQuery, D3 v3 и подобные)
declare namespace MyLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;

  namespace validation {
    function validate(s: string): boolean;
  }
}

// Использование
MyLib.makeGreeting("world");
MyLib.validation.validate("test@test.com");
```

#### `declare global`

```typescript
// Расширение глобальных типов из модуля
export {}; // важно: делает файл модулем

declare global {
  interface Window {
    Stripe: StripeConstructor;
    analytics: SegmentAnalytics;
  }

  interface Array<T> {
    last(): T | undefined; // кастомный метод-полифилл
  }

  var __REDUX_DEVTOOLS_EXTENSION__: Function | undefined;
}
```

#### `declare enum`

```typescript
// enum, реализованный в другом файле
declare enum LogLevel {
  Debug = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
}
```

### Практика и применение

**Главные use-cases:**

1. **`.d.ts` файлы** — всё содержимое ambient по умолчанию
2. **Типизация bundler-переменных**: `declare const __DEV__: boolean` в Webpack/Vite конфигурациях
3. **Типизация CSS Modules, SVG, изображений**: Vite/webpack декларации в `vite-env.d.ts` или `global.d.ts`
4. **Расширение сторонних типов**: `express.Request` + `req.user`, `jest.Matchers` + кастомные матчеры

```typescript
// vite-env.d.ts — типичный файл в Vite-проекте
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  // добавляем свои env-переменные
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Важные нюансы и краеугольные камни

- **`declare` не генерирует JS**: если описать `declare const foo: string` но `foo` нет в рантайме — рантайм-ошибка
- **`declare module "..."` vs `declare namespace`**: первое — для ES module-импорта; второе — для глобальных namespace
- **`declare global { ... }` требует модульного контекста**: файл должен иметь `import`/`export` или `export {}` иначе `declare global` не нужен — файл уже в глобальном скопе
- **`@types/*` пакеты** состоят из `.d.ts` файлов с `declare` — это стандартный механизм DefinitelyTyped
- **`declare const` vs `const`**: `declare const` — только тип; `const` — тип + значение + JS-код

### Примеры

```typescript
// Полный пример: типизация окружения в Vite React проекте

// src/types/globals.d.ts
declare global {
  // Переменные из Webpack DefinePlugin / Vite define
  const __APP_VERSION__: string;
  const __BUILD_DATE__: string;
}

// src/types/assets.d.ts
declare module "*.svg?react" {
  import { FC, SVGProps } from "react";
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module "*.json" {
  const value: unknown;
  export default value;
}

// src/types/augmentations.d.ts
import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: "admin" | "user";
    };
    requestId: string;
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `declare` отличается от обычного объявления?** — `declare` не генерирует JS-код; сообщает TS что сущность существует извне
- **Что такое `.d.ts` файлы?** — файлы, содержащие только ambient declarations; весь контент неявно `declare`
- **Как типизировать SVG в React проекте?** — через `declare module "*.svg"` в `global.d.ts` или через готовую конфигурацию Vite/CRA
- **Что такое `@types`?** — npm-пакеты с `.d.ts` типами для JS-библиотек из DefinitelyTyped

### Красные флаги (чего не говорить)

- «`declare` создаёт переменную» — нет, только её тип; значение должно прийти из другого источника
- «`declare module` — это то же что `namespace`» — разные механизмы: `declare module` для ES imports; `declare namespace` для глобальных объектов
- «Файл `.d.ts` содержит рантайм-код» — нет, только объявления типов

### Связанные темы

- `026-ambient-declaration.md`
- `024-raznica-internal-i-external-module.md`
- `027-triple-slash-directives.md`
