# Q033. Зачем в `setState()` нужно передавать функцию?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

Функциональный апдейтор `setState(prev => newState)` гарантирует, что вычисление нового state основано на **последнем актуальном** значении, а не на значении из замыкания текущего рендера. Это критично при множественных обновлениях в очереди, стале-замыканиях в `useEffect`/`setTimeout`, и при батчинге — когда несколько setState могут вызываться до следующего ре-рендера.

---

## Развёрнутый ответ

### Суть и определение

В React `setState`/`useState` setter принимает два варианта:
1. **Прямое значение**: `setCount(5)` — установить конкретное значение
2. **Функцию-апдейтор**: `setCount(prev => prev + 1)` — вычислить из предыдущего state

Функциональный апдейтор безопаснее, когда новое состояние зависит от предыдущего.

### Проблема без функционального апдейтора

```tsx
// ❌ Проблема: захват устаревшего state в замыкании
const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // count = 0 захвачен в замыкании на момент создания handleClick
    setCount(count + 1); // → 1
    setCount(count + 1); // → 1 (не 2! count всё ещё 0)
    setCount(count + 1); // → 1 (не 3!)
    // Результат: count = 1, ожидалось 3
  };

  return <button onClick={handleClick}>{count}</button>;
};
```

**С функциональным апдейтором:**
```tsx
// ✅ Каждый апдейтор получает актуальное предыдущее значение из очереди
const handleClick = () => {
  setCount(prev => prev + 1); // 0 → 1
  setCount(prev => prev + 1); // 1 → 2
  setCount(prev => prev + 1); // 2 → 3
  // Результат: count = 3 ✅
};
```

### Проблема в useEffect / setTimeout

```tsx
// ❌ Stale closure в useEffect
useEffect(() => {
  const interval = setInterval(() => {
    // count всегда 0 (захвачено при mount)
    setCount(count + 1); // всегда 0+1=1
  }, 1000);
  return () => clearInterval(interval);
}, []); // count не в deps!

// ✅ Функциональный апдейтор — не захватывает count
useEffect(() => {
  const interval = setInterval(() => {
    setCount(prev => prev + 1); // всегда корректно
  }, 1000);
  return () => clearInterval(interval);
}, []); // deps пустые — корректно!
```

### Как работает батчинг

React батчит (объединяет) несколько setState в один ре-рендер. При прямом значении батчинг использует последнее переданное значение:

```tsx
// React 18 батчит эти три вызова в один ре-рендер
setCount(count + 1); // scheduled: count=0+1=1
setCount(count + 1); // scheduled: count=0+1=1 (перезаписывает!)
setCount(count + 1); // scheduled: count=0+1=1 (final)
// Применяется 1

// С функциональным апдейтором — каждый получает результат предыдущего
setCount(prev => prev + 1); // 0→1
setCount(prev => prev + 1); // 1→2
setCount(prev => prev + 1); // 2→3
// Применяется 3
```

### Практика и применение

- **Toggle булеана**: `setIsOpen(prev => !prev)` — всегда переключает, независимо от batching
- **Массив-стейт**: `setItems(prev => [...prev, newItem])` — не теряет предыдущие элементы
- **Сложный объект**: `setState(prev => ({ ...prev, fieldName: newValue }))` — безопасный spread
- **Конкурентные обновления**: при concurrent-режиме React 18 функциональный апдейтор защищает от race conditions

### Важные нюансы и краеугольные камни

- При прямом значении React также батчит, но использует **последнее** переданное значение — при нескольких одинаковых вызовах результат непредсказуем
- `useReducer` dispatch всегда принимает действие — похожий механизм чистых обновлений
- Правило: **всегда используйте функциональный апдейтор, если новое значение зависит от предыдущего**

### Примеры

```tsx
// Реальные сценарии

// 1. Toggle с стабильным поведением
const [isVisible, setIsVisible] = useState(false);
const toggle = useCallback(() => setIsVisible(prev => !prev), []);

// 2. Добавление в массив
const [todos, setTodos] = useState<Todo[]>([]);
const addTodo = (text: string) => {
  setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
};

// 3. Обновление поля объекта
const [user, setUser] = useState<User>({ name: '', age: 0 });
const updateName = (name: string) => {
  setUser(prev => ({ ...prev, name })); // не теряем age
};

// 4. Счётчик в параллельных обработчиках (промисы)
const handleMultipleRequests = async () => {
  await Promise.all([
    fetchA().then(() => setCount(prev => prev + 1)),
    fetchB().then(() => setCount(prev => prev + 1)),
    fetchC().then(() => setCount(prev => prev + 1)),
  ]);
  // count увеличится на 3, а не на 1
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое batching в React 18?** — автоматическое объединение нескольких setState в один ре-рендер; раньше — только в event handlers
- **Как функциональный апдейтор связан со stale closure?** — апдейтор не захватывает current state из замыкания; React передаёт актуальное значение из очереди
- **Когда прямое значение лучше апдейтора?** — когда новое значение не зависит от предыдущего: `setError(null)`, `setIsLoading(false)`

### Красные флаги (чего не говорить)

- «setState всегда синхронен» — React батчит обновления; чтение state сразу после setState не даст нового значения
- «Функциональный апдейтор нужен только иногда» — лучше всегда использовать для state, зависящего от предыдущего

### Связанные темы

- `013-raznica-mezhdu-sostoyaniem-state-i-propsami-props.md`
- `026-nedostatki-hukov.md`
- `030-chto-takoe-usereducer.md`
