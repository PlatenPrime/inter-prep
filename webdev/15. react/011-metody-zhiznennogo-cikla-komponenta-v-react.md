# Q011. Методы жизненного цикла компонента в React?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

Методы жизненного цикла — это методы классовых компонентов, вызываемые React в определённые моменты: монтирование, обновление, размонтирование. Ключевые: `constructor`, `render`, `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`. В функциональных компонентах они заменяются хуком `useEffect` с разными комбинациями зависимостей.

---

## Развёрнутый ответ

### Суть и определение

Методы жизненного цикла делятся на три фазы: **mounting** (создание), **updating** (обновление), **unmounting** (удаление). Дополнительно — методы обработки ошибок (error handling).

### Как это работает

**Mounting (монтирование):**

| Метод | Описание |
|-------|----------|
| `constructor(props)` | Инициализация state, bind методов |
| `static getDerivedStateFromProps(props, state)` | Обновление state на основе props перед render |
| `render()` | Обязательный; возвращает JSX / null |
| `componentDidMount()` | Компонент в DOM; запросы, подписки, таймеры |

**Updating (обновление — при изменении props/state):**

| Метод | Описание |
|-------|----------|
| `static getDerivedStateFromProps` | Снова перед render |
| `shouldComponentUpdate(nextProps, nextState)` | Оптимизация: можно вернуть `false` для пропуска рендера |
| `render()` | Перерендер |
| `getSnapshotBeforeUpdate(prevProps, prevState)` | Захват DOM-состояния до обновления (напр. позиция скролла) |
| `componentDidUpdate(prevProps, prevState, snapshot)` | После обновления DOM; условные side-effects |

**Unmounting (размонтирование):**

| Метод | Описание |
|-------|----------|
| `componentWillUnmount()` | Очистка подписок, таймеров, запросов |

**Error handling:**

| Метод | Описание |
|-------|----------|
| `static getDerivedStateFromError(error)` | Обновить state при ошибке потомка |
| `componentDidCatch(error, info)` | Логирование ошибки |

### Практика и применение

```tsx
class DataComponent extends React.Component<{ id: string }, { data: string | null }> {
  private abortController = new AbortController();

  constructor(props: { id: string }) {
    super(props);
    this.state = { data: null };
  }

  async componentDidMount() {
    const res = await fetch(`/api/${this.props.id}`, {
      signal: this.abortController.signal
    });
    const data = await res.json();
    this.setState({ data });
  }

  componentDidUpdate(prevProps: { id: string }) {
    if (prevProps.id !== this.props.id) {
      // id изменился — перезапросить данные
      this.abortController.abort();
      this.abortController = new AbortController();
      this.componentDidMount();
    }
  }

  componentWillUnmount() {
    this.abortController.abort(); // отмена запроса при размонтировании
  }

  render() {
    return <div>{this.state.data ?? 'Загрузка...'}</div>;
  }
}
```

**Функциональный эквивалент:**
```tsx
const DataComponent: React.FC<{ id: string }> = ({ id }) => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/${id}`, { signal: controller.signal })
      .then(r => r.json())
      .then(setData);
    return () => controller.abort(); // componentWillUnmount + cleanup при смене id
  }, [id]);

  return <div>{data ?? 'Загрузка...'}</div>;
};
```

### Важные нюансы и краеугольные камни

- `componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate` — **устаревшие** (deprecated в 16.3, удалены в 18+); использовались неправильно и вызывали баги
- `getDerivedStateFromProps` — статический метод, нет доступа к `this`; антипаттерн в большинстве случаев
- `getSnapshotBeforeUpdate` — единственный метод без хук-эквивалента (кроме `useLayoutEffect` + ref)
- В Strict Mode (`<React.StrictMode>`) методы жизненного цикла вызываются дважды в dev для выявления side-effect'ов

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Какой порядок вызова методов при монтировании?** — `constructor → getDerivedStateFromProps → render → (DOM commit) → componentDidMount`
- **Чем getDerivedStateFromProps отличается от componentWillReceiveProps?** — статический, синхронный, нет this; без побочных эффектов
- **Зачем нужен getSnapshotBeforeUpdate?** — захват позиции скролла до обновления DOM, передача в componentDidUpdate

### Красные флаги (чего не говорить)

- «componentWillMount — хорошее место для fetch» — устарел, вызывался в Strict Mode дважды, приводил к race condition
- «componentDidMount вызывается перед render» — нет, строго после первого render и commit

### Связанные темы

- `012-stadii-zhiznennogo-cikla-komponenta-v-react.md`
- `028-raznica-mezhdu-useeffect-i-componentdidmount.md`
- `034-chto-delaet-metod-shouldcomponentupdate.md`
- `049-chto-takoe-predokhraniteli-error-boundaries.md`
