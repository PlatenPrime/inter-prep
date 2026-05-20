# Q002. Из чего состоит `HTTP`-запрос?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

HTTP-запрос состоит из **стартовой строки** (метод, целевой путь/URL, версия протокола), **заголовков** (метаданные: Host, Content-Type, Authorization, Cookie) и опционального **тела** (body) — для POST, PUT, PATCH. Заголовки и тело разделяются пустой строкой (`\r\n\r\n`). В HTTP/2 те же семантические поля упакованы во **фреймы** (HEADERS + DATA), но логическая структура для разработчика та же.

---

## Развёрнутый ответ

### Суть и определение

Запрос — сообщение от клиента к серверу по RFC 9110. Минимально серверу нужны: **куда** идти (URI path + Host), **что делать** (метод), **в каком формате** ждать ответ (Accept) и при модификации — **что отправляем** (Content-Type, длина тела).

### Как это работает

**HTTP/1.x (текстовый формат):**

```
<METHOD> <request-target> HTTP/<version>
<header-name>: <header-value>
...
[пустая строка]
[body]
```

- **Стартовая строка:** `GET /products?page=2 HTTP/1.1`
- **Request-target:** абсолютный путь, `*` (OPTIONS), полный URL (прокси).
- **Заголовки:** case-insensitive имена; значения с директивами (`Cache-Control: no-cache, no-store`).
- **Тело:** произвольные байты; длина через `Content-Length` или `Transfer-Encoding: chunked`.

**HTTP/2:** одна TCP/TLS-сессия, потоки (streams); псевдо-заголовки `:method`, `:path`, `:scheme`, `:authority` + обычные заголовки в HEADERS-фрейме, тело — DATA-фреймы.

### Практика и применение

| Элемент | Типичное использование |
|---------|------------------------|
| `Host` | Виртуальный хостинг на одном IP |
| `Authorization` | Bearer, Basic |
| `Cookie` | Сессия, CSRF-токен |
| `Content-Type` | `application/json`, `multipart/form-data` |
| `Accept` | Согласование формата ответа |
| `User-Agent` | Аналитика, feature detection (осторожно) |
| `X-Request-Id` / `traceparent` | Корреляция в логах и трейсинге |

В Node/Express `req.method`, `req.url`, `req.headers`, `req.body` (после middleware) — отражение этой структуры.

### Важные нюансы и краеугольные камни

- **Обязательный Host** в HTTP/1.1 — без него прокси не знает vhost.
- **Chunked encoding** — тело без заранее известной длины; важно для стриминга.
- **Дублирование заголовков** — некоторые объединяются запятой (`Accept`), другие запрещены дублировать.
- **Размер заголовков** — лимиты nginx/Node (431 Request Header Fields Too Large); огромные JWT в cookie — проблема.
- **Относительный vs абсолютный URL** — в браузере fetch всегда строит полный запрос; в прокси — полный URI.

### Примеры

```http
POST /api/orders HTTP/1.1
Host: shop.example.com
Content-Type: application/json
Content-Length: 52
Authorization: Bearer <token>
Cookie: session_id=abc123

{"productId":7,"quantity":2,"currency":"EUR"}
```

```javascript
// axios / fetch явно задают метод, URL, headers, body
await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ productId: 7, quantity: 2 }),
});
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем отличается request line в прокси?** — может быть полный URL `GET https://host/path HTTP/1.1`.
- **Когда тело обязательно?** — при POST/PUT с данными; GET/HEAD — без тела по семантике.
- **Что такое preflight OPTIONS?** — CORS: браузер шлёт OPTIONS до «непростого» запроса.
- **Как передают файлы?** — `multipart/form-data` с boundary.
- **HTTP/2 — один запрос = один stream?** — да, с общим connection и приоритетами.

### Красные флаги (чего не говорить)

- «В GET тоже можно слать body» — формально в спецификации не запрещено, но прокси/кэши/библиотеки ведут себя непредсказуемо; на собесе это red flag.
- Путать **query string** (`?a=1`) с телом запроса.
- Забыть про **Host** при описании структуры HTTP/1.1.

### Связанные темы

- `001-chto-takoe-http.md`, `003-kakie-metody-http-zapros.md`
- `004-raznica-get-i-post.md`, `010-http-cookie.md`
