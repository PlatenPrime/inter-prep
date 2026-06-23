# 09 — Toast Notifications

## Формулировка задачи

> «По кнопке показывайте toast-уведомление в правом верхнем углу. Плавное появление и исчезновение. Автоматически скрывается через 3 секунды.»

## Теория

**Toast** — ненавязчивое временное сообщение:
- `position: fixed` контейнер в углу экрана
- `flex-direction: column` + `gap` — стек нескольких тостов
- `pointer-events: none` на контейнере, `auto` на toast — клики проходят сквозь пустое место

**CSS Animations (`@keyframes`):**
- `toastIn` — `opacity` + `translateX` (slide from right)
- `toastOut` — обратная анимация перед удалением из DOM
- Класс `--leaving` триггерит exit animation
- `animationend` event — удалить элемент после анимации

**Жизненный цикл:**
1. `createElement` → append
2. `setTimeout` auto-dismiss
3. При hover — `clearTimeout` (опционально pause)
4. Exit animation → `remove()`

**a11y:** `aria-live="polite"` на контейнере, `role="status"` на toast.

## Разбор решения

1. `showToast(type)` — фабрика DOM-элемента.
2. Делегирование на `.demo` для кнопок с `data-toast`.
3. `removeToast` добавляет класс leaving и ждёт `animationend`.
4. Разные типы — цветная полоска `border-left`.

## Типичные ошибки

- Удалять toast сразу без exit-анимации — дёргается UI.
- Не очищать таймер при ручном закрытии — двойное удаление.
- `alert()` вместо toast — не то, что просят.
- Забыть `z-index` — toast под другими элементами.

## Вопросы интервьюера

1. Transition vs @keyframes — когда что?
2. Как сделать pause on hover для таймера?
3. Ограничить max количество тостов?
4. `aria-live` polite vs assertive?
5. Как тестировать animationend в unit-тестах?
