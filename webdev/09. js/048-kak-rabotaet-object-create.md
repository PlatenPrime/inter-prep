# Q048. Как работает метод `Object.create()`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`Object.create(proto, propertiesObject)` создаёт новый объект и устанавливает его `[[Prototype]]` равным `proto`. Это **прямой** способ установки прототипа без конструкторов и `new`. При `proto = null` создаётся объект без прототипа — «чистый словарь». Второй аргумент — опциональный дескриптор свойств (как в `Object.defineProperties`).

---

## Развёрнутый ответ

### Синтаксис

```javascript
Object.create(proto)
Object.create(proto, propertiesObject)
```

- `proto` — прототип нового объекта (`null` или объект).
- `propertiesObject` — дескрипторы свойств (необязательно).

### Как это работает

```javascript
const animalProto = {
  breathe() { return `${this.name} breathes.`; },
  toString() { return `Animal: ${this.name}`; }
};

const dog = Object.create(animalProto);
dog.name = 'Rex';
dog.breed = 'Labrador';

dog.breathe(); // "Rex breathes." — метод из прототипа
Object.getPrototypeOf(dog) === animalProto; // true
```

**Полифил `Object.create`:**
```javascript
// Примерная реализация
function objectCreate(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}
```

### Второй аргумент — property descriptors

```javascript
const obj = Object.create(Object.prototype, {
  name: {
    value: 'Alice',
    writable: false,
    enumerable: true,
    configurable: false
  },
  age: {
    value: 30,
    writable: true,
    enumerable: true,
    configurable: true
  }
});

obj.name = 'Bob'; // тихо игнорируется (writable: false)
console.log(obj.name); // 'Alice'
```

### `Object.create(null)` — объект без прототипа

```javascript
const map = Object.create(null);
map.key1 = 'value1';
map.constructor = 'custom'; // безопасно, нет конфликта с Object.prototype.constructor

// Нет методов Object.prototype
'toString' in map;         // false
map.hasOwnProperty;        // undefined

// Для проверки собственных свойств:
Object.prototype.hasOwnProperty.call(map, 'key1'); // true
// Или Object.hasOwn(map, 'key1') — ES2022
```

### Практика и применение

- **Прямое прототипное наследование без конструкторов** — лаконичнее `new` + `prototype`.
- **`Object.create(null)` для словарей** — безопасно хранить ключи из пользовательского ввода.
- **Паттерн Parasitic Combination Inheritance** — правильная установка прототипа без вызова родительского конструктора.

```javascript
// Без Object.create — проблема: вызывается конструктор Parent
function Parent(name) { this.name = name; }
Child.prototype = new Parent(); // плохо: конструктор вызывается без аргументов

// С Object.create — правильно
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

### Важные нюансы и краеугольные камни

- `Object.create(Object.prototype)` ≡ `{}` — одинаковый прототип.
- Изменение переданного `proto` объекта после `Object.create` — влияет на все созданные объекты (делегирование).
- `propertiesObject` использует дескрипторы (не просто значения) — частая ошибка передать `{ key: 'value' }` вместо `{ key: { value: 'value' } }`.

### Примеры

```javascript
// Реализация наследования через Object.create
class Vehicle {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }
  describe() { return `${this.make} ${this.model}`; }
}

// Через Object.create (без class)
const vehicleProto = {
  describe() { return `${this.make} ${this.model}`; }
};

function createVehicle(make, model) {
  const v = Object.create(vehicleProto);
  v.make = make;
  v.model = model;
  return v;
}

const car = createVehicle('Toyota', 'Camry');
car.describe(); // "Toyota Camry"
Object.getPrototypeOf(car) === vehicleProto; // true
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `Object.create({})` отличается от `Object.create(null)`?** — С `{}` объект наследует от `Object.prototype`; с `null` — нет прототипа вообще.
- **Почему `Object.create(Parent.prototype)` лучше `new Parent()` для установки прототипа?** — Не вызывает конструктор родителя (который может требовать аргументы или выполнять side effects).
- **Как Object.create связан с `__proto__`?** — `Object.create(proto)` устанавливает `[[Prototype]]` (то же самое, что `obj.__proto__ = proto`, но правильным способом).

### Красные флаги (чего не говорить)

- «`Object.create(proto)` копирует свойства из proto» — нет, только устанавливает ссылку на прототип.

### Связанные темы

- `045-chto-takoe-prototip-obiekta.md`
- `046-chto-takoe-prototipnoe-nasledovanie.md`
- `049-kak-opredelit-nalichie-svoystva-v-obekte.md`
