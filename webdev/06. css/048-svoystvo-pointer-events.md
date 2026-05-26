# Q048. Расскажите о свойстве `pointer-events`?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**`pointer-events`** управляет тем, реагирует ли элемент на события указателя (мышь, тач, стилус): клики, hover, cursor. Значение `none` полностью отключает все pointer-события — элемент становится «прозрачным» для мыши, события проходят к элементам ниже. Часто используется для оверлеев, disabled-состояний и пропуска событий через декоративные слои.

---

## Развёрнутый ответ

### Суть и определение

| Значение | Поведение |
|---------|----------|
| `auto` | Обычное поведение (дефолт) |
| `none` | Элемент не получает pointer-события; события проходят насквозь |
| SVG-значения | `visiblePainted`, `visibleFill`, `visibleStroke`, `fill`, `stroke`, `all` — для SVG |

### Как это работает

`pointer-events: none`:
- Элемент не получает: `click`, `mouseenter`, `mouseleave`, `hover`, cursor-изменения.
- События «прозрачно» проходят к элементам ниже в z-стеке.
- Элемент **остаётся видимым** и занимает место в layout.
- Работает на CSS `:hover` псевдоклассе — hover не срабатывает на элементе.

**Не влияет на:**
- Клавиатурные события (`keydown`, `focus`)
- Программный `.click()` через JavaScript
- `focus` через Tab (если элемент фокусируемый)

### Практика и применение

- **Оверлей-загрузчик**: `pointer-events: none` на полупрозрачном overlay позволяет кликать на контент под ним.
- **Disabled UI без `disabled` атрибута**: `pointer-events: none` + `opacity: 0.5` — визуально отключить форму.
- **Псевдоэлементы поверх кнопок**: `::before`/`::after` с `pointer-events: none` не перехватывают клики.
- **Анимированные декоративные элементы**: фоновые частицы, которые не должны мешать взаимодействию.
- **SVG**: управлять, какая часть SVG кликабельна (fill vs stroke).

### Важные нюансы и краеугольные камни

- `pointer-events: none` **не отключает** фокус через Tab — использовать `tabindex="-1"` для этого.
- `pointer-events: none` **не скрывает** курсор — `cursor: not-allowed` используется отдельно.
- Дочерний элемент может переопределить `pointer-events: auto`, даже если родитель имеет `none`.
- **Accessibility**: отключение pointer-events не делает элемент недоступным для assistive technology — нужен `aria-disabled="true"` и `tabindex="-1"`.
- `pointer-events` не влияет на touch events в некоторых браузерах — `touch-action: none` нужен для тач-событий.

### Примеры

```css
/* Disabled форма */
.form--loading {
  pointer-events: none;
  opacity: 0.6;
}

/* Псевдоэлемент поверх кнопки без перехвата кликов */
.btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, white 0%, transparent 70%);
  opacity: 0;
  pointer-events: none;  /* клики проходят к .btn */
  transition: opacity 0.3s;
}
.btn:hover::before {
  opacity: 0.3;
}

/* Overlay, не мешающий кликам */
.overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 0.3);
  pointer-events: none; /* можно кликать на контент */
}

/* SVG: кликабелен только fill */
.svg-icon {
  pointer-events: fill;  /* только заполненная область */
}

/* Дочерний элемент возвращает события */
.disabled-area {
  pointer-events: none;
}
.disabled-area .clickable {
  pointer-events: auto; /* этот элемент всё ещё кликабелен */
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как `pointer-events: none` влияет на дочерние элементы?** — Они тоже не получают события, если только не переопределили `pointer-events: auto`.
- **Как полностью отключить кнопку (включая Tab)?** — `pointer-events: none` + `tabindex="-1"` + `aria-disabled="true"` + отключить обработчики.
- **Работает ли `cursor: pointer` при `pointer-events: none`?** — Нет, курсор тоже не меняется.
- **Чем `pointer-events: none` отличается от `disabled`?** — `disabled` — HTML-атрибут, нативно отключает и cursor, и focus, и события, убирает из tab order; `pointer-events: none` — только CSS, только указатель.

### Красные флаги (чего не говорить)

- «`pointer-events: none` скрывает элемент» — нет, только отключает события.
- «`pointer-events: none` аналогично `disabled`» — `disabled` также убирает из tab order и accessibility tree.

### Связанные темы

- `019-raznica-display-none-i-visibility-hidden.md`
- `049-svoystvo-outline.md`
