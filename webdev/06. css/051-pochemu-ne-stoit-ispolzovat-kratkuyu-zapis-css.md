# Q051. Почему не стоит использовать краткую запись свойств CSS?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**Краткая запись (shorthand)** — удобна, но опасна: она **неявно сбрасывает** все неуказанные компоненты к их начальным значениям. `background: red` сбрасывает `background-image`, `background-position`, `background-size` и т.д. Это ломает наследование, осложняет отладку и создаёт конфликты с другими правилами.

---

## Развёрнутый ответ

### Суть и определение

CSS-шортхенды (`background`, `font`, `border`, `margin`, `padding`, `transition`, `animation`, `flex`, `grid` и другие) устанавливают значения всех своих лонгхенд-компонентов одновременно. Если компонент не указан — он сбрасывается к `initial`.

```css
/* Шортхенд сбрасывает ВСЕ компоненты */
.element {
  background-color: red;     /* был задан */
  background-image: url(...); /* был задан */
}
.element {
  background: blue;
  /* background-image → initial (none) — неявно сброшен! */
}
```

### Как это работает

**Опасные шортхенды:**

| Шортхенд | Неявно сбрасывает |
|---------|-----------------|
| `background: red` | `background-image`, `background-position`, `background-size`, `background-repeat`, `background-origin`, `background-clip`, `background-attachment` |
| `font: 16px sans-serif` | `font-style`, `font-variant`, `font-weight`, `line-height`, `font-size-adjust` |
| `border: 1px solid red` | `border-color`, `border-style`, `border-width` для всех 4 сторон + `border-image` |
| `transition: all 0.3s` | Устанавливает `transition-property: all` — анимирует всё |
| `flex: 1` | `flex-shrink: 1`, `flex-basis: 0` — неочевидные дефолты |
| `grid-template` | Сбрасывает implicit grid tracks |

### Практика и применение

**Когда использовать шортхенды безопасно:**
- При первичном задании всех компонентов разом: `margin: 16px 24px`.
- В сбросах: `margin: 0; padding: 0`.
- Когда знаете точно, что нужно сбросить все компоненты.

**Когда использовать лонгхенды:**
- При переопределении части свойств: вместо `background: blue` → `background-color: blue`.
- В cascading-переопределениях в медиазапросах.
- При работе с анимациями/transition — явно указывать только нужные свойства.

### Важные нюансы и краеугольные камни

- `transition: all 0.3s` — анимирует **все** изменившиеся свойства, включая нежелательные (например, `height` при hover меняет layout).
- `font` шортхенд сбрасывает `line-height` к `normal` — частая потеря кастомного line-height.
- `border: none` сбрасывает `border-image` — если было задано `border-image`, оно исчезнет.
- В CSS Logical Properties лонгхенды: `margin-block-start`, `margin-inline-end` — безопасная альтернатива.
- CSS Custom Properties + calc() — альтернатива шортхендам для сложных значений.

### Примеры

```css
/* Плохо: шортхенд сбрасывает предыдущие настройки */
.card {
  background-image: url('pattern.svg');
  background-repeat: repeat;
}
.card--highlight {
  background: yellow; /* убивает background-image! */
}

/* Хорошо: лонгхенд */
.card--highlight {
  background-color: yellow; /* background-image сохраняется */
}

/* Плохо: transition: all */
.btn {
  transition: all 0.3s ease; /* анимирует width, height, color, background... */
}

/* Хорошо: явные свойства */
.btn {
  transition: background-color 0.2s ease, transform 0.15s ease-out;
}

/* Плохо: font сбрасывает line-height */
body {
  line-height: 1.6; /* задано */
}
.title {
  font: bold 2rem sans-serif; /* line-height → normal (≈1.2) */
}

/* Хорошо */
.title {
  font-size: 2rem;
  font-weight: bold;
  font-family: sans-serif;
  /* line-height: 1.6 — сохраняется от body */
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Какой шортхенд чаще всего создаёт неожиданные сбросы?** — `background`, `font`, `border` — они включают много лонгхендов.
- **Почему `transition: all` — антипаттерн?** — Анимирует все изменившиеся свойства; может случайно анимировать `width`, `height` → Reflow на каждый кадр.
- **Как CSS Custom Properties помогают избежать проблем шортхендов?** — `--button-bg: blue; background-color: var(--button-bg)` — явно одно свойство.

### Красные флаги (чего не говорить)

- «Шортхенды всегда плохо» — удобны при полном задании всех компонентов; проблема только при частичном переопределении.
- «`transition: all` — наиболее удобно» — антипаттерн производительности.

### Связанные темы

- `004-kak-rabotayut-kaskadnost-i-nasledovanie-v-css.md`
- `039-kak-rabotayut-transition-i-animation-otlichiya.md`
