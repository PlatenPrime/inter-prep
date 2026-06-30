# Capstone — Task Board SPA

Финальный проект курса. Объединяет модули 05–08:

- **Vue Router** — `/tasks`, `/tasks/:id`, `/tasks/settings`
- **Pinia** — UI-фильтры (`taskFilters` store)
- **Zod** — валидация формы создания задачи
- **Pinia Colada** — загрузка и мутации задач (mock API)

## Запуск

```bash
cd vue-3-course
npm run dev
```

Откройте [http://localhost:5173/tasks](http://localhost:5173/tasks).

## Структура

```
capstone/src/
  api/tasks.ts           # mock API
  schemas/task.ts        # Zod
  stores/taskFilters.ts  # client UI state
  components/            # TaskForm, TaskList, TaskItem
  views/                 # страницы
```

## Тесты

```bash
npx vitest run capstone
```

## Задание для самопроверки

1. Добавьте фильтр «completed only» в settings.
2. Добавьте optimistic update при toggle done.
3. Напишите guard: редирект с `/tasks/:id` на `/tasks` если id не найден.
