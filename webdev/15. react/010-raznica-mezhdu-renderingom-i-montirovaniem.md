# Q010. Разница между рендерингом и монтированием?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Рендеринг (rendering)** — процесс вызова функции компонента React'ом для получения описания UI (Virtual DOM). Это происходит при каждом изменении state или props. **Монтирование (mounting)** — однократное событие: первое добавление компонента в реальный DOM. Компонент может рендериться множество раз, но монтируется только один раз за своё «время жизни».

---

## Развёрнутый ответ

### Суть и определение

**Рендеринг** — это когда React вызывает функцию компонента (`() => JSX`) или метод `render()` класса. Результат — дерево React-элементов (Virtual DOM). React использует этот результат для сравнения с предыдущим (diffing) и определения изменений в реальном DOM. Рендеринг **не изменяет DOM** сам по себе.

**Монтирование** — когда React впервые берёт результат рендеринга и добавляет DOM-узлы в документ. Это происходит ровно один раз за жизнь компонента в дереве. Обратный процесс — **размонтирование (unmounting)** — удаление из DOM.

### Как это работает

```
mount:
  render → reconcile → commit (DOM insert) → useEffect/componentDidMount

re-render (при setState):
  render → reconcile → commit (DOM patch) → useEffect (cleanup + run)

unmount:
  useEffect cleanup → componentWillUnmount → DOM remove
```

**Жизненный цикл:**
1. **Mount**: первый render → commit в DOM → `componentDidMount` / `useEffect(fn, [])`
2. **Update**: state/props изменились → render → diff → patch DOM → `componentDidUpdate` / `useEffect(fn, [deps])`
3. **Unmount**: компонент убирается из дерева → `componentWillUnmount` / `useEffect` cleanup

### Практика и применение

- Логику, которую нужно выполнить **один раз при появлении** (fetch данных, подписка на WebSocket) — в `useEffect(() => {}, [])`
- Логику при каждом рендере избегают в теле компонента вне хуков (побочные эффекты в render = баг)
- **React Strict Mode** (dev) намеренно монтирует→размонтирует→монтирует компонент снова — для поиска проблем с cleanup

### Важные нюансы и краеугольные камни

- **Render != DOM update**: React может вызвать компонент (render), но не делать никаких DOM-изменений, если Virtual DOM совпал
- **Mounting != render**: mount включает render + commit; можно рендериться много раз без повторного монтирования
- **StrictMode в dev** вызывает `useEffect` дважды (mount → unmount → mount) — это норма; cleanup должен быть чистым
- Перемонтирование происходит при изменении `key` — React считает компонент новым

### Примеры

```tsx
const DataWidget: React.FC<{ id: string }> = ({ id }) => {
  const [data, setData] = useState<string | null>(null);

  // Выполняется при МОНТИРОВАНИИ (и при изменении id)
  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/data/${id}`, { signal: controller.signal })
      .then(r => r.json())
      .then(setData);

    // Cleanup при РАЗМОНТИРОВАНИИ или перед следующим эффектом
    return () => controller.abort();
  }, [id]);

  // РЕНДЕРИНГ происходит при каждом изменении data
  console.log('render'); // может выводиться много раз

  return <div>{data ?? 'Загрузка...'}</div>;
};

// Принудительное перемонтирование через key
// При смене userId компонент размонтируется и монтируется заново (сбрасывает state)
<DataWidget key={userId} id={userId} />
```

---

## Сравнение

| Критерий | Рендеринг (Rendering) | Монтирование (Mounting) |
|----------|-----------------------|-------------------------|
| Что происходит | Вызов функции компонента | Вставка DOM-узлов в документ |
| Сколько раз | Многократно | Один раз за жизнь |
| Изменяет DOM | Нет (только Virtual DOM) | Да (commit фаза) |
| Хук-аналог | Тело компонента | `useEffect(() => {}, [])` |
| Триггер | state / props изменение | Первое появление в дереве |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое commit-фаза?** — этап, когда React применяет вычисленный diff к реальному DOM
- **Когда компонент ре-монтируется?** — при изменении `key`, при перемещении в другую ветку условного рендеринга
- **Почему StrictMode вызывает двойной mount?** — чтобы убедиться, что cleanup в useEffect корректный

### Красные флаги (чего не говорить)

- «Каждый рендер — это монтирование» — монтирование только при первом появлении в DOM
- «Рендеринг обновляет DOM» — render создаёт Virtual DOM, DOM обновляется только в commit-фазе после diff

### Связанные темы

- `011-metody-zhiznennogo-cikla-komponenta-v-react.md`
- `012-stadii-zhiznennogo-cikla-komponenta-v-react.md`
- `021-chto-takoe-react-reconciliation.md`
- `028-raznica-mezhdu-useeffect-i-componentdidmount.md`
