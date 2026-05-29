# Q059. Какие хуки были добавлены в React Router версии 5?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

В React Router **v5.1** добавили хуки: `useHistory()`, `useLocation()`, `useParams()`, `useRouteMatch()`. До этого для доступа к router-объектам в функциональных компонентах нужен был HOC `withRouter()`. Хуки устранили необходимость в обёртках и упростили написание роутер-зависимых компонентов.

---

## Развёрнутый ответ

### Суть и определение

React Router v5.1 (октябрь 2019) добавил четыре хука для функциональных компонентов, заменив паттерн `withRouter(Component)`.

### Хуки React Router v5

**`useHistory()`** — доступ к объекту истории навигации:
```tsx
import { useHistory } from 'react-router-dom'; // v5

const BackButton: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <button onClick={() => history.push('/home')}>На главную</button>
      <button onClick={() => history.replace('/login')}>Логин (без истории)</button>
      <button onClick={() => history.goBack()}>Назад</button>
      <button onClick={() => history.go(-2)}>На 2 назад</button>
    </>
  );
};
```

**`useLocation()`** — текущий URL (pathname, search, hash, state):
```tsx
import { useLocation } from 'react-router-dom';

const Analytics: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Отправляем просмотр страницы при смене маршрута
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

// location объект:
// { pathname: '/users/42', search: '?tab=profile', hash: '#comments', state: {...} }
```

**`useParams()`** — параметры URL (`:id`, `:slug`):
```tsx
import { useParams } from 'react-router-dom';

// Роут: <Route path="/users/:userId/posts/:postId" component={PostDetail} />
const PostDetail: React.FC = () => {
  const { userId, postId } = useParams<{ userId: string; postId: string }>();

  const { data } = useQuery(['post', userId, postId], () =>
    fetchPost(userId, postId)
  );

  return <div>{data?.title}</div>;
};
```

**`useRouteMatch()`** — информация о текущем совпадении маршрута:
```tsx
import { useRouteMatch, Link } from 'react-router-dom';

// Полезен для вложенных роутов (строит URL от текущего match)
const UserProfile: React.FC = () => {
  const { path, url } = useRouteMatch();
  // path: '/users/:id'  (шаблон для создания дочерних путей)
  // url:  '/users/42'   (конкретный URL для создания ссылок)

  return (
    <div>
      <nav>
        <Link to={`${url}/profile`}>Профиль</Link>
        <Link to={`${url}/settings`}>Настройки</Link>
      </nav>
      <Switch>
        <Route path={`${path}/profile`} component={ProfileTab} />
        <Route path={`${path}/settings`} component={SettingsTab} />
      </Switch>
    </div>
  );
};
```

### До хуков: withRouter HOC

```tsx
// v4/v5 без хуков: HOC для доступа к router
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {
  name: string;
}

const Component: React.FC<Props> = ({ history, location, match, name }) => {
  return <button onClick={() => history.push('/home')}>{name}</button>;
};

export default withRouter(Component); // обёртка

// С хуками:
const Component: React.FC<{ name: string }> = ({ name }) => {
  const history = useHistory();
  return <button onClick={() => history.push('/home')}>{name}</button>;
};
// Нет обёртки!
```

### React Router v6: замена хуков

В **v6** некоторые хуки переименованы/изменены:

| v5 | v6 | Изменение |
|----|-----|-----------|
| `useHistory()` | `useNavigate()` | Возвращает `navigate` функцию |
| `useRouteMatch()` | `useMatch()` | Принимает path-pattern |
| `useLocation()` | `useLocation()` | Без изменений |
| `useParams()` | `useParams()` | Без изменений |

```tsx
// v6 — useNavigate вместо useHistory
import { useNavigate } from 'react-router-dom'; // v6

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate('/home')}>На главную</button>
      <button onClick={() => navigate(-1)}>Назад</button>
      <button onClick={() => navigate('/login', { replace: true })}>Логин</button>
    </>
  );
};
```

### Практика и применение

- `useParams` — стандарт для получения ID из URL в компонентах деталей
- `useLocation` + `useEffect` — аналитика просмотров страниц
- `useNavigate` (v6) — программная навигация после форм, логина

### Важные нюансы и краеугольные камни

- `useHistory` / `useNavigate` — работают только внутри дерева `<BrowserRouter>` (или другого router)
- `useParams<T>` — TypeScript generics для типизации параметров
- Хуки v5 — устаревшие в проектах на v6; при обновлении нужна миграция

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем useNavigate (v6) отличается от useHistory (v5)?** — navigate — функция, не объект; `navigate(-1)` вместо `history.goBack()`
- **Как получить query params в React Router?** — `useSearchParams()` (v6): `const [params, setParams] = useSearchParams()`
- **Почему хуки Router лучше withRouter?** — нет HOC-обёртки, проще типизация, читаемее код

### Красные флаги (чего не говорить)

- «useHistory работает в React Router v6» — заменён на useNavigate в v6
- «useParams возвращает числа» — всегда возвращает строки; числа нужно преобразовывать: `Number(id)`

### Связанные темы

- `058-chem-react-router-otlichaetsya-ot-obychnoj-marshrutizacii.md`
- `060-kak-peredavat-propsy-v-react-router.md`
