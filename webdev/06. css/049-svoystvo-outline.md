# Q049. Расскажите о свойстве `outline`?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**`outline`** — CSS-свойство, рисующее рамку **вокруг элемента снаружи border**, не занимая место в layout (не влияет на box model). Главное применение — индикатор фокуса для клавиатурной навигации и accessibility. В отличие от `border`, outline не изменяет размер/положение соседних элементов.

---

## Развёрнутый ответ

### Суть и определение

```css
outline: <width> <style> <color>;
outline: 2px solid blue;
outline: 3px dashed currentColor;
outline: none; /* убирает outline — опасно для a11y! */
```

**Свойства:**
- `outline-width` — толщина
- `outline-style` — стиль: `solid`, `dashed`, `dotted`, `double` и т.д.
- `outline-color` — цвет (дефолт: `invert` или `currentColor`)
- `outline-offset` — расстояние от border до outline (может быть отрицательным)

### Как это работает

Outline рисуется **поверх** layout, за пределами border-box элемента:
- Не занимает место → не сдвигает соседние элементы.
- Не участвует в box model (margin, padding, border-radius на неё не влияют... точнее, `border-radius` влияет с CSS3).
- `outline-offset` — расстояние между border и outline.

**`border` vs `outline`:**

| Критерий | `border` | `outline` |
|----------|---------|---------|
| Место в layout | Да | Нет |
| Отдельные стороны | Да | Нет (все 4 одновременно) |
| border-radius | Да | Да (CSS3) |
| `outline-offset` | Нет | Да |
| Влияет на размер | Да | Нет |

### Практика и применение

- **Focus indicator** (главное применение): `button:focus-visible { outline: 2px solid blue; outline-offset: 2px }`.
- **Skip navigation**: `a:focus { outline: 3px solid currentColor }`.
- **Debug layout**: `* { outline: 1px solid red }` — быстрый способ увидеть границы всех элементов.
- Нельзя задать отдельно для каждой стороны (в отличие от border) — это всегда 4 стороны одновременно.

### Важные нюансы и краеугольные камни

- `outline: none` / `outline: 0` на `:focus` **без альтернативы** — нарушение WCAG 2.4.7 (Focus Visible). Всегда предоставляйте кастомный фокус-индикатор.
- `outline-offset: -3px` — outline внутри элемента (отрицательное значение).
- С CSS3 `outline` следует `border-radius` элемента — плавные края.
- `outline` рисуется в `overflow: hidden` контейнере — может быть обрезан. `outline` виден за пределами `overflow: visible`.
- Браузеры отображают `outline` по умолчанию при фокусе; `outline: none` убирает эту защиту.

### Примеры

```css
/* Правильная реализация focus-visible */
:focus {
  outline: none; /* убрать дефолтный */
}
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
  border-radius: 4px; /* если нужно скруглить */
}

/* Высококонтрастный режим — не убирать outline */
@media (forced-colors: active) {
  :focus-visible {
    outline: 3px solid ButtonText;
  }
}

/* Debug: отобразить все элементы */
* { outline: 1px solid rgb(255 0 0 / 0.3); }

/* outline внутри элемента */
.card:focus-within {
  outline: 2px solid var(--color-focus);
  outline-offset: -2px; /* внутри border */
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему нельзя просто написать `outline: none`?** — Удаляет визуальный индикатор для клавиатурных пользователей; нарушение WCAG 2.4.7.
- **Чем `:focus` отличается от `:focus-visible`?** — `:focus` срабатывает всегда; `:focus-visible` — только при клавиатурной навигации (браузерная эвристика).
- **Что такое `forced-colors: active`?** — Медиазапрос для Windows High Contrast Mode; нужно обеспечить видимый outline в этом режиме.
- **Почему `outline` не сдвигает соседние элементы?** — Не участвует в box model; рисуется в фазе composite поверх layout.

### Красные флаги (чего не говорить)

- «Outline некрасивый, лучше убрать» — accessibility критична; предоставьте кастомный вариант.
- «`border` и `outline` одинаковы, только outline не занимает место» — `outline` нельзя задать на отдельные стороны.

### Связанные темы

- `016-blochnaya-model-css.md`
- `048-svoystvo-pointer-events.md`
- `050-svoystvo-scrollbar-gutter.md`
