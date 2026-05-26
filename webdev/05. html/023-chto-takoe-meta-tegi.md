# Q023. Что такое мета-тэги?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

Мета-теги — элементы `<meta>` внутри `<head>`, которые описывают документ для браузера, поисковых систем и социальных платформ. Они не отображаются на странице, но влияют на индексацию, отображение в поисковой выдаче, превью в соцсетях и поведение браузера. Атрибуты `name`/`content` описывают метаданные, `http-equiv` имитирует HTTP-заголовки, `charset` задаёт кодировку.

---

## Развёрнутый ответ

### Суть и определение

`<meta>` — самозакрывающийся элемент-метаданных. Не имеет визуального представления. Работает как декларация свойства документа. Группируется по назначению:

1. **Технические** — кодировка, viewport, тема
2. **SEO** — description, keywords, robots
3. **Open Graph** — превью в Facebook, VK, Telegram
4. **Twitter Cards** — превью в Twitter/X
5. **HTTP-equivalent** — Content-Type, refresh, X-UA-Compatible

### Как это работает

Браузер читает `<head>` до начала рендеринга страницы. Мета-теги обрабатываются в первую очередь — особенно `charset` (должен быть первым в `<head>`) и `viewport` (влияет на начальный layout). Поисковые роботы сканируют мета-теги при индексации.

### Практика и применение

**Обязательные для любой страницы:**
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

**SEO:**
```html
<meta name="description" content="Краткое описание страницы до 160 символов">
<meta name="keywords" content="html, css, javascript"> <!-- почти не влияет на SEO -->
<meta name="robots" content="index, follow">
<meta name="robots" content="noindex, nofollow"> <!-- для закрытых страниц -->
```

**Open Graph (соцсети):**
```html
<meta property="og:title" content="Заголовок для соцсетей">
<meta property="og:description" content="Описание для превью">
<meta property="og:image" content="https://example.com/og.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
```

**Twitter Cards:**
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Заголовок">
<meta name="twitter:image" content="https://example.com/twitter.jpg">
```

**Браузерные настройки:**
```html
<meta name="theme-color" content="#4285f4"> <!-- цвет строки браузера на мобильных -->
<meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- для старых IE -->
<meta http-equiv="refresh" content="30"> <!-- автообновление страницы -->
```

### Важные нюансы и краеугольные камни

- `charset="UTF-8"` обязан быть первым тегом в `<head>` — иначе возможны проблемы с кодировкой до его обнаружения
- `<meta name="keywords">` фактически игнорируется Google с 2009 года, но используется некоторыми другими поисковиками
- `og:image` должна быть абсолютным URL (не относительным)
- `<meta name="robots" content="noindex">` не гарантирует удаление из индекса — нужен также `X-Robots-Tag` HTTP-заголовок
- Дублирование мета-тегов (два `<meta name="description">`) — ошибка, браузер/поисковик возьмёт первый или оба

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Почему `charset` должен быть первым в `<head>`?
- Чем `name` отличается от `property` в `<meta>`?
- Как проверить корректность Open Graph разметки?
- Что такое `http-equiv` и когда он нужен?
- Как мета-теги влияют на Core Web Vitals?

### Красные флаги (чего не говорить)

- «`keywords` важны для SEO» — они устарели для Google
- «Мета-теги можно ставить в `<body>`» — только в `<head>`
- «`og:image` можно задать относительным путём» — нет, нужен абсолютный URL

### Связанные темы

- [024-chto-opisyvaetsya-v-tege-head.md](./024-chto-opisyvaetsya-v-tege-head.md) — полная структура `<head>`
- [025-meta-viewport.md](./025-meta-viewport.md) — viewport в деталях
- Structured Data (JSON-LD) — альтернатива для семантики поисковиков
