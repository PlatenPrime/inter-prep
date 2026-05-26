# Q001. Основные принципы ООП?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**ООП (объектно-ориентированное программирование)** строится на четырёх фундаментальных принципах: **инкапсуляция** (скрытие внутреннего состояния за интерфейсом), **наследование** (переиспользование поведения через иерархию), **полиморфизм** (единый интерфейс для разных типов) и **абстракция** (сокрытие деталей реализации, работа с сущностями через контракты). Вместе они позволяют строить системы, которые легко расширять и поддерживать.

---

## Развёрнутый ответ

### Суть и определение

ООП — парадигма программирования, в которой программа моделируется как взаимодействие **объектов**: единиц, сочетающих данные (поля/свойства) и поведение (методы). Исторически сформировалась в Simula (1960-е) и Smalltalk (1970-е), стала доминирующей с появлением C++ и Java.

### Четыре принципа

#### 1. Инкапсуляция (Encapsulation)

Объект скрывает внутреннее состояние и предоставляет только публичный интерфейс. Прямой доступ к данным снаружи ограничен.

```typescript
class BankAccount {
  private balance: number;

  constructor(initial: number) {
    this.balance = initial;
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

const acc = new BankAccount(100);
acc.deposit(50);
// acc.balance = 9999; // ❌ ошибка компилятора — поле private
```

**Зачем:** изменение внутренней реализации не ломает внешний код; валидация данных централизована.

#### 2. Наследование (Inheritance)

Дочерний класс перенимает поля и методы родительского, может их переопределять или расширять.

```typescript
class Animal {
  constructor(protected name: string) {}
  speak(): string { return `${this.name} makes a sound`; }
}

class Dog extends Animal {
  speak(): string { return `${this.name} barks`; }
  fetch(): void { console.log(`${this.name} fetches the ball`); }
}

const dog = new Dog('Rex');
dog.speak();  // "Rex barks"
dog.fetch();  // "Rex fetches the ball"
```

**Зачем:** переиспользование кода. **Ловушка:** глубокие иерархии становятся хрупкими — предпочитайте композицию.

#### 3. Полиморфизм (Polymorphism)

Один интерфейс — разные реализации. Код, работающий с базовым типом, автоматически работает с любым подтипом.

```typescript
abstract class Shape {
  abstract area(): number;
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }
  area(): number { return Math.PI * this.radius ** 2; }
}

class Rectangle extends Shape {
  constructor(private w: number, private h: number) { super(); }
  area(): number { return this.w * this.h; }
}

function printArea(shape: Shape): void {
  console.log(shape.area()); // не знает, кто именно
}

printArea(new Circle(5));      // 78.5
printArea(new Rectangle(4, 6)); // 24
```

**Зачем:** новые типы добавляются без изменения существующего кода — открытость для расширения (Open/Closed Principle).

#### 4. Абстракция (Abstraction)

Работа с объектом через контракт (интерфейс/абстрактный класс), не думая о деталях реализации.

```typescript
interface Logger {
  log(message: string): void;
  error(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string) { console.log(`[INFO] ${message}`); }
  error(message: string) { console.error(`[ERROR] ${message}`); }
}

class FileLogger implements Logger {
  log(message: string) { /* записать в файл */ }
  error(message: string) { /* записать в файл */ }
}

// Код сервиса зависит от абстракции, не от конкретного класса
class UserService {
  constructor(private logger: Logger) {}
  createUser(name: string) {
    this.logger.log(`Creating user: ${name}`);
  }
}
```

### Как принципы связаны

```
Абстракция  →  определяет контракт (что)
Инкапсуляция → скрывает реализацию (как)
Наследование → переиспользует реализацию
Полиморфизм  → подставляет нужную реализацию в рантайме
```

### Важные нюансы и краеугольные камни

- **Наследование — не всегда лучший выбор.** «Favour composition over inheritance» (GoF). Глубокие иерархии создают тесную связанность.
- **Полиморфизм реализуется через интерфейсы, не только классы.** В TypeScript/JavaScript duck typing и interface polymorphism предпочтительнее иерархий.
- **Инкапсуляция ≠ `private`.** Это про контракт: даже `public` поля могут быть «правильно инкапсулированы», если не нарушают инвариантов объекта.
- **JavaScript** — прототипный язык; классы (`class`) — синтаксический сахар поверх прототипной цепочки.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем отличается абстракция от инкапсуляции?** — Абстракция скрывает сложность через интерфейс («что делает»), инкапсуляция скрывает данные («как хранит»).
- **Можно ли обойтись без наследования?** — Да, через интерфейсы + композиция; в современном JS/TS это предпочтительный подход.
- **Что такое полиморфизм подтипов vs параметрический?** — Подтипов: override метода в дочернем классе; параметрический: generics (`Array<T>`).
- **Как ООП соотносится с принципами SOLID?** — SOLID — это конкретизация ООП-принципов для проектирования классов и модулей.

### Красные флаги (чего не говорить)

- «Инкапсуляция — это просто `private`» — это частный случай, суть шире.
- Путать абстракцию с наследованием — абстракция про скрытие деталей, наследование про повторное использование кода.
- «ООП лучше ФП» — разные инструменты для разных задач, оба подхода используются в современном коде.

### Связанные темы

- `002-chto-takoe-solid.md`
- `010-tipy-polimorfizma.md`
- `015-mekhanizm-prototipov-v-js.md`
- `006-kompozitsiya-vs-nasledovanie.md`
