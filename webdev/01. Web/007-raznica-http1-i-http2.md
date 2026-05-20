# Q007. Разница между `HTTP/1` и `HTTP/2`?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**HTTP/1.1** — текстовый протокол, обычно **один запрос за раз на соединение** (без pipelining эффективно) или несколько **параллельных TCP-соединений** (6 на домен) — проблема **head-of-line blocking** на уровне TCP. **HTTP/2** — **бинарный**, **мультиплексирует** множество запросов в **одном** TLS-соединении через потоки (streams), сжимает заголовки (**HPACK**), поддерживает приоритеты и (ограниченно) server push. Меньше latency на страницах с десятками ассетов.

---

## Развёрнутый ответ

### Суть и определение

HTTP/2 (RFC 9113) сохраняет **семантику** HTTP/1 (методы, заголовки, статусы), меняет **framing layer**. Negotiation через ALPN в TLS: `h2`. Для cleartext — upgrade `HTTP2-Settings` (редко в проде).

### Как это работает

**HTTP/1.1:**

- Сообщения: текст start-line + headers + body
- Keep-alive — переиспользование TCP, но ответы по очереди (HOL blocking)
- Workaround: domain sharding, спрайты, инлайн CSS — хаки под лимит соединений

**HTTP/2:**

- **Connection** → множество **streams** (id)
- **Frames:** DATA, HEADERS, SETTINGS, WINDOW_UPDATE, RST_STREAM...
- **HPACK** — статическая/динамическая таблица заголовков, меньше байт на повторяющиеся `Cookie`, `Accept`
- **Flow control** — на connection и stream
- **Server Push** — сервер шлёт ресурс до запроса (сейчас часто отключён; Link preload предпочтительнее)

### Практика и применение

- CDN и nginx по умолчанию HTTP/2 для HTTPS.
- **Bundling** в webpack менее критичен — можно больше мелких чанков без 6 TCP.
- **HTTP/2 + TLS** — браузеры требуют HTTPS для h2 (кроме localhost).
- Мониторинг: `:method`, stream errors, SETTINGS frame.

### Важные нюансы и краеугольные камни

- **TCP HOL blocking** остаётся в HTTP/2 — потеря пакета стопорит все streams → мотивация HTTP/3/QUIC.
- **Server Push** — низкий adoption, риск push лишнего; Chrome убрал push.
- Один тяжёлый stream может **голодать** другие без правильных приоритетов.
- **Debugging** — Wireshark с расшифровкой TLS; DevTools Protocol показывает h2.
- Сжатие заголовков + **BREACH** — осторожность с секретами в сжимаемых полях (исторически).

### Примеры

```http
# HTTP/1.1 — два последовательных ответа на одном keep-alive (упрощённо)
GET /a.css HTTP/1.1
Host: cdn.example.com

GET /b.js HTTP/1.1
Host: cdn.example.com
```

```
# HTTP/2 — логически параллельные streams в одном connection
# Stream 1: GET /a.css
# Stream 3: GET /b.js
# (бинарные HEADERS + DATA фреймы с stream id)
```

```bash
# Проверка ALPN / версии
curl -sI --http2 https://example.com | head -1
```

---

## Сравнение

| Критерий | HTTP/1.1 | HTTP/2 |
|----------|----------|--------|
| Формат | Текст | Бинарные фреймы |
| Мультиплексирование | Нет (1 req in flight типично) | Да, много streams |
| Сжатие заголовков | Нет (gzip только body) | HPACK |
| Соединений на домен | 6+ параллельных TCP | Обычно 1 (TLS) |
| Server Push | Нет | Было (declining) |
| HOL blocking | TCP + HTTP очередь | TCP-level остаётся |
| Семантика REST | Та же | Та же |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как работает мультиплексирование?** — stream id, frames, flow control → Q008.
- **Почему HTTP/3?** — QUIC убирает TCP HOL blocking.
- **Нужен ли domain sharding с h2?** — обычно вредит (больше TCP).
- **Что такое HPACK?** — сжатие заголовков с таблицей.
- **HTTP/2 без TLS?** — редко; браузеры — только h2 over TLS.

### Красные флаги (чего не говорить)

- «HTTP/2 — другой API для разработчика» — fetch/XHR те же; меняется transport.
- «Всегда быстрее в 2 раза» — зависит от RTT, размера ответа, одного большого файла.
- Путать **WebSocket** с HTTP/2 streams.

### Связанные темы

- `008-multipleksirovanie-http2.md`, `009-http3.md`
- `006-raznica-http-i-https.md`
