# 11 — Hamburger Menu

## Формулировка задачи

> «Сверстайте адаптивный header с навигацией. На мобильном — бургер-иконка, по клику выезжает меню слева с затемнением фона. Иконка анимируется в крестик. На десктопе — обычное горизонтальное меню.»

## Теория

**Mobile-first навигация** — на узком экране горизонтальное меню не помещается, поэтому его прячут в off-canvas панель.

**Off-canvas panel:**
- `position: fixed` — панель поверх контента
- `transform: translateX(-100%)` → `translateX(0)` — плавный выезд (GPU-accelerated, лучше чем `left`)
- `transition` на transform для slide-эффекта

**Overlay (затемнение):**
- `position: fixed; inset: 0` — на весь viewport
- `opacity: 0` → `1` с `pointer-events: none/auto`
- Клик по overlay закрывает меню

**Анимация бургера:**
- 3 элемента `<span>` внутри `<button>`
- При активном состоянии: верхний и нижний `rotate(45deg/-45deg)` + `translateY`, средний `opacity: 0`
- `transform-origin: center` для корректного поворота

**Scroll lock:** `body.nav-open { overflow: hidden }` — страница не прокручивается под меню.

**ARIA (disclosure / dialog pattern):**
- `aria-expanded` на кнопке
- `aria-controls` → id панели
- `role="dialog"` + `aria-modal="true"` на мобильной панели
- `aria-hidden` на overlay и панели когда закрыто

**Focus management:**
- При открытии — фокус на первую ссылку
- При закрытии — возврат на кнопку бургера
- `previousFocus` сохраняется до открытия

**Stagger animation:** `transition-delay` на nth-child для последовательного появления пунктов.

**prefers-reduced-motion:** отключение анимаций для пользователей с вестибулярными нарушениями.

## Разбор решения

1. **Два nav:** desktop `.header__nav` (виден ≥48rem) и mobile `.mobile-nav` (off-canvas).
2. **State через классы:** `nav-open` на body, `--active` на toggle, `--open` на panel, `--visible` на overlay.
3. **requestAnimationFrame** перед добавлением классов — браузер успевает отрисовать `hidden=false` до анимации.
4. **transitionend** на панели — `hidden=true` только после завершения закрытия.
5. **matchMedia change** — автозакрытие при переходе на desktop (resize / rotate).

## Типичные ошибки

- Меню открыто, но body скроллится — забыли `overflow: hidden`.
- Анимация не работает — класс добавлен до снятия `hidden`.
- Checkbox hack без JS — нет focus trap, Escape, scroll lock.
- `z-index` хаотичный — overlay под панелью или header перекрывает кнопку.
- Не скрыть mobile panel на desktop — дублирование навигации.
- Забыть `aria-expanded` — screen reader не знает состояние.

## Вопросы интервьюера

1. Почему `transform` лучше `left` для анимации?
2. Как реализовать меню справа вместо слева?
3. Checkbox hack vs button + JS — плюсы и минусы?
4. Что такое `aria-modal` и зачем оно на панели?
5. Как сделать focus trap внутри мобильного меню?
6. Как обработать поворот экрана с открытым меню?

## Альтернативы

- **`<dialog>` element** — нативный modal API, `showModal()`
- **CSS only (checkbox hack)** — только для простых кейсов без a11y
- **`:target` pseudo-class** — меню через hash в URL
