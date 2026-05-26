# Q003. Варианты добавления CSS стилей на страницу?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

Существует три способа добавить CSS на страницу: **внешний файл** (`<link rel="stylesheet">`), **встроенный блок** (`<style>` внутри HTML) и **инлайновые стили** (`style=""` на элементе). Внешние файлы — предпочтительный вариант для production: они кешируются браузером и разделяют структуру и представление.

---

## Развёрнутый ответ

### Суть и определение

| Способ | Синтаксис | Область применения |
|--------|-----------|-------------------|
| Внешний файл | `<link rel="stylesheet" href="styles.css">` | Основные стили проекта |
| Встроенный `<style>` | `<style> .foo { ... } </style>` | Critical CSS, email-шаблоны |
| Инлайновые стили | `<div style="color: red">` | Динамические стили из JS |
| `@import` внутри CSS | `@import url('other.css')` | Модульность в CSS (не рекомендуется в prod) |
| JS CSSOM | `el.style.color = 'red'` | Программное управление из JavaScript |

### Как это работает

**Внешний файл (`<link>`):**
- Браузер отправляет отдельный HTTP-запрос за файлом.
- CSS является **render-blocking**: рендеринг приостанавливается до загрузки.
- Файл кешируется — повторные посещения не требуют перезагрузки.
- `media="print"` или `media="(max-width: 768px)"` снижает приоритет загрузки.

**Встроенный `<style>`:**
- Парсируется вместе с HTML, HTTP-запрос не нужен.
- Не кешируется отдельно.
- Применяется для **critical CSS** — минимального набора стилей для первого рендера.

**Инлайновые стили:**
- Имеют наивысшую специфичность среди обычных деклараций (но ниже `!important`).
- Нельзя использовать псевдоклассы/псевдоэлементы.
- Динамически устанавливаются через `element.style.property` или `element.setAttribute('style', ...)`.
- CSS Custom Properties можно задавать через `element.style.setProperty('--color', 'blue')`.

**`@import`:**
- Создаёт дополнительный waterfall запросов — каждый `@import` блокирует загрузку следующего файла.
- В production заменяется бандлером (PostCSS, Sass, Vite).

### Практика и применение

- **Critical CSS** инлайнится в `<head>` для ускорения First Contentful Paint; остальные стили загружаются асинхронно.
- **CSS Modules** и **CSS-in-JS** (styled-components, Emotion) в итоге генерируют либо `<style>` тег, либо инжектируют стили через CSSOM API.
- **SSR** (Next.js) экстрактирует CSS в статический файл при билде; runtime-injection остаётся для динамических тем.

### Важные нюансы и краеугольные камни

- `<link>` в `<body>` вместо `<head>` может вызвать Flash of Unstyled Content (FOUC).
- `@import` внутри `<style>` так же render-blocking, как и внешний файл, но создаёт waterfall.
- `preload` + `<link rel="preload" as="style">` позволяет загрузить CSS высокоприоритетно без немедленной блокировки рендера.
- Инлайновые стили не реагируют на `:hover`, `:focus` и другие псевдоклассы.

### Примеры

```html
<!-- 1. Внешний файл -->
<head>
  <link rel="stylesheet" href="/styles/main.css">
  <!-- Некритичный CSS с низким приоритетом -->
  <link rel="stylesheet" href="/styles/print.css" media="print">
</head>

<!-- 2. Critical CSS инлайн -->
<head>
  <style>
    /* Только то, что нужно для первого рендера above-the-fold */
    body { margin: 0; font-family: sans-serif; }
    .hero { min-height: 100svh; display: flex; align-items: center; }
  </style>
  <!-- Основной CSS загружается асинхронно -->
  <link rel="preload" href="/styles/main.css" as="style" onload="this.rel='stylesheet'">
</head>

<!-- 3. Инлайновые стили через JS для динамической темы -->
<script>
  document.documentElement.style.setProperty('--primary-hue', userPreference.hue);
</script>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `@import` плохо использовать в production?** — Создаёт последовательные HTTP-запросы (waterfall) вместо параллельных.
- **Как загрузить CSS асинхронно?** — `<link rel="preload" as="style" onload="this.rel='stylesheet'">` или `media="print"` с заменой на `all`.
- **Что такое Critical CSS и зачем его инлайнить?** — Стили для above-the-fold контента; избегает FOUC и ускоряет FCP.
- **Как CSS-in-JS добавляет стили?** — Через `<style>` тег (SSR extraction) или CSSStyleSheet API (`adoptedStyleSheets`) в runtime.

### Красные флаги (чего не говорить)

- «`@import` — лучший способ модульности в production» — создаёт waterfall, в продакшене используются бандлеры.
- «Инлайновые стили удобнее всего» — не поддерживают псевдоклассы, нарушают разделение ответственностей, трудно переопределить.
- «Все CSS-файлы нужно класть в `<body>`» — критические стили должны быть в `<head>`.

### Связанные темы

- `001-chto-takoe-css.md`
- `065-chto-takoe-fouc-i-kak-ego-izbezhat.md`
- `004-kak-rabotayut-kaskadnost-i-nasledovanie-v-css.md`
