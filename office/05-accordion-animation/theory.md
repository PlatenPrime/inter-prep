# 05 — Accordion Animation

## Формулировка задачи

> «Сделайте FAQ-аккордеон: по клику раскрывается ответ с плавной анимацией. Только один пункт открыт одновременно.»

## Теория

**Анимация высоты** — сложный кейс: `height: auto` не анимируется напрямую.

Современный подход — **CSS Grid trick**:
```css
.panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s; }
.panel--open { grid-template-rows: 1fr; }
.inner { overflow: hidden; }
```

Альтернатива: `max-height` с завышенным значением (менее точно).

**Доступность аккордеона:**
- Триггер — `<button>`, не div
- `aria-expanded` на кнопке
- `aria-controls` → id панели
- `role="region"` + `aria-labelledby` на панели
- `hidden` когда закрыто

**requestAnimationFrame** — даёт браузеру применить `hidden=false` до добавления класса анимации.

## Разбор решения

1. JS оборачивает содержимое панели в `.accordion__panel-inner` для grid-trick.
2. При открытии: снять `hidden` → rAF → класс `--open`.
3. При закрытии: убрать класс → на `transitionend` вернуть `hidden`.
4. Перед открытием нового — закрыть все остальные (single-open mode).

## Типичные ошибки

- Анимировать `display: none` напрямую — не работает.
- `max-height: 0` → `max-height: 1000px` — рывки в конце анимации.
- Несколько открытых панелей при требовании «только одна».
- Заголовок как `<div onclick>` — нет фокуса с клавиатуры.

## Вопросы интервьюера

1. Почему нельзя анимировать `height: auto`?
2. Как работает grid-template-rows 0fr / 1fr?
3. Зачем `transitionend` перед `hidden`?
4. Как сделать accordion, где несколько пунктов открыты?
5. Как связаны `aria-expanded` и `hidden`?
