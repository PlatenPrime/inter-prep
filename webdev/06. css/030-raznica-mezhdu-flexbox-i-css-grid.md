# Q030. Разница между Flexbox и CSS Grid?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**Flexbox** — одномерная раскладка: элементы выстраиваются в строку **или** колонку, пространство распределяется по одной оси. **CSS Grid** — двумерная: явные строки **и** колонки одновременно, элементы можно точно позиционировать по обеим осям. Правило выбора: компонент, управляемый содержимым → Flexbox; layout страницы или сложная сетка → Grid.

---

## Развёрнутый ответ

### Суть и определение

| Критерий | Flexbox | CSS Grid |
|----------|---------|----------|
| Размерность | 1D (ось или строка/колонка) | 2D (строки И колонки) |
| Управление | Content-first (item управляет размером) | Layout-first (контейнер управляет) |
| Выравнивание | По одной оси + cross-axis | По обеим осям явно |
| Gap | `gap` (row-gap, column-gap) | `gap` (row-gap, column-gap) |
| Наложение | Через `order` | Через grid-area (явное наложение) |
| Поддержка браузеров | IE 11 (частичная) | IE 11 (старый синтаксис) |

### Как это работает

**Flexbox — content-driven:**
Размер items определяется содержимым и алгоритмом grow/shrink. Вторая ось (cross-axis) выравнивается, но не управляется явными треками.

**Grid — layout-driven:**
Контейнер задаёт явные треки (строки + колонки), items помещаются в ячейки. Items могут занимать несколько ячеек через `grid-column: span 2`.

```css
/* Grid: явная двумерная сетка */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 16px;
}

/* Item занимает всю первую строку */
.header {
  grid-column: 1 / -1;
}
```

### Когда что выбирать

**Flexbox:**
- Навигационная строка (`<nav>`)
- Список тегов/chips с переносом
- Форм-ряды (label + input)
- Центрирование содержимого
- Компоненты, где items управляют шириной

**CSS Grid:**
- Page layout (header, sidebar, main, footer)
- Card grid с выравниванием по строкам И колонкам
- Сложные формы с несколькими колонками
- Элементы с явным позиционированием (занять 2 колонки)
- Когда важен alignment по обеим осям

**Оба вместе:**
Page layout на Grid → внутри секций Flexbox-компоненты.

### Важные нюансы и краеугольные камни

- `auto-fill` vs `auto-fit` в Grid: `auto-fill` создаёт пустые треки, `auto-fit` коллапсирует их.
- Flexbox не может выравнивать элементы по двум осям одновременно без трюков.
- Grid items по умолчанию растягиваются на всю ячейку (align-items: stretch).
- Subgrid (CSS Grid Level 2) — позволяет вложенному grid использовать треки родительского grid.
- В Grid наложение элементов (`grid-area: 1 / 1 / 2 / 3` на двух элементах) — нативная возможность.

### Примеры

```css
/* Page Layout — Grid */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 280px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100svh;
}
.page__header  { grid-area: header; }
.page__sidebar { grid-area: sidebar; }
.page__main    { grid-area: main; }
.page__footer  { grid-area: footer; }

/* Компонент внутри — Flexbox */
.page__header {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Responsive card grid — Grid */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

/* То же через Flexbox — менее точный контроль строк */
.cards-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.cards-flex > * { flex: 1 1 280px; }
```

---

## Сравнение

| Критерий | Flexbox | CSS Grid |
|----------|---------|----------|
| Оси | 1 | 2 |
| Управление размером | Items | Контейнер (треки) |
| Явное позиционирование | Нет | Да |
| Сложный page layout | Сложно | Легко |
| Компонент-ориентированный layout | Легко | Избыточно |
| Наложение elements | `order` | `grid-area` |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Можно ли сделать Grid на Flexbox?** — Имитация возможна, но без alignment по двум осям — карточки в разных строках не выровнены по вертикали.
- **Что такое `subgrid`?** — Вложенный grid, использующий треки родительского; CSS Grid Level 2, Chrome 117+, Firefox 71+, Safari 16+.
- **Чем `auto-fit` отличается от `auto-fill`?** — `auto-fill` создаёт пустые треки; `auto-fit` коллапсирует их — полезно когда items должны занять всю ширину.
- **Когда стоит использовать оба?** — Grid для macro-layout страницы, Flexbox для micro-layout компонентов.

### Красные флаги (чего не говорить)

- «Grid заменяет Flexbox» — они дополняют друг друга для разных задач.
- «Flexbox медленнее Grid» — производительность сопоставима; выбор по задаче, не по скорости.

### Связанные темы

- `027-chto-takoe-i-kak-rabotaet-css-flexbox.md`
- `031-kakoe-css-svoystvo-menyaet-poryadok-otobrazheniya-elementov.md`
