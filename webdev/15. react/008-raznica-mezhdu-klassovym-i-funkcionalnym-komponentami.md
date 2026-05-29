# Q008. Разница между классовым и функциональным компонентами?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Функциональный компонент** — это обычная функция, принимающая props и возвращающая JSX; состояние и побочные эффекты реализуются через хуки. **Классовый компонент** — ES6-класс, наследующий `React.Component`, со state в конструкторе и методами жизненного цикла. С появлением хуков (React 16.8) функциональные компоненты стали предпочтительным подходом — меньше boilerplate, лучше тестируемость, нет проблем с `this`.

---

## Развёрнутый ответ

### Суть и определение

До React 16.8 функциональные компоненты были «тупыми» (stateless), а весь интерактивный код писался в классах. Хуки изменили это, дав функциям доступ к state, refs, context и lifecycle. Сегодня классовые компоненты — legacy; новый код пишется на функциональных.

### Как это работает

**Функциональный компонент:**
```tsx
const Counter: React.FC<{ initial?: number }> = ({ initial = 0 }) => {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    document.title = `Count: ${count}`;
    return () => { document.title = 'App'; };
  }, [count]);

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
};
```

**Классовый компонент (эквивалент):**
```tsx
class Counter extends React.Component<{ initial?: number }, { count: number }> {
  constructor(props: { initial?: number }) {
    super(props);
    this.state = { count: props.initial ?? 0 };
  }

  componentDidMount() {
    document.title = `Count: ${this.state.count}`;
  }

  componentDidUpdate(_: unknown, prevState: { count: number }) {
    if (prevState.count !== this.state.count) {
      document.title = `Count: ${this.state.count}`;
    }
  }

  componentWillUnmount() {
    document.title = 'App';
  }

  render() {
    return (
      <button onClick={() => this.setState(s => ({ count: s.count + 1 }))}>
        {this.state.count}
      </button>
    );
  }
}
```

### Практика и применение

- **Весь новый код** — функциональные компоненты
- **Классовые** — поддержка legacy codebases, Error Boundaries (до React 18.3 границы ошибок — только классы)
- **Тестирование** — функциональные компоненты легче тестировать: нет привязки к инстансу, нет проблем с `this`
- **Code splitting / lazy** — работает одинаково для обоих типов

### Важные нюансы и краеугольные камни

- **Проблема `this`** в классах: обработчики событий требуют явного bind или arrow-функций в полях класса
- **Замыкания** в функциональных компонентах: каждый рендер создаёт новые замыкания; классовые компоненты всегда читают актуальный `this.state`
- **Error Boundaries** — только классы (до React 18.3, потом появится `use(error)`)
- **getSnapshotBeforeUpdate, componentDidCatch** — нет аналогов в хуках (только через классы)
- Функциональные компоненты **не имеют инстанса** — `ref` к функциональному компоненту без `forwardRef`/`useImperativeHandle` вернёт null

### Примеры

```tsx
// ❌ Классовый — проблема с this
class Bad extends React.Component {
  handleClick() {
    console.log(this); // undefined без bind!
  }
  render() {
    return <button onClick={this.handleClick}>Click</button>;
  }
}

// ✅ Функциональный — нет проблемы с this
const Good: React.FC = () => {
  const handleClick = () => console.log('clicked'); // замыкание
  return <button onClick={handleClick}>Click</button>;
};
```

---

## Сравнение

| Критерий | Классовый | Функциональный |
|----------|-----------|----------------|
| Синтаксис | `class X extends React.Component` | `function X()` / arrow function |
| State | `this.state` + `this.setState` | `useState` |
| Lifecycle | Методы (`componentDidMount` и др.) | `useEffect` |
| Context | `contextType` / `<Consumer>` | `useContext` |
| Ref | `createRef` / `callback ref` | `useRef` + `forwardRef` |
| Проблема `this` | Есть | Нет |
| Error Boundaries | Поддерживает | Не поддерживает |
| Читаемость | Многословнее | Лаконичнее |
| Тестирование | Сложнее (инстанс) | Проще |
| Рекомендуется | Legacy / Error Boundaries | Новый код |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Можно ли заменить все классовые компоненты функциональными?** — почти всегда да; исключение — Error Boundaries (требуют классы)
- **Что такое «stale closure» проблема в хуках?** — обработчик захватывает старое значение state в замыкании; решается через `useRef` или функциональный апдейтор
- **Когда `useEffect` эквивалентен `componentDidMount`?** — `useEffect(() => {}, [])` — примерно, но есть различия (Strict Mode двойной вызов, async behavior)

### Красные флаги (чего не говорить)

- «Классовые компоненты устарели и сломаны» — они работают и поддерживаются, просто не рекомендуются для нового кода
- «Функциональные компоненты быстрее классовых» — разница минимальна; главное преимущество — код, а не производительность

### Связанные темы

- `011-metody-zhiznennogo-cikla-komponenta-v-react.md`
- `024-chto-takoe-react-huki-hooks.md`
- `035-chto-takoe-purecomponent.md`
- `049-chto-takoe-predokhraniteli-error-boundaries.md`
