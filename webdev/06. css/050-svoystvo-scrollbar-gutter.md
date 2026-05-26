# Q050. Расскажите о свойстве `scrollbar-gutter`?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**`scrollbar-gutter`** управляет тем, резервируется ли место для полосы прокрутки, когда она не отображается. Значение `stable` резервирует пространство под скроллбар всегда — это предотвращает «прыжки» layout при появлении/исчезновении скроллбара.

---

## Развёрнутый ответ

### Суть и определение

| Значение | Поведение |
|---------|----------|
| `auto` | Место резервируется только когда скроллбар есть (дефолт) |
| `stable` | Место резервируется всегда (даже без скроллбара) |
| `stable both-edges` | Резервируется по обе стороны для симметрии |

### Как это работает

На **классических скроллбарах** (Windows, некоторые Linux) — полоса прокрутки занимает физическое место в layout. Когда контент становится достаточно длинным и скроллбар появляется, ширина содержимого уменьшается → layout пересчитывается → «прыжок».

`scrollbar-gutter: stable` — резервирует место под скроллбар **заранее**, даже когда он не нужен. Прыжка не происходит.

На **overlay scrollbars** (macOS, iOS по умолчанию) — скроллбар накладывается поверх контента, не занимает место. `scrollbar-gutter` не имеет визуального эффекта.

**`both-edges`** — зеркальное резервирование с обеих сторон для симметрии текста в центрированных layout.

### Практика и применение

- **Модальные окна**: при открытии модалки с `overflow: hidden` на `body` — скроллбар страницы исчезает → прыжок layout. Решение: `scrollbar-gutter: stable` на `html` или `body`.
- **Динамически загружаемый контент**: список, который может стать длиннее viewport — место резервируется сразу.
- **Симметричные header/footer**: `scrollbar-gutter: stable both-edges` сохраняет симметрию при добавлении скроллбара.

### Важные нюансы и краеугольные камни

- Работает только с `overflow: auto | scroll` (скроллбар должен быть разрешён).
- Не влияет на overlay scrollbars (macOS) — visually no difference.
- Поддержка: Chrome 94+, Firefox 97+, Safari 15.4+.
- Альтернативное решение до `scrollbar-gutter`: `padding-right: calc(100vw - 100%)` на `body` — вычитает ширину скроллбара.
- `scrollbar-width: thin | auto | none` (CSS Scrollbars Level 1) — управляет стилем скроллбара (вместо `::-webkit-scrollbar`).

### Примеры

```css
/* Предотвращение прыжков при открытии модалки */
html {
  scrollbar-gutter: stable;
}

/* Симметричный layout */
.page-content {
  scrollbar-gutter: stable both-edges;
  /* Зарезервировано место с обеих сторон */
}

/* Совместно с scrollbar-width */
html {
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

/* Альтернативный подход без scrollbar-gutter */
body.modal-open {
  overflow: hidden;
  padding-right: calc(100vw - 100%); /* ширина скроллбара */
}
```

```javascript
// Динамически вычислить ширину скроллбара
function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

// При открытии модалки
document.body.style.paddingRight = getScrollbarWidth() + 'px';
document.body.style.overflow = 'hidden';
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему на macOS `scrollbar-gutter: stable` ничего не меняет визуально?** — Overlay scrollbars не занимают место в layout.
- **Как решить прыжок layout до `scrollbar-gutter`?** — `padding-right: calc(100vw - 100%)` при `overflow: hidden` на body.
- **Что такое `scrollbar-width` и `scrollbar-color`?** — Стандартные CSS-свойства (вместо `::-webkit-scrollbar`) для кастомизации скроллбара; поддержка Chrome 121+, Firefox 64+.

### Красные флаги (чего не говорить)

- «`scrollbar-gutter` стилизует скроллбар» — только резервирует пространство; для стилизации — `scrollbar-color` / `scrollbar-width`.
- «Работает только на Windows» — работает везде, но визуальный эффект только на non-overlay scrollbars.

### Связанные темы

- `016-blochnaya-model-css.md`
- `049-svoystvo-outline.md`
