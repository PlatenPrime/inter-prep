# Q043. Разница между `createElement()` и `cloneElement()`?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

`React.createElement(type, props, ...children)` создаёт **новый** React-элемент из типа и props. `React.cloneElement(element, newProps, ...children)` создаёт **копию** существующего элемента с возможностью переопределить или добавить props и children. `cloneElement` используется для добавления props к элементам, полученным извне (например, через `children`).

---

## Развёрнутый ответ

### Суть и определение

**`React.createElement(type, props, ...children)`:**
- Создаёт React-элемент с нуля
- `type` — строка (`'div'`) или компонент (`Button`)
- Это то, во что компилируется JSX

**`React.cloneElement(element, config, ...children)`:**
- Создаёт новый элемент на основе существующего
- Мержит `config` с props оригинала (новые props перезаписывают старые, `key`/`ref` из config имеют приоритет)
- Если `children` переданы — заменяют оригинальные children

### Как это работает

```tsx
// createElement — JSX компилируется в это:
const element = <Button className="primary" disabled>Click</Button>;
// Эквивалент:
const element = React.createElement(Button, { className: 'primary', disabled: true }, 'Click');
// Результат: { type: Button, props: { className: 'primary', disabled: true, children: 'Click' } }

// cloneElement — клонировать с добавлением props:
const cloned = React.cloneElement(element, { onClick: handleClick, className: 'secondary' });
// Результат: { type: Button, props: { className: 'secondary', disabled: true, onClick: handleClick, children: 'Click' } }
// className перезаписан, disabled и children сохранены
```

### Практика и применение

`cloneElement` используется в паттернах, где родительский компонент должен добавить props дочерним элементам, полученным через `children`.

**Пример: ButtonGroup добавляет variant всем кнопкам**
```tsx
interface ButtonGroupProps {
  variant: 'primary' | 'secondary';
  children: React.ReactElement | React.ReactElement[];
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ variant, children }) => (
  <div className="button-group">
    {React.Children.map(children, child => {
      if (!React.isValidElement(child)) return child;
      return React.cloneElement(child, { variant });
    })}
  </div>
);

// Использование: Button получит variant='primary' автоматически
<ButtonGroup variant="primary">
  <Button>Save</Button>
  <Button>Cancel</Button>
</ButtonGroup>
```

**Пример: форма добавляет name всем полям**
```tsx
const Form: React.FC<{ prefix: string; children: React.ReactElement[] }> = ({ prefix, children }) => (
  <form>
    {React.Children.map(children, (child, idx) =>
      React.cloneElement(child, { name: `${prefix}_${child.props.name || idx}` })
    )}
  </form>
);
```

### Современная альтернатива: Context

```tsx
// cloneElement — устаревающий паттерн; Context предпочтительнее
const ButtonGroupContext = React.createContext<{ variant: string } | null>(null);

const ButtonGroup: React.FC<{ variant: string; children: ReactNode }> = ({ variant, children }) => (
  <ButtonGroupContext.Provider value={{ variant }}>
    <div className="button-group">{children}</div>
  </ButtonGroupContext.Provider>
);

const Button: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ctx = React.useContext(ButtonGroupContext);
  return <button className={ctx?.variant}>{children}</button>;
};
```

### Важные нюансы и краеугольные камни

- `cloneElement` **устаревает** в пользу Context: React документация отмечает, что `cloneElement` затрудняет отслеживание потока данных
- Мерж props: новые props объединяются со старыми; `key` и `ref` берутся из `config` если переданы
- `React.isValidElement(child)` — обязательная проверка перед cloneElement (children может быть строкой)
- TypeScript: тип `React.cloneElement` возвращает `React.ReactElement` — нужен правильный generic

### Примеры

```tsx
// createElement — всегда в JSX под капотом
const el = React.createElement(
  'section',
  { id: 'main', className: 'container' },
  React.createElement('h1', null, 'Title'),
  React.createElement('p', null, 'Content')
);

// cloneElement — добавить ref к элементу из children
const WithRef: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const ref = useRef<HTMLElement>(null);
  return React.cloneElement(children, { ref });
};
```

---

## Сравнение

| Критерий | `createElement` | `cloneElement` |
|----------|-----------------|----------------|
| Создаёт | Новый элемент | Копию существующего |
| Источник props | Только переданные | Слияние существующих + новых |
| Использование | Компиляция JSX | Добавление props к children |
| Тренд | Стандарт | Устаревает в пользу Context |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему cloneElement устаревает?** — неявный поток данных; Context + hooks решают то же прозрачнее
- **Как cloneElement мержит props?** — shallow merge: новые перезаписывают старые; вложенные объекты не глубоко мержатся
- **Как проверить, является ли child React-элементом?** — `React.isValidElement(child)`

### Красные флаги (чего не говорить)

- «cloneElement мутирует оригинальный элемент» — создаёт новый элемент; оригинал иммутабелен
- «createElement — ручная работа, лучше не использовать» — нормально для динамического создания элементов

### Связанные темы

- `005-chto-takoe-jsx.md`
- `007-raznica-mezhdu-elementom-i-komponentom.md`
- `016-kak-rabotaet-props-children-v-react.md`
- `047-chto-takoe-kontekst-context.md`
