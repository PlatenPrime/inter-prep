# Q049. Что такое предохранители (Error Boundaries)?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Error Boundary** — классовый компонент, перехватывающий ошибки JavaScript в **render**, lifecycle-методах и конструкторах потомков, отображая fallback UI вместо краша всего приложения. Реализуется через `static getDerivedStateFromError()` (для отображения fallback) и `componentDidCatch()` (для логирования). Аналога в функциональных компонентах нет — только классы.

---

## Развёрнутый ответ

### Суть и определение

Без Error Boundaries ошибка в render любого компонента вызывает краш **всего** дерева React. Error Boundary изолирует ошибку в поддереве и показывает fallback, позволяя остальному приложению работать.

### Что перехватывает, что нет

**Перехватывает:**
- Ошибки в `render()`
- Ошибки в lifecycle-методах потомков
- Ошибки в конструкторах потомков

**НЕ перехватывает:**
- Ошибки в обработчиках событий (`onClick`) — они вне рендеринга; нужен `try/catch`
- Асинхронные ошибки (`setTimeout`, `fetch` callbacks)
- SSR ошибки
- Ошибки внутри самого Error Boundary

### Как это работает

```tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  fallback?: React.ReactNode | ((error: Error) => React.ReactNode);
  onError?: (error: Error, info: React.ErrorInfo) => void;
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Вызывается во время render phase при ошибке
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // Вызывается в commit phase — для логирования
  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    this.props.onError?.(error, info);
    console.error('ErrorBoundary caught:', error, info.componentStack);
    // Sentry.captureException(error, { extra: info });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback } = this.props;
      if (typeof fallback === 'function') {
        return fallback(this.state.error);
      }
      return fallback ?? <DefaultErrorUI error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Использование
const App: React.FC = () => (
  <ErrorBoundary
    fallback={(error) => <ErrorPage message={error.message} />}
    onError={(error, info) => Sentry.captureException(error, { extra: info })}
  >
    <Header />
    <ErrorBoundary fallback={<WidgetError />}>
      <DashboardWidgets />
    </ErrorBoundary>
    <Footer />
  </ErrorBoundary>
);
```

### Гранулярность Error Boundaries

Можно и нужно размещать несколько Error Boundaries на разных уровнях:

```tsx
// Toplevel boundary — ловит всё, что не поймано ниже
<ErrorBoundary fallback={<FullPageError />}>
  {/* Граница для виджетов — ошибка виджета не крашит весь дашборд */}
  <ErrorBoundary fallback={<WidgetPlaceholder />}>
    <ChartWidget />
  </ErrorBoundary>
  {/* Другой виджет с отдельной границей */}
  <ErrorBoundary fallback={<WidgetPlaceholder />}>
    <StatsWidget />
  </ErrorBoundary>
</ErrorBoundary>
```

### Обёртка react-error-boundary

Библиотека `react-error-boundary` предоставляет готовый `ErrorBoundary` и хук `useErrorBoundary`:

```tsx
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';

const App: React.FC = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => window.location.reload()}
    onError={(error, info) => Sentry.captureException(error)}
  >
    <App />
  </ErrorBoundary>
);

// Программный throw в функциональном компоненте
const ChildComponent: React.FC = () => {
  const { showBoundary } = useErrorBoundary();

  const handleAsyncError = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      showBoundary(error); // передаём ошибку в ближайший ErrorBoundary
    }
  };
  // ...
};
```

### Практика и применение

- **Топ-уровень приложения** — ловит непредвиденные ошибки, предотвращает белый экран
- **Виджеты на дашборде** — ошибка одного виджета не ломает остальные
- **Ленивые компоненты (lazy/Suspense)** — ошибка загрузки чанка
- **Сторонние библиотеки** — непредсказуемые ошибки от third-party кода

### Важные нюансы и краеугольные камни

- Ошибки в **event handlers** не перехватываются — нужен try/catch; `useErrorBoundary().showBoundary(error)` для передачи в boundary
- В **development** React показывает overlay с ошибкой даже при наличии ErrorBoundary — нормальное поведение; в production — только fallback
- ErrorBoundary **не может поймать ошибку в самом себе** — нужен родительский boundary

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему ErrorBoundary — только классовый компонент?** — `getDerivedStateFromError` и `componentDidCatch` — методы жизненного цикла без хук-аналогов
- **Как перехватывать ошибки в async функциях?** — `useErrorBoundary().showBoundary(error)` из react-error-boundary или паттерн с `useState`
- **Как сбросить ErrorBoundary?** — `key` prop изменить для перемонтирования, или `onReset` колбэк в react-error-boundary

### Красные флаги (чего не говорить)

- «ErrorBoundary ловит ошибки в onClick» — нет; только в render/lifecycle
- «Можно реализовать Error Boundary как функциональный компонент» — нельзя без классов (или без react-error-boundary)

### Связанные темы

- `008-raznica-mezhdu-klassovym-i-funkcionalnym-komponentami.md`
- `011-metody-zhiznennogo-cikla-komponenta-v-react.md`
- `050-chto-takoe-lenivaya-lazy-funkciya.md`
