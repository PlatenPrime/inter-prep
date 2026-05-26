# Q070. Как проверить, является ли значение массивом?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Рекомендуемый способ — **`Array.isArray(value)`**: надёжно работает во всех контекстах, включая разные фреймы (iframe). `instanceof Array` — ненадёжен через iframe-границы. `typeof []` даёт `"object"`, поэтому `typeof` не поможет. `Object.prototype.toString.call(value) === "[object Array]"` — также работает, но более многословно.

---

## Развёрнутый ответ

### Способы проверки

```javascript
const arr = [1, 2, 3];
const obj = { 0: 1, length: 1 };
const str = "hello";

// 1. Array.isArray() — РЕКОМЕНДУЕТСЯ
Array.isArray(arr);    // true
Array.isArray(obj);    // false
Array.isArray(str);    // false
Array.isArray(null);   // false
Array.isArray([]);     // true

// 2. instanceof Array — НЕНАДЁЖНО ЧЕРЕЗ IFRAME
arr instanceof Array;  // true (в том же контексте)
// В другом iframe: arr instanceof iframe.Array → FALSE!

// 3. typeof — НЕ РАБОТАЕТ
typeof arr;  // "object" — не различает массив и объект

// 4. Object.prototype.toString — РАБОТАЕТ, НО VERBOSE
Object.prototype.toString.call(arr);  // "[object Array]"
Object.prototype.toString.call(arr) === "[object Array]"; // true
```

### Почему `Array.isArray` надёжнее `instanceof`

```javascript
// Проблема с iframe
const iframe = document.createElement('iframe');
document.body.appendChild(iframe);
const iframeArr = new iframe.contentWindow.Array(1, 2, 3);

iframeArr instanceof Array;     // FALSE — разные Array объекты!
Array.isArray(iframeArr);       // TRUE — работает правильно

// Внутренняя реализация Array.isArray проверяет [[Class]] тег объекта,
// а не прото-цепочку — поэтому работает через границы контекста
```

### Псевдомассив vs массив

```javascript
// Псевдомассив (array-like) — имеет length и индексы, но не массив
const arrayLike = { 0: 'a', 1: 'b', length: 2 };
const nodeList = document.querySelectorAll('div');
function args() { return arguments; }

Array.isArray(arrayLike);   // false
Array.isArray(nodeList);    // false
Array.isArray(args());      // false

// Проверка на "похожесть" на массив
function isArrayLike(value) {
  return value != null &&
         typeof value !== 'function' &&
         typeof value.length === 'number' &&
         value.length >= 0 &&
         Number.isInteger(value.length);
}
```

### Практика

```javascript
// TypeScript guard
function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

// Обработка: принять и массив, и одиночное значение
function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

ensureArray([1, 2, 3]); // [1, 2, 3]
ensureArray(42);        // [42]
```

### Важные нюансы

- `Array.isArray(new Array(3))` → `true` — разреженный массив тоже массив.
- `Array.isArray(Array.prototype)` → `true` — `Array.prototype` сам является массивом (экзотический объект).

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `instanceof Array` ненадёжен через iframe?** — Разные контексты имеют разные `Array` объекты; `instanceof` проверяет прото-цепочку, которая не совпадает.
- **Как отличить массив от псевдомассива (array-like)?** — `Array.isArray()` вернёт `false` для псевдомассива.

### Красные флаги (чего не говорить)

- «`typeof [] === "array"`» — нет, `"object"`.
- «`instanceof Array` — лучший способ» — ненадёжен через iframe.

### Связанные темы

- `044-tipy-obektov-javascript.md`
- `052-raznica-mezhdu-typeof-i-instanceof.md`
- `068-dlya-chego-primenyaetsya-array-from.md`
