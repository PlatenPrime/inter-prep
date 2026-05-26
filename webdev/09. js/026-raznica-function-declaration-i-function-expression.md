# Q026. Разница между function declaration и function expression?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Function declaration** (`function foo() {}`) — инструкция, полностью поднимается (hoisting) и доступна во всём scope. **Function expression** (`const foo = function() {}` или `const foo = () => {}`) — выражение, присваиваемое переменной; не поднимается (или поднимается только переменная как `var` — без тела). Стрелочные функции — частный случай function expression с дополнительными отличиями: нет `this`, `arguments`, не могут быть конструкторами.

---

## Развёрнутый ответ

### Синтаксис

```javascript
// Function Declaration (инструкция)
function greet(name) {
  return `Hello, ${name}`;
}

// Function Expression (выражение)
const greet = function(name) {
  return `Hello, ${name}`;
};

// Named Function Expression
const greet = function greetFn(name) {
  return `Hello, ${name}`;
};

// Arrow Function Expression (ES6)
const greet = (name) => `Hello, ${name}`;
```

### Ключевые различия

**1. Hoisting:**
```javascript
// Function Declaration — поднимается целиком
sayHello(); // "Hello!" — работает ДО объявления

function sayHello() { console.log("Hello!"); }

// Function Expression — поднимается только var (undefined)
sayBye(); // TypeError: sayBye is not a function

var sayBye = function() { console.log("Bye!"); };
```

**2. `this` в стрелочных функциях:**
```javascript
const obj = {
  name: 'Alice',

  // Function Expression — собственный this
  greetRegular: function() {
    console.log(this.name); // 'Alice'
  },

  // Arrow — this берётся из внешнего scope (лексический)
  greetArrow: () => {
    console.log(this.name); // undefined (this = внешний, не obj)
  },
};
```

**3. `arguments` объект:**
```javascript
function regular() {
  console.log(arguments); // [1, 2, 3]
}
regular(1, 2, 3);

const arrow = () => {
  console.log(arguments); // ReferenceError в strict/module; window.arguments в sloppy
};
```

**4. `new` (конструктор):**
```javascript
function Constructor() { this.x = 1; }
new Constructor(); // OK

const ArrowConstructor = () => {};
new ArrowConstructor(); // TypeError: ArrowConstructor is not a constructor
```

**5. `prototype`:**
- Function Declaration/Expression — имеет `prototype`.
- Arrow — нет `prototype`.

### Практика и применение

- **Function Declaration** — для основных именованных функций модуля; хорошо видна в stack trace.
- **Arrow functions** — для коллбэков, методов где нужен лексический `this` (React event handlers, методы класса).
- **Named Function Expression** — полезна для рекурсии внутри expression и читаемых stack traces.

### Важные нюансы и краеугольные камни

- **Named Function Expression**: имя функции видно только **внутри** тела функции (не снаружи) — полезно для рекурсии.
- В React стрелочные обработчики внутри JSX создаются заново при каждом ре-рендере — используйте `useCallback` для мемоизации.
- Arrow функции нельзя использовать как методы объекта, если нужен `this` объекта.

### Примеры

```javascript
// Named Function Expression для рекурсии
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1); // fact видно внутри
};
factorial(5); // 120

// Стрелочные в классе — лексический this
class Button {
  constructor(label) {
    this.label = label;
  }

  // Стрелочная привязывает this к экземпляру класса
  handleClick = () => {
    console.log(this.label); // всегда правильный this
  };
}
```

---

## Сравнение

| Критерий | Function Declaration | Function Expression | Arrow Function |
|----------|----------------------|---------------------|----------------|
| Синтаксис | `function foo() {}` | `const foo = function() {}` | `const foo = () => {}` |
| Hoisting | Целиком | Только переменная | Только переменная |
| `this` | Динамический | Динамический | Лексический |
| `arguments` | Есть | Есть | Нет |
| `new` / конструктор | Да | Да | Нет |
| `prototype` | Есть | Есть | Нет |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда использовать стрелочную, а когда обычную функцию?** — Стрелочная: коллбэки, методы с нужным `this`; обычная: конструкторы, генераторы, методы объекта где нужен `this` объекта.
- **Почему стрелочную нельзя использовать как метод объекта?** — Нет собственного `this`, берёт из внешнего scope (обычно глобального или undefined в strict).
- **Что такое Named Function Expression?** — `const f = function name() {}` — имя `name` видно только внутри тела.

### Красные флаги (чего не говорить)

- «Стрелочные функции всегда лучше обычных» — не для конструкторов, генераторов, методов объекта.
- «Function Expression поднимается полностью как declaration» — нет, поднимается только переменная.

### Связанные темы

- `022-chto-takoe-podnyatie-hoisting.md`
- `027-chto-takoe-iife.md`
- `033-chto-oboznachaet-this-v-javascript.md`
