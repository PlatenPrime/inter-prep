# Q017. Что такое поднятие состояния вверх (Lifting State Up)?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Lifting State Up** — паттерн, при котором state перемещается из дочернего компонента в ближайшего общего предка, когда несколько компонентов должны разделять или синхронизировать одни и те же данные. Предок хранит состояние и передаёт его вниз через props; изменение происходит через callback-props, переданные от предка.

---

## Развёрнутый ответ

### Суть и определение

Принцип однонаправленного потока данных React означает, что state «принадлежит» конкретному компоненту. Когда два компонента нуждаются в одних данных, нужно найти их **ближайшего общего предка** и поднять state туда.

### Как это работает

**Проблема: два компонента синхронизируют температуру**

```tsx
// ❌ До поднятия: каждый компонент имеет свой state
const CelsiusInput = () => {
  const [celsius, setCelsius] = useState('');
  return <input value={celsius} onChange={e => setCelsius(e.target.value)} />;
};

const FahrenheitInput = () => {
  const [fahrenheit, setFahrenheit] = useState('');
  return <input value={fahrenheit} onChange={e => setFahrenheit(e.target.value)} />;
};
// Они не синхронизированы!
```

**Решение: поднять state к предку**
```tsx
// ✅ После поднятия: state в общем предке
const TemperatureConverter: React.FC = () => {
  const [celsius, setCelsius] = useState<string>('');

  const fahrenheit = celsius ? String((parseFloat(celsius) * 9) / 5 + 32) : '';

  return (
    <div>
      <TemperatureInput
        scale="celsius"
        value={celsius}
        onChange={setCelsius}
      />
      <TemperatureInput
        scale="fahrenheit"
        value={fahrenheit}
        onChange={f => setCelsius(String(((parseFloat(f) - 32) * 5) / 9))}
      />
    </div>
  );
};

interface TemperatureInputProps {
  scale: 'celsius' | 'fahrenheit';
  value: string;
  onChange: (value: string) => void;
}

const TemperatureInput: React.FC<TemperatureInputProps> = ({ scale, value, onChange }) => (
  <label>
    {scale === 'celsius' ? '°C' : '°F'}:
    <input value={value} onChange={e => onChange(e.target.value)} />
  </label>
);
```

### Практика и применение

- **Формы**: значения полей управляются родительским компонентом формы
- **Фильтры и список**: фильтр и отображаемые элементы — в одном предке
- **Табы и контент**: активная вкладка поднята в компонент, управляющий layout'ом
- **Wizard/multi-step**: данные шагов хранятся в корневом компоненте wizard'а

### Важные нюансы и краеугольные камни

- **Поднимать только при необходимости**: излишнее поднятие state создаёт лишние ре-рендеры в больших поддеревьях
- Если поднятие требует прохода через 3+ уровней — рассмотреть **Context** или **store**
- **Derived state**: не поднимать значения, которые вычисляются из других — лишний источник рассинхронизации
- Паттерн **«управляемый компонент»** (controlled component) — следствие lifting state up: компонент не имеет своего state, полностью управляется родителем

### Примеры

```tsx
// Реальный сценарий: фильтр + список
const ProductPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const filteredProducts = useProducts({ search, category });

  return (
    <div>
      <FilterPanel
        search={search}
        category={category}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
      />
      <ProductList products={filteredProducts} />
    </div>
  );
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда поднятие state — неправильное решение?** — при глубоком дереве; лучше Context или Zustand
- **Что значит «контролируемый компонент»?** — компонент без своего state; value и onChange приходят от родителя
- **Как избежать лишних ре-рендеров при поднятии?** — `React.memo` на дочерних компонентах, `useCallback` для callback-функций

### Красные флаги (чего не говорить)

- «Всегда поднимать state как можно выше» — поднимать только до ближайшего общего предка; не в App
- «Поднятие — то же что Context» — поднятие не добавляет глобального состояния; данные всё ещё локальны в предке

### Связанные темы

- `013-raznica-mezhdu-sostoyaniem-state-i-propsami-props.md`
- `014-chto-takoe-burenie-propsov-prop-drilling-kak-ego-izbezhat.md`
- `047-chto-takoe-kontekst-context.md`
- `053-raznica-mezhdu-kontroliruemym-controlled-i-nekontroliruemym-uncontrolled-komponentami.md`
