# Q024. Что такое API?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**API (Application Programming Interface)** — **контракт** взаимодействия между программными компонентами: какие операции доступны, с какими параметрами, что возвращается, какие ошибки возможны. В вебе чаще всего **HTTP API** (REST, GraphQL, gRPC-web), но API бывают и **внутри процесса** (библиотеки, OS syscalls, browser DOM API). Хороший API **стабилен**, версионируется, документирован и скрывает детали реализации.

---

## Развёрнутый ответ

### Суть и определение

API — граница абстракции. Потребитель зависит от **интерфейса**, не от внутренней структуры (принцип information hiding).

Типы:

- **Web API** — по сети (HTTP, WebSocket)
- **Library API** — `import { parse } from 'date-fns'`
- **OS API** — файловая система, сокеты
- **Hardware API** — драйверы

### Как это работает

**Web API типичный flow:**

1. Клиент формирует запрос по контракту (OpenAPI spec).
2. Gateway: auth, rate limit, routing.
3. Сервис выполняет логику, возвращает representation + status.
4. Клиент обрабатывает ответ или retry/backoff.

**Контракт включает:**

- Endpoints / operations
- Схемы данных (JSON Schema, TypeScript types)
- Auth (API key, OAuth2 scopes)
- Rate limits, pagination, idempotency
- SLA, deprecation policy

### Практика и применение

- **Public API** — партнёры, developers (Stripe).
- **Internal API** — микросервисы в k8s (`service.namespace.svc`).
- **BFF** — API под нужды конкретного фронта.
- **SDK** — обёртка над HTTP API для удобства (`@octokit/rest`).
- **Versioning** — `/v2`, header, feature flags.

### Важные нюансы и краеугольные камни

- **Breaking change** без версии — ломает всех клиентов.
- **Leaky abstraction** — exposure internal DB ids, stack traces в 500.
- **Overexposure** — лишние поля, GDPR риск.
- Документация **расходится** с реализацией — contract tests (Pact).
- Путать **API** с **UI** — разные потребители.

### Примеры

```typescript
// Library API (in-process)
const hash = await crypto.subtle.digest('SHA-256', data);

// Web API (HTTP contract)
interface CreateUserRequest {
  email: string;
  name: string;
}
// POST /v1/users → 201 { id: string }
```

```yaml
# OpenAPI fragment — machine-readable contract
paths:
  /users:
    post:
      summary: Create user
      responses:
        '201':
          description: Created
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Public vs private API?** — аудитория, auth, SLA.
- **Как версионировать?** — URL, header, compatibility matrix.
- **REST vs GraphQL vs gRPC?** — trade-offs.
- **Rate limiting?** — token bucket, 429 Retry-After.
- **Idempotency в API?** — ключи на POST.

### Красные флаги (чего не говорить)

- «API = только REST» — API шире.
- «Документация не нужна, посмотрите код» — для внешних потребителей недопустимо.
- Возвращать **500** с SQL ошибкой клиенту.

### Связанные темы

- `018-chto-takoe-rest.md`, `023-raznica-soap-i-rest.md`
- `019-rest-i-restful-api.md`, `025-chto-takoe-cdn.md`
