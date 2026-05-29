# Q012. Способы уменьшения времени загрузки веб-страницы?

> **Источник:** [13. performance.md](../13.%20performance.md) · **Тема:** Performance

---

## Короткий ответ

Время загрузки уменьшается на нескольких уровнях: **сеть** (CDN, HTTP/2, сжатие, кэш), **ресурсы** (минификация, code splitting, lazy loading), **рендеринг** (SSR/SSG, критический CSS, устранение render-blocking), **изображения** (WebP/AVIF, responsive images, lazy load) и **браузерные оптимизации** (preload, preconnect). Единого универсального решения нет — нужен профилинг конкретной страницы и работа с узкими местами.

---

## Развёрнутый ответ

### Суть и определение

«Время загрузки» — обобщённое понятие. На практике оптимизируют конкретные метрики: TTFB, FCP, LCP, TTI, TBT. Каждый слой стека (сервер, сеть, браузер, код) вносит свой вклад в итоговое время.

### Как это работает

Путь запроса и области оптимизации:

```
Пользователь → DNS → TCP → TLS → Server → Network → Browser Parse → Render
    │            │      │     │       │         │            │           │
  N/A         DNS      TCP  TLS    TTFB      Transfer    Parse/Exec    CRP
           prefetch  preconn  CDN   SSR/cache  compress  code split  crit.CSS
```

### Практика и применение

#### 1. Сетевой уровень

**CDN (Content Delivery Network)**
```
Без CDN: Пользователь (Москва) → Сервер (NY) — ~150ms RTT
С CDN:   Пользователь (Москва) → Edge (Франкфурт) — ~20ms RTT
```

**HTTP/2 и HTTP/3**
- HTTP/2: мультиплексирование (много запросов по одному соединению), header compression (HPACK), server push (устарел).
- HTTP/3 (QUIC): UDP-based, 0-RTT reconnect, устойчив к packet loss.

**DNS Prefetch + Preconnect**
```html
<link rel="preconnect" href="https://api.example.com">
<link rel="dns-prefetch" href="https://cdn.example.com">
```

#### 2. Сжатие и кэширование

**Текстовые ресурсы: Brotli > Gzip**
```nginx
# Nginx: Brotli
brotli on;
brotli_comp_level 6;
brotli_types text/html text/css application/javascript application/json;

# Fallback: Gzip
gzip on;
gzip_types text/html text/css application/javascript;
```

**Cache-Control стратегия**
```nginx
# HTML: короткий кэш или no-store (меняется часто)
location ~* \.html$ {
  add_header Cache-Control "no-cache";
}

# JS/CSS с хешем в имени: долгий кэш
location ~* \.[0-9a-f]{8}\.(js|css)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}

# Изображения
location ~* \.(jpg|webp|avif|png)$ {
  add_header Cache-Control "public, max-age=604800";
}
```

#### 3. Оптимизация JavaScript

**Code splitting по маршрутам**
```javascript
// Vite/Webpack автоматически делает чанки
const Product = lazy(() => import('./pages/Product'));
const Checkout = lazy(() => import('./pages/Checkout'));
```

**Tree shaking — убираем мёртвый код**
```javascript
// Плохо: импорт всего lodash (~70KB gzipped)
import _ from 'lodash';
// Хорошо: только нужная функция, tree-shakeable
import { debounce } from 'lodash-es';
```

**Минификация + Terser**
```javascript
// vite.config.ts
export default {
  build: {
    minify: 'terser',
    terserOptions: { compress: { drop_console: true } },
  },
};
```

**Analyse bundle**
```bash
# webpack-bundle-analyzer / vite-bundle-visualizer
npx vite-bundle-visualizer
```

#### 4. Оптимизация CSS

**Critical CSS inline + async load остального**
```html
<head>
  <style>/* critical above-the-fold CSS */</style>
  <link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
</head>
```

**PurgeCSS — убираем неиспользуемые стили**
```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.html', './src/**/*.tsx'],
    }),
  ],
};
```

#### 5. Изображения

```html
<!-- WebP с fallback, правильные размеры, lazy -->
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" width="1200" height="630"
       loading="eager" fetchpriority="high"
       alt="Hero image">
</picture>

<!-- Адаптивные изображения -->
<img
  srcset="image-480.webp 480w, image-800.webp 800w, image-1200.webp 1200w"
  sizes="(max-width: 480px) 480px, (max-width: 800px) 800px, 1200px"
  src="image-1200.webp"
  loading="lazy"
  alt="...">
```

#### 6. Рендеринг

**SSR/SSG вместо CSR (SPA)**
- CSR: пустой HTML → JS → render (высокий FCP/LCP/TTI).
- SSR: готовый HTML → hydrate (низкий FCP/LCP, TTI зависит от JS).
- SSG: готовый HTML из CDN → мгновенный FCP/LCP.

**Resource hints**
```html
<link rel="preload" href="hero.webp" as="image">
<link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin>
```

#### 7. Третьесторонние скрипты

```javascript
// Загружать аналитику/чаты после load
window.addEventListener('load', () => {
  setTimeout(() => {
    const s = document.createElement('script');
    s.src = 'https://analytics.example.com/script.js';
    document.head.appendChild(s);
  }, 1000); // Дополнительная задержка для приоритета основного контента
});
```

### Важные нюансы и краеугольные камни

- **Профилируй перед оптимизацией**: Lighthouse → выявить узкое место → оптимизировать → измерить снова.
- **Бесполезно оптимизировать JS, если TTFB = 3 с** — сначала сервер/CDN.
- **HTTP/2 multiplexing** делает менее критичным объединение файлов (bundling) — но парсинг JS по-прежнему дорог.
- **`immutable` в Cache-Control** — браузер не делает revalidation-запрос даже при принудительном обновлении; работает только с хешированными именами файлов.
- **Service Worker кэш** — даёт мгновенную загрузку при повторных визитах; требует стратегии инвалидации.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **С чего начать оптимизацию незнакомой страницы?** — Lighthouse → Network waterfall → Coverage (неиспользованный JS/CSS) → Performance timeline.
- **Почему Brotli лучше Gzip?** — Brotli даёт на ~15–25% лучшее сжатие при схожем CPU overhead; особенно эффективен для JS и HTML.
- **Когда SSG лучше SSR?** — Контент редко меняется (блог, документация); SSG = статика с CDN = максимально быстрый TTFB.
- **Как третьесторонние скрипты влияют на TTI?** — Исполняются на main thread, создают Long Tasks, блокируют интерактивность; нужно откладывать загрузку.
- **Что такое `immutable` директива кэша?** — Сообщает браузеру, что ресурс никогда не изменится; убирает revalidation-запросы при повторных визитах.

### Красные флаги (чего не говорить)

- «Просто включу Gzip и всё станет быстро» — сжатие важно, но не решает TTFB, большой JS-бандл, render-blocking ресурсы.
- «Минификация — главный способ оптимизации» — экономия обычно 10–30%; code splitting и lazy loading дают в разы больше.
- «CDN только для статики» — CDN с edge computing (Cloudflare Workers, Vercel Edge) умеет кэшировать и SSR-ответы.
- «Кэшировать всё максимально» — HTML с длинным кэшем = пользователи видят старую версию после деплоя.

### Связанные темы

- `001-nazvajte-kriticheskie-etapy-renderinga-critical-rendering-path.md`
- `007-raznica-mezhdu-preload-prefetch-preconnect-i-prerender.md`
- `008-dlya-chego-nuzhen-pattern-prpl.md`
- `013-kak-optimizirovat-zagruzku-izobrazhenij.md`
- `016-chto-takoe-koefficient-szhatiya-compression-ratio.md`
