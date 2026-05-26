# Q070. Способы улучшения производительности веб-страницы при использовании HTML?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

HTML предоставляет несколько встроенных механизмов оптимизации: `loading="lazy"` для отложенной загрузки изображений и iframe, `defer`/`async` для неблокирующей загрузки скриптов, `<link rel="preload/prefetch/preconnect">` для управления приоритетами ресурсов, `srcset` и `sizes` для адаптивных изображений. Минимизация глубины DOM и использование нативных семантических элементов вместо div-иерархий снижают нагрузку на рендеринг.

---

## Развёрнутый ответ

### Суть и определение

Производительность на уровне HTML — это не просто «меньше кода», а грамотное управление тем, как браузер загружает, парсит и рендерит ресурсы. Цель: минимизировать время до First Contentful Paint (FCP), Largest Contentful Paint (LCP), снизить Total Blocking Time (TBT) и Cumulative Layout Shift (CLS).

### Как это работает

**1. Ленивая загрузка изображений и iframe**

```html
<img src="photo.jpg" loading="lazy" alt="Фото" width="800" height="600" />
<iframe src="/widget.html" loading="lazy" title="Виджет"></iframe>
```

`loading="lazy"` откладывает загрузку до приближения элемента к viewport. Браузер сам определяет порог (обычно ~1200px от viewport). Атрибуты `width` и `height` критичны — они предотвращают CLS (сдвиг контента при загрузке).

**2. async / defer для скриптов**

```html
<!-- defer: загружается параллельно, выполняется после парсинга, порядок гарантирован -->
<script src="/app.js" defer></script>

<!-- async: загружается параллельно, выполняется немедленно при готовности, порядок не гарантирован -->
<script src="/analytics.js" async></script>
```

Скрипты без атрибутов блокируют HTML-парсер — критичная проблема для LCP.

**3. Resource hints через `<link>`**

```html
<head>
  <!-- preload: загрузить ресурс с высоким приоритетом для текущей страницы -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/hero.jpg" as="image" />

  <!-- preconnect: установить соединение заранее (DNS + TCP + TLS) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://cdn.example.com" crossorigin />

  <!-- dns-prefetch: только DNS-резолюция (легче preconnect, для менее приоритетных хостов) -->
  <link rel="dns-prefetch" href="https://analytics.example.com" />

  <!-- prefetch: загрузить ресурс для следующей навигации (низкий приоритет) -->
  <link rel="prefetch" href="/next-page.js" />

  <!-- prerender: загрузить и отрендерить следующую страницу заранее (осторожно, дорого) -->
  <link rel="prerender" href="/checkout" />
</head>
```

**4. Адаптивные изображения (srcset / sizes)**

```html
<img
  src="hero-800.jpg"
  srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1600.jpg 1600w"
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 800px"
  alt="Главный баннер"
  width="800"
  height="400"
  loading="eager"
  fetchpriority="high"
/>
```

`srcset` позволяет браузеру выбрать оптимальный размер изображения для устройства и DPR (device pixel ratio).

**5. Современные форматы изображений через `<picture>`**

```html
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Описание" width="800" height="600" loading="lazy" />
</picture>
```

**6. Минимизация DOM**

- Избегать избыточной вложенности (div soup).
- Нативные элементы (`<button>`, `<nav>`, `<article>`) вместо `<div role="button">` — меньше JS, встроенная доступность.
- Виртуализация длинных списков на стороне JS (не HTML-уровень, но связано).

**7. `fetchpriority` (Priority Hints)**

```html
<!-- LCP-изображение: повысить приоритет -->
<img src="hero.jpg" fetchpriority="high" alt="Hero" />

<!-- Некритичные изображения: понизить -->
<img src="decoration.jpg" fetchpriority="low" alt="" loading="lazy" />

<!-- Некритичный preload: не перехватывать бандвидт у LCP -->
<link rel="preload" href="/secondary.js" as="script" fetchpriority="low" />
```

**8. Атрибут `decoding` для изображений**

```html
<!-- async: декодирование не блокирует основной поток -->
<img src="large-photo.jpg" decoding="async" alt="Фото" />
```

### Практика и применение

- Hero-изображение: `loading="eager"`, `fetchpriority="high"`, явные `width`/`height`.
- Изображения ниже fold: `loading="lazy"`, `decoding="async"`.
- Шрифты: `<link rel="preconnect">` + `<link rel="preload" as="font" crossorigin>`.
- Сторонние скрипты (аналитика, чат): `async` или `defer`.
- Главный JS-бандл: `defer` или `type="module"`.

### Важные нюансы и краеугольные камни

- `preload` без использования ресурса на странице генерирует предупреждение в DevTools и тратит ресурсы.
- `preconnect` к более чем 4–6 хостам может навредить — каждое соединение требует ресурсов.
- `loading="lazy"` для LCP-изображения — критическая ошибка, задержит LCP.
- Всегда указывать `width` и `height` на `<img>` — браузер резервирует место до загрузки (CLS = 0).
- `crossorigin` на `<link rel="preload">` для шрифтов обязателен — иначе шрифт загрузится дважды.

### Примеры

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Критические ресурсы -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" href="/fonts/inter-v13-latin-regular.woff2"
        as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/critical.css" />

  <!-- Некритичные скрипты -->
  <script src="/app.js" defer></script>
  <script src="/analytics.js" async></script>
</head>
<body>
  <!-- LCP: высокий приоритет, без lazy -->
  <img
    src="/hero.webp"
    alt="Главный баннер"
    width="1200"
    height="600"
    fetchpriority="high"
    decoding="sync"
  />

  <!-- Галерея: lazy + адаптивные размеры -->
  <img
    srcset="/photo-400.webp 400w, /photo-800.webp 800w"
    sizes="(max-width: 600px) 100vw, 50vw"
    src="/photo-800.webp"
    alt="Фото галереи"
    width="800"
    height="600"
    loading="lazy"
    decoding="async"
  />
</body>
</html>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Почему `loading="lazy"` на LCP-изображении — ошибка? (откладывает самый важный ресурс, ухудшает LCP)
- Чем `preload` отличается от `prefetch`? (preload — текущая страница, высокий приоритет; prefetch — будущие страницы, низкий)
- Зачем указывать `width` и `height` на изображениях? (предотвращение CLS — браузер резервирует место)
- В чём опасность избыточного использования `preconnect`? (каждое соединение потребляет ресурсы, можно навредить)
- Как `fetchpriority` связан с Core Web Vitals?

### Красные флаги (чего не говорить)

- «`preload` всё ускоряет — чем больше тем лучше» — лишние preload генерируют предупреждения и тратят пропускную способность.
- «`loading="lazy"` нужно ставить на все изображения» — LCP-изображение должно быть eager.
- «Производительность HTML — только минификация файла» — это лишь малая часть.

### Связанные темы

- [`064-noscript-i-script.md`](./064-noscript-i-script.md) — defer/async в деталях
- [`061-iframe-vs-embed.md`](./061-iframe-vs-embed.md) — `loading="lazy"` для iframe
- [`069-applicationcache-html5.md`](./069-applicationcache-html5.md) — устаревший AppCache vs современные подходы
