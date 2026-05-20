# Q019. Что такое REST и RESTful API?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**REST** — архитектурный стиль с ограничениями (ресурсы, stateless, uniform interface, кэш, слои). **RESTful API** — HTTP API, **сознательно следующий** этим принципам: именование ресурсов (существительные во множественном числе), корректные методы, коды статуса, без состояния на сервере между запросами (кроме идентификатора клиента), опционально HATEOAS. На практике «RESTful» часто = **прагматичный REST level 2** (HTTP verbs + status) без полного hypermedia.

---

## Развёрнутый ответ

### Суть и определение

| Термин | Смысл |
|--------|-------|
| REST | Теория, constraints Fielding |
| RESTful API | Конкретная реализация API, стремящаяся к REST |
| HTTP API | Любой API на HTTP (не обязательно RESTful) |

**RESTful** — степень соответствия, не бинарный флаг.

### Как это работает

Признаки RESTful API:

- URI = **ресурсы**: `/users`, `/users/1/orders`
- **Методы по семантике**: GET read, POST create, PUT replace, PATCH update, DELETE
- **Статусы**: 201 + Location, 204 без тела, 404, 409, 422 validation
- **Stateless**: auth в каждом запросе (token/cookie id → lookup)
- **Representation**: JSON, XML; `Content-Type` / `Accept`
- **Pagination**: `?page=2&limit=20` или cursor `?after=id`
- **Errors**: единый формат `{ "error": { "code", "message" } }`

Не RESTful:

- `POST /api?action=deleteUser`
- Все 200 с `{ success: false }` в теле
- Сессионное состояние только на сервере без идентификатора в запросе

### Практика и применение

- GitHub REST API, Stripe API — de-facto стандарты дизайна.
- OpenAPI codegen для клиентов TypeScript.
- **Idempotency-Key** на POST payments — расширение практики.
- Версионирование и deprecation policy.

### Важные нюансы и краеугольные камни

- Споры «настоящий REST» vs **прагматизм** — на собесе показать знание HATEOAS, но признать industry practice.
- **Nested resources** `/users/1/orders` vs flat `/orders?userId=1` — trade-offs.
- **Bulk operations** — иногда RPC endpoint оправдан.
- N+1 на клиенте при чистом REST — BFF, GraphQL.

### Примеры

```http
# RESTful CRUD
POST /users HTTP/1.1
{"email":"a@b.com"}
→ 201 Location: /users/77

GET /users/77 HTTP/1.1
→ 200

PATCH /users/77 HTTP/1.1
{"name":"Ann"}
→ 200

DELETE /users/77 HTTP/1.1
→ 204 No Content
```

```typescript
// Типичный REST client
class UsersApi {
  constructor(private base: string) {}
  list(params?: { page?: number }) {
    return fetch(`${this.base}/users?${new URLSearchParams(params as any)}`);
  }
  create(body: { email: string }) {
    return fetch(`${this.base}/users`, { method: 'POST', body: JSON.stringify(body) });
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Уровень Richardson для вашего API?** — обычно 2.
- **HATEOAS пример?** — links в JSON API, HAL, JSON-LD.
- **Версионирование REST?** — URL vs headers.
- **PATCH форматы?** — JSON Merge Patch, JSON Patch.
- **SOAP vs REST?** — Q023.

### Красные флаги (чего не говорить)

- «RESTful = любой backend на Express» — нужна resource semantics.
- Глаголы в URL: `/getUsers`, `/createOrder`.
- Игнорировать **HTTP status codes**.

### Связанные темы

- `018-chto-takoe-rest.md`, `020-principy-rest.md`
- `021-model-richardsona.md`, `024-chto-takoe-api.md`
