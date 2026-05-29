# Q030. Что такое `useReducer()`?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

`useReducer` — хук для управления сложным state через паттерн Redux-подобного редьюсера: функция `(state, action) => newState`. Возвращает текущий state и `dispatch` для отправки actions. Предпочтительнее `useState`, когда state имеет сложную структуру, несколько связанных полей или следующее состояние зависит от предыдущего.

---

## Развёрнутый ответ

### Суть и определение

`useReducer<State, Action>(reducer, initialState)` — альтернатива `useState` для сложных состояний. Идея из паттерна **Flux/Redux**: состояние обновляется только через dispatch action → reducer вычисляет новое состояние.

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

### Как это работает

```tsx
// Типы
interface CounterState {
  count: number;
  step: number;
}

type CounterAction =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'setStep'; payload: number };

// Редьюсер — чистая функция
const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'reset':
      return { ...state, count: 0 };
    case 'setStep':
      return { ...state, step: action.payload };
    default:
      return state;
  }
};

// Использование
const Counter: React.FC = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, step: 1 });

  return (
    <div>
      <p>Count: {state.count} (step: {state.step})</p>
      <button onClick={() => dispatch({ type: 'decrement' })}>−</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <input
        type="number"
        value={state.step}
        onChange={e => dispatch({ type: 'setStep', payload: Number(e.target.value) })}
      />
    </div>
  );
};
```

### Когда useState → useReducer

| Сценарий | useState | useReducer |
|----------|----------|------------|
| Простое булевое/число | ✅ | Излишне |
| 2–3 независимых поля | ✅ | Можно |
| Связанные поля | Проблематично | ✅ |
| Сложная логика переходов | Нечитаемо | ✅ |
| Нужны тесты редьюсера | Сложно | ✅ (pure function) |
| Нужен history/undo | Нельзя | ✅ |

### Практика и применение

```tsx
// Реальный сценарий: форма с несколькими полями
interface FormState {
  name: string;
  email: string;
  isSubmitting: boolean;
  error: string | null;
}

type FormAction =
  | { type: 'setField'; field: keyof Pick<FormState, 'name' | 'email'>; value: string }
  | { type: 'submit' }
  | { type: 'submitSuccess' }
  | { type: 'submitError'; error: string };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'setField':
      return { ...state, [action.field]: action.value, error: null };
    case 'submit':
      return { ...state, isSubmitting: true, error: null };
    case 'submitSuccess':
      return { ...state, isSubmitting: false };
    case 'submitError':
      return { ...state, isSubmitting: false, error: action.error };
    default:
      return state;
  }
};
```

**useReducer + Context = легковесный Redux:**
```tsx
const FormContext = React.createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
} | null>(null);
```

### Важные нюансы и краеугольные камни

- Редьюсер — **чистая функция**: нет side effects, нет async; мутации state → новый объект
- `dispatch` — **стабильная ссылка** (React гарантирует), не нужно в deps useEffect/useCallback
- Lazy initialization: `useReducer(reducer, initialArg, init)` — третий аргумент `init(initialArg)` вычисляется один раз
- React batches dispatch-вызовы (как setState) в React 18

### Примеры

```tsx
// Lazy initialization
const initState = (initialCount: number): CounterState => ({
  count: initialCount,
  step: 1,
});

const [state, dispatch] = useReducer(counterReducer, 10, initState);
// initState(10) вызовется один раз при монтировании

// Undo/Redo паттерн
interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

type HistoryAction<T> =
  | { type: 'update'; payload: T }
  | { type: 'undo' }
  | { type: 'redo' };
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница useReducer и Redux?** — useReducer — локальный для компонента; Redux — глобальный store с devtools, middleware, selectors
- **Как передать dispatch вниз без prop drilling?** — через Context; dispatch стабилен → не нужен useCallback
- **Почему редьюсер должен быть чистой функцией?** — React может вызвать его дважды (StrictMode); side effects = баг

### Красные флаги (чего не говорить)

- «useReducer мощнее useState» — у каждого своя область применения; для простых значений useState проще
- «Редьюсер можно мутировать state» — нельзя: `state.count++` без возврата нового объекта → React не увидит изменения

### Связанные темы

- `024-chto-takoe-react-huki-hooks.md`
- `013-raznica-mezhdu-sostoyaniem-state-i-propsami-props.md`
- `047-chto-takoe-kontekst-context.md`
