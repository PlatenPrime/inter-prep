# Q035. Что такое `PureComponent`?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

`PureComponent` — базовый класс React (альтернатива `React.Component`), автоматически реализующий `shouldComponentUpdate` через **shallow comparison** props и state. Если ни один prop и ни одно поле state не изменились (по ссылке), ре-рендер пропускается. Функциональный аналог — `React.memo`.

---

## Развёрнутый ответ

### Суть и определение

`React.PureComponent` идентичен `React.Component`, но реализует `shouldComponentUpdate` с shallow (поверхностным) сравнением:

```
prevProps !== nextProps (shallow) || prevState !== nextState (shallow) → рендер
prevProps === nextProps (shallow) && prevState === nextState (shallow) → пропустить
```

**Shallow comparison** — сравнивает каждое поле верхнего уровня объекта по ссылке (===):

```js
// { a: 1, b: 'hello' }  ===  { a: 1, b: 'hello' }
// → true: каждое поле a===a, b===b

// { user: { name: 'Alice' } }  ===  { user: { name: 'Alice' } }
// → false если user — разные ссылки (даже если содержимое одинаковое)
```

### Как это работает

```tsx
// Component: всегда ре-рендерится при props/state изменении у родителя
class SimpleList extends React.Component<{ items: string[] }> {
  render() {
    console.log('SimpleList rendered');
    return <ul>{this.props.items.map((i, idx) => <li key={idx}>{i}</li>)}</ul>;
  }
}

// PureComponent: пропустит рендер если items — та же ссылка
class OptimizedList extends React.PureComponent<{ items: string[] }> {
  render() {
    console.log('OptimizedList rendered'); // вызовется реже
    return <ul>{this.props.items.map((i, idx) => <li key={idx}>{i}</li>)}</ul>;
  }
}

// Родитель
class Parent extends React.Component {
  state = { items: ['a', 'b', 'c'], counter: 0 };

  render() {
    return (
      <>
        <button onClick={() => this.setState(s => ({ counter: s.counter + 1 }))}>
          Count: {this.state.counter}
        </button>
        {/* SimpleList ре-рендерится при каждом клике */}
        <SimpleList items={this.state.items} />
        {/* OptimizedList НЕ ре-рендерится — items та же ссылка */}
        <OptimizedList items={this.state.items} />
      </>
    );
  }
}
```

### Ловушка PureComponent с мутациями

```tsx
// ❌ Антипаттерн: мутация массива
handleAddItem = () => {
  this.state.items.push('d'); // мутируем ту же ссылку!
  this.setState({ items: this.state.items });
  // PureComponent: prevProps.items === nextProps.items (та же ссылка)
  // → рендер пропускается → UI не обновляется!
};

// ✅ Иммутабельное обновление
handleAddItem = () => {
  this.setState(prev => ({ items: [...prev.items, 'd'] })); // новая ссылка → ре-рендер
};
```

### Практика и применение

- **Тяжёлые списки** с часто обновляющимся родителем: без PureComponent каждый элемент списка перерендеривается
- **Display-only компоненты**: карточки пользователей, строки таблицы — данные редко меняются
- **В современном коде**: `PureComponent` заменяется `React.memo` при переходе на функциональные компоненты

### Важные нюансы и краеугольные камни

- `PureComponent` не делает **глубокое** сравнение — вложенные объекты/массивы по ссылке
- **Нельзя переопределять `shouldComponentUpdate`** в PureComponent (ESLint предупреждает)
- Shallow comparison само по себе — это O(n) по числу полей props; не бесплатно для широких props
- **Иммутабельность** данных — обязательное условие корректной работы PureComponent

### Примеры

```tsx
interface TableRowProps {
  row: { id: string; name: string; value: number };
  onSelect: (id: string) => void;
}

// ✅ PureComponent — оптимальный выбор для строк таблицы
class TableRow extends React.PureComponent<TableRowProps> {
  render() {
    const { row, onSelect } = this.props;
    return (
      <tr onClick={() => onSelect(row.id)}>
        <td>{row.name}</td>
        <td>{row.value}</td>
      </tr>
    );
  }
}

// Функциональный эквивалент
const TableRowFn = React.memo<TableRowProps>(({ row, onSelect }) => (
  <tr onClick={() => onSelect(row.id)}>
    <td>{row.name}</td>
    <td>{row.value}</td>
  </tr>
));
```

---

## Сравнение

| Критерий | `React.Component` | `React.PureComponent` | `React.memo` |
|----------|-------------------|------------------------|--------------|
| Тип | Классовый | Классовый | Функциональный HOC |
| shouldComponentUpdate | Всегда true | Shallow compare | Shallow (или custom) |
| Настройка сравнения | Через SCU | Нельзя | Второй аргумент |
| Иммутабельность | Необязательна | Обязательна | Обязательна |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем PureComponent опасен?** — мутация state/props → невидимые баги с пропуском рендера
- **Как глубоко сравнивает PureComponent?** — только первый уровень (shallow); вложенные объекты — по ссылке
- **Почему React.memo предпочтительнее?** — работает с функциональными компонентами; можно настроить кастомное сравнение

### Красные флаги (чего не говорить)

- «PureComponent делает глубокое сравнение» — только shallow; глубокая проверка требует ручного shouldComponentUpdate
- «Мутация state безопасна в PureComponent» — это главная ловушка, приводящая к не обновляющемуся UI

### Связанные темы

- `031-raznica-mezhdu-memo-i-usememo.md`
- `034-chto-delaet-metod-shouldcomponentupdate.md`
- `008-raznica-mezhdu-klassovym-i-funkcionalnym-komponentami.md`
