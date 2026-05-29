# Q056. Что такое события указателя (Pointer Events)?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Pointer Events** — унифицированный W3C API для обработки всех типов указателей: мыши, касаний (touch) и стилуса. React поддерживает их через `onPointerDown`, `onPointerMove`, `onPointerUp` и другие обработчики. Заменяют раздельные Mouse Events и Touch Events для поддержки любых устройств ввода в одном обработчике.

---

## Развёрнутый ответ

### Суть и определение

До Pointer Events разработчики писали двойной код: для мыши (`mousedown`, `mousemove`, `mouseup`) и для тач-устройств (`touchstart`, `touchmove`, `touchend`). Pointer Events объединяют их в единый API, который работает для мыши, сенсорных экранов и стилусов.

### Поддерживаемые события в React

| React prop | Нативное событие | Триггер |
|------------|-----------------|---------|
| `onPointerDown` | `pointerdown` | Нажатие любого указателя |
| `onPointerMove` | `pointermove` | Движение указателя |
| `onPointerUp` | `pointerup` | Отпускание |
| `onPointerCancel` | `pointercancel` | Прерывание (звонок, жест системы) |
| `onPointerEnter` | `pointerenter` | Вход в элемент |
| `onPointerLeave` | `pointerleave` | Выход из элемента |
| `onPointerOver` | `pointerover` | Над элементом или потомком |
| `onPointerOut` | `pointerout` | Уход с элемента |
| `onGotPointerCapture` | `gotpointercapture` | Захват указателя |
| `onLostPointerCapture` | `lostpointercapture` | Потеря захвата |

### PointerEvent — дополнительные свойства

```tsx
const DrawingCanvas: React.FC = () => {
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Доступные свойства PointerEvent
    console.log(e.pointerId);    // уникальный ID указателя
    console.log(e.pointerType);  // 'mouse' | 'touch' | 'pen'
    console.log(e.isPrimary);    // основной указатель при мультитач
    console.log(e.pressure);     // давление (0-1, для стилуса)
    console.log(e.tiltX);        // наклон стилуса
    console.log(e.width);        // ширина области контакта (touch)
    console.log(e.height);       // высота области контакта
  };

  return <canvas onPointerDown={handlePointerDown} />;
};
```

### Практика и применение

**Drag & Drop:**
```tsx
const DraggableItem: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    // Pointer capture: все события направляются на этот элемент
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={elementRef}
      style={{ transform: `translate(${position.x}px, ${position.y}px)`, cursor: isDragging ? 'grabbing' : 'grab' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp} // обработать прерывание
    >
      Перетащи меня
    </div>
  );
};
```

**Рисование на canvas (мультиустройственное):**
```tsx
const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getPos(e);
    ctx.lineWidth = e.pressure * 10; // давление стилуса → толщина линии
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => { isDrawing.current = false; }}
      style={{ touchAction: 'none' }} // отключить scroll при рисовании
    />
  );
};
```

### Важные нюансы и краеугольные камни

- **`touch-action: none`** в CSS — для canvas/drag: предотвращает нативный скролл при touch
- **Pointer Capture** (`setPointerCapture`) — события продолжают поступать в элемент, даже если указатель ушёл за его границы (drag beyond element)
- Pointer Events поддерживаются всеми современными браузерами
- `onPointerCancel` — обрабатывать: отключение экрана, входящий звонок прерывают touch

### Примеры

```tsx
// Hover-эффект, работающий и на touch
const HoverCard: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={`card ${isActive ? 'card-active' : ''}`}
      onPointerEnter={() => setIsActive(true)}
      onPointerLeave={() => setIsActive(false)}
    >
      Контент
    </div>
  );
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем Pointer Events лучше Mouse + Touch Events?** — единый API, нет дублирования кода, поддержка стилуса, давление, tilt
- **Что такое pointer capture?** — привязка дальнейших pointer events к конкретному элементу, даже если указатель покинул элемент
- **Зачем `touch-action: none`?** — предотвращает нативную обработку touch браузером (scroll, zoom), чтобы JS мог обработать события

### Красные флаги (чего не говорить)

- «Для touch нужны Touch Events» — Pointer Events покрывают touch; Touch Events — legacy
- «Pointer Events не работают на мобильных» — поддержка всех современных браузеров включая Safari 13+

### Связанные темы

- `055-chto-takoe-sinteticheskie-sobytiya-syntheticevent-v-react.md`
