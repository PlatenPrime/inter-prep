# Q029. Что такое Server push? Как он улучшает производительность страниц?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Server push** — когда сервер **проактивно** отправляет клиенту ресурсы, которые тот ещё не запросил, но скорее всего понадобятся. В **HTTP/2** это был механизм `PUSH_PROMISE` (сейчас deprecated в браузерах). В широком смысле к push относят также **HTTP/3**, **103 Early Hints**, **preload**/`modulepreload`, **SSE** и **Service Worker** precache — цель одна: убрать лишние round-trip и раньше начать загрузку критичного пути.

---

## Развёрнутый ответ

### Суть и определение

Класическая загрузка: HTML → парсинг → обнаружение `<link>`, `<script>` → отдельные запросы (водопад). Push сокращает **критический путь**: сервер «знает» состав страницы и отдаёт CSS/шрифты параллельно с HTML.

Уровни:

- **HTTP/2 Server Push** (устаревает) — сервер пушит потоки по тому же соединению.
- **103 Early Hints** — ранние заголовки `Link: rel=preload` до готовности полного ответа.
- **Прикладной push** — SSE, WebSocket, SW `skipWaiting` + cache.

### Как это работает

**H2 Push (исторически):** после запроса HTML сервер отправляет `PUSH_PROMISE` для `/app.css`; клиент может принять или отклонить (RST_STREAM). Проблема: пушили то, что уже в **HTTP cache** — waste bandwidth.

**Early Hints:** CDN/сервер сразу шлёт 103 с preload — браузер начинает fetch до тела HTML.

**Preload в разметке:** `<link rel="preload" href="font.woff2" as="font" crossorigin>` — явный приоритет без протокольного push.

**Service Worker:** на `install` кэширует shell — «push» ассетов при следующем визите из cache.

### Практика и применение

- **LCP-оптимизация:** preload hero-изображения, критического CSS; Early Hints на edge (Cloudflare, Fastly).
- **SPA:** precache чанков через Workbox после анализа бандла — быстрый повторный визит.
- **Без push:** каждый ассет ждёт обнаружения в HTML/JS — +1 RTT на уровень водопада.

Метрики: LCP, FCP, **TTFB** vs размер лишне отданных байт — push уместен только при попадании в cache miss.

### Важные нюансы и краеугольные камни

- Chrome **отключил H2 Server Push** (2022+) из‑за низкой отдачи и дублирования кэша.
- Агрессивный push **забивает** полосу важным HTML и блокирует приоритеты.
- Push ≠ substitute для **правильного кэширования** (`Cache-Control`, immutable hashed assets).
- Путать **Server push (HTTP)** и **server-sent events** — разные понятия на собеседовании.

### Примеры

```html
<!-- Рекомендуемый сегодня подход -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="modulepreload" href="/assets/app.[hash].js">
```

```http
# 103 Early Hints (упрощённо)
HTTP/1.1 103 Early Hints
Link: </styles/critical.css>; rel=preload; as=style

HTTP/1.1 200 OK
...
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему отказались от H2 Push?** — cache mismatch, сложность, мало выигрыша vs preload.
- **Чем Early Hints лучше?** — клиент решает, качать ли ресурс; меньше лишнего трафика.
- **Priority Hints / fetchpriority?** — управление очередью без протокольного push.
- **Push и CDN cache?** — push привязан к соединению, не к глобальному edge-кэшу HTML.
- **HTTP/3 и push?** — отдельная эволюция; акцент на 0-RTT и мультиплексирование QUIC.

### Красные флаги (чего не говорить)

- «Включу H2 Server Push на всё» без mention deprecation.
- Смешивать JSONP, SSE и HTTP Server Push в одно определение.
- «Push заменяет CDN» — нет, дополняет стратегию доставки.

### Связанные темы

- [012-raznica-http1-i-http2.md](012-raznica-http1-i-http2.md) *(если создан)*
- [027-raznica-polling-ws-sse.md](027-raznica-polling-ws-sse.md)
- [035-service-workers.md](035-service-workers.md)
- [044-pwa.md](044-pwa.md)

---
