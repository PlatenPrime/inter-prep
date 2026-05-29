# Q016. Как работает пропс `children` в React?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

`children` — специальный prop в React, содержащий всё, что передано между открывающим и закрывающим тегами компонента. Он может быть строкой, числом, React-элементом, массивом элементов или `null`. В TypeScript типизируется как `React.ReactNode`. Используется для компонентов-обёрток (Layout, Card, Modal), позволяя родителю контролировать контент.

---

## Развёрнутый ответ

### Суть и определение

`children` — это обычный prop с зарезервированным именем. React автоматически помещает в него содержимое JSX-тега:

```tsx
<Card>
  <h1>Заголовок</h1>      {/* это children */}
  <p>Описание</p>
</Card>
```

### Как это работает

```tsx
// Тип children в TypeScript
interface CardProps {
  title: string;
  children: React.ReactNode; // string | number | ReactElement | ReactFragment | null | undefined
}

const Card: React.FC<CardProps> = ({ title, children }) => (
  <div className="card">
    <h2>{title}</h2>
    <div className="card-body">{children}</div>
  </div>
);

// Использование
<Card title="Профиль">
  <Avatar src="/user.jpg" />
  <p>Описание пользователя</p>
</Card>
```

**Что может быть в `children`:**
- Строка: `<p>Hello</p>` — children = `"Hello"`
- Число: `<span>{42}</span>` — children = `42`
- React-элемент: `<Card><Button /></Card>`
- Массив: `<List>{items.map(i => <Item key={i.id} />)}</List>`
- `null`/`undefined` — ничего не рендерится

### Работа с children через React.Children API

```tsx
import React from 'react';

const TabGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // React.Children.count — количество дочерних элементов
  const count = React.Children.count(children);

  // React.Children.map — итерация (обрабатывает null/undefined/fragments)
  const tabs = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return null;
    // React.cloneElement — клонировать с добавленными props
    return React.cloneElement(child, { index, isFirst: index === 0 });
  });

  return <div className="tab-group">{tabs}</div>;
};
```

### Практика и применение

- **Layout-компоненты**: `<PageLayout>`, `<Section>`, `<Modal>` — принимают children для гибкости
- **Паттерн Compound Components**: `<Select>` + `<Select.Option>` — children как часть API
- **Render Props** (устаревший паттерн): `children` как функция: `<DataProvider>{data => <Table data={data} />}</DataProvider>`
- **Slot-like паттерн**: несколько именованных «слотов» через отдельные props вместо одного children

```tsx
// Slot-паттерн
interface DialogProps {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}
const Dialog: React.FC<DialogProps> = ({ header, footer, children }) => (
  <div>
    <header>{header}</header>
    <main>{children}</main>
    <footer>{footer}</footer>
  </div>
);
```

### Важные нюансы и краеугольные камни

- `React.Children.map` корректно обрабатывает `null`, `undefined`, массивы и Fragment — в отличие от `Array.from(children).map`
- `React.Children` API устаревает в пользу нативных паттернов (Context + компонентная композиция)
- `children` в TypeScript: для строго одного дочернего — `React.ReactElement`; для любого — `React.ReactNode`
- `children` как функция (render prop): `children: (data: T) => React.ReactNode` — мощный паттерн расшаривания логики

### Примеры

```tsx
// Render prop через children
interface MouseTrackerProps {
  children: (position: { x: number; y: number }) => React.ReactNode;
}

const MouseTracker: React.FC<MouseTrackerProps> = ({ children }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {children(pos)}
    </div>
  );
};

// Использование
<MouseTracker>
  {({ x, y }) => <span>x: {x}, y: {y}</span>}
</MouseTracker>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем React.Children.map отличается от Array.map?** — обрабатывает fragments, null, одиночные элементы; Array.map требует массив
- **Как передать несколько «слотов»?** — через именованные props: `header`, `footer`, `sidebar` вместо одного children
- **Что такое render prop паттерн?** — children как функция, возвращающая JSX; позволяет компоненту предоставлять данные рендерящему

### Красные флаги (чего не говорить)

- «children — всегда массив» — может быть единственным элементом, строкой или null
- «нельзя типизировать children» — в TypeScript `React.ReactNode` покрывает все случаи

### Связанные темы

- `013-raznica-mezhdu-sostoyaniem-state-i-propsami-props.md`
- `044-chto-takoe-fragment-pochemu-fragment-luchshe-chem-div.md`
- `036-chto-takoe-komponent-vysshego-poryadka-higher-order-component-hoc.md`
