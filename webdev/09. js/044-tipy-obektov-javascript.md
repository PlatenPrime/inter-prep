# Q044. Типы объектов JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

В JavaScript объекты делятся на: **обычные объекты** (plain objects `{}`), **функции** (callable objects), **массивы** (Array), **встроенные объекты** (Date, RegExp, Map, Set, WeakMap, WeakSet, Promise, Error и др.), **обёртки примитивов** (String, Number, Boolean), **экзотические объекты** (Proxy, аргументы функций). Все они наследуют от `Object.prototype`.

---

## Развёрнутый ответ

### Классификация объектов

**1. Обычные объекты (Ordinary objects):**
```javascript
const obj = { key: 'value' };
const proto = Object.create(myProto);
```

**2. Массивы (Array exotic objects):**
```javascript
const arr = [1, 2, 3];
typeof arr;         // "object"
Array.isArray(arr); // true
// Особенность: автоматически обновляет .length
```

**3. Функции (Callable objects):**
```javascript
function fn() {}
typeof fn;  // "function" (особый тип в typeof, но instanceof Object = true)
fn.name;    // "fn"
fn.length;  // 0
```

**4. Встроенные объекты (Built-in objects):**
```javascript
new Date();           // временная метка
/pattern/flags;       // RegExp
new Map();            // ключ-значение любого типа
new Set();            // уникальные значения
new WeakMap();        // слабые ссылки на объекты-ключи
new WeakSet();        // слабые ссылки на объекты
new Promise(resolve => resolve(42));
new Error('oops');
new ArrayBuffer(16);  // типизированные массивы
new Int32Array(8);
```

**5. Обёртки примитивов (Wrapper objects — избегайте явного создания):**
```javascript
new String("hello");  // object (не рекомендуется)
new Number(42);       // object (не рекомендуется)
new Boolean(false);   // object, всегда truthy! (никогда не использовать)
```

**6. Экзотические объекты:**
```javascript
// Proxy — перехват операций
const proxy = new Proxy(target, handler);

// arguments — псевдомассив в функциях
function foo() { return arguments; } // array-like

// Модули — module namespace objects
import * as ns from './mod.js'; // typeof ns === "object"
```

### Иерархия прототипов

```
Array.prototype
  └── Object.prototype
         └── null

Function.prototype
  └── Object.prototype
         └── null

Map.prototype
  └── Object.prototype
         └── null
```

### Различение типов объектов

```javascript
// typeof различает только function
typeof {};          // "object"
typeof [];          // "object"
typeof null;        // "object" (баг!)
typeof function(){} // "function"

// instanceof — проверка прото-цепочки
[] instanceof Array;     // true
[] instanceof Object;    // true
new Map() instanceof Map; // true

// Object.prototype.toString — наиболее точно
Object.prototype.toString.call([]);           // "[object Array]"
Object.prototype.toString.call({});           // "[object Object]"
Object.prototype.toString.call(null);         // "[object Null]"
Object.prototype.toString.call(new Map());    // "[object Map]"
Object.prototype.toString.call(/re/);         // "[object RegExp]"
Object.prototype.toString.call(new Date());   // "[object Date]"
```

### Практика и применение

- **`Array.isArray()`** — надёжная проверка массива (работает через iframe-границы).
- **`instanceof`** — проверка принадлежности к конструктору; ненадёжно через iframe.
- **`Object.prototype.toString`** — универсальный способ получить тип объекта.

### Важные нюансы и краеугольные камни

- `null` возвращает `"object"` при `typeof` — исторический баг.
- `WeakMap`/`WeakSet` хранят слабые ссылки — не блокируют сборку мусора; нет итерации, нет `size`.
- Экземпляры `Error` имеют стек вызовов (`stack`), сообщение (`message`), имя (`name`).
- `ArrayBuffer` и типизированные массивы (`Int32Array`, `Float64Array`) — основа для работы с бинарными данными и WebAssembly.

### Примеры

```javascript
// Универсальная функция определения типа
function getType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  const tag = Object.prototype.toString.call(value);
  return tag.slice(8, -1).toLowerCase(); // "[object Map]" → "map"
}

getType(null);         // "null"
getType([]);           // "array"
getType({});           // "object"
getType(new Map());    // "map"
getType(new Date());   // "date"
getType(/re/);         // "regexp"
getType(new Set());    // "set"
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `WeakMap` отличается от `Map`?** — Ключи только объекты, слабые ссылки (GC может удалить), нет итерации.
- **Что такое plain object?** — Объект, созданный `{}` или `Object.create(Object.prototype)`, без кастомного прототипа.
- **Как надёжно проверить, что значение — массив?** — `Array.isArray(value)`.

### Красные флаги (чего не говорить)

- «`typeof []` вернёт `"array"`» — нет, `"object"`.
- «`null` — объект» — это примитив с багом в `typeof`.

### Связанные темы

- `001-tipy-dannyh-v-javascript.md`
- `045-chto-takoe-prototip-obiekta.md`
- `052-raznica-mezhdu-typeof-i-instanceof.md`
- `059-zachem-nuzhen-konstruktor-proxy.md`
