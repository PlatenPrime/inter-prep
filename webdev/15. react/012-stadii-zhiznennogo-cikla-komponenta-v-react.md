# Q012. Стадии жизненного цикла компонента в React?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

Жизненный цикл компонента состоит из трёх основных стадий: **Mounting** (монтирование — создание и добавление в DOM), **Updating** (обновление — ре-рендер при изменении state/props) и **Unmounting** (размонтирование — удаление из DOM). В React 16+ добавились фазы **render** и **commit** как внутреннее разделение между вычислением Virtual DOM и применением изменений.

---

## Развёрнутый ответ

### Суть и определение

React разделяет жизненный цикл на **внешние стадии** (видимые разработчику) и **внутренние фазы** движка (render phase / commit phase).

### Как это работает

**1. Mounting (монтирование)**
```
constructor
  ↓
getDerivedStateFromProps
  ↓
render → Virtual DOM
  ↓
[commit: DOM вставка]
  ↓
componentDidMount / useEffect(fn, [])
```

**2. Updating (обновление)** — при изменении state или props:
```
getDerivedStateFromProps
  ↓
shouldComponentUpdate → false → стоп (нет ре-рендера)
  ↓ true
render → Virtual DOM
  ↓
getSnapshotBeforeUpdate
  ↓
[commit: DOM патч]
  ↓
componentDidUpdate / useEffect(fn, [deps])
```

**3. Unmounting (размонтирование):**
```
componentWillUnmount / useEffect cleanup
  ↓
[DOM удаление]
```

**4. Error Handling (при ошибке в дочернем компоненте):**
```
getDerivedStateFromError → обновить state
componentDidCatch → логирование
```

### Внутренние фазы React (Fiber)

**Render phase** (прерываемая в Concurrent Mode):
- Вычисление дерева компонентов
- Запуск функции компонента / render()
- Diff с предыдущим деревом

**Commit phase** (синхронная, не прерываемая):
- `before mutation`: getSnapshotBeforeUpdate
- `mutation`: реальное изменение DOM
- `layout`: componentDidMount/componentDidUpdate, useLayoutEffect

**Passive effects** (после paint):
- `useEffect` callbacks (асинхронно после отрисовки)

### Практика и применение

- **Mounting** → инициализация: fetch данных, WebSocket подписка, event listeners
- **Updating** → синхронизация: обновить данные при изменении props.id
- **Unmounting** → очистка: отмена запросов, отписка, очистка таймеров
- **Error boundary** → graceful degradation при ошибке поддерева

### Важные нюансы и краеугольные камни

- Render phase **может вызываться несколько раз** без commit (Concurrent Mode прерывает и повторяет)
- Commit phase **всегда синхронна** — никогда не прерывается
- `useLayoutEffect` выполняется **до** `useEffect`, синхронно после DOM-мутации (аналог componentDidMount по тайминг)
- StrictMode в dev: mounting → unmounting → mounting снова — для выявления несброшенных подписок

### Примеры

```tsx
// Визуализация стадий через хуки
const LifecycleDemo: React.FC<{ id: string }> = ({ id }) => {
  const renderCount = useRef(0);
  renderCount.current++;

  // MOUNT + UPDATE (при смене id)
  useEffect(() => {
    console.log(`Mounted/Updated: id=${id}`);
    return () => {
      console.log(`Cleanup before next effect or unmount: id=${id}`);
    };
  }, [id]);

  // MOUNT only
  useEffect(() => {
    console.log('Mounted once');
    return () => console.log('Unmounted');
  }, []);

  // Выполняется при КАЖДОМ рендере (render phase)
  console.log(`Render #${renderCount.current}`);

  return <div>id: {id}</div>;
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница render phase и commit phase?** — render вычисляет что изменилось (прерываемо), commit применяет изменения к DOM (синхронно)
- **Когда используется useLayoutEffect вместо useEffect?** — когда нужно синхронно прочитать/изменить DOM до отрисовки браузером (измерения, позиционирование)
- **Что произойдёт при ошибке в render?** — без Error Boundary — краш всего дерева; с Error Boundary — показывается fallback UI

### Красные флаги (чего не говорить)

- «Render и mount — одно и то же» — mount включает render + commit в DOM; это разные уровни абстракции
- «useEffect вызывается синхронно» — useEffect выполняется асинхронно после отрисовки браузером

### Связанные темы

- `011-metody-zhiznennogo-cikla-komponenta-v-react.md`
- `022-chto-takoe-react-fiber.md`
- `028-raznica-mezhdu-useeffect-i-componentdidmount.md`
- `029-rasskazhite-o-hukah-usecallback-usememo-useimperativehandle-uselayouteffect.md`
