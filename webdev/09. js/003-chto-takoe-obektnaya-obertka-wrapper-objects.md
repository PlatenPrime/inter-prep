# Q003. Что такое объектная обертка (Wrapper Objects)?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Wrapper-объекты (`String`, `Number`, `Boolean`, `BigInt`, `Symbol`) — это конструкторы, которые оборачивают примитивные значения в объект, открывая доступ к методам и свойствам. JavaScript автоматически создаёт и уничтожает такую обёртку при обращении к свойствам примитива — это называется **autoboxing**.

---

## Развёрнутый ответ

### Суть и определение

Примитивы (`string`, `number`, `boolean`) сами по себе не являются объектами и не имеют методов. Тем не менее `"hello".toUpperCase()` работает, потому что движок на лету создаёт объект-обёртку, вызывает на нём метод и немедленно уничтожает обёртку.

Конструкторы-обёртки:
| Примитив | Wrapper |
|----------|---------|
| `string` | `String` |
| `number` | `Number` |
| `boolean` | `Boolean` |
| `bigint` | `BigInt` |
| `symbol` | `Symbol` |

У `null` и `undefined` обёрток нет — именно поэтому `null.toString()` бросает `TypeError`.

### Как это работает (autoboxing)

```javascript
const str = "hello";
str.toUpperCase();
// 1. Движок: new String("hello")  — создаёт временный объект
// 2. Вызывает .toUpperCase() на нём
// 3. Объект немедленно уничтожается (GC)
// 4. Возвращается результат — новая строка "HELLO"
```

Это происходит за кулисами при каждом обращении `primitive.property`.

### Практика и применение

- **Методы строк** (`slice`, `split`, `includes`, `padStart`, …) — доступны благодаря autoboxing.
- **Методы числа** (`toFixed`, `toString(16)`, `isNaN`, …) — аналогично.
- **Symbol.iterator, Symbol.toPrimitive** — специальные well-known symbols из `Symbol.*`, используются как протоколы движка.

Явный вызов конструктора `new String("hi")` использовать **не нужно** — он создаёт полноценный объект, а не примитив, что приводит к неочевидному поведению.

### Важные нюансы и краеугольные камни

- `new Number(42) !== 42` — объект никогда не равен примитиву при строгом сравнении.
- `typeof new String("hi") === "object"` — оборачивание через `new` меняет тип!
- `new Boolean(false)` — truthy! Это объект, объекты всегда truthy, даже если внутри `false`.
- `Symbol()` нельзя вызвать с `new` — бросает `TypeError`. Это намеренное решение.
- Свойство, записанное на примитив, теряется — autoboxing создаёт временный объект каждый раз.

### Примеры

```javascript
// Autoboxing в действии
const n = 255;
console.log(n.toString(16)); // "ff"  — метод Number.prototype.toString

// Ловушка с new Boolean
const falsy = new Boolean(false);
if (falsy) {
  console.log('Выполнится! Объект всегда truthy'); // выполнится
}

// Разница: примитив vs обёртка
const prim = "hello";
const wrap = new String("hello");

console.log(typeof prim);   // "string"
console.log(typeof wrap);   // "object"
console.log(prim === "hello"); // true
console.log(wrap === "hello"); // false — объект vs примитив

// Нет смысла присваивать свойства примитиву
let s = "test";
s.custom = 42;         // autoboxing создаёт временный объект, пишет в него
console.log(s.custom); // undefined — объект уже уничтожен
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `new Boolean(false)` равен `true` в условии?** — `new Boolean()` возвращает объект, объекты всегда truthy.
- **Когда `Symbol` нельзя вызвать через `new`?** — По спецификации, Symbol — лёгкий примитив; принудительный запрет `new Symbol()` предотвращает путаницу с обёрткой.
- **Как принудительно получить примитив из обёртки?** — `.valueOf()` или явное приведение: `String(wrap)`, `+num`.

### Красные флаги (чего не говорить)

- «Нужно писать `new String()` чтобы получить строку с методами» — нет, autoboxing делает это автоматически, явные обёртки через `new` — антипаттерн.
- «Все примитивы в JS — на самом деле объекты» — нет, примитивы хранятся по значению; объекты появляются лишь временно при autoboxing.

### Связанные темы

- `001-tipy-dannyh-v-javascript.md`
- `002-raznica-mezhdu-primitivom-i-obektom.md`
- `004-kak-rabotaet-boxing-unboxing-v-javascript.md`
