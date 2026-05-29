# Q039. Что такое компонент-переключатель (Switching Component)?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Switching Component** — паттерн компонента, который на основе входного prop выбирает, какой из нескольких компонентов отрендерить. Это форма **условного рендеринга** с динамическим маппингом. Паттерн устраняет разветвлённые `if/else` или `switch` и делает добавление новых вариантов декларативным.

---

## Развёрнутый ответ

### Суть и определение

Вместо серии условных проверок компонент использует **объект-маппинг** (словарь) для выбора нужного компонента по ключу. Это похоже на `switch` statement, но декларативно и расширяемо.

### Как это работает

**Без паттерна (проблема):**
```tsx
// ❌ Разветвлённый if/else — тяжело расширять
const Icon: React.FC<{ type: string }> = ({ type }) => {
  if (type === 'arrow') return <ArrowIcon />;
  if (type === 'check') return <CheckIcon />;
  if (type === 'cross') return <CrossIcon />;
  if (type === 'star') return <StarIcon />;
  return null;
};
```

**С паттерном Switching Component:**
```tsx
// ✅ Маппинг вариантов
const iconMap: Record<string, React.ComponentType<IconBaseProps>> = {
  arrow: ArrowIcon,
  check: CheckIcon,
  cross: CrossIcon,
  star: StarIcon,
};

interface IconProps extends IconBaseProps {
  type: keyof typeof iconMap;
}

const Icon: React.FC<IconProps> = ({ type, ...props }) => {
  const IconComponent = iconMap[type];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};
```

### Расширенный пример с TypeScript

```tsx
// Определяем все возможные варианты через union type
type PageVariant = 'home' | 'about' | 'contact' | 'dashboard';

const pageComponents: Record<PageVariant, React.ComponentType> = {
  home: HomePage,
  about: AboutPage,
  contact: ContactPage,
  dashboard: DashboardPage,
};

interface PageSwitcherProps {
  page: PageVariant;
  fallback?: React.ReactNode;
}

const PageSwitcher: React.FC<PageSwitcherProps> = ({ page, fallback = <NotFound /> }) => {
  const PageComponent = pageComponents[page];
  return PageComponent ? <PageComponent /> : <>{fallback}</>;
};

// Использование
<PageSwitcher page="home" />
<PageSwitcher page="dashboard" fallback={<Redirect to="/login" />} />
```

### Переключатель с props

```tsx
// Переключатель передаёт props в дочерний компонент
type AlertType = 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
}

const alertComponents: Record<AlertType, React.FC<Omit<AlertProps, 'type'>>> = {
  success: SuccessAlert,
  warning: WarningAlert,
  error: ErrorAlert,
  info: InfoAlert,
};

const Alert: React.FC<AlertProps> = ({ type, ...props }) => {
  const AlertComponent = alertComponents[type];
  return AlertComponent ? <AlertComponent {...props} /> : null;
};
```

### Практика и применение

- **Иконки** по типу/имени
- **Страницы** по роуту без React Router
- **Алёрты, тосты** по типу (success/error/warning)
- **Виджеты Dashboard** — выбор компонента виджета по конфигурации
- **Form fields** — рендер разных input-типов по типу поля (`text`, `select`, `checkbox`, `date`)

### Важные нюансы и краеугольные камни

- **TypeScript**: `Record<Variant, ComponentType>` + `keyof typeof map` — полная типизация без `any`
- **Lazy loading**: `const pageComponents = { home: React.lazy(() => import('./HomePage')) }` — динамические импорты в маппинге
- **Fallback**: всегда обрабатывайте случай отсутствующего ключа (TypeScript не спасёт от runtime-ключей из API)
- Паттерн — это форма **Strategy** (стратегия) из GoF-паттернов

### Примеры

```tsx
// Lazy loading + Suspense + Switching Component
const lazyPages: Record<string, React.LazyExoticComponent<React.FC>> = {
  home: React.lazy(() => import('./pages/Home')),
  about: React.lazy(() => import('./pages/About')),
  contact: React.lazy(() => import('./pages/Contact')),
};

const Router: React.FC<{ currentPage: string }> = ({ currentPage }) => {
  const Page = lazyPages[currentPage];

  if (!Page) return <NotFound />;

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Page />
    </Suspense>
  );
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем лучше if/else?** — декларативно, легко расширять (добавить пару ключ-компонент), нет risk забыть ветку
- **Как типизировать маппинг в TypeScript?** — `Record<VariantType, React.ComponentType<Props>>`; keyof обеспечивает безопасность ключей
- **Как добавить lazy loading?** — компоненты в маппинге оборачиваются в `React.lazy()`; Suspense — на уровне Switching Component

### Красные флаги (чего не говорить)

- «Это то же самое что switch statement» — объектный маппинг декларативен, расширяем, типизируем, поддерживает lazy loading
- «Паттерн только для страниц» — работает для иконок, алёртов, форм, виджетов — любой набор вариантов

### Связанные темы

- `040-chto-takoe-uslovnyj-rendering-conditional-rendering-kak-ego-vypolnit.md`
- `050-chto-takoe-lenivaya-lazy-funkciya.md`
- `051-kak-ispolzovat-react-lazy-i-react-suspense-dlya-zapuska-koda-prilozheniya.md`
