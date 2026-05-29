# Q028. Разница между `useEffect()` и `componentDidMount()`?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

`componentDidMount()` вызывается **один раз** после первого монтирования компонента в DOM. `useEffect(() => {}, [])` — ближайший аналог, но есть важные отличия: выполняется **асинхронно** после отрисовки браузером (CDM — синхронно), в Strict Mode вызывается **дважды** (mount → unmount → mount), и функционально охватывает сразу несколько lifecycle-методов в зависимости от deps.

---

## Развёрнутый ответ

### Суть и определение

`componentDidMount` — метод классового компонента: вызывается ровно один раз сразу после первой вставки в DOM, до следующего цикла рендеринга браузера.

`useEffect` — хук, параметр `deps` определяет поведение:
- `useEffect(fn)` — после каждого рендера
- `useEffect(fn, [])` — только при монтировании (аналог CDM)
- `useEffect(fn, [dep])` — при монтировании и при изменении dep
- Возвращаемая функция — cleanup (аналог componentWillUnmount)

### Ключевые различия

| Аспект | `componentDidMount` | `useEffect(() => {}, [])` |
|--------|---------------------|---------------------------|
| Тайминг | Синхронно после mount, до paint | Асинхронно после paint |
| Вызовов | Один раз | Один раз (в prod); дважды в StrictMode dev |
| Cleanup | `componentWillUnmount` | Возвращаемая функция |
| Обновление deps | Нет | Повторный запуск при изменении deps |
| Async | Нельзя напрямую | Нельзя напрямую (но IIFE) |

### Тайминг: важная разница

```
componentDidMount:
render → [commit: DOM] → componentDidMount → браузер отрисовывает

useEffect(fn, []):
render → [commit: DOM] → браузер отрисовывает → useEffect callback
```

Для операций, требующих DOM-измерений ДО отрисовки, нужен `useLayoutEffect` (ведёт себя как CDM по таймингу).

### Strict Mode двойной вызов

В dev-режиме с `<React.StrictMode>` React намеренно:
1. Монтирует компонент
2. Вызывает cleanup (как при размонтировании)
3. Монтирует снова

Это проверка корректности cleanup. Если cleanup написан правильно — приложение работает нормально.

```tsx
// ✅ Корректный cleanup — Strict Mode не ломает логику
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(e => { if (e.name !== 'AbortError') console.error(e); });

  return () => controller.abort(); // cleanup отменяет запрос
}, []);
```

### Практика и применение

```tsx
// Аналог componentDidMount:
useEffect(() => {
  fetchInitialData();
  subscribeToUpdates();

  return () => { // аналог componentWillUnmount
    unsubscribeFromUpdates();
  };
}, []); // пустые deps = при монтировании

// componentDidMount + componentDidUpdate (при смене id):
useEffect(() => {
  loadUserData(userId);
}, [userId]); // запуск при mount и при каждом изменении userId
```

### Важные нюансы и краеугольные камни

- **`useLayoutEffect(() => {}, [])`** — ближайший аналог CDM по таймингу (синхронный); блокирует отрисовку → использовать только когда необходимо
- **async/await** нельзя передать напрямую: `useEffect(async () => {})` — работает, но возвращает Promise вместо cleanup; используйте IIFE или внутреннюю async функцию
- CDM и `useEffect(fn, [])` эквивалентны по поведению только вне StrictMode в prod

### Примеры

```tsx
// Async в useEffect — правильно
useEffect(() => {
  const loadData = async () => {
    try {
      const data = await fetchData(id);
      setData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  loadData();
  // или IIFE:
  // (async () => { ... })();
}, [id]);

// useLayoutEffect когда нужен синхронный тайминг
useLayoutEffect(() => {
  // Измерить DOM перед отрисовкой
  const rect = ref.current?.getBoundingClientRect();
  if (rect) setPosition({ top: rect.top, left: rect.left });
}, []);
```

---

## Сравнение

| Критерий | `componentDidMount` | `useEffect(fn, [])` | `useLayoutEffect(fn, [])` |
|----------|---------------------|---------------------|---------------------------|
| Тайминг | После commit, до paint | После paint | После commit, до paint |
| Блокирует paint | Да | Нет | Да |
| StrictMode | 1 вызов | 2 вызова (с cleanup) | 2 вызова |
| Cleanup | `componentWillUnmount` | return функция | return функция |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда useLayoutEffect вместо useEffect?** — DOM-измерения, анимации, tooltips — когда нужен синхронный доступ к DOM до paint
- **Почему StrictMode вызывает двойной эффект?** — тест на правильность cleanup; в prod — один вызов
- **Можно ли сделать useEffect async?** — нельзя напрямую (Promise как cleanup — ошибка); нужна вложенная async-функция

### Красные флаги (чего не говорить)

- «useEffect(() => {}, []) — полный аналог componentDidMount» — тайминг и StrictMode поведение отличаются
- «useLayoutEffect можно использовать везде вместо useEffect» — блокирует отрисовку; только для DOM-измерений

### Связанные темы

- `011-metody-zhiznennogo-cikla-komponenta-v-react.md`
- `024-chto-takoe-react-huki-hooks.md`
- `029-rasskazhite-o-hukah-usecallback-usememo-useimperativehandle-uselayouteffect.md`
