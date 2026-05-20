# Q035. Что такое Service Workers?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Service Worker** — отдельный **фоновый** JavaScript-воркер, привязанный к origin, который перехватывает сетевые запросы (`fetch`), управляет кэшем, обеспечивает **офлайн** и push-уведомления. Работает не в окне страницы, а в worker-контексте; жизненный цикл: register → install → activate → fetch. Обязательная часть **PWA**; требует **HTTPS** (кроме localhost).

---

## Развёрнутый ответ

### Суть и определение

SW — прокси между приложением и сетью. Не имеет доступа к DOM; общение с страницей через `postMessage`. Один SW может контролировать **несколько вкладок** одного scope (`/`).

Спецификация продолжает Fetch API и Cache API. Обновления: новый SW в состоянии `waiting` до `skipWaiting` + `clients.claim()`.

### Как это работает

1. **Register:** `navigator.serviceWorker.register('/sw.js')`.
2. **Install:** precache статики (`cache.addAll`), `event.waitUntil`.
3. **Activate:** удаление старых cache names, `clients.claim()`.
4. **Fetch:** стратегии cache-first, network-first, stale-while-revalidate.

События: `push`, `sync` (Background Sync, ограниченная поддержка), `notificationclick`.

### Практика и применение

- **Офлайн shell** для SPA — app shell caching.
- **Ускорение повторных визитов** — ассеты из Cache Storage.
- **Push notifications** в PWA (с разрешением пользователя).

Без SW сайт всегда зависит от сети для каждого ресурса; нет программируемого offline layer.

### Важные нюансы и краеугольные камни

- **Кэш устарел** — версионировать имена cache (`app-v3`), иначе пользователи видят старый бандл.
- **Не кэшировать API с персональными данными** без стратегии и TTL.
- Отладка сложнее — DevTools → Application → Service Workers.
- iOS долго ограничивал SW — проверять актуальные лимиты PWA на Safari.
- `unregister` и hard refresh при «залипшем» SW.

### Примеры

```javascript
// main.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js
const CACHE = 'static-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/', '/styles.css', '/app.js'])));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **SW vs Web Worker?** — SW перехватывает fetch, lifecycle, PWA; Worker — вычисления.
- **Стратегии кэширования?** — cache-first для static, network-first для API.
- **Как обновить SW без залипания?** — versioning, prompt user reload.
- **Scope SW?** — путь регистрации ограничивает область.
- **Workbox?** — готовые рецепты и precaching из webpack/vite.

### Красные флаги (чего не говорить)

- «Service Worker = Web Worker».
- Кэшировать всё подряд включая авторизованные API.
- «Работает по HTTP на проде» — нужен HTTPS.

### Связанные темы

- [036-web-workers.md](036-web-workers.md)
- [044-pwa.md](044-pwa.md)
- [046-ochistka-kesha.md](046-ochistka-kesha.md)
- [029-server-push.md](029-server-push.md)

---
