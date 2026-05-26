# Q012. Что такое `Dependency Injection`?

> **Источник:** [02. architecture.md](../02.%20architecture.md) · **Тема:** Architecture

---

## Короткий ответ

**Dependency Injection (DI)** — паттерн, при котором объект получает свои зависимости извне, а не создаёт их сам. Вместо `new Service()` внутри класса — передача готовой реализации через конструктор, метод или свойство. DI — конкретный механизм реализации принципа Inversion of Control и принципа D из SOLID (Dependency Inversion Principle). Делает код слабосвязанным, тестируемым и расширяемым.

---

## Развёрнутый ответ

### Суть и определение

DI решает вопрос: «Кто создаёт зависимости?» Ответ: **не тот, кто их использует**. Создатель — внешний код (IoC-контейнер, тест, фабрика).

```
Без DI:   ClassA создаёт → ServiceB { создаёт → DatabaseC }
С DI:     ClassA получает готовый ServiceB (уже настроенный снаружи)
```

### Три вида DI

**1. Constructor Injection** (наиболее предпочтительный):
```typescript
// Зависимости явны, обязательны, immutable после создания
class NotificationService {
  constructor(
    private readonly emailProvider: IEmailProvider,
    private readonly smsProvider: ISmsProvider,
    private readonly logger: ILogger,
  ) {}

  async notify(user: User, message: string): Promise<void> {
    this.logger.info(`Sending notification to ${user.id}`);
    await Promise.all([
      this.emailProvider.send(user.email, message),
      this.smsProvider.send(user.phone, message),
    ]);
  }
}

// Использование: зависимости передаются снаружи
const service = new NotificationService(
  new SendGridEmailProvider(process.env.SENDGRID_KEY),
  new TwilioSmsProvider(process.env.TWILIO_SID),
  new WinstonLogger(),
);
```

**2. Method (Setter) Injection** (для опциональных зависимостей):
```typescript
class ReportGenerator {
  private formatter: IReportFormatter = new DefaultFormatter();

  // Зависимость опциональна — есть дефолт
  setFormatter(formatter: IReportFormatter): void {
    this.formatter = formatter;
  }

  generate(data: ReportData): string {
    return this.formatter.format(data);
  }
}

const generator = new ReportGenerator();
generator.setFormatter(new CsvFormatter()); // при необходимости переопределяем
```

**3. Property Injection** (используется в фреймворках с декораторами):
```typescript
// Angular-style
@Component({ ... })
class UserProfileComponent {
  @Inject(UserService) userService: UserService; // фреймворк инжектирует
}
```

### DI и интерфейсы — ключ к тестируемости

```typescript
// Реальная реализация
class StripePaymentGateway implements IPaymentGateway {
  async charge(amount: number, token: string): Promise<PaymentResult> {
    return stripe.paymentIntents.create({ amount, currency: 'usd' });
  }
}

// Mock для тестов
class MockPaymentGateway implements IPaymentGateway {
  charges: Array<{ amount: number; token: string }> = [];

  async charge(amount: number, token: string): Promise<PaymentResult> {
    this.charges.push({ amount, token });
    return { id: 'mock_pi_123', status: 'succeeded' };
  }
}

// Тест — без реального Stripe, без сети
describe('OrderService', () => {
  it('должен зарядить оплату при создании заказа', async () => {
    const mockGateway = new MockPaymentGateway();
    const service = new OrderService(mockGateway, mockUserRepo, mockLogger);

    await service.createOrder(userId, items);

    expect(mockGateway.charges).toHaveLength(1);
    expect(mockGateway.charges[0].amount).toBe(100_00); // в центах
  });
});
```

### DI-контейнеры в экосистеме JS/TS

```typescript
// NestJS — встроенный IoC-контейнер
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,  // из @nestjs/jwt
    @InjectRepository(User) private userRepo: Repository<User>, // TypeORM
  ) {}

  async login(credentials: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findByEmail(credentials.email);
    if (!user || !await bcrypt.compare(credentials.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };
  }
}

// Модуль регистрирует провайдеры
@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  providers: [AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
```

### DI без контейнера — Composition Root

В небольших приложениях IoC-контейнер избыточен. Dependency composition делается вручную в одном месте:

```typescript
// src/composition-root.ts — единственное место где создаём зависимости
const db = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);

const userRepo = new UserRepository(db);
const productRepo = new ProductRepository(db);
const cacheService = new CacheService(redis);

const userService = new UserService(userRepo, cacheService);
const productService = new ProductService(productRepo, cacheService);
const orderService = new OrderService(userService, productService, new EmailService());

export { userService, productService, orderService };
```

### Анти-паттерны DI

```typescript
// ❌ Service Locator — скрывает зависимости
class OrderService {
  createOrder() {
    const userService = container.get<UserService>('UserService'); // неявная зависимость!
    // Из сигнатуры класса не видно, что ему нужен UserService
  }
}

// ❌ New внутри конструктора
class OrderService {
  private payment = new StripeGateway(); // нельзя заменить в тестах
}

// ❌ Слишком много зависимостей (> 4-5 — признак нарушения SRP)
class GodService {
  constructor(
    private a: ServiceA, private b: ServiceB, private c: ServiceC,
    private d: ServiceD, private e: ServiceE, private f: ServiceF,
  ) {} // → нужно дробить
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница DI и Service Locator?** — DI: зависимости видны в конструкторе (explicit); Service Locator: объект сам запрашивает (implicit, скрытые зависимости).
- **Что такое Dependency Inversion Principle?** — «Высокоуровневые модули не должны зависеть от низкоуровневых; оба должны зависеть от абстракций». DI — механизм его реализации.
- **Какие Scope у зависимостей?** — Singleton (одна копия на приложение), Transient (новый экземпляр каждый раз), Scoped (один на HTTP-запрос).
- **Circular Dependencies — что это и как решать?** — A зависит от B, B зависит от A. Решение: вынести общую логику в C, использовать `forwardRef` в NestJS, переосмыслить ответственности.

### Красные флаги (чего не говорить)

- «DI — это просто передача объекта в конструктор» — важен контракт (интерфейс), а не только механика передачи.
- «Для DI всегда нужен фреймворк» — ручной Composition Root отлично работает для небольших приложений.

### Связанные темы

- `011-inversion-of-control.md`
- `003-chto-takoe-mvp.md` (IView = DI в действии)
