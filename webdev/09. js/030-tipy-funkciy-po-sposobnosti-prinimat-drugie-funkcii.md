# Q030. Типы функций по способности принимать другие функции?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

По отношению к функциям как аргументам/возвращаемым значениям выделяют: **callback** (функция, передаваемая как аргумент), **higher-order function** (принимает и/или возвращает функцию), **first-class function** (функция как значение — базовое свойство JS). Дополнительно: **pure function** (без побочных эффектов), **closure** (захватывает внешний scope), **curried function** (принимает аргументы по одному).

---

## Развёрнутый ответ

### Классификация

**1. Callback-функция:**
Функция, передаваемая другой функции для последующего вызова.

```javascript
function executeWith(value, callback) {
  return callback(value);
}
executeWith(5, x => x * 2); // 10
```

**2. Higher-Order Function (HOF):**
Принимает функцию как аргумент и/или возвращает функцию.

```javascript
// Принимает функцию
[1, 2, 3].map(x => x + 1);

// Возвращает функцию
function multiplier(factor) {
  return x => x * factor;
}
const triple = multiplier(3);
```

**3. Pure Function:**
Нет побочных эффектов; одинаковые аргументы → всегда одинаковый результат.

```javascript
// Pure
const add = (a, b) => a + b;

// Impure (зависит от внешнего состояния)
let counter = 0;
const impure = () => ++counter;
```

**4. Closure:**
Функция, захватывающая переменные из внешнего lexical scope.

```javascript
function makeCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    get: () => count,
  };
}
```

**5. Curried Function:**
Функция, принимающая аргументы по одному (или по группам), возвращая новую функцию после каждого шага.

```javascript
const curry = (a) => (b) => (c) => a + b + c;
curry(1)(2)(3); // 6
```

**6. Partial Application:**
Функция с заранее зафиксированными частью аргументов.

```javascript
const add = (a, b) => a + b;
const add5 = add.bind(null, 5); // a=5 зафиксирован
add5(3); // 8
```

**7. Thunk:**
Функция без аргументов, откладывающая вычисление.

```javascript
const lazyValue = () => expensiveComputation();
// Вычисляется только при вызове lazyValue()
```

### Практика и применение

```javascript
// Composition через HOF
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const processPrice = pipe(
  price => price * 1.2,    // добавить НДС
  price => Math.round(price * 100) / 100, // округлить
  price => `$${price}`     // форматировать
);

processPrice(9.99); // "$11.99"
```

### Важные нюансы и краеугольные камни

- Эти категории не взаимоисключающие: одна функция может быть одновременно pure, closure и HOF.
- **Referential transparency** (ссылочная прозрачность) — свойство pure function: можно заменить вызов его результатом без изменения поведения программы.
- Thunk используется в Redux Thunk middleware для асинхронных action creators.

### Примеры

```javascript
// Функция, которая является HOF + closure + возвращает pure function
function createValidator(schema) {        // HOF (принимает schema как данные)
  const rules = buildRules(schema);       // замыкание на rules

  return function validate(data) {        // чистая функция (нет side-effects)
    return rules.every(rule => rule(data));
  };
}

const validateUser = createValidator({
  name: { required: true, minLength: 2 },
  email: { required: true, pattern: /@/ }
});

validateUser({ name: 'Alice', email: 'alice@example.com' }); // true
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Разница между currying и partial application?** — Currying: аргументы по одному/группам последовательно; partial: часть аргументов фиксируется сразу через `bind` или обёртку.
- **Что такое thunk в контексте Redux?** — Функция, возвращаемая action creator, принимающая `dispatch` — откладывает dispatch до завершения async-операции.

### Красные флаги (чего не говорить)

- «Callback и HOF — одно и то же» — callback — это роль аргумента; HOF — характеристика функции, использующей callbacks.

### Связанные темы

- `029-chto-takoe-funkcii-vysshego-poryadka.md`
- `031-pochemu-funkcii-nazyvayut-obektami-pervogo-klassa.md`
- `036-chto-takoe-karrirovanie-currying.md`
- `032-chto-takoe-chistaya-funkciya.md`
