# Q040. Что такое условный рендеринг (Conditional Rendering)? Как его выполнить?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Условный рендеринг** — рендеринг компонента или элемента в зависимости от условия. В React условия выражаются через JavaScript-конструкции внутри JSX: тернарный оператор (`condition ? A : B`), логический AND (`condition && A`), early return, or switching component. Нет специального синтаксиса — только стандартный JavaScript.

---

## Развёрнутый ответ

### Суть и определение

React не имеет директив типа `v-if`/`ng-if`. Условный рендеринг — это обычный JS внутри функции компонента. Несколько подходов имеют разные применения.

### Способы условного рендеринга

**1. Тернарный оператор (`? :`)**

Лучший вариант для «рендерить A или B»:
```tsx
const Greeting: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => (
  <div>
    {isLoggedIn ? <UserGreeting /> : <GuestGreeting />}
  </div>
);
```

**2. Логический AND (`&&`)**

Для «рендерить или ничего»:
```tsx
const Notification: React.FC<{ count: number }> = ({ count }) => (
  <div>
    {count > 0 && <Badge count={count} />}
  </div>
);
```

⚠️ Ловушка: `{0 && <Badge />}` выведет `0` в DOM, а не ничего!
```tsx
// ❌ Выводит 0 если count=0
{count && <Badge count={count} />}

// ✅ Явное булево
{count > 0 && <Badge count={count} />}
// или
{!!count && <Badge count={count} />}
```

**3. Early return**

Для Guards на уровне компонента:
```tsx
const ProtectedPage: React.FC<{ user: User | null }> = ({ user }) => {
  if (!user) return <LoginPage />; // early return

  // Дальше код уверен что user !== null
  return <Dashboard user={user} />;
};
```

**4. Переменная с JSX**

Для сложных условий:
```tsx
const StatusBanner: React.FC<{ status: 'loading' | 'error' | 'success' | 'idle' }> = ({ status }) => {
  let content: React.ReactNode = null;

  switch (status) {
    case 'loading':
      content = <Spinner />;
      break;
    case 'error':
      content = <ErrorMessage />;
      break;
    case 'success':
      content = <SuccessBanner />;
      break;
    default:
      content = null;
  }

  return <div className="banner">{content}</div>;
};
```

**5. Объектный маппинг (Switching Component)**
```tsx
const STATUS_COMPONENTS = {
  loading: Spinner,
  error: ErrorMessage,
  success: SuccessBanner,
} as const;

const StatusBanner: React.FC<{ status: keyof typeof STATUS_COMPONENTS }> = ({ status }) => {
  const Component = STATUS_COMPONENTS[status];
  return <div className="banner"><Component /></div>;
};
```

**6. Возврат `null`**

Компонент ничего не рендерит, но остаётся в дереве (lifecycle сохраняется):
```tsx
const Tooltip: React.FC<{ isVisible: boolean; text: string }> = ({ isVisible, text }) => {
  if (!isVisible) return null; // компонент в дереве, но ничего не рендерит
  return <div className="tooltip">{text}</div>;
};
```

### Рекомендации по выбору подхода

| Сценарий | Рекомендация |
|----------|--------------|
| А или Б | Тернарник |
| А или ничего | `&&` (с явным boolean) |
| Защита от null/undefined | Early return |
| 3+ вариантов | Объектный маппинг / switch |
| Сложная логика | Переменная + if/switch |

### Практика и применение

```tsx
// Реальный компонент с несколькими условиями
interface UserProfileProps {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, isLoading, error }) => {
  // Guard: загрузка
  if (isLoading) return <ProfileSkeleton />;

  // Guard: ошибка
  if (error) return <ErrorState message={error} />;

  // Guard: нет данных
  if (!user) return <EmptyState message="Пользователь не найден" />;

  // Основной рендер
  return (
    <article>
      <h1>{user.name}</h1>
      {user.bio && <p>{user.bio}</p>}
      {user.isAdmin && <AdminBadge />}
    </article>
  );
};
```

### Важные нюансы и краеугольные камни

- `null`, `undefined`, `false` — не рендерятся; `0`, `''` — **рендерятся** (пустой контент)
- Условный рендеринг через смену `type` (`div` → `span`) вызывает **перемонтирование** — это может быть нежелательно (сброс state)
- Для сохранения state скрытого компонента: `display: none` через className или `hidden` атрибут

### Примеры

```tsx
// Сохранить state — скрыть через CSS, не условный рендер
const TabContent: React.FC<{ activeTab: string }> = ({ activeTab }) => (
  <div>
    <div className={activeTab === 'a' ? '' : 'hidden'}><TabA /></div>
    <div className={activeTab === 'b' ? '' : 'hidden'}><TabB /></div>
  </div>
);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `{0 && <Component />}` выводит 0?** — `&&` возвращает первый falsy операнд; `0` — falsy, но React рендерит числа
- **Как выбрать между тернарником и ранним return?** — ранний return для глобальных guards компонента; тернарник — для inline условий в JSX
- **Условный рендеринг vs display:none** — условный рендеринг размонтирует (потеря state); display:none — сохраняет

### Красные флаги (чего не говорить)

- «React имеет специальную директиву v-if» — нет; только JavaScript конструкции
- «null рендерит пустой элемент» — null не рендерит ничего; DOM-узел не создаётся

### Связанные темы

- `039-chto-takoe-komponent-pereklyuchatel-switching-component.md`
- `044-chto-takoe-fragment-pochemu-fragment-luchshe-chem-div.md`
- `013-raznica-mezhdu-sostoyaniem-state-i-propsami-props.md`
