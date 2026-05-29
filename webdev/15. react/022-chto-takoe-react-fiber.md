# Q022. Что такое React Fiber?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**React Fiber** — переработанная архитектура движка рендеринга React, представленная в React 16. Это внутренняя реализация reconciler'а, заменившая рекурсивный стек-рендеринг на **инкрементальный**, основанный на связном списке «единиц работы» (fiber nodes). Главное достижение: рендеринг теперь можно **прерывать, приостанавливать и возобновлять**, что открыло путь к Concurrent Mode.

---

## Развёрнутый ответ

### Суть и определение

До React 16 reconciler работал как рекурсивный обход дерева компонентов — **синхронный стек (Stack Reconciler)**. Если дерево было большим, JS-стек блокировал браузер на десятки миллисекунд, вызывая «заморозку» UI (dropped frames, jank).

**Fiber** — это:
1. **Новая структура данных**: каждый компонент имеет «fiber node» — объект с информацией о компоненте, его состоянии, pendingWork
2. **Новый алгоритм**: рендеринг разбит на небольшие «единицы работы», между которыми React может передавать управление браузеру
3. **Система приоритетов**: разные обновления получают разные приоритеты (user input > animation > data fetch)

### Как это работает

**Структура Fiber Node:**
```
{
  type,           // тип компонента
  key,
  stateNode,      // DOM-узел или инстанс класса
  return,         // родительский fiber
  child,          // первый дочерний fiber
  sibling,        // следующий «брат»
  pendingProps,   // новые props
  memoizedProps,  // примеры props последнего рендера
  memoizedState,  // последний state
  effectTag,      // нужна ли операция (Insert/Update/Delete)
  alternate,      // ссылка на fiber из предыдущего рендера
}
```

**Двойная буферизация (Double Buffering):**
```
current tree    ←→    work-in-progress tree
(в DOM)              (строится при рендере)
                      ↓ после commit
           становится current
```

**Фазы работы:**
1. **Render/Reconciliation phase** (прерываемая):
   - Обходит дерево fiber'ов
   - Вызывает render/функции компонентов
   - Строит новое work-in-progress дерево
   - Планирует effects

2. **Commit phase** (синхронная):
   - `beforeMutation`: getSnapshotBeforeUpdate
   - `mutation`: изменения DOM
   - `layout`: componentDidMount/Update, useLayoutEffect

### Практика и применение

- **Concurrent Features (React 18)**: `startTransition`, `useTransition`, `useDeferredValue` — возможны благодаря Fiber
- **Suspense**: приостановка рендеринга до готовности данных — реализована через Fiber
- **React Server Components**: Fiber управляет reconciliation между серверным и клиентским деревьями
- **Профайлер**: React DevTools Profiler показывает Fiber-дерево и время рендера каждого компонента

### Важные нюансы и краеугольные камни

- **Render phase может выполняться несколько раз**: при прерывании → возобновлении Fiber перезапускает рендер компонента. Side effects в render — баг (React StrictMode помогает найти такие)
- **Commit phase никогда не прерывается**: DOM-операции атомарны
- `useEffect` — «passive effect», выполняется **после** commit и отрисовки браузером
- `useLayoutEffect` — выполняется **в** commit phase (layout), блокирует отрисовку
- Fiber — это внутренняя деталь реализации; разработчику не нужно работать с ним напрямую

### Примеры

```tsx
// Concurrent features, ставшие возможными благодаря Fiber

import { startTransition, useTransition, useDeferredValue } from 'react';

// startTransition — низкоприоритетное обновление
const handleSearch = (query: string) => {
  // Высокий приоритет: обновить input немедленно
  setInputValue(query);

  // Низкий приоритет: обновить список (можно прерывать)
  startTransition(() => {
    setSearchQuery(query);
  });
};

// useDeferredValue — «отложенная» версия значения
const SearchResults: React.FC<{ query: string }> = ({ query }) => {
  const deferredQuery = useDeferredValue(query);
  // deferredQuery обновляется с меньшим приоритетом
  const results = useFilteredResults(deferredQuery);
  return <ResultList results={results} />;
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем Fiber отличается от Stack Reconciler?** — Stack: синхронный рекурсивный обход, нельзя прервать; Fiber: связный список, прерываемый обход
- **Что такое «time slicing»?** — разбиение длинной работы на кусочки по ~5ms, между которыми браузер обрабатывает ввод
- **Почему render phase может выполняться несколько раз?** — при прерывании Concurrent Mode перезапускает рендер с актуальным state

### Красные флаги (чего не говорить)

- «Fiber — это новая версия React» — это архитектурное изменение в React 16, не отдельный продукт
- «Fiber изменил публичное API React» — публичный API не изменился; Fiber — внутренняя реализация

### Связанные темы

- `019-chto-takoe-virtual-dom-kak-on-rabotaet-s-react.md`
- `021-chto-takoe-react-reconciliation.md`
- `023-nazvajte-osnovnuyu-cel-react-fiber.md`
