# Q048. Что такое строгий режим в React? Его преимущества?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**`<React.StrictMode>`** — инструментальный компонент, активирующий дополнительные проверки и предупреждения в **dev-режиме**. Не влияет на production. Основные поведения: двойной вызов render и effects (для обнаружения side-effects), предупреждения об устаревших API (deprecated lifecycle, legacy string refs) и обнаружение непредвиденных побочных эффектов.

---

## Развёрнутый ответ

### Суть и определение

`StrictMode` — компонент-утилита React. Он не рендерит DOM-узла и не влияет на визуальное представление. В dev-режиме активирует ряд проверок. Можно обернуть всё приложение или конкретную часть.

```tsx
// Весь app
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Или только часть
const Dashboard: React.FC = () => (
  <React.StrictMode>
    <LegacyWidgets />
  </React.StrictMode>
);
```

### Что делает StrictMode

**1. Двойной вызов render-функций (React 18)**

React вызывает функцию компонента дважды (mount → unmount → mount), чтобы обнаружить side-effects в render phase:

```tsx
const Component: React.FC = () => {
  console.log('render'); // выводится ДВАЖДЫ в dev со StrictMode
  return <div />;
};
```

**2. Двойной вызов effects (mount → unmount → mount)**

```tsx
useEffect(() => {
  console.log('effect'); // выводится 2 раза
  subscribeToStream();

  return () => {
    console.log('cleanup'); // выводится 1 раз (между двумя mount)
    unsubscribeFromStream();
  };
}, []);
```

Если cleanup не написан — проблема обнаруживается: WebSocket не закрыт, подписка дублируется.

**3. Предупреждения об устаревшем API**

- `componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate` → предупреждения
- Legacy string refs (`ref="myRef"`) → предупреждения  
- Legacy context API (`contextTypes`, `childContextTypes`) → предупреждения
- `findDOMNode()` → предупреждения

**4. Обнаружение неожиданного использования state**

При двойном вызове компонентов React помечает setState вызовы из второго вызова как «потенциально нечистые».

### Преимущества

1. **Раннее обнаружение проблем**: нечистые render-функции, несброшенные подписки, утечки памяти
2. **Готовность к Concurrent Mode**: Concurrent React может вызывать render несколько раз; StrictMode симулирует это
3. **Документация устаревших API**: предупреждения помогают мигрировать с deprecated паттернов
4. **Нулевой production overhead**: все проверки только в dev

### Практика и применение

```tsx
// Пример: StrictMode обнаруживает отсутствие cleanup
const BuggyComponent: React.FC = () => {
  useEffect(() => {
    const timer = setInterval(() => console.log('tick'), 1000);
    // ❌ Нет return → таймер не очищается → StrictMode запустит 2 таймера
  }, []);
  return <div />;
};

// ✅ С cleanup
const FixedComponent: React.FC = () => {
  useEffect(() => {
    const timer = setInterval(() => console.log('tick'), 1000);
    return () => clearInterval(timer); // StrictMode создаст → удалит → создаст → OK
  }, []);
  return <div />;
};
```

### Важные нюансы и краеугольные камни

- **Двойной вызов — только в dev**: в production поведение нормальное
- **`useRef` не сбрасывается** при двойном mount — используется для флагов инициализации
- **Стрим XHR**: если API не поддерживает отмену (AbortController), двойной fetch создаст 2 запроса в dev — нормально
- Next.js включает StrictMode по умолчанию в `next.config.js`: `reactStrictMode: true`

### Примеры

```tsx
// Правильный useEffect, проходящий StrictMode
const DataFetcher: React.FC<{ userId: string }> = ({ userId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then(r => r.json())
      .then(d => { if (!isCancelled) setData(d); })
      .catch(e => { if (e.name !== 'AbortError') console.error(e); });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [userId]);

  return <div>{data?.name}</div>;
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему компонент рендерится дважды в dev?** — StrictMode проверяет, что render — чистая функция без side-effects
- **Как правильно написать useEffect для StrictMode?** — возвращать cleanup, который отменяет все операции (AbortController, clearInterval и т.д.)
- **Где включить StrictMode в Next.js?** — `next.config.js`: `reactStrictMode: true` (по умолчанию `true` в новых проектах)

### Красные флаги (чего не говорить)

- «StrictMode сломан, убираю его» — двойной вызов намеренный; проблема в коде, не в StrictMode
- «StrictMode влияет на production» — только dev-режим; production не затронут

### Связанные темы

- `024-chto-takoe-react-huki-hooks.md`
- `028-raznica-mezhdu-useeffect-i-componentdidmount.md`
- `011-metody-zhiznennogo-cikla-komponenta-v-react.md`
