# Q052. Что такое React-ссылка (`ref`)? Как создать ссылку?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Ref** — мутабельный объект `{ current: T }`, который React сохраняет между рендерами, не вызывая ре-рендер при изменении. Используется для: прямого доступа к DOM-узлу (фокус, измерения), хранения мутабельных значений без ре-рендера, и передачи DOM-ссылок родителю через `forwardRef`. Создаётся через `useRef()` в функциональных компонентах или `createRef()` в классах.

---

## Развёрнутый ответ

### Суть и определение

React управляет DOM декларативно — разработчик описывает что показать, React обновляет DOM. Но иногда нужен **прямой** доступ к DOM: управление фокусом, воспроизведение медиа, интеграция с не-React библиотеками, измерения. Ref решает эту задачу.

### Создание ref

**Функциональный компонент: `useRef()`**
```tsx
const InputComponent: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus(); // прямой DOM-доступ
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Фокус</button>
    </>
  );
};
```

**Классовый компонент: `React.createRef()`**
```tsx
class InputComponent extends React.Component {
  private inputRef = React.createRef<HTMLInputElement>();

  focusInput = () => {
    this.inputRef.current?.focus();
  };

  render() {
    return (
      <>
        <input ref={this.inputRef} type="text" />
        <button onClick={this.focusInput}>Фокус</button>
      </>
    );
  }
}
```

**Callback ref (для сложных случаев)**
```tsx
const MeasuredBox: React.FC = () => {
  const [height, setHeight] = useState(0);

  const measuredRef = (node: HTMLDivElement | null) => {
    if (node) setHeight(node.getBoundingClientRect().height);
  };

  return (
    <div ref={measuredRef}>
      Высота: {height}px
    </div>
  );
};
```

### Передача ref дочернему компоненту: `forwardRef`

Ref нельзя передать как обычный prop (зарезервированное имя). Для пробрасывания нужен `React.forwardRef`:

```tsx
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, ...props }, ref) => (
    <label>
      {label}
      <input ref={ref} {...props} />
    </label>
  )
);

// Использование
const Form: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form>
      <CustomInput
        ref={inputRef}
        label="Email"
        type="email"
        placeholder="user@example.com"
      />
      <button type="button" onClick={() => inputRef.current?.focus()}>
        Focus Input
      </button>
    </form>
  );
};
```

### Ref как хранилище мутабельных значений

```tsx
// Ref не вызывает ре-рендер при изменении — идеален для «живых» значений
const Timer: React.FC = () => {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = () => {
    startTimeRef.current = Date.now();
    intervalRef.current = window.setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 100);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => () => stop(), []); // cleanup при размонтировании

  return (
    <div>
      <p>{(elapsed / 1000).toFixed(1)}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
};
```

### Практика и применение

- **Управление фокусом**: автофокус при открытии модала, фокус на первое поле формы
- **Медиа**: `videoRef.current.play()`, `audioRef.current.pause()`
- **Scroll**: `containerRef.current.scrollTop = 0` — прокрутка к началу
- **Анимации**: интеграция с GSAP, Lottie, Framer Motion через DOM-узел
- **Предыдущее значение**: хранить prev prop/state в ref

### Важные нюансы и краеугольные камни

- `ref.current` начальное значение — `null` (для DOM-refs); инициализируется после mount
- Изменение `ref.current` **не вызывает ре-рендер** — в отличие от setState
- `useRef` vs `createRef`: createRef — новый объект каждый рендер; useRef — стабильный объект
- TypeScript: `useRef<HTMLInputElement>(null)` → `ref.current` может быть `null` (до mount)

### Примеры

```tsx
// Паттерн: предыдущее значение через ref
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current; // возвращает значение ПРЕДЫДУЩЕГО рендера
}

const Component: React.FC<{ count: number }> = ({ count }) => {
  const prevCount = usePrevious(count);
  return <div>Было: {prevCount}, стало: {count}</div>;
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница useRef и createRef?** — useRef стабилен между рендерами; createRef создаёт новый объект каждый рендер
- **Как пробросить ref в функциональный компонент?** — `React.forwardRef` + `useImperativeHandle` для кастомного API
- **Когда использовать ref вместо state?** — когда изменение значения не должно вызывать ре-рендер (таймеры, счётчики render, флаги)

### Красные флаги (чего не говорить)

- «ref обновляет компонент» — нет; изменение ref.current не вызывает ре-рендер
- «Ref можно передать как обычный prop» — ref — зарезервированное имя; для пробрасывания нужен forwardRef

### Связанные темы

- `029-rasskazhite-o-hukah-usecallback-usememo-useimperativehandle-uselayouteffect.md`
- `008-raznica-mezhdu-klassovym-i-funkcionalnym-komponentami.md`
- `053-raznica-mezhdu-kontroliruemym-controlled-i-nekontroliruemym-uncontrolled-komponentami.md`
