# Q006. Плюсы и минусы монолитной и микросервисной архитектур?

> **Источник:** [02. architecture.md](../02.%20architecture.md) · **Тема:** Architecture

---

## Короткий ответ

**Монолит**: прост в разработке и деплое, быстр в начале, но плохо масштабируется горизонтально, одна ошибка может уронить всё, CI/CD замедляется с ростом. **Микросервисы**: независимый деплой, точечное масштабирование, изоляция отказов — но ценой операционной сложности, distributed transactions, latency по сети и необходимости DevOps-культуры.

---

## Развёрнутый ответ

### Плюсы и минусы монолита

#### Плюсы монолита

**1. Простота разработки на старте**
```typescript
// Рефакторинг в монолите — обычный IDE rename/move
// Нет версионирования API между модулями
import { OrderService } from './orders/order.service'; // просто импорт
```

**2. Простой деплой**
```yaml
# docker-compose.yml монолита
services:
  app:
    image: my-app:1.0.0
    ports: ["3000:3000"]
  db:
    image: postgres:16
```

**3. Транзакции «из коробки» (ACID)**
```typescript
// В монолите — одна БД, транзакция между модулями тривиальна
await db.transaction(async (tx) => {
  await tx.order.create({ ... });
  await tx.inventory.decrement({ ... }); // атомарно
  await tx.payment.create({ ... });
});
```

**4. Низкая latency вызовов между модулями** — in-process вызов, нет сетевого overhead.

**5. Проще дебаггировать** — единый стектрейс, один лог, один process.

#### Минусы монолита

**1. Масштабирование «всё или ничего»**
```
Нагружен только модуль Orders?
→ Приходится масштабировать ВСЁ приложение целиком.
→ Дорого, неэффективно.
```

**2. Deployment coupling** — изменение одного модуля требует деплоя всего приложения.

**3. Риск «Massive Module»** — нет физической границы; со временем модули начинают знать о внутренностях друг друга.

**4. Сложность CI/CD при росте** — на большой кодовой базе сборка и тесты занимают всё больше времени; один сломанный тест блокирует деплой всего.

**5. Технологический lock-in** — нельзя использовать Go для одной функции и Python для ML-части.

---

### Плюсы и минусы микросервисов

#### Плюсы микросервисов

**1. Независимый деплой**
```
Team A деплоит User Service v2.1 → не затрагивает Order Service v1.8
```

**2. Точечное масштабирование**
```yaml
# Kubernetes HPA — масштабируем только нагруженный сервис
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: order-service-hpa
spec:
  scaleTargetRef:
    name: order-service
  minReplicas: 2
  maxReplicas: 50  # только этот сервис, не все
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          averageUtilization: 70
```

**3. Изоляция отказов (Fault Isolation)**
```typescript
// Circuit Breaker: если Payment Service упал,
// Order Service деградирует, но не умирает
const paymentResult = await circuitBreaker.fire(() =>
  paymentClient.charge(order),
).catch(() => ({ status: 'pending', fallback: true })); // graceful degradation
```

**4. Технологическая свобода (Polyglot)**
```
User Service → Node.js + PostgreSQL
ML Recommendations → Python + Redis
Video Processing → Go + S3
```

**5. Соответствие Conway's Law** — команды владеют своими сервисами, независимы в решениях.

#### Минусы микросервисов

**1. Distributed Transactions — сложность**
```typescript
// Проблема: нет ACID-транзакции через сервисы
// Решение: Saga Pattern

// Choreography Saga — через события
await eventBus.publish('order.created', orderId);
// Payment Service слушает, при ошибке публикует 'payment.failed'
// Order Service слушает 'payment.failed', делает компенсацию
```

**2. Network latency и ненадёжность**
```typescript
// Каждый вызов — потенциальный timeout, retry, partial failure
const user = await retry(
  () => httpClient.get(`/users/${id}`),
  { retries: 3, delay: 100, backoff: 2 },
);
```

**3. Operational complexity**
```
Нужно поднять и поддерживать:
- Service Discovery (Consul / Kubernetes DNS)
- API Gateway
- Distributed Tracing (Jaeger / Zipkin)
- Centralized Logging (ELK / Loki)
- Secret Management (Vault)
- Health checks, liveness/readiness probes
```

**4. Тестирование** — нужны Contract Tests (Pact), интеграционные среды, Consumer-Driven Contract testing.

**5. Versioning API между сервисами** — обратная совместимость обязательна; breaking change требует координации.

---

## Итоговое сравнение

| Критерий | Монолит | Микросервисы |
|----------|---------|--------------|
| **Сложность на старте** | Низкая | Высокая |
| **Независимый деплой** | Нет | Да |
| **Масштабирование** | Целиком | Точечное |
| **ACID-транзакции** | Легко | Сложно (Saga) |
| **Изоляция отказов** | Нет | Да |
| **Latency вызовов** | Нет (in-process) | Есть (сеть) |
| **Технологическая гибкость** | Нет | Да |
| **Observability** | Простая | Сложная (tracing) |
| **DevOps требования** | Низкие | Высокие |
| **Подходит для** | Стартап, маленькая команда | Зрелый продукт, несколько команд |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **«Модульный монолит» — это компромисс?** — Да: чёткие модульные границы без сетевых вызовов. Проще мигрировать в микросервисы потом.
- **Как определить границы сервисов?** — по бизнес-доменам (DDD Bounded Contexts), не по техническим слоям.
- **Как мигрировать монолит в микросервисы?** — Strangler Fig Pattern: постепенно «выкусывать» модули, ставить прокси перед монолитом.
- **Что такое «distributed monolith»?** — антипаттерн: микросервисы с тесными зависимостями друг от друга; нет изоляции, но есть вся сложность микросервисов.

### Красные флаги (чего не говорить)

- «Надо сразу начинать с микросервисов» — overhead убивает скорость на ранних стадиях.
- «Микросервисы решают все проблемы масштабируемости» — сначала оптимизируй монолит (кэш, индексы, очереди); микросервисы — это организационное, а не только техническое решение.

### Связанные темы

- `005-raznica-monolita-i-mikroservisov.md`, `007-serverless-arhitektura.md`
- `010-patterny-masshtabiruemost.md`
