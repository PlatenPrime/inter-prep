/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 81,
    slug: 'memory-router',
    folder: '09-routing',
    title: 'MemoryRouter',
    tags: ['router'],
    difficulty: 'easy',
    exportName: 'HomePage',
    withRouter: true,
    route: '/',
    theory: `MemoryRouter хранит history в памяти — идеален для тестов без браузера.`,
    interview: `- BrowserRouter vs MemoryRouter? — URL bar vs in-memory.`,
    component: `import { Route, Routes } from 'react-router-dom';

export function HomePage() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
    </Routes>
  );
}`,
    test: `it('shows home', () => {
    renderUi(<HomePage />);
    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
  });`,
  },
  {
    num: 82,
    slug: 'link-navigation',
    folder: '09-routing',
    title: 'Link navigation',
    tags: ['router'],
    difficulty: 'easy',
    exportName: 'NavApp',
    withRouter: true,
    route: '/',
    theory: `Link предотвращает full reload. NavLink добавляет active class.`,
    interview: `- Link vs a? — Client-side navigation в SPA.`,
    component: `import { Link, Route, Routes } from 'react-router-dom';

export function NavApp() {
  return (
    <>
      <nav>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path="/about" element={<p>About page</p>} />
      </Routes>
    </>
  );
}`,
    test: `it('navigates to about', async () => {
    const user = userEvent.setup();
    renderUi(<NavApp />);
    await user.click(screen.getByRole('link', { name: 'About' }));
    expect(screen.getByText('About page')).toBeInTheDocument();
  });`,
  },
  {
    num: 83,
    slug: 'url-params',
    folder: '09-routing',
    title: 'URL params',
    tags: ['router'],
    difficulty: 'medium',
    exportName: 'UserRoute',
    withRouter: true,
    route: '/users/42',
    theory: `useParams читает :id из path. Типизируйте params в TypeScript.`,
    interview: `- optional params? — :id? в path pattern.`,
    component: `import { Route, Routes, useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();
  return <p>User {id}</p>;
}

export function UserRoute() {
  return (
    <Routes>
      <Route path="/users/:id" element={<UserDetail />} />
    </Routes>
  );
}`,
    test: `it('shows user id', () => {
    renderUi(<UserRoute />);
    expect(screen.getByText('User 42')).toBeInTheDocument();
  });`,
  },
  {
    num: 84,
    slug: 'search-params',
    folder: '09-routing',
    title: 'Search params',
    tags: ['router'],
    difficulty: 'medium',
    exportName: 'SearchPage',
    withRouter: true,
    route: '/search?q=react',
    theory: `useSearchParams — URLSearchParams для фильтров и shareable state.`,
    interview: `- search params vs state? — Shareable URL, back button.`,
    component: `import { Route, Routes, useSearchParams } from 'react-router-dom';

function Search() {
  const [params] = useSearchParams();
  return <p>Query: {params.get('q')}</p>;
}

export function SearchPage() {
  return (
    <Routes>
      <Route path="/search" element={<Search />} />
    </Routes>
  );
}`,
    test: `it('reads q param', () => {
    renderUi(<SearchPage />);
    expect(screen.getByText('Query: react')).toBeInTheDocument();
  });`,
  },
  {
    num: 85,
    slug: 'nested-routes',
    folder: '09-routing',
    title: 'Nested routes',
    tags: ['router'],
    difficulty: 'medium',
    exportName: 'DashboardRoutes',
    withRouter: true,
    route: '/dashboard/stats',
    theory: `Outlet рендерит дочерний route. Layout route оборачивает children.`,
    interview: `- nested routes benefit? — Shared layout, code splitting по секциям.`,
    component: `import { Outlet, Route, Routes } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet />
    </div>
  );
}

export function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="stats" element={<p>Stats panel</p>} />
      </Route>
    </Routes>
  );
}`,
    test: `it('renders nested stats', () => {
    renderUi(<DashboardRoutes />);
    expect(screen.getByText('Stats panel')).toBeInTheDocument();
  });`,
  },
  {
    num: 86,
    slug: 'index-route',
    folder: '09-routing',
    title: 'Index route',
    tags: ['router'],
    difficulty: 'medium',
    exportName: 'ShopRoutes',
    withRouter: true,
    route: '/shop',
    theory: `index route — default child при точном match родителя.`,
    interview: `- index vs path=""? — index для default child.`,
    component: `import { Route, Routes } from 'react-router-dom';

export function ShopRoutes() {
  return (
    <Routes>
      <Route path="/shop">
        <Route index element={<p>Shop home</p>} />
        <Route path="cart" element={<p>Cart</p>} />
      </Route>
    </Routes>
  );
}`,
    test: `it('shows shop home', () => {
    renderUi(<ShopRoutes />);
    expect(screen.getByText('Shop home')).toBeInTheDocument();
  });`,
  },
  {
    num: 87,
    slug: 'protected-route',
    folder: '09-routing',
    title: 'Protected route',
    tags: ['router', 'auth'],
    difficulty: 'hard',
    exportName: 'ProtectedApp',
    withRouter: true,
    route: '/secret',
    theory: `Guard component: если !auth — Navigate to /login, иначе children.`,
    interview: `- loader vs client guard? — Loader на сервере надёжнее для секретов.`,
    component: `import { Navigate, Route, Routes } from 'react-router-dom';

function Guard({ auth, children }: { auth: boolean; children: React.ReactNode }) {
  if (!auth) return <Navigate to="/login" replace />;
  return children;
}

export function ProtectedApp({ auth }: { auth: boolean }) {
  return (
    <Routes>
      <Route path="/login" element={<p>Login</p>} />
      <Route
        path="/secret"
        element={
          <Guard auth={auth}>
            <p>Secret</p>
          </Guard>
        }
      />
    </Routes>
  );
}`,
    test: `it('redirects when logged out', () => {
    renderUi(<ProtectedApp auth={false} />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });`,
  },
  {
    num: 88,
    slug: 'loader-wrapper',
    folder: '09-routing',
    title: 'Loader wrapper',
    tags: ['router', 'data'],
    difficulty: 'hard',
    exportName: 'DataRoute',
    withRouter: true,
    route: '/data',
    theory: `Data routers (RR 6.4+) — loader до render. В тестах имитируйте wrapper с useEffect fetch.`,
    interview: `- loader vs useEffect fetch? — Loader параллелен navigation, меньше waterfall.`,
    component: `import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

function DataView() {
  const [data, setData] = useState<string | null>(null);
  useEffect(() => {
    setData('loaded');
  }, []);
  return <p>{data ?? 'loading'}</p>;
}

export function DataRoute() {
  return (
    <Routes>
      <Route path="/data" element={<DataView />} />
    </Routes>
  );
}`,
    test: `it('loads data', async () => {
    renderUi(<DataRoute />);
    expect(await screen.findByText('loaded')).toBeInTheDocument();
  });`,
  },
  {
    num: 89,
    slug: 'navigate-programmatic',
    folder: '09-routing',
    title: 'useNavigate',
    tags: ['router'],
    difficulty: 'medium',
    exportName: 'GoApp',
    withRouter: true,
    route: '/',
    theory: `useNavigate() возвращает функцию для programmatic navigation.`,
    interview: `- navigate(-1)? — history back.`,
    component: `import { Route, Routes, useNavigate } from 'react-router-dom';

function Home() {
  const nav = useNavigate();
  return (
    <button type="button" onClick={() => nav('/done')}>
      Go
    </button>
  );
}

export function GoApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/done" element={<p>Done</p>} />
    </Routes>
  );
}`,
    test: `it('navigates to done', async () => {
    const user = userEvent.setup();
    renderUi(<GoApp />);
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(screen.getByText('Done')).toBeInTheDocument();
  });`,
  },
  {
    num: 90,
    slug: 'not-found',
    folder: '09-routing',
    title: '404 fallback',
    tags: ['router'],
    difficulty: 'easy',
    exportName: 'NotFoundApp',
    withRouter: true,
    route: '/missing',
    theory: `path="*" — catch-all для unknown routes.`,
    interview: `- 404 в SPA? — Сервер отдаёт index.html, клиент показывает NotFound.`,
    component: `import { Route, Routes } from 'react-router-dom';

export function NotFoundApp() {
  return (
    <Routes>
      <Route path="/" element={<p>Home</p>} />
      <Route path="*" element={<p>Not found</p>} />
    </Routes>
  );
}`,
    test: `it('shows not found', () => {
    renderUi(<NotFoundApp />);
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });`,
  },
];
