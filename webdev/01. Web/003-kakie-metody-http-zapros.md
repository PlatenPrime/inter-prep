# Q003. Какие методы может иметь `HTTP`-запрос?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

Стандартные методы HTTP (RFC 9110): **GET** (чтение), **HEAD** (метаданные без тела), **POST** (создание/действие), **PUT** (полная замена ресурса), **PATCH** (частичное обновление), **DELETE** (удаление), **OPTIONS** (возможности сервера/CORS), **TRACE** (диагностика, часто отключён), **CONNECT** (туннель, прокси). Расширения веб-серверов: **LINK**, **UNLINK** и др. В REST повседневно используют GET, POST, PUT, PATCH, DELETE; семантика **safe** и **idempotent** критична для кэшей и ретраев.

---

## Развёрнутый ответ

### Суть и определение

Метод (verb) задаёт **намерение** операции над ресурсом, идентифицируемым URI. Сервер может отклонить метод кодом **405 Method Not Allowed** и заголовком `Allow`.

Классификация (RFC):

| Свойство | Методы | Смысл |
|----------|--------|-------|
| Safe | GET, HEAD, OPTIONS | Не должны менять состояние сервера |
| Idempotent | GET, HEAD, PUT, DELETE, OPTIONS | Повтор запроса — тот же эффект, что один раз |
| Не идемпотентны | POST, PATCH (часто) | Повтор может создать дубликаты |

### Как это работает

- **GET** — получить представление; параметры в query.
- **HEAD** — как GET, но без body (проверка ETag, существования).
- **POST** — создать подчинённый ресурс (`POST /orders`) или RPC-действие (`POST /orders/1/cancel`).
- **PUT** — заменить ресурс по URI целиком; клиент задаёт итоговое состояние.
- **PATCH** — частичное обновление (JSON Patch, merge patch).
- **DELETE** — удалить ресурс; повторный DELETE часто 404, но идемпотентен по смыслу.
- **OPTIONS** — `Allow`, CORS preflight (`Access-Control-*`).
- **CONNECT** — установка TCP-туннеля через HTTP-прокси (HTTPS).

### Практика и применение

- CRUD API: `GET /users`, `POST /users`, `GET /users/:id`, `PUT /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`.
- **Идемпотентность в платежах** — `Idempotency-Key` заголовок для POST.
- **Кэширование CDN** — только safe методы кэшируются по умолчанию.
- **BFF и GraphQL** — часто всё через POST на один endpoint (осознанный компромисс, не «канон REST»).

### Важные нюансы и краеугольные камни

- **POST для всего** — упрощает клиент, ломает кэш и семантику прокси.
- **PUT vs PATCH** — PUT без полного тела может затереть поля null'ами.
- **DELETE с телом** — допустимо в спецификации, но многие клиенты/прокси не поддерживают.
- **Override методов** — `_method=PUT` в формах (legacy); лучше нативный метод.
- **TRACE** — риск XST (Cross-Site Tracing); на проде обычно 405.

### Примеры

```http
# Чтение
GET /api/articles?tag=js HTTP/1.1

# Создание
POST /api/articles HTTP/1.1
Content-Type: application/json
{"title":"HTTP methods"}

# Полная замена
PUT /api/articles/42 HTTP/1.1
{"id":42,"title":"Updated","body":"..."}

# Частичное обновление
PATCH /api/articles/42 HTTP/1.1
Content-Type: application/merge-patch+json
{"title":"Patched title"}
```

```javascript
// Express — маршрутизация по методу
app.get('/users/:id', getUser);
app.post('/users', createUser);
app.put('/users/:id', replaceUser);
app.patch('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Безопасен ли POST?** — нет (не safe); идемпотентен ли — обычно нет.
- **PATCH идемпотентен?** — зависит от операции (JSON Patch «add» дважды — разный результат).
- **Зачем HEAD?** — health-check, проверка `Last-Modified` без скачивания тела.
- **405 vs 404?** — ресурс есть, метод не поддерживается vs ресурс не найден.
- **Какие методы в CORS preflight?** — не «простые» требуют OPTIONS.

### Красные флаги (чего не говорить)

- «GET удаляет, POST читает» — путаница с нестандартными legacy API.
- «Все методы одинаковы, главное URL» — теряется REST и кэширование.
- Утверждать, что **PATCH всегда** есть в каждом API — многие сервисы только PUT/POST.

### Связанные темы

- `004-raznica-get-i-post.md`, `005-raznica-put-i-post.md`
- `018-chto-takoe-rest.md`, `020-principy-rest.md`
