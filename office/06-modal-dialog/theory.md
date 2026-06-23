# 06 — Modal Dialog

## Формулировка задачи

> «По кнопке открывается модальное окно поверх страницы. Закрывается крестиком, кликом на затемнение и Escape. Пока модалка открыта — body не скроллится.»

## Теория

**Модальное окно** — блокирующий UI-слой:
- `position: fixed; inset: 0` — на весь viewport
- Overlay + content box с `z-index`
- `role="dialog"` + `aria-modal="true"`

**Блокировка скролла:** класс на `body { overflow: hidden }`.

**Focus management:**
- При открытии — фокус на первый интерактивный элемент
- При закрытии — вернуть фокус на trigger
- Focus trap: Tab на последнем → первый (и Shift+Tab наоборот)

**Закрытие:** `data-close` на overlay и кнопках + делегирование на modal.

**Анимации:** `@keyframes` для overlay (fade) и content (slideUp).

## Разбор решения

1. `modal.hidden = true/false` — нативное скрытие.
2. `previousFocus` сохраняет элемент до открытия.
3. `getFocusableElements()` — список для trap.
4. Клик на overlay через `data-close` attribute selector.

## Типичные ошибки

- Не блокировать scroll — страница прокручивается под модалкой.
- Фокус остаётся на кнопке под overlay — плохая a11y.
- Закрытие только по крестику — UX страдает.
- `z-index` без stacking context — модалка под header.

## Вопросы интервьюера

1. Зачем `aria-modal`?
2. Как реализовать focus trap без библиотек?
3. `<dialog>` element — плюсы и минусы?
4. Почему `overflow: hidden` на body, а не на html?
5. Как предотвратить закрытие при клике внутри content?
