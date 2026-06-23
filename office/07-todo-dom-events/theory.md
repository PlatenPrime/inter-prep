# 07 — Todo DOM Events

## Формулировка задачи

> «Напишите todo-приложение: добавление, удаление, toggle done, счётчик активных, фильтры. Без React. За 2 часа — классика офисного этапа.»

## Теория

**Паттерн state + render:**
- Массив `todos` — единственный источник правды
- Любое действие меняет state → вызывает `render()`
- `render()` пересобирает DOM из state (простой подход для собеса)

**Event delegation:**
- Один `click` на `#todoList` вместо listener на каждой кнопке
- `event.target.closest('.todo-item')` — найти строку
- `dataset.id` — связь DOM ↔ data

**Безопасность:** `escapeHtml` перед вставкой текста — защита от XSS при `innerHTML`.

**Форма:** `submit` + `preventDefault` + `trim()` + пустая проверка.

**a11y:** `aria-live="polite"` на списке, `aria-label` на checkbox/delete.

## Разбор решения

1. State: `{ id, text, done }[]`, `filter`, `nextId`.
2. `getFilteredTodos()` — фильтрация перед рендером.
3. Делегирование: checkbox toggle, delete, filters через `closest`.
4. Footer: pluralize для русского языка, `clearDone` скрыт если нет done.

## Типичные ошибки

- Добавлять listener при каждом render — утечки памяти.
- Мутировать DOM без обновления state — рассинхрон.
- Не экранировать user input в innerHTML.
- Забыть `trim()` — пустые задачи.
- Фильтр меняет данные вместо отображения.

## Вопросы интервьюера

1. Зачем delegation вместо bind на каждый элемент?
2. Render-all vs patch DOM — trade-offs?
3. Как сохранить todos в localStorage?
4. Как реализовать edit по double-click?
5. Почему state вне компонента, а не в DOM?
