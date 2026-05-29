# Q060. Как передавать пропсы в React Router?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

В React Router v6 пропсы передаются напрямую через JSX в `element` prop роута: `<Route path="/user" element={<UserPage userId={123} />} />`. Параметры URL доступны через `useParams()`, state через `<Link state={...}>` и `useLocation().state`, query через `useSearchParams()`. HOC `withRouter` из v4/v5 больше не нужен.

---

## Развёрнутый ответ

### Суть и определение

В разных версиях React Router передача props роутовым компонентам реализовывалась по-разному. В v6 — наиболее интуитивный подход.

### React Router v6 — прямая передача через JSX

```tsx
// Прямая передача props в element компонент
<Routes>
  <Route
    path="/user/:id"
    element={
      <UserProfile
        showSidebar={true}
        theme="dark"
        onLogout={handleLogout}
      />
    }
  />
</Routes>

// UserProfile получает props обычным образом
const UserProfile: React.FC<{
  showSidebar: boolean;
  theme: string;
  onLogout: () => void;
}> = ({ showSidebar, theme, onLogout }) => {
  const { id } = useParams<{ id: string }>(); // URL-параметр через хук
  return <div>User {id}</div>;
};
```

### Передача данных через URL

**URL параметры (`useParams`):**
```tsx
// Роут: /users/:userId/posts/:postId
const PostPage: React.FC = () => {
  const { userId, postId } = useParams<{ userId: string; postId: string }>();
  return <div>User {userId}, Post {postId}</div>;
};
```

**Query string (`useSearchParams`):**
```tsx
// URL: /search?q=react&page=2
const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  const updateFilter = (newQuery: string) => {
    setSearchParams({ q: newQuery, page: '1' }); // обновляет URL
  };

  return (
    <div>
      <input value={query} onChange={e => updateFilter(e.target.value)} />
      <ResultsList query={query} page={page} />
    </div>
  );
};
```

**Location state (через `<Link>` или `navigate`):**
```tsx
// Передача при навигации
<Link
  to="/confirm"
  state={{ orderId: '123', amount: 1500 }}
>
  Подтвердить заказ
</Link>

// Программно:
navigate('/confirm', { state: { orderId: '123', amount: 1500 } });

// Получение на целевой странице:
const ConfirmPage: React.FC = () => {
  const location = useLocation();
  const { orderId, amount } = location.state as { orderId: string; amount: number };
  return <div>Заказ #{orderId} на {amount} руб.</div>;
};
```

### React Router v5 — варианты

В v5 компонент указывался через `component` или `render` prop, передача дополнительных props была сложнее:

```tsx
// v5: render prop (позволяет передавать дополнительные props)
<Route
  path="/user/:id"
  render={(routeProps) => (
    <UserProfile
      {...routeProps}   // history, location, match
      theme="dark"      // дополнительный prop
    />
  )}
/>

// v5: component prop (только router props, нет дополнительных)
<Route path="/user/:id" component={UserProfile} />

// v5: children prop (рендерится всегда, match == null если не совпало)
<Route path="/user/:id">
  {({ match }) => match && <UserProfile id={match.params.id} />}
</Route>
```

### Outlet context — для вложенных роутов

```tsx
// Родительский роут передаёт данные в дочерние через context
const DashboardLayout: React.FC = () => {
  const user = useCurrentUser();

  return (
    <div>
      <Sidebar />
      <Outlet context={{ user }} />  {/* передаём context */}
    </div>
  );
};

// Дочерний роут получает context через useOutletContext
const DashboardPage: React.FC = () => {
  const { user } = useOutletContext<{ user: User }>();
  return <div>Привет, {user.name}!</div>;
};
```

### Практика и применение

- **URL params** — ID сущностей, slug статей
- **Query string** — фильтры, пагинация, поисковые запросы
- **Location state** — временные данные между страницами (результаты формы, breadcrumb)
- **Direct props через element** — конфигурация, callbacks, theme

### Важные нюансы и краеугольные камни

- `location.state` — не персистентен: при обновлении страницы будет `null`; не заменяет нормальный state
- URL params — строки; числа нужно явно конвертировать: `Number(id)`
- Передача `history`/`match` как props (v5 паттерн) — устаревает в v6; используйте хуки

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как передать данные между страницами без URL?** — `navigate('/page', { state: data })` + `useLocation().state`
- **Как типизировать useParams в TypeScript?** — `useParams<{ id: string }>()` — дженерик с типом
- **Что такое useOutletContext?** — получение context из родительского `<Outlet context={...}>` в дочернем роуте

### Красные флаги (чего не говорить)

- «В v6 нужен render prop для передачи props» — нет; просто передайте props напрямую в element: `<Route element={<Page prop={val} />} />`
- «location.state хранится в localStorage» — хранится в памяти браузера; при обновлении страницы теряется

### Связанные темы

- `058-chem-react-router-otlichaetsya-ot-obychnoj-marshrutizacii.md`
- `059-kakie-huki-byli-dobavleny-v-react-router-versii-5.md`
