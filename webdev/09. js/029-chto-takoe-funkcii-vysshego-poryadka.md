# Q029. Что такое функции высшего порядка (Higher Order Functions)?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Функция высшего порядка (Higher Order Function, HOF)** — функция, которая принимает одну или несколько функций в качестве аргументов **и/или** возвращает функцию в качестве результата. Это ключевая концепция функционального программирования, широко используемая в JS через `map`, `filter`, `reduce`, `setTimeout`, `addEventListener` и паттерны декораторов.

---

## Развёрнутый ответ

### Суть и определение

HOF возможны в JS благодаря тому, что функции — **объекты первого класса**: их можно хранить в переменных, передавать как аргументы, возвращать из других функций.

Два вида HOF:
1. **Принимает функцию** — callback-based: `arr.map(fn)`, `setTimeout(fn, 1000)`.
2. **Возвращает функцию** — factory/decorator: `createMultiplier(3)` → `fn`.

### Как это работает

```javascript
// 1. Принимает функцию
function applyTwice(fn, value) {
  return fn(fn(value));
}
applyTwice(x => x + 1, 5); // 7 (5+1+1)
applyTwice(x => x * 2, 3); // 12 (3*2*2)

// 2. Возвращает функцию
function createMultiplier(factor) {
  return (number) => number * factor; // замыкание на factor
}
const double = createMultiplier(2);
const triple = createMultiplier(3);

double(5); // 10
triple(5); // 15

// 3. И принимает, и возвращает
function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}
const transform = compose(
  x => x + 1,
  x => x * 2,
  x => x - 3
);
transform(10); // (10-3)*2+1 = 15
```

### Встроенные HOF в JavaScript

```javascript
const numbers = [1, 2, 3, 4, 5];

// map — принимает функцию-трансформацию
numbers.map(x => x ** 2);          // [1, 4, 9, 16, 25]

// filter — принимает предикат
numbers.filter(x => x % 2 === 0);  // [2, 4]

// reduce — принимает функцию-аккумулятор
numbers.reduce((acc, x) => acc + x, 0); // 15

// forEach — принимает функцию-эффект
numbers.forEach(x => console.log(x));

// sort — принимает функцию-компаратор
[...numbers].sort((a, b) => b - a); // [5, 4, 3, 2, 1]
```

### Практика и применение

- **Переиспользование логики:** вместо дублирования пишем одну HOF и передаём разные стратегии.
- **Декораторы:** логирование, кэширование, rate-limiting через обёртывание функций.
- **React HOC:** компоненты высшего порядка (`withAuth(Component)`) — HOF концепция применённая к компонентам.
- **Middleware (Express, Redux):** цепочка функций-обработчиков.

### Важные нюансы и краеугольные камни

- HOF в горячих путях могут создавать избыточные замыкания — в критичных циклах стоит учитывать.
- `Array.prototype.map` vs `forEach`: `map` возвращает новый массив (HOF с трансформацией), `forEach` — всегда `undefined` (HOF для эффектов).
- Функциональная композиция (compose/pipe) — мощный паттерн, но без TypeScript сложно типизировать.

### Примеры

```javascript
// Декоратор логирования (HOF)
function withLogging(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name} with`, args);
    const result = fn(...args);
    console.log(`${fn.name} returned`, result);
    return result;
  };
}

function add(a, b) { return a + b; }
const loggedAdd = withLogging(add);

loggedAdd(2, 3);
// Calling add with [2, 3]
// add returned 5

// Кэширующий декоратор (мемоизация)
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const memoFib = memoize(function fib(n) {
  return n <= 1 ? n : memoFib(n - 1) + memoFib(n - 2);
});
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое функции первого класса?** — Функции могут быть значениями переменных, аргументами и возвращаемыми значениями — это основа HOF.
- **Разница между HOF и callback?** — Callback — аргумент-функция; HOF — функция, принимающая callback и/или возвращающая функцию.
- **Что такое функциональная композиция?** — Объединение функций: результат одной — вход другой: `compose(f, g)(x) = f(g(x))`.

### Красные флаги (чего не говорить)

- «HOF — это только `map`, `filter`, `reduce`» — концепция шире; любая функция, принимающая/возвращающая функцию.
- «HOF работают медленно» — в реальных приложениях это не bottleneck; оптимизация нужна только в hot paths.

### Связанные темы

- `031-pochemu-funkcii-nazyvayut-obektami-pervogo-klassa.md`
- `030-tipy-funkciy-po-sposobnosti-prinimat-drugie-funkcii.md`
- `035-chto-takoe-zamykanie-closure.md`
- `037-chto-takoe-memoizaciya-realizuyte-bazvuyu-logiku.md`
