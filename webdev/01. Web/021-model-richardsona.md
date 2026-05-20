# Q021. Что такое модель зрелости Ричардсона?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Модель зрелости Ричардсона (Richardson Maturity Model)** — шкала из **четырёх уровней (0–3)**, описывающая, насколько API использует возможности **HTTP и REST**, а не собственный протокол поверх HTTP. Уровень 0 — один URI и POST RPC; 1 — отдельные URI на ресурсы; 2 — HTTP-методы; 3 — **HATEOAS** (hypermedia). Большинство «REST API» в индустрии — **уровень 2**.

---

## Развёрнутый ответ

### Суть и определение

Leonard Richardson (2008), популяризован Martin Fowler. Не официальный стандарт, а **эвристика** для оценки API. Помогает обсуждать «RESTfulness» без религиозных споров.

### Как это работает

| Уровень | Название | Суть |
|---------|----------|------|
| 0 | Swamp of POX | Один endpoint, POST всего, XML/JSON RPC |
| 1 | Resources | Много URI (ресурсов), но часто один метод |
| 2 | HTTP Verbs | GET/POST/PUT/DELETE + статусы |
| 3 | Hypermedia | Ответы содержат ссылки на дальнейшие действия |

Переход вверх — больше **uniform interface** и кэшируемости веба.

### Практика и применение

- Аудит legacy: `POST /api` с `method=GetUser` → план миграции к level 2.
- **OpenAPI** описывает level 2 хорошо; HAL/JSON:API/Siren — level 3.
- На собесе: «Наш API — Richardson 2, HATEOAS не используем из-за мобильных клиентов с фиксированным SDK».

### Важные нюансы и краеугольные камни

- Level 3 **не обязателен** для успешного продукта.
- Level 2 **≠** полный REST Fielding (нет всех constraints).
- Можно быть level 2 с плохими URI (`/users/delete/5` POST).
- GraphQL — **вне** модели (другая парадигма).

### Примеры

```
# Level 0
POST /rpc
{ "action": "getOrder", "id": 5 }

# Level 1
POST /orders/5   # всё ещё POST для чтения

# Level 2
GET /orders/5

# Level 3
GET /orders/5
→ { "status": "pending", "links": { "pay": "/orders/5/payment" } }
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Опишите уровни 0–3?** — Q022.
- **Пример вашего API по уровню?** — честно level 2.
- **Зачем level 3?** — discoverability, меньше hardcoded URLs.
- **Fowler статья?** — Richardson Maturity Model (знание названия достаточно).
- **REST vs RPC?** — level 0 ближе к RPC.

### Красные флаги (чего не говорить)

- «У нас REST level 3» без единой ссылки в ответах — завышение.
- Путать с **CMMI** или agile maturity.
- Считать level 0 «не REST вообще» — это начало шкалы.

### Связанные темы

- `022-urovni-richardsona.md`, `018-chto-takoe-rest.md`
- `019-rest-i-restful-api.md`, `023-raznica-soap-i-rest.md`
