# Q015. Как работает механизм прототипов в JavaScript?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

В JavaScript каждый объект имеет внутренний слот `[[Prototype]]` — ссылку на другой объект (прототип). При обращении к свойству, которого нет у объекта, движок ищет его вверх по **прототипной цепочке** до `Object.prototype`, у которого `[[Prototype]] === null`. Это **делегирование**, а не копирование. `class`-синтаксис — синтаксический сахар поверх этой механики.

---

## Развёрнутый ответ

### Суть и определение

```
instance → Constructor.prototype → ParentConstructor.prototype → Object.prototype → null
```

При обращении `obj.method()`:
1. Есть ли `method` у самого `obj`? — нет
2. Есть ли у `obj.[[Prototype]]`? — проверяем
3. Есть ли выше по цепочке? — продолжаем
4. Дошли до `null` — `undefined` (или `TypeError` при вызове)

---

### Прямая работа с прототипами

```javascript
// Создание объекта с заданным прототипом
const animal = {
  breathe() { return 'breathing'; },
  describe() { return `I am ${this.name}`; }
};

const dog = Object.create(animal);
dog.name = 'Rex';
dog.bark = function() { return 'Woof!'; };

dog.bark();     // 'Woof!' — собственный метод
dog.breathe();  // 'breathing' — делегируется к animal
dog.describe(); // 'I am Rex' — this привязан к dog

// Проверка цепочки
Object.getPrototypeOf(dog) === animal;            // true
Object.getPrototypeOf(animal) === Object.prototype; // true
Object.getPrototypeOf(Object.prototype) === null;  // true
```

---

### Механика `new` под капотом

```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}`;
};

// new Person('Alice') делает следующее:
// 1. const obj = Object.create(Person.prototype);
// 2. Person.call(obj, 'Alice');  — выполняет конструктор с this = obj
// 3. return obj;  — если конструктор не вернул объект явно

const alice = new Person('Alice');
alice.greet();                                // 'Hi, I'm Alice'
Object.getPrototypeOf(alice) === Person.prototype; // true
alice instanceof Person;                      // true
```

---

### Class-синтаксис — то же самое

```javascript
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} speaks`; }
}

class Dog extends Animal {
  bark() { return 'Woof!'; }
}

const d = new Dog('Rex');

// Под капотом:
// Dog.prototype.__proto__ === Animal.prototype
// d.__proto__ === Dog.prototype
// d.__proto__.__proto__ === Animal.prototype
// d.__proto__.__proto__.__proto__ === Object.prototype

d.bark();   // найдено на Dog.prototype
d.speak();  // найдено на Animal.prototype
d.toString(); // найдено на Object.prototype
```

---

### hasOwnProperty и проверки

```javascript
const obj = Object.create({ inherited: true });
obj.own = 42;

obj.own;            // 42
obj.inherited;      // true

obj.hasOwnProperty('own');        // true — своё свойство
obj.hasOwnProperty('inherited');  // false — из прототипа

// Безопаснее для объектов без Object.prototype в цепочке
Object.hasOwn(obj, 'own');        // true (ES2022, предпочтительно)

// for...in перебирает ВСЕ enumerable, включая унаследованные
for (const key in obj) {
  if (Object.hasOwn(obj, key)) { /* только собственные */ }
}

// Object.keys — только собственные enumerable
Object.keys(obj); // ['own']
```

---

### Поиск по цепочке: производительность и длина

```javascript
// Глубокая цепочка — медленнее
const a = {};
const b = Object.create(a);
const c = Object.create(b);
const d = Object.create(c);

// При обращении к d.toString():
// d → c → b → a → Object.prototype ← здесь найдено

// Часто используемые методы лучше держать ближе к объекту или на прямом прототипе
```

---

### Изменение прототипа в рантайме

```javascript
const obj = { a: 1 };
const proto1 = { method() { return 'proto1'; } };
const proto2 = { method() { return 'proto2'; } };

Object.setPrototypeOf(obj, proto1);
obj.method(); // 'proto1'

Object.setPrototypeOf(obj, proto2);
obj.method(); // 'proto2'

// ⚠️ Object.setPrototypeOf — крайне медленная операция!
// Движки V8/SpiderMonkey оптимизируют объекты по «форме» (hidden class / shape).
// Изменение прототипа ломает оптимизацию и деградирует объект до slow mode.
```

---

### Важные инструменты

```javascript
// Получить прототип
Object.getPrototypeOf(obj);          // рекомендуется
obj.__proto__;                        // устарело, но работает

// Создать объект с прототипом
Object.create(proto);
Object.create(null);                  // без прототипа (чистый словарь)

// Проверить вхождение в цепочку
obj instanceof Constructor;           // Constructor.prototype в цепочке obj?
proto.isPrototypeOf(obj);             // proto в цепочке obj?

// Все собственные дескрипторы
Object.getOwnPropertyDescriptors(obj);
```

### Практика и применение

- **Полиморфизм через прототипы**: методы на прототипе, данные на экземпляре — стандартная модель классов JS
- **Monkey patching**: `Array.prototype.myMethod = ...` — добавление методов к встроенным типам (только в своём коде, не в библиотеках)
- **Performance**: методы на прототипе занимают память только раз — не дублируются на каждом экземпляре

### Важные нюансы и краеугольные камни

- **`__proto__`** — устаревший геттер/сеттер на `Object.prototype`; используй `Object.getPrototypeOf` / `Object.setPrototypeOf`
- Прototipная цепочка работает только для **чтения**: запись всегда создаёт собственное свойство объекта, не меняет прототип
- `Object.create(null)` — объект без `toString`, `hasOwnProperty` и других унаследованных методов — идеален как hash map
- **Hidden classes (V8)**: движок оптимизирует объекты с фиксированной «формой»; динамическое добавление свойств в разном порядке — источник деградации

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что делает `new` под капотом?** — Создаёт объект, устанавливает `[[Prototype]]` = `Constructor.prototype`, вызывает конструктор, возвращает объект.
- **Разница `instanceof` и `isPrototypeOf`?** — `instanceof` проверяет, есть ли `Constructor.prototype` в цепочке; `isPrototypeOf` — есть ли конкретный объект в цепочке.
- **Почему не стоит использовать `Object.setPrototypeOf` в продакшне?** — Ломает внутренние оптимизации движка (hidden classes), значительно снижает производительность объекта.
- **Как `class extends` реализуется через прототипы?** — Устанавливает `Child.prototype.__proto__ = Parent.prototype` и `Child.__proto__ = Parent`.

### Красные флаги (чего не говорить)

- «JavaScript копирует методы из прототипа при создании объекта» — нет, только делегирование по цепочке.
- «`__proto__` и `prototype` — одно и то же» — разные вещи с разными ролями.

### Связанные темы

- `005-klassovoe-vs-prototipnoe-nasledovanie.md`
- `013-deskriptory-svoystv-obektov.md`
- `011-abstraktnyy-klass-v-js.md`
- `012-staticheskiy-metod-klassa-static.md`
