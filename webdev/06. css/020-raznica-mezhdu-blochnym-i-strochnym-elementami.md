# Q020. Разница между блочным и строчным (инлайновым) элементами?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**Блочные элементы** (`display: block`) занимают всю доступную ширину и начинаются с новой строки — `<div>`, `<p>`, `<h1>`. **Инлайновые** (`display: inline`) занимают только столько места, сколько нужно содержимому, и не разрывают поток текста — `<span>`, `<a>`, `<strong>`. Ключевая разница: у инлайновых `width`/`height` и вертикальные `margin`/`padding` не влияют на layout соседей.

---

## Развёрнутый ответ

### Суть и определение

| Критерий | Block | Inline | Inline-block |
|----------|-------|--------|-------------|
| Ширина | 100% родителя | По содержимому | По содержимому |
| Высота | По содержимому | По строке | По содержимому |
| Новая строка | Да | Нет | Нет |
| `width`/`height` | Работают | Не работают | Работают |
| Вертикальные margin | Работают | Не влияют на соседей | Работают |
| `margin: auto` | Центрирует | Не работает | Не работает |
| Примеры | `div`, `p`, `h1`–`h6`, `ul`, `section` | `span`, `a`, `strong`, `em`, `img` | `button`, `input` |

### Как это работает

**Block (BFC — Block Formatting Context):**
- Занимает всю строку, следующий элемент начинается с новой строки.
- Можно задать `width`, `height`, `margin`, `padding` — все влияют на layout.
- Margin-collapse применяется между соседними блочными элементами.

**Inline:**
- Располагается в потоке текста, перенос — по словам/символам.
- `width`/`height` игнорируются.
- Вертикальный `margin` игнорируется (не влияет на соседей по вертикали).
- Вертикальный `padding` визуально отображается, но **не раздвигает** соседние строки.
- Выравнивается по baseline текста (`vertical-align`).

**Inline-block:**
- Ведёт себя как inline в потоке (не начинает новую строку).
- Внутри — как block: работают `width`/`height`, полный margin/padding.
- Основной кейс: кнопки, иконки в тексте.

### Практика и применение

- `<a>` по умолчанию inline — нельзя задать `width`; изменить на `display: inline-block` или `block` при необходимости.
- `<img>` технически inline-replaced — имеет intrinsic size, но подчиняется inline-правилам (baseline gap).
- `<button>`, `<input>` — `inline-block` по умолчанию.
- В Flexbox и Grid дочерние элементы становятся **flex/grid items** независимо от исходного `display`.

### Важные нюансы и краеугольные камни

- Пробелы между inline/inline-block элементами в HTML — пробелы в тексте создают визуальные зазоры (решается `font-size: 0` на родителе или Flexbox).
- `<img>` по умолчанию inline → «белая полоска» снизу (baseline). Решение: `display: block` или `vertical-align: top`.
- Inline-элементы в Flexbox/Grid превращаются в block-level участники (flex-items).
- CSS `display: contents` — элемент сам исчезает, его дочерние участвуют в layout родителя.

### Примеры

```css
/* Превратить ссылку в кнопку */
.btn {
  display: inline-block;  /* или block */
  padding: 10px 20px;
  background: blue;
  color: white;
  text-decoration: none;
}

/* Устранить baseline gap у img */
img {
  display: block;  /* убирает inline-baseline whitespace */
}

/* Inline-элемент с padding — не раздвигает строки */
.highlight {
  display: inline;
  padding: 2px 6px;
  background: yellow;
  /* padding визуально есть, но строки не раздвигаются */
}

/* Решение пробелов между inline-block без Flexbox */
.nav {
  font-size: 0;  /* убирает whitespace между li */
}
.nav__item {
  display: inline-block;
  font-size: 16px;  /* восстанавливаем */
}
```

---

## Сравнение

| Критерий | Block | Inline | Inline-block |
|----------|-------|--------|-------------|
| Новая строка | Да | Нет | Нет |
| width/height | Да | Нет | Да |
| Вертикальный margin | Да | Нет | Да |
| Горизонтальный margin | Да | Да | Да |
| В тексте | Нет | Да | Да |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему у `<img>` пробел снизу?** — Inline-baseline alignment; `display: block` или `vertical-align: bottom` решает.
- **Как работает `display: inline-block`?** — Inline снаружи (не разрывает поток), block внутри (полный box model).
- **Что происходит с `display` дочерних элементов в Flexbox?** — Они становятся flex-items (blockified) независимо от исходного `display`.
- **Что такое `display: contents`?** — Элемент «исчезает» из layout, его дочерние участвуют в layout родителя напрямую.

### Красные флаги (чего не говорить)

- «`margin: auto` центрирует любой элемент» — только блочные с явной шириной или flex/grid items.
- «`padding` у inline влияет на высоту строки» — вертикальный padding inline визуален, но не раздвигает строки.

### Связанные темы

- `016-blochnaya-model-css.md`
- `021-rasskazhite-pro-svoystvo-display-v-css.md`
- `019-raznica-display-none-i-visibility-hidden.md`
