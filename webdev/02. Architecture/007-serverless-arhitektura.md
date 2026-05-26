# Q007. Что такое `Server-less` архитектура?

> **Источник:** [02. architecture.md](../02.%20architecture.md) · **Тема:** Architecture

---

## Короткий ответ

**Serverless** — модель выполнения, при которой разработчик пишет **функции** (FaaS — Function as a Service), не управляя серверами: облачный провайдер автоматически выделяет ресурсы на время выполнения, масштабирует до нуля при отсутствии нагрузки и списывает оплату только за фактическое время выполнения. «Serverless» не значит «без серверов» — серверы есть, но ими управляет провайдер, а не вы.

---

## Развёрнутый ответ

### Суть и определение

Serverless включает два концепта:

1. **FaaS (Function as a Service)** — AWS Lambda, Google Cloud Functions, Azure Functions, Cloudflare Workers. Единица деплоя — функция, не сервис/контейнер.
2. **BaaS (Backend as a Service)** — Firebase, Supabase, Auth0, Stripe. Готовые бэкенд-сервисы (БД, авторизация, хранилище), которые подключаются через API.

```
Традиционный сервер:
  Купить/арендовать сервер → Настроить OS → Задеплоить → Платить 24/7

Serverless:
  Написать функцию → Задеплоить → Платить только за вызовы
  Масштабирование: 0 → ∞ → 0 (автоматически)
```

### Как это работает

```typescript
// AWS Lambda — функция, реагирующая на событие
import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userId } = event.pathParameters ?? {};

  if (!userId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'userId required' }) };
  }

  // Функция stateless — нет «памяти» между вызовами
  const user = await db.users.findUnique({ where: { id: userId } });

  if (!user) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  };
};
```

```yaml
# serverless.yml (Serverless Framework)
service: user-api
provider:
  name: aws
  runtime: nodejs20.x
  region: eu-west-1

functions:
  getUser:
    handler: src/handlers/user.handler
    events:
      - http:
          path: /users/{userId}
          method: GET
    timeout: 10
    memorySize: 256
```

### Типичные триггеры функций

| Тип триггера | Пример |
|---|---|
| HTTP (API Gateway) | REST/GraphQL API |
| Queue (SQS, Pub/Sub) | Обработка сообщений асинхронно |
| Schedule (cron) | Ежечасный отчёт, очистка данных |
| Storage event (S3, GCS) | Обработка загруженного изображения |
| Database trigger | Реакция на изменение в Firestore |
| Stream (Kinesis, Kafka) | Обработка потока событий |

### Cold Start — главная проблема производительности

```
Первый вызов функции после «простоя»:
  Cold Start: 200ms–2s (Node.js), до 5s (Java)
  → Инициализация контейнера, загрузка кода, подключение к БД

Последующие вызовы:
  Warm Start: 1–50ms
```

```typescript
// Минимизация cold start: инициализация вне handler
// ❌ Плохо: подключение к БД на каждый вызов
export const handler = async (event) => {
  const db = new PrismaClient(); // cold start каждый раз
  return db.users.findMany();
};

// ✅ Хорошо: подключение переиспользуется в warm invocations
const db = new PrismaClient(); // один раз при инициализации контейнера

export const handler = async (event) => {
  return db.users.findMany();
};
```

### Плюсы и минусы

| Аспект | Плюсы | Минусы |
|--------|-------|--------|
| Масштабирование | Автоматическое, 0→∞ | Лимиты concurrency |
| Стоимость | Платишь только за вызовы | Дорого при высокой нагрузке 24/7 |
| Операции | Нет управления серверами | Vendor lock-in |
| Деплой | Мгновенный, независимый | Cold start latency |
| Состояние | Stateless по природе | Нельзя хранить state in-memory |
| Тестирование | Unit легко, интеграция — сложно | Локальный запуск нетривиален |

### Когда применять

**Подходит:**
- Event-driven workloads (обработка загрузок, webhooks, очереди)
- API с непредсказуемой/неравномерной нагрузкой
- Scheduled задачи (cron jobs)
- Прототипы и MVP

**Не подходит:**
- Long-running процессы (> 15 мин — лимит Lambda)
- Приложения с постоянной высокой нагрузкой (дешевле контейнер/VM)
- Там, где нужна in-memory state (WebSocket-сервер, игры)
- Критически низкая latency (cold start неприемлем)

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как решить проблему cold start?** — Provisioned Concurrency (Lambda), выбор лёгкого рантайма (Node.js/Python vs Java), минимизация bundle size, connection pooling через RDS Proxy.
- **Как хранить состояние в Serverless?** — внешние хранилища: Redis (ElastiCache), DynamoDB, S3; Serverless функции stateless.
- **Что такое идемпотентность и почему она важна в FaaS?** — функция может быть вызвана повторно (at-least-once delivery в очередях); важно защититься от дубликатов через idempotency key.
- **Serverless vs Containers (ECS/K8s)?** — Serverless: нет управления инфраструктурой, платишь за вызовы, cold start. Контейнеры: постоянно запущены, предсказуемая latency, больше контроля.

### Красные флаги (чего не говорить)

- «Serverless — нет серверов» — серверы есть, ими управляет облако.
- «Serverless всегда дешевле» — при постоянной высокой нагрузке контейнеры дешевле.
- «Serverless подходит для любого приложения» — WebSocket-серверы, долгие вычисления, stateful процессы — плохие кандидаты.

### Связанные темы

- `005-raznica-monolita-i-mikroservisov.md`, `006-plyusy-minusy-monolit-mikroservisy.md`
- `010-patterny-masshtabiruemost.md`
