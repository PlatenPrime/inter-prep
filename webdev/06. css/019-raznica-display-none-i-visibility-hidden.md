# Q019. Разница между `display: none` и `visibility: hidden`?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

`display: none` **полностью удаляет** элемент из потока документа: он не занимает место, недоступен для AT (screen readers по умолчанию) и не получает события. `visibility: hidden` **скрывает** элемент визуально, но сохраняет его место в layout — элемент продолжает занимать пространство, как будто прозрачный. Третий вариант — `opacity: 0` — тоже скрывает визуально, но сохраняет место и доступность событий.

---

## Развёрнутый ответ

### Суть и определение

| Свойство | Место в layout | Видимость | События | Accessibility |
|----------|---------------|-----------|---------|---------------|
| `display: none` | Нет | Нет | Нет | Скрыт от AT |
| `visibility: hidden` | Да | Нет | Нет | Скрыт от AT |
| `opacity: 0` | Да | Нет | **Да** | Виден AT |
| `clip-path: inset(100%)` | Да | Нет | Нет | Виден AT |
| `transform: scale(0)` | Да | Нет | Нет | Виден AT |

### Как это работает

**`display: none`:**
- Элемент исключается из Render Tree полностью.
- Не вызывает layout (Reflow) для себя и своих потомков.
- Transition/animation на `display` не работает (изменение дискретное) — но CSS `@starting-style` + `transition` в CSS 2024 решает это.
- `display: none` не наследуется напрямую, но потомки не рендерятся.

**`visibility: hidden`:**
- Элемент остаётся в Render Tree, занимает место в layout.
- Свойство **наследуется**: `visibility: hidden` на родителе → все потомки тоже hidden.
- Потомок может переопределить: `visibility: visible` — и будет виден, несмотря на скрытого родителя.
- Transition/animation работает нормально.

**`opacity: 0`:**
- Элемент полностью прозрачен, но занимает место.
- Остаётся доступным для событий (клики, hover работают!).
- Screen readers **читают** содержимое (зависит от AT, но по умолчанию виден).
- Анимируется плавно.

### Практика и применение

- `display: none` — для условного рендеринга (tabs, accordion), скрытия мобильного меню.
- `visibility: hidden` — для скрытия с сохранением layout (tooltip placeholder, skeleton-анимация, fade-in сохраняя место).
- `opacity: 0` — для анимации появления/исчезновения (fade): `opacity: 0` → `opacity: 1`.
- Для **accessibly hidden** (скрыть визуально, но оставить для AT): класс `.sr-only` с `clip`, `clip-path`, `position: absolute`, `width: 1px; height: 1px`.

### Важные нюансы и краеугольные камни

- `display: none` вызывает **Reflow** при изменении (удаление из потока пересчитывает layout).
- Анимировать `display: none` ↔ `block` нельзя напрямую; нужно `visibility` + `opacity` вместе.
- `pointer-events: none` + `opacity: 0` — скрыть и убрать события без влияния на layout.
- `content-visibility: hidden` (CSS Containment) — мощный инструмент для off-screen контента: скрывает и пропускает рендеринг.
- `aria-hidden="true"` — скрывает от AT независимо от CSS (и даже если `display: block`).

### Примеры

```css
/* display: none — полностью убрать */
.modal { display: none; }
.modal.is-open { display: flex; }

/* visibility + opacity — анимируемое скрытие */
.tooltip {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;
}
.tooltip.is-visible {
  visibility: visible;
  opacity: 1;
}

/* Accessibly hidden — скрыть визуально, но оставить для screen reader */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* CSS Containment — пропустить рендер off-screen */
.off-screen-panel {
  content-visibility: hidden;
  contain-intrinsic-size: 0 500px; /* резервируем место */
}
```

---

## Сравнение

| Критерий | `display: none` | `visibility: hidden` | `opacity: 0` |
|----------|----------------|---------------------|-------------|
| Место в layout | Нет | Да | Да |
| События | Нет | Нет | Да |
| Анимация | Нет | Да | Да |
| Reflow при изменении | Да | Нет | Нет |
| AT (screen reader) | Скрыт | Скрыт | Виден |
| Наследование | Нет (удалён) | Да (потомки hidden) | Нет (компоновка) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как анимировать появление блока через `display: none`?** — Комбинация `visibility` + `opacity` с `transition`; или CSS `@starting-style` + `display: none` с `transition` (Chrome 117+).
- **Как скрыть элемент от screen reader?** — `aria-hidden="true"` независимо от CSS; `display: none` тоже скрывает.
- **Как скрыть визуально, но оставить для AT?** — Класс `.sr-only` (utility из Bootstrap/Tailwind).
- **Почему клики работают на `opacity: 0`?** — opacity не влияет на hit testing; элемент в Render Tree и в event dispatch chain.

### Красные флаги (чего не говорить)

- «`visibility: hidden` удаляет элемент из DOM» — нет, он остаётся в DOM и layout.
- «`opacity: 0` недоступен для пользователя» — события мыши работают, что неожиданно.
- «`display: none` скрывает от screen readers всегда» — `aria-hidden` управляет этим независимо.

### Связанные темы

- `016-blochnaya-model-css.md`
- `020-raznica-mezhdu-blochnym-i-strochnym-elementami.md`
- `048-svoystvo-pointer-events.md`
