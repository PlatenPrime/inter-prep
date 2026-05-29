# Q029. Расскажите о хуках `useCallback()`, `useMemo()`, `useImperativeHandle()`, `useLayoutEffect()`?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

`useCallback` мемоизирует функцию (стабильная ссылка между рендерами), `useMemo` — результат вычисления. `useImperativeHandle` позволяет компоненту экспортировать кастомный API через `ref` родителю. `useLayoutEffect` — синхронный аналог `useEffect`, выполняется после DOM-мутации, но до отрисовки браузером — для DOM-измерений и позиционирования.

---

## Развёрнутый ответ

### `useCallback(fn, deps)`

Возвращает **мемоизированную функцию** — ту же ссылку между рендерами, пока deps не изменились.

**Зачем**: без `useCallback` при каждом рендере родителя создаётся новая ссылка на функцию, что ломает `React.memo` в дочернем компоненте и `useEffect` deps.

```tsx
const Parent: React.FC = () => {
  const [count, setCount] = useState(0);

  // ❌ Новая функция каждый рендер → MemoChild всегда перерендеривается
  // const handleClick = () => console.log('click');

  // ✅ Стабильная ссылка → MemoChild рендерится только при изменении deps
  const handleClick = useCallback(() => {
    console.log('click', count);
  }, [count]);

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <MemoChild onClick={handleClick} />
    </>
  );
};

const MemoChild = React.memo<{ onClick: () => void }>(({ onClick }) => {
  console.log('MemoChild rendered');
  return <button onClick={onClick}>Click</button>;
});
```

### `useMemo(fn, deps)`

Возвращает **мемоизированное значение** — результат `fn()` кэшируется до изменения deps.

**Зачем**: пропустить дорогостоящие вычисления при ненужных ре-рендерах.

```tsx
const ProductList: React.FC<{ products: Product[]; minPrice: number }> = ({ products, minPrice }) => {
  // ❌ Фильтрация при каждом рендере (даже если products/minPrice не изменились)
  // const filtered = products.filter(p => p.price >= minPrice);

  // ✅ Пересчёт только при изменении products или minPrice
  const filtered = useMemo(
    () => products.filter(p => p.price >= minPrice),
    [products, minPrice]
  );

  return <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
};
```

**Когда NOT использовать**: для простых вычислений overhead useMemo больше пользы. Применять только при измеримой проблеме производительности.

### `useImperativeHandle(ref, createHandle, deps?)`

Позволяет **кастомизировать** то, что видит родитель через `ref` дочернего компонента.

```tsx
interface InputHandle {
  focus: () => void;
  clear: () => void;
  getValue: () => string;
}

const FancyInput = React.forwardRef<InputHandle, { placeholder?: string }>(
  ({ placeholder }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState('');

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => setValue(''),
      getValue: () => value,
    }), [value]);

    return (
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
      />
    );
  }
);

// Родитель использует handle
const Parent: React.FC = () => {
  const inputRef = useRef<InputHandle>(null);
  return (
    <>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
      <button onClick={() => inputRef.current?.clear()}>Clear</button>
    </>
  );
};
```

### `useLayoutEffect(fn, deps)`

Синхронный аналог `useEffect`. Выполняется **после DOM-мутации, но до отрисовки браузером**.

```tsx
const Tooltip: React.FC<{ targetRef: React.RefObject<HTMLElement>; text: string }> = ({ targetRef, text }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  // ✅ useLayoutEffect — измеряем DOM до отрисовки, чтобы избежать "мигания"
  useLayoutEffect(() => {
    if (!targetRef.current || !tooltipRef.current) return;

    const rect = targetRef.current.getBoundingClientRect();
    tooltipRef.current.style.top = `${rect.bottom + window.scrollY}px`;
    tooltipRef.current.style.left = `${rect.left + window.scrollX}px`;
  }, [targetRef]);

  return <div ref={tooltipRef} className="tooltip">{text}</div>;
};
```

**Сигнатура**: идентична `useEffect`; отличие только в тайминге.

**Когда использовать**: tooltips, dropdown позиционирование, scroll restoration — когда мигание видимо пользователю.

### Практика и применение

- `useCallback` — при передаче callback'а в `React.memo`-компонент или в deps хука
- `useMemo` — тяжёлые фильтрации/сортировки/трансформации данных
- `useImperativeHandle` — библиотеки компонентов (input, modal) с императивным API
- `useLayoutEffect` — позиционирование, анимации входа, DOM-измерения

### Важные нюансы и краеугольные камни

- `useCallback(fn, deps)` = `useMemo(() => fn, deps)` — математически эквивалентны
- Преждевременная мемоизация **всего** — антипаттерн; React 19 Compiler делает это автоматически
- `useLayoutEffect` **блокирует отрисовку** → не использовать для долгих операций; только DOM-измерения

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница useMemo и memo?** — `useMemo` кэширует значение внутри компонента; `memo` мемоизирует весь компонент целиком
- **Когда useCallback не нужен?** — если дочерний компонент не обёрнут в `React.memo` или не передаётся в deps других хуков
- **Чем useLayoutEffect опасен?** — синхронная блокировка отрисовки; если операция долгая — дёргание (jank)

### Красные флаги (чего не говорить)

- «Всегда оборачивайте функции в useCallback» — overhead создания хука + мемоизации; только при реальной нужде
- «useLayoutEffect можно использовать везде» — блокирует paint; предпочтительнее useEffect в большинстве случаев

### Связанные темы

- `024-chto-takoe-react-huki-hooks.md`
- `031-raznica-mezhdu-memo-i-usememo.md`
- `052-chto-takoe-react-ssylka-ref-kak-sozdat-ssylku.md`
