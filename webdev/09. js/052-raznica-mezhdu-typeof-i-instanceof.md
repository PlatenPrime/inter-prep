# Q052. Разница между `typeof` и `instanceof`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`typeof` — унарный оператор, возвращает **строку с именем примитивного типа** значения (`"number"`, `"string"`, `"boolean"`, `"undefined"`, `"object"`, `"function"`, `"symbol"`, `"bigint"`). `instanceof` — бинарный оператор, проверяет, есть ли `Constructor.prototype` в **цепочке прототипов** объекта. `typeof` работает с примитивами, `instanceof` — с объектами.

---

## Развёрнутый ответ

### `typeof` — проверка типа значения

```javascript
typeof 42          // "number"
typeof "hello"     // "string"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof Symbol()    // "symbol"
typeof 42n         // "bigint"
typeof {}          // "object"
typeof []          // "object" ← массив — тоже object
typeof null        // "object" ← исторический баг!
typeof function(){}// "function" ← функция особый случай
```

Особенности:
- Работает с необъявленными переменными без ReferenceError.
- Не различает разные виды объектов (массив, дата, Map).
- Исторический баг: `typeof null === "object"`.

### `instanceof` — проверка принадлежности к классу

```javascript
[] instanceof Array;      // true
[] instanceof Object;     // true (Array наследует от Object)
new Date() instanceof Date;  // true
new Map() instanceof Map;    // true
"hello" instanceof String;   // false — примитив, не объект!
new String("hello") instanceof String; // true — объект-обёртка
```

**Алгоритм:** проходит по `[[Prototype]]` цепочке объекта и сравнивает с `Constructor.prototype`:
```
obj instanceof Foo
  │
  └─▶ Object.getPrototypeOf(obj) === Foo.prototype ?
      нет → идём вверх по цепочке → ... → null → false
```

### Ненадёжность `instanceof` через разные контексты

```javascript
// Проблема с iframe
const iframe = document.createElement('iframe');
document.body.appendChild(iframe);
const iframeArray = iframe.contentWindow.Array;
const arr = new iframeArray([1, 2, 3]);

arr instanceof Array;      // false — разные Array из разных контекстов!
Array.isArray(arr);        // true  — работает корректно
```

### Кастомный `instanceof` через `Symbol.hasInstance`

```javascript
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  static [Symbol.hasInstance](value) {
    return typeof value === 'number' && value >= this.start && value <= this.end;
  }
}

// Нельзя вызвать как обычный конструктор, это демо паттерна
```

### Практика и применение

```javascript
// typeof — для примитивов
function isString(x) { return typeof x === 'string'; }
function isNumber(x) { return typeof x === 'number' && !isNaN(x); }
function isFunction(x) { return typeof x === 'function'; }

// instanceof — для объектов
function isDate(x) { return x instanceof Date; }
function isArray(x) { return Array.isArray(x); } // лучше чем instanceof
function isError(x) { return x instanceof Error; }

// Object.prototype.toString — универсальный
function getType(x) {
  return Object.prototype.toString.call(x).slice(8, -1); // "Array", "Date", ...
}
```

### Важные нюансы и краеугольные камни

- `typeof null === "object"` — всегда помнить при проверке на объект: добавлять `&& value !== null`.
- `instanceof` не работает для примитивов (строк, чисел).
- `Array.isArray()` — правильный способ проверки массива (работает через iframe).
- TypeScript: `typeof` и `instanceof` работают как **type guards** — сужают тип в ветках кода.

### Примеры

```javascript
// TypeScript type guards
function processValue(value: string | number | Date) {
  if (typeof value === 'string') {
    return value.toUpperCase();  // value: string
  }
  if (typeof value === 'number') {
    return value.toFixed(2);     // value: number
  }
  if (value instanceof Date) {
    return value.toISOString();  // value: Date
  }
}

// Надёжная проверка типа объекта
function isPlainObject(value) {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

isPlainObject({});           // true
isPlainObject(new Date());   // false
isPlainObject([]);           // false
```

---

## Сравнение

| Критерий | `typeof` | `instanceof` |
|----------|----------|--------------|
| Что проверяет | Примитивный тип | Принадлежность к конструктору |
| Работает с примитивами | ✓ | ✗ |
| Работает с объектами | Частично (`"object"`) | ✓ |
| `null` | `"object"` (баг) | `null instanceof Object` → `false` |
| Через iframe | ✓ | ✗ |
| Возвращает | Строку | Boolean |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как надёжно проверить массив?** — `Array.isArray(value)`.
- **Почему `instanceof` ненадёжен через iframe?** — В каждом контексте свой `Array`, `Object` — их прототипы разные.
- **Что такое `Symbol.hasInstance`?** — Позволяет кастомизировать поведение `instanceof` для своего класса.

### Красные флаги (чего не говорить)

- «`typeof [] === "array"`» — нет, `"object"`.
- «`instanceof` работает для строк и чисел» — только для объектов.

### Связанные темы

- `001-tipy-dannyh-v-javascript.md`
- `008-pochemu-typeof-null-vozvraschaet-object.md`
- `045-chto-takoe-prototip-obiekta.md`
