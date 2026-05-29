# Q051. Как использовать `React.lazy` и `React.Suspense` для запуска кода приложения?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

`React.lazy(() => import('./Component'))` создаёт ленивый компонент, загружаемый отдельным JS-чанком. `<Suspense fallback={<Spinner />}>` оборачивает ленивый компонент и показывает fallback пока чанк загружается. Вместе они реализуют **code splitting** на уровне компонентов — основной паттерн для уменьшения initial bundle size.

---

## Развёрнутый ответ

### Суть и определение

`React.lazy` + `Suspense` — декларативный API для разбивки кода приложения на чанки с обработкой состояния загрузки. Работает через механизм Suspense: ленивый компонент бросает Promise при первом рендере, Suspense перехватывает его и показывает fallback.

### Пошаговая реализация

**Шаг 1: Создание ленивого компонента**
```tsx
// ✅ Обычный компонент с default export
// pages/Dashboard.tsx
const Dashboard: React.FC = () => <div>Dashboard Content</div>;
export default Dashboard;

// В App.tsx:
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
```

**Шаг 2: Обёртка в Suspense**
```tsx
import { Suspense } from 'react';

const App: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Dashboard />
  </Suspense>
);
```

**Шаг 3: Добавление Error Boundary (production-готовность)**
```tsx
const App: React.FC = () => (
  <ErrorBoundary
    fallback={<div>Не удалось загрузить раздел. <button onClick={() => window.location.reload()}>Перезагрузить</button></div>}
  >
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard />
    </Suspense>
  </ErrorBoundary>
);
```

### Роутинг-based code splitting

Самый распространённый паттерн — lazy-loading по маршрутам:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Каждая страница — отдельный чанк
const HomePage = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/About'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const ProfilePage = lazy(() => import('./pages/Profile'));

// Skeleton для загрузки страниц
const PageSkeleton: React.FC = () => (
  <div className="skeleton">
    <div className="skeleton-header" />
    <div className="skeleton-content" />
  </div>
);

const Router: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
```

### Несколько уровней Suspense

```tsx
// Иерархия fallback'ов
const App: React.FC = () => (
  // Топ-уровень: skeleton всего приложения
  <Suspense fallback={<AppSkeleton />}>
    <Router>
      <Layout>
        {/* Секция sidebar загружается отдельно */}
        <Suspense fallback={<SidebarSkeleton />}>
          <LazySidebar />
        </Suspense>

        {/* Основной контент */}
        <Suspense fallback={<ContentSkeleton />}>
          <Routes>{/* ...routes */}</Routes>
        </Suspense>
      </Layout>
    </Router>
  </Suspense>
);
```

### Suspense для Data Fetching (React 18+)

Suspense работает не только с lazy, но и с data fetching через специальные библиотеки:

```tsx
// TanStack Query поддерживает Suspense
const UserProfile: React.FC<{ id: string }> = ({ id }) => {
  const { data } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    suspense: true, // TanStack Query бросает Promise при загрузке
  });

  return <div>{data.name}</div>; // data всегда defined здесь
};

// Оборачиваем в Suspense
<Suspense fallback={<UserSkeleton />}>
  <UserProfile id="123" />
</Suspense>
```

### Практика и применение

- **Маршруты** — базовый паттерн: каждая страница в своём чанке
- **Тяжёлые библиотеки** — редактор кода, PDF-viewer, графики: загружать только при открытии модала
- **Admin/dashboard sections** — функции доступные не всем пользователям
- **Модальные окна** — тяжёлые формы с редкими открытиями

### Важные нюансы и краеугольные камни

- `React.lazy` работает только с **default exports**
- **Suspense fallback** — это то, что показывается **пока загружается** чанк (не ошибка!)
- **Error Boundary** — нужен для ошибок загрузки (нет сети, 404 чанка)
- В **Next.js** для SSR использовать `next/dynamic` вместо `React.lazy`
- **Webpack Magic Comments**: `import(/* webpackChunkName: "dashboard" */ './Dashboard')` — именование чанков

### Примеры

```tsx
// Named chunks + preloading
const AdminPanel = React.lazy(() =>
  import(/* webpackChunkName: "admin" */ './AdminPanel')
);

// Preload по hover — пользователь видит быструю загрузку
const preloadAdminPanel = () => import('./AdminPanel');

const NavMenu: React.FC = () => (
  <Link
    to="/admin"
    onMouseEnter={preloadAdminPanel}  // начинаем загрузку заранее
  >
    Админ-панель
  </Link>
);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как делать code splitting без React.lazy?** — динамический `import()` напрямую, с ручным управлением состоянием загрузки
- **Что такое Suspense boundaries?** — каждый `<Suspense>` — граница, которая показывает свой fallback при ожидании любого потомка
- **Как Next.js реализует lazy loading?** — `next/dynamic` с SSR-поддержкой: `const Comp = dynamic(() => import('./Comp'), { ssr: false })`

### Красные флаги (чего не говорить)

- «Suspense — только для lazy компонентов» — с React 18+ работает и для data fetching через совместимые библиотеки
- «Можно обойтись без ErrorBoundary для lazy» — в production ошибка загрузки чанка = пустой экран; ErrorBoundary обязателен

### Связанные темы

- `050-chto-takoe-lenivaya-lazy-funkciya.md`
- `049-chto-takoe-predokhraniteli-error-boundaries.md`
- `039-chto-takoe-komponent-pereklyuchatel-switching-component.md`
