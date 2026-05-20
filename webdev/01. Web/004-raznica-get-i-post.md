# Q004. Разница между `GET` и `POST` запросами?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**GET** запрашивает ресурс без предполагаемого изменения состояния на сервере (safe), параметры обычно в **query string**, тело по семантике не используется; **идемпотентен** и кэшируем. **POST** отправляет данные для **создания ресурса или выполнения действия**, тело в request body, **не safe и обычно не идемпотентен**; кэши и прокси обрабатывают иначе. Выбор метода — про семантику и инфраструктуру (кэш, bookmark, CSRF), а не про «размер данных».

---

## Развёрнутый ответ

### Суть и определение

Оба — методы HTTP, но с разной **семантикой** в RFC 9110. GET адресует существующий ресурс (или коллекцию с фильтрами). POST — «обработай эти данные»: новая запись, login, upload, нестандартное действие.

### Как это работает

**GET:**

- Данные в URL: `/search?q=http&page=2`
- Ограничение длины URL (браузер ~2K–8K, серверы свои лимиты)
- Повтор запроса при F5/кэше — ожидаемо тот же результат
- Логируется в access log целиком (включая query) — риск утечки PII в URL

**POST:**

- Данные в теле + заголовки `Content-Type`, `Content-Length`
- Подходит для больших payload, файлов (`multipart/form-data`)
- Повтор может создать второй заказ — нужен idempotency key
- HTML-форма по умолчанию: GET → query, POST → body

### Практика и применение

- Поиск и пагинация — GET (ссылка шарится, кэш CDN).
- Логин, оплата, создание заказа — POST.
- **Не использовать GET для удаления/изменения** — CSRF через `<img src=".../delete?id=1">`, prefetch браузера.
- REST: GET `/users/1`, POST `/users` для создания.

### Важные нюансы и краеугольные камни

- Миф «POST безопаснее» — CSRF защищают токенами, SameSite cookies, не сменой метода.
- **Sensitive data в GET** — попадает в history, Referer, server logs.
- **Кэш** — GET может отдать stale; POST обычно не кэшируется intermediaries.
- **Prefetch / prerender** — браузер может дернуть GET без клика пользователя.

### Примеры

```http
# GET — чтение, параметры в URL
GET /api/products?category=books&limit=20 HTTP/1.1
Host: shop.example.com

# POST — создание
POST /api/orders HTTP/1.1
Host: shop.example.com
Content-Type: application/json

{"items":[{"sku":"BOOK-1","qty":1}]}
```

```html
<!-- HTML forms -->
<form method="get" action="/search">
  <input name="q" />
</form>

<form method="post" action="/login">
  <input name="password" type="password" />
</form>
```

---

## Сравнение

| Критерий | GET | POST |
|----------|-----|------|
| Семантика | Получить ресурс | Создать/выполнить действие |
| Safe | Да | Нет |
| Idempotent | Да | Обычно нет |
| Данные | Query string | Body (JSON, form, multipart) |
| Кэширование | Да (с оговорками) | Обычно нет |
| Длина данных | Лимит URL | Практически больше |
| Bookmark / share URL | Да | Нет (тело не в URL) |
| CSRF-риск для state change | Высокий, если меняют состояние | Тоже нужна защита |
| Типичные коды ответа | 200, 304 | 201 Created, 200, 400 |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Можно ли тело в GET?** — не для production; ломает кэши и прокси.
- **POST vs PUT при создании?** — POST на коллекцию, PUT на известный URI с idempotency.
- **Почему поиск иногда делают POST?** — очень длинный фильтр; trade-off с кэшем и REST.
- **Как защитить POST от CSRF?** — SameSite, double-submit cookie, custom header.
- **Что кэширует браузер для GET?** — `Cache-Control`, heuristic caching.

### Красные флаги (чего не говорить)

- «POST всегда для больших данных, GET для маленьких» — размер не критерий выбора метода.
- «GET не передаёт данные на сервер» — query string это данные, просто в URL.
- Использовать GET для операций с побочным эффектом «потому что проще».

### Связанные темы

- `003-kakie-metody-http-zapros.md`, `005-raznica-put-i-post.md`
- `010-http-cookie.md`, `018-chto-takoe-rest.md`
