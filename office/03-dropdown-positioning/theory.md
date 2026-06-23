# 03 — Dropdown Positioning

## Формулировка задачи

> «Реализуйте выпадающее меню у кнопки. Меню позиционируется под кнопкой, закрывается при клике снаружи и по Escape.»

## Теория

**Позиционирование:**
- `position: relative` на родителе — контекст для absolute-детей
- `position: absolute` + `top` / `left` — меню относительно триггера
- `z-index` — порядок наложения (работает в stacking context)

**Закрытие по клику вне:**
- `document.addEventListener('click', …)` + `element.contains(event.target)`

**Доступность:**
- `aria-expanded` — состояние открыто/закрыто
- `aria-haspopup`, `role="menu"`, `role="menuitem"`
- Атрибут `hidden` вместо только `display: none` через класс

**event.stopPropagation()** на триггере — иначе клик по кнопке сразу закроет меню через document listener.

## Разбор решения

1. `.dropdown { position: relative }` — якорь для меню.
2. `.dropdown__menu { position: absolute; top: calc(100% + gap) }`.
3. Toggle через `hidden` и `aria-expanded`.
4. Делегирование на `menu` для пунктов с `data-action`.
5. Escape возвращает фокус на trigger.

## Типичные ошибки

- Absolute без relative-родителя — меню позиционируется от viewport/body.
- Клик по кнопке всплывает и мгновенно закрывает меню.
- Забыть `z-index` — меню перекрывается соседними блоками.
- Использовать `<div onclick>` вместо `<button>` — плохая a11y.

## Вопросы интервьюера

1. Что такое stacking context?
2. Как определить клик «вне» элемента?
3. Разница между `hidden` и `aria-hidden`?
4. Как позиционировать dropdown вверх, если не хватает места снизу?
5. Почему `stopPropagation` на trigger, а не `preventDefault`?
