# Q031. Разница между `memo` и `useMemo`?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

`React.memo` — HOC, мемоизирующий **компонент целиком**: пропускает ре-рендер, если props не изменились. `useMemo` — хук, мемоизирующий **результат вычисления** внутри компонента: кэширует значение до изменения deps. Первый — оптимизация рендеринга компонента, второй — оптимизация вычислений внутри компонента.

---

## Развёрнутый ответ

### Суть и определение

**`React.memo(Component, areEqual?)`:**
- Обёртка над компонентом
- Сравнивает предыдущие и новые props (по умолчанию shallow equality)
- Если props не изменились → **пропускает вызов функции компонента**
- Аналог `PureComponent` для функциональных компонентов

**`useMemo(fn, deps)`:**
- Хук внутри компонента
- Кэширует **возвращаемое значение** `fn()`
- Пересчитывает только при изменении deps
- Аналог `shouldComponentUpdate` для вычислений

### Как это работает

```tsx
// React.memo — мемоизация компонента
interface ExpensiveListProps {
  items: string[];
  title: string;
}

const ExpensiveList = React.memo<ExpensiveListProps>(({ items, title }) => {
  console.log('ExpensiveList render'); // не вызовется, если items и title не изменились
  return (
    <div>
      <h2>{title}</h2>
      <ul>{items.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
    </div>
  );
});

// useMemo — мемоизация значения
const Dashboard: React.FC<{ data: DataItem[] }> = ({ data }) => {
  const [filter, setFilter] = useState('');

  // Тяжёлое вычисление — кэшируем
  const processedData = useMemo(() => {
    console.log('Processing data...'); // только при изменении data или filter
    return data
      .filter(item => item.name.includes(filter))
      .sort((a, b) => b.value - a.value)
      .slice(0, 100);
  }, [data, filter]);

  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ExpensiveList items={processedData.map(d => d.name)} title="Results" />
    </>
  );
};
```

### Когда использовать

**`React.memo`:**
- Компонент часто получает те же props, но родитель часто ре-рендерится
- Рендер компонента тяжёлый (большие списки, графики)

```tsx
// Родитель ре-рендерится при каждом keystroke
// Без memo: Header тоже перерендеривается
// С memo: Header рендерится только при смене user
const Header = React.memo<{ user: User }>(({ user }) => (
  <nav><span>{user.name}</span></nav>
));
```

**`useMemo`:**
- Вычисление занимает заметное время (фильтрация тысяч элементов, heavy computation)
- Нужна стабильная ссылка для deps других хуков или React.memo

```tsx
// Стабилизация объекта для Context
const contextValue = useMemo(() => ({
  user,
  updateUser,
}), [user, updateUser]); // без memo — новый объект каждый рендер → все потребители перерендерятся
```

### Важные нюансы и краеугольные камни

- `React.memo` использует **shallow comparison**: объекты/массивы/функции в props — новые ссылки каждый рендер ломают мемоизацию → нужен `useMemo`/`useCallback` для таких props
- **Преждевременная оптимизация**: не оборачивать всё подряд; overhead `memo` сам по себе есть
- `React.memo` с `areEqual` — пользовательское сравнение: `React.memo(Comp, (prev, next) => prev.id === next.id)`
- **React 19 Compiler** автоматически мемоизирует компоненты и вычисления — ручной `memo`/`useMemo` становится избыточным

### Примеры

```tsx
// Комбинация memo + useCallback + useMemo
const ParentList: React.FC<{ rawData: RawItem[] }> = ({ rawData }) => {
  const [query, setQuery] = useState('');

  // useMemo: стабилизируем тяжёлое вычисление
  const filteredData = useMemo(
    () => rawData.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
    [rawData, query]
  );

  // useCallback: стабилизируем обработчик для React.memo
  const handleSelect = useCallback((id: string) => {
    console.log('selected:', id);
  }, []);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ItemList items={filteredData} onSelect={handleSelect} />
    </div>
  );
};

// React.memo: рендеримся только при изменении props
const ItemList = React.memo<{ items: RawItem[]; onSelect: (id: string) => void }>(
  ({ items, onSelect }) => (
    <ul>{items.map(i => <li key={i.id} onClick={() => onSelect(i.id)}>{i.label}</li>)}</ul>
  )
);
```

---

## Сравнение

| Критерий | `React.memo` | `useMemo` |
|----------|--------------|-----------|
| Тип | HOC (обёртка) | Хук |
| Мемоизирует | Компонент (пропускает render) | Значение внутри компонента |
| Сравнение | Props (shallow по умолчанию) | deps (строгое равенство) |
| Использование | Снаружи компонента | Внутри компонента |
| Аналог класса | PureComponent | shouldComponentUpdate для вычислений |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему React.memo не работает, если передавать объект напрямую?** — `{}` создаёт новую ссылку; нужен useMemo или выносить объект из render
- **Когда memo вреден?** — при частых изменениях props overhead сравнения выше пользы
- **Как работает React 19 Compiler?** — автоматически добавляет memo и useMemo там, где это безопасно; ручные вызовы становятся необязательными

### Красные флаги (чего не говорить)

- «memo и useMemo — одно и то же» — разные уровни: компонент vs значение
- «Нужно использовать везде для производительности» — преждевременная оптимизация; профилируйте сначала

### Связанные темы

- `029-rasskazhite-o-hukah-usecallback-usememo-useimperativehandle-uselayouteffect.md`
- `034-chto-delaet-metod-shouldcomponentupdate.md`
- `035-chto-takoe-purecomponent.md`
- `062-tekhniki-optimizacii-performansa-react.md`
