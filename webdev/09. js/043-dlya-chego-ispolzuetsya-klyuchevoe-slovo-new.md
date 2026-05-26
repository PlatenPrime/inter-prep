# Q043. Для чего используется ключевое слово `new`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`new` создаёт новый экземпляр объекта на основе функции-конструктора или класса: 1) создаёт пустой объект, 2) устанавливает его прототип на `Constructor.prototype`, 3) вызывает функцию с `this = новый объект`, 4) возвращает объект (или явно возвращённый конструктором объект). Без `new` конструктор выполнится как обычная функция — `this` укажет на globalThis.

---

## Развёрнутый ответ

### Что делает `new` (4 шага)

```javascript
function User(name) {
  this.name = name;
  this.type = 'user';
}

const alice = new User('Alice');
```

Эквивалент вручную:
```javascript
// 1. Создать пустой объект
const obj = {};

// 2. Установить прототип
Object.setPrototypeOf(obj, User.prototype);

// 3. Выполнить конструктор с this = obj
User.call(obj, 'Alice');

// 4. Вернуть obj (если конструктор не вернул другой объект)
const alice = obj;
```

### Как это работает

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return `${this.name} makes a sound.`;
};

const dog = new Animal('Rex');
dog.speak();                // "Rex makes a sound."
dog instanceof Animal;      // true
dog.__proto__ === Animal.prototype; // true
```

**Что если конструктор возвращает объект:**
```javascript
function Tricky() {
  this.x = 1;
  return { x: 999 }; // явный возврат объекта
}
const t = new Tricky();
t.x; // 999 — вернулся явно возвращённый объект

function TrickyPrim() {
  this.x = 1;
  return 42; // примитив игнорируется
}
const t2 = new TrickyPrim();
t2.x; // 1 — примитив игнорируется, возвращается this
```

### Без `new` — ловушка

```javascript
// Без new в sloppy mode: this = globalThis
function User(name) {
  this.name = name; // window.name = 'Alice' — загрязнение глобального!
}
const u = User('Alice'); // undefined — функция не возвращает ничего
console.log(window.name); // 'Alice' — глобальная переменная!

// В strict mode: this = undefined → TypeError
'use strict';
function SafeUser(name) {
  this.name = name; // TypeError: Cannot set properties of undefined
}
SafeUser('Alice');
```

### Практика и применение

- **`class`** — современный способ; `new ClassName()` обязателен.
- **Встроенные конструкторы:** `new Date()`, `new Map()`, `new Set()`, `new Promise()`, `new Error()`.
- **Паттерн защиты:** можно проверить `this instanceof Constructor` внутри для защиты от вызова без `new`.

```javascript
function SafeConstructor(value) {
  if (!(this instanceof SafeConstructor)) {
    return new SafeConstructor(value); // автоматически добавляем new
  }
  this.value = value;
}
const a = SafeConstructor(42);  // работает и так
const b = new SafeConstructor(42); // и так
```

### Важные нюансы и краеугольные камни

- Стрелочные функции **нельзя** вызвать через `new` — `TypeError: is not a constructor`.
- `new Array(3)` создаёт массив из 3 пустых слотов — не то же самое, что `[3]`.
- `new` без скобок: `new Constructor` (без аргументов) — то же самое, что `new Constructor()`.
- `new.target` внутри конструктора — ссылка на функцию/класс, через которую вызван `new`; если `undefined` — вызов без `new`.

### Примеры

```javascript
// new.target для определения контекста вызова
function Foo() {
  if (!new.target) throw new Error('Foo must be called with new');
  this.x = 1;
}

// Кастомная реализация new
function myNew(Constructor, ...args) {
  const instance = Object.create(Constructor.prototype);
  const result = Constructor.apply(instance, args);
  return (typeof result === 'object' && result !== null) ? result : instance;
}

function Point(x, y) { this.x = x; this.y = y; }
const p = myNew(Point, 3, 4);
p instanceof Point; // true
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Опишите 4 шага `new`** — Объект, прототип, конструктор с this, возврат.
- **Что если конструктор вернёт объект?** — `new` вернёт этот объект вместо `this`.
- **Что такое `new.target`?** — Специальное свойство, указывающее на вызванный конструктор; `undefined` при вызове без `new`.

### Красные флаги (чего не говорить)

- «`new` просто вызывает функцию» — `new` также создаёт объект и устанавливает прототип.
- «Стрелочные функции можно вызвать через `new`» — `TypeError`.

### Связанные темы

- `042-kak-sozdat-obekt-v-javascript.md`
- `045-chto-takoe-prototip-obiekta.md`
- `046-chto-takoe-prototipnoe-nasledovanie.md`
