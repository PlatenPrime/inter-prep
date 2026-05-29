# Q036. Что такое Компонент высшего порядка (Higher-Order Component/HOC)?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**HOC (Higher-Order Component)** — функция, принимающая компонент и возвращающая новый компонент с дополнительными возможностями. Это паттерн переиспользования логики компонентов, основанный на принципе функций высшего порядка. В современном React заменяется custom hooks, но всё ещё используется для cross-cutting concerns (аутентификация, логирование, Error Boundaries).

---

## Развёрнутый ответ

### Суть и определение

HOC — это паттерн, а не часть React API. Суть: `const EnhancedComponent = hoc(OriginalComponent)`. HOC добавляет поведение, не изменяя исходный компонент (принцип открытости/закрытости).

### Как это работает

```tsx
// Базовый шаблон HOC
function withLogger<P extends object>(WrappedComponent: React.ComponentType<P>) {
  // Компонент-обёртка
  const WithLogger: React.FC<P> = (props) => {
    useEffect(() => {
      console.log(`${WrappedComponent.displayName || WrappedComponent.name} mounted`);
      return () => console.log(`${WrappedComponent.displayName || WrappedComponent.name} unmounted`);
    }, []);

    return <WrappedComponent {...props} />;
  };

  WithLogger.displayName = `WithLogger(${WrappedComponent.displayName || WrappedComponent.name})`;
  return WithLogger;
}

// Использование
const UserCardWithLogger = withLogger(UserCard);
```

### Реальный пример: HOC авторизации

```tsx
interface WithAuthProps {
  redirectTo?: string;
}

function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  const WithAuth: React.FC<P & WithAuthProps> = ({ redirectTo = '/login', ...props }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <Spinner />;
    if (!user) return <Navigate to={redirectTo} replace />;

    return <WrappedComponent {...(props as P)} />;
  };

  WithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  return WithAuth;
}

// Использование
const ProtectedProfile = withAuth(UserProfile);
const AdminPanel = withAuth(AdminDashboard);
```

### Типичные применения HOC

- `connect(mapState, mapDispatch)(Component)` — Redux
- `withRouter(Component)` — React Router v4/v5
- `React.memo(Component)` — мемоизация
- `withTheme`, `withTranslation` (react-i18next), `withErrorBoundary`

### HOC vs Custom Hook

```tsx
// HOC: логика вокруг рендеринга компонента
const ProtectedProfile = withAuth(UserProfile); // обёртка

// Custom Hook: логика внутри компонента
const UserProfile: React.FC = () => {
  const { user, isLoading } = useAuth(); // хук
  if (!user) return null;
  return <div>{user.name}</div>;
};
```

### Практика и применение

- **HOC предпочтительнее** когда: нужна обёртка (Error Boundary, Protected Route), поведение должно быть прозрачным для дочернего компонента
- **Custom hooks предпочтительнее** когда: нужно переиспользовать логику с состоянием без изменения дерева компонентов

### Важные нюансы и краеугольные камни

- **Props collision**: HOC и WrappedComponent могут иметь одинаковые имена props — нужно явно разделять
- **displayName**: обязательно устанавливать для React DevTools читаемости
- **Не применять HOC внутри render**: создаёт новый тип компонента каждый рендер → перемонтирование
- **Forwarding refs**: HOC должен использовать `React.forwardRef` если нужно пробросить ref в WrappedComponent
- **HOC composing**: несколько HOC создают «wrapper hell»; compose(hoc1, hoc2, hoc3)(Comp) — паттерн

### Примеры

```tsx
// HOC с forwardRef
function withTooltip<P extends object>(WrappedComponent: React.ComponentType<P>) {
  const WithTooltip = React.forwardRef<HTMLElement, P & { tooltip: string }>(
    ({ tooltip, ...props }, ref) => (
      <div className="tooltip-wrapper" title={tooltip}>
        <WrappedComponent {...(props as P)} ref={ref} />
      </div>
    )
  );
  WithTooltip.displayName = `WithTooltip(${WrappedComponent.displayName || WrappedComponent.name})`;
  return WithTooltip;
}

// Composing HOCs
import { compose } from 'redux'; // или own compose utility
const EnhancedComponent = compose(
  withAuth,
  withLogger,
  withErrorBoundary,
)(UserProfile);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему HOC устарел в пользу hooks?** — hooks не добавляют уровни в дерево, проще тестируются, нет props collision
- **Когда всё ещё нужен HOC?** — Error Boundaries (только классы), некоторые библиотечные паттерны, Protected Route
- **Что такое «HOC factory»?** — HOC, принимающий конфигурацию и возвращающий HOC: `withFeatureFlag('beta')(Component)`

### Красные флаги (чего не говорить)

- «HOC — устаревший паттерн, не нужен» — React.memo, connect (Redux), Error Boundary wrappers — активно используются
- «HOC изменяет исходный компонент» — хороший HOC возвращает новый компонент, исходный не трогает

### Связанные темы

- `009-raznica-mezhdu-komponentom-i-kontejnerom.md`
- `024-chto-takoe-react-huki-hooks.md`
- `037-chto-takoe-inversiya-nasledovaniya-inheritance-inversion.md`
