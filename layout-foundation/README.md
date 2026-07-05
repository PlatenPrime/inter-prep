# Layout Foundation — база по вёрстке

Универсальный шаблон и гайд для быстрого старта во фронтенд-вёрстке. Без BEM, без фреймворков — только HTML, CSS и 30 строк JS для мобильного меню.

## Быстрый старт

1. Открой `index.html` в браузере (двойной клик или Live Server).
2. Сузь окно до 320px — появится бургер, сетки схлопнутся, sidebar уйдёт вниз.
3. Пройди по секциям страницы и сопоставь их с разделами этого README.

## Структура проекта

```
layout-foundation/
├── index.html          # Живой макет со всеми паттернами
├── README.md           # Этот гайд
├── css/
│   ├── reset.css       # Нормализация браузерных стилей
│   ├── tokens.css      # Переменные: цвета, отступы, брейкпоинты
│   ├── layout.css      # Примитивы: container, stack, grid, sidebar
│   ├── typography.css  # Заголовки, абзацы, ссылки
│   ├── components.css  # Header, nav, card, footer, кнопки
│   └── main.css        # Импорт всех слоёв
└── js/
    └── nav.js          # Мобильное меню
```

---

## 1. Как читать макет (Figma → HTML)

Макет — это не картинка, а **дерево областей**. Алгоритм:

1. **Сверху вниз** — найди крупные зоны: header, main, footer.
2. **Слева направо** — внутри зоны найди колонки (sidebar + content, grid карточек).
3. **Нарисуй дерево** на бумаге или в комментарии:

```
page
├── header
│   └── container
│       ├── logo
│       ├── nav
│       └── burger (mobile)
├── main
│   └── container
│       ├── section (hero)
│       ├── section (sidebar-layout)
│       └── section (grid)
└── footer
    └── container
        └── footer-grid
```

4. **Один блок = один HTML-элемент** с семантическим тегом (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`).
5. **Класс** — только если нужен для стилей или JS. Не вешай класс на каждый `div` «на всякий случай».

---

## 2. Именование классов (без BEM)

Четыре слоя — не смешивай их:

| Слой | Назначение | Примеры |
|------|------------|---------|
| **Семантика** | Роль блока на странице | `site-header`, `main-nav`, `site-footer` |
| **Состояние** | Вкл/выкл, открыто/закрыто | `is-open`, `is-nav-open`, `is-hidden-mobile` |
| **Layout** | Схема раскладки (переиспользуемая) | `container`, `stack`, `grid-3`, `sidebar-layout` |
| **Визуал** | Оформление компонента | `card`, `btn`, `badge`, `tag` |

### Правила

- Имена **на английском**, через дефис: `sidebar-layout`, не `sidebarLayout`.
- Модификатор через второй класс: `btn btn--primary`, `stack stack--lg`.
- Элемент внутри блока — через `__` только если это часть одного компонента: `sidebar-layout__aside` (допустимо, это не BEM-блок, а просто связь).
- **Не** называй классы по внешнему виду: плохо `red-box`, хорошо `card card--danger`.

---

## 3. Контейнер — главный строительный блок

```html
<div class="container">
  <!-- весь контент секции -->
</div>
```

**Зачем:**
- `max-width` — контент не растягивается на весь экран на широких мониторах.
- `padding-inline` — отступы от краёв на узких экранах.
- `margin-inline: auto` — центрирование.

**Не путай:**
- `container` — внутри `main`, ограничивает контент.
- `page` / `body` — на всю ширину viewport, фон, общий layout.

Типичная вложенность:

```html
<main>
  <section class="section">
    <div class="container">
      <h2>Заголовок</h2>
      <div class="grid-3">...</div>
    </div>
  </section>
</main>
```

---

## 4. Правило вложенности

```
page → header / main / footer
  main → section
    section → container
      container → layout-примитив (stack, grid, sidebar)
        примитив → контент (card, text, img)
```

**Никогда** не ставь `grid-3` прямо на `body`. Всегда: секция → контейнер → примитив → карточки.

---

## 5. Нормализация (reset.css)

Браузеры по-разному стилизуют `body`, `h1`, списки, кнопки. Reset делает базу предсказуемой:

| Что сбрасываем | Зачем |
|----------------|-------|
| `margin: 0` на заголовках, параграфах | убираем «случайные» отступы |
| `box-sizing: border-box` | padding не ломает ширину |
| `img { max-width: 100% }` | картинки не вылезают за контейнер |
| `button { font: inherit }` | кнопки наследуют шрифт страницы |
| Списки без маркеров глобально | маркеры включаем классом `.list` |

Reset — **первый** файл в `main.css`. Поверх него — твои стили.

---

## 6. Адаптивность (mobile-first)

### Принцип

Сначала стили для **узкого** экрана (без media query). Потом добавляй правила для шире:

```css
/* База: 1 колонка */
.grid-3 {
  grid-template-columns: 1fr;
}

/* Tablet: 2 колонки */
@media (min-width: 48rem) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 колонки */
@media (min-width: 64rem) {
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Брейкпоинты (из tokens.css)

| Переменная | Значение | Когда использовать |
|------------|----------|-------------------|
| `--bp-md` | 48rem (768px) | навигация, 2 колонки |
| `--bp-lg` | 64rem (1024px) | sidebar в ряд, 3 колонки |

### Скрытие элементов

- `is-hidden-mobile` — скрыт на mobile, виден на desktop.
- Кнопка меню (`.menu-toggle`) скрыта на desktop через `@media (min-width: 48rem)`.

### Переполнение навигации

Если пунктов меню больше, чем помещается в шапку:

- **Desktop** — `.main-nav` скроллится по горизонтали (`overflow-x: auto`), логотип не сжимается.
- **Mobile** — dropdown ограничен по высоте (`--nav-dropdown-max-height`) и скроллится внутри; страница под оверлеем не двигается.

### Обязательно в `<head>`

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

---

## 7. Типографика

Все размеры в **rem** (1rem = размер шрифта `html`, обычно 16px):

| Класс / тег | Размер | Когда |
|-------------|--------|-------|
| `h1` | `--text-3xl` / `4xl` на desktop | один на страницу |
| `h2` | `--text-2xl` | заголовки секций |
| `h3` | `--text-xl` | подзаголовки |
| `p` | `--text-base` | основной текст |
| `.lead` | `--text-lg`, muted | вводный абзац |
| `.text-small` | `--text-sm` | подписи, мета |

### Ширина текста

Длинные строки тяжело читать. Ограничивай:

```css
.prose {
  max-width: 65ch; /* ch = ширина символа "0" */
}
```

### line-height

- Заголовки: `1.25` (плотнее).
- Текст: `1.6` (комфортнее для чтения).

---

## 8. Flex vs Grid — когда что

| Задача | Примитив | Почему |
|--------|----------|--------|
| Вертикальный поток блоков | `stack` | flex column + gap |
| Кнопки/теги в ряд с переносом | `cluster` | flex wrap |
| Sidebar + main | `sidebar-layout` | flex row/column |
| Одинаковые карточки в сетке | `grid-2`, `grid-3` | grid проще для равных колонок |
| Центрирование одного элемента | `center` | flex center |

**Правило:** если элементы **в ряд или колонку** — flex. Если **сетка одинаковых ячеек** — grid.

---

## 9. Позиционирование

| Значение | Когда |
|----------|-------|
| `static` | по умолчанию, поток документа |
| `relative` | точка отсчёта для absolute-детей |
| `absolute` | badge, иконка, tooltip внутри карточки |
| `fixed` | мобильное меню, overlay, кнопка «наверх» |
| `sticky` | header при скролле |

Пример из макета:

```html
<article class="card">        <!-- position: relative -->
  <span class="badge">New</span>  <!-- position: absolute; top; right -->
  ...
</article>
```

---

## 10. Layout-примитивы — шпаргалка

| Класс | HTML | Поведение |
|-------|------|-----------|
| `container` | обёртка контента | max-width + padding |
| `stack` | `<div class="stack">` | вертикальный gap |
| `cluster` | `<div class="cluster">` | горизонтальный wrap |
| `grid-2` | `<div class="grid-2">` | 1→2 колонки |
| `grid-3` | `<div class="grid-3">` | 1→2→3 колонки |
| `sidebar-layout` | aside + div | колонка→ряд на lg |

Модификаторы отступов: `stack--sm`, `stack--lg`.

---

## 11. Чеклист перед сдачей макета

- [ ] Есть `<meta viewport>`
- [ ] Семантические теги: `header`, `main`, `footer`, `nav`, `section`
- [ ] Контент внутри `.container`, не прилипает к краям на mobile
- [ ] Проверено на 320px, 768px, 1024px, 1440px
- [ ] Картинки не вылезают (`max-width: 100%`)
- [ ] Кликабельные элементы не меньше 44×44px на touch
- [ ] Текст читаем: контраст, не слишком мелкий
- [ ] Нет горизонтального скролла на mobile
- [ ] Интерактив: `:hover`, `:focus` видны

---

## 12. Как использовать как шаблон

1. Скопируй папку `layout-foundation` в свой проект.
2. Оставь `css/reset.css`, `tokens.css`, `layout.css` — меняй токены под дизайн.
3. В `tokens.css` замени `--zone-*` цвета на нейтральные или убери фоны.
4. В `index.html` замени секции на свой контент, сохраняя структуру:
   - `section` → `container` → layout-примитив → контент.
5. Добавляй компоненты в `components.css`, не размазывай стили по HTML.

---

## Карта секций index.html

| Секция | Паттерн | Файл стилей |
|--------|---------|-------------|
| Header | sticky + menu-toggle | `components.css` |
| Hero | stack + typography | `layout.css`, `typography.css` |
| Sidebar | sidebar-layout | `layout.css` |
| Grid | grid-3 | `layout.css` |
| Tags | cluster | `layout.css` |
| Two columns | grid-2 | `layout.css` |
| Badge | position relative/absolute | `components.css` |
| Footer | footer grid | `components.css` |

---

## Дальнейшее изучение

После освоения этого шаблона:

1. Сверстай простой лендинг из Figma, используя только примитивы отсюда.
2. Добавь форму (input, label, validation styles).
3. Попробуй `position: sticky` для sidebar.
4. Изучи CSS Container Queries для компонентов, независимых от ширины страницы.

Удачи на работе!
