# Модуль 08 — Server state (Pinia Colada)

## Цель

Разделить client state (Pinia) и server state (queries/mutations). Кэш, invalidation, optimistic updates.

## Установка

```ts
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'

app.use(createPinia())
app.use(PiniaColada)
```

## useQuery

```ts
import { useQuery } from '@pinia/colada'

const { data, isPending, error } = useQuery({
  key: () => ['tasks'],
  query: () => fetchTasks(),
})
```

- `key` — уникальный ключ кэша (как queryKey в TanStack Query)
- `query` — async функция загрузки

## useMutation + invalidation

```ts
import { useMutation, useQueryCache } from '@pinia/colada'

const queryCache = useQueryCache()

const { mutate: createTask } = useMutation({
  mutation: (input: CreateTaskInput) => api.createTask(input),
  onSettled: async () => {
    await queryCache.invalidateQueries({ key: ['tasks'] })
  },
})
```

## Client vs server state

| Тип | Где хранить | Пример |
|-----|-------------|--------|
| Server | Pinia Colada | список задач с API |
| Client UI | Pinia / ref | фильтр, sidebar open |
| Form draft | ref / local | несохранённый ввод |

## Примеры

- `examples/08-server-state/useTasksQuery.ts`

## React-bridge

Прямой аналог TanStack Query: `useQuery`, `useMutation`, cache invalidation.

## Следующий модуль

[09-performance/theory.md](../09-performance/theory.md)
