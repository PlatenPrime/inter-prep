# Q046. Почему очищать кэш важно? Как это можно сделать?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

Кэш (браузерный HTTP cache, **Service Worker** Cache Storage, CDN, `localStorage`) ускоряет повторные визиты, но **устаревшие** ресурсы дают баги после деплоя, показывают старый JS/CSS и ломают API-контракты. Очистка нужна при релизах, отладке и инцидентах. Способы: **cache busting** (`filename.[hash].js`), заголовки `Cache-Control`, версионирование SW cache, `revalidate`/`purge` на CDN, ручная очистка в DevTools и программно — `caches.delete()`, `unregister` SW.

---

## Развёрнутый ответ

### Суть и определение

Уровни кэша:

1. **HTTP** — по заголовкам `Cache-Control`, `ETag`, `max-age`.
2. **Service Worker** — программируемые стратегии, отдельное хранилище.
3. **Application storage** — localStorage, IndexedDB (не HTTP, но «устаревшее состояние»).
4. **CDN / reverse proxy** — edge cache всего сайта.

Проблема не в кэше самом по себе, а в **отсутствии инвалидации** при изменении.

### Как это работает

**Правильная стратегия в проде:** immutable hashed assets (`app.a1b2c3.js`) + `index.html` с `no-cache` или короткий TTL — пользователь всегда получает свежий manifest чанков.

**SW:** при `activate` удалять старые имена cache (`caches.keys()` → delete неактуальные).

**CDN purge:** API Cloudflare/Fastly по URL или тегу после deploy.

**Ручная отладка:** Hard Reload, Disable cache в Network, Clear site data.

### Практика и применение

- **Hotfix на проде** — без busting пользователи неделю на старом бандле.
- **PWA** — пользователь не видит новую версию без `skipWaiting` + UI «Обновить».
- **API versioning** — `/v2/` + кэш не смешивать ответы v1 и v2.

Без дисциплины кэша «исправили баг, но у клиентов старая версия» — классический инцидент.

### Важные нюансы и краеугольные камни

- `Cache-Control: max-age=31536000` на **index.html** — опасно.
- Очистка только CDN без SW — SW всё ещё отдаёт stale.
- `localStorage` версия схемы — миграции при смене формата данных.
- Aggressive `no-store` везде — плохой performance; точечная инвалидация лучше.
- Пользовательский «очистите кэш» — плохой UX; исправлять pipeline.

### Примеры

```javascript
// Service Worker — очистка старых cache при activate
self.addEventListener('activate', (event) => {
  const keep = 'app-v5';
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== keep).map((k) => caches.delete(k)))
    )
  );
});
```

```http
# index.html — всегда проверять свежесть
Cache-Control: no-cache

# hashed asset — долгий кэш
Cache-Control: public, max-age=31536000, immutable
```

```javascript
// Программно (осторожно, только при миграции)
await caches.delete('old-v4');
localStorage.setItem('schemaVersion', '6');
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Hash в имени файла vs query `?v=2`?** — query может не bust CDN; hash надёжнее.
- **ETag и 304?** — условные запросы экономят трафик.
- **Stale-while-revalidate?** — свежесть vs скорость.
- **Как заставить SW обновиться?** — new SW, skipWaiting, clients.claim.
- **CDN cache key** — учёт заголовков, cookies, query.

### Красные флаги (чего не говорить)

- «Поставим no-cache на всё» как единственное решение.
- «Пользователи пусть чистят кэш вручную» вместо busting.
- Забыть про SW при обсуждении «после деплоя не обновляется».

### Связанные темы

- [035-service-workers.md](035-service-workers.md)
- [044-pwa.md](044-pwa.md)
- [029-server-push.md](029-server-push.md)
- [012-raznica-http1-i-http2.md](012-raznica-http1-i-http2.md) *(если создан)*

---
