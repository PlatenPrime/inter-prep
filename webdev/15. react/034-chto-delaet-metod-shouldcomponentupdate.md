# Q034. Что делает метод `shouldComponentUpdate`?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

`shouldComponentUpdate(nextProps, nextState)` — метод классового компонента, возвращающий `boolean`. Если вернуть `false` — React пропустит ре-рендер и не вызовет `render()`. Используется для ручной оптимизации производительности. В функциональных компонентах аналог — `React.memo`; более автоматический вариант — `PureComponent`.

---

## Развёрнутый ответ

### Суть и определение

По умолчанию React перерисовывает компонент при каждом изменении props или state родителя, даже если фактические данные не изменились. `shouldComponentUpdate` даёт разработчику контроль: «нужно ли обновлять компонент сейчас?».

### Как это работает

```tsx
class UserCard extends React.Component<UserCardProps, UserCardState> {
  shouldComponentUpdate(nextProps: UserCardProps, nextState: UserCardState): boolean {
    // Рендеримся только если изменились значимые данные
    return (
      nextProps.userId !== this.props.userId ||
      nextProps.userName !== this.props.userName ||
      nextState.isExpanded !== this.state.isExpanded
    );
  }

  render() {
    console.log('UserCard rendered'); // реже вызывается
    return (
      <div>
        <h2>{this.props.userName}</h2>
        {this.state.isExpanded && <UserDetails id={this.props.userId} />}
      </div>
    );
  }
}
```

**Поток при false:**
```
setState/новые props
  → shouldComponentUpdate → false
  → СТОП (render не вызывается, getDerivedStateFromProps — не вызывается)
  → нет обновления DOM
```

**Поток при true:**
```
setState/новые props
  → shouldComponentUpdate → true
  → render()
  → reconciliation
  → commit (если есть изменения)
```

### Альтернативы

**PureComponent** — автоматический shallow comparison:
```tsx
// Эквивалент: shouldComponentUpdate = shallow compare props + state
class UserCard extends React.PureComponent<UserCardProps, UserCardState> {
  // shouldComponentUpdate реализован автоматически (shallow)
  render() { return <div>{this.props.userName}</div>; }
}
```

**React.memo** (функциональные компоненты):
```tsx
const UserCard = React.memo<UserCardProps>(({ userId, userName }) => (
  <div>{userName}</div>
));

// С пользовательским сравнением
const UserCard = React.memo<UserCardProps>(
  ({ userId, userName }) => <div>{userName}</div>,
  (prevProps, nextProps) => prevProps.userId === nextProps.userId
);
```

### Практика и применение

- **До React.memo** — основной инструмент оптимизации рендеринга в классах
- Полезен когда: объект props имеет сложную структуру и нужна **глубокая** проверка (PureComponent не поможет)
- Нужен когда рендер компонента **измеримо дорогой** — проверяйте через React DevTools Profiler

### Важные нюансы и краеугольные камни

- `shouldComponentUpdate` **не вызывается** при первом рендере
- Возврат `false` не предотвращает ре-рендер **дочерних компонентов** — только сам компонент
- Сравнение объектов по значению (deep equal) в shouldComponentUpdate само по себе может быть дорогим
- **Не мутируйте props/state**: `this.props.user.name = 'new'` — shallow compare не обнаружит изменение

### Примеры

```tsx
// Пример глубокого сравнения (используйте с осторожностью)
class DeepCompareComponent extends React.Component<{ config: Config }> {
  shouldComponentUpdate(nextProps: { config: Config }) {
    // JSON.stringify — плохая идея для production (порядок ключей, undefined, circular)
    // Лучше: библиотека fast-deep-equal
    return !isEqual(this.props.config, nextProps.config);
  }
  render() { return <ConfigView config={this.props.config} />; }
}

// ✅ В современном коде — React.memo + useMemo
const ConfigView = React.memo<{ config: Config }>(
  ({ config }) => <div>{config.name}</div>,
  (prev, next) => prev.config.id === next.config.id && prev.config.version === next.config.version
);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем PureComponent отличается от shouldComponentUpdate?** — PureComponent реализует shallow SCU автоматически; SCU даёт полный контроль
- **Как shouldComponentUpdate соотносится с React.memo?** — идентичная цель для разных типов компонентов
- **Какие риски в неправильном SCU?** — вернуть `false` когда надо `true` → UI не обновится (silent bug)

### Красные флаги (чего не говорить)

- «shouldComponentUpdate — единственный способ оптимизировать рендеринг» — React.memo, useMemo, useCallback, React 19 Compiler — современные альтернативы
- «Стоит добавлять SCU во все компоненты» — преждевременная оптимизация; измеряйте сначала

### Связанные темы

- `031-raznica-mezhdu-memo-i-usememo.md`
- `035-chto-takoe-purecomponent.md`
- `062-tekhniki-optimizacii-performansa-react.md`
