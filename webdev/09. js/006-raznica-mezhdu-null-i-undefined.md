# Q006. Разница между `null` и `undefined`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`undefined` — системное значение: движок присваивает его переменным, которые объявлены, но не инициализированы, несуществующим свойствам и параметрам без аргументов. `null` — намеренно присвоенное программистом пустое значение, явно обозначающее «здесь ничего нет». Нестрогое равенство `null == undefined` даёт `true`, строгое `null === undefined` — `false`.

---

## Развёрнутый ответ

### Суть и определение

| | `undefined` | `null` |
|--|-------------|--------|
| Тип (`typeof`) | `"undefined"` | `"object"` (баг) |
| Кто устанавливает | Движок JS | Разработчик |
| Смысл | «Значение не было присвоено» | «Значение намеренно отсутствует» |
| Числовое значение | `NaN` | `0` |

### Как это работает

```javascript
// undefined — движок
let x;
console.log(x); // undefined

function foo(a) { return a; }
foo(); // undefined — аргумент не передан

const obj = {};
console.log(obj.missing); // undefined — свойства нет

// null — разработчик
let user = null; // явно: пользователь не загружен / не существует
```

Оба значения — **falsy** и имеют специальный статус в спецификации. При нестрогом сравнении `==` они равны только друг другу и ничему больше:

```javascript
null == undefined   // true
null == false       // false
null == 0           // false
undefined == false  // false
```

### Практика и применение

- **API-ответы:** `null` в JSON поле означает «сервер вернул пустое значение»; `undefined` в JSON игнорируется при сериализации (`JSON.stringify({a: undefined})` → `"{}"`).
- **Опциональные параметры:** `undefined` → «используй дефолт», `null` → «явно передано пустое».
- **Optional chaining:** `user?.address?.city` возвращает `undefined` если цепочка обрывается.
- **Nullish coalescing:** `value ?? 'default'` срабатывает только на `null`/`undefined`, не на `0` или `""`.

### Важные нюансы и краеугольные камни

- `JSON.stringify` удаляет свойства со значением `undefined`, но сохраняет `null` — критично для REST API.
- `void 0` гарантированно возвращает `undefined` (используется в минифайерах для надёжности).
- Деструктуризация с дефолтом: `const { a = 10 } = {}` даёт `10`; `const { a = 10 } = { a: null }` даёт `null` (дефолт не применяется, только при `undefined`).
- В TypeScript: `null` и `undefined` — разные типы при `strictNullChecks: true`.

### Примеры

```javascript
// JSON: undefined исчезает, null остаётся
JSON.stringify({ a: undefined, b: null }); // '{"b":null}'

// Дефолтный параметр: только undefined запускает дефолт
function greet(name = 'Guest') {
  return `Hello, ${name}`;
}
greet(undefined); // "Hello, Guest"
greet(null);      // "Hello, null" — дефолт НЕ применяется

// Nullish coalescing: null и undefined → дефолт
const value = null;
console.log(value ?? 'fallback');  // "fallback"
console.log(0 ?? 'fallback');      // 0 — не null/undefined
console.log(0 || 'fallback');      // "fallback" — 0 falsy!
```

---

## Сравнение

| Критерий | `undefined` | `null` |
|----------|-------------|--------|
| `typeof` | `"undefined"` | `"object"` |
| Кто создаёт | Движок | Разработчик |
| В JSON | Удаляется | `null` |
| Числовое значение | `NaN` | `0` |
| Дефолтные параметры | Применяется | Не применяется |
| `?? 'default'` | Применяется | Применяется |
| `\|\| 'default'` | Применяется | Применяется |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `typeof null === "object"`?** — Исторический баг; `null` — примитив, не объект.
- **Как безопасно проверить null или undefined одновременно?** — `value == null` (нестрогое) или `value === null || value === undefined`.
- **Что вернёт `null > 0`, `null == 0`, `null >= 0`?** — `false`, `false`, `true` — классический парадокс coercion.

### Красные флаги (чего не говорить)

- «`null` и `undefined` — одно и то же, оба означают "пустое значение"» — семантически разные.
- «`null === undefined`» — это `false`.
- «`typeof null === "null"`» — нет, `"object"`.

### Связанные темы

- `001-tipy-dannyh-v-javascript.md`
- `007-chto-takoe-nan-kak-opredelit-chto-znachenie-ravno-nan.md`
- `009-raznica-mezhdu-nestrогим-i-строгим-ravенством.md`
- `010-raznica-yavnoe-i-neyavnoe-preobrazovanie.md`
