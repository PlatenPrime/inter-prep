# Q036. Что такое каррирование (currying)?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Каррирование (currying)** — техника преобразования функции с несколькими аргументами в последовательность функций, каждая из которых принимает **один** аргумент (или группу аргументов). `f(a, b, c)` превращается в `f(a)(b)(c)`. Используется для создания специализированных функций и функциональных pipeline.

---

## Развёрнутый ответ

### Суть и определение

Каррированная функция принимает аргументы не все сразу, а **по одному** (или группами). Каждый промежуточный вызов возвращает новую функцию, ожидающую следующий аргумент, пока не будут получены все — тогда вычисляется результат.

### Как это работает

```javascript
// Обычная функция
function add(a, b, c) { return a + b + c; }
add(1, 2, 3); // 6

// Каррированная версия
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}
curriedAdd(1)(2)(3); // 6

// ES6 стрелочная запись
const curriedAdd = a => b => c => a + b + c;
curriedAdd(1)(2)(3); // 6
```

### Универсальная функция curry

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return function(...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  };
}

const add = curry((a, b, c) => a + b + c);
add(1)(2)(3);   // 6
add(1, 2)(3);   // 6
add(1)(2, 3);   // 6
add(1, 2, 3);   // 6 — все аргументы сразу тоже работают
```

### Практика и применение

**1. Переиспользование через специализацию:**
```javascript
const multiply = curry((a, b) => a * b);
const double = multiply(2);   // специализированная функция
const triple = multiply(3);

[1, 2, 3, 4].map(double); // [2, 4, 6, 8]
[1, 2, 3, 4].map(triple); // [3, 6, 9, 12]
```

**2. Функциональные pipeline (pipe/compose):**
```javascript
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const processUser = pipe(
  curry(pick)(['name', 'email']),     // выбрать поля
  curry(validate)(userSchema),         // валидировать
  curry(transform)(normalizeEmail),    // трансформировать
);
```

**3. Частичная передача данных:**
```javascript
const log = curry((level, message) => console.log(`[${level}] ${message}`));
const info = log('INFO');
const error = log('ERROR');

info('Server started');
error('Connection failed');
```

### Каррирование vs Partial Application

- **Currying:** `f(a, b, c)` → `f(a)(b)(c)` — строго по одному.
- **Partial Application:** фиксация любого числа аргументов: `f.bind(null, a)` → `f(b, c)`.

```javascript
// Partial application через bind
const add5 = add.bind(null, 5); // a=5 зафиксировано, нужно b и c
add5(3, 2); // 10 — это не currying
```

### Важные нюансы и краеугольные камни

- `fn.length` — количество ожидаемых параметров: используется универсальным `curry` для определения полноты аргументов. Rest-параметры (`...args`) дают `length = 0`.
- Каррирование делает код более модульным, но может усложнить читаемость.
- Популярно в функциональных библиотеках: Ramda, Lodash/fp — все функции каррированы и имеют data-last сигнатуру.

### Примеры

```javascript
// Утилиты в стиле Ramda
const filter = curry((predicate, list) => list.filter(predicate));
const map = curry((fn, list) => list.map(fn));
const prop = curry((key, obj) => obj[key]);

const getActiveUsers = filter(user => user.active);
const getUserNames = map(prop('name'));

const pipeline = pipe(getActiveUsers, getUserNames);
const users = [
  { name: 'Alice', active: true },
  { name: 'Bob', active: false },
  { name: 'Carol', active: true },
];
pipeline(users); // ['Alice', 'Carol']
```

---

## Сравнение

| Критерий | Currying | Partial Application |
|----------|----------|---------------------|
| Аргументы | По одному (строго) | Любое количество зафиксировано |
| Механизм | Последовательные вызовы | `bind` / обёртка |
| Гибкость | Жёсткая структура | Более свободная |
| Пример | `f(a)(b)(c)` | `f.bind(null, a)` → `g(b, c)` |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как реализовать `curry` для функций с переменным числом аргументов?** — Сложно через `fn.length`, нужен сигнал о завершении (например, пустой вызов `fn()` или явная арность).
- **Чем currying отличается от partial application?** — Currying — по одному; partial — любое количество зафиксировано сразу.
- **В чём практическая польза data-last сигнатуры?** — Позволяет использовать как `map(fn)` без передачи коллекции — удобно в pipe/compose.

### Красные флаги (чего не говорить)

- «Currying и partial application — одно и то же» — принципиально разные паттерны.
- «Currying работает только в функциональных языках» — в JS реализуется легко.

### Связанные темы

- `034-raznica-mezhdu-call-apply-i-bind.md`
- `029-chto-takoe-funkcii-vysshego-poryadka.md`
- `030-tipy-funkciy-po-sposobnosti-prinimat-drugie-funkcii.md`
