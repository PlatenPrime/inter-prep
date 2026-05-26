# Q008. Почему `typeof null` возвращает `object`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Это исторический баг первой реализации JavaScript (1995). В оригинальном движке Brendan Eich тип значения кодировался в младших 3 битах числа-тэга: у объектов был тэг `000`, и у `null` (нулевой указатель `0x00000000`) биты тоже были нулями — движок ошибочно распознавал его как объект. Баг не исправлен по сей день ради обратной совместимости.

---

## Развёрнутый ответ

### Суть и определение

`null` по спецификации ECMAScript — это **примитивный тип** (одно из 8 типов), означающий намеренное отсутствие объектного значения. Однако `typeof null` возвращает `"object"` — поведение, прямо противоречащее спецификации.

### Как это работает (технические детали)

В первой версии JavaScript движок хранил значения как 32-битные числа. Младшие 3 бита использовались как тэг типа:

```
000 — object
001 — integer
010 — double
100 — string
110 — boolean
```

Специальные значения:
- `undefined`: целочисленное `-2^30` (выход за диапазон int)
- `null`: нулевой машинный указатель `0x00000000`

При проверке `typeof null`, движок читал тэг `000` (нулевые биты) и возвращал `"object"`. Это была ошибка с первого дня.

В 2012 году была предложена и принята к TC39 правка, исправляющая `typeof null` на `"null"`, но она была отклонена после того, как оказалось, что это сломает миллионы строк существующего кода в интернете.

### Практика и применение

Поскольку `typeof null === "object"`, проверка на null требует строгого сравнения:

```javascript
// Неправильно — также поймает объекты!
if (typeof value === "object") { /* ??? */ }

// Правильно — явная проверка на null
if (value === null) { /* это null */ }

// Правильно — проверка на объект, исключая null
if (typeof value === "object" && value !== null) { /* объект */ }

// Или через instanceof
if (value instanceof Object) { /* объект, не null */ }
```

### Важные нюансы и краеугольные камни

- Технически `null` является примитивом — у него нет свойств, нет прототипа, нет методов.
- `null instanceof Object` → `false` — `instanceof` работает корректно.
- В TypeScript `null` и `object` — разные типы при `strictNullChecks: true`.
- Баг не будет исправлен — слишком много кода в prod полагается на `typeof null === "object"`.

### Примеры

```javascript
// Демонстрация бага
console.log(typeof null);       // "object" ← баг
console.log(typeof undefined);  // "undefined"
console.log(typeof {});         // "object"
console.log(typeof []);         // "object"

// null НЕ является экземпляром Object
console.log(null instanceof Object); // false — правильно

// Надёжная проверка типа
function getType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

getType(null);    // "null"
getType([]);      // "array"
getType({});      // "object"
getType(42);      // "number"
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как правильно проверить, что значение — это объект, не `null`?** — `typeof x === "object" && x !== null`.
- **Почему этот баг не исправили?** — Нарушит обратную совместимость: весь интернет использует `typeof x === "object"` проверки.
- **Как отличить `null` от объекта через `Object.prototype.toString`?** — `Object.prototype.toString.call(null)` → `"[object Null]"`.

### Красные флаги (чего не говорить)

- «`null` — это объект» — `null` является примитивом; `typeof` просто содержит баг.
- «`typeof null === "null"`» — нет, `"object"`.
- «Можно использовать `typeof value === "object"` для безопасной проверки на объект» — нужно также проверить `!== null`.

### Связанные темы

- `001-tipy-dannyh-v-javascript.md`
- `006-raznica-mezhdu-null-i-undefined.md`
- `052-raznica-mezhdu-typeof-i-instanceof.md`
