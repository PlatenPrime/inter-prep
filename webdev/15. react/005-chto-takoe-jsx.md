# Q005. Что Такое `JSX`?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**JSX (JavaScript XML)** — синтаксическое расширение JavaScript, позволяющее писать HTML-подобную разметку прямо в JS/TS-файлах. Это не HTML и не строки — JSX компилируется (через Babel/SWC) в вызовы `React.createElement()`, которые возвращают объекты-описания UI (React-элементы). JSX необязателен, но значительно повышает читаемость.

---

## Развёрнутый ответ

### Суть и определение

JSX — синтаксический сахар поверх `React.createElement(type, props, ...children)`. Он позволяет описывать дерево компонентов в декларативном, визуально близком к HTML стиле. Стандартом JSX является спецификация, поддерживаемая несколькими инструментами: Babel, SWC, TypeScript (с `jsx` опцией в `tsconfig.json`).

### Как это работает

**Шаг 1: Написание JSX**
```tsx
const element = <h1 className="title">Привет, {name}!</h1>;
```

**Шаг 2: Компиляция (Babel/SWC) → classic transform**
```js
const element = React.createElement(
  'h1',
  { className: 'title' },
  'Привет, ',
  name,
  '!'
);
```

**Шаг 3: automatic JSX transform (React 17+)**
```js
import { jsx as _jsx } from 'react/jsx-runtime';
const element = _jsx('h1', { className: 'title', children: `Привет, ${name}!` });
```

С React 17+ `import React from 'react'` больше не нужен в каждом файле с JSX.

**Результат:** обычный JavaScript-объект (React-элемент):
```js
{
  type: 'h1',
  props: { className: 'title', children: 'Привет, Мир!' },
  key: null,
  ref: null
}
```

### Практика и применение

- **Вся разработка UI** в React: компоненты, условный рендеринг, списки
- **TypeScript + JSX**: файлы `.tsx` — полная типизация props, событий, ref
- **Styled Components / Emotion** — CSS-in-JS использует JSX для стилизованных компонентов
- **Storybook** — интерактивная документация компонентов через JSX

### Важные нюансы и краеугольные камни

- JSX-атрибуты — camelCase: `className`, `htmlFor`, `onClick` (не `class`, `for`, `onclick`)
- Любое JSX-выражение должно иметь **один корневой элемент** или `<Fragment>`
- `{}` — вставка JavaScript-выражений; нельзя использовать операторы (if/for) напрямую — только тернарник, `&&`, функции, `.map()`
- JSX не экранирует значения `dangerouslySetInnerHTML` — это ручная операция (XSS-риск)
- Self-closing тэги обязательны для пустых элементов: `<img />`, `<br />`, `<Input />`

### Примеры

```tsx
// Условный рендеринг
const Notification: React.FC<{ count: number }> = ({ count }) => (
  <div>
    {count > 0 ? <span className="badge">{count}</span> : null}
    <span>Уведомления</span>
  </div>
);

// Список
const UserList: React.FC<{ users: string[] }> = ({ users }) => (
  <ul>
    {users.map((user, i) => (
      <li key={i}>{user}</li>
    ))}
  </ul>
);

// JSX без JSX (для понимания, что «под капотом»)
// Эквивалент <div className="box"><span>Текст</span></div>
React.createElement(
  'div',
  { className: 'box' },
  React.createElement('span', null, 'Текст')
);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Обязателен ли JSX?** — нет, можно использовать `React.createElement` напрямую, но JSX стандарт де-факто
- **Что такое automatic JSX transform?** — React 17+: компилятор сам добавляет нужный импорт, не нужен `import React`
- **Почему в JSX `className`, а не `class`?** — JSX — JS-расширение; `class` — зарезервированное слово в JS
- **Как JSX обрабатывает пробелы?** — пробелы между строками удаляются; явные пробелы нужно вставлять через `{' '}`

### Красные флаги (чего не говорить)

- «JSX — это HTML» — JSX компилируется в JS; атрибуты и поведение отличаются от HTML
- «Без JSX React не работает» — JSX необязателен, это только синтаксический сахар

### Связанные темы

- `006-raznica-mezhdu-jsx-i-html.md`
- `007-raznica-mezhdu-elementom-i-komponentom.md`
- `045-kak-otrenderet-html-kod-v-react-komponente.md`
