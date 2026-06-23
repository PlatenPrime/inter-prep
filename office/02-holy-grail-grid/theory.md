# 02 — Holy Grail Grid

## Формулировка задачи

> «Соберите классический лейаут: шапка на всю ширину, слева навигация, по центру контент, справа виджеты, внизу футер. На мобильном — только header, main, footer.»

## Теория

**CSS Grid** — двумерный лейаут: строки и колонки одновременно.

- `grid-template-areas` — именованные зоны, читаемая схема лейаута
- `fr` — доля свободного пространства (`1fr 3fr` = 1:3)
- `minmax(min, max)` — гибкие колонки с ограничениями
- `min-height: 100vh` — лейаут на весь экран

**Custom properties** (`--sidebar-width`) — динамическая ширина, меняется классом `.layout--collapsed`.

На мобильном sidebar и aside скрыты (`display: none`), grid упрощён до 3 строк.

## Разбор решения

1. Mobile: `grid-template-areas` только header / main / footer.
2. Desktop (`min-width: 48rem`): 3 колонки — sidebar | main | aside.
3. `var(--sidebar-width)` в `grid-template-columns` — JS меняет только класс, CSS пересчитывает сетку.
4. Семантика: `<nav>`, `<main>`, `<aside>`, `aria-label` на регионах.

## Типичные ошибки

- Путать порядок строк в `grid-template-areas` с визуальным порядком DOM.
- Не задать `min-height: 0` на scrollable grid-ячейках (контент вылезает).
- Использовать float/clearfix вместо Grid в 2026 году.
- Забыть mobile-first — desktop-only лейаут на телефоне нечитаем.

## Вопросы интервьюера

1. Чем Grid отличается от Flexbox? Когда что?
2. Что делает единица `fr`?
3. Как перестроить grid только через media query?
4. Зачем `grid-template-areas` вместо номеров линий?
5. Как сделать sticky sidebar внутри grid?
