# Q042. Как в JavaScript создать объект?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

В JavaScript объект можно создать несколькими способами: **объектный литерал** `{}` (самый распространённый), **конструктор** `new Constructor()`, **`Object.create(proto)`** (с явным прототипом), **`class`** (ES6, синтаксический сахар над прототипами), **фабричная функция** (возвращает объект без `new`). Выбор зависит от нужного уровня инкапсуляции и переиспользования.

---

## Развёрнутый ответ

### 1. Объектный литерал

```javascript
const user = {
  name: 'Alice',
  age: 30,
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};
```
Прост, лаконичен, использует `Object.prototype` как прототип.

### 2. `new Object()` / `new Constructor()`

```javascript
// Через new Object() (избыточно, не рекомендуется)
const obj = new Object();
obj.name = 'Alice';

// Через пользовательский конструктор
function User(name, age) {
  this.name = name;
  this.age = age;
}
User.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};
const alice = new User('Alice', 30);
```

### 3. `Object.create()`

```javascript
const userProto = {
  greet() { return `Hello, I'm ${this.name}`; }
};

const alice = Object.create(userProto);
alice.name = 'Alice';
alice.age = 30;

// Объект без прототипа (чистый словарь)
const dict = Object.create(null);
dict.key = 'value'; // нет методов Object.prototype
```

### 4. `class` (ES6)

```javascript
class User {
  #password; // приватное поле

  constructor(name, password) {
    this.name = name;
    this.#password = password;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }

  checkPassword(input) {
    return input === this.#password;
  }
}

const alice = new User('Alice', 'secret');
```

### 5. Фабричная функция (Factory Function)

```javascript
function createUser(name, age) {
  // Приватные данные через замыкание
  let _loginCount = 0;

  return {
    name,
    age,
    login() { _loginCount++; },
    getLoginCount() { return _loginCount; },
  };
}

const alice = createUser('Alice', 30);
alice.login();
alice.getLoginCount(); // 1
alice._loginCount;     // undefined — приватно!
```

### Сравнение подходов

| Подход | Прототип | Приватность | Наследование | Производительность |
|--------|----------|-------------|--------------|-------------------|
| Литерал | `Object.prototype` | Нет | Нет | Лучшая |
| `new` + конструктор | Кастомный | Нет | Через `prototype` | Хорошая |
| `Object.create()` | Явный | Нет | Явная | Хорошая |
| `class` | Кастомный | `#private` (ES2022) | `extends` | Хорошая |
| Factory function | `Object.prototype` | Замыкание | Composition | Чуть хуже (дубль методов) |

### Практика и применение

- **Данные/DTO** — литерал `{}`.
- **Сервисы, сложные объекты с поведением** — `class`.
- **Инкапсуляция без class** — фабричная функция.
- **Прототипное наследование вручную** — `Object.create()`.
- **Словарь/хэш-мап без методов `hasOwnProperty` и т.д.** — `Object.create(null)`.

### Важные нюансы и краеугольные камни

- Фабричные функции создают копии методов для каждого объекта (не на прототипе) → выше потребление памяти при тысячах экземпляров.
- `class` методы живут на `prototype` — общий для всех экземпляров → экономия памяти.
- `Object.create(null)` полезен для словарей — нет риска конфликта с `toString`, `hasOwnProperty`.

### Примеры

```javascript
// Сравнение памяти: class vs factory
class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  toString() { return `(${this.x}, ${this.y})`; }
}
// toString — один на всех экземплярах через prototype

function createPoint(x, y) {
  return {
    x, y,
    toString() { return `(${x}, ${y})`; } // копия для каждого объекта!
  };
}

// Object.create для наследования
const animal = {
  speak() { return `${this.name} makes a sound.`; }
};
const dog = Object.create(animal);
dog.name = 'Rex';
dog.speak(); // "Rex makes a sound."
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем фабричная функция лучше `class`?** — Инкапсуляция через замыкание, нет проблем с `this`, можно использовать composition over inheritance.
- **Когда использовать `Object.create(null)`?** — Для чистых словарей без риска конфликта с методами прототипа.
- **Что делает `new` при вызове?** — Создаёт пустой объект, устанавливает прототип, вызывает конструктор с `this = новый объект`, возвращает объект.

### Красные флаги (чего не говорить)

- «`class` — единственный правильный способ» — у каждого подхода свои use cases.
- «Фабричные функции и конструкторы — одно и то же» — функции отличаются использованием `new`, `this` и прототипом.

### Связанные темы

- `043-dlya-chego-ispolzuetsya-klyuchevoe-slovo-new.md`
- `045-chto-takoe-prototip-obiekta.md`
- `046-chto-takoe-prototipnoe-nasledovanie.md`
- `048-kak-rabotaet-object-create.md`
