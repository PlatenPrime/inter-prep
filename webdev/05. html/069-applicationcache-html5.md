# Q069. Что такое ApplicationCache в HTML5?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

ApplicationCache (AppCache) — устаревший механизм офлайн-кеширования веб-приложений через `.appcache` manifest-файл, объявлявшийся в атрибуте `manifest` тега `<html>`. Он был депрекирован в 2015 году и удалён из всех современных браузеров в пользу Service Workers + Cache API, которые предоставляют гибкий программный контроль над кешированием.

---

## Развёрнутый ответ

### Суть и определение

AppCache позволял разработчикам декларативно описать, какие файлы браузер должен кешировать для офлайн-работы. Manifest-файл перечислял ресурсы в трёх секциях: `CACHE`, `NETWORK`, `FALLBACK`.

```
CACHE MANIFEST
# v1.0

CACHE:
/app.js
/styles.css
/logo.png

NETWORK:
/api/

FALLBACK:
/ /offline.html
```

Браузер загружал и кешировал перечисленные ресурсы при первом посещении, затем использовал кеш при офлайн-доступе.

### Как это работает

**Подключение:**
```html
<!DOCTYPE html>
<html manifest="/app.appcache">
```

**Секции manifest:**
- `CACHE:` — ресурсы для обязательного кеширования.
- `NETWORK:` — ресурсы, которые всегда загружаются из сети (не кешируются). `*` означает «всё остальное».
- `FALLBACK:` — пары «URL → замена» при недоступности сети.

**Жизненный цикл:**
1. Браузер загружает manifest.
2. Кеширует все перечисленные ресурсы.
3. При следующем визите использует кеш.
4. Параллельно проверяет обновление manifest (побайтово).
5. При изменении manifest — загружает новые версии в **фоновый кеш**.
6. Новая версия применяется только при **следующей** загрузке страницы.

### Практика и применение

AppCache использовался для:
- Веб-приложений с офлайн-режимом (почта, заметки).
- Кеширования статических ресурсов для ускорения повторных загрузок.
- Простых PWA до появления Service Workers.

На момент 2026 года AppCache **полностью удалён** из Chrome (версия 93, 2021), Firefox (версия 84, 2020), Safari (версия 15.4, 2022). Использование недопустимо в новых проектах.

### Почему отказались: фундаментальные проблемы

1. **«Dain Bramaged» (сломанный) UPDATE-механизм:** изменение одного файла требовало изменения manifest → перезагрузки всех кешированных ресурсов.
2. **Страница всегда загружается из кеша первой:** пользователь всегда видит старую версию, обновление применяется только при следующем визите. Требовался `location.reload()` после события `updateready`.
3. **Отсутствие программного контроля:** нельзя выбрать стратегию кеширования (cache-first vs network-first).
4. **Жёсткая связка с HTML-файлом:** `manifest` на `<html>` — сам HTML-файл тоже кешируется, создавая бесконечный цикл при обновлениях.
5. **Сложная отладка:** поведение непредсказуемо, DevTools-поддержка была слабой.
6. **Нет поддержки динамического контента:** только статические URL.

### Современная замена: Service Workers + Cache API

```js
// service-worker.js
const CACHE_NAME = 'app-v1';
const ASSETS = ['/app.js', '/styles.css', '/logo.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (cached) => cached ?? fetch(event.request)
    )
  );
});
```

Service Workers дают полный программный контроль: cache-first, network-first, stale-while-revalidate, background sync, push notifications.

### Важные нюансы и краеугольные камни

- AppCache работал **только по HTTPS** (кроме localhost) — как и Service Workers.
- Manifest должен отдаваться с MIME-типом `text/cache-manifest`.
- Любая ошибка загрузки ресурса из manifest → весь AppCache не применяется.
- Сам HTML-файл с атрибутом `manifest` неявно добавлялся в CACHE — частая ловушка.

### Примеры

```html
<!-- УСТАРЕЛО — только для понимания истории, не использовать -->
<!DOCTYPE html>
<html manifest="/app.appcache" lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>Офлайн-приложение</title>
</head>
<body>
  <p>Это приложение работает офлайн (AppCache — deprecated)</p>
</body>
</html>
```

```js
// Современный подход: регистрация Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((reg) => console.log('SW registered:', reg.scope))
    .catch((err) => console.error('SW registration failed:', err));
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Почему AppCache называют «dain bramaged»? (Jake Archibald — фундаментальные архитектурные проблемы)
- Чем Service Worker лучше AppCache? (программный контроль, стратегии кеширования, фоновая синхронизация)
- Какие основные стратегии кеширования в Service Workers? (cache-first, network-first, stale-while-revalidate)
- Что происходило при обновлении ресурса в AppCache? (пользователь видел старую версию до следующей загрузки)
- Работает ли AppCache в современных браузерах? (нет — полностью удалён)

### Красные флаги (чего не говорить)

- «AppCache ещё можно использовать для legacy-проектов» — удалён из всех браузеров.
- «Service Worker и AppCache — одно и то же, просто новый API» — принципиально разные модели.
- «AppCache был удалён из-за безопасности» — главная причина — архитектурные недостатки и негибкость.

### Связанные темы

- [`070-uluchshenie-proizvoditelnosti-html.md`](./070-uluchshenie-proizvoditelnosti-html.md) — современные методы оптимизации
- [`064-noscript-i-script.md`](./064-noscript-i-script.md) — управление загрузкой ресурсов
