# Q008. Для чего нужен паттерн PRPL?

> **Источник:** [13. performance.md](../13.%20performance.md) · **Тема:** Performance

---

## Короткий ответ

**PRPL** — архитектурный паттерн от Google для максимально быстрой начальной загрузки Progressive Web Apps. Аббревиатура: **P**ush (или Preload) критических ресурсов, **R**ender начальный маршрут, **P**re-cache оставшееся, **L**azy-load другие маршруты. Цель — показать первый контент как можно раньше, а оставшееся приложение загрузить в фоне, не блокируя взаимодействие пользователя.

---

## Развёрнутый ответ

### Суть и определение

PRPL предложен командой Chrome в 2016 году как ответ на проблему «отправляем всё сразу» в SPA. Классические бандлы весят сотни KB, парсятся и исполняются на main thread — пользователь долго ждёт TTI. PRPL решает это через агрессивную разбивку кода (code splitting), кэширование через Service Worker и HTTP/2 Server Push / Preload.

### Как это работает

**P — Push/Preload критических ресурсов:**
Доставить минимальный набор ресурсов для первого маршрута до того, как браузер их «откроет» самостоятельно.

- HTTP/2 Server Push (или HTTP Early Hints 103): сервер отправляет ресурсы вместе с HTML, не дожидаясь запроса браузера.
- `<link rel="preload">`: браузер начинает загрузку сразу при парсинге `<head>`.

```html
<head>
  <!-- Preload критического JS для текущего маршрута -->
  <link rel="preload" href="/route-home.js" as="script">
  <!-- Preload LCP-изображения -->
  <link rel="preload" href="/hero.webp" as="image">
</head>
```

**R — Render начального маршрута как можно раньше:**
Использовать только минимальный «скелет» — HTML + критический CSS + JS для текущего маршрута. Всё остальное откладывается.

- SSR или Static Generation: сервер отдаёт готовый HTML, браузер рисует без JS.
- Critical CSS inline: нет render-blocking CSS-файлов.
- Code splitting по маршрутам: бандл `/route-home.js` содержит только код для `/`.

**P — Pre-cache оставшееся:**
После загрузки первого маршрута Service Worker кэширует остальные ресурсы приложения в фоне.

```javascript
// Service Worker: pre-cache стратегия
const PRECACHE_URLS = [
  '/route-about.js',
  '/route-catalog.js',
  '/shared-vendor.js',
  '/fonts/inter.woff2',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('app-v1').then(cache => cache.addAll(PRECACHE_URLS))
  );
});
```

**L — Lazy-load другие маршруты:**
Код маршрутов, которые пользователь ещё не посетил, не загружается вовсе — только при навигации.

```javascript
// React: lazy loading маршрутов
const About = React.lazy(() => import('./routes/About'));
const Catalog = React.lazy(() => import('./routes/Catalog'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/catalog" element={<Catalog />} />
      </Routes>
    </Suspense>
  );
}
```

### Практика и применение

**Стек для PRPL:**
- **Vite / Webpack** — автоматический code splitting по маршрутам (`import()`).
- **Workbox** — генерация Service Worker с precaching.
- **Next.js / Nuxt** — SSR/SSG + автоматический code splitting + prefetch маршрутов.
- **Angular** — встроенный lazy-loading маршрутов (`loadComponent`, `loadChildren`).

**Реальный сценарий:** Интернет-магазин с 50 маршрутами. Пользователь открывает главную — загружается только ~30 KB JS для главной страницы. Service Worker кэширует в фоне бандлы каталога и карточки товара. При переходе — ресурсы отдаются из кэша мгновенно.

### Важные нюансы и краеугольные камни

- **HTTP/2 Server Push** практически deprecated: Chrome и Firefox удалили поддержку из-за проблем с перезаписью кэша. Современная альтернатива — HTTP Early Hints (103) + `preload`.
- **PRPL — концепция, не технология**: нет npm-пакета «PRPL»; это набор приёмов, реализуемых через разные инструменты.
- **Granularity кэширования**: слишком мелкие чанки = много HTTP-запросов; слишком крупные = редкие изменения инвалидируют большой кэш. Optimal: hash-based filenames + long-term caching.
- **Service Worker на первой загрузке не помогает**: SW регистрируется и активируется после загрузки страницы, precache срабатывает только со второго посещения.
- **Core Web Vitals** — PRPL напрямую влияет на LCP (Push/Preload), TTI (минимальный initial JS), CLS (предзагруженные размеры ресурсов).

### Примеры

```
Без PRPL:                          С PRPL:
─────────────────────────         ──────────────────────────────
HTML → полный бандл (800KB)        HTML → critical JS (30KB) → render
Парсинг 800KB JS...                  ↓ background
TTI: ~8s                           Pre-cache остального
                                   TTI: ~1.5s
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем PRPL отличается от обычного code splitting?** — Code splitting — часть PRPL; PRPL также включает Push/Preload для критических ресурсов и Service Worker pre-caching.
- **Почему HTTP/2 Push устарел и что его заменяет?** — Push не учитывал браузерный кэш (отправлял уже закэшированное); Early Hints (103) + preload — более корректная альтернатива.
- **Когда Service Worker помогает, а когда нет?** — Только со второго посещения (первая загрузка — нет SW); не помогает при первом рендере.
- **Как измерить эффект PRPL?** — Lighthouse score, TTI, LCP до и после; Coverage вкладка в DevTools — неиспользованный JS на первой загрузке.
- **PRPL в Next.js — что делает фреймворк автоматически?** — SSR/SSG (R), автоматический code splitting (L), `<Link>` prefetch маршрутов (P pre-cache), `next/image` preload LCP (P push).

### Красные флаги (чего не говорить)

- «PRPL — это библиотека/фреймворк» — паттерн, набор практик, не конкретный инструмент.
- «Service Worker помогает с первой загрузкой» — SW устанавливается после первой загрузки; помогает только со второй.
- «HTTP/2 Push активно используется» — фактически deprecated в major браузерах; нужно Early Hints.
- «Lazy loading достаточно без pre-caching» — без SW-кэша при navigating to lazy route — network request со всеми задержками.

### Связанные темы

- `001-nazvajte-kriticheskie-etapy-renderinga-critical-rendering-path.md`
- `007-raznica-mezhdu-preload-prefetch-preconnect-i-prerender.md`
- `011-chto-takoe-tti-time-to-interactive.md`
- `012-sposoby-umensheniya-vremeni-zagruzki-veb-stranicy.md`
- `014-kak-realizovat-otlozhennuyu-zagruzku-izobrazhenij.md`
