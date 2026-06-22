# Storm — 4-часовой штурм к junior frontend-собеседованию

> **Время:** 4 часа (240 мин) · **Уровень:** junior / trainee frontend

Сжатый курс подготовки под вакансию с фокусом на **JavaScript (ES6+)**, **HTML5**, **CSS3**, **Git**, кратко **React + Vue**, **soft skills** и **английский для документации**.

## Требования вакансии (чеклист)

| Критерий | Где готовиться |
|----------|----------------|
| JavaScript ES6+, HTML, CSS | [01-javascript](01-javascript/theory.md), [02-html-css](02-html-css/theory.md), [07-practice](07-practice/) |
| Vue / React (желательно) | [04-react](04-react/theory.md), [05-vue](05-vue/theory.md) |
| Git (начальный) | [03-git](03-git/theory.md) |
| Обучаемость, команда, инициатива | [06-soft-skills](06-soft-skills/behavioral.md) |
| Английский (техдоки) | [09-english](09-english/vocabulary.md) |

## Как проходить

1. Открой **[00-schedule.md](00-schedule.md)** — следуй поминутному плану
2. Читай теорию вслух: **вопрос RU → ответ EN** (как на международных интервью)
3. Решай практику **до** просмотра `solution.js` / `solution.md`
4. В конце — **[08-mock-interview/checklist.md](08-mock-interview/checklist.md)**

## Структура

```
storm/
├── README.md              ← вы здесь
├── 00-schedule.md         ← расписание 240 мин
├── 01-javascript/theory.md
├── 02-html-css/theory.md
├── 03-git/theory.md
├── 04-react/theory.md
├── 05-vue/theory.md
├── 06-soft-skills/behavioral.md
├── 07-practice/
│   ├── js-tasks.md
│   └── html-css-drill.md
├── 08-mock-interview/checklist.md
└── 09-english/vocabulary.md
```

## Команды для практики

```bash
# JS-задачи (из корня репозитория)
node js-tasks/001-is-primitive/task.test.js
node js-tasks/012-is-palindrome/task.test.js
node js-tasks/095-contains-duplicate/task.test.js

# Все реализованные js-tasks
npm run js-tasks
```

## Углубление (после штурма)

| Тема | Материал в репозитории |
|------|------------------------|
| 600+ Q&A | [webdev/](../webdev/) |
| 100 JS-задач | [js-tasks/](../js-tasks/) |
| HTML + Git углублённо | [days/day-01-web-platform-git/](../days/day-01-web-platform-git/) |
| React примеры | [examples/react/](../examples/react/) |

## Критерий готовности

- [ ] Объяснить разницу `map` и `forEach`, `let` и `var`
- [ ] Нарисовать flex-контейнер с центрированием
- [ ] Описать git workflow от `clone` до PR
- [ ] Назвать 3 отличия React и Vue
- [ ] Решить palindrome / contains duplicate / sum array без подглядывания
- [ ] Ответить на 4 behavioral-вопроса по STAR
