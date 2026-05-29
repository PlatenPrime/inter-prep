# Q042. Какие типы данных может возвращать `render`?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

`render()` (классовый) или тело функционального компонента может возвращать: **React-элементы** (JSX), **массивы** и **фрагменты** элементов, **строки** и **числа**, **порталы**, **булев false** и **null** (ничего не рендерится). В TypeScript это покрывается типом `React.ReactNode`.

---

## Развёрнутый ответ

### Суть и определение

React принимает несколько типов возвращаемых значений из компонента. Каждый обрабатывается по-разному.

### Все допустимые типы

**1. React-элемент (JSX) — основной случай**
```tsx
const Button: React.FC = () => <button>Click</button>;
```

**2. Массив элементов**
```tsx
const MultipleItems: React.FC = () => [
  <li key="1">Item 1</li>,
  <li key="2">Item 2</li>,
  <li key="3">Item 3</li>,
];
```

**3. Fragment (`<>...</>` или `<React.Fragment>`)**
```tsx
const TwoItems: React.FC = () => (
  <>
    <Header />
    <Main />
  </>
);
```

**4. Строка**
```tsx
const Label: React.FC = () => 'Привет, мир!';
// Рендерится как текстовый узел DOM
```

**5. Число**
```tsx
const Count: React.FC<{ n: number }> = ({ n }) => n;
// Рендерится как текст: "42"
```

**6. null — ничего не рендерить**
```tsx
const ConditionalWidget: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  return <Widget />;
};
```

**7. false, undefined — ничего не рендерить**
```tsx
// false и undefined допустимы, но не null-безопасны через тип
// В TypeScript: компонент должен возвращать ReactNode, который включает undefined
const Empty: React.FC = () => false; // допустимо
```

**8. Portal**
```tsx
const Modal: React.FC<{ children: ReactNode }> = ({ children }) =>
  ReactDOM.createPortal(children, document.getElementById('modal-root')!);
```

**9. React.lazy (через Suspense)**
```tsx
const LazyPage = React.lazy(() => import('./Page'));
// Возвращаемый тип — LazyExoticComponent, который является ReactNode
```

### Что НЕ допустимо

```tsx
// ❌ Объект (не React-элемент)
return { name: 'test' }; // ошибка

// ❌ Symbol
return Symbol('id');

// ❌ Несколько соседних элементов без обёртки
return <div>A</div> <div>B</div>; // syntax error в JSX
```

### TypeScript: React.ReactNode

```tsx
type ReactNode =
  | ReactElement      // JSX
  | string
  | number
  | boolean
  | null
  | undefined
  | ReactFragment     // массив или Fragment
  | ReactPortal;

// React.FC<P> возвращает ReactElement | null (в React 18)
// В более широком смысле — React.ReactNode
```

### Практика и применение

- **null** — для условного скрытия без CSS
- **Fragment** — когда нельзя обернуть в div (таблицы, flex-контейнеры)
- **Массив** — для компонентов типа `<dt>/<dd>` парами в составных компонентах
- **Строка** — для текстовых leaf-компонентов
- **Portal** — для модальных окон, тостов

### Важные нюансы и краеугольные камни

- `false`, `null`, `undefined` — **не рендерятся** как текст; `0`, `''` — **рендерятся** (пустой текстовый узел)
- Массивы элементов требуют `key` (как при `map()`)
- **React 18**: функциональные компоненты могут возвращать `undefined` (в React 17 — ошибка)
- `React.FC` в TS возвращает `ReactElement | null`, но тело компонента фактически может возвращать `ReactNode`

### Примеры

```tsx
// Компонент с несколькими типами возвращаемых значений
const FlexibleRenderer: React.FC<{
  type: 'element' | 'array' | 'string' | 'null' | 'portal';
}> = ({ type }) => {
  switch (type) {
    case 'element':
      return <div>Элемент</div>;
    case 'array':
      return [<span key="1">A</span>, <span key="2">B</span>];
    case 'string':
      return 'Просто строка';
    case 'null':
      return null;
    case 'portal':
      return ReactDOM.createPortal(
        <div>В другом DOM-узле</div>,
        document.body
      );
    default:
      return null;
  }
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница между null и false при возврате?** — оба не создают DOM-узла; null — явное «ничего»; false — иногда случайно попадает из условий
- **Почему 0 рендерится, а false нет?** — React рендерит числа (0 — число); false — булев и явно игнорируется
- **Как вернуть несколько элементов без обёртки?** — Fragment или массив с key

### Красные флаги (чего не говорить)

- «render должен возвращать только JSX» — допустимы null, string, number, array, portal
- «undefined нельзя вернуть» — в React 18 допустимо для функциональных компонентов

### Связанные темы

- `044-chto-takoe-fragment-pochemu-fragment-luchshe-chem-div.md`
- `046-chto-takoe-portal.md`
- `040-chto-takoe-uslovnyj-rendering-conditional-rendering-kak-ego-vypolnit.md`
