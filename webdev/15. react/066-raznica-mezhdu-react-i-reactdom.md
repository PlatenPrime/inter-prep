# Q066. Разница между `React` и `ReactDOM`?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

`React` — ядро библиотеки: определяет компоненты, хуки, JSX-трансформацию, Virtual DOM (`createElement`, `useState`, `useEffect` и т.д.). `ReactDOM` — связующее звено между React и браузерным DOM: монтирование (`createRoot`), гидрация (`hydrateRoot`), порталы (`createPortal`). Разделение позволяет использовать одно React-ядро для разных «платформ»: браузер (ReactDOM), мобайл (React Native), терминал (Ink), 3D (React Three Fiber).

---

## Развёрнутый ответ

### Суть и определение

React умышленно разделён на пакеты с разными задачами:

- **`react`** — платформо-независимое ядро: компонентная модель, хуки, reconciliation API
- **`react-dom`** — DOM-специфичный рендерер для браузера и Node.js (SSR)
- **`react-native`** — нативный рендерер для iOS/Android (вместо react-dom)

### API пакета `react`

```tsx
import React, {
  // Создание элементов
  createElement,
  cloneElement,
  isValidElement,
  Fragment,

  // Хуки
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
  useImperativeHandle,
  useId,
  useTransition,
  useDeferredValue,
  useSyncExternalStore,

  // Компонентный API
  forwardRef,
  memo,
  lazy,
  Suspense,
  StrictMode,

  // Типы (TypeScript)
  // FC, ReactNode, ReactElement, ComponentType...
} from 'react';
```

### API пакета `react-dom`

**Клиентский (react-dom/client):**
```tsx
import { createRoot, hydrateRoot } from 'react-dom/client';

// Монтирование React-приложения
const root = createRoot(document.getElementById('root')!);
root.render(<App />);

// Обновление
root.render(<App newProp />);

// Размонтирование
root.unmount();

// Гидрация SSR
const hydratedRoot = hydrateRoot(document.getElementById('root')!, <App />);
```

**Серверный (react-dom/server):**
```tsx
import {
  renderToString,             // синхронный
  renderToPipeableStream,     // Node.js стриминг
  renderToReadableStream,     // Web Streams
  renderToStaticMarkup,       // без React-атрибутов
} from 'react-dom/server';
```

**Общий (react-dom):**
```tsx
import {
  createPortal,              // рендер в другой DOM-узел
  flushSync,                 // синхронный flush обновлений
  findDOMNode,               // deprecated, не использовать
  unmountComponentAtNode,    // legacy API (v18: root.unmount())
} from 'react-dom';
```

### Почему разделение важно

```
react (ядро)
    ├── react-dom (браузер/SSR)
    ├── react-native (iOS/Android)
    ├── react-three-fiber (WebGL/Three.js)
    ├── ink (терминал/CLI)
    ├── react-pdf (PDF генерация)
    └── react-art (Canvas/SVG)
```

Все они используют одно и то же `react` ядро — хуки, компонентная модель, reconciliation. Только финальный рендеринг в разные среды — через специфичный renderer.

### История изменений

**React 16 → React 18:**
```tsx
// Legacy API (до React 18)
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));
// Sync рендер, без Concurrent Mode

// Современный API (React 18+)
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
// Concurrent Mode по умолчанию
```

### Практика и применение

- При написании кода компонентов — только `react`
- Точка входа приложения (монтирование) — `react-dom/client`
- SSR — `react-dom/server`
- Порталы — `react-dom` (createPortal)
- Тестирование — `@testing-library/react` (использует `react-dom` под капотом)

### Важные нюансы и краеугольные камни

- В **React 17** с automatic JSX transform `import React from 'react'` в каждом файле необязателен
- `flushSync` — принудительно синхронно обновить DOM (нарушает batch; только в особых случаях)
- `findDOMNode` — устарел и удалён в React 19; используйте `ref`
- React 18 `createRoot` включает Concurrent Mode; `ReactDOM.render` (legacy) — выключает

### Примеры

```tsx
// Минимальное React-приложение
// react: компоненты и хуки
import { useState } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
};

// react-dom: точка входа, DOM-специфика
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';

const root = createRoot(document.getElementById('root')!);
root.render(<Counter />);

// Портал — react-dom, не react
const Modal: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  createPortal(children, document.getElementById('modal-root')!);
```

---

## Сравнение

| Функциональность | `react` | `react-dom` |
|-----------------|---------|-------------|
| Хуки | ✅ | ❌ |
| JSX/createElement | ✅ | ❌ |
| memo, lazy, Suspense | ✅ | ❌ |
| Монтирование в DOM | ❌ | ✅ (createRoot) |
| SSR | ❌ | ✅ (renderTo*) |
| Порталы | ❌ | ✅ |
| Platform-specific | ❌ | ✅ (браузер/Node) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему React разделён на два пакета?** — разные платформы (web, mobile, terminal) используют одно ядро с разными рендерерами
- **Что изменилось между ReactDOM.render и createRoot?** — createRoot включает Concurrent Mode, автобатчинг, новые concurrent features
- **Зачем нужен flushSync?** — синхронное обновление DOM (например, при интеграции с non-React кодом); нарушает батчинг

### Красные флаги (чего не говорить)

- «React и ReactDOM — один и тот же пакет» — разные npm пакеты с разными задачами
- «React Native использует react-dom» — использует react-native renderer, не react-dom

### Связанные темы

- `061-chto-takoe-hydration-v-kontekste-servernogo-renderinga-react-prilozheniĭ.md`
- `065-chto-takoe-reactdomserver.md`
- `046-chto-takoe-portal.md`
