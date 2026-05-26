# Q057. Разница между host-объектами и нативными объектами?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Нативные объекты (native objects)** — определены спецификацией ECMAScript и доступны в любом JS-окружении: `Object`, `Array`, `String`, `Number`, `Date`, `RegExp`, `Math`, `JSON`, `Promise`, `Map`, `Set`. **Host-объекты** — предоставляются средой выполнения (браузером, Node.js) и не являются частью стандарта JS: `window`, `document`, `XMLHttpRequest`, `fetch`, `setTimeout`, `localStorage`, `process` (Node.js).

---

## Развёрнутый ответ

### Нативные объекты

Определены ECMA-262; поведение одинаково в браузере, Node.js, Deno, Bun:

```javascript
// Доступны везде — часть спецификации
new Map()
new Set()
new Promise(resolve => resolve(42))
new Date()
JSON.parse('{}')
Math.random()
Array.from([1, 2, 3])
```

### Host-объекты (браузер)

Предоставляются браузером через Web APIs:

```javascript
// Браузерные host-объекты
window                 // глобальный объект браузера
document               // DOM
navigator              // информация о браузере
localStorage           // Web Storage
sessionStorage
XMLHttpRequest
fetch                  // Fetch API
setTimeout / setInterval // хотя аналог есть в Node
requestAnimationFrame
history
location
```

### Host-объекты (Node.js)

```javascript
process                // информация о процессе Node
__dirname, __filename  // пути (CommonJS)
require                // загрузка модулей (CommonJS)
Buffer                 // работа с бинарными данными
global                 // глобальный объект
fs, http, path         // встроенные модули (не host-объекты в строгом смысле)
```

### Практика и применение

- Нативные объекты — переиспользуемы в любом окружении; universal код (server + client).
- Host-объекты требуют проверки среды при написании изоморфного кода:

```javascript
// Проверка перед использованием browser API
const isBrowser = typeof window !== 'undefined';

function getItem(key) {
  if (isBrowser && window.localStorage) {
    return localStorage.getItem(key);
  }
  return null; // Node.js — нет localStorage
}
```

### Важные нюансы и краеугольные камни

- Поведение host-объектов может отличаться между браузерами (кроссбраузерность).
- В Node.js `fetch` — нативный с Node 18+ (было host-объектом браузера).
- `setTimeout` — host-объект в браузере и Node (реализован в runtime, не в V8).
- JSDOM (используется в тестах через Jest) — имитирует browser host-объекты в Node-окружении.

### Примеры

```javascript
// Изоморфный fetch (работает везде)
const fetchFn = typeof globalThis.fetch !== 'undefined'
  ? globalThis.fetch
  : require('node-fetch');

// Абстракция над host-зависимым хранилищем
interface Storage {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

const browserStorage: Storage = {
  get: (key) => localStorage.getItem(key),
  set: (key, value) => localStorage.setItem(key, value),
};

const memoryStorage: Storage = (() => {
  const store = new Map<string, string>();
  return {
    get: (key) => store.get(key) ?? null,
    set: (key, value) => { store.set(key, value); },
  };
})();
```

---

## Сравнение

| Критерий | Нативные объекты | Host-объекты |
|----------|-----------------|--------------|
| Источник | ECMAScript spec | Среда выполнения |
| Доступность | Везде | Только в своей среде |
| Примеры | Array, Map, Promise | window, document, process |
| Стандартизация | ECMA-262 | W3C, WHATWG, Node.js docs |
| Кроссплатформенность | Да | Нет (зависит от среды) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Является ли `fetch` нативным объектом?** — Исторически browser host-object; в Node 18+ включён в runtime.
- **Почему тесты используют JSDOM?** — Чтобы эмулировать browser host-объекты в Node-окружении.

### Красные флаги (чего не говорить)

- «`window` и `Object` — одного типа» — `window` — host-объект; `Object` — нативный.

### Связанные темы

- `044-tipy-obektov-javascript.md`
- `086-pochemu-globalnye-peremennye-antipattern.md`
