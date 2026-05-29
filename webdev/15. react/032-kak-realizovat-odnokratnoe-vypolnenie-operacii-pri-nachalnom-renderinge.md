# Q032. Как реализовать однократное выполнение операции при начальном рендеринге?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

Используйте `useEffect(() => { /* операция */ }, [])` — пустой массив dependencies означает выполнение только при монтировании. Для операций **вне компонента** (глобальная инициализация, регистрация) — выносить на уровень модуля вне компонента. В классах — `componentDidMount()`.

---

## Развёрнутый ответ

### Суть и определение

«Однократное выполнение» — запустить код ровно один раз: при первом появлении компонента в DOM. Есть несколько уровней «однократности»:
1. При монтировании компонента — `useEffect(..., [])`
2. За всё время работы приложения — переменная на уровне модуля
3. При старте приложения — вне дерева React

### Способы реализации

**1. useEffect с пустым массивом deps (стандартный)**
```tsx
const DataComponent: React.FC<{ id: string }> = ({ id }) => {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    // Выполнится один раз при монтировании
    fetchInitialData(id).then(setData);

    // Cleanup при размонтировании
    return () => { /* отмена запросов */ };
  }, []); // ← пустые deps

  return <div>{data?.title}</div>;
};
```

**Внимание StrictMode**: в dev-режиме эффект вызывается дважды (mount → unmount → mount). В production — один раз. Cleanup должен быть корректным.

**2. useRef для флага (если нужно избежать двойного вызова в StrictMode)**
```tsx
const InitComponent: React.FC = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Выполнится ровно один раз, даже в StrictMode
    heavyInitialization();
  }, []);

  return <div>...</div>;
};
```

**3. Уровень модуля — для глобальных операций**
```tsx
// Выполняется один раз при загрузке модуля — до рендера
let analyticsInitialized = false;

const initAnalytics = () => {
  if (analyticsInitialized) return;
  analyticsInitialized = true;
  window.analytics.init({ key: process.env.REACT_APP_ANALYTICS_KEY });
};

initAnalytics(); // вне компонента

const App: React.FC = () => {
  // analytics уже инициализирован
  return <Router />;
};
```

**4. Классовый компонент — componentDidMount**
```tsx
class DataLoader extends React.Component {
  componentDidMount() {
    // Вызывается один раз после первого рендера
    this.props.loadInitialData();
  }
  render() { return <div>{this.props.data}</div>; }
}
```

### Практика и применение

- **Подписка на WebSocket** при монтировании страницы
- **Инициализация сторонних SDK** (Stripe, Google Maps, аналитика)
- **Fetch начальных данных** — но лучше через TanStack Query (кэширование, retry)
- **Event listeners** на window/document — добавить при mount, убрать при unmount

### Важные нюансы и краеугольные камни

- `useEffect(..., [])` — **не совсем** componentDidMount из-за StrictMode двойного вызова
- **Никогда не игнорируйте cleanup**: незакрытые подписки/таймеры = memory leak
- Для fetch-запросов лучше TanStack Query / SWR: они сами управляют lifecycle, дедупликацией, кэшем
- Если операция нужна для нескольких компонентов — custom hook с `useEffect`

### Примеры

```tsx
// Полный пример с правильным cleanup
const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Однократно при монтировании (или смене url)
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup — выполнится при размонтировании
    return () => {
      ws.close();
    };
  }, [url]);

  return messages;
};

// Использование
const ChatComponent: React.FC = () => {
  const messages = useWebSocket('wss://api.example.com/chat');
  return <ul>{messages.map((m, i) => <li key={i}>{m}</li>)}</ul>;
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему StrictMode вызывает эффект дважды?** — проверка корректности cleanup; в prod нет
- **Как безопасно сделать fetch при монтировании?** — AbortController для отмены при размонтировании / TanStack Query
- **Чем отличается инициализация в useEffect от уровня модуля?** — модульная инициализация одноразовая глобально; useEffect — при каждом монтировании компонента

### Красные флаги (чего не говорить)

- «StrictMode сломан» — двойной вызов намеренный для обнаружения нечистого кода
- «Можно добавить // eslint-disable и убрать deps» — отключение ESLint скрывает баги, не устраняет их

### Связанные темы

- `024-chto-takoe-react-huki-hooks.md`
- `028-raznica-mezhdu-useeffect-i-componentdidmount.md`
- `010-raznica-mezhdu-renderingom-i-montirovaniem.md`
