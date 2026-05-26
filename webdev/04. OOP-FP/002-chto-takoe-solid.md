# Q002. Что такое SOLID?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**SOLID** — пять принципов объектно-ориентированного проектирования, сформулированных Робертом Мартином (Uncle Bob). Аббревиатура: **S**ingle Responsibility, **O**pen/Closed, **L**iskov Substitution, **I**nterface Segregation, **D**ependency Inversion. Цель — создавать код, который легко расширять, тестировать и поддерживать, избегая хрупкой архитектуры.

---

## Развёрнутый ответ

### Суть и определение

SOLID описывает, как правильно распределять ответственности между классами, как строить иерархии и как управлять зависимостями. Применим как к ООП, так и к функциональным модулям.

---

### S — Single Responsibility Principle (SRP)

**«Класс должен иметь только одну причину для изменения»**

```typescript
// ❌ Нарушение: User отвечает и за бизнес-логику, и за персистентность
class User {
  constructor(public name: string, public email: string) {}

  save(): void {
    // SQL логика прямо в сущности
    db.query(`INSERT INTO users VALUES ('${this.name}', '${this.email}')`);
  }

  sendWelcomeEmail(): void {
    emailService.send(this.email, 'Welcome!');
  }
}

// ✅ Разделяем ответственности
class User {
  constructor(public name: string, public email: string) {}
}

class UserRepository {
  save(user: User): void { /* работа с БД */ }
}

class UserMailer {
  sendWelcome(user: User): void { /* отправка письма */ }
}
```

---

### O — Open/Closed Principle (OCP)

**«Модуль открыт для расширения, закрыт для модификации»**

```typescript
// ❌ При добавлении нового типа скидки — меняем существующий код
function getDiscount(type: string, price: number): number {
  if (type === 'vip') return price * 0.8;
  if (type === 'student') return price * 0.9;
  // добавить новый тип → редактировать эту функцию
  return price;
}

// ✅ Расширяем через добавление новых классов
interface DiscountStrategy {
  apply(price: number): number;
}

class VipDiscount implements DiscountStrategy {
  apply(price: number) { return price * 0.8; }
}

class StudentDiscount implements DiscountStrategy {
  apply(price: number) { return price * 0.9; }
}

// Новый тип → просто новый класс, существующий код не трогаем
class SeasonalDiscount implements DiscountStrategy {
  apply(price: number) { return price * 0.7; }
}
```

---

### L — Liskov Substitution Principle (LSP)

**«Подтипы должны быть полностью заменяемы своими базовыми типами»**

```typescript
class Rectangle {
  constructor(protected width: number, protected height: number) {}
  setWidth(w: number) { this.width = w; }
  setHeight(h: number) { this.height = h; }
  area() { return this.width * this.height; }
}

// ❌ Square нарушает LSP: изменение одной стороны меняет другую
class Square extends Rectangle {
  setWidth(w: number) { this.width = w; this.height = w; }   // ломает контракт Rectangle
  setHeight(h: number) { this.width = h; this.height = h; }
}

function checkArea(rect: Rectangle) {
  rect.setWidth(4);
  rect.setHeight(5);
  console.log(rect.area()); // ожидаем 20, Square вернёт 25 — нарушение!
}

// ✅ Не наследовать Square от Rectangle — они не являются LSP-совместимыми
interface Shape { area(): number; }
class Rectangle implements Shape { /* ... */ }
class Square implements Shape { /* ... */ }
```

---

### I — Interface Segregation Principle (ISP)

**«Клиент не должен зависеть от методов, которые он не использует»**

```typescript
// ❌ Fat interface — принуждает реализовывать ненужные методы
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class Robot implements Worker {
  work() { /* ... */ }
  eat() { throw new Error('Robots don\'t eat'); } // бессмысленная реализация
  sleep() { throw new Error('Robots don\'t sleep'); }
}

// ✅ Разбиваем на маленькие интерфейсы
interface Workable { work(): void; }
interface Feedable { eat(): void; }
interface Restable { sleep(): void; }

class Human implements Workable, Feedable, Restable {
  work() { /* ... */ }
  eat() { /* ... */ }
  sleep() { /* ... */ }
}

class Robot implements Workable {
  work() { /* ... */ }
}
```

---

### D — Dependency Inversion Principle (DIP)

**«Зависеть от абстракций, а не от конкретных реализаций»**

```typescript
// ❌ Высокоуровневый модуль напрямую создаёт низкоуровневый
class OrderService {
  private emailer = new SmtpEmailer(); // жёсткая зависимость

  placeOrder(order: Order): void {
    // ...
    this.emailer.send(order.userEmail, 'Order confirmed');
  }
}

// ✅ Инверсия: зависим от интерфейса, инжектируем через конструктор
interface Emailer {
  send(to: string, body: string): void;
}

class OrderService {
  constructor(private emailer: Emailer) {}

  placeOrder(order: Order): void {
    // ...
    this.emailer.send(order.userEmail, 'Order confirmed');
  }
}

// В тесте — мок, в проде — реальный SmtpEmailer или SES
const service = new OrderService(new SmtpEmailer());
const testService = new OrderService(new MockEmailer());
```

### Практика и применение

- **SRP** — основа для выделения сервисов/репозиториев в слоистой архитектуре
- **OCP** — стратегии, плагины, middleware-цепочки
- **LSP** — проверка при проектировании иерархий: «является ли B по-настоящему A?»
- **ISP** — мелкогранулярные интерфейсы в TypeScript, React hooks как альтернатива «жирным» компонентам
- **DIP** — IoC-контейнеры (NestJS, InversifyJS), тестируемость через DI

### Важные нюансы и краеугольные камни

- SOLID — **принципы, не правила**: слепое следование ведёт к over-engineering. Применяй там, где появляется реальная боль.
- **SRP ≠ «один метод в классе»** — речь о причинах изменения, а не о размере.
- **LSP** нарушается чаще всего при наследовании ради повторного использования кода, а не ради «является».
- **DIP** не требует IoC-контейнера — достаточно constructor injection.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как SOLID соотносится с DRY/KISS/YAGNI?** — SOLID про структуру, DRY про дублирование; иногда противоречат (SRP может требовать дублирования).
- **Как проверить нарушение LSP?** — Принцип Барбары Лисков: если код работает с базовым типом, он должен работать корректно с любым подтипом без знания о нём.
- **Что такое «причина для изменения» в SRP?** — Изменение требований от конкретного stakeholder или домена: UI-требования vs бизнес-правила vs инфраструктура.
- **Как DIP реализуется в React?** — Props, Context, custom hooks — всё это формы dependency injection без явного DI-контейнера.

### Красные флаги (чего не говорить)

- Расшифровывать аббревиатуру, но не объяснять смысл — «O — это Open Closed» без примера ничего не говорит.
- «SOLID надо всегда применять» — чрезмерное следование создаёт overengineering, особенно в маленьких проектах.
- Путать DIP и DI: DIP — принцип проектирования, DI — техника его реализации.

### Связанные темы

- `001-osnovnye-printsipy-oop.md`
- `003-printsipy-s-nasledovaniem.md`
- `004-printsipy-krome-solid.md`
- `006-kompozitsiya-vs-nasledovanie.md`
