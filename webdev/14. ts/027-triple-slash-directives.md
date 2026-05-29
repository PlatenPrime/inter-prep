# Q027. Что такое директивы с тремя наклонными чертами (Triple-Slash Directives), их типы?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

**Triple-Slash Directives** — однострочные XML-комментарии вида `/// <reference ... />` в начале файла TypeScript. Они сообщают компилятору о зависимостях между файлами типов. Три основных вида: `/// <reference path="..." />` (ссылка на файл), `/// <reference types="..." />` (ссылка на `@types` пакет) и `/// <reference lib="..." />` (включение встроенной библиотеки).

---

## Развёрнутый ответ

### Суть и определение

До появления ES modules и `tsconfig.json` triple-slash directives были основным способом объявить зависимость между TypeScript-файлами. Сегодня они **устарели для организации обычного кода**, но по-прежнему актуальны в `.d.ts` файлах и специфичных сценариях.

Директивы **обязаны находиться в начале файла** — до любого кода и обычных комментариев. Только другие triple-slash директивы могут им предшествовать.

### Как это работает

#### 1. `/// <reference path="..." />`

```typescript
// Явная ссылка на другой TypeScript/Declaration файл
/// <reference path="./types/custom.d.ts" />
/// <reference path="../shared/models.ts" />

// После этого типы из указанного файла доступны
const user: User = { id: "1", name: "Alice" }; // User из models.ts
```

**Когда использовался:** в многофайловых namespace-проектах до `tsconfig.json`. Сейчас не нужен — компилятор сам находит файлы через `tsconfig`.

```typescript
// Пример namespace с reference path (legacy паттерн)
// validators.ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}

// emailValidator.ts
/// <reference path="validators.ts" />
namespace Validation {
  export class EmailValidator implements Validation.StringValidator {
    isAcceptable(s: string): boolean {
      return /\S+@\S+\.\S+/.test(s);
    }
  }
}
```

#### 2. `/// <reference types="..." />`

```typescript
// Явно подключает @types пакет
/// <reference types="node" />
/// <reference types="jest" />
/// <reference types="vite/client" />

// Теперь types/node, types/jest, vite/client доступны в этом файле
process.env.NODE_ENV; // process доступен через @types/node
```

**Когда нужен:** в `.d.ts` файлах библиотек, чтобы явно объявить зависимость от других `@types`. В обычных `.ts` файлах — настройка через `tsconfig.json/types` предпочтительнее.

#### 3. `/// <reference lib="..." />`

```typescript
// Явно включает одну из встроенных TypeScript-библиотек
/// <reference lib="es2015.promise" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// Используется когда:
// 1. В tsconfig не указан "lib", но нужны конкретные типы
// 2. В .d.ts файле нужна конкретная встроенная lib

// Пример: полифилл для Promise в старом окружении
/// <reference lib="es2015.promise" />
declare function promisify<T>(fn: (cb: (err: Error | null, result: T) => void) => void): Promise<T>;
```

#### 4. `/// <reference no-default-lib="true" />`

```typescript
// Редкий: запрещает TypeScript добавлять дефолтные lib
// Используется в файлах самой стандартной библиотеки TypeScript
/// <reference no-default-lib="true"/>
```

#### 5. `/// <amd-module name="..." />` (устаревший)

```typescript
// Для AMD модулей — устарело
/// <amd-module name="MyModule"/>
```

### Практика и применение

**Современные случаи, где triple-slash нужны:**

1. **В начале `.d.ts` библиотеки** — явная зависимость от `@types`:
```typescript
// my-library/index.d.ts
/// <reference types="node" />

export declare function readConfig(path: string): Promise<Config>;
```

2. **Vite / CRA вспомогательные файлы** — `vite-env.d.ts`:
```typescript
/// <reference types="vite/client" />
// Добавляет типы для import.meta.env, import.meta.hot и asset imports
```

3. **Jest / Vitest в TypeScript**:
```typescript
/// <reference types="vitest/globals" />
// Добавляет describe, it, expect в глобальный скоп без import
```

### Важные нюансы и краеугольные камни

- **Порядок**: директивы должны быть самыми первыми строками файла; обычный код или `import` до них делает директивы обычными комментариями
- **`reference path`**: путь относительный к текущему файлу; расширение `.ts` опционально
- **Vs `tsconfig.json`**: в большинстве случаев настройка через `tsconfig` (поля `include`, `files`, `types`, `lib`) предпочтительнее triple-slash
- **`/// <reference types="..." />`** нужен только в `.d.ts` файлах-пакетах; в `.ts` файлах приложения — используй `tsconfig.types`
- **`vite-env.d.ts`** — самый частый пример triple-slash в современном коде; создаётся автоматически `npm create vite`

### Примеры

```typescript
// Современный реальный пример: vite-env.d.ts
/// <reference types="vite/client" />

// Типизация кастомных env переменных
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_STRIPE_KEY: string;
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

```typescript
// Пример в .d.ts пакета (современный)
// packages/my-lib/types/index.d.ts
/// <reference types="node" />

export interface ServerOptions {
  port?: number;
  host?: string;
  ssl?: {
    key: Buffer;     // Buffer из @types/node
    cert: Buffer;
  };
}

export declare function createServer(options?: ServerOptions): import("http").Server;
```

```typescript
// Сравнение: triple-slash vs tsconfig подход

// УСТАРЕЛО — через triple-slash:
/// <reference types="jest" />
describe("test", () => { /* ... */ });

// ПРЕДПОЧТИТЕЛЬНО — через tsconfig.json:
// {
//   "compilerOptions": {
//     "types": ["jest"]
//   }
// }
// И в файле просто:
describe("test", () => { /* ... */ });
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда triple-slash обязателен в современном коде?** — в `.d.ts` файлах библиотек для зависимостей; `vite-env.d.ts`; когда нет tsconfig
- **Чем `/// <reference types>` отличается от `import type`?** — `reference types` включает весь пакет в ambient скоп; `import type` — конкретные типы с типовым импортом
- **Что делает `/// <reference types="vite/client" />`?** — включает типы Vite: `import.meta.env`, `import.meta.hot`, типы для asset imports (`.svg`, `.png`)
- **Где должны стоять triple-slash директивы?** — только в начале файла; после любого кода или `import` они игнорируются компилятором

### Красные флаги (чего не говорить)

- «Triple-slash директивы — современный способ подключить зависимости» — устарело для обычного кода; замените на `tsconfig.json`
- «`/// <reference path>` нужен в каждом файле» — нет, достаточно настроить `tsconfig.json/include` или `files`
- «Triple-slash — это просто комментарии, компилятор их игнорирует» — нет, это инструкции компилятору при условии правильного расположения

### Связанные темы

- `026-ambient-declaration.md`
- `025-klyuchevoe-slovo-declare.md`
- `024-raznica-internal-i-external-module.md`
- `028-map-fajl.md`
