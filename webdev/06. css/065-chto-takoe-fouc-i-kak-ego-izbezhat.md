# Q065. Что такое Flash Of Unstyled Content (FOUC)? Как его избежать?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**FOUC (Flash of Unstyled Content)** — мерцание нестилизованного контента: страница на мгновение отображается без CSS-стилей, затем «прыгает» к стилизованному виду. Причина — CSS загружается асинхронно или после HTML. Решение: размещать `<link rel="stylesheet">` в `<head>`, избегать `@import` в CSS, инлайнить критический CSS.

---

## Развёрнутый ответ

### Суть и определение

FOUC происходит, когда:
1. Браузер начинает рендерить HTML до загрузки CSS.
2. Сначала отображает «голый» HTML с браузерными дефолтами.
3. После загрузки CSS — перерисовывает со стилями.

**Смежные явления:**
- **FOIT** (Flash of Invisible Text) — шрифт не загружен, текст невидим.
- **FOUT** (Flash of Unstyled Text) — сначала виден fallback-шрифт, затем подгружается кастомный.
- **CLS** (Cumulative Layout Shift) — сдвиги layout при загрузке (Core Web Vital).

### Как это работает

**Почему `<link>` в `<head>` предотвращает FOUC:**
CSS является **render-blocking ресурсом**. `<link rel="stylesheet">` в `<head>` останавливает рендер до загрузки CSS → страница не отображается без стилей.

**Причины FOUC:**

| Причина | Механизм |
|---------|---------|
| `<link>` в `<body>` | HTML рендерится выше `<link>`, CSS приходит позже |
| `@import` в CSS | Последовательная загрузка CSS (waterfall) |
| JS-подключение CSS | `document.head.appendChild(link)` не блокирует рендер |
| `media="print"` → `all` паттерн | При изменении media браузер применяет стили позже |
| Медленная сеть | CSS не успел загрузиться до первого рендера |

### Решения

**1. `<link>` в `<head>` (основное):**
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page</title>
  <!-- CSS здесь — блокирует рендер -->
  <link rel="stylesheet" href="/styles/main.css">
</head>
```

**2. Избегать `@import` в CSS:**
```css
/* Плохо: создаёт waterfall */
@import url('typography.css');
@import url('components.css');

/* Хорошо: один связанный файл или @layer без import */
```

**3. Critical CSS инлайн:**
```html
<head>
  <style>
    /* Critical above-the-fold стили */
    body { margin: 0; font-family: system-ui; }
    .header { background: #fff; height: 60px; }
  </style>
  <!-- Некритичный CSS асинхронно -->
  <link rel="preload" href="/styles/main.css" as="style" onload="this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/styles/main.css"></noscript>
</head>
```

**4. FOUT/FOIT — шрифты:**
```css
/* font-display управляет поведением при загрузке шрифта */
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2') format('woff2');
  font-display: swap;    /* FOUT: сначала fallback, затем кастомный */
  /* font-display: block; — FOIT: невидимый текст до загрузки */
  /* font-display: optional; — загрузится только при быстром соединении */
}
```

**5. Preload для критических ресурсов:**
```html
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/styles/critical.css" as="style">
```

### Практика и применение

- SSR-фреймворки (Next.js, Nuxt) автоматически встраивают critical CSS в `<head>`.
- Инструменты экстракции Critical CSS: `critical` npm-пакет, Critters (webpack/Vite).
- `font-display: swap` — компромисс между FOIT и FOUT; рекомендован Google PageSpeed.
- `size-adjust` в `@font-face` — подбор метрик fallback-шрифта под кастомный (уменьшает CLS).

### Важные нюансы и краеугольные камни

- CSS в `<head>` блокирует рендер — это **необходимо** для предотвращения FOUC; это не недостаток.
- При асинхронной загрузке CSS через JS (не `<link>`) — FOUC неизбежен без другой стратегии.
- `preconnect` для шрифтовых CDN: `<link rel="preconnect" href="https://fonts.gstatic.com">`.
- `font-display: optional` — лучший для производительности (FCP), но шрифт может не загрузиться на медленных соединениях.
- В SPA (React) — критический CSS можно передать через SSR (Next.js, Remix) для избежания FOUC при гидрации.

### Примеры

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Без FOUC</title>

  <!-- 1. Preconnect для шрифтов -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- 2. Preload критичного шрифта -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>

  <!-- 3. Critical CSS inline -->
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; }
    .header { height: 64px; background: #fff; display: flex; align-items: center; padding: 0 24px; }
  </style>

  <!-- 4. Основной CSS — render-blocking в head -->
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>...</body>
</html>
```

```css
/* font-display для борьбы с FOUT */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
  /* Метрика для минимизации CLS */
  size-adjust: 100%;
  ascent-override: 90%;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему render-blocking CSS — это хорошо для FOUC?** — Предотвращает рендер без стилей; плохо только если CSS большой и медленно грузится.
- **Что такое Critical CSS и как его экстрактировать?** — Стили for above-the-fold контента; `critters` (Vite/webpack) или `critical` npm-пакет.
- **Как `font-display: swap` помогает с CLS?** — Сначала fallback-шрифт, затем кастомный; `size-adjust` подбирает метрики для минимизации сдвига.
- **Как Next.js предотвращает FOUC?** — Встраивает critical CSS в `<style>` в `<head>` при SSR; CSS-in-JS экстрактируется аналогично.

### Красные флаги (чего не говорить)

- «CSS нужно загружать асинхронно всегда» — критический CSS должен быть render-blocking или inline.
- «FOUC — только проблема шрифтов» — FOUC включает любой unstyled контент, не только шрифты.

### Связанные темы

- `003-varianty-dobavleniya-css-stiley-na-stranicu.md`
- `001-chto-takoe-css.md`
