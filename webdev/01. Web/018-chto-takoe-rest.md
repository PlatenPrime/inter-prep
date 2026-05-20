# Q018. Что такое REST?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**REST (Representational State Transfer)** — **архитектурный стиль** распределённых систем, описанный Roy Fielding в диссертации: ресурсы с URI, взаимодействие через **представления** (JSON, XML), **stateless** коммуникация, единообразный интерфейс HTTP-методов, кэшируемость, слоистость. Это не протокол и не фреймворк — набор **ограничений (constraints)**. «REST API» на практике часто означает HTTP+JSON CRUD, не всегда полный REST по всем принципам.

---

## Развёрнутый ответ

### Суть и определение

REST использует существующие стандарты веба (HTTP, URI, media types) вместо собственного RPC-протокола поверх HTTP. **Ресурс** — сущность (заказ, пользователь); **representation** — снимок состояния в конкретном формате.

Шесть ограничений Fielding:

1. **Client-Server**
2. **Stateless**
3. **Cacheable**
4. **Layered System**
5. **Code on Demand** (опционально)
6. **Uniform Interface**

### Как это работает

- `GET /orders/5` — получить representation заказа #5
- `PUT /orders/5` — заменить representation
- **Hypermedia (HATEOAS)** — ответ содержит ссылки `links: { "cancel": "/orders/5/cancel" }` — высокая зрелость REST (редко в JSON API)
- **Content negotiation** — `Accept: application/vnd.api+json`
- Статусы HTTP несут семантику (201, 409, 422)

### Практика и применение

- Публичные API (Stripe, GitHub) — resource-oriented URLs.
- **BFF** агрегирует несколько микросервисов в удобный REST для фронта.
- Версионирование: URL `/v2/`, header `Accept-Version`, media type.
- OpenAPI/Swagger — документация контракта.

### Важные нюансы и краеугольные камни

- **RPC disguised as REST** — `POST /getUserById` — антипаттерн по REST, но распространён.
- Игнорирование **идемпотентности** и кэширования GET.
- **Overfetching** — решают GraphQL, не отменяя REST.
- Путать REST с **любым HTTP API**.

### Примеры

```http
GET /orders/42 HTTP/1.1
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 42,
  "status": "shipped",
  "_links": {
    "self": { "href": "/orders/42" },
    "tracking": { "href": "/shipments/9" }
  }
}
```

```javascript
// Resource-oriented client
const order = await fetch('/orders/42', {
  headers: { Accept: 'application/json' },
}).then((r) => r.json());
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **REST vs RESTful?** — Q019.
- **Что такое HATEOAS?** — hypermedia as the engine of application state.
- **Richardson maturity model?** — Q021–022.
- **GraphQL vs REST?** — гибкость запроса vs кэш HTTP.
- **Идемпотентность методов?** — Q003–005.

### Красные флаги (чего не говорить)

- «REST = JSON over HTTP» — неполное определение, нет constraints.
- «REST требует только GET/POST» — теряется uniform interface.
- Утверждать, что **все** API должны быть REST.

### Связанные темы

- `019-rest-i-restful-api.md`, `020-principy-rest.md`
- `021-model-richardsona.md`, `023-raznica-soap-i-rest.md`
