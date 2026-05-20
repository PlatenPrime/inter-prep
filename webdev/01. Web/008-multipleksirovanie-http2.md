# Q008. Как работает мультиплексирование в `HTTP/2`?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

В HTTP/2 **одно TCP (TLS) соединение** несёт множество независимых **потоков (streams)** — каждый HTTP-запрос/ответ привязан к **stream ID**. Сообщения разбиваются на **фреймы** (HEADERS, DATA) с меткой stream; клиент и сервер **чередуют** фреймы разных потоков, не дожидаясь завершения предыдущего ответа. **Flow control** (окна на connection и stream) и **приоритеты** регулируют, кто получает полосу. Это убирает HTTP-level head-of-line blocking HTTP/1.1, но не TCP-level потерю пакета.

---

## Развёрнутый ответ

### Суть и определение

Мультиплексирование — ключевое отличие HTTP/2 от HTTP/1.1. Вместо «ответ B ждёт конца ответа A в том же TCP» — параллельная передача логических обменов в одном connection.

### Как это работает

1. **Connection preface** — клиент шлёт `PRI * HTTP/2.0\r\n\r\nSM\r\n\r\n`, SETTINGS.
2. **Stream** — односторонне инициируется клиентом (нечётные id) или сервером (чётные push — редко).
3. **Жизненный цикл stream:** idle → open → half-closed → closed.
4. **Фреймы:**
   - `HEADERS` — псевдо-заголовки `:method`, `:path` + обычные
   - `DATA` — тело ответа/запроса
   - `RST_STREAM` — отмена (пользователь закрыл вкладку)
   - `WINDOW_UPDATE` — расширение окна flow control
5. **HPACK** — заголовки в HEADERS сжаты относительно таблицы connection.
6. **Приоритеты** — дерево зависимостей (weight, exclusive) — браузер отдаёт приоритет CSS/JS над images.

**Flow control:** получатель объявляет, сколько байт DATA он готов принять; без WINDOW_UPDATE отправитель блокируется — защита от переполнения памяти одним stream.

### Практика и применение

- Страница с 50 ресурсами — один TLS handshake, параллельная загрузка.
- **Server push** (исторически) — push promise stream; сейчас чаще `<link rel=preload>`.
- Отмена запроса — `RST_STREAM` при abort fetch в DevTools.
- gRPC поверх HTTP/2 — долгие streams, bidirectional (в HTTP/2 extended).

### Важные нюансы и краеугольные камни

- **TCP HOL:** один потерянный пакет задерживает все streams → HTTP/3/QUIC.
- **Неравномерные приоритеты** — низкий приоритет картинок может голодать при saturate link.
- **Один connection** — все вкладки same-origin могут делить pool (в браузере — отдельные connection per origin).
- **Debugging** сложнее текстового HTTP/1.
- Слишком много мелких streams без batching — overhead фреймов.

### Примеры

```
# Упрощённая последовательность фреймов (один connection)

Client → HEADERS stream=1  :method GET :path /app.js
Client → HEADERS stream=3  :method GET :path /style.css
Server → HEADERS stream=1  :status 200
Server → DATA    stream=1  (chunk app.js)
Server → HEADERS stream=3  :status 200
Server → DATA    stream=3  (chunk css)
Server → DATA    stream=1  (rest app.js)
# Фреймы stream 1 и 3 interleaved на проводе
```

```javascript
// Браузер автоматически мультиплексирует параллельные fetch к одному origin
const [app, style] = await Promise.all([
  fetch('/app.js'),
  fetch('/style.css'),
]);
// Оба запроса — разные HTTP/2 streams в одном connection (если h2)
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем stream отличается от TCP socket?** — stream логический внутри одного TCP.
- **Что такое flow control?** — WINDOW_UPDATE, backpressure.
- **Почему HTTP/3?** — per-stream loss recovery в QUIC.
- **Head-of-line blocking уровни?** — HTTP/1 vs HTTP/2 vs QUIC.
- **Как отменить запрос?** — RST_STREAM.

### Красные флаги (чего не говорить)

- «Каждый запрос — новый TCP» — это HTTP/1 без keep-alive, не h2.
- «Мультиплексирование = WebSocket» — разные механизмы.
- Игнорировать **TCP-level** blocking при заявлении «h2 решает всё».

### Связанные темы

- `007-raznica-http1-i-http2.md`, `009-http3.md`
- `001-chto-takoe-http.md`
