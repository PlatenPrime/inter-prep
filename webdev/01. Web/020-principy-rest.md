# Q020. Принципы REST-архитектуры?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

Принципы REST (ограничения Roy Fielding): **(1) Client-Server** — разделение UI и данных; **(2) Stateless** — сервер не хранит клиентский контекст между запросами; **(3) Cacheable** — ответы помечаются кэшируемыми или нет; **(4) Layered System** — клиент не знает, говорит ли напрямую с origin или с proxy/CDN; **(5) Code on Demand** (опционально) — сервер может отдавать исполняемый код (JS); **(6) Uniform Interface** — идентификация ресурсов (URI), манипуляция через representations, self-descriptive messages, HATEOAS.

---

## Развёрнутый ответ

### Суть и определение

Каждое ограничение даёт свойства: масштабируемость, производительность, простота клиента, независимость эволюции.

### Как это работает

**1. Client-Server**

- Клиент отвечает за UX, сервер — за данные и бизнес-правила.
- Позволяет развивать мобильный клиент и backend отдельно.

**2. Stateless**

- Вся информация для обработки запроса — в самом запросе (URL, headers, body, token).
- Горизонтальное масштабирование без sticky sessions (или session store external).

**3. Cacheable**

- `Cache-Control`, `ETag`, `Last-Modified` — снижение нагрузки.
- Явно: `Cache-Control: no-store` для персональных данных.

**4. Layered System**

- CDN, API Gateway, WAF — прозрачны для клиента.
- Нельзя полагаться на «клиент напрямую видит DB».

**5. Code on Demand (optional)**

- `<script src="...">` — сервер расширяет клиента.
- Редко упоминают в API-контексте.

**6. Uniform Interface** (ключевое)

- **Identification of resources** — URI
- **Manipulation through representations** — JSON ↔ domain object
- **Self-descriptive messages** — метод, media type, status понятны
- **HATEOAS** — hypermedia links в ответе

### Практика и применение

- Stateless + JWT — микросервисы без shared memory session.
- Cacheable GET для справочников — CDN edge cache.
- Layered: Cloudflare → nginx → k8s ingress → service.
- Uniform interface: единый error schema, пагинация, OpenAPI.

### Важные нюансы и краеугольные камни

- «Stateless» ≠ «без БД» — состояние в persistence, не в RAM сессии сервера приложения.
- Кэш **персональных** данных — риск утечки через shared cache.
- HATEOAS **не внедрён** — API всё ещё может быть level 2 RESTful.
- Нарушение uniform interface — рост связности клиента и сервера.

### Примеры

```http
# Cacheable + self-descriptive
GET /products/1 HTTP/1.1
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: public, max-age=3600
ETag: "v1-abc"

# HATEOAS (упрощённо)
{
  "id": 1,
  "name": "Widget",
  "links": [
    { "rel": "self", "href": "/products/1" },
    { "rel": "reviews", "href": "/products/1/reviews" }
  ]
}
```

```javascript
// Stateless: каждый запрос несёт credentials
fetch('/api/me', {
  headers: { Authorization: `Bearer ${accessToken}` },
});
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Какое ограничение даёт масштабирование?** — stateless + layered.
- **Пример нарушения stateless?** — server-only session без id в запросе.
- **HATEOAS зачем?** — evolvability без hardcoded URLs в клиенте.
- **Code on Demand пример?** — загрузка JS bundle.
- **Связь с Richardson levels?** — uniform interface → level 2–3.

### Красные флаги (чего не говорить)

- Перечислить только «GET POST PUT DELETE» без шести constraints.
- «Stateless значит без авторизации».
- Путать **cacheable** с «всё кэшируем всегда».

### Связанные темы

- `018-chto-takoe-rest.md`, `019-rest-i-restful-api.md`
- `021-model-richardsona.md`, `001-chto-takoe-http.md`
