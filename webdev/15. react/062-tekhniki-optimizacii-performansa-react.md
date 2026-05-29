# Q062. Техники оптимизации перформанса React?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

Ключевые техники: предотвращение лишних ре-рендеров (`React.memo`, `useMemo`, `useCallback`), code splitting (`React.lazy` + `Suspense`), виртуализация длинных списков (`react-window`), оптимизация изображений и ресурсов, использование Concurrent features (`useTransition`, `useDeferredValue`) и правильная работа с Context. Первый шаг — **профилировать**, потом оптимизировать.

---

## Развёрнутый ответ

### Суть и определение

Производительность React-приложений зависит от трёх аспектов:
1. **Rendering performance** — как часто и что рендерится
2. **Bundle size** — сколько JS нужно загрузить и распарсить
3. **Runtime performance** — вычисления, layout thrashing, paint

### Категории техник

**1. Предотвращение лишних ре-рендеров**

```tsx
// React.memo — пропустить рендер если props не изменились
const UserCard = React.memo<{ user: User }>(({ user }) => (
  <div>{user.name}</div>
));

// useMemo — мемоизировать тяжёлые вычисления
const filteredList = useMemo(
  () => data.filter(item => item.category === category),
  [data, category]
);

// useCallback — стабилизировать callback для React.memo
const handleSelect = useCallback((id: string) => {
  dispatch(selectItem(id));
}, [dispatch]);

// Разделить Context на части — смена одного не перерендеривает другой
const UserStateContext = createContext<User | null>(null);
const UserActionsContext = createContext<UserActions | null>(null);
```

**2. Code Splitting**

```tsx
// Роут-based splitting
const DashboardPage = React.lazy(() => import('./pages/Dashboard'));

// Компонентный splitting — тяжёлые библиотеки
const RichEditor = React.lazy(() =>
  import(/* webpackChunkName: "editor" */ './RichEditor')
);

// Preloading при hover
const preloadDashboard = () => import('./pages/Dashboard');
<Link onMouseEnter={preloadDashboard} to="/dashboard">Dashboard</Link>
```

**3. Виртуализация списков**

```tsx
import { FixedSizeList } from 'react-window';

// Вместо рендера 10000 строк — только видимые ~20
const VirtualList: React.FC<{ items: Item[] }> = ({ items }) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={50}  // высота строки
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        {items[index].name}
      </div>
    )}
  </FixedSizeList>
);
```

**4. Concurrent Features (React 18)**

```tsx
// useTransition — не блокировать ввод при тяжёлых обновлениях
const [isPending, startTransition] = useTransition();

const handleSearch = (query: string) => {
  setInputValue(query); // синхронно — input мгновенный

  startTransition(() => {
    setSearchResults(filterResults(query)); // низкий приоритет
  });
};

// useDeferredValue — откладывать обновление тяжёлого компонента
const deferredQuery = useDeferredValue(query);
const results = useFilteredResults(deferredQuery);
```

**5. Оптимизация изображений**

```tsx
// Next.js Image — автоматический lazy load + WebP + responsive
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // LCP image — загрузить немедленно
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Для обычного React — intersection observer
const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoaded(true);
        observer.disconnect();
      }
    });
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return <img ref={imgRef} src={loaded ? src : ''} alt={alt} loading="lazy" />;
};
```

**6. Оптимизация State**

```tsx
// Коллоцировать state — держать близко к потребителям
// ❌ Всё в глобальном state
// ✅ Локальный state в компоненте, который им пользуется

// Избегать дорогих вычислений в initialState
// ❌ useState(computeExpensiveValue())  — вычисляется каждый рендер!
// ✅ useState(() => computeExpensiveValue())  — lazy init, один раз

// useReducer для батчинга связанных обновлений
dispatch({ type: 'UPDATE_ALL', payload: { field1, field2, field3 } });
// вместо трёх setState (три ре-рендера в React 17)
```

**7. Профилирование**

```tsx
// React DevTools Profiler — запись и анализ рендеров
// Что смотреть: компоненты с длинными рендерами, частые ре-рендеры

// React.Profiler API
<Profiler
  id="Navigation"
  onRender={(id, phase, actualDuration) => {
    if (actualDuration > 16) { // > 1 frame
      console.warn(`Slow render: ${id} ${phase} ${actualDuration}ms`);
    }
  }}
>
  <Navigation />
</Profiler>
```

### Практика и применение

- **Большие таблицы данных**: виртуализация обязательна при > 100 строк
- **Дашборды с виджетами**: каждый виджет в React.memo + Error Boundary
- **Поиск с фильтрацией**: useDeferredValue для отзывчивости input

### Важные нюансы и краеугольные камни

- **«Профилируй, потом оптимизируй»** — преждевременная оптимизация (React.memo везде) может замедлить из-за overhead
- **React 19 Compiler** автоматически применяет memo/useMemo — ручная мемоизация становится менее нужной
- Оптимизация **bundle size** (tree shaking, dynamic imports) часто даёт больше чем memo
- **Network > JS** — для большинства приложений медленный сервер важнее лишних ре-рендеров

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда React.memo бесполезен?** — если props всегда новые объекты/функции без useCallback/useMemo
- **Что такое layout thrashing?** — чередование чтения и записи DOM-свойств вызывает forced reflow; решение — useLayoutEffect для батчинга
- **Как Web Vitals связаны с оптимизацией React?** — LCP (загрузка), FID/INP (интерактивность — ре-рендеры), CLS (layout shifts)

### Красные флаги (чего не говорить)

- «Надо добавить React.memo везде» — overhead мемоизации > пользы для простых компонентов
- «Оптимизацию надо делать заранее» — преждевременная оптимизация; профилировать сначала

### Связанные темы

- `031-raznica-mezhdu-memo-i-usememo.md`
- `022-chto-takoe-react-fiber.md`
- `023-nazvajte-osnovnuyu-cel-react-fiber.md`
- `051-kak-ispolzovat-react-lazy-i-react-suspense-dlya-zapuska-koda-prilozheniya.md`
