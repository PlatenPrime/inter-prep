# Q022. Типы позиционирования в CSS?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

CSS предоставляет пять значений `position`: `static` (поток документа, по умолчанию), `relative` (смещение относительно нормальной позиции), `absolute` (позиционирование относительно ближайшего positioned-предка), `fixed` (относительно viewport), `sticky` (гибрид relative/fixed — «прилипает» при прокрутке). Все, кроме `static`, создают **positioned element** и включают свойства `top`/`right`/`bottom`/`left`/`z-index`.

---

## Развёрнутый ответ

### Суть и определение

| Значение | Влияет на поток | Якорь | Применение |
|----------|----------------|-------|-----------|
| `static` | Да | — | Дефолт, нормальный поток |
| `relative` | Да (место сохраняется) | Своя нормальная позиция | Смещение, containing block для absolute |
| `absolute` | Нет (выпадает из потока) | Ближайший positioned-предок | Оверлеи, тултипы, дропдауны |
| `fixed` | Нет | Viewport (initial containing block) | Шапки, кнопки «назад», тосты |
| `sticky` | Да | Ближайший прокручиваемый предок | Sticky-хедер, sticky-навигация |

### Как это работает

**`relative`:**
- Элемент остаётся в потоке (его место не освобождается).
- `top/left/bottom/right` смещают от нормальной позиции.
- Создаёт **containing block** для `absolute`-потомков.
- Создаёт stacking context при `z-index` ≠ `auto`.

**`absolute`:**
- Выпадает из нормального потока.
- Позиционируется относительно ближайшего **positioned** предка (не `static`).
- Если такого нет — относительно initial containing block (≈ `<html>`).
- `margin: auto` + `inset: 0` = центрирование внутри positioned-контейнера.

**`fixed`:**
- Всегда относительно viewport (initial containing block).
- Исключение: если у предка есть `transform`, `filter` или `perspective` — `fixed` ведёт себя как `absolute`.
- Не прокручивается со страницей.

**`sticky`:**
- Ведёт себя как `relative`, пока не достигнет порогового значения `top/bottom/left/right`.
- Затем «прилипает» в этой позиции в пределах своего **scroll container**.
- Перестаёт прилипать, когда родительский контейнер уходит за пределы экрана.
- Требует, чтобы родитель имел достаточную высоту (иначе некуда «прилипать»).

### Практика и применение

- `relative` — создание containing block для абсолютных потомков (иконки в полях форм, бейджи на карточках).
- `absolute` — дропдауны, тултипы, оверлеи изображений, close-кнопки.
- `fixed` — sticky header, bottom navigation bar, cookie banner.
- `sticky` — таблицы с фиксированной шапкой, sticky-sidebar.

### Важные нюансы и краеугольные камни

- **`transform` на предке «ломает» `position: fixed`** — фиксированные элементы внутри transformed-предка становятся absolute. Это частая проблема в компонентах с анимациями.
- `sticky` не работает, если у предка есть `overflow: hidden` / `overflow: auto` — прокрутка происходит на другом элементе.
- `absolute` без positioned-предка — позиционируется относительно `<html>`, не `<body>`.
- `z-index` работает только на positioned и flex/grid items.
- `inset` — шортхенд для `top + right + bottom + left`: `inset: 0` = все четыре стороны 0.

### Примеры

```css
/* relative — containing block для absolute-дочернего */
.card {
  position: relative;
}
.card__badge {
  position: absolute;
  top: -8px;
  right: -8px;
}

/* absolute — центрирование внутри relative-контейнера */
.overlay {
  position: absolute;
  inset: 0;                  /* top: 0; right: 0; bottom: 0; left: 0 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.5);
}

/* fixed — sticky header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
}

/* sticky — прилипающий заголовок таблицы */
.table th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `position: fixed` перестаёт прилипать к viewport?** — Из-за `transform`/`filter`/`perspective` на предке; создаётся новый containing block.
- **Почему `sticky` не работает?** — Нет прокрутки на нужном уровне: `overflow: hidden` у предка перехватывает прокрутку.
- **Что такое containing block?** — Прямоугольник, относительно которого вычисляются `width`, `height`, `top/left` абсолютно позиционированного элемента.
- **Чем отличается `z-index` на `static` и `relative`?** — На `static` `z-index` не работает; нужен positioned element.

### Красные флаги (чего не говорить)

- «`position: fixed` всегда относительно viewport» — нет при `transform` на предке.
- «`absolute` позиционируется относительно `body`» — относительно ближайшего positioned предка.
- «`z-index` работает на любом элементе» — только на positioned и flex/grid items.

### Связанные темы

- `023-chto-takoe-z-index-kak-formiruetsya-kontekst-nalozheniya.md`
- `024-poryadok-nalozheniya-elementov-stacking-order.md`
- `025-kogda-ispolzovat-translate-vmesto-absolyutnogo-pozitsionirovaniya.md`
