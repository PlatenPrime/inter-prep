# Q046. Что такое портал (`Portal`)?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Portal** (`ReactDOM.createPortal(children, container)`) позволяет рендерить дочерние элементы React **вне** DOM-иерархии родительского компонента, в произвольный DOM-узел. При этом компонент остаётся частью дерева React — работают event bubbling, context, refs. Используется для модальных окон, тостов, тултипов — чтобы избежать проблем с `overflow: hidden` и `z-index`.

---

## Развёрнутый ответ

### Суть и определение

Обычно React рендерит компонент внутри его DOM-предка. Portal разрывает эту связь на уровне DOM, но **сохраняет React-дерево**. Компонент-источник может читать Context, получать props и пробрасывать события — всё работает как без Portal.

### Как это работает

```tsx
// HTML структура:
// <body>
//   <div id="root">...</div>      ← React app монтируется здесь
//   <div id="modal-root"></div>   ← Portal цель
// </body>

import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // Рендеримся в #modal-root, но компонент остаётся в React-дереве
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()} // предотвратить закрытие при клике внутри
      >
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
};

// Использование (внутри глубоко вложенного компонента)
const DeepComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ overflow: 'hidden' }}> {/* overflow:hidden не мешает Modal */}
      <button onClick={() => setIsOpen(true)}>Открыть</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Заголовок модалки</h2>
        <p>Содержимое</p>
      </Modal>
    </div>
  );
};
```

### Зачем нужен Portal

**Проблема без Portal:**
- Модальное окно рендерится внутри `<div style="overflow:hidden">` → обрезается
- z-index модалки конфликтует с z-index родителей
- Модалка ограничена stacking context родителя

**Решение с Portal:**
- Рендер в `document.body` (или отдельный div) → не зависит от CSS родителей
- Полный контроль над z-index
- Backdrop перекрывает весь viewport

### Event Bubbling через Portal

```tsx
// Несмотря на разные DOM-позиции, события всплывают по React-дереву!
const App: React.FC = () => {
  const handleClick = () => console.log('App clicked');

  return (
    <div onClick={handleClick}>
      <Modal isOpen>
        <button onClick={() => console.log('Button clicked')}>
          Click me
        </button>
        {/* Клик по button → 'Button clicked' → 'App clicked' */}
        {/* Хотя в DOM: button → modal-root → body (не через App div!) */}
      </Modal>
    </div>
  );
};
```

### Практика и применение

- **Модальные окна**: защита от overflow/z-index
- **Тосты/уведомления**: фиксированные поверх всего
- **Тултипы/дропдауны**: позиционируются относительно viewport
- **Контекстные меню**: правый клик — меню поверх всего
- **Side drawers**: панель поверх основного контента

### Важные нюансы и краеугольные камни

- **Context работает** через Portal: компонент в Portal видит те же Context значения
- **Event bubbling** — по React-дереву, не по DOM-дереву
- При **SSR (Next.js)**: `document` недоступен на сервере → использовать динамический импорт или `useEffect` для mount
- Accessibility: модалки через Portal должны иметь `aria-modal`, `role="dialog"`, управление фокусом

### Примеры

```tsx
// Хук для Portal с SSR-совместимостью
const usePortal = (containerId = 'portal-root') => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(containerId);
    let created = false;

    if (!element) {
      element = document.createElement('div');
      element.id = containerId;
      document.body.appendChild(element);
      created = true;
    }

    setPortalElement(element);

    return () => {
      if (created && element) {
        document.body.removeChild(element);
      }
    };
  }, [containerId]);

  return portalElement;
};

// Компонент использует хук
const Tooltip: React.FC<{ text: string; children: React.ReactElement }> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const portalElement = usePortal('tooltip-root');

  if (!portalElement) return children;

  return (
    <>
      {React.cloneElement(children, {
        onMouseEnter: () => setIsVisible(true),
        onMouseLeave: () => setIsVisible(false),
      })}
      {isVisible && ReactDOM.createPortal(
        <div className="tooltip">{text}</div>,
        portalElement
      )}
    </>
  );
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему event bubbling работает через Portal?** — React управляет событиями через React-дерево, не DOM-иерархию (event delegation на root)
- **Как использовать Portal в SSR?** — lazy init: создавать DOM-узел в useEffect (клиентская сторона); условно рендерить через `typeof window !== 'undefined'`
- **Как обеспечить доступность модалки?** — focus trap, `aria-modal="true"`, `role="dialog"`, `aria-labelledby`

### Красные флаги (чего не говорить)

- «Portal создаёт отдельное React-дерево» — нет; компонент остаётся в том же дереве, только DOM-позиция другая
- «Context не работает через Portal» — работает полностью

### Связанные темы

- `047-chto-takoe-kontekst-context.md`
- `055-chto-takoe-sinteticheskie-sobytiya-syntheticevent-v-react.md`
- `042-kakie-tipy-dannyh-mozhet-vozvrashchat-render.md`
