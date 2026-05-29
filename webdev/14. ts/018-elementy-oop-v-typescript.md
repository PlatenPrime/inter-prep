# Q018. Какие элементы ООП поддерживаются в TypeScript?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

TypeScript поддерживает все ключевые концепции ООП: **классы** (с полями, методами, конструкторами), **наследование** (`extends`), **инкапсуляцию** (модификаторы `public`, `private`, `protected`, `readonly`), **полиморфизм** (переопределение методов, `implements`), **абстракцию** (`abstract class`, `interface`). Всё это транспилируется в JavaScript и опирается на прототипную модель JS.

---

## Развёрнутый ответ

### Суть и определение

TypeScript добавляет к JavaScript полноценную поддержку ООП: статическую типизацию, модификаторы доступа, абстрактные классы и интерфейсы — всё то, чего не хватало в JS для больших проектов.

### Как это работает

#### 1. Классы (Classes)

```typescript
class Person {
  // Поля класса
  readonly id: string;
  name: string;
  private _age: number;

  // Конструктор
  constructor(name: string, age: number) {
    this.id = crypto.randomUUID();
    this.name = name;
    this._age = age;
  }

  // Методы
  greet(): string {
    return `Hi, I'm ${this.name}`;
  }

  // Геттеры и сеттеры
  get age(): number { return this._age; }
  set age(value: number) {
    if (value < 0) throw new RangeError("Age cannot be negative");
    this._age = value;
  }

  // Статические методы и поля
  static create(name: string, age: number): Person {
    return new Person(name, age);
  }
}
```

#### Сокращённое объявление через параметры конструктора

```typescript
class Point {
  // public/private/protected в параметрах → автоматически создаёт поле
  constructor(
    public x: number,
    public y: number,
    private label?: string
  ) {}
}

const p = new Point(1, 2); // p.x = 1, p.y = 2
```

#### 2. Наследование (Inheritance)

```typescript
class Animal {
  constructor(public name: string) {}

  move(distance: number = 0): void {
    console.log(`${this.name} moved ${distance}m`);
  }
}

class Dog extends Animal {
  constructor(name: string, private breed: string) {
    super(name); // обязательный вызов конструктора родителя
  }

  bark(): void {
    console.log("Woof!");
  }

  // Переопределение метода
  move(distance: number = 5): void {
    console.log(`${this.name} runs!`);
    super.move(distance); // вызов родительского метода
  }
}

const dog = new Dog("Rex", "Labrador");
dog.move(10); // Rex runs! / Rex moved 10m
```

#### 3. Инкапсуляция (Encapsulation)

Подробнее — в `019-modifikatory-dostupa.md`. Кратко:

```typescript
class BankAccount {
  private balance: number = 0;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Invalid amount");
    this.balance += amount;
  }

  getBalance(): number { return this.balance; }
  // balance напрямую недоступен снаружи
}
```

#### 4. Полиморфизм (Polymorphism)

```typescript
abstract class Shape {
  abstract area(): number;
  toString(): string {
    return `Shape with area: ${this.area().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }
  area(): number { return Math.PI * this.radius ** 2; }
}

class Rectangle extends Shape {
  constructor(private w: number, private h: number) { super(); }
  area(): number { return this.w * this.h; }
}

const shapes: Shape[] = [new Circle(5), new Rectangle(4, 6)];
shapes.forEach(s => console.log(s.toString())); // полиморфный вызов
```

#### 5. Абстракция (Abstraction)

**Через abstract class:**
```typescript
abstract class Repository<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract save(entity: T): Promise<void>;

  // Общая реализация
  async findOrThrow(id: string): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) throw new Error(`Not found: ${id}`);
    return entity;
  }
}
```

**Через interface:**
```typescript
interface IPaymentProvider {
  charge(amount: number, currency: string): Promise<string>; // transaction ID
  refund(transactionId: string): Promise<void>;
}

class StripeProvider implements IPaymentProvider {
  async charge(amount: number, currency: string): Promise<string> { /* ... */ return "txn_1"; }
  async refund(transactionId: string): Promise<void> { /* ... */ }
}

class PayPalProvider implements IPaymentProvider {
  async charge(amount: number, currency: string): Promise<string> { /* ... */ return "PAYID-1"; }
  async refund(transactionId: string): Promise<void> { /* ... */ }
}
```

#### 6. Миксины (Mixins) — компенсация отсутствия множественного наследования

```typescript
type Constructor<T = {}> = new (...args: any[]) => T;

function Serializable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    serialize(): string {
      return JSON.stringify(this);
    }
  };
}

function Loggable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    log(): void {
      console.log(JSON.stringify(this));
    }
  };
}

class User {
  constructor(public name: string) {}
}

const LoggableSerializableUser = Loggable(Serializable(User));
const u = new LoggableSerializableUser("Alice");
u.log();
u.serialize();
```

### Практика и применение

- **NestJS**: `@Controller`, `@Injectable` — полностью ООП-ориентированный фреймворк
- **TypeORM, Prisma**: сущности как классы с декораторами
- **Repository паттерн**: абстрактный базовый класс + конкретные реализации для разных хранилищ

### Важные нюансы и краеугольные камни

- **TypeScript классы — это JS-классы**: прототипное наследование под капотом, не как в Java/C#
- **Одиночное наследование**: `extends` только одного класса; множественность — через миксины или `implements`
- **`private` TS vs `#private` JS**: `private` — только compile-time; `#name` — настоящий private в рантайме (ES2022+)
- **`instanceof` работает**: в отличие от интерфейсов; `dog instanceof Animal` — true
- **Статические члены** принадлежат классу, не экземпляру; наследуются через `Child.staticMethod()`

### Примеры

```typescript
// Полный пример: DI-совместимая архитектура
interface ILogger {
  info(msg: string): void;
  error(msg: string, err?: Error): void;
}

abstract class BaseUseCase<TInput, TOutput> {
  constructor(protected readonly logger: ILogger) {}

  async execute(input: TInput): Promise<TOutput> {
    this.logger.info(`[${this.constructor.name}] Executing`);
    try {
      return await this.handle(input);
    } catch (err) {
      this.logger.error(`[${this.constructor.name}] Failed`, err instanceof Error ? err : undefined);
      throw err;
    }
  }

  protected abstract handle(input: TInput): Promise<TOutput>;
}

class CreateUserUseCase extends BaseUseCase<CreateUserDto, User> {
  constructor(logger: ILogger, private readonly userRepo: IUserRepository) {
    super(logger);
  }

  protected async handle(dto: CreateUserDto): Promise<User> {
    const user = User.create(dto);
    return this.userRepo.save(user);
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница `private` TypeScript и `#private` JavaScript?** — TS `private` стирается при компиляции; `#field` — настоящая приватность в рантайме
- **Как реализовать множественное наследование в TS?** — через миксины (функции, принимающие класс и возвращающие расширенный)
- **Что такое `abstract` метод?** — объявлен без реализации в базовом классе; подкласс обязан реализовать
- **Когда использовать класс vs функции?** — классы оправданы при наличии состояния, наследования, DI; чистые функции проще тестировать

### Красные флаги (чего не говорить)

- «TypeScript поддерживает множественное наследование» — нет; только один `extends`; несколько `implements`
- «`private` в TypeScript — настоящая приватность» — только compile-time; в JS `obj._field` доступен; используй `#field` для рантайм-приватности
- «ООП в TypeScript работает как в Java» — под капотом прототипы JS; `instanceof` проверяет цепочку прототипов

### Связанные темы

- `019-modifikatory-dostupa.md`
- `009-raznica-abstract-class-i-interface.md`
- `020-dekoratory-v-typescript.md`
