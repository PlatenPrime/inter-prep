# 08 — Tabs Component

## Формулировка задачи

> «Сверстайте вкладки: три таба, три панели контента. По клику показывается нужная панель. Поддержите навигацию стрелками.»

## Теория

**WAI-ARIA Tabs pattern:**
- `role="tablist"` — контейнер вкладок
- `role="tab"` + `aria-selected` + `aria-controls` → id панели
- `role="tabpanel"` + `aria-labelledby` → id таба
- Неактивные табы: `tabindex="-1"` (roving tabindex)

**Переключение:**
- Снять active со всех табов и скрыть все панели (`hidden`)
- Активному табу: класс, `aria-selected="true"`, `tabindex="0"`
- Показать панель по `aria-controls`

**Клавиатура (ARIA Authoring Practices):**
- `ArrowLeft` / `ArrowRight` — между табами
- `Home` / `End` — первый / последний
- Активация при фокусе (automatic activation)

## Разбор решения

1. `data-tab` дублирует связь для удобства, основная — `aria-controls`.
2. `activateTab(tab)` — единая функция для click и keyboard.
3. `tabList.addEventListener('keydown')` — roving focus + activate.
4. Визуал: underline через `border-bottom` на активном табе.

## Типичные ошибки

- Показывать панели через `display:none` без `hidden` — хуже для a11y.
- Все табы с `tabindex="0"` — лишние tab-stops.
- Не связать tab и panel через id.
- Забыть `aria-selected` — screen reader не знает активную вкладку.

## Вопросы интервьюера

1. Что такое roving tabindex?
2. Automatic vs manual activation — в чём разница?
3. Можно ли сделать tabs только на CSS (`:target`)?
4. Как lazy-load контент панели?
5. Зачем `aria-labelledby` на tabpanel?
