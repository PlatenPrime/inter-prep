# Q007. Что такое приватные аксессоры?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

Приватные аксессоры — это геттеры и сеттеры с префиксом `#`, доступные только внутри тела класса. Они позволяют контролировать чтение и запись приватных полей с сохранением инкапсуляции: снаружи класса к `#field` обращаться невозможно (движок выбросит `SyntaxError`), но через публичный API можно управлять доступом.

---

## Развёрнутый ответ

### Суть и определение

В ES2022 (Class Fields proposal) добавлены **приватные поля** (`#field`) и **приватные аксессоры** (`get #name()` / `set #name()`).

Аксессоры (геттеры/сеттеры) — специальные методы класса, выглядящие снаружи как свойства. Когда они помечены `#`, то сами недоступны снаружи.

Важно различать:
- **Приватное поле `#x`** — данные, недоступные снаружи
- **Публичный геттер `get x()`** — публичный доступ к приватному полю
- **Приватный геттер `get #x()`** — геттер, доступный только внутри класса

### Как это работает

Приватные имена (`#`) реализованы через WeakMap-подобный механизм в движке: принадлежность поля классу проверяется структурно, а не через цепочку прототипов. Нет никакой возможности обойти ограничение через `Object.getOwnPropertyNames`, `Reflect` или `Proxy`.

```javascript
class Foo {
  #value = 42;

  // Публичный геттер для приватного поля
  get value() { return this.#value; }

  // Приватный геттер (доступен только внутри класса)
  get #doubled() { return this.#value * 2; }

  getDoubled() {
    return this.#doubled; // приватный геттер — доступен здесь
  }
}

const foo = new Foo();
foo.value;     // 42 — через публичный геттер
foo.#value;    // SyntaxError
foo.#doubled;  // SyntaxError
foo.getDoubled(); // 84 — через публичный метод
```

### Практика и применение

**Паттерн «защищённое состояние + валидация»:**
```javascript
class Temperature {
  #celsius;

  constructor(celsius) {
    this.#celsius = celsius;
  }

  get celsius() { return this.#celsius; }
  set celsius(value) {
    if (value < -273.15) throw new RangeError('Below absolute zero');
    this.#celsius = value;
  }

  get fahrenheit() { return this.#celsius * 9/5 + 32; }
  set fahrenheit(value) {
    this.celsius = (value - 32) * 5/9; // переиспользует валидацию
  }
}
```

**Типичное применение:** модели данных, UI-компоненты (React class components с кешем), SDK / библиотеки, где нужно скрыть внутренний стейт от потребителей.

### Важные нюансы и краеугольные камни

- **Приватные поля не наследуются** через прототипную цепочку — дочерний класс не имеет доступа к `#field` родителя.
- **`in` оператор работает** для проверки наличия приватного поля: `#field in obj` (без доступа к значению).
- **`Object.getOwnPropertyNames` не возвращает** приватные поля.
- **Нельзя использовать `delete #field`** — SyntaxError.
- Приватные поля **не полифилятся** полностью (Babel использует WeakMap, что изменяет поведение).
- **Статические приватные поля и методы** тоже поддерживаются: `static #count = 0`.

### Примеры

```javascript
class Circle {
  #radius;
  static #count = 0;

  constructor(radius) {
    if (radius <= 0) throw new RangeError('Radius must be positive');
    this.#radius = radius;
    Circle.#count++;
  }

  get radius() { return this.#radius; }
  set radius(r) {
    if (r <= 0) throw new RangeError('Radius must be positive');
    this.#radius = r;
  }

  get area() { return Math.PI * this.#radius ** 2; }

  static getCount() { return Circle.#count; }
}

const c1 = new Circle(5);
const c2 = new Circle(10);

c1.radius;       // 5
c1.radius = 7;   // ОК — через сеттер с валидацией
// c1.radius = -1; // RangeError

Circle.getCount(); // 2
// c1.#radius;      // SyntaxError

// Проверка наличия приватного поля без доступа
function isCircle(obj) {
  return #radius in obj; // true/false
}
isCircle(c1); // true
isCircle({});  // false
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Могут ли дочерние классы обращаться к приватным полям родителя?** — Нет. Приватные поля принадлежат только тому классу, в котором объявлены.
- **Чем `#field` отличается от `_field` (соглашение)?** — `#` — жёсткое ограничение движка, `_` — только соглашение в команде, технически доступно снаружи.
- **Можно ли сериализовать приватные поля в JSON?** — Нет напрямую; нужен `toJSON()` или геттер, который возвращает данные публично.
- **Как работает `#field in obj`?** — Позволяет безопасно проверить, является ли объект экземпляром класса без `instanceof` — полезно при duck typing.

### Красные флаги (чего не говорить)

- «Приватные поля — это просто соглашение» — это справедливо для `_`, но `#` — настоящая инкапсуляция.
- «`Object.getOwnPropertyNames` покажет приватные поля» — нет, они полностью скрыты.
- «Дочерний класс наследует приватные поля» — нет, доступ ограничен только телом класса-владельца.

### Связанные темы

- [`006-raznica-es6-klassy-i-konstruktory-funkcij.md`](006-raznica-es6-klassy-i-konstruktory-funkcij.md)
- [`028-dlya-chego-metod-getownpropertydescriptors.md`](028-dlya-chego-metod-getownpropertydescriptors.md)
