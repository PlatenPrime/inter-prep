# Q032. Что такое CSS containment? Как использовать свойство `contain`?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**CSS Containment** — механизм изоляции элемента от остального документа, позволяющий браузеру пропускать ненужные вычисления за пределами containment-контейнера. Свойство **`contain`** принимает значения `layout`, `style`, `paint`, `size` и их комбинации. Используется для оптимизации рендеринга сложных компонентов.

---

## Развёрнутый ответ

### Суть и определение

**Значения `contain`:**

| Значение | Что изолирует |
|---------|--------------|
| `layout` | Layout изменения внутри не влияют на внешний layout |
| `style` | Счётчики и кавычки не утекают наружу |
| `paint` | Содержимое не рисуется за пределами border-box; создаёт stacking context |
| `size` | Размер элемента не зависит от содержимого (нужно явно задать size) |
| `inline-size` | Только inline-размер изолирован от содержимого |
| `strict` | = `size layout style paint` |
| `content` | = `layout style paint` |
| `none` | Нет изоляции |

**`content-visibility`** — более высокоуровневое свойство:
- `content-visibility: auto` — браузер автоматически пропускает рендеринг off-screen элементов.
- `content-visibility: hidden` — всегда пропускает рендеринг (как `display: none`, но сохраняет место).

### Как это работает

Без containment: изменение одного элемента может потребовать пересчёта layout всего документа (глобальный Reflow).

С `contain: layout`:
- Браузер знает, что layout внутри контейнера не влияет на внешний layout.
- Reflow ограничивается контейнером.

С `contain: paint`:
- Создаётся новый stacking context.
- Содержимое не рисуется за пределами border-box (overflow clip).
- Браузер может пропустить отрисовку off-screen painted-контейнеров.

`content-visibility: auto` — самый мощный инструмент: браузер автоматически пропускает рендеринг (`layout + paint + style`) невидимых (off-screen) секций страницы. Требует `contain-intrinsic-size` для резервирования пространства во время прокрутки.

### Практика и применение

- **Виртуализированные списки** — `content-visibility: auto` на строках без JS-виртуализатора.
- **Widget isolation** — `contain: layout paint` на независимых виджетах дашборда.
- **Контейнерные запросы** — `container-type: inline-size` неявно применяет `contain: inline-size layout style` (CSS Containment используется под капотом).
- **Оптимизация длинных страниц** — `content-visibility: auto` + `contain-intrinsic-size` на секциях below-the-fold.

### Важные нюансы и краеугольные камни

- `contain: size` требует явного задания ширины/высоты — иначе элемент сожмётся до 0.
- `contain: paint` создаёт stacking context и containing block для абсолютных потомков.
- `content-visibility: auto` может вызвать «прыжки» при прокрутке, если `contain-intrinsic-size` задан неверно.
- `contain: strict` = `size + layout + style + paint` — максимальная изоляция, но нужен явный size.
- `container-type` (container queries) внутренне использует containment — не нужно дублировать `contain`.

### Примеры

```css
/* Изолированный виджет */
.widget {
  contain: layout paint;
  /* Reflow внутри .widget не влияет на соседей */
}

/* Длинная страница — пропуск рендеринга off-screen секций */
.section {
  content-visibility: auto;
  contain-intrinsic-size: 0 400px; /* резервируем ~400px высоты */
}

/* Container queries (contain неявно) */
.card-container {
  container-type: inline-size;
  /* Неявно: contain: inline-size layout style */
}
@container (min-width: 400px) {
  .card { flex-direction: row; }
}

/* contain: size — виджет с фиксированным размером */
.fixed-widget {
  contain: strict;
  width: 300px;
  height: 200px;
  overflow: auto;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Зачем `contain-intrinsic-size`?** — `content-visibility: auto` скрывает размер скрытых элементов; браузер не знает их размер → неправильный скроллбар. `contain-intrinsic-size` задаёт предполагаемый размер для расчёта scroll height.
- **Как `contain` связан с container queries?** — `container-type: inline-size` неявно добавляет `contain: inline-size layout style`.
- **Какая разница `content-visibility: hidden` и `display: none`?** — `display: none` убирает из layout и accessibility tree; `content-visibility: hidden` пропускает рендеринг, но сохраняет место в layout.

### Красные флаги (чего не говорить)

- «`contain` — то же самое, что `overflow: hidden`» — разные механизмы; `contain` про изоляцию вычислений, `overflow` — про отсечение содержимого.
- «`contain: size` работает без явных размеров» — нет, схлопнется до 0.

### Связанные темы

- `034-container-queries-vs-media-queries.md`
- `035-chto-takoe-css-container-queries-kak-oni-rabotayut.md`
- `023-chto-takoe-z-index-kak-formiruetsya-kontekst-nalozheniya.md`
