# Q026. Что такое внешние объявления переменных (ambient declaration) в TypeScript?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

**Ambient declaration** (внешнее объявление) — объявление типа для сущности, реализация которой существует вне TypeScript-кода. Они описывают форму JavaScript-библиотек, глобальных переменных, модулей — всего, что не написано на TypeScript. Хранятся в `.d.ts` файлах и используют ключевое слово `declare`.

---

## Развёрнутый ответ

### Суть и определение

TypeScript работает только с тем, чему знает тип. Когда код существует вне TS (legacy JS-библиотека, глобальные переменные браузера, нативные модули), нужно «сообщить» компилятору об их форме — это и есть ambient declaration.

**Ключевые характеристики:**
- Используют `declare` (явно или неявно в `.d.ts`)
- **Не генерируют JavaScript-код** — только типовая информация
- Компилятор доверяет им: ошибки будут только типовые, не структурные

### Как это работает

#### `.d.ts` файлы — файлы ambient declarations

```typescript
// Всё содержимое .d.ts является ambient по умолчанию
// (не нужно писать declare перед каждым объявлением)

// math.d.ts — типы для math.js
export function add(a: number, b: number): number;
export function subtract(a: number, b: number): number;
export const PI: number;

// В .ts файлах те же объявления нужно писать с declare
declare function add(a: number, b: number): number;
```

#### Типы для существующих JS-библиотек

```typescript
// Вариант 1: DefinitelyTyped — сторонний пакет
// npm install -D @types/lodash
// TypeScript автоматически подхватывает из node_modules/@types/

// Вариант 2: Самописный .d.ts
// types/legacy-chart.d.ts
declare module "legacy-chart" {
  interface ChartOptions {
    width: number;
    height: number;
    data: number[];
    title?: string;
  }

  class Chart {
    constructor(canvas: HTMLCanvasElement, options: ChartOptions);
    render(): void;
    update(data: number[]): void;
    destroy(): void;
  }

  export { Chart, ChartOptions };
  export default Chart;
}
```

#### Ambient Global Declarations

```typescript
// global.d.ts — описание глобальных переменных
// (файл без import/export — ambient, всё попадает в глобальный скоп)

declare const __APP_VERSION__: string;
declare const __BUILD_HASH__: string;
declare var process: NodeJS.Process; // дополнение или замена

// Глобальные функции (полифиллы, browser API, CDN-скрипты)
declare function gtag(command: "event", action: string, params?: object): void;
declare function gtag(command: "config", targetId: string, config?: object): void;

// Глобальные классы
declare class WebWorker extends Worker {
  constructor(url: string, options?: WorkerOptions);
}
```

#### Module Augmentation (расширение существующих модулей)

```typescript
// Расширение express Request — очень частый паттерн
import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthenticatedUser;
    requestId: string;
    startTime: number;
  }
}

// Расширение сторонней библиотеки
declare module "some-orm" {
  interface QueryBuilder {
    whereActive(): this; // кастомный метод, добавленный через mixin
  }
}
```

#### Ambient Enum, Interface, Type

```typescript
// В .d.ts файле
declare enum ConnectionState {
  Connecting = 0,
  Connected = 1,
  Disconnected = 2,
}

// Интерфейсы в .d.ts — ambient по умолчанию
interface GlobalConfig {
  apiUrl: string;
  debug: boolean;
  features: string[];
}

// Declaration merging — интерфейс в .d.ts расширяет глобальный
interface Window {
  globalConfig: GlobalConfig;
  Stripe?: StripeConstructor;
}
```

### Практика и применение

**Где встречаются ambient declarations:**

1. **`lib.dom.d.ts`** — типы браузерного API (встроен в TypeScript)
2. **`lib.es*.d.ts`** — типы стандартной библиотеки JS (встроен)
3. **`@types/*`** — DefinitelyTyped пакеты для популярных библиотек
4. **`node_modules/package/index.d.ts`** — встроенные типы библиотеки
5. **Кастомные `.d.ts`** — для legacy кода, внутренних библиотек, bundler переменных

```typescript
// tsconfig.json — управление ambient declarations
{
  "compilerOptions": {
    "lib": ["DOM", "ES2020"],           // встроенные ambient libs
    "typeRoots": ["./types", "./node_modules/@types"], // где искать типы
    "types": ["node", "jest"],          // только эти из @types
    "skipLibCheck": true                // не проверять .d.ts файлы (ускоряет)
  }
}
```

### Важные нюансы и краеугольные камни

- **Ambient ≠ реализация**: если `declare` что-то существует, а в рантайме нет — ошибка в рантайме
- **`skipLibCheck: true`** — ускоряет компиляцию, пропуская проверку `.d.ts`; скрывает ошибки в типах зависимостей; используется в большинстве проектов
- **Конфликт типов**: несколько `.d.ts` могут объявлять один глобальный тип по-разному; решается через `/// <reference types="..." />`
- **`types` vs `typeRoots` в tsconfig**: `types` — белый список конкретных `@types` пакетов; `typeRoots` — папки для поиска
- **`import type`** из `.d.ts` — только тип, стирается при компиляции; не вызывает загрузки модуля

### Примеры

```typescript
// Полный пример: кастомная d.ts для webpack-bundled окружения
// src/types/env.d.ts

// Webpack DefinePlugin переменные
declare const __DEV__: boolean;
declare const __PROD__: boolean;
declare const __VERSION__: string;
declare const __API_URL__: string;

// Webpack require для нестандартных форматов
declare module "*.graphql" {
  import { DocumentNode } from "graphql";
  const document: DocumentNode;
  export default document;
}

declare module "*.worker.ts" {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}

// Расширение глобального Object
interface ObjectConstructor {
  typedKeys<T>(obj: T): (keyof T)[];
}
```

```typescript
// Использование:
if (__DEV__) {
  console.log(`Version: ${__VERSION__}`);
}

import UserWorker from "./user.worker.ts";
const worker = new UserWorker(); // типизировано

import query from "./getUser.graphql";
// query: DocumentNode — типизировано
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `.d.ts` отличается от обычного `.ts` файла?** — `.d.ts` содержит только типы (ambient); не компилируется в JS; весь контент — `declare`
- **Что такое DefinitelyTyped?** — репозиторий с `.d.ts` типами для JS-библиотек; устанавливаются через `@types/package-name`
- **Как TypeScript находит типы для `import`?** — по очереди: встроенные lib, `typeRoots`, `types`, `node_modules/package/types` поле, `index.d.ts`
- **Что такое `skipLibCheck`?** — флаг, пропускающий проверку типов в `.d.ts` файлах зависимостей; ускоряет компиляцию

### Красные флаги (чего не говорить)

- «Ambient declaration — это то же что обычное объявление, просто в другом файле» — ambient не генерирует JS; при несоответствии рантайм упадёт без предупреждения
- «`.d.ts` файлы компилируются» — нет; они только читаются компилятором для типов
- «Не нужно писать типы для JS-библиотек — TypeScript сам разберётся» — без типов TS даст `any`; нужны `.d.ts` или `@types`

### Связанные темы

- `025-klyuchevoe-slovo-declare.md`
- `027-triple-slash-directives.md`
- `024-raznica-internal-i-external-module.md`
