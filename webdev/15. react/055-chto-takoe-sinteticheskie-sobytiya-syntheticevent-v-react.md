# Q055. Что такое синтетические события (SyntheticEvent) в React?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**SyntheticEvent** — обёртка React над нативными браузерными событиями, обеспечивающая **кроссбраузерный единый API**. React нормализует события: `onChange` работает одинаково во всех браузерах, `stopPropagation()`/`preventDefault()` работают корректно. В React 17+ синтетические события не пулятся (pooling удалён), поэтому `e.persist()` больше не нужен.

---

## Развёрнутый ответ

### Суть и определение

Когда пользователь кликает на кнопку, браузер создаёт нативное событие (`MouseEvent`). React перехватывает его на уровне root-контейнера (event delegation) и создаёт `SyntheticEvent` — объект с тем же интерфейсом, но кроссбраузерно нормализованным.

### Как это работает

**Event Delegation:**
```
Пользователь кликает → браузерное событие всплывает до root
React обрабатывает на уровне root → создаёт SyntheticEvent → вызывает нужные handlers
```

До React 17: делегирование на `document`
React 17+: делегирование на React root (`#root`) — улучшает совместимость с несколькими React-приложениями

### Интерфейс SyntheticEvent

```tsx
interface SyntheticEvent<T = Element, E = Event> {
  bubbles: boolean;
  cancelable: boolean;
  currentTarget: EventTarget & T;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  nativeEvent: E;          // оригинальное браузерное событие
  preventDefault(): void;
  isDefaultPrevented(): boolean;
  stopPropagation(): void;
  isPropagationStopped(): boolean;
  target: EventTarget & T;
  timeStamp: number;
  type: string;
}
```

### Использование в TypeScript

```tsx
const Form: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // предотвращает стандартную отправку формы
    console.log('Submitted');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value); // e.target типизирован как HTMLInputElement
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // предотвращает всплытие
    console.log(e.clientX, e.clientY);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitForm();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} onKeyDown={handleKeyDown} />
      <button onClick={handleClick} type="button">Click</button>
    </form>
  );
};
```

### Нативное событие

Через `e.nativeEvent` доступен оригинальный браузерный объект:

```tsx
const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
  // SyntheticEvent
  console.log(e.type); // 'click'

  // Нативное событие
  const native = e.nativeEvent;
  console.log(native instanceof MouseEvent); // true
  console.log(native.composedPath()); // полный DOM-путь события
};
```

### Удалённый Event Pooling

До React 17 синтетические события **пулились** (переиспользовались для производительности). После обработчика `event.target` становился `null`. Разработчики вынуждены были вызывать `e.persist()` для сохранения ссылки:

```tsx
// React 16 и ниже — нужен e.persist()
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setTimeout(() => {
    console.log(e.target.value); // ❌ null! (React 16)
    console.log(value);          // ✅ захвачено в замыкании
  }, 100);
};

// React 17+ — pooling удалён; e.persist() не нужен
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setTimeout(() => {
    console.log(e.target.value); // ✅ работает в React 17+
  }, 100);
};
```

### Практика и применение

- **Формы**: `onChange`, `onSubmit`, `onBlur`, `onFocus`
- **Клики**: `onClick`, `onDoubleClick`, `onContextMenu`
- **Клавиатура**: `onKeyDown`, `onKeyUp`, `onKeyPress` (deprecated)
- **Мышь**: `onMouseMove`, `onMouseEnter`, `onMouseLeave`
- **Touch**: `onTouchStart`, `onTouchEnd`, `onTouchMove`
- **Drag**: `onDragStart`, `onDrop`, `onDragOver`

### Важные нюансы и краеугольные камни

- SyntheticEvent НЕ то же самое что нативный event; некоторые методы могут работать иначе
- **Portal + SyntheticEvent**: события из Portal всплывают по React-дереву (не по DOM)
- React 17: смена делегирования с `document` на `root` — упрощает микрофронтенды

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое event delegation в React?** — все обработчики реально вешаются на root-элемент; React раздаёт их нужным компонентам
- **Почему в React 17 сменили делегирование с document на root?** — несколько React-приложений на странице; stopPropagation не «убивает» события других React app
- **Что такое e.persist() и зачем удалили pooling?** — pooling был оптимизацией, но ломал async-код; в React 17 убрали

### Красные флаги (чего не говорить)

- «SyntheticEvent — это нативное событие браузера» — обёртка с нормализацией
- «e.persist() нужен в React 18» — не нужен; pooling удалён в React 17

### Связанные темы

- `056-chto-takoe-sobytiya-ukazatelya-pointer-events.md`
- `046-chto-takoe-portal.md`
