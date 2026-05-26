# Q001. Типы данных в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

В JavaScript 8 типов данных: 7 примитивных (`undefined`, `null`, `boolean`, `number`, `bigint`, `string`, `symbol`) и один ссылочный — `object`. Функции технически являются объектами, но `typeof` возвращает для них `"function"`. Тип переменной определяется динамически во время выполнения.

---

## Развёрнутый ответ

### Суть и определение

Система типов JavaScript определена спецификацией ECMAScript (ECMA-262). Все значения в языке принадлежат одному из 8 типов:

| Тип | Примеры |
|-----|---------|
| `undefined` | `undefined` (переменная объявлена, но не инициализирована) |
| `null` | `null` (явное отсутствие значения) |
| `boolean` | `true`, `false` |
| `number` | `42`, `3.14`, `Infinity`, `NaN` (IEEE 754 double) |
| `bigint` | `9007199254740993n` |
| `string` | `"hello"`, `` `world` `` |
| `symbol` | `Symbol("id")` |
| `object` | `{}`, `[]`, `null` (исторический баг), функции |

### Как это работает

Движок хранит примитивы **по значению** — в переменной находится само значение. Объекты хранятся **по ссылке** — переменная содержит адрес в куче (heap).

`typeof` — унарный оператор, возвращающий строку-тип:

```javascript
typeof 42          // "number"
typeof "hi"        // "string"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof Symbol()    // "symbol"
typeof 42n         // "bigint"
typeof {}          // "object"
typeof []          // "object"  ← массив — тоже object
typeof null        // "object"  ← исторический баг
typeof function(){}// "function"
```

`bigint` появился в ES2020 для работы с целыми числами, превышающими `Number.MAX_SAFE_INTEGER` (`2^53 - 1`). `symbol` появился в ES2015 для создания уникальных идентификаторов свойств.

### Практика и применение

- **API-ответы:** значение может прийти как `null` (явно пустое) или `undefined` (поле вообще отсутствует) — поведение кода должно различаться.
- **Числовые вычисления:** если нужны точные большие целые (ID из базы данных, криптография), используйте `bigint` — `number` теряет точность после `2^53 - 1`.
- **Symbol как ключ объекта:** гарантирует уникальность, не перечисляется через `for...in`, используется в протоколах итерации (`Symbol.iterator`).

### Важные нюансы и краеугольные камни

- `typeof null === "object"` — баг с первой версии JS, не исправлен ради обратной совместимости.
- `NaN` имеет тип `"number"`, но не является числом в математическом смысле; `NaN !== NaN` — единственное значение, не равное себе.
- `null == undefined` (нестрогое), но `null !== undefined` (строгое).
- Нельзя смешивать `number` и `bigint` в арифметических операциях без явного приведения.

### Примеры

```javascript
// Проверка типа на практике
function processId(id) {
  if (typeof id === 'bigint') return id * 2n;
  if (typeof id === 'number') return id * 2;
  throw new TypeError(`Expected number or bigint, got ${typeof id}`);
}

// Symbol для уникальных ключей
const ID = Symbol('id');
const user = { [ID]: 42, name: 'Alice' };
console.log(user[ID]);        // 42
console.log(Object.keys(user)); // ['name'] — Symbol не виден
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `typeof null === "object"`?** — Исторический баг: в первом движке JS тип кодировался в младших битах, у null были нулевые биты, совпадающие с object.
- **Чем отличается `undefined` от `null`?** — `undefined` — системное значение «не присвоено», `null` — намеренное отсутствие значения.
- **Когда использовать `bigint`?** — ID из PostgreSQL/MySQL (64-bit), финансовые расчёты с целыми, хэши, криптография.
- **Что такое `Symbol.toPrimitive`?** — Протокол явного преобразования объекта в примитив при коэрции.

### Красные флаги (чего не говорить)

- «В JS 6 (или 7) типов данных» — с ES2020 их 8.
- «`null` — это объект» — это баг `typeof`, `null` является примитивом по спецификации.
- «Массивы — отдельный тип» — массивы суть объекты, `typeof [] === "object"`.

### Связанные темы

- `002-raznica-mezhdu-primitivom-i-obektom.md`
- `006-raznica-mezhdu-null-i-undefined.md`
- `007-chto-takoe-nan-kak-opredelit-chto-znachenie-ravno-nan.md`
- `008-pochemu-typeof-null-vozvraschaet-object.md`
