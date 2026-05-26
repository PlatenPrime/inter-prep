# Q056. Расскажите об особенностях стилизации `<svg>`?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

SVG поддерживает два слоя стилизации: SVG-presentation-атрибуты (`fill`, `stroke`) и CSS-свойства. CSS имеет более высокий приоритет над presentation-атрибутами. Inline SVG наследует CSS-переменные и каскад страницы; внешний SVG через `<img>` полностью изолирован от CSS страницы. Для иконочных систем ключевой приём — `currentColor`, который позволяет управлять цветом SVG через CSS `color` родительского элемента.

---

## Развёрнутый ответ

### Суть и определение

Стилизация SVG работает через несколько механизмов с разными приоритетами (от низшего к высшему):

1. SVG presentation-атрибуты (`fill="red"` прямо в теге).
2. Унаследованные CSS-значения.
3. Стили из внешнего CSS-файла или `<style>`.
4. Inline-стили `style="fill: red"`.

### Как это работает

**Presentation-атрибуты vs CSS:**
Presentation-атрибуты (`fill`, `stroke`, `stroke-width`, `opacity`) — это специфические SVG-атрибуты, которые работают как CSS-свойства с нулевой специфичностью. Любой CSS-селектор их переопределит.

**CSS-специфичность в SVG:**
Все стандартные CSS-механизмы работают для inline SVG: классы, ID, псевдоклассы (`:hover`, `:focus`), медиа-запросы, CSS-переменные.

**`currentColor`:**
Специальное ключевое слово CSS, которое принимает значение `color` текущего элемента или ближайшего предка. Это основной приём для создания переиспользуемых SVG-иконок.

**Внешний SVG vs Inline SVG:**
- `<img src="icon.svg">` — SVG рендерится в отдельном browsing context, CSS страницы недоступен.
- `<svg>` inline в HTML — полный доступ к CSS, переменным, псевдоклассам.
- `url()` в CSS background — аналогично `<img>`, без CSS страницы.
- `<use href="sprite.svg#icon">` — через Shadow DOM, частичный доступ к CSS (унаследованные свойства и CSS-переменные проходят).

### Практика и применение

- **Иконочные системы:** Inline SVG с `currentColor` — иконка меняет цвет через `color` родителя.
- **Темизация:** CSS-переменные внутри inline SVG реагируют на смену темы (`prefers-color-scheme`, data-theme).
- **Hover-анимации:** CSS-переменные + `transition` на SVG-элементах без JS.
- **SVG-спрайты** с `<use>` — оптимизация HTTP-запросов, частичная стилизация через унаследованные свойства.
- **Фильтры:** CSS `filter` на SVG-элементе (drop-shadow, blur, grayscale) работает так же, как на любом HTML-элементе.

### Важные нюансы и краеугольные камни

- **Порядок приоритетов:** CSS inline-style > CSS class/id > presentation-атрибут. Многие разработчики забывают, что presentation-атрибут имеет нулевую специфичность.
- **`fill: none` vs `fill: transparent`:** оба дают прозрачный fill, но `fill: none` отключает pointer events на фигуре.
- **`pointer-events`:** SVG поддерживает расширенные значения (`visibleFill`, `visibleStroke`, `all`) для тонкой настройки hit-testing.
- **SMIL-анимации** (`<animate>`, `<animateTransform>`) официально не deprecated (Chrome передумал), но предпочтительнее CSS или JS.
- **CSS-переменные в external SVG через `<img>`:** не работают — SVG изолирован.
- **`stroke-width` в `viewBox`-пространстве:** при масштабировании SVG stroke масштабируется вместе с фигурой; `vector-effect: non-scaling-stroke` фиксирует толщину.

### Примеры

```html
<!-- currentColor: иконка наследует цвет от родителя -->
<button class="btn-primary">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
  Загрузить
</button>

<style>
  .btn-primary { color: white; }
  .btn-primary:hover { color: #e0e7ff; } /* иконка тоже изменит цвет */
</style>
```

```html
<!-- CSS-переменные для темизации SVG -->
<svg viewBox="0 0 100 100" style="--icon-color: #4f46e5; --icon-bg: #e0e7ff;">
  <circle cx="50" cy="50" r="45" fill="var(--icon-bg)" />
  <path d="M30 50 L50 70 L70 30" stroke="var(--icon-color)" stroke-width="5"
        fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

```css
/* :hover на конкретном пути в inline SVG */
.map-region {
  fill: #e0e7ff;
  transition: fill 0.2s ease;
  cursor: pointer;
}
.map-region:hover { fill: #4f46e5; }

/* non-scaling stroke: линия остаётся одной толщины при масштабировании */
.diagram-line {
  stroke: #4f46e5;
  stroke-width: 2px;
  vector-effect: non-scaling-stroke;
}
```

```html
<!-- SVG-спрайт с <use> — CSS-переменные проходят через Shadow DOM -->
<svg style="display:none">
  <symbol id="icon-check" viewBox="0 0 24 24">
    <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2"
          fill="none" stroke-linecap="round"/>
  </symbol>
</svg>

<span style="color: green;">
  <svg width="20" height="20"><use href="#icon-check"/></svg>
</span>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Почему `fill="blue"` в атрибуте не переопределяет `fill: red` из CSS-класса?
- Как заставить иконку в `<img src="icon.svg">` менять цвет при hover? (нельзя через CSS; нужен inline SVG или маскировка через `mask-image`)
- Что такое `currentColor` и в каких ещё CSS-свойствах оно работает? (во всех, включая `border-color`, `box-shadow`)
- Как CSS-переменные проходят через `<use>` в shadow DOM SVG-спрайта?
- Что такое `vector-effect: non-scaling-stroke` и когда нужен?

### Красные флаги (чего не говорить)

- «SVG нельзя стилизовать через CSS» — можно, особенно inline SVG.
- «`fill` в CSS и в атрибуте — одно и то же по приоритету» — нет, CSS переопределяет presentation-атрибуты.
- «Внешний SVG через `<img>` поддерживает CSS-переменные страницы» — нет, он изолирован.

### Связанные темы

- [052-svg-i-canvas.md](./052-svg-i-canvas.md) — что такое SVG и canvas
- [053-raznica-canvas-vs-svg.md](./053-raznica-canvas-vs-svg.md) — сравнение canvas и SVG
