# Q002. Основные компоненты TypeScript?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

TypeScript состоит из трёх основных компонентов: **язык** (синтаксис + система типов), **компилятор `tsc`** (транспиляция TS → JS и проверка типов) и **языковой сервис** (Language Server Protocol — автодополнение, рефакторинг, навигация в IDE). Понимание этих трёх слоёв объясняет, почему TypeScript работает одновременно как инструмент сборки и как умный помощник в редакторе.

---

## Развёрнутый ответ

### Суть и определение

Официальная документация TypeScript выделяет три основных компонента:

1. **Language (Язык)** — расширенный синтаксис JavaScript с аннотациями типов
2. **Compiler / `tsc`** — компилятор, преобразующий TS → JS
3. **Language Service** — API для инструментов (IDE, линтеры, инструменты рефакторинга)

### Как это работает

#### 1. Language — Язык TypeScript

Надмножество JavaScript с дополнительным синтаксисом:
- **Аннотации типов**: `let x: number = 5`
- **Интерфейсы и типы**: `interface User`, `type ID = string | number`
- **Generics**: `Array<T>`, `Promise<T>`, `function identity<T>(arg: T): T`
- **Enums**: `enum Direction { Up, Down }`
- **Декораторы**: `@Injectable()`, `@Component()`
- **Модификаторы доступа**: `public`, `private`, `protected`, `readonly`
- **Опциональные поля**: `user?.address?.city`

#### 2. Compiler (`tsc`) — TypeScript Compiler

```
.ts файлы → [tsc] → .js файлы + .d.ts файлы (опционально)
```

Компилятор выполняет два независимых шага:
- **Type checking** — статический анализ; не влияет на output
- **Emit** — генерация JavaScript; происходит даже при наличии ошибок типов (если не указан `noEmitOnError`)

Управляется через `tsconfig.json`. Может быть вызван через CLI (`tsc`), Webpack (`ts-loader`), Vite (`esbuild` для emit + `tsc` для проверки), Babel (`@babel/preset-typescript` — только emit, без проверки типов).

#### 3. Language Service — Языковой сервис

Предоставляет API для IDE и инструментов через **Language Server Protocol (LSP)**:
- Автодополнение (IntelliSense)
- Отображение ошибок типов inline
- «Перейти к определению» / «Найти все использования»
- Автоматический рефакторинг (переименование, извлечение функции)
- Quick fixes («импортировать модуль», «добавить тип»)

Именно Language Service делает TypeScript ценным в редакторах — VS Code использует его напрямую через `typescript-language-server`.

### Практика и применение

- В проектах с Vite/esbuild компилятор используется **только для type checking** (`tsc --noEmit`), а транспиляцию берёт на себя более быстрый инструмент
- `tsconfig.json` настраивает все три компонента: target (язык), strict (компилятор), paths (сервис)
- `@ts-check` в JS-файлах позволяет использовать Language Service без полной миграции на TS

### Важные нюансы и краеугольные камни

- **Babel + TypeScript**: Babel транспилирует TS в JS (быстро), но не проверяет типы — нужен отдельный `tsc --noEmit` в CI
- **`tsc --noEmit`** — самый частый способ «только проверить типы» без генерации файлов
- Language Service работает **инкрементально**: кэширует результаты в `.tsbuildinfo` при `composite: true`
- `isolatedModules: true` — ограничение, совместимое с Babel/esbuild: каждый файл транспилируется независимо, без межфайлового анализа

### Примеры

```typescript
// Компонент 1: Язык — аннотации типов
interface Config {
  host: string;
  port: number;
  ssl?: boolean;
}

// Компонент 2: Компилятор поймает ошибку при tsc
const config: Config = {
  host: "localhost",
  port: "3000", // Error: Type 'string' is not assignable to type 'number'
};

// Компонент 3: Language Service даст автодополнение для config.
// config. → предложит host, port, ssl
```

```json
// tsconfig.json — конфигурирует все три компонента
{
  "compilerOptions": {
    "target": "ES2020",       // Язык: версия выходного JS
    "strict": true,            // Компилятор: строгие проверки
    "baseUrl": ".",            // Language Service: разрешение путей
    "paths": {
      "@/*": ["src/*"]
    },
    "noEmit": false,           // Компилятор: генерировать .js файлы
    "incremental": true        // Компилятор: кэш для ускорения
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что произойдёт, если в TS есть ошибки типов — файл скомпилируется?** — да, по умолчанию `tsc` всё равно emit делает; `noEmitOnError: true` меняет поведение
- **Чем отличается `tsc` от Babel для TypeScript?** — Babel только стирает типы (быстро), `tsc` проверяет типы + генерирует JS
- **Что такое `tsconfig.json` и какие ключевые опции?** — конфигурационный файл компилятора; важны `target`, `strict`, `module`, `moduleResolution`
- **Как Language Service связан с VS Code?** — VS Code встроен TypeScript Language Server, использует LSP для всех TS/JS фич редактора

### Красные флаги (чего не говорить)

- «TypeScript — это просто компилятор» — это целая экосистема: язык + компилятор + language service
- «Babel делает то же самое, что tsc» — Babel не проверяет типы, только стирает их
- «Language Service — это что-то из VS Code» — это независимый API TypeScript, доступный любому инструменту

### Связанные темы

- `001-chto-takoe-typescript.md`
- `017-noimplicitany.md`
- `003-osobennosti-typescript.md`
