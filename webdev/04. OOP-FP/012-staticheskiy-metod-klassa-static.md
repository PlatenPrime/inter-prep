# Q012. Что такое статический метод класса (`static`)? Как осуществляется его вызов?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**Статический метод** (или свойство) — метод, принадлежащий **самому классу**, а не его экземплярам. Вызывается через имя класса (`ClassName.method()`), не через `this`. Внутри статического метода `this` ссылается на класс, а не на экземпляр. Используется для фабричных методов, утилит и логики, не зависящей от состояния объекта.

---

## Развёрнутый ответ

### Суть и определение

```typescript
class MathUtils {
  static readonly PI = 3.14159;

  static square(x: number): number {
    return x * x;
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}

// Вызов — через имя класса, без создания экземпляра
MathUtils.square(5);         // 25
MathUtils.clamp(15, 0, 10);  // 10
MathUtils.PI;                // 3.14159

// new MathUtils().square(5); // работает, но бессмысленно и вводит в заблуждение
```

---

### Под капотом: куда добавляется static-метод

```javascript
class Foo {
  instanceMethod() {}
  static staticMethod() {}
}

// instanceMethod добавляется на Foo.prototype
// staticMethod добавляется напрямую на Foo (функцию-конструктор)

Foo.prototype.instanceMethod;  // function
Foo.staticMethod;              // function
new Foo().staticMethod;        // undefined (нет на прототипе)
```

---

### `this` внутри static-метода

```typescript
class Counter {
  private static count = 0;

  static increment(): void {
    this.count++; // this === Counter (сам класс)
  }

  static getCount(): number {
    return this.count;
  }

  static reset(): void {
    this.count = 0;
  }
}

Counter.increment();
Counter.increment();
Counter.getCount(); // 2
```

---

### Фабричный метод (наиболее частый use case)

```typescript
class User {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly role: 'admin' | 'user',
    public readonly createdAt: Date
  ) {}

  // Статические фабричные методы вместо перегруженных конструкторов
  static create(name: string): User {
    return new User(crypto.randomUUID(), name, 'user', new Date());
  }

  static createAdmin(name: string): User {
    return new User(crypto.randomUUID(), name, 'admin', new Date());
  }

  static fromDto(dto: { id: string; name: string; role: 'admin' | 'user'; createdAt: string }): User {
    return new User(dto.id, dto.name, dto.role, new Date(dto.createdAt));
  }
}

const user = User.create('Alice');
const admin = User.createAdmin('Bob');
const restored = User.fromDto({ id: '1', name: 'Carol', role: 'user', createdAt: '2026-01-01' });
```

---

### Статические методы в наследовании

```typescript
class Animal {
  static kingdom = 'Animalia';

  static describe(): string {
    return `Kingdom: ${this.kingdom}`; // this — сам класс (или подкласс)
  }
}

class Dog extends Animal {
  static kingdom = 'Animalia / Mammalia';
}

Animal.describe(); // 'Kingdom: Animalia'
Dog.describe();    // 'Kingdom: Animalia / Mammalia' — this === Dog
```

`this` в статическом контексте — полиморфный: указывает на фактический класс при вызове через подкласс. Это называется **polymorphic `this`** для статики.

---

### Паттерны использования

```typescript
// 1. Singleton через static
class Config {
  private static instance: Config | null = null;
  private settings: Map<string, string> = new Map();

  private constructor() {}

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  get(key: string): string | undefined {
    return this.settings.get(key);
  }
}

// 2. Registry / Plugin-реестр
class PluginRegistry {
  private static plugins = new Map<string, Plugin>();

  static register(name: string, plugin: Plugin): void {
    this.plugins.set(name, plugin);
  }

  static get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }
}
```

### Практика и применение

- **Фабричные методы** — `Date.now()`, `Array.from()`, `Object.keys()`, `Promise.all()` — все статические
- **Утилитные классы** — `Math`, `JSON`, `Number` — только статические методы
- **Кэширование и реестры** — хранение общего состояния на уровне класса
- **Валидация** — `User.validateEmail(email)` — не требует экземпляра

### Важные нюансы и краеугольные камни

- **Статический метод не имеет доступа к `this` экземпляра** — нельзя вызвать `this.instanceField` внутри static
- **Наследование статики**: статические методы наследуются через прототипную цепочку самих классов (`Dog.__proto__ === Animal`)
- **Не использовать для мутабельного глобального состояния** — static + shared mutable state = трудно тестируемый код
- Статические свойства в TypeScript также могут быть `private` и `readonly`

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как static-метод наследуется?** — Через прототипную цепочку конструкторов: `Dog.__proto__ === Animal`; `Dog.describe()` находит метод у `Animal`.
- **Можно ли override static-метода?** — Да, просто объявить метод с тем же именем в подклассе.
- **В чём разница static vs instance метода в плане памяти?** — Static существует в одном экземпляре на класс; instance-метод — на `prototype` (тоже один), но вызывается с контекстом экземпляра.
- **Когда статический метод плох для тестирования?** — Когда он зависит от внешних ресурсов (БД, время, файлы) — сложно мокировать без статических замен.

### Красные флаги (чего не говорить)

- «Статический метод вызывается через `new`» — нет, через имя класса.
- «Внутри static можно обращаться к `this.instanceProperty`» — нет, `this` это класс, не экземпляр.

### Связанные темы

- `015-mekhanizm-prototipov-v-js.md`
- `005-klassovoe-vs-prototipnoe-nasledovanie.md`
- `013-deskriptory-svoystv-obektov.md`
