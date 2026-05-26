# Q085. Как обмениваться кодом между файлами?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

В JavaScript существуют две основные системы модулей: **CommonJS (CJS)** — используется в Node.js (`require`/`module.exports`), и **ES Modules (ESM)** — стандарт языка (`import`/`export`). ESM поддерживается в современных браузерах нативно и является текущим стандартом. Дополнительно существуют устаревшие форматы AMD и UMD.

---

## Развёрнутый ответ

### Суть

До появления модулей (до ES2015) для изоляции кода использовались IIFE и паттерн «Модуль». Стандарт ES Modules (ESM) был принят в ES2015, а поддержка в браузерах появилась с 2017 года.

### ES Modules (ESM) — современный стандарт

```javascript
// math.js — экспорт
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// Экспорт по умолчанию (один на файл)
export default class Calculator {
  add(a, b) { return a + b; }
}
```

```javascript
// app.js — импорт
import Calculator, { PI, add, subtract } from './math.js';

// Переименование при импорте
import { add as sum } from './math.js';

// Импорт всего как namespace
import * as MathUtils from './math.js';
console.log(MathUtils.PI);

// Динамический импорт (ленивая загрузка)
const module = await import('./heavy-module.js');
```

```html
<!-- Браузер: тип module -->
<script type="module" src="app.js"></script>
```

**Особенности ESM:**
- Статический анализ: `import`/`export` обрабатываются до выполнения кода.
- **Живые привязки**: при изменении экспортированного значения в исходном модуле, импортированное значение тоже обновляется.
- Всегда в strict mode.
- Загружаются **асинхронно** в браузере.
- Путь должен быть явным (с расширением `.js` в браузере/Node.js ESM).

### CommonJS (CJS) — Node.js стандарт

```javascript
// math.js — экспорт
const PI = 3.14159;

function add(a, b) {
  return a + b;
}

module.exports = { PI, add };
// или:
module.exports.PI = PI;
module.exports.add = add;
```

```javascript
// app.js — импорт
const { PI, add } = require('./math.js');

// Деструктуризация
const mathUtils = require('./math.js');
console.log(mathUtils.PI);

// Динамический импорт (синхронный!)
const modulePath = './math.js';
const utils = require(modulePath); // работает, но не для ESM
```

**Особенности CJS:**
- Выполняется **синхронно** — не подходит для браузеров без бандлера.
- `require` — это вызов функции, вычисляется во время выполнения.
- Кэширует модули: повторный `require` возвращает тот же объект.
- **Копирует** значения при экспорте (не живые привязки).

### Сравнение ESM vs CJS

| Аспект | ESM | CJS |
|--------|-----|-----|
| Синтаксис | `import`/`export` | `require`/`module.exports` |
| Загрузка | Асинхронная | Синхронная |
| Анализ | Статический (build-time) | Динамический (runtime) |
| Tree-shaking | Поддерживается | Не поддерживается |
| Браузер | Нативно | Только через бандлер |
| Node.js | `.mjs` или `"type": "module"` | По умолчанию |
| Привязки | Живые | Скопированные |

### package.json — настройка формата

```json
{
  "type": "module",  // все .js файлы — ESM
  "exports": {
    ".": {
      "import": "./dist/index.mjs",   // ESM
      "require": "./dist/index.cjs"   // CJS
    }
  }
}
```

### Динамические импорты (code splitting)

```javascript
// Ленивая загрузка тяжёлых модулей
async function loadChart() {
  const { Chart } = await import('./chart.js'); // загружается по требованию
  return new Chart();
}

// React: React.lazy
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

### Устаревшие форматы (историческая справка)

```javascript
// AMD (Asynchronous Module Definition) — RequireJS
define(['jquery'], function($) {
  return { init: () => $('body').hide() };
});

// UMD (Universal Module Definition) — работает в CJS, AMD и браузере
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof module === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.myLib = factory(root.$);
  }
})(this, function($) { /* ... */ });
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое tree-shaking и почему оно работает только с ESM?** — Бандлер статически анализирует `import`/`export` и удаляет неиспользуемый код. В CJS `require` динамический — нельзя знать наверняка что импортируется.
- **Могут ли ESM и CJS работать вместе в одном проекте?** — Да, с оговорками: ESM может импортировать CJS через `createRequire`, CJS не может `require` ESM (асинхронный), но может использовать динамический `import()`.
- **Что такое «живые привязки» в ESM?** — Если модуль изменяет своё экспортированное значение, все импортеры видят обновлённое значение.

### Красные флаги (чего не говорить)

- «`import` и `require` — это одно и то же» — разные системы с разным поведением.
- Не знать о tree-shaking и его связи с ESM.

### Связанные темы

- `083-chto-takoe-polyfil-polyfill.md`
- `027-chto-takoe-iife.md`
- `021-chto-takoe-oblast-vidimosti-scope.md`
