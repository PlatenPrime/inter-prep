# Q046. Что такое прототипное наследование? Как создать объект без прототипа?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Прототипное наследование** — механизм JS, при котором объект наследует свойства и методы через цепочку `[[Prototype]]` ссылок, а не через копирование. Объект «делегирует» поиск свойства своему прототипу. Объект без прототипа создаётся через `Object.create(null)` — нет ни `toString`, ни `hasOwnProperty`, ни других методов `Object.prototype`.

---

## Развёрнутый ответ

### Суть и определение

В классическом ООП (Java, C++) классы копируют методы в каждый экземпляр. В JS — **делегирование**: если у объекта нет свойства, он делегирует поиск прототипу.

```
dog → Animal.prototype → Object.prototype → null
      (breathe)         (toString, ...)
```

### Как это работает

```javascript
// Прототипное наследование через constructor + prototype
function Animal(name) {
  this.name = name;
}
Animal.prototype.breathe = function() {
  return `${this.name} breathes`;
};

function Dog(name, breed) {
  Animal.call(this, name); // вызов "супер-конструктора"
  this.breed = breed;
}
// Установка цепочки прототипов
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // восстанавливаем

Dog.prototype.bark = function() {
  return `${this.name} barks!`;
};

const rex = new Dog('Rex', 'Labrador');
rex.breathe(); // "Rex breathes" — делегирование к Animal.prototype
rex.bark();    // "Rex barks!"  — собственный метод
rex instanceof Dog;    // true
rex instanceof Animal; // true
```

**Современный эквивалент через `class`:**
```javascript
class Animal {
  constructor(name) { this.name = name; }
  breathe() { return `${this.name} breathes`; }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Animal.call(this, name)
    this.breed = breed;
  }
  bark() { return `${this.name} barks!`; }
}
```

### Объект без прототипа

```javascript
// Обычный объект — прототип Object.prototype
const regular = {};
'toString' in regular;      // true — из Object.prototype
regular.hasOwnProperty('x'); // работает — из Object.prototype

// Объект без прототипа
const bare = Object.create(null);
'toString' in bare;         // false — нет прототипа!
bare.toString;              // undefined
Object.prototype.toString.call(bare); // "[object Object]" — вызов вручную

// Применение: чистый словарь без риска конфликтов с методами прототипа
const dict = Object.create(null);
dict['constructor'] = 'custom'; // безопасно, нет конфликта
dict['__proto__'] = 'safe';     // не меняет прототип!
```

### Практика и применение

- **`class extends`** — современный, читаемый синтаксис наследования.
- **Composition over inheritance** — в современных архитектурах предпочитают миксины/compose вместо глубоких цепочек наследования.
- **`Object.create(null)` для словарей** — когда ключи непредсказуемы и могут конфликтовать с методами прототипа (`constructor`, `valueOf`, `__proto__`).

### Важные нюансы и краеугольные камни

- Прототипное наследование — **делегирование**, не копирование. Изменение прототипа влияет на все унаследованные объекты — риск при модификации.
- `hasOwnProperty` — проверяет собственные свойства, не унаследованные. Для `Object.create(null)` нужен `Object.prototype.hasOwnProperty.call(obj, key)`.
- Глубокие цепочки наследования (3+ уровня) — антипаттерн: сложно поддерживать.
- `class` в JS — синтаксический сахар над прототипным механизмом; под капотом работает то же `prototype`.

### Примеры

```javascript
// Mixin паттерн — альтернатива наследованию
const Serializable = {
  serialize() { return JSON.stringify(this); },
  deserialize(str) { return Object.assign(this, JSON.parse(str)); }
};

const Timestamped = {
  createdAt: null,
  init() { this.createdAt = new Date(); return this; }
};

class User {
  constructor(name) { this.name = name; }
}
Object.assign(User.prototype, Serializable, Timestamped);

const user = new User('Alice');
user.init();
user.serialize(); // '{"name":"Alice","createdAt":"..."}'
```

---

## Сравнение

| Критерий | Прототипное наследование | Классическое (Java/C++) |
|----------|--------------------------|------------------------|
| Механизм | Делегирование | Копирование |
| Runtime изменения | Да | Нет |
| Гибкость | Высокая | Ниже |
| Читаемость | Ниже (цепочки) | Выше (явные классы) |
| Множественное | Через миксины | Через интерфейсы |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что произойдёт при изменении метода в прототипе после создания экземпляров?** — Все экземпляры сразу видят изменение (делегирование, не копия).
- **Почему нужен `Object.prototype.hasOwnProperty.call(obj, key)` для `Object.create(null)`?** — У объекта без прототипа нет унаследованного `hasOwnProperty`.
- **`class extends` под капотом?** — Создаёт цепочку прототипов: `Child.prototype = Object.create(Parent.prototype)`.

### Красные флаги (чего не говорить)

- «Прототипное наследование = классовое наследование» — принципиально другая модель.
- «`class` в JS — это полноценные классы как в Java» — синтаксический сахар над прототипами.

### Связанные темы

- `045-chto-takoe-prototip-obiekta.md`
- `048-kak-rabotaet-object-create.md`
- `047-pochemu-rasshirenie-nativnykh-obektov-plokhaya-praktika.md`
