# Q032. Для чего используется метод `.includes()`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`Array.prototype.includes(value, fromIndex)` (ES2016) проверяет, содержит ли массив указанное значение, возвращая `boolean`. `String.prototype.includes(substr, position)` — то же для подстрок. Главное преимущество перед `indexOf` — корректная обработка `NaN` и читаемый семантический смысл: «содержит ли».

---

## Развёрнутый ответ

### Суть и определение

До ES2016 проверяли через `indexOf`:
```javascript
arr.indexOf(value) !== -1 // громоздко
```

`includes` — более выразительная и семантически правильная альтернатива.

**Array.includes(valueToFind, fromIndex):**
- `fromIndex` — стартовый индекс (по умолчанию 0); отрицательный считается с конца
- Использует алгоритм **SameValueZero** (как Set/Map): `NaN === NaN`

**String.includes(searchString, position):**
- `position` — начало поиска (по умолчанию 0)
- Чувствительно к регистру

### Как это работает

```javascript
// Array
[1, 2, 3].includes(2);      // true
[1, 2, 3].includes(4);      // false
[1, 2, NaN].includes(NaN);  // true ← главное отличие от indexOf

// indexOf не работает с NaN
[1, 2, NaN].indexOf(NaN);   // -1 ← NaN !== NaN

// fromIndex
[1, 2, 3, 2].includes(2, 2);  // true (ищет начиная с index 2)
[1, 2, 3, 2].includes(2, 3);  // true (index 3 = 2)
[1, 2, 3, 2].includes(2, -1); // true (последний элемент)
[1, 2, 3, 2].includes(2, -2); // true (предпоследний и далее)

// String
'Hello, World'.includes('World');     // true
'Hello, World'.includes('world');     // false — чувствительно к регистру
'Hello, World'.includes('World', 8);  // false — ищет с позиции 8
```

### Практика и применение

```javascript
// Проверка допустимых значений
const VALID_ROLES = ['admin', 'user', 'moderator'];
function isValidRole(role) {
  return VALID_ROLES.includes(role);
}

// Проверка нескольких условий
function isAllowed(user, resource) {
  return ['admin', 'superuser'].includes(user.role) ||
    resource.allowedUsers.includes(user.id);
}

// Фильтрация через includes
const blocklist = new Set(['spam@example.com', 'bot@example.com']);
const validEmails = emails.filter(email => !blocklist.has(email));
// или для массива blocklist:
const validEmails2 = emails.filter(email => !blocklist.includes(email));

// Строки: поиск подстроки
function containsKeyword(text, keywords) {
  return keywords.some(kw => text.toLowerCase().includes(kw.toLowerCase()));
}
```

### Важные нюансы и краеугольные камни

- **`NaN` — главное отличие от `indexOf`**: `includes` корректно находит `NaN`, `indexOf` — нет.
- **`undefined`**: `[1, , 3].includes(undefined)` → `true` — дыры в sparse array считаются `undefined`.
- **Только существование, не индекс**: нужен индекс — используйте `indexOf`/`findIndex`.
- **Объекты по ссылке**: `[{a:1}].includes({a:1})` → `false` (разные ссылки).
- **TypeScript**: `Array.prototype.includes` в TS требует, чтобы искаемый тип совпадал с типом элементов массива — это иногда требует явного cast.

### Примеры

```javascript
// NaN: includes vs indexOf
const data = [1, NaN, 3];
data.includes(NaN);      // true
data.indexOf(NaN) !== -1; // false — баг!

// Spread проверок
const HTTP_SUCCESS = [200, 201, 202, 204];
function isSuccess(status) {
  return HTTP_SUCCESS.includes(status);
}

// Conditional styling (React)
const activeStates = ['active', 'hover', 'focus'];
const className = activeStates.includes(currentState) ? 'highlighted' : '';

// String includes для валидации
function hasUnsafeChars(input) {
  const unsafe = ['<', '>', '"', "'", '&'];
  return unsafe.some(char => input.includes(char));
}

// fromIndex для поиска после позиции
function countOccurrences(str, sub) {
  let count = 0, pos = 0;
  while (str.includes(sub, pos)) {
    pos = str.indexOf(sub, pos) + 1;
    count++;
  }
  return count;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём преимущество `includes` перед `indexOf`?** — Возвращает `boolean`, обрабатывает `NaN`, семантически выразительнее.
- **Как `includes` обрабатывает `NaN`?** — SameValueZero: `NaN === NaN`, поэтому `[NaN].includes(NaN) === true`.
- **Что вернёт `[1,,3].includes(undefined)`?** — `true`: sparse array дыры считаются `undefined`.
- **Работает ли `includes` с объектами?** — Только по ссылке: `[{a:1}].includes({a:1})` → `false`.

### Красные флаги (чего не говорить)

- «`indexOf` лучше, потому что возвращает позицию» — для проверки наличия `includes` выразительнее и безопаснее (NaN).
- «`includes` глубоко сравнивает объекты» — нет, только по ссылке.
- «`includes` появился в ES6» — нет, в ES2016 (ES7).

### Связанные темы

- [`031-metody-flat-i-flatmap.md`](031-metody-flat-i-flatmap.md)
- [`034-metody-startswith-i-endswith.md`](034-metody-startswith-i-endswith.md)
