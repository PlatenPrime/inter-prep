# Q061. Что такое CSS спрайт? И для чего он используется?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**CSS-спрайт** — техника объединения нескольких маленьких изображений (иконок) в один файл. Нужный фрагмент отображается через `background-position`. Основная цель — сократить количество HTTP-запросов. В современной разработке спрайты во многом заменены **SVG-спрайтами** и **иконочными шрифтами**, а растровые спрайты потеряли актуальность с HTTP/2.

---

## Развёрнутый ответ

### Суть и определение

**Классический растровый спрайт:**
```css
.icon {
  background-image: url('sprites.png');
  background-repeat: no-repeat;
  width: 24px;
  height: 24px;
}
.icon--home    { background-position: 0 0; }
.icon--search  { background-position: -24px 0; }
.icon--profile { background-position: -48px 0; }
```

**Один HTTP-запрос вместо 3+ → ускорение загрузки при HTTP/1.1.**

**SVG-спрайт (современный):**
```html
<!-- sprites.svg -->
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="icon-home" viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </symbol>
  <symbol id="icon-search" viewBox="0 0 24 24">
    <path d="M15.5 14h-.79l-.28-.27A6.47..."/>
  </symbol>
</svg>

<!-- Использование -->
<svg width="24" height="24">
  <use href="sprites.svg#icon-home"/>
</svg>
```

### Как это работает

**Растровый спрайт:**
1. Художник/дизайнер собирает все иконки в одном PNG-файле.
2. CSS задаёт `background-position` для отображения нужного фрагмента.
3. Размер элемента ограничивает видимую область (`width: 24px; height: 24px; overflow: hidden`).

**SVG-спрайт:**
- `<symbol>` определяет переиспользуемый SVG-фрагмент с собственным `viewBox`.
- `<use href="sprite.svg#id">` рендерит символ на месте.
- Один файл содержит все иконки.

### Практика и применение

**Современные альтернативы растровым спрайтам:**

| Метод | Плюсы | Минусы |
|-------|-------|--------|
| SVG-спрайт | Масштабируемость, currentColor, a11y | Больше разметки |
| Inline SVG | Прямой контроль, currentColor | Раздувает HTML |
| Icon Font | Компактность, CSS-цвет | Один цвет, a11y проблемы |
| CSS-спрайт (PNG) | Простота для растровых | Не масштабируется, HTTP/1.1 |
| `<img>` + HTTP/2 | Простота | Много запросов (не проблема) |

**HTTP/2 и спрайты:**
HTTP/2 мультиплексирует запросы — множество маленьких файлов не хуже одного большого. Растровые спрайты потеряли основное преимущество. Но SVG-спрайты всё ещё удобны для управляемости.

### Важные нюансы и краеугольные камни

- Растровые спрайты не масштабируются на Retina — нужны `@2x` версии.
- SVG-спрайты поддерживают `currentColor` — цвет иконки задаётся через CSS `color`.
- `<use href="external.svg#id">` не работает в старых браузерах и при ограничениях CORS (решается inline-спрайтом в HTML).
- Vite/Webpack могут автоматически генерировать SVG-спрайты из папки с иконками (`vite-plugin-svg-icons`, `svg-sprite-loader`).
- Accessibility: `<svg>` нужно `aria-label` или `aria-hidden + sr-only текст` для декоративных/информационных иконок.

### Примеры

```html
<!-- SVG-спрайт inline в HTML (рекомендуется) -->
<body>
  <!-- Скрытый контейнер со всеми символами -->
  <svg style="display:none" aria-hidden="true">
    <symbol id="icon-arrow" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </symbol>
    <symbol id="icon-close" viewBox="0 0 24 24">
      <path d="M19 6.41L17.59 5 12 10.59..."/>
    </symbol>
  </svg>

  <!-- Использование -->
  <button aria-label="Закрыть">
    <svg width="24" height="24" aria-hidden="true">
      <use href="#icon-close"/>
    </svg>
  </button>
</body>
```

```css
/* Классический растровый спрайт */
.icon {
  display: inline-block;
  background-image: url('/img/sprites.png');
  background-size: 120px 24px; /* для retina: двойной размер */
  width: 24px;
  height: 24px;
}
.icon--home   { background-position: 0     0; }
.icon--search { background-position: -24px 0; }
.icon--user   { background-position: -48px 0; }
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему CSS-спрайты менее актуальны при HTTP/2?** — HTTP/2 мультиплексирует запросы; overhead отдельных файлов минимален.
- **Чем SVG-спрайт лучше растрового?** — Масштабируется без потери качества, поддерживает `currentColor`, меньший размер файла для иконок.
- **Как сделать SVG-иконки доступными?** — Декоративные: `aria-hidden="true"` + sr-only текст. Семантические: `<title>` внутри SVG или `aria-label` на обёртке.

### Красные флаги (чего не говорить)

- «CSS-спрайты — основной метод работы с иконками» — устарело; SVG-спрайты и inline SVG более актуальны.
- «SVG-спрайт через `<img>`» — `<img>` не поддерживает `<use>` и CSS-стилизацию.

### Связанные темы

- `043-sposoby-zadaniya-cveta-v-css.md`
- `044-klyuchevoe-slovo-currentcolor-v-css.md`
