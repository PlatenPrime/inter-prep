# Q033. Что обозначает `this` в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`this` — ключевое слово, ссылающееся на **контекст вызова** функции: объект, «владеющий» текущим вызовом. Значение `this` определяется **динамически** в момент вызова (не объявления) для обычных функций. Исключение — стрелочные функции: у них нет собственного `this`, они захватывают `this` из **лексического** (статического) контекста при объявлении.

---

## Развёрнутый ответ

### Суть и определение

Значение `this` зависит от **способа вызова** функции:

| Способ вызова | `this` |
|---------------|--------|
| Глобальный контекст (non-strict) | `globalThis` (`window` в браузере) |
| Глобальный контекст (strict) | `undefined` |
| Метод объекта `obj.fn()` | `obj` |
| Конструктор `new Fn()` | Новый экземпляр |
| `fn.call(ctx, ...args)` | `ctx` |
| `fn.apply(ctx, args)` | `ctx` |
| `fn.bind(ctx)()` | `ctx` (зафиксирован) |
| Стрелочная функция | `this` из внешнего scope (лексический) |
| Обработчик DOM-события | DOM-элемент (если не стрелочная) |

### Как это работает

```javascript
const obj = {
  name: 'Alice',

  // Метод — this = obj
  greet() {
    console.log(this.name); // 'Alice'
  },

  // Стрелочная — this из внешнего scope (здесь — модуля/window)
  greetArrow: () => {
    console.log(this?.name); // undefined (this = внешний)
  },
};

obj.greet();      // 'Alice'
obj.greetArrow(); // undefined

// Потеря контекста
const fn = obj.greet;
fn(); // undefined в strict / window.name в sloppy
```

**`new` создаёт новый `this`:**
```javascript
function User(name) {
  this.name = name; // this = новый объект
}
const alice = new User('Alice');
alice.name; // 'Alice'
```

### Практика и применение

```javascript
// Проблема потери this в callback
class Timer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    // Решение 1: стрелочная функция (лексический this)
    setInterval(() => {
      this.seconds++; // this = Timer instance
    }, 1000);

    // Решение 2: bind
    setInterval(function() {
      this.seconds++;
    }.bind(this), 1000);

    // Решение 3: сохранить в переменную (устарело)
    const self = this;
    setInterval(function() {
      self.seconds++;
    }, 1000);
  }
}
```

### Важные нюансы и краеугольные камни

- **`this` определяется при вызове** для обычных функций, а не при объявлении.
- `bind` создаёт новую функцию с **постоянно** зафиксированным `this` — повторный `bind`/`call`/`apply` не переопределяет.
- В **strict mode** `this` в обычной функции без контекста — `undefined`, а не `globalThis`.
- `class` методы всегда в strict mode — `this === undefined` при потере контекста.
- При использовании `class` с публичными полями-стрелочными функциями (`handleClick = () => {}`) `this` привязывается к инстансу в конструкторе.

### Примеры

```javascript
// call/apply/bind
function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}

const user = { name: 'Bob' };

greet.call(user, 'Hello', '!');    // "Hello, Bob!"
greet.apply(user, ['Hi', '.']);    // "Hi, Bob."
const boundGreet = greet.bind(user, 'Hey');
boundGreet('?');                   // "Hey, Bob?"

// Стрелочные в классах — решение проблемы this
class Button {
  label = 'Click me';

  // Стрелочное публичное поле — this всегда = инстанс
  handleClick = () => {
    console.log(this.label);
  };
}

const btn = new Button();
document.addEventListener('click', btn.handleClick); // 'Click me' — всегда правильный this
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Можно ли изменить `this` у стрелочной функции через `bind`?** — Нет, стрелочная не имеет собственного `this`; `bind` создаст функцию, но `this` не изменится.
- **Что происходит с `this` при деструктуризации метода?** — Потеря контекста: `const { greet } = obj; greet()` → `this` не `obj`.
- **В чём разница `call` vs `apply`?** — `call`: аргументы через запятую; `apply`: аргументы массивом.

### Красные флаги (чего не говорить)

- «`this` — это всегда объект, вызвавший функцию» — в глобальном контексте это `globalThis`, в strict mode — `undefined`.
- «Стрелочные функции привязывают `this` к методу» — они берут `this` из лексического scope, где были объявлены.

### Связанные темы

- `034-raznica-mezhdu-call-apply-i-bind.md`
- `026-raznica-function-declaration-i-function-expression.md`
- `035-chto-takoe-zamykanie-closure.md`
