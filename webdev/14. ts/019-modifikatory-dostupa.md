# Q019. Модификаторы доступа в TypeScript?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

TypeScript поддерживает четыре модификатора доступа: **`public`** (доступен везде, по умолчанию), **`private`** (только внутри класса, compile-time), **`protected`** (класс и наследники), **`readonly`** (нельзя переназначить после инициализации). С ES2022 также поддерживается нативный `#field` — настоящая рантайм-приватность.

---

## Развёрнутый ответ

### Суть и определение

Модификаторы доступа — инструмент **инкапсуляции**: ограничение видимости полей и методов класса снаружи. TypeScript добавляет их поверх JavaScript, но **только на уровне компилятора** (кроме `#private`).

### Как это работает

#### `public` — открытый (по умолчанию)

```typescript
class User {
  public name: string;     // явно public
  email: string;           // неявно public — то же самое

  public greet(): string {
    return `Hello, ${this.name}`;
  }
}

const user = new User();
user.name = "Alice";  // OK
user.greet();         // OK
```

#### `private` — приватный (compile-time)

```typescript
class BankAccount {
  private balance: number = 0;
  private readonly ownerId: string;

  constructor(ownerId: string) {
    this.ownerId = ownerId;
  }

  deposit(amount: number): void {
    this.balance += amount; // OK внутри класса
  }

  getBalance(): number {
    return this.balance;
  }
}

const account = new BankAccount("user-1");
account.balance;  // Error: Property 'balance' is private
// Но в рантайме: (account as any).balance — доступен! TS только компайл-тайм
```

#### `protected` — защищённый

```typescript
class Animal {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  protected describe(): string {
    return `Animal: ${this.name}`;
  }
}

class Dog extends Animal {
  bark(): string {
    return `${this.name} says Woof!`; // OK — protected доступен в наследнике
  }
}

const dog = new Dog("Rex");
dog.name;      // Error: 'name' is protected — снаружи иерархии недоступен
dog.bark();    // OK — публичный метод использует protected поле
```

#### `readonly` — только для чтения

```typescript
class Config {
  readonly host: string;
  readonly port: number;

  constructor(host: string, port: number) {
    this.host = host; // OK в конструкторе
    this.port = port;
  }

  updateHost(newHost: string): void {
    this.host = newHost; // Error: Cannot assign to 'host' because it is a read-only property
  }
}

// Комбинирование модификаторов
class Entity {
  private readonly id: string; // приватный и неизменяемый

  constructor() {
    this.id = crypto.randomUUID();
  }
}
```

#### Сокращённый синтаксис в конструкторе

```typescript
class Point {
  constructor(
    public readonly x: number,
    public readonly y: number,
    private label: string = "point"
  ) {
    // Поля создаются автоматически: this.x, this.y, this.label
  }

  toString(): string {
    return `${this.label}(${this.x}, ${this.y})`;
  }
}
```

#### Нативная приватность ES2022 (`#field`)

```typescript
class SecureVault {
  #secret: string;        // настоящий private — рантайм
  #accessCount = 0;

  constructor(secret: string) {
    this.#secret = secret;
  }

  reveal(password: string): string | null {
    this.#accessCount++;
    return password === "correct" ? this.#secret : null;
  }
}

const vault = new SecureVault("treasure");
(vault as any)["#secret"]; // undefined — реально недоступно в рантайме
vault.#secret;              // SyntaxError
```

#### `static` — статические члены (не модификатор доступа, но связан)

```typescript
class Counter {
  private static count = 0;

  constructor() {
    Counter.count++;
  }

  static getCount(): number {
    return Counter.count;
  }
}
```

### Практика и применение

```typescript
// Паттерн: Domain Entity с инкапсуляцией
class Order {
  private _status: "pending" | "paid" | "shipped" | "cancelled" = "pending";
  private readonly _items: OrderItem[] = [];
  readonly id: string;
  readonly createdAt: Date;

  constructor(private readonly customerId: string) {
    this.id = crypto.randomUUID();
    this.createdAt = new Date();
  }

  get status() { return this._status; }
  get items(): ReadonlyArray<OrderItem> { return this._items; }

  addItem(item: OrderItem): void {
    if (this._status !== "pending") {
      throw new Error("Cannot modify non-pending order");
    }
    this._items.push(item);
  }

  pay(): void {
    if (this._status !== "pending") throw new Error("Already processed");
    this._status = "paid";
  }
}
```

### Важные нюансы и краеугольные камни

- **`private` TypeScript — только compile-time**: `(obj as any).privateField` — рантайм даст значение
- **`#field` JavaScript — настоящий рантайм private**: `Object.getOwnPropertyNames(obj)` не показывает
- **`protected` в тестах**: тестирование protected методов через наследование (`class TestableClass extends ProductionClass {}`)
- **`readonly` vs `const`**: `const` — для переменных; `readonly` — для полей класса/объектных типов
- **`readonly` массивы**: `readonly T[]` или `ReadonlyArray<T>` — нельзя вызвать `push`, `pop` и другие мутирующие методы
- **Модификаторы в интерфейсах**: `readonly` работает; `public` допускается; `private`/`protected` — нет (только для классов)

### Примеры

```typescript
// Таблица: что и откуда доступно
class Base {
  public pub = "public";
  protected prot = "protected";
  private priv = "private";
  readonly ro = "readonly";
  #native = "native";

  testSelf() {
    this.pub;    // OK
    this.prot;   // OK
    this.priv;   // OK
    this.ro;     // OK (read)
    this.ro = ""; // Error
    this.#native; // OK
  }
}

class Child extends Base {
  testChild() {
    this.pub;    // OK
    this.prot;   // OK
    this.priv;   // Error: private
    this.ro;     // OK (read)
    this.#native; // Error: не наследуется #
  }
}

const obj = new Base();
obj.pub;    // OK
obj.prot;   // Error: protected
obj.priv;   // Error: private
obj.ro;     // OK (read)
obj.ro = ""; // Error: readonly
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем TS `private` отличается от JS `#field`?** — TS `private` стирается; `#field` — настоящая инкапсуляция в рантайме
- **Когда использовать `protected` vs `private`?** — `private` если никто кроме класса не должен иметь доступ; `protected` если наследники должны переопределять/использовать
- **Как протестировать `private` метод?** — через публичный метод; или тестируй через наследование; или пересмотри дизайн (приватный метод, который хочется тестировать — кандидат на отдельный класс)
- **Что такое `readonly` в интерфейсе?** — поле нельзя переназначить через переменную этого типа; но если объект создан без `readonly` — можно изменить через другую ссылку

### Красные флаги (чего не говорить)

- «`private` в TypeScript — это как `private` в Java» — нет, только compile-time; в JS рантайме поле доступно через `as any`
- «`readonly` — это `const` для классов» — `const` для переменных; `readonly` для полей; `Object.freeze()` для рантайм-иммутабельности объектов
- «`protected` нельзя использовать в интерфейсе» — можно `readonly`, но `protected`/`private` — только для классов

### Связанные темы

- `018-elementy-oop-v-typescript.md`
- `009-raznica-abstract-class-i-interface.md`
- `020-dekoratory-v-typescript.md`
