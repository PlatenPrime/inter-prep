# Q027. Что такое и как работает CSS Flexbox?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**Flexbox (Flexible Box Layout)** — одномерная система раскладки CSS, оптимизированная для распределения пространства между элементами по одной оси (строка или колонка). Контейнер с `display: flex` становится **flex-контейнером**, его прямые дочерние — **flex-items**. Flexbox решает задачи выравнивания, распределения пространства и порядка элементов без float и хаков.

---

## Развёрнутый ответ

### Суть и определение

**Два актора:**
- **Flex-контейнер** — получает `display: flex | inline-flex`; управляет раскладкой детей.
- **Flex-item** — прямые дочерние элементы контейнера.

**Две оси:**
- **Главная ось (main axis)** — направление `flex-direction` (по умолчанию `row`, слева направо).
- **Поперечная ось (cross axis)** — перпендикулярна главной.

**Свойства контейнера:**

| Свойство | Значения по умолчанию | Описание |
|----------|----------------------|---------|
| `flex-direction` | `row` | Направление главной оси |
| `flex-wrap` | `nowrap` | Перенос на новую строку |
| `justify-content` | `flex-start` | Выравнивание по главной оси |
| `align-items` | `stretch` | Выравнивание по поперечной оси |
| `align-content` | `normal` | Выравнивание строк (при wrap) |
| `gap` | `0` | Расстояние между items |

**Свойства item:**

| Свойство | Дефолт | Описание |
|----------|--------|---------|
| `flex-grow` | `0` | Доля свободного пространства |
| `flex-shrink` | `1` | Коэффициент сжатия |
| `flex-basis` | `auto` | Базовый размер по главной оси |
| `align-self` | `auto` | Индивидуальное выравнивание |
| `order` | `0` | Порядок отображения |

### Как это работает

1. Flex-контейнер вычисляет **гипотетический размер** каждого item по `flex-basis`.
2. Если суммарный размер > контейнера → применяется `flex-shrink`.
3. Если суммарный размер < контейнера → свободное пространство распределяется через `flex-grow`.
4. Items выравниваются по осям через `justify-content` и `align-items`.

**Шортхенд `flex`:** `flex: grow shrink basis`
- `flex: 1` → `flex: 1 1 0` — item растёт и сжимается, базовый размер 0.
- `flex: auto` → `flex: 1 1 auto` — базовый размер по содержимому.
- `flex: none` → `flex: 0 0 auto` — фиксированный размер.

### Практика и применение

- Горизонтальная навигация с равными кнопками: `display: flex; justify-content: space-between`.
- Карточки в ряд с переносом: `display: flex; flex-wrap: wrap; gap: 16px`.
- Центрирование по вертикали и горизонтали: `display: flex; align-items: center; justify-content: center`.
- Holy Grail Layout: `main { flex: 1 }` для растяжения основного контента.
- `margin-left: auto` на flex-item — прижать элемент к правому краю.

### Важные нюансы и краеугольные камни

- `flex: 1` ≠ `flex: 1 1 auto`: `flex-basis: 0` vs `auto` кардинально влияет на расчёт размеров при малом содержимом.
- `align-items: stretch` по умолчанию растягивает items по поперечной оси — колонки одинаковой высоты «бесплатно».
- `gap` во Flexbox не применяется к краям контейнера — только между items.
- Flex-items блокифицируются: `display: inline` внутри flex игнорируется.
- `order` меняет визуальный порядок, но не DOM — accessibility (screen readers) читает по DOM.
- `flex-wrap: wrap` + `align-content` управляет выравниванием строк; `align-items` — выравниванием items в строке.

### Примеры

```css
/* Навигация */
.nav {
  display: flex;
  align-items: center;
  gap: 8px;
}
.nav__logo { margin-right: auto; } /* прижимает остальное вправо */

/* Карточки */
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.card {
  flex: 1 1 300px; /* минимум 300px, растёт заполняя строку */
}

/* Центрирование */
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100svh;
}

/* Holy Grail */
.layout {
  display: flex;
  min-height: 100svh;
  flex-direction: column;
}
.layout__header,
.layout__footer { flex: none; }
.layout__main   { flex: 1; }
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `flex: 1` отличается от `flex: 1 1 auto`?** — `flex-basis: 0` vs `auto`: при 0 размер вычисляется только из пространства; при `auto` — из содержимого.
- **Как прижать один элемент вправо в flex-навигации?** — `margin-left: auto` на этом элементе.
- **Работает ли margin collapse во Flexbox?** — Нет, между flex-items схлопывание не происходит.
- **Что делает `align-content`?** — Выравнивает строки в многострочном flex-контейнере (при `flex-wrap: wrap`).

### Красные флаги (чего не говорить)

- «Flexbox для 2D layout» — Flexbox одномерный; для 2D — Grid.
- «`gap` добавляет отступы по краям» — нет, только между items.
- «`order` меняет DOM-порядок» — только визуальный; a11y читает исходный DOM.

### Связанные темы

- `028-rasskazhite-o-svoystvo-flex-v-kontekste-flexbox.md`
- `029-osobennosti-plyusy-flexbox.md`
- `030-raznica-mezhdu-flexbox-i-css-grid.md`
