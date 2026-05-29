# Q023. Назовите основную цель React Fiber?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

Основная цель React Fiber — сделать рендеринг **прерываемым и приоритизированным**. Старый Stack Reconciler блокировал JS-поток на всё время обхода дерева компонентов; Fiber разбивает эту работу на небольшие «единицы», между которыми браузер может реагировать на ввод пользователя, что устраняет «заморозку» интерфейса в сложных приложениях.

---

## Развёрнутый ответ

### Суть и определение

До React 16 (Stack Reconciler) алгоритм рендеринга был **синхронным и непрерываемым**: один вызов `setState` запускал рекурсивный обход всего дерева компонентов. На большом дереве это занимало десятки миллисекунд — браузер не мог обработать ввод, анимации пропускали кадры.

Fiber решает это через **incremental rendering**: рендеринг разбит на небольшие куски, и React может переключаться между ними, уступая управление браузеру.

### Конкретные цели Fiber

**1. Incremental rendering (инкрементальный рендеринг)**
Разбить работу по рендерингу на «единицы работы» (fiber units) и распределить их по нескольким кадрам (frames). Каждый unit ≈ один компонент.

**2. Ability to pause, abort, or reuse work**
React может:
- **Пауза**: сохранить прогресс, вернуть управление браузеру (requestIdleCallback/scheduler)
- **Отмена**: если state изменился снова, старая работа отменяется
- **Повторное использование**: ранее сделанная работа может быть использована повторно

**3. Priority-based scheduling (приоритизация)**
Разные обновления получают разный приоритет:
- `SyncLane` — синхронный (клик, ввод с клавиатуры)
- `InputContinuousLane` — непрерывный ввод (hover, скролл)
- `DefaultLane` — обычные обновления
- `TransitionLane` — переходы (startTransition)
- `IdleLane` — фоновая работа

**4. New lifecycle hooks и concurrency primitives**
Fiber открыл возможность для `Suspense`, `useTransition`, `useDeferredValue`, `React Server Components`.

### Как это работает

```
Старый Stack Reconciler:
setState → [блокирует поток на N мс] → render entire tree → commit

React Fiber:
setState → [unit 1] → yield → [unit 2] → yield → ... → commit
           ↑ браузер может отрисовать кадр между единицами работы
```

**Scheduler** (пакет `@react/scheduler`) управляет очередью единиц работы и уступает управление браузеру через `MessageChannel` (постзадачи — не rAF).

### Практика и применение

- **Тяжёлые списки** (тысячи элементов): без Fiber — зависание; с Concurrent Mode + `useDeferredValue` — плавная работа
- **Анимации**: React Concurrent не блокирует кадры; анимации на CSS остаются плавными
- **SSR + Streaming**: Fiber позволяет стримить HTML-чанки (React 18 `renderToPipeableStream`)

### Важные нюансы и краеугольные камни

- **Fiber ≠ автоматический Concurrent Mode**: преимущества раскрываются только с `ReactDOM.createRoot` (React 18) и concurrent features
- Render phase при Concurrent Mode **может вызвать render-функцию несколько раз** → никаких side-effects в render
- **StrictMode в dev** намеренно запускает эффекты дважды для обнаружения нечистых функций компонентов

### Примеры

```tsx
// Демонстрация разницы без Fiber (блокирующий рендер):
// handleHeavyUpdate → заморозка UI

// С Fiber (React 18) — startTransition для низкоприоритетных обновлений
import { startTransition, useTransition } from 'react';

const FilterableList: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value); // синхронно — input отзывчив

    startTransition(() => {
      // низкоприоритетно — может прерываться при новом вводе
      setFilteredItems(items.filter(i => i.includes(value)));
    });
  };

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ItemList items={filteredItems} />
    </>
  );
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое «lanes» в React?** — система приоритетов в Fiber: каждое обновление имеет «lane» (полосу), определяющую порядок обработки
- **Как React 18 использует Fiber?** — автоматический батчинг, Concurrent Mode по умолчанию с `createRoot`
- **Что такое Scheduler?** — пакет React, управляющий очередью задач и уступкой управления браузеру

### Красные флаги (чего не говорить)

- «Fiber решает все проблемы производительности» — Fiber обеспечивает механизм; разработчик должен правильно использовать `memo`, `useCallback`, `startTransition`
- «Fiber — публичное API» — это внутренняя архитектура; публичный API (хуки, JSX) не изменился

### Связанные темы

- `022-chto-takoe-react-fiber.md`
- `021-chto-takoe-react-reconciliation.md`
- `062-tekhniki-optimizacii-performansa-react.md`
