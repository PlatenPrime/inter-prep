# Q029. Что такое JSX в TypeScript? Какие режимы JSX поддерживает TypeScript?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

**JSX** в TypeScript — это поддержка синтаксиса JSX (XML-подобные теги в JavaScript/TypeScript) в `.tsx` файлах. TypeScript понимает JSX нативно и предоставляет 5 режимов трансформации через опцию `jsx` в `tsconfig.json`: `preserve`, `react`, `react-jsx`, `react-jsxdev`, `react-native`. Наиболее актуальный — `react-jsx` (React 17+, без `import React`).

---

## Развёрнутый ответ

### Суть и определение

JSX — синтаксическое расширение JavaScript: XML-теги, вложенные прямо в код. TypeScript поддерживает JSX в файлах с расширением `.tsx`. Компилятор преобразует JSX-теги в вызовы функций согласно выбранному режиму.

### Как это работает

#### Базовый синтаксис JSX в TypeScript

```tsx
// Button.tsx — используем .tsx для JSX
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false, variant = "primary" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};

export default Button;
```

#### Режимы JSX (`tsconfig.json "jsx"`)

**1. `preserve`**

```tsx
// Вход:
const el = <div className="box">Hello</div>;

// Выход (JSX не трансформируется):
const el = <div className="box">Hello</div>;
```
Используется с Babel/SWC — они трансформируют JSX отдельно. TypeScript только проверяет типы.

---

**2. `react` (React 16 и старше)**

```tsx
// Вход:
const el = <div>Hello</div>;

// Выход:
const el = React.createElement("div", null, "Hello");
// Требует: import React from "react" в каждом файле
```

---

**3. `react-jsx` (React 17+, рекомендуется)**

```tsx
// Вход:
const el = <div>Hello</div>;

// Выход:
import { jsx as _jsx } from "react/jsx-runtime";
const el = _jsx("div", { children: "Hello" });
// НЕ требует import React в каждом файле!
```

---

**4. `react-jsxdev`**

Как `react-jsx`, но использует `react/jsx-dev-runtime` — добавляет информацию для отладки (имя файла, номер строки, компонент).

```tsx
// Выход включает дебаг-инфо:
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
const el = _jsxDEV("div", { children: "Hello" }, undefined, false, {
  fileName: "/app/Button.tsx",
  lineNumber: 5,
  columnNumber: 12,
}, this);
```

---

**5. `react-native`**

Аналог `preserve` для Metro bundler React Native. JSX сохраняется, трансформацией занимается Metro.

---

#### Полная таблица режимов

| Режим | Трансформация | Требует `import React` | Используется с |
|-------|--------------|----------------------|----------------|
| `preserve` | Нет | Да (если нужен) | Babel, SWC |
| `react` | `React.createElement` | Да | React 16, webpack |
| `react-jsx` | `jsx` из `react/jsx-runtime` | Нет | React 17+, Vite |
| `react-jsxdev` | `jsxDEV` с дебаг-инфо | Нет | React 17+ dev |
| `react-native` | Нет (как preserve) | — | React Native Metro |

#### Настройка tsconfig для React + Vite

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true
  }
}
```

#### Типизация JSX в TypeScript

TypeScript проверяет JSX-элементы через глобальный namespace `JSX`:

```tsx
// Типы пропсов — полностью типизированы
interface CardProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}

function Card({ title, children, onClose }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
      {onClose && (
        <button onClick={onClose}>×</button>
      )}
    </div>
  );
}

// Использование — TS проверяет типы пропсов:
<Card title="Hello">Content</Card>  // OK
<Card>Content</Card>                 // Error: 'title' is required
<Card title={42}>Content</Card>      // Error: number не string
```

#### Generic компоненты в TSX

```tsx
// Проблема: <T> — конфликт с JSX
function identity<T>(value: T): T { return value; }

// Решение 1: добавить запятую (только в .tsx)
const List = <T,>({ items }: { items: T[] }) => (
  <ul>{items.map((item, i) => <li key={i}>{String(item)}</li>)}</ul>
);

// Решение 2: extends constraint
const Select = <T extends string | number>({ options }: { options: T[] }) => (
  <select>{options.map(o => <option key={o} value={o}>{o}</option>)}</select>
);
```

### Практика и применение

- **Vite + React**: `jsx: "react-jsx"` — стандарт; не нужен `import React` в каждом файле
- **Next.js**: настраивается автоматически через `next/tsconfig.json`
- **Storybook/Jest**: обычно `preserve` + Babel для трансформации тестов
- **React Native**: `react-native` режим; Metro bundler делает остальное

### Важные нюансы и краеугольные камни

- **`.tsx` vs `.ts`**: JSX только в `.tsx`; в `.ts` файлах `<T>` — это generic, не JSX-тег
- **`jsxImportSource`**: можно изменить источник JSX runtime, например для Preact: `"jsxImportSource": "preact"`
- **Solid.js / Vue JSX**: меняют `jsxImportSource` на свой runtime
- **`@jsxRuntime`** pragma в файле: `/** @jsxRuntime classic */` — переопределяет режим для конкретного файла
- При `react` режиме и `strict: true` React должен быть в области видимости каждого JSX-файла

### Примеры

```tsx
// Реальный компонент: полная типизация
import { useState, useCallback } from "react";

interface UseDisclosureReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

function useDisclosure(initial = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(initial);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  return { isOpen, open, close, toggle };
}

interface ModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

function Modal({ title, children, isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <div className="modal-body">{children}</div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Зачем нужен `react-jsx` вместо `react`?** — не нужен `import React from "react"` в каждом файле; меньше boilerplate; нативно поддерживается React 17+
- **Почему `.tsx`, а не `.ts` для React компонентов?** — в `.ts` `<T>` воспринимается как generic; в `.tsx` — как JSX-тег
- **Как типизировать `children` пропсы?** — `React.ReactNode` для любого JSX; `React.ReactElement` для JSX-элемента; `string` для только строки
- **Что такое `jsxImportSource`?** — позволяет использовать JSX с другими библиотеками (Preact, Solid) без замены всего React

### Красные флаги (чего не говорить)

- «JSX работает в обычных `.ts` файлах» — нет, только в `.tsx`; в `.ts` `<T>` — generic syntax
- «`react-jsx` требует нового React» — нужен React 17+; в React 16 нужен `react` режим + `import React`
- «Source maps не работают с JSX» — работают; TypeScript корректно генерирует source maps для JSX

### Связанные темы

- `028-map-fajl.md`
- `002-osnovnye-komponenty-typescript.md`
- `013-genericheskie-tipy-generic.md`
