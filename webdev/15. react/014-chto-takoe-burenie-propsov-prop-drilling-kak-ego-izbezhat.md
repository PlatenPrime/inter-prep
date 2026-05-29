# Q014. Что такое «бурение пропсов» (Prop Drilling)? Как его избежать?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Prop Drilling** — ситуация, когда данные передаются через несколько промежуточных компонентов, которые сами этими данными не пользуются, только передают дальше. Это создаёт лишние зависимости и усложняет рефакторинг. Избегают с помощью React Context, state-менеджеров (Zustand, Redux) или компонентной композиции (children/render props).

---

## Развёрнутый ответ

### Суть и определение

Prop drilling возникает, когда состояние нужно компоненту на 3-5 уровней ниже, а все промежуточные компоненты вынуждены принимать и передавать props, в которых не нуждаются. Это нарушает принцип наименьшего знания и делает код хрупким: изменение сигнатуры props требует правки нескольких файлов.

### Как это работает

**Проблема: prop drilling**
```tsx
// user нужен только в UserAvatar, но проходит через App → Layout → Header
const App = () => {
  const user = { name: 'Alice', avatar: '/alice.jpg' };
  return <Layout user={user} />;  // Layout не использует user
};

const Layout: React.FC<{ user: User }> = ({ user }) => (
  <div>
    <Header user={user} />  {/* Header не использует user напрямую */}
    <main>...</main>
  </div>
);

const Header: React.FC<{ user: User }> = ({ user }) => (
  <nav>
    <UserAvatar user={user} />  {/* Здесь user реально нужен */}
  </nav>
);
```

### Решения

**1. React Context — для глобальных данных (тема, пользователь, локализация)**
```tsx
const UserContext = React.createContext<User | null>(null);

const App = () => {
  const user = { name: 'Alice', avatar: '/alice.jpg' };
  return (
    <UserContext.Provider value={user}>
      <Layout />
    </UserContext.Provider>
  );
};

// Любой потомок читает напрямую
const UserAvatar = () => {
  const user = useContext(UserContext);
  return user ? <img src={user.avatar} alt={user.name} /> : null;
};
```

**2. Компонентная композиция (children) — самый чистый способ**
```tsx
// Layout принимает children — не знает о user
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div><nav>{children}</nav><main>...</main></div>
);

// App контролирует что передать в nav
const App = () => {
  const user = { name: 'Alice', avatar: '/alice.jpg' };
  return (
    <Layout>
      <UserAvatar user={user} />
    </Layout>
  );
};
```

**3. State-менеджер (Zustand) — для сложного глобального состояния**
```tsx
const useUserStore = create<{ user: User | null }>(() => ({ user: null }));

const UserAvatar = () => {
  const user = useUserStore(s => s.user);
  return user ? <img src={user.avatar} alt={user.name} /> : null;
};
```

### Практика и применение

- **Небольшой дриллинг (1-2 уровня)** — нормально; Context — overhead для таких случаев
- **Context** — для: текущий пользователь, тема (dark/light), язык, настройки
- **Zustand/Redux** — для часто меняющихся глобальных данных (перформанс Context-ре-рендеров)
- **Композиция** — предпочтительна при гибком layout'е

### Важные нюансы и краеугольные камни

- **Context не серебряная пуля**: каждое изменение значения Context перерендеривает всех потребителей — может быть хуже drilling'а по производительности
- **Context + useMemo**: разделять контексты по частоте изменений; один контекст для `user`, другой для функций
- Компонентная **композиция через children** часто полностью устраняет нужду в Context без его накладных расходов

### Примеры

```tsx
// Неэффективно: Context без разделения
const AppContext = React.createContext<{ user: User; theme: Theme; setTheme: (t: Theme) => void } | null>(null);
// При смене theme — перерендерятся все потребители user тоже

// Эффективно: раздельные контексты
const UserContext = React.createContext<User | null>(null);
const ThemeContext = React.createContext<{ theme: Theme; setTheme: (t: Theme) => void } | null>(null);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда Context хуже prop drilling'а?** — при высокой частоте обновлений, т.к. все потребители перерендериваются
- **Что такое Context selector?** — паттерн через `use-context-selector` библиотеку для подписки на часть контекста
- **Чем композиция отличается от Context?** — композиция не добавляет глобальное состояние; данные всё равно в родителе

### Красные флаги (чего не говорить)

- «Нужно всегда использовать Context» — для 1-2 уровней drilling props предпочтительнее
- «Redux решает prop drilling» — решает, но создаёт другую сложность; для простых случаев Context достаточно

### Связанные темы

- `013-raznica-mezhdu-sostoyaniem-state-i-propsami-props.md`
- `017-chto-takoe-podnyatie-sostoyaniya-vverh-lifting-state-up.md`
- `047-chto-takoe-kontekst-context.md`
