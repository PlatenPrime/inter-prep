# Q045. Что такое прототип (Prototype) объекта в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Прототип** — объект, на который ссылается другой объект через внутреннее свойство `[[Prototype]]` (доступно как `__proto__` или через `Object.getPrototypeOf()`). При обращении к свойству или методу, которого нет в объекте, движок ищет его по **цепочке прототипов** (prototype chain) до `null`. Это основа прототипного наследования в JS.

---

## Развёрнутый ответ

### Суть и определение

Каждый объект в JavaScript имеет скрытую ссылку `[[Prototype]]` на другой объект. Это и есть «прототип». При поиске свойства JavaScript сначала ищет в самом объекте, затем — в прототипе, прототипе прототипа и т.д. — до `Object.prototype`, у которого `[[Prototype]] === null`.

### Как это работает

```javascript
const animal = {
  breathe() { return `${this.name} breathes.`; }
};

const dog = Object.create(animal); // dog.__proto__ === animal
dog.name = 'Rex';

dog.breathe(); // "Rex breathes." — метод найден в прототипе!

// Цепочка
dog.__proto__ === animal;           // true
animal.__proto__ === Object.prototype; // true
Object.prototype.__proto__ === null; // конец цепочки
```

**При создании функцией-конструктором:**
```javascript
function User(name) { this.name = name; }
User.prototype.greet = function() { return `Hi, ${this.name}`; };

const alice = new User('Alice');
// alice.__proto__ === User.prototype
// User.prototype.__proto__ === Object.prototype

alice.greet(); // "Hi, Alice" — из User.prototype
alice.toString(); // "[object Object]" — из Object.prototype
```

### `prototype` vs `[[Prototype]]`

| | `Constructor.prototype` | `instance.__proto__` / `[[Prototype]]` |
|--|------------------------|---------------------------------------|
| Что | Свойство функции-конструктора | Внутренняя ссылка экземпляра |
| Зачем | Источник прототипа для `new` | Ссылка на прототип объекта |
| Пример | `User.prototype.greet = fn` | `alice.__proto__ === User.prototype` |

### Практика и применение

- **Переиспользование методов:** методы на `Constructor.prototype` — один экземпляр на все объекты данного типа (экономия памяти).
- **Проверка цепочки:** `instanceof` проверяет, есть ли `Constructor.prototype` в цепочке прототипов.
- **`Object.getPrototypeOf(obj)`** — стандартный способ получить прототип (не `__proto__`, это нестандарт).

### Важные нюансы и краеугольные камни

- `__proto__` — устаревший способ доступа к `[[Prototype]]`; современный — `Object.getPrototypeOf()` / `Object.setPrototypeOf()`.
- Изменение прототипа через `Object.setPrototypeOf()` в runtime — очень дорогая операция (ломает JIT оптимизации V8).
- `Object.create(null)` — объект без прототипа; нет `toString`, `hasOwnProperty` и т.д.
- Добавление методов в `Object.prototype` — антипаттерн: изменяет поведение всех объектов.

### Примеры

```javascript
// Работа с прототипом напрямую
function Shape(color) { this.color = color; }
Shape.prototype.describe = function() {
  return `A ${this.color} shape`;
};

function Circle(color, radius) {
  Shape.call(this, color); // вызываем конструктор родителя
  this.radius = radius;
}
// Устанавливаем цепочку прототипов вручную
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle; // восстанавливаем constructor

Circle.prototype.area = function() {
  return Math.PI * this.radius ** 2;
};

const c = new Circle('red', 5);
c.describe(); // "A red shape" — из Shape.prototype
c.area();     // ~78.5
c instanceof Circle; // true
c instanceof Shape;  // true

// Современный эквивалент через class
class CircleModern extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  area() { return Math.PI * this.radius ** 2; }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `prototype` конструктора отличается от `__proto__` экземпляра?** — `prototype` — шаблон для будущих экземпляров; `__proto__` — фактический прототип конкретного объекта.
- **Как работает `instanceof`?** — Проверяет, есть ли `Constructor.prototype` в цепочке `[[Prototype]]` объекта.
- **Что вернёт `Object.getPrototypeOf(Object.prototype)`?** — `null` — конец цепочки.

### Красные флаги (чего не говорить)

- «Прототип — это копия объекта» — нет, это ссылка; изменение прототипа влияет на все экземпляры.
- «`__proto__` и `prototype` — одно и то же» — принципиально разные вещи.

### Связанные темы

- `046-chto-takoe-prototipnoe-nasledovanie.md`
- `043-dlya-chego-ispolzuetsya-klyuchevoe-slovo-new.md`
- `048-kak-rabotaet-object-create.md`
- `052-raznica-mezhdu-typeof-i-instanceof.md`
