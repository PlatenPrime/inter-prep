# Q011. Что такое `Inversion of Control`?

> **Источник:** [02. architecture.md](../02.%20architecture.md) · **Тема:** Architecture

---

## Короткий ответ

**Inversion of Control (IoC)** — принцип проектирования, при котором **управление потоком выполнения и созданием зависимостей передаётся от компонента к внешнему контейнеру или фреймворку**. Вместо того чтобы класс сам создавал свои зависимости (`new Service()`), они «приходят снаружи». Это «Голливудский принцип»: «Не звони нам — мы позвоним тебе». IoC — принцип; Dependency Injection — наиболее популярный механизм его реализации.

---

## Развёрнутый ответ

### Суть и определение

Термин IoC ввёл Мартин Фаулер (2004). Суть — инверсия двух видов контроля:

1. **Контроль над созданием зависимостей** — вместо `new` объекты создаёт и управляет их жизненным циклом IoC-контейнер.
2. **Контроль над потоком выполнения** — фреймворк вызывает ваш код (callback, lifecycle hooks), а не вы управляете вызовами напрямую.

### Проблема без IoC

```typescript
// ❌ Плохо: класс сам создаёт зависимости — tight coupling
class OrderService {
  private userService: UserService;
  private paymentService: PaymentService;
  private emailService: EmailService;

  constructor() {
    // OrderService знает о конкретных реализациях
    // Нельзя тестировать без реального UserService
    // Нельзя заменить EmailService на другой
    this.userService = new UserService(new PrismaClient());
    this.paymentService = new PaymentService('stripe-secret-key');
    this.emailService = new EmailService('smtp://...');
  }

  async createOrder(userId: string, items: OrderItem[]) {
    const user = await this.userService.findById(userId);
    await this.paymentService.charge(user, items);
    await this.emailService.sendConfirmation(user.email);
  }
}

// Тест невозможен без реальных зависимостей:
const service = new OrderService(); // поднимает БД, Stripe, SMTP
```

### Решение: IoC через Dependency Injection

```typescript
// ✅ Хорошо: зависимости приходят снаружи
// Интерфейсы — контракты, реализации взаимозаменяемы
interface IUserService { findById(id: string): Promise<User> }
interface IPaymentService { charge(user: User, items: OrderItem[]): Promise<void> }
interface IEmailService { sendConfirmation(email: string): Promise<void> }

class OrderService {
  constructor(
    // Зависимости инжектируются — не создаются
    private readonly userService: IUserService,
    private readonly paymentService: IPaymentService,
    private readonly emailService: IEmailService,
  ) {}

  async createOrder(userId: string, items: OrderItem[]) {
    const user = await this.userService.findById(userId);
    await this.paymentService.charge(user, items);
    await this.emailService.sendConfirmation(user.email);
  }
}

// Тест с mock-объектами — мгновенно, без реальных сервисов:
const service = new OrderService(
  { findById: async () => mockUser },
  { charge: vi.fn() },
  { sendConfirmation: vi.fn() },
);
```

### IoC-контейнер

Контейнер — это «фабрика зависимостей», которая знает, как создать каждый тип и как собрать граф зависимостей:

```typescript
// tsyringe (TypeScript IoC-контейнер)
import { injectable, inject, container } from 'tsyringe';

@injectable()
class UserService implements IUserService {
  constructor(@inject('Database') private db: Database) {}
  async findById(id: string) { return this.db.users.findUnique({ where: { id } }); }
}

@injectable()
class OrderService {
  constructor(
    @inject(UserService) private userService: IUserService,
    @inject(PaymentService) private paymentService: IPaymentService,
  ) {}
}

// Регистрация зависимостей
container.register('Database', { useValue: new PrismaClient() });
container.registerSingleton(UserService);
container.registerSingleton(OrderService);

// Разрешение — контейнер сам строит граф
const orderService = container.resolve(OrderService);
// OrderService получит UserService, который получит Database — автоматически
```

### Формы IoC

| Форма IoC | Описание | Пример |
|-----------|----------|--------|
| **Dependency Injection** | Зависимости передаются в конструктор/метод | Constructor injection, Property injection |
| **Service Locator** | Объект сам запрашивает зависимость у реестра | `container.get(UserService)` — антипаттерн в большинстве случаев |
| **Template Method** | Фреймворк определяет алгоритм, вы переопределяете шаги | `React.Component`, lifecycle hooks |
| **Event-Driven** | Фреймворк вызывает ваши обработчики событий | `addEventListener`, Angular `@HostListener` |

### IoC в Angular и NestJS

```typescript
// NestJS — IoC-контейнер встроен
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly emailService: EmailService, // NestJS сам разрешит
  ) {}
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {} // DI через декоратор
}

@Module({
  providers: [UserService, EmailService], // регистрация в контейнере
  controllers: [UserController],
})
export class UserModule {}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем IoC отличается от DI?** — IoC — принцип («управление снаружи»); DI — конкретная техника передачи зависимостей. DI — наиболее частая реализация IoC.
- **Что такое Service Locator и почему это антипаттерн?** — класс сам запрашивает зависимость у глобального реестра; скрывает зависимости, усложняет тестирование.
- **Какие Scopes бывают у зависимостей?** — Singleton (одна копия), Transient (новый объект каждый раз), Scoped (один на запрос/контекст).
- **IoC и SOLID?** — IoC реализует принцип D (Dependency Inversion Principle): «зависеть от абстракций, не от конкреций».

### Красные флаги (чего не говорить)

- «IoC — это только DI» — IoC включает также Template Method, Event-Driven, Service Locator.
- «IoC нужен только для больших приложений» — даже в небольших проектах IoC упрощает тестирование и замену реализаций.
- «`new` в конструкторе — нормально» — нарушает тестируемость; единственное исключение — Value Objects, не имеющие внешних зависимостей.

### Связанные темы

- `012-dependency-injection.md`
- `003-chto-takoe-mvp.md` (Presenter с IView-интерфейсом — IoC в действии)
