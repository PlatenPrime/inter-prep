# Q050. Что такое «ленивая» (Lazy) функция?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

`React.lazy()` — функция для **динамического импорта** компонента: загрузка JS-чанка откладывается до момента, когда компонент впервые понадобится для рендеринга. Используется совместно с `<Suspense>` для отображения fallback во время загрузки. Это основной инструмент **code splitting** в React-приложениях.

---

## Развёрнутый ответ

### Суть и определение

По умолчанию webpack/Vite/Rollup собирают всё приложение в один bundle. На больших приложениях это означает долгую начальную загрузку. `React.lazy()` создаёт «ленивый» компонент, JS-код которого загружается отдельным чанком только при первом использовании.

### Как это работает

```tsx
import React, { Suspense } from 'react';

// ❌ Обычный импорт — всегда в bundle
import HeavyDashboard from './HeavyDashboard';

// ✅ Lazy импорт — отдельный чанк, загружается при необходимости
const HeavyDashboard = React.lazy(() => import('./HeavyDashboard'));

// Компонент нужно обернуть в Suspense
const App: React.FC = () => (
  <Suspense fallback={<div>Загрузка дашборда...</div>}>
    <HeavyDashboard />
  </Suspense>
);
```

**Что происходит:**
1. При первом рендере `HeavyDashboard` React видит lazy-компонент
2. React приостанавливает рендеринг (throws Promise внутри Suspense)
3. `<Suspense>` показывает `fallback`
4. Динамический import загружает чанк
5. Promise резолвится → React рендерит компонент → fallback скрывается

### Требования к динамическому импорту

Модуль должен иметь **default export**:

```tsx
// HeavyDashboard.tsx — должен быть default export
const HeavyDashboard: React.FC = () => <div>Dashboard</div>;
export default HeavyDashboard;

// Для named exports — обёртка:
export const NamedComponent: React.FC = () => <div />;

// Lazy-обёртка для named export:
const LazyNamed = React.lazy(() =>
  import('./module').then(module => ({ default: module.NamedComponent }))
);
```

### Практика и применение

**Роут-based code splitting:**
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const HomePage = React.lazy(() => import('./pages/Home'));
const DashboardPage = React.lazy(() => import('./pages/Dashboard'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));

const App: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
```

**Feature-based splitting:**
```tsx
// Тяжёлая диаграммная библиотека — только при открытии
const ChartModal = React.lazy(() => import('./ChartModal'));

const Dashboard: React.FC = () => {
  const [showChart, setShowChart] = useState(false);
  return (
    <>
      <button onClick={() => setShowChart(true)}>Показать график</button>
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <ChartModal onClose={() => setShowChart(false)} />
        </Suspense>
      )}
    </>
  );
};
```

### Важные нюансы и краеугольные камни

- `React.lazy` принимает функцию, возвращающую Promise, который резолвится в модуль с **default export**
- **Suspense** обязателен: без него React бросит ошибку
- **Error Boundary**: ошибка загрузки чанка (сеть) → нужен `<ErrorBoundary>` вокруг `<Suspense>`
- **Preloading**: можно предзагрузить чанк на hover: `const loadDashboard = () => import('./Dashboard')`
- `React.lazy` работает только в **клиентском рендеринге**; для SSR — Next.js `dynamic()` с `{ ssr: false }` опцией

### Примеры

```tsx
// Полный паттерн с Error Boundary + Suspense
const LazyPage = React.lazy(() => import('./HeavyPage'));

const SafeLazyPage: React.FC = () => (
  <ErrorBoundary fallback={<ChunkLoadError />}>
    <Suspense fallback={<PageSkeleton />}>
      <LazyPage />
    </Suspense>
  </ErrorBoundary>
);

// Preloading по hover для ускорения ощущаемой загрузки
const preloadHeavyPage = () => import('./HeavyPage'); // старт загрузки

const NavLink: React.FC = () => (
  <a
    href="/heavy"
    onMouseEnter={preloadHeavyPage} // загружаем заранее при наведении
  >
    Перейти
  </a>
);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое code splitting?** — разбивка bundle на чанки, которые загружаются по требованию
- **Как React.lazy работает с SSR?** — не работает нативно; Next.js `dynamic()` с `{ ssr: false }` для клиентских компонентов
- **Как обработать ошибку загрузки чанка?** — ErrorBoundary вокруг Suspense + retry через повторный mount

### Красные флаги (чего не говорить)

- «React.lazy работает с named exports» — нет; только default; нужна обёртка `then(m => ({ default: m.Named }))`
- «Suspense не обязателен для lazy» — обязателен; без него ошибка на этапе render

### Связанные темы

- `051-kak-ispolzovat-react-lazy-i-react-suspense-dlya-zapuska-koda-prilozheniya.md`
- `049-chto-takoe-predokhraniteli-error-boundaries.md`
- `039-chto-takoe-komponent-pereklyuchatel-switching-component.md`
