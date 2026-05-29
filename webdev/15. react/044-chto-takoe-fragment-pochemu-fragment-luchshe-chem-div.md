# Q044. Что такое фрагмент (`Fragment`)? Почему фрагмент лучше, чем `div`?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Fragment** (`<React.Fragment>` или сокращённо `<>...</>`) — способ вернуть несколько элементов из компонента без создания лишнего DOM-узла. Лучше `div` потому что не добавляет ненужный контейнер в DOM, не ломает HTML-семантику (таблицы, flex/grid контейнеры) и не влияет на CSS.

---

## Развёрнутый ответ

### Суть и определение

JSX требует единого корневого элемента. До Fragment разработчики оборачивали всё в `<div>`, что засоряло DOM. Fragment позволяет группировать элементы «виртуально» — без реального DOM-узла.

### Как это работает

```tsx
// ❌ Лишний div: 3 уровня вместо 2
const UserInfo: React.FC<{ user: User }> = ({ user }) => (
  <div> {/* лишний узел в DOM */}
    <dt>Имя</dt>
    <dd>{user.name}</dd>
  </div>
);

// ✅ Fragment: не создаёт DOM-узла
const UserInfo: React.FC<{ user: User }> = ({ user }) => (
  <>
    <dt>Имя</dt>
    <dd>{user.name}</dd>
  </>
);
```

**Полная форма `<React.Fragment>` — нужна для `key`:**
```tsx
const DefinitionList: React.FC<{ items: { term: string; def: string }[] }> = ({ items }) => (
  <dl>
    {items.map(item => (
      <React.Fragment key={item.term}> {/* <> не поддерживает key! */}
        <dt>{item.term}</dt>
        <dd>{item.def}</dd>
      </React.Fragment>
    ))}
  </dl>
);
```

### Почему Fragment лучше div

**1. Не ломает семантику HTML:**
```tsx
// ❌ Неправильная структура таблицы
const TableRows: React.FC<{ data: Row[] }> = ({ data }) => (
  <div> {/* div внутри tbody — невалидный HTML */}
    {data.map(row => <tr key={row.id}><td>{row.name}</td></tr>)}
  </div>
);

// ✅ Fragment
const TableRows: React.FC<{ data: Row[] }> = ({ data }) => (
  <>
    {data.map(row => <tr key={row.id}><td>{row.name}</td></tr>)}
  </>
);
```

**2. Не ломает Flexbox/Grid:**
```tsx
// ❌ div нарушает flex-контейнер — flex-item неожиданно добавлен
const FlexItems: React.FC = () => (
  <div>           {/* новый flex-item! */}
    <span>A</span>
    <span>B</span>
  </div>
);

// ✅ Fragment прозрачен для flex-родителя
const FlexItems: React.FC = () => (
  <>
    <span>A</span>
    <span>B</span>
  </>
);
```

**3. Производительность:**
- Меньше DOM-узлов → меньше работы для browser layout engine
- Для больших списков разница заметна

**4. Стилизация:**
- Нет нежелательного наследования стилей
- Нет margin/padding от «невидимого» div

### Практика и применение

- **Таблицы**: `<tr>`, `<th>`, `<td>` не принимают `<div>` как родителей
- **Списки определений**: `<dt>` + `<dd>` парами
- **Compound components**: части компонента без обёртки
- **Multiple returns**: компонент возвращает 2+ несвязанных блока

### Важные нюансы и краеугольные камни

- `<>...</>` **не принимает `key`** и props — только `<React.Fragment key={...}>`
- Fragment компилируется в `React.createElement(React.Fragment, null, ...children)`
- В DevTools Fragment не отображается как узел — не видно в дереве (это и хорошо)
- `React.Fragment` можно использовать для wrapping в TypeScript: `React.ReactFragment` тип

### Примеры

```tsx
// Fragment в функции возвращающей несколько элементов
const AddressBlock: React.FC<{ address: Address }> = ({ address }) => (
  <>
    <p>{address.street}</p>
    <p>{address.city}, {address.zip}</p>
    <p>{address.country}</p>
  </>
);

// Использование в таблице
const ProductTable: React.FC<{ products: Product[] }> = ({ products }) => (
  <table>
    <tbody>
      {products.map(p => (
        <React.Fragment key={p.id}>
          <tr className="main-row">
            <td>{p.name}</td>
            <td>{p.price}</td>
          </tr>
          <tr className="detail-row">
            <td colSpan={2}>{p.description}</td>
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  </table>
);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `<>` не принимает key?** — shorthand синтаксис для простого использования; для key нужна полная форма
- **Создаёт ли Fragment DOM-узел?** — нет; это только группировка в Virtual DOM
- **Чем Fragment отличается от `React.StrictMode`?** — StrictMode — утилита для проверок; Fragment — группировка элементов

### Красные флаги (чего не говорить)

- «Fragment и div одинаково влияют на DOM» — Fragment не создаёт DOM-узла; div создаёт
- «`<>` и `<React.Fragment>` полностью идентичны» — `<>` не поддерживает `key` и другие props

### Связанные темы

- `042-kakie-tipy-dannyh-mozhet-vozvrashchat-render.md`
- `041-dlya-chego-nuzhen-atribut-key-pri-rendere-spiskov.md`
- `040-chto-takoe-uslovnyj-rendering-conditional-rendering-kak-ego-vypolnit.md`
