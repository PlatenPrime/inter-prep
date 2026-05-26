# Q029. Что такое GRASP паттерны?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**GRASP (General Responsibility Assignment Software Patterns)** — девять принципов распределения ответственностей между классами и объектами, сформулированных Крейгом Ларманом в книге «Applying UML and Patterns» (1997). В отличие от GoF (которые дают конкретные структуры), GRASP отвечает на вопрос **«кто отвечает за что?»** при проектировании объектной модели.

---

## Развёрнутый ответ

### Суть и определение

GRASP — не паттерны в смысле GoF-шаблонов, а **принципы принятия решений** о распределении ответственностей. Они помогают ответить на вопросы: «Какому классу добавить этот метод?», «Кто должен создавать этот объект?».

---

### 9 принципов GRASP

#### 1. Information Expert (Эксперт по информации)

**Ответственность получает класс, имеющий нужную информацию.**

```typescript
// ❌ Неверно: Order ищет total снаружи
class OrderService {
  calcTotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

// ✅ Верно: Order сам знает свои items — он эксперт
class Order {
  constructor(private items: OrderItem[]) {}

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
```

---

#### 2. Creator (Создатель)

**Класс B должен создавать A если:** B содержит A, B агрегирует A, B записывает A, B тесно использует A.

```typescript
// Order агрегирует OrderItem → Order создаёт OrderItem
class Order {
  private items: OrderItem[] = [];

  addItem(productId: string, price: number, quantity: number): void {
    // Order — создатель OrderItem
    this.items.push(new OrderItem(productId, price, quantity));
  }
}
```

---

#### 3. Controller (Контроллер)

**Системные события обрабатывает объект-контроллер** — не UI и не доменные объекты напрямую.

```typescript
// Controller принимает HTTP-запросы, делегирует Service
class OrderController {
  constructor(private orderService: OrderService) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    // Контроллер: приём запроса + делегирование + ответ
    const order = await this.orderService.create(req.body);
    res.status(201).json(order);
  }
}
```

---

#### 4. Low Coupling (Слабая связанность)

**Минимизировать зависимости между классами.** Высокая связность → хрупкость, сложность тестирования.

```typescript
// ❌ Высокая связность: UserService знает о конкретном EmailClient
class UserService {
  private emailer = new SmtpEmailer(); // жёсткая зависимость

  register(data: CreateUserDto): void {
    const user = this.createUser(data);
    this.emailer.send(user.email, 'Welcome'); // зависимость от конкретной реализации
  }
}

// ✅ Слабая связность: зависим от абстракции (интерфейса)
class UserService {
  constructor(private emailer: Mailer) {} // интерфейс, не конкретный класс

  register(data: CreateUserDto): void {
    const user = this.createUser(data);
    this.emailer.send(user.email, 'Welcome');
  }
}
```

---

#### 5. High Cohesion (Высокая связность)

**Классы должны быть фокусированными** — иметь близко связанные ответственности.

```typescript
// ❌ Низкая связность: класс делает всё
class UserManager {
  createUser(data: unknown): void { /* ... */ }
  sendEmail(to: string): void { /* ... */ }
  generateReport(): string { /* ... */ }
  exportToCsv(): void { /* ... */ }
  // Четыре несвязанные ответственности
}

// ✅ Высокая связность: каждый класс фокусирован
class UserService { createUser(data: CreateUserDto): User { /* ... */ } }
class Mailer { send(to: string, body: string): void { /* ... */ } }
class ReportGenerator { generate(data: unknown): string { /* ... */ } }
```

---

#### 6. Polymorphism (Полиморфизм)

**Вариантное поведение через полиморфизм, а не через if/switch по типу.**

```typescript
// ❌ Switch по типу — нарушение полиморфизма
function processPayment(method: string, amount: number): void {
  if (method === 'card') { /* Stripe */ }
  else if (method === 'paypal') { /* PayPal */ }
  else if (method === 'crypto') { /* Crypto */ }
}

// ✅ Полиморфизм — новый метод = новый класс
interface PaymentMethod {
  charge(amount: number): Promise<void>;
}

class CardPayment implements PaymentMethod {
  async charge(amount: number) { /* Stripe */ }
}

class PayPalPayment implements PaymentMethod {
  async charge(amount: number) { /* PayPal */ }
}

// processPayment получает PaymentMethod — не знает о конкретных реализациях
async function processPayment(method: PaymentMethod, amount: number) {
  await method.charge(amount);
}
```

---

#### 7. Pure Fabrication (Чистая выдумка)

**Иногда нужен класс без аналога в предметной области** — чтобы обеспечить Low Coupling и High Cohesion.

```typescript
// Предметная область: User, Order, Product — реальные сущности
// Repository — не сущность предметной области, но нужен для декаплинга

class UserRepository {  // «Чистая выдумка» — сервисный класс
  async findById(id: string): Promise<User | null> { /* DB query */ }
  async save(user: User): Promise<void> { /* DB insert/update */ }
}

// UserService не работает с DB напрямую — через Repository
class UserService {
  constructor(private repo: UserRepository) {}
  async getUser(id: string): Promise<User | null> { return this.repo.findById(id); }
}
```

---

#### 8. Indirection (Посредник/Косвенность)

**Вводи промежуточный объект для ослабления связанности.**

```typescript
// Прямая зависимость Controller → Database: сложно менять, тестировать
// Вводим Repository (посредник):
// Controller → Service → Repository → Database
// Каждый слой знает только о следующем
```

---

#### 9. Protected Variations (Защита от изменений)

**Идентифицируй точки нестабильности и скрой их за интерфейсом.**

```typescript
// Точка нестабильности: конкретный поставщик платежей
// Скрываем за интерфейсом:
interface PaymentGateway {
  charge(amount: number, token: string): Promise<PaymentResult>;
}

// Если меняем Stripe на Braintree — только реализация меняется, не код сервиса
class StripeGateway implements PaymentGateway { /* ... */ }
class BraintreeGateway implements PaymentGateway { /* ... */ }
```

---

### GRASP vs GoF

| Аспект | GRASP | GoF |
|--------|-------|-----|
| Назначение | Принципы распределения ответственностей | Конкретные структурные шаблоны |
| Уровень | Стратегический (почему) | Тактический (как) |
| Вопрос | «Кому поручить?» | «Как реализовать?» |
| Применение | При проектировании объектной модели | При реализации конкретных задач |

### Практика и применение

- **Low Coupling + High Cohesion** — фундамент для DI и слоистой архитектуры
- **Information Expert** — предотвращает «анемичную доменную модель» (когда сущности — просто DTO)
- **Pure Fabrication** — обоснование для Repository, Service, Gateway классов

### Важные нюансы и краеугольные камни

- GRASP менее известен чем GoF, но более фундаментален — GoF-паттерны часто следуют из GRASP
- **Low Coupling и High Cohesion** противоречат друг другу при неправильном проектировании: слишком много маленьких классов = много связей
- **Анемичная доменная модель** — антипаттерн, нарушающий Information Expert: сущности без методов, вся логика в сервисах

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем GRASP отличается от SOLID?** — GRASP: распределение ответственностей (кому что); SOLID: принципы проектирования классов (как строить). Пересекаются: Low Coupling ≈ DIP, High Cohesion ≈ SRP.
- **Что такое анемичная доменная модель?** — Сущности без методов, только геттеры/сеттеры; вся логика в сервисах. Нарушает Information Expert.
- **Как Information Expert связан с DDD?** — В DDD Rich Domain Model — прямое следствие Information Expert: поведение принадлежит сущности, знающей о своих данных.

### Красные флаги (чего не говорить)

- «GRASP — это то же самое что GoF» — принципиально разный уровень абстракции.
- «Никогда не слышал о GRASP» — это показывает пробел в фундаментальном понимании ОО-проектирования.

### Связанные темы

- `028-chto-takoe-gof-patterny.md`
- `002-chto-takoe-solid.md`
- `001-osnovnye-printsipy-oop.md`
- `027-tipy-patternov.md`
