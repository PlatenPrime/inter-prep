# Q018. Что такое оператор логического присваивания?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

Операторы логического присваивания (ES2021) — три оператора `&&=`, `||=`, `??=` — комбинируют логические операторы с присваиванием. Они присваивают новое значение только при выполнении условия: `&&=` — если текущее значение truthy, `||=` — если falsy, `??=` — если nullish (`null`/`undefined`). Благодаря короткому замыканию, правый операнд вычисляется только когда нужно.

---

## Развёрнутый ответ

### Суть и определение

Три оператора:

| Оператор | Эквивалент | Присваивает если... |
|----------|-----------|----------------------|
| `a \|\|= b` | `a \|\| (a = b)` | `a` — falsy |
| `a &&= b` | `a && (a = b)` | `a` — truthy |
| `a ??= b` | `a ?? (a = b)` | `a` — nullish |

Важно: это **не** `a = a || b`. Разница в том, что присваивание происходит только при необходимости (ленивое присваивание).

### Как это работает

```javascript
// ||= : присваивает если a falsy
let a = 0;
a ||= 5;   // a = 5 (0 falsy)

let b = 'hello';
b ||= 'world'; // b = 'hello' (truthy — не перезаписывает)

// &&= : присваивает если a truthy
let c = 1;
c &&= 10;  // c = 10 (1 truthy)

let d = 0;
d &&= 10;  // d = 0 (0 falsy — не присваивает)

// ??= : присваивает если a nullish
let e = null;
e ??= 'default'; // e = 'default'

let f = 0;
f ??= 'default'; // f = 0 (0 не nullish)
```

### Практика и применение

**`??=` — инициализация по умолчанию:**
```javascript
// Отложенная инициализация кеша
const cache = {};
function getCached(key, computeFn) {
  cache[key] ??= computeFn();
  return cache[key];
}
getCached('pi', () => Math.PI); // вычислит
getCached('pi', () => Math.PI); // вернёт из кеша, computeFn не вызовется

// Инициализация опциональных полей объекта
function ensureDefaults(user) {
  user.settings ??= {};
  user.settings.theme ??= 'light';
  user.settings.lang ??= 'en';
  return user;
}
```

**`||=` — fallback на falsy:**
```javascript
let title = '';
title ||= 'Untitled'; // '' falsy → 'Untitled'

// Нормализация пользовательского ввода
function normalizeUser(user) {
  user.role ||= 'guest';     // пустая строка или null → 'guest'
  user.avatar ||= '/default-avatar.png';
  return user;
}
```

**`&&=` — обновление если значение уже есть:**
```javascript
// Обновляем только если объект уже инициализирован
let component = null;
component &&= { ...component, updated: true }; // component остаётся null

component = { name: 'App' };
component &&= { ...component, updated: true }; // { name: 'App', updated: true }

// Добавить тег к существующей строке
let tag = 'important';
tag &&= `[${tag}]`; // '[important]'

tag = '';
tag &&= `[${tag}]`; // '' — пустая строка не оборачивается
```

### Важные нюансы и краеугольные камни

- **Ленивое присваивание**: `a ||= b` при truthy `a` НЕ выполняет `a = a` — нет лишнего сеттера. Это важно при работе с setter-ами в объектах (Observable, Proxy).
- **Отличие от `a = a || b`**:
  ```javascript
  const obj = { get x() { return 1; }, set x(v) { /* called */ } };
  obj.x ||= 2;    // setter НЕ вызывается (1 truthy)
  obj.x = obj.x || 2; // setter ВЫЗЫВАЕТСЯ (явное присваивание)
  ```
- **Приоритет**: операторы правоассоциативны, как и обычное `=`.
- **Цепочки**: можно использовать в цепочке, но читаемость падает.

### Примеры

```javascript
// Аккумулятор с ??=
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key);
    // короче с ??= не получится — Map.get возвращает undefined при отсутствии
  };
}

// Инициализация вложенных опций
const options = {};
options.server ??= {};
options.server.host ??= 'localhost';
options.server.port ??= 3000;
// { server: { host: 'localhost', port: 3000 } }

// ||= для аккумуляции ошибок
const errors = {};
function addError(field, message) {
  errors[field] ||= [];
  errors[field].push(message);
}
addError('email', 'Required');
addError('email', 'Invalid format');
// errors = { email: ['Required', 'Invalid format'] }

// &&= для трансформации если значение есть
let multiplier = 0;
multiplier &&= multiplier * 2; // 0 — не трансформируется

multiplier = 3;
multiplier &&= multiplier * 2; // 6
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `a ||= b` ≠ `a = a || b`?** — При truthy `a`: второй вариант всегда вызывает setter; первый — нет (ленивое присваивание).
- **Когда `??=` предпочтительнее `||=`?** — Когда `0`, `false`, `''` — валидные значения, которые не должны перезаписываться.
- **Что выведет: `let x = 0; x &&= 5; console.log(x)`?** — `0` (x falsy, присваивание не происходит).

### Красные флаги (чего не говорить)

- «`a ||= b` — то же что `a = a || b`» — не то же: разница в вызове setter-а при truthy `a`.
- «Эти операторы появились в ES6» — нет, в ES2021.

### Связанные темы

- [`015-chto-takoe-operator-nulevogo-sliyaniya.md`](015-chto-takoe-operator-nulevogo-sliyaniya.md)
- [`016-otlichie-operatora-nulevogo-sliyaniya-i-operatora-ili.md`](016-otlichie-operatora-nulevogo-sliyaniya-i-operatora-ili.md)
- [`038-novovvedeniya-ecmascript-2021-es12.md`](038-novovvedeniya-ecmascript-2021-es12.md)
