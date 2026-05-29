# Q058. Чем React Router отличается от обычной маршрутизации?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Обычная маршрутизация** (Server-side routing) — при смене URL браузер делает HTTP-запрос к серверу, который возвращает новую HTML-страницу. **React Router** реализует **Client-side routing**: URL меняется через History API без перезагрузки страницы, React сам решает какой компонент показать. Это обеспечивает мгновенные переходы между «страницами» SPA и сохранение состояния приложения.

---

## Развёрнутый ответ

### Суть и определение

**Server-side routing:**
```
Пользователь кликает <a href="/about">
  → Браузер: GET /about
  → Сервер: возвращает HTML страницы About
  → Браузер: перезагружает страницу, теряет JS-состояние
```

**React Router (Client-side routing):**
```
Пользователь кликает <Link to="/about">
  → React Router: вызывает history.pushState('/about')
  → URL меняется без HTTP-запроса
  → React: перерендеривает нужный компонент
  → Состояние (auth, cart) сохранено
```

### Как работает React Router

```tsx
// React Router v6
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';

const App: React.FC = () => (
  <BrowserRouter>
    {/* Навигация — без перезагрузки страницы */}
    <nav>
      <Link to="/">Главная</Link>
      <Link to="/about">О нас</Link>
      <Link to="/users">Пользователи</Link>
    </nav>

    <Routes>
      {/* Матчинг URL → компонент */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/:id" element={<UserDetailPage />} />
      {/* Вложенные роуты */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="stats" element={<StatsPage />} />
      </Route>
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
```

### Ключевые компоненты React Router v6

| Компонент/Хук | Назначение |
|---------------|-----------|
| `<BrowserRouter>` | Провайдер с HTML5 History API |
| `<Routes>` | Контейнер роутов (v6 замена `<Switch>`) |
| `<Route>` | Декларация: path → element |
| `<Link>` | Ссылка без перезагрузки |
| `<NavLink>` | Ссылка с активным классом |
| `<Navigate>` | Программный редирект |
| `<Outlet>` | Место рендера дочерних роутов |
| `useNavigate()` | Программная навигация |
| `useParams()` | Параметры URL (:id) |
| `useLocation()` | Текущий location объект |
| `useSearchParams()` | Query string параметры |

### Практика и применение

```tsx
// Protected Route паттерн
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Редирект на login с сохранением целевого URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Использование в роутах
<Route
  path="/dashboard"
  element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
/>

// После логина — редирект обратно
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from: Location })?.from?.pathname || '/';

  const handleLogin = async (credentials: Credentials) => {
    await login(credentials);
    navigate(from, { replace: true }); // возврат на исходную страницу
  };
};
```

### Различия

| Критерий | Server Routing | React Router (CSR) |
|----------|----------------|---------------------|
| HTTP-запрос при навигации | Да | Нет |
| Скорость перехода | Медленнее (сетевой запрос) | Мгновенно |
| Состояние JS | Сбрасывается | Сохраняется |
| SEO | Хорошо (HTML от сервера) | Нужен SSR/SSG |
| Deep linking | Требует серверной настройки | Встроено |
| Первая загрузка | Быстро (только HTML) | Медленнее (JS bundle) |

### Важные нюансы и краеугольные камни

- **404 на сервере при прямом URL**: при CSR нужна конфигурация сервера (Nginx: `try_files $uri /index.html`)
- **`HashRouter`**: использует `#` в URL (`/app#/about`) — не требует серверной конфигурации, но некрасиво и плохо для SEO
- **Scroll restoration**: при навигации React Router не скроллит вверх автоматически; нужен `<ScrollRestoration>` или хук
- React Router v6 vs v5: убран `<Switch>`, изменился синтаксис `useHistory` → `useNavigate`

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как React Router обновляет URL без перезагрузки?** — через HTML5 History API: `history.pushState()` / `history.replaceState()`
- **Что такое HashRouter и когда его использовать?** — при невозможности настроить сервер для SPA (hash после #, сервер не обрабатывает)
- **Как реализовать lazy loading страниц с React Router?** — `React.lazy()` для каждого компонента страницы + `<Suspense>` вокруг `<Routes>`

### Красные флаги (чего не говорить)

- «React Router делает сетевые запросы при навигации» — нет; History API меняет URL в браузере без запроса
- «Link то же самое что <a>» — `<a href>` вызывает перезагрузку; `<Link to>` — client-side навигация

### Связанные темы

- `059-kakie-huki-byli-dobavleny-v-react-router-versii-5.md`
- `060-kak-peredavat-propsy-v-react-router.md`
- `051-kak-ispolzovat-react-lazy-i-react-suspense-dlya-zapuska-koda-prilozheniya.md`
