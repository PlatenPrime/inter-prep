# Q064. Разница между `.some()` и `.every()`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`.some()` возвращает `true`, если **хотя бы один** элемент удовлетворяет предикату (останавливается на первом совпадении). `.every()` возвращает `true`, если **все** элементы удовлетворяют предикату (останавливается на первом несовпадении). Оба — «ленивые»: прекращают итерацию как только результат определён.

---

## Развёрнутый ответ

### Синтаксис и поведение

```javascript
const numbers = [1, 2, 3, 4, 5];

// some — ∃x: predicate(x) = true
numbers.some(x => x > 4);   // true (5 > 4)
numbers.some(x => x > 10);  // false — ни один не > 10

// every — ∀x: predicate(x) = true
numbers.every(x => x > 0);  // true — все > 0
numbers.every(x => x > 2);  // false — 1, 2 не > 2
```

### Short-circuit (ленивость)

```javascript
// some — останавливается на первом true
let count = 0;
[1, 2, 3, 4, 5].some(x => {
  count++;
  return x === 3; // останавливается на index 2
});
console.log(count); // 3 — проверено только 3 элемента

// every — останавливается на первом false
count = 0;
[1, 2, 3, 4, 5].every(x => {
  count++;
  return x < 3; // останавливается на x=3
});
console.log(count); // 3
```

### Граничные случаи (empty array)

```javascript
// Математическая конвенция:
[].some(() => false);  // false — нет элементов, нет совпадений
[].every(() => false); // true  — «vacuous truth» (у пустого множества все элементы удовлетворяют)
```

`every` на пустом массиве — `true` по математическому соглашению «всеобщей квантификации над пустым множеством».

### Практика и применение

```javascript
// Проверка формы
const formFields = [
  { name: 'email', valid: true },
  { name: 'password', valid: false },
];

const hasAnyError = formFields.some(f => !f.valid);    // true
const allValid = formFields.every(f => f.valid);        // false

// Проверка прав доступа
const requiredRoles = ['admin', 'editor'];
const userRoles = ['viewer', 'editor'];

const hasAny = requiredRoles.some(r => userRoles.includes(r));  // true
const hasAll = requiredRoles.every(r => userRoles.includes(r)); // false

// Валидация числовых данных
const prices = [10, 25, 5, 40];
const hasNegative = prices.some(p => p < 0);  // false — OK
const allPositive = prices.every(p => p > 0); // true — OK
```

### Важные нюансы и краеугольные камни

- Оба метода принимают 3 аргумента в колбэк: `(element, index, array)`.
- Не мутируют массив.
- Нельзя прервать через `break` — они и так останавливаются при определении результата.
- В отличие от `filter`, не создают новый массив.

### Примеры

```javascript
// Проверка загрузки данных
const pages = [
  { id: 1, loaded: true },
  { id: 2, loaded: true },
  { id: 3, loaded: false },
];

const isLoading = pages.some(p => !p.loaded);   // true — есть незагруженные
const allLoaded = pages.every(p => p.loaded);    // false — не все загружены

// Поиск нарушений в массиве транзакций
const transactions = [100, -50, 200, -10, 50];
const hasRefund = transactions.some(t => t < 0);    // true
const allCredits = transactions.every(t => t > 0);  // false
```

---

## Сравнение

| Критерий | `.some()` | `.every()` |
|----------|-----------|------------|
| Условие | Хотя бы один | Все |
| Short-circuit при | Первом `true` | Первом `false` |
| Пустой массив | `false` | `true` |
| Аналог в логике | ∃ (существует) | ∀ (для всех) |
| Аналог в булевой логике | `OR` (any) | `AND` (all) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `[].every(fn)` возвращает `true`?** — Математическая аксиома: у пустого множества все (ноль) элементы удовлетворяют любому условию («vacuous truth»).
- **Как `some`/`every` связаны с логическим `||` и `&&`?** — `some` = цепочка `||`; `every` = цепочка `&&`.

### Красные флаги (чего не говорить)

- «`[].every(fn)` вернёт `false`» — нет, `true` (vacuous truth).

### Связанные темы

- `062-metody-massivov-v-javascript.md`
- `063-raznica-mezhdu-foreach-i-map.md`
- `066-kak-rabotayut-find-findindex-i-indexof.md`
