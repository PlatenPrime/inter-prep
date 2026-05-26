# Q031. Почему в JS функции называют объектами первого класса?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Функции в JavaScript являются **объектами первого класса (first-class objects/citizens)**: они могут быть присвоены переменным, переданы как аргументы, возвращены из других функций и хранятся в структурах данных (массивах, объектах) — точно так же, как любые другие значения. Это фундаментальное свойство, делающее возможными функции высшего порядка, замыкания и функциональные паттерны.

---

## Развёрнутый ответ

### Суть и определение

«Первый класс» означает, что сущность обладает теми же правами, что и любое другое значение языка. Функции в JS:

1. Можно присвоить переменной.
2. Можно передать как аргумент.
3. Можно вернуть из функции.
4. Можно хранить в структурах данных.
5. Можно создать анонимно (без имени).
6. Имеют свойства и методы (это объекты!).

### Как это работает

```javascript
// 1. Присваивание переменной
const greet = function(name) { return `Hello, ${name}`; };

// 2. Передача как аргумент
function executeWith(value, fn) {
  return fn(value);
}
executeWith('Alice', greet); // "Hello, Alice"

// 3. Возврат из функции
function createAdder(x) {
  return function(y) { return x + y; };
}
const add5 = createAdder(5);
add5(3); // 8

// 4. Хранение в структурах данных
const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};
const pipeline = [
  x => x * 2,
  x => x + 1,
  x => x ** 2,
];

// 5. Функции — объекты (имеют свойства)
function sayHello() { console.log("Hello!"); }
sayHello.lang = 'en';         // добавляем свойство
sayHello.callCount = 0;
console.log(sayHello.name);   // "sayHello"
console.log(sayHello.length); // количество параметров: 0
```

### Практика и применение

First-class functions — основа для:
- **Функций высшего порядка** (`map`, `filter`, `reduce`, кастомные HOF).
- **Замыканий** — функции захватывают переменные из внешнего scope.
- **Паттернов функционального программирования** — compose, pipe, curry.
- **Callback-based API** — `addEventListener`, `setTimeout`, промисы.
- **Dependency injection** — передача реализации стратегии через аргумент.

### Важные нюансы и краеугольные камни

- `typeof function() {} === "function"` — специальный тип, но под капотом функция — объект (`function instanceof Object === true`).
- Функция имеет `prototype` (кроме стрелочных), `name`, `length` и может иметь кастомные свойства.
- Стрелочные функции — тоже first-class, но без `prototype`, `arguments`, собственного `this`.
- First-class functions vs first-class types: в TypeScript функции имеют типы, но концепция first-class остаётся той же.

### Примеры

```javascript
// Dependency injection через first-class functions
function createUserService(httpFetch) {
  return {
    async getUser(id) {
      return httpFetch(`/users/${id}`);
    }
  };
}

const service = createUserService(fetch);
const mockService = createUserService((url) => Promise.resolve({ id: 1, name: 'Mock' }));

// Event system с функциями как слушателями
class EventEmitter {
  #listeners = new Map();

  on(event, fn) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(fn);
  }

  emit(event, data) {
    this.#listeners.get(event)?.forEach(fn => fn(data));
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем first-class функции отличаются от HOF?** — First-class — свойство языка (функции как значения); HOF — паттерн использования этого свойства.
- **Является ли функция объектом?** — Да: `typeof f === "function"`, но `f instanceof Object === true`; функции — подтип Object.
- **Какие свойства есть у любой функции?** — `name`, `length`, `prototype` (кроме arrow), `call`, `apply`, `bind`.

### Красные флаги (чего не говорить)

- «First-class functions — это просто то, что функции можно передавать как аргументы» — это лишь одно из нескольких проявлений.
- «Стрелочные функции не являются first-class» — являются; просто с некоторыми ограничениями.

### Связанные темы

- `029-chto-takoe-funkcii-vysshego-poryadka.md`
- `035-chto-takoe-zamykanie-closure.md`
- `034-raznica-mezhdu-call-apply-i-bind.md`
