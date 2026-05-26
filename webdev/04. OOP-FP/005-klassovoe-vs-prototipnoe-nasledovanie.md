# Q005. Разница между классовым и прототипным наследованием?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**Классовое наследование** (C++, Java, C#) строится на копировании поведения при создании объекта — инстанцировании класса как шаблона. **Прототипное наследование** (JavaScript) строится на **делегировании**: объект не копирует методы, а ищет их вверх по цепочке прототипов в рантайме. Ключевое различие — копирование vs делегирование. В JavaScript `class`-синтаксис — лишь обёртка над прототипной моделью.

---

## Развёрнутый ответ

### Суть и определение

| Аспект | Классовое | Прототипное |
|--------|-----------|-------------|
| Основа | Класс — шаблон для объектов | Объект — прототип для других объектов |
| Механизм | Копирование методов при инстанцировании | Делегирование по цепочке `[[Prototype]]` |
| Гибкость | Фиксированная иерархия | Динамическая цепочка, изменяемая в рантайме |
| Языки | Java, C++, C#, Python | JavaScript, Lua |
| `class` в JS | Синтаксический сахар | Прототипная модель под капотом |

---

### Как работает прототипное наследование в JS

```javascript
// Явная прототипная цепочка
const animal = {
  speak() { return `${this.name} makes a sound`; }
};

const dog = Object.create(animal);
dog.name = 'Rex';
dog.bark = function() { return 'Woof!'; };

dog.speak(); // 'Rex makes a sound' — делегируется к animal
dog.bark();  // 'Woof!' — собственный метод

// Цепочка: dog → animal → Object.prototype → null
Object.getPrototypeOf(dog) === animal; // true
```

При обращении к `dog.speak()` JavaScript:
1. Ищет `speak` у самого `dog` — не найдено
2. Идёт к `[[Prototype]]` — `animal` — найдено, вызывает

---

### ES6 class — синтаксический сахар

```typescript
class Animal {
  constructor(public name: string) {}
  speak() { return `${this.name} makes a sound`; }
}

class Dog extends Animal {
  bark() { return 'Woof!'; }
}

const dog = new Dog('Rex');

// Под капотом — та же прототипная цепочка:
// dog.__proto__ === Dog.prototype
// Dog.prototype.__proto__ === Animal.prototype
// Animal.prototype.__proto__ === Object.prototype

Object.getPrototypeOf(dog) === Dog.prototype;               // true
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // true
```

---

### Ключевые отличия

#### 1. Делегирование vs копирование

```javascript
const base = { greet() { return 'Hello'; } };
const child = Object.create(base);

// Изменение прототипа ПОСЛЕ создания child влияет на child
base.greet = function() { return 'Hi'; };
child.greet(); // 'Hi' — делегирование живое

// В классовом наследовании такого нет — методы копируются в момент создания инстанса
```

#### 2. Множественное наследование через миксины

```typescript
// JS не поддерживает множественное прототипное наследование напрямую,
// но миксины решают задачу
const Serializable = (superclass: new (...args: unknown[]) => object) =>
  class extends superclass {
    serialize() { return JSON.stringify(this); }
  };

const Validatable = (superclass: new (...args: unknown[]) => object) =>
  class extends superclass {
    validate() { return true; }
  };

class Base {}
class MyModel extends Serializable(Validatable(Base)) {}

const m = new MyModel();
m.serialize();  // работает
m.validate();   // работает
```

#### 3. Object.create — создание объекта с заданным прототипом

```javascript
// Позволяет создавать объекты без классов
const proto = {
  greet() { return `Hi, I'm ${this.name}`; }
};

function createUser(name) {
  const user = Object.create(proto);
  user.name = name;
  return user;
}

const alice = createUser('Alice');
alice.greet(); // "Hi, I'm Alice"
```

### Практика и применение

- **`class`-синтаксис** — используй везде для читаемости, зная что под ним прототипы
- **`Object.create(null)`** — создать объект без прототипа (чистый словарь, без `toString`, `hasOwnProperty`)
- **Monkey patching** — добавление методов к `Array.prototype`, `String.prototype` — следствие прототипной модели (делать в продакшне опасно)
- Проверка прототипа: `instanceof`, `Object.getPrototypeOf()`, `isPrototypeOf()`

### Важные нюансы и краеугольные камни

- **`__proto__` vs `prototype`**: `__proto__` — свойство экземпляра, ссылка на прототип; `prototype` — свойство функции-конструктора/класса.
- **Изменение прототипа в рантайме** (`Object.setPrototypeOf`) — работает, но крайне медленно (отключает оптимизации движка).
- `class` в JS не создаёт «настоящие» классы — это просто более удобный синтаксис для работы с прототипами.
- **Производительность:** поиск по длинной цепочке прототипов медленнее прямого доступа к свойству.

---

## Сравнение

| Критерий | Классовое наследование | Прототипное наследование |
|----------|----------------------|------------------------|
| Механизм | Инстанцирование (копирование) | Делегирование по цепочке |
| Гибкость | Статическая иерархия | Динамическая, изменяема в рантайме |
| Множественное наследование | Поддерживается (C++) / Запрещено (Java) | Только через миксины |
| `instanceof` | Работает через иерархию классов | Работает через цепочку прототипов |
| Изменение после создания | Невозможно (Java) | Изменение прототипа влияет на все объекты |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое `[[Prototype]]` и чем отличается от `prototype`?** — `[[Prototype]]` — внутренний слот объекта (доступен через `__proto__`); `prototype` — свойство функции, используется при `new`.
- **Как `new` работает под капотом?** — Создаёт объект, устанавливает его `[[Prototype]]` равным `Constructor.prototype`, вызывает конструктор, возвращает объект.
- **Почему `Object.create(null)` полезен?** — Объект без прототипа не наследует методы Object.prototype — идеален как чистый словарь/hash-map.

### Красные флаги (чего не говорить)

- «`class` в JS — это настоящие классы как в Java» — нет, это синтаксический сахар над прототипами.
- Путать `__proto__` и `prototype` — это разные вещи с разными ролями.

### Связанные темы

- `015-mekhanizm-prototipov-v-js.md`
- `006-kompozitsiya-vs-nasledovanie.md`
- `011-abstraktnyy-klass-v-js.md`
