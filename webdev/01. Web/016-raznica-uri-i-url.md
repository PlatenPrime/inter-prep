# Q016. Разница между URI и URL?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**URI (Uniform Resource Identifier)** — общий идентификатор ресурса: **URL** (где и как получить) или **URN** (имя без местоположения, например `urn:isbn:...`). **URL (Uniform Resource Locator)** — подмножество URI с **механизмом доступа**: схема (`https`), authority (`host:port`), path, query, fragment. На практике в вебе говорят «URL» имея в виду `https://example.com/api?q=1`. В HTTP request-target часто передают **path + query** (origin-form), полный URL — для прокси.

---

## Развёрнутый ответ

### Суть и определение

RFC 3986. Синтаксис URI:

```
scheme:[//authority]path[?query][#fragment]
```

- **URL** — locator, содержит сетевой адрес (http, https, ftp).
- **URN** — persistent name без указания способа получения.
- **URI** — umbrella term; любой URL является URI.

### Как это работает

**Компоненты URL `https://user:pass@host:443/path?id=1#section`:**

| Часть | Значение |
|-------|----------|
| scheme | https |
| authority | userinfo, host, port |
| path | /path |
| query | id=1 |
| fragment | section (не уходит на сервер в HTTP) |

**В HTTP/1.1:**

- Origin-form: `GET /path?id=1 HTTP/1.1` + `Host: host`
- Absolute-form (прокси): `GET https://host/path HTTP/1.1`

**Кодирование:** percent-encoding `%20`, IRIs → UTF-8.

### Практика и применение

- `new URL(relative, base)` в JS — резолв относительных ссылок.
- **OpenAPI** `servers` + paths — построение полных URL.
- **Canonical URL** для SEO — один URI на ресурс.
- **Deep linking** в SPA — path vs hash routing.

### Важные нюансы и краеугольные камни

- **Fragment** `#` — только клиент (не в HTTP request).
- Путать **path** и **query** при кэшировании CDN.
- **Relative URL** в HTML `<a href="/about">` — резолв от base.
- **Opaque URI** `mailto:user@x.com` — не иерархический path.
- Двойное кодирование `%252F` — баги в redirect.

### Примеры

```javascript
const u = new URL('https://api.example.com/v1/users?page=2#top');
u.protocol;  // 'https:'
u.hostname;  // 'api.example.com'
u.pathname;  // '/v1/users'
u.search;    // '?page=2'
u.hash;      // '#top' — не отправляется в fetch

// Относительный URI → полный URL
new URL('/assets/logo.png', 'https://cdn.example.com/app/').href;
// 'https://cdn.example.com/assets/logo.png'
```

```http
GET /v1/users?page=2 HTTP/1.1
Host: api.example.com
```

---

## Сравнение

| Критерий | URI | URL |
|----------|-----|-----|
| Определение | Идентификатор ресурса | Идентификатор + способ доступа |
| Включает | URL, URN | Всегда subset URI |
| Пример | `urn:uuid:...`, `https://...` | `https://example.com/file` |
| Схема | Любая (mailto, tel) | Обычно с network location |
| В HTTP | Общий термин для target | Конкретный http(s) locator |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **URN примеры?** — ISBN, UUID URN.
- **Уходит ли # на сервер?** — нет.
- **URI vs IRI?** — Unicode в интернационализированных URI.
- **Request-target forms?** — origin, absolute, authority, asterisk.
- **encodeURIComponent vs encodeURI?** — разные наборы символов.

### Красные флаги (чего не говорить)

- «URI и URL — полностью разные вещи без пересечения» — URL ⊂ URI.
- «Fragment влияет на REST кэш» — нет на сервере.
- Путать **URL** с **domain** (без path/query).

### Связанные темы

- `015-raznica-host-i-domain.md`, `002-iz-chego-sostoit-http-zapros.md`
- `018-chto-takoe-rest.md`
