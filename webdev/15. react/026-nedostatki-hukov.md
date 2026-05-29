# Q026. Недостатки хуков?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

Основные недостатки хуков: проблема **stale closure** (обработчики захватывают устаревшие значения), сложность управления **dependency arrays** в `useEffect`/`useMemo`/`useCallback`, строгие **правила использования** (только в компонентах, только на верхнем уровне), невозможность создать **Error Boundary** без класса, и более высокий барьер входа для разработчиков, не знакомых с замыканиями.

---

## Развёрнутый ответ

### Суть и определение

Хуки решили многие проблемы классов, но привнесли новые сложности, связанные с функциональным программированием и замыканиями JavaScript.

### Конкретные недостатки

**1. Stale closure (устаревшие замыкания)**
```tsx
// Каждый рендер создаёт новую функцию с новым замыканием.
// useEffect может захватить старые значения.
const [count, setCount] = useState(0);

useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // ❌ всегда 0 — захвачено на moment mount
    setCount(count + 1); // ❌ всегда setCount(0 + 1) = 1
  }, 1000);
  return () => clearInterval(id);
}, []); // пустые deps = "беги только при mount"

// Решение 1: добавить count в deps (создаёт новый интервал при каждом рендере)
// Решение 2: функциональный апдейтор
setCount(prev => prev + 1); // ✅ не захватывает count
```

**2. Сложность dependency arrays**
```tsx
// Dependency arrays требуют внимания: забытые deps = баг, лишние deps = лишние эффекты

useEffect(() => {
  fetchData(userId, filters); // должны быть в deps
}, [userId]); // ❌ забыты filters → устаревшие данные при смене filters

// ESLint react-hooks/exhaustive-deps помогает, но:
// - объектные deps создают новые ссылки каждый рендер
// - иногда нужно намеренно пропустить dep (анти-паттерн или intentional)
```

**3. Строгие правила вызова**
```tsx
// ❌ Нельзя в условии — нарушает порядок хуков
if (user.isAdmin) {
  const [adminData] = useState(null); // ОШИБКА
}

// ❌ Нельзя в вложенной функции
const handleClick = () => {
  const [value] = useState(0); // ОШИБКА
};
```

**4. Нет аналога Error Boundary**
```tsx
// Классы — единственный способ до React 18.3
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) { /* только в классе */ }
  static getDerivedStateFromError(error) { return { hasError: true }; }
}
// Нет хук-эквивалента — нужна классовая обёртка
```

**5. useEffect ≠ componentDidMount (неочевидные отличия)**
- В StrictMode: mount → unmount → mount (эффект дважды)
- Асинхронный: выполняется после отрисовки браузером (не как CDM)
- Cleanup при каждом обновлении deps

**6. Cognitive overhead для новичков**
- Замыкания, ссылочное равенство объектов, `useCallback`/`useMemo` — нетривиальные концепции
- «Почему мой объект в deps вызывает бесконечный цикл?» — частый вопрос

**7. Нет жизненного цикла getSnapshotBeforeUpdate**
```tsx
// Нет полного аналога; ближе всего — useLayoutEffect + ref
// Нужно для захвата DOM-состояния перед обновлением (позиция скролла)
```

### Практика и применение

- **react-hooks/exhaustive-deps** в ESLint — обязателен в любом проекте с хуками
- **useRef для «живых» значений**: `const countRef = useRef(count); countRef.current = count;` — доступ к актуальному значению без перезапуска эффекта
- **React 19 Compiler** автоматически управляет deps — снимает часть проблем вручную

### Важные нюансы и краеугольные камни

- Stale closure — не «баг React», а следствие того, как работают замыкания в JS
- Большинство проблем с deps решаются правильным пониманием, что должно быть в deps

### Примеры

```tsx
// Паттерн: useRef для «живых» значений в эффектах
const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef(callback);

  // Всегда сохранять актуальный callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]); // ✅ не зависит от callback — нет пересоздания интервала
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как решить stale closure?** — функциональный апдейтор setState, useRef для «живых» значений, правильные deps
- **Когда использовать useMemo/useCallback?** — только когда есть измеримая проблема производительности; не «на всякий случай»
- **Когда всё ещё нужен классовый компонент?** — Error Boundaries, `getSnapshotBeforeUpdate`

### Красные флаги (чего не говорить)

- «Хуки сложны — лучше классы» — классы сложнее в другом; хуки — стандарт экосистемы
- «Нет никаких недостатков» — stale closure и dependency arrays — реальные проблемы в prod

### Связанные темы

- `024-chto-takoe-react-huki-hooks.md`
- `025-preimushchestva-hukov.md`
- `027-pravila-ogranicheniya-ispolzovaniya-hukov.md`
- `028-raznica-mezhdu-useeffect-i-componentdidmount.md`
