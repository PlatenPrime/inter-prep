# Q010. Какие паттерны разработки вы бы рекомендовали для улучшения масштабируемости веб-приложений?

> **Источник:** [02. architecture.md](../02.%20architecture.md) · **Тема:** Architecture

---

## Короткий ответ

Для масштабируемости веб-приложений ключевые паттерны: **горизонтальное масштабирование** с **stateless-сервисами**, **кэширование** (CDN, Redis), **асинхронная обработка через очереди**, **CQRS** (разделение чтения и записи), **Event-Driven Architecture**, **Database Sharding/Read Replicas** и **Circuit Breaker** для fault tolerance. На уровне кода — **Feature Slices**, **Repository Pattern**, **Lazy Loading**.

---

## Развёрнутый ответ

### 1. Stateless-сервисы + горизонтальное масштабирование

Первое условие масштабируемости — отсутствие состояния в сервисе. Любой инстанс должен обслужить любой запрос.

```typescript
// ❌ Плохо: состояние в памяти сервиса — нельзя горизонтально масштабировать
class SessionService {
  private sessions = new Map<string, User>(); // умрёт при scale-out

  get(token: string) { return this.sessions.get(token); }
  set(token: string, user: User) { this.sessions.set(token, user); }
}

// ✅ Хорошо: состояние во внешнем хранилище
class SessionService {
  constructor(private readonly redis: Redis) {}

  async get(token: string): Promise<User | null> {
    const data = await this.redis.get(`session:${token}`);
    return data ? JSON.parse(data) : null;
  }
  async set(token: string, user: User): Promise<void> {
    await this.redis.setex(`session:${token}`, 3600, JSON.stringify(user));
  }
}
```

### 2. Кэширование — CDN + Redis

```typescript
// Multi-level caching
class ProductService {
  constructor(
    private readonly db: Database,
    private readonly redis: Redis,
  ) {}

  async getProduct(id: string): Promise<Product> {
    // L1: Redis cache
    const cached = await this.redis.get(`product:${id}`);
    if (cached) return JSON.parse(cached);

    // L2: Database
    const product = await this.db.products.findUnique({ where: { id } });
    if (!product) throw new NotFoundError(`Product ${id}`);

    // Кэшируем на 5 минут
    await this.redis.setex(`product:${id}`, 300, JSON.stringify(product));
    return product;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const updated = await this.db.products.update({ where: { id }, data });
    // Инвалидация кэша при обновлении
    await this.redis.del(`product:${id}`);
    return updated;
  }
}
```

### 3. Асинхронная обработка через очереди (Message Queue)

Тяжёлые операции выносятся из request-response цикла:

```typescript
// ❌ Плохо: отправка email в запросе — пользователь ждёт
app.post('/orders', async (req, res) => {
  const order = await createOrder(req.body);
  await sendConfirmationEmail(order); // блокирует на 2–3 сек
  await generateInvoicePDF(order);    // ещё 5 сек
  res.json(order);
});

// ✅ Хорошо: быстрый ответ + асинхронная обработка
app.post('/orders', async (req, res) => {
  const order = await createOrder(req.body);
  // Публикуем событие — не ждём результата
  await queue.publish('order.created', { orderId: order.id });
  res.status(201).json(order); // ответ за <100ms
});

// Воркер обрабатывает асинхронно
queue.consume('order.created', async ({ orderId }) => {
  const order = await getOrder(orderId);
  await sendConfirmationEmail(order);
  await generateInvoicePDF(order);
});
```

### 4. CQRS (Command Query Responsibility Segregation)

Разделение чтения и записи — разные модели, разные хранилища:

```typescript
// Command Side — запись, оптимизирована для consistency
class CreateOrderCommand {
  constructor(readonly userId: string, readonly items: OrderItem[]) {}
}

class OrderCommandHandler {
  async handle(command: CreateOrderCommand): Promise<string> {
    const order = Order.create(command.userId, command.items);
    await this.orderRepo.save(order);
    await this.eventBus.publish(new OrderCreatedEvent(order.id));
    return order.id;
  }
}

// Query Side — чтение, оптимизирована для скорости (денормализована)
class GetOrderDashboardQuery {
  constructor(readonly userId: string) {}
}

class OrderQueryHandler {
  // Читает из read-model (может быть отдельная БД, Redis, Elasticsearch)
  async handle(query: GetOrderDashboardQuery): Promise<OrderDashboard> {
    return this.readDb.query(
      `SELECT o.id, o.total, p.name FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN products p ON p.id = oi.product_id
       WHERE o.user_id = $1`,
      [query.userId],
    );
  }
}
```

### 5. Circuit Breaker — fault tolerance при зависимостях

```typescript
import CircuitBreaker from 'opossum';

const paymentCircuitBreaker = new CircuitBreaker(
  (order: Order) => paymentService.charge(order),
  {
    timeout: 3000,          // считаем упавшим если > 3s
    errorThresholdPercentage: 50, // открыть при 50% ошибок
    resetTimeout: 30000,    // попробовать снова через 30s
  },
);

paymentCircuitBreaker.fallback((order) => ({
  status: 'pending',
  message: 'Payment queued for retry',
}));

// Использование
const result = await paymentCircuitBreaker.fire(order);
```

### 6. Database Patterns для масштабирования

```
Read Replicas:
  Primary (write) ──► Replica 1 (read)
                  ──► Replica 2 (read)
                  ──► Replica 3 (read)

Sharding (горизонтальное):
  user_id % 4 == 0 → Shard A
  user_id % 4 == 1 → Shard B
  user_id % 4 == 2 → Shard C
  user_id % 4 == 3 → Shard D
```

### 7. Паттерны масштабируемости на уровне кода

```typescript
// Lazy Loading — загрузка только нужного кода
const AdminPanel = lazy(() => import('./admin/AdminPanel'));

// Repository Pattern — абстракция над БД позволяет менять хранилище
interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

// Feature Slices — каждая фича изолирована, нет god-модулей
// /features/cart/
// /features/checkout/
// /features/user-profile/
```

---

## Итоговая карта паттернов

| Уровень | Паттерн | Что решает |
|---------|---------|------------|
| Инфраструктура | Stateless + горизонтальное масштабирование | Единая точка отказа |
| Кэширование | CDN, Redis multi-level | Нагрузка на БД, latency |
| Данные | Read Replicas, CQRS, Sharding | Узкое место БД |
| Интеграция | Message Queue, Event-Driven | Блокировки, tight coupling |
| Reliability | Circuit Breaker, Retry, Timeout | Каскадные отказы |
| Код | Feature Slices, Repository, Lazy Load | Maintainability при росте |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что масштабировать в первую очередь?** — сначала профилируй: 80% проблем решаются индексами и кэшем, не архитектурными изменениями.
- **Как избежать cache stampede?** — probabilistic early expiration, mutex lock при первом cache miss, background refresh.
- **Что такое eventual consistency и когда её принимать?** — при CQRS/Event-Driven read-model может отставать; допустимо для аналитики, нет — для балансов и критических данных.
- **Чем отличается вертикальное масштабирование от горизонтального?** — вертикальное: мощнее сервер (предел существует); горизонтальное: больше инстансов (теоретически безгранично, требует stateless).

### Красные флаги (чего не говорить)

- «Микросервисы = масштабируемость» — микросервисы — организационный паттерн; масштабируемость достигается через stateless + кэш + очереди независимо от архитектуры.
- «Сначала оптимизируй архитектуру» — preoptimization: сначала measure, потом оптимизируй узкое место.

### Связанные темы

- `005-raznica-monolita-i-mikroservisov.md`, `007-serverless-arhitektura.md`
- `009-chto-takoe-flux.md`, `011-inversion-of-control.md`
