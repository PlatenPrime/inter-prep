# Q015. Методы оптимизации загрузки шрифтов?

> **Источник:** [13. performance.md](../13.%20performance.md) · **Тема:** Performance

---

## Короткий ответ

Оптимизация загрузки шрифтов включает: выбор формата WOFF2, `font-display` для управления FOIT/FOUT, `preload` критических шрифтов, self-hosting вместо Google Fonts (устраняет DNS+TLS), `unicode-range` и `font-subsetting` для загрузки только используемых символов, а также `size-adjust`/`ascent-override` для нормализации метрик фолбэк-шрифта (устранение CLS). Шрифты — частая причина FOUT и CLS на производственных сайтах.

---

## Развёрнутый ответ

### Суть и определение

Веб-шрифты влияют на несколько метрик: **LCP** (если шрифт блокирует отрисовку), **CLS** (если при загрузке шрифта текст «прыгает»), **FCP** (FOIT скрывает текст). Правильная стратегия зависит от того, насколько важна точность отображения vs скорость первого рендеринга.

### Как это работает

#### Форматы шрифтов

| Формат | Сжатие | Поддержка |
|--------|--------|-----------|
| WOFF2 | Лучшее (Brotli-based) | Все актуальные браузеры |
| WOFF | Хорошее | IE11+ |
| TTF/OTF | Нет | Устаревший |
| EOT | — | Только IE |

**Всегда использовать WOFF2** как основной формат, WOFF — как fallback для IE11.

#### `font-display` — управление поведением при загрузке

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2'),
       url('/fonts/inter.woff')  format('woff');
  font-display: swap; /* или optional, fallback, block */
}
```

| Значение | Block period | Swap period | Поведение |
|----------|-------------|-------------|-----------|
| `auto` | Браузер решает (~3с) | Неограниченный | Дефолт; обычно как `block` |
| `block` | ~3 с (невидимый) | Неограниченный | FOIT: текст скрыт, потом появляется |
| `swap` | Мгновенный | Неограниченный | FOUT: системный шрифт → веб-шрифт |
| `fallback` | ~100 мс | ~3 с | Компромисс: короткий FOIT, потом swap |
| `optional` | ~100 мс | Нет | Загружает только при быстром соединении; нет FOUT |

**Рекомендации:**
- `swap` — для текстового контента, где читаемость важнее стабильности (может вызвать CLS).
- `optional` — лучший для CLS (нет подстановки после загрузки); шрифт кэшируется и используется со второго визита.
- `fallback` — компромисс между `swap` и `optional`.

#### Preload критических шрифтов

```html
<head>
  <!-- Предзагрузка до парсинга CSS — ОБЯЗАТЕЛЕН crossorigin -->
  <link
    rel="preload"
    href="/fonts/inter-regular.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous">
</head>
```

**Важно:** `crossorigin="anonymous"` обязателен даже для self-hosted шрифтов — шрифты всегда загружаются с CORS; без атрибута браузер сделает два запроса.

#### Self-hosting vs Google Fonts

**Google Fonts (традиционный способ):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
```

**Минусы Google Fonts:**
- Дополнительный DNS-lookup + TCP + TLS к двум origin.
- GDPR-проблемы (немецкие суды штрафовали за передачу IP Google).
- Нет полного контроля над версией шрифта.

**Self-hosting (предпочтительный способ):**
```css
/* Шрифты лежат на вашем сервере/CDN */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: optional;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-700.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: optional;
}
```

**Инструменты для подготовки self-hosted шрифтов:**
- [google-webfonts-helper](https://gwfh.mranftl.com/) — генерирует WOFF/WOFF2 + CSS.
- [fontsquirrel](https://www.fontsquirrel.com/tools/webfont-generator) — конвертация и subsetting.

#### Subsetting — загрузить только нужные символы

```css
/* Латиница только, без кириллицы/азиатских символов */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC;
}

/* Кириллица — отдельный файл, загружается только при наличии кирилл. текста */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-cyrillic.woff2') format('woff2');
  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1;
}
```

#### Устранение CLS от шрифтов: `size-adjust` и Font Metric Override

```css
/* Настраиваем фолбэк-шрифт чтобы его метрики совпадали с веб-шрифтом */
@font-face {
  font-family: 'Inter-fallback';
  src: local('Arial');
  size-adjust: 107%;       /* компенсируем разницу в размере */
  ascent-override: 90%;    /* высота заглавных букв */
  descent-override: 22%;   /* «хвосты» букв */
  line-gap-override: 0%;
}

body {
  font-family: 'Inter', 'Inter-fallback', sans-serif;
}
```

Инструмент для автоматического расчёта: [fontaine](https://github.com/unjs/fontaine) (используется в Nuxt), Next.js делает это автоматически через `next/font`.

#### Next.js Font Optimization

```javascript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'optional',
  preload: true,
  variable: '--font-inter',
});

// Next.js автоматически:
// - self-hosts шрифт
// - генерирует size-adjust CSS
// - preloads критические начертания
// - устраняет CLS
```

### Практика и применение

**Полный чеклист для production:**
1. WOFF2 + самохостинг.
2. `font-display: optional` (нет CLS, нет FOUT).
3. `<link rel="preload">` для 1-2 критических начертаний.
4. `unicode-range` + subsetting под языки контента.
5. `size-adjust` для фолбэка (или Next.js/Nuxt автоматически).
6. Long-term кэш для шрифтовых файлов (`Cache-Control: public, max-age=31536000, immutable`).
7. Не загружать более 3 начертаний (weight/style).

### Важные нюансы и краеугольные камни

- **Variable fonts** — один файл вместо нескольких начертаний; меньше запросов, но файл крупнее одного начертания.
- **`font-display: swap` вызывает CLS** при переключении с фолбэка на веб-шрифт, если метрики шрифтов отличаются.
- **Preload шрифта без использования** — Console warning и потраченная полоса.
- **Preload только используемые начертания**: если preload `inter-400` и `inter-700`, а `inter-300` нет — ок; браузер dogrades до ближайшего доступного.
- **Google Fonts CSS2 API** с `display=optional` и `preload` — разумный компромисс если не хочется self-hosting.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `crossorigin` обязателен при preload шрифта?** — Шрифты загружаются с CORS; без атрибута preload и реальный запрос используют разные режимы → два отдельных запроса.
- **Чем `font-display: optional` отличается от `swap`?** — `optional` не заменяет системный шрифт после загрузки веб-шрифта (нет FOUT, нет CLS); `swap` всегда заменяет.
- **Что такое Variable Font?** — Одна .woff2-файл поддерживает все начертания через оси (weight, width, slant); меньше HTTP-запросов.
- **Как `size-adjust` предотвращает CLS?** — Масштабирует фолбэк-шрифт так, чтобы его размер совпадал с веб-шрифтом → при загрузке веб-шрифта сдвиг минимален или равен нулю.
- **Зачем `unicode-range`?** — Браузер загружает шрифт только если на странице есть символы из диапазона; для сайта только на латинице не нужен японский subset.

### Красные флаги (чего не говорить)

- «Всегда используй `font-display: block`» — скрывает текст на ~3 с; плохой UX.
- «Google Fonts бесплатен и быстр, всегда его использую» — дополнительный RTT к внешнему origin; GDPR-риски; нет контроля версии.
- «`font-display: swap` решает все проблемы шрифтов» — решает FOIT, но вызывает CLS; нужен `size-adjust`.
- «Preload всех начертаний шрифта» — расходует сеть на редко используемые варианты (italic, thin); preload только то, что сразу нужно.

### Связанные темы

- `007-raznica-mezhdu-preload-prefetch-preconnect-i-prerender.md`
- `010-rasskazhite-o-metrikakh-core-web-vitals.md`
- `012-sposoby-umensheniya-vremeni-zagruzki-veb-stranicy.md`
- `001-nazvajte-kriticheskie-etapy-renderinga-critical-rendering-path.md`
