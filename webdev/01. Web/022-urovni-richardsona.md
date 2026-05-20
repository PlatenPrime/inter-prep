# Q022. Основные уровни модели зрелости Ричардсона?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

Четыре уровня: **0** — один URI, туннелирование действий в теле (RPC); **1** — отдельный URI на каждый ресурс, но без семантики методов; **2** — корректные **HTTP-глаголы** и статусы; **3** — **hypermedia (HATEOAS)**, клиент ориентируется по ссылкам в ответе. Рост уровня = больше использования стандарта HTTP, лучше кэш и масштабируемость инфраструктуры.

---

## Развёрнутый ответ

### Суть и определение

Каждый уровень добавляет один «рычаг» веб-архитектуры. Модель не оценивает качество бизнес-логики — только стиль интерфейса.

### Как это работает

**Уровень 0 — The Swamp of POX**

- Один endpoint: `POST https://api.example.com/service`
- Действие в теле: SOAP envelope, JSON `{ "method": "createUser" }`
- HTTP как транспорт, не как интерфейс

**Уровень 1 — Resources**

- URI отражают ресурсы: `/users/42`, `/invoices`
- Часто всё ещё `POST` для чтения и записи
- Плюс: разделение пространства имён; минус: нет идемпотентности GET

**Уровень 2 — HTTP Verbs**

- `GET` — чтение, `POST` — создание, `PUT/PATCH` — обновление, `DELETE` — удаление
- Коды: 200, 201, 400, 404, 409
- Используются кэши и прокси по правилам HTTP
- **Индустриальный стандарт** для JSON API

**Уровень 3 — Hypermedia Controls**

- Ответ: `{ "data": {...}, "links": [...] }` (HAL, JSON:API, Siren)
- Клиент не зашивает `/orders/5/cancel`, а следует `rel: cancel`
- Эволюция API без ломки жёстких URL в клиентах

### Практика и применение

- Миграция 0→2: разбить monolith RPC на ресурсы + методы.
- Stripe/GitHub — effective level 2 с документацией вместо runtime HATEOAS.
- Level 3 — редко в публичных API; чаще в гипермедиа-системах (enterprise integration).

### Важные нюансы и краеугольные камни

- Level 1 с GET-only и query actions — ложное «чувство REST».
- Level 3 без единого стандарта links — хаос для клиентов.
- **Не путать** уровень зрелости с версией API (`/v1`).

### Примеры

```http
# Level 0
POST /api HTTP/1.1
{"method":"GetUser","params":{"id":1}}

# Level 1
POST /users/1 HTTP/1.1
{"action":"get"}

# Level 2
GET /users/1 HTTP/1.1

# Level 3
GET /users/1 HTTP/1.1
# Response includes: "links": [{"rel":"update","href":"/users/1","method":"PATCH"}]
```

```json
// HAL-style level 3 fragment
{
  "name": "Alice",
  "_links": {
    "self": { "href": "/users/1" },
    "friends": { "href": "/users/1/friends" }
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Где большинство API?** — level 2.
- **Минусы level 3?** — сложность клиента, tooling.
- **Level 1 пример в legacy?** — `/getUser?id=1` POST.
- **Связь с REST constraints?** — level 2 → uniform interface частично.
- **JSON:API / HAL?** — форматы hypermedia.

### Красные флаги (чего не говорить)

- Перепутать порядок уровней или пропустить level 0.
- «Level 3 = лучший API для всех» — контекст зависит.
- Назвать **GraphQL** уровнем 4.

### Связанные темы

- `021-model-richardsona.md`, `020-principy-rest.md`
- `003-kakie-metody-http-zapros.md`, `019-rest-i-restful-api.md`
