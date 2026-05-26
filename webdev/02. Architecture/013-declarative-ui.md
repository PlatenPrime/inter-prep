# Q013. Что такое `Declarative UI`? Какие фреймворки поддерживают этот подход?

> **Источник:** [02. architecture.md](../02.%20architecture.md) · **Тема:** Architecture

---

## Короткий ответ

**Declarative UI** — подход, при котором разработчик описывает **что** должно быть отображено (в виде функции от состояния: `UI = f(state)`), а не **как** это сделать шаг за шагом. Фреймворк сам вычисляет минимальный набор DOM-изменений. Противоположность — **Imperative UI**, где вы вручную управляете DOM (`document.querySelector`, `element.style`, `element.appendChild`). Поддерживают: **React**, **Vue**, **Angular**, **Svelte**, **SwiftUI**, **Jetpack Compose**, **Flutter**.

---

## Развёрнутый ответ

### Суть и определение

```
Imperative (КАК):      Declarative (ЧТО):
"Найди кнопку,         "Кнопка disabled,
 добавь disabled,       если isLoading = true"
 поменяй текст на
 'Загрузка...',
 убери spinner при
 завершении"
```

Декларативный UI — **функциональное отображение**: при любом изменении `state` фреймворк перевычисляет виртуальное представление UI и применяет минимальный diff к реальному DOM.

### Imperative vs Declarative

```typescript
// ❌ Imperative — jQuery/Vanilla JS стиль
function handleFormSubmit() {
  const btn = document.querySelector('#submit-btn') as HTMLButtonElement;
  const spinner = document.querySelector('#spinner') as HTMLElement;
  const errorMsg = document.querySelector('#error') as HTMLElement;

  btn.disabled = true;
  btn.textContent = 'Загрузка...';
  spinner.style.display = 'block';
  errorMsg.style.display = 'none';

  fetch('/api/submit', { method: 'POST', body: formData })
    .then(() => {
      btn.textContent = 'Готово!';
      spinner.style.display = 'none';
    })
    .catch((err) => {
      btn.disabled = false;
      btn.textContent = 'Отправить';
      spinner.style.display = 'none';
      errorMsg.textContent = err.message;
      errorMsg.style.display = 'block';
    });
}
// Проблема: каждый переход состояния — ручная работа
// При росте число состояний растёт экспоненциально
```

```tsx
// ✅ Declarative — React
const SubmitForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await fetch('/api/submit', { method: 'POST' });
      setStatus('success');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Ошибка');
      setStatus('error');
    }
  };

  // Описываем ЧТО показать для каждого состояния — не КАК перейти
  return (
    <form onSubmit={handleSubmit}>
      {status === 'loading' && <Spinner />}
      {status === 'error' && <ErrorMessage text={errorMessage} />}
      <button
        type="submit"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Загрузка...' : 'Отправить'}
      </button>
    </form>
  );
};
```

### Как работает под капотом: Virtual DOM

React использует Virtual DOM (VDOM) — легковесное in-memory представление реального DOM:

```
State изменился
       │
       ▼
Новый VDOM (Virtual DOM Tree)
       │
       ▼
Diffing (reconciliation) — сравнение старого и нового VDOM
       │
       ▼
Minimal patch — применение только изменённых узлов к реальному DOM
```

```typescript
// Под капотом JSX компилируется в вызовы React.createElement
const element = <button disabled={isLoading}>Отправить</button>;
// ≡
const element = React.createElement('button', { disabled: isLoading }, 'Отправить');
// Результат — объект { type: 'button', props: { disabled: false }, children: [...] }
```

### Фреймворки с Declarative UI

| Фреймворк | Платформа | Подход к обновлению DOM |
|-----------|-----------|------------------------|
| **React** | Web, Native | Virtual DOM + Reconciliation |
| **Vue 3** | Web | Virtual DOM + Proxy-реактивность |
| **Svelte** | Web | Компиляция → нет VDOM, прямые DOM-изменения |
| **Angular** | Web | Zone.js + Change Detection Tree |
| **SwiftUI** | iOS/macOS | Diffable Data Source + View tree |
| **Jetpack Compose** | Android | Recomposition (skip unchanged) |
| **Flutter** | Cross-platform | Widget tree + Skia рендеринг |
| **SolidJS** | Web | Fine-grained reactivity (нет VDOM) |

### Svelte vs React — разные реализации Declarative UI

```svelte
<!-- Svelte — компилятор генерирует императивный код, но пишешь декларативно -->
<script>
  let count = 0;
  // Компилятор Svelte превращает это в:
  // count = 1; $$invalidate('count', count); // нет VDOM
</script>

<button on:click={() => count++}>
  Нажато {count} раз
</button>
```

```tsx
// React — VDOM-подход
const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Нажато {count} раз</button>;
};
```

### Преимущества Declarative UI

```typescript
// 1. Предсказуемость — UI детерминирован: один state = один UI
// При баге легко воспроизвести: передай тот же state → тот же UI

// 2. Composability — декларативные компоненты легко комбинировать
const ProductCard: React.FC<{ product: Product; isInCart: boolean }> = ({ product, isInCart }) => (
  <Card>
    <ProductImage src={product.imageUrl} alt={product.name} />
    <ProductInfo product={product} />
    <AddToCartButton productId={product.id} isInCart={isInCart} />
  </Card>
);

// 3. Тестируемость — компонент = функция от пропсов
it('показывает "В корзине" если isInCart = true', () => {
  render(<AddToCartButton productId="1" isInCart={true} />);
  expect(screen.getByText('В корзине')).toBeInTheDocument();
});
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему Declarative UI проще для поддержки?** — нет «лишних» DOM-изменений вручную; все состояния явны; сложность растёт линейно, не экспоненциально.
- **Virtual DOM — это всегда быстро?** — нет; overhead на diffing. Svelte/SolidJS быстрее при гранулярных изменениях, React лучше при сложных деревьях с батчингом.
- **Как React решает проблему лишних перерисовок?** — `React.memo`, `useMemo`, `useCallback`, `key` prop, Concurrent Mode.
- **Declarative UI и Immutability — связь?** — для корректного diffing React требует immutable updates; мутация объекта не триггерит re-render.

### Красные флаги (чего не говорить)

- «Virtual DOM всегда быстрее реального DOM» — это неправда; VDOM оптимален для частых обновлений большого дерева, но имеет overhead.
- «Declarative UI = React» — SwiftUI, Compose, Flutter, Vue, Svelte — всё это Declarative UI с разными механизмами.
- «Императивный DOM-доступ запрещён в React» — `useRef` и `imperativeHandle` — легитимные escape-hatches для необходимых случаев (focus, scroll, canvas, сторонние библиотеки).

### Связанные темы

- `008-odnonapravlennyy-potok-vs-dvustoronnyaya-svyaz.md`
- `002-chto-takoe-mvvm.md` (Declarative View в MVVM)
- `009-chto-takoe-flux.md` (state → UI = f(state))
