# Q001. Что такое `HTTP`?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**HTTP (HyperText Transfer Protocol)** — прикладной протокол уровня 7 модели OSI для обмена ресурсами в вебе по схеме «запрос–ответ». Клиент (браузер, мобильное приложение, сервис) отправляет запрос с методом, URL и заголовками; сервер возвращает статус, заголовки и тело. Протокол по умолчанию **без состояния (stateless)**: каждый запрос обрабатывается независимо, а «сессию» строят поверх — cookies, токены, серверное хранилище.

---

## Развёрнутый ответ

### Суть и определение

HTTP описывает формат сообщений и семантику методов (GET, POST, PUT и др.), кодов статуса (2xx, 4xx, 5xx) и заголовков. Актуальные версии — HTTP/1.1 (RFC 9110–9112), HTTP/2 (RFC 9113), HTTP/3 поверх QUIC (RFC 9114). Транспорт — обычно **TCP** (HTTP/1–2) или **UDP/QUIC** (HTTP/3).

HTTP не привязан к HTML: через него передают JSON API, файлы, графику, стримы. Это контракт между клиентом и origin-сервером (или прокси/CDN на пути).

### Как это работает

1. **Разрешение имени** — DNS превращает hostname в IP.
2. **Установка соединения** — TCP (или QUIC для HTTP/3), при HTTPS — TLS-handshake.
3. **HTTP-запрос** — стартовая строка (`GET /api/users HTTP/1.1`), заголовки (`Host`, `Accept`, `Authorization`), опционально тело.
4. **Обработка на сервере** — маршрутизация, бизнес-логика, БД.
5. **HTTP-ответ** — статус (`200 OK`), заголовки (`Content-Type`, `Cache-Control`), тело.
6. **Закрытие или переиспользование** — в HTTP/1.1 keep-alive; в HTTP/2 — мультиплексирование потоков в одном соединении.

Идемпотентность и безопасность методов (safe/idempotent) — часть семантики протокола, а не «договорённость фреймворка».

### Практика и применение

- **REST/JSON API** — CRUD через GET/POST/PUT/PATCH/DELETE.
- **Статика и SSR** — HTML, CSS, JS, изображения с кэшированием через `Cache-Control`, `ETag`.
- **Аутентификация** — Bearer JWT, session cookie, Basic (редко).
- **Прокси и CDN** — кэш, сжатие, терминация TLS на edge.

Без единого прикладного протокола каждый клиент говорил бы с сервером «на своём языке» — несовместимость экосистемы.

### Важные нюансы и краеугольные камни

- **Stateless ≠ без авторизации** — состояние выносится в cookies, Redis-сессии, JWT.
- **HTTP ≠ HTTPS** — шифрование и целостность даёт TLS поверх TCP/QUIC.
- Кэши и прокси могут **изменять поведение** GET (кэш hit) vs POST (обычно не кэшируется).
- **Таймауты и ретраи** — повтор идемпотентного GET безопасен; POST с побочными эффектами — нет без idempotency key.

### Примеры

```http
GET /api/users/42 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: private, max-age=60

{"id":42,"name":"Alice"}
```

```javascript
// Fetch API — тот же контракт HTTP под капотом
const res = await fetch('https://api.example.com/users/42', {
  headers: { Accept: 'application/json' },
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const user = await res.json();
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем HTTP/2 отличается от HTTP/1.1?** — мультиплексирование, бинарные фреймы, HPACK, server push (ограниченно).
- **Почему HTTP stateless и как делают сессии?** — cookies + Set-Cookie, server-side session store, JWT в Authorization.
- **Что такое идемпотентность PUT vs POST?** — повтор PUT даёт тот же ресурс; POST создаёт новые сущности.
- **Как работает кэширование?** — `Cache-Control`, `ETag`, `If-None-Match`, 304.
- **Где заканчивается HTTP и начинается TLS?** — TLS record layer ниже application data; SNI, ALPN (`h2`, `http/1.1`).

### Красные флаги (чего не говорить)

- «HTTP — это только для сайтов/HTML» — протокол ресурсо-ориентированный, не привязан к разметке.
- «POST всегда безопаснее GET» — CSRF, размер тела, кэш — отдельные темы; метод не заменяет авторизацию.
- «HTTP/2 всегда быстрее» — на маленьких запросах overhead; важны TLS, RTT, размер ответов.
- Путать **порт 80/443** с сутью протокола — порт транспортный, HTTP — прикладной уровень.

### Связанные темы

- `002-iz-chego-sostoit-http-zapros.md`, `003-kakie-metody-http-zapros.md`
- `006-raznica-http-i-https.md`, `007-raznica-http1-i-http2.md`
- `010-http-cookie.md`, `018-chto-takoe-rest.md`
