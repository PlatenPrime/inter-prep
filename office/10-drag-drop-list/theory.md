# 10 — Drag and Drop List

## Формулировка задачи

> «Сделайте сортируемый список: пользователь перетаскивает элементы мышью для изменения порядка. Покажите визуально, куда встанет элемент.»

## Теория

**HTML5 Drag and Drop API** — нативные события:

| Событие | Где слушать | Действие |
|---------|-------------|----------|
| `dragstart` | draggable элемент | Сохранить ссылку, `dataTransfer.setData` |
| `dragover` | drop zone | **`preventDefault()`** — обязательно! |
| `drop` | drop zone | Вставить элемент до/после target |
| `dragend` | draggable | Очистка состояния |

**draggable="true"** на `<li>` — включает перетаскивание.

**dataTransfer:**
- `effectAllowed = 'move'`
- `dropEffect = 'move'` в dragover
- `setData('text/plain', id)` — Firefox требует setData

**Перестановка в DOM:**
```js
if (draggedIndex < targetIndex) target.after(draggedItem);
else target.before(draggedItem);
```

**Визуальный feedback:** классы `--dragging` (opacity) и `--over` (подсветка).

## Разбор решения

1. Делегирование всех DnD-событий на `<ul>` — не вешать на каждый li.
2. `draggedItem` в замыкании — ссылка на перетаскиваемый элемент.
3. `dragover` + `preventDefault` — без этого drop не сработает.
4. `updateOrderLog()` читает порядок из DOM после drop.

## Типичные ошибки

- Забыть `preventDefault` в `dragover` — drop never fires.
- Не вызывать `setData` — drag ломается в Firefox.
- Путать `drag` и `mousedown` custom implementation.
- Не обновлять state после reorder — только DOM, без данных.

## Вопросы интервьюера

1. Почему dragover требует preventDefault?
2. Альтернатива: Pointer Events + transform?
3. Как сделать DnD доступным с клавиатуры?
4. Touch devices — проблемы native DnD?
5. Как синхронизировать порядок с массивом в state?

## Альтернативы на собесе

- **SortableJS** — обычно запрещают библиотеки
- **Pointer events** — больше контроля, больше кода
- **CSS only** — не для reorder списка
