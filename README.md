# inter-prep — 60-Day Middle Full-Stack Interview Prep

Подготовка к middle full-stack собеседованию за **60 дней** (~4 часа/день).

## Формат

- **Вопрос (RU)** → **Answer (EN)** — как на международных интервью
- **Задачи**: `.js` (дни 1–10), `.ts` (дни 11–60)
- **Решения**: `days/day-NN-*/solutions/` — смотреть после своей попытки

## Как проходить день

1. Открой `days/day-NN-slug/README.md`
2. **90–120 мин** — прочитай `questions/`, ответь вслух на EN
3. **90–120 мин** — реши задачи в `tasks/`
4. **30–60 мин** — повтори вчерашний день + self-check из README

## JS-практика (100 задач)

Отдельный банк **[js-tasks/](js-tasks/)** — 100 задач: `task.js` + `task.test.js` для практики, `solution.md` + `solution.js` для самопроверки после попытки. Сложность от easy до middle, нумерация `001`–`100`.

```bash
node js-tasks/001-is-primitive/task.test.js
npm run js-tasks
```

## Углублённые спринты (~10 ч)

Опциональные экспертные модули в **[sprints/](sprints/)** — теория + практика + 30–40 drill-задач:

| Спринт | После | Команды |
|--------|-------|---------|
| [Event Loop](sprints/sprint-event-loop/) | day-08, day-36 | `npm run sprint-event-loop`, `npm run sprint-event-loop:drills` |
| [`this`](sprints/sprint-this/) | day-07, js-tasks 041–044 | `npm run sprint-this`, `npm run sprint-this:drills` |

Генерация контента: `npm run sprints:generate`

## Запуск задач

```bash
# День 1 (пример)
npm run day-01

# Тесты задач дня (если есть run-all.js)
node days/day-01-web-platform-git/tasks/run-all.js

# С дня 11 — TypeScript
npm install
npm run day-11

# Все 60 дней (проверка solutions)
npm test
```

## Календарь

Полный roadmap: [ROADMAP.md](./ROADMAP.md)

| Фаза | Дни | Темы |
|------|-----|------|
| Platform | 1–10 | HTML, CSS, Tailwind, JS, Git |
| TypeScript | 11–20 | Types, generics, strict, Zod |
| React | 21–35 | Hooks, Query, patterns, testing |
| Backend | 36–45 | Node, Express, Nest |
| Data | 46–52 | PostgreSQL, MongoDB, ORM |
| Cross-cutting | 53–60 | API, Redis, security, mocks |

## Шаблон нового дня

См. [docs/day-template/](./docs/day-template/)
