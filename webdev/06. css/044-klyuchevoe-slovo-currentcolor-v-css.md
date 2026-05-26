# Q044. Для чего используется ключевое слово `currentColor` в CSS?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**`currentColor`** — переменная CSS, автоматически принимающая значение свойства `color` текущего элемента (или унаследованное значение). Позволяет применять цвет текста к другим свойствам (border, background, fill SVG) без дублирования значения — изменение одного `color` автоматически обновляет все использования `currentColor`.

---

## Развёрнутый ответ

### Суть и определение

```css
.icon {
  color: blue;
  border: 2px solid currentColor; /* = border: 2px solid blue */
  fill: currentColor;              /* SVG fill = blue */
}
.icon:hover {
  color: red;
  /* border и fill автоматически становятся red */
}
```

`currentColor` — значение-ключевое слово, вычисляемое в computed value `color`. Его можно использовать в любом свойстве, принимающем цвет.

### Как это работает

`currentColor` наследует вычисленное (computed) значение `color` того же элемента. Если `color` не задан явно — берётся унаследованное значение от родителя.

**Где применяется:**
- `border-color: currentColor` (дефолтное значение `border-color`!)
- `background-color: currentColor`
- `fill: currentColor` (SVG)
- `stroke: currentColor` (SVG)
- `outline-color: currentColor`
- `text-decoration-color: currentColor` (дефолт)
- `box-shadow`, `text-shadow`
- Значения градиентов

**Важно:** `border-color` по умолчанию уже = `currentColor`. Это значит, что изменение `color` автоматически меняет цвет рамки, если `border-color` не задан явно.

### Практика и применение

- **SVG-иконки**: `fill: currentColor` на `<svg>` → управление цветом через `color` CSS, иконка наследует цвет текста родителя.
- **Кнопки-призрак** (ghost buttons): `border: 2px solid currentColor` — рамка совпадает с цветом текста.
- **Focus styles**: `outline: 2px solid currentColor; outline-offset: 2px` — outline в цвет текста элемента.
- **Иконочные шрифты**: `color: currentColor` на `:before` с font icon.

```css
/* Компонент с автоматической цветовой синхронизацией */
.badge {
  color: var(--badge-color);
  background: color-mix(in oklch, currentColor 15%, transparent);
  border: 1px solid currentColor;
  border-radius: 999px;
  padding: 2px 8px;
}
```

### Важные нюансы и краеугольные камни

- `currentColor` — вычисляется **в момент применения**, а не при объявлении; это «живое» значение.
- В CSS Custom Properties: `--my-color: currentColor` при объявлении сохранит значение `currentColor` как строку, не вычислит. При использовании в свойстве — вычислится.
- `currentColor` в SVG `fill` обрабатывается браузером, только если SVG инлайновый или через `<use>` — при внешнем SVG через `<img src>` CSS родителя не применяется.
- Цвет иконки через `color` + `currentColor` — паттерн для иконочных компонентов в React/Vue.

### Примеры

```css
/* SVG-иконка, наследующая цвет */
.btn {
  color: white;
  background: blue;
}
.btn svg {
  fill: currentColor; /* fill = white */
  width: 1em;
  height: 1em;
}

/* Ghost button */
.btn--ghost {
  color: var(--color-primary);
  background: transparent;
  border: 2px solid currentColor; /* = var(--color-primary) */
  transition: color 0.2s, background 0.2s;
}
.btn--ghost:hover {
  color: white;
  background: var(--color-primary);
  /* border автоматически становится white */
}

/* Focus outline */
:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

/* Автоматическая background от color */
.alert {
  --color: oklch(0.55 0.2 40); /* оранжевый */
  color: var(--color);
  background: color-mix(in oklch, currentColor 10%, white);
  border-left: 4px solid currentColor;
  padding: 12px 16px;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Какое дефолтное значение `border-color`?** — `currentColor` — именно поэтому `color: red; border: 1px solid` даёт красную рамку.
- **Работает ли `currentColor` в SVG через `<img>`?** — Нет, только в инлайновом SVG и через `<use>` в том же документе.
- **Как использовать `currentColor` в custom properties?** — `--icon-color: currentColor` при использовании в свойстве вычислится; но как сохранённое значение — это строка.

### Красные флаги (чего не говорить)

- «`currentColor` — это custom property» — нет, это CSS-ключевое слово, встроенное в спецификацию.
- «`currentColor` работает в SVG через `<img>`» — нет, только инлайновый SVG.

### Связанные темы

- `043-sposoby-zadaniya-cveta-v-css.md`
- `010-chto-takoe-psevdoelementy-i-dlya-chego-oni-ispolzuyutsya.md`
