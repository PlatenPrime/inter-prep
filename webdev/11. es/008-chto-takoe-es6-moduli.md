# Q008. Что такое ES6 модули?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

ES6 модули (ESM) — стандартная система модулей JavaScript, введённая в ES2015. Каждый файл является изолированным модулем со своим областью видимости. Экспорт через `export`, импорт через `import`. ESM статически анализируемы (зависимости известны до выполнения), поддерживают tree shaking, работают в строгом режиме по умолчанию. Альтернативы — CommonJS (`require`/`module.exports`) в Node.js и устаревшие AMD/IIFE-паттерны.

---

## Развёрнутый ответ

### Суть и определение

До ES2015 стандартной системы модулей в JavaScript не существовало. Использовались:
- IIFE (Immediately Invoked Function Expression) — изоляция через замыкание
- AMD (require.js) — асинхронные модули для браузера
- CommonJS — синхронные модули Node.js (`require`/`module.exports`)

ES6 Modules — первый официальный стандарт, единый для браузера и Node.js (с ES2020 поддерживает `import()` динамически).

### Как это работает

**Три фазы загрузки ESM:**
1. **Construction** — парсинг всего графа зависимостей (статически, без выполнения)
2. **Instantiation** — выделение памяти под экспорты (live bindings), связывание
3. **Evaluation** — выполнение кода модулей в правильном порядке

**Live bindings** — ключевое отличие от CommonJS: импортированные значения — это живые ссылки на экспорт. Если модуль обновит экспортированную переменную — импортёр увидит изменение.

```javascript
// counter.js
export let count = 0;
export function increment() { count++; }

// main.js
import { count, increment } from './counter.js';
console.log(count); // 0
increment();
console.log(count); // 1 — live binding!
```

### Практика и применение

**Named exports** — для нескольких значений из модуля:
```javascript
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export class Vector { /* ... */ }
```

**Default export** — одно основное значение (компонент, класс, функция):
```javascript
export default function fetchUser(id) { /* ... */ }
// или
const App = () => <div>App</div>;
export default App;
```

**Re-export** — агрегирующий модуль (barrel file):
```javascript
// index.js
export { Button } from './button.js';
export { Input } from './input.js';
export { default as Modal } from './modal.js';
```

**Динамический импорт** (ES2020) — ленивая загрузка:
```javascript
const module = await import('./heavy-module.js');
// или с деструктуризацией
const { parse } = await import('./parser.js');
```

### Важные нюансы и краеугольные камни

- **ESM всегда строгий режим** (`'use strict'` не нужен).
- **Импорты хоистятся**: `import` всегда выполняется до любого кода в модуле, независимо от позиции в файле.
- **Нельзя условно импортировать** статически: `if (flag) { import ... }` — SyntaxError. Для условной загрузки — динамический `import()`.
- **Circular dependencies** разрешаются иначе чем в CJS: ESM использует live bindings, поэтому цикличные зависимости работают корректнее, но всё равно требуют аккуратности.
- **В браузере** `<script type="module">` — ESM, `<script>` без `type` — классический скрипт.
- **В Node.js**: `.mjs` расширение или `"type": "module"` в `package.json`. CJS и ESM можно смешивать с ограничениями.
- **Tree shaking**: бандлеры (Webpack, Rollup, Vite) анализируют статические `import/export` и удаляют неиспользуемый код. С CommonJS это невозможно.

### Примеры

```javascript
// math.js — named exports
export const PI = 3.14159;
export const E = 2.71828;
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

// logger.js — default export
export default class Logger {
  log(msg) { console.log(`[LOG] ${msg}`); }
}

// utils/index.js — barrel (re-export)
export * from './math.js';
export { default as Logger } from './logger.js';

// app.js — импорт
import Logger, { PI, add } from './utils/index.js';
// или с псевдонимом
import { add as sum } from './math.js';
// или весь namespace
import * as MathUtils from './math.js';
MathUtils.PI; // 3.14159

// Динамический импорт для code splitting
async function loadHeavyFeature() {
  const { HeavyComponent } = await import('./heavy.js');
  return HeavyComponent;
}
```

---

## Сравнение ESM vs CommonJS

| Критерий | ESM | CommonJS |
|----------|-----|---------|
| Синтаксис | `import`/`export` | `require`/`module.exports` |
| Загрузка | Статическая (async) | Динамическая (sync) |
| Live bindings | Да | Нет (копия) |
| Tree shaking | Да | Нет |
| Строгий режим | Всегда | Опционально |
| Условный импорт | Только `import()` | `require()` где угодно |
| Браузер | Нативно | Нет (нужен бандлер) |
| Top-level await | Да | Нет |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое live bindings и чем они отличаются от CJS?** — ESM экспортирует живую ссылку на переменную, CJS экспортирует значение на момент вызова `require`.
- **Почему tree shaking не работает с CommonJS?** — `require()` динамичен (может быть в условии), статический анализ невозможен.
- **Можно ли использовать `require` в ESM?** — Нет напрямую; можно через `createRequire` из Node.js или dynamic `import()`.
- **Что такое barrel file и в чём риск?** — Агрегирующий `index.js`; риск — импорт всего модуля даже если нужен один экспорт, что снижает эффективность tree shaking.

### Красные флаги (чего не говорить)

- «ESM и CommonJS — одно и то же» — принципиальные различия в механизме работы.
- «В Node.js используют только CommonJS» — Node.js поддерживает ESM начиная с v12.
- «Импорты можно писать в любом месте файла с условием» — статические импорты всегда хоистятся; условный импорт возможен только через `import()`.

### Связанные темы

- [`001-chto-takoe-ecmascript-otlichie-ot-javascript.md`](001-chto-takoe-ecmascript-otlichie-ot-javascript.md)
- [`010-chto-takoe-destrukturizaciya.md`](010-chto-takoe-destrukturizaciya.md)
