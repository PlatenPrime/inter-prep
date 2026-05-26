# Q021. Расскажите про свойство `display` в CSS?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**`display`** — одно из ключевых CSS-свойств, управляющее двумя вещами одновременно: **внешним** типом отображения элемента (как он взаимодействует с соседями в потоке) и **внутренним** (как располагаются его дочерние элементы). Значения делятся на legacy-однокомпонентные (`block`, `inline`, `flex`) и современные двухкомпонентные (`block flow`, `inline flex`).

---

## Развёрнутый ответ

### Суть и определение

**Двухкомпонентная модель (CSS Display Level 3):**

```
display: <outer> <inner>
         block   flow
         inline  flex
         ...     grid
```

| Значение | Внешнее | Внутреннее | Описание |
|----------|---------|-----------|---------|
| `block` | block | flow | Блочный элемент, BFC внутри |
| `inline` | inline | flow | Инлайновый, IFC внутри |
| `inline-block` | inline | flow-root | Inline снаружи, BFC внутри |
| `flex` | block | flex | Flex-контейнер |
| `inline-flex` | inline | flex | Inline flex-контейнер |
| `grid` | block | grid | Grid-контейнер |
| `inline-grid` | inline | grid | Inline grid-контейнер |
| `flow-root` | block | flow-root | Создаёт BFC явно |
| `contents` | — | — | Элемент исчезает, дети участвуют в layout родителя |
| `none` | — | — | Элемент полностью убран из Render Tree |
| `table` / `table-cell` / etc. | table | table | Таблично-подобный layout |
| `list-item` | block | flow | Блок с маркером |

### Как это работает

При `display: flex`:
- Сам элемент ведёт себя как **block** (занимает строку).
- Его прямые дочерние превращаются в **flex-items** (blockified).

При `display: inline-flex`:
- Сам элемент — **inline** (в потоке текста).
- Дочерние — flex-items.

`display: contents` — «виртуальная обёртка»: сам элемент не рендерится, его дочерние элементы участвуют в layout родителя напрямую. Осторожно с accessibility — некоторые браузеры удаляют элемент из accessibility tree.

`display: flow-root` — создаёт BFC без побочных эффектов `overflow: hidden`. Чистый способ «сдержать» флоаты и отменить схлопывание margin.

### Практика и применение

- `display: flex` — основной инструмент для 1D layout (строки/колонки навигации, карточки в ряд).
- `display: grid` — для 2D layout (сетки, complex page layout).
- `display: flow-root` — изолировать BFC (clearfix, предотвращение margin collapse).
- `display: contents` — обёртки для accessibility/семантики без влияния на layout.
- `display: none` — условное скрытие; анимировать нельзя напрямую.

### Важные нюансы и краеугольные камни

- Flex/Grid-контейнеры **блокифицируют** прямых потомков: `display: inline` дочернего игнорируется внутри flex.
- `display: none` убирает элемент из accessibility tree — отличается от `visibility: hidden` и `aria-hidden`.
- `display: contents` имеет a11y-баг в некоторых браузерах — скрывает элемент из accessibility tree (проблема кнопок и ссылок).
- Нельзя анимировать изменение `display` плавно (дискретное значение) — только через `@starting-style` (Chrome 117+) или через комбинацию `visibility` + `opacity`.
- `table-cell` используется для вертикального центрирования (legacy) и эмуляции ячеек таблицы.

### Примеры

```css
/* Flex-контейнер для навигации */
.nav {
  display: flex;
  gap: 16px;
  align-items: center;
}

/* Inline-flex для inline-кнопки в тексте */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--color-primary);
}

/* flow-root как чистый BFC */
.clearfix {
  display: flow-root; /* заменяет :after clearfix и overflow: hidden */
}

/* contents — убрать обёртку без изменения layout */
.wrapper {
  display: contents; /* дочерние участвуют в grid родителя */
}

/* Двухкомпонентный синтаксис (CSS Display L3) */
.element {
  display: block flex; /* = display: flex */
  display: inline flex; /* = display: inline-flex */
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что происходит с inline-дочерними во Flexbox?** — Блокифицируются: ведут себя как block независимо от исходного `display`.
- **Чем `display: flow-root` отличается от `overflow: hidden`?** — `flow-root` создаёт BFC без скрытия переполнения и без побочных эффектов с `z-index`.
- **Что такое `display: contents` и какая у него проблема?** — Убирает box элемента из layout; a11y-баг: в ряде браузеров кнопки/ссылки с `display: contents` теряются в accessibility tree.
- **Можно ли анимировать `display: none` → `display: block`?** — Нет напрямую; нужна комбинация с `visibility`/`opacity` или `@starting-style`.

### Красные флаги (чего не говорить)

- «`display: flex` делает все дочерние флексовыми» — только прямые дочерние, не все потомки.
- «`display: none` и `visibility: hidden` одинаковы» — принципиально разный эффект на layout и accessibility.

### Связанные темы

- `019-raznica-display-none-i-visibility-hidden.md`
- `020-raznica-mezhdu-blochnym-i-strochnym-elementami.md`
- `027-chto-takoe-i-kak-rabotaet-css-flexbox.md`
