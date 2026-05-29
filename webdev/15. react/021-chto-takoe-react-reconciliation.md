# Q021. Что такое React Reconciliation?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Reconciliation** — алгоритм React, который сравнивает (diff) предыдущее и новое дерево Virtual DOM и определяет минимальный набор изменений для обновления реального DOM. React использует два ключевых допущения для снижения сложности с O(n³) до O(n): элементы разных типов создают разные деревья, и `key` помогает отслеживать элементы в списках.

---

## Развёрнутый ответ

### Суть и определение

После каждого вызова `setState` или изменения props React строит новое Virtual DOM-дерево. Задача reconciliation — найти разницу между старым и новым деревьями и выполнить минимальные DOM-операции.

Наивный diff двух деревьев — O(n³). React применяет эвристики, снижающие сложность до O(n).

### Как это работает

**Эвристика 1: Элементы разных типов → разные поддеревья**
```tsx
// Было:
<div><Counter /></div>

// Стало:
<span><Counter /></span>

// React: div ≠ span → уничтожить всё поддерево (включая Counter) и создать новое
// Counter будет размонтирован и замонтирован заново!
```

**Эвристика 2: Элементы одного типа → обновить props**
```tsx
// Было:
<button className="old" disabled>Click</button>

// Стало:
<button className="new">Click</button>

// React: тип button — одинаковый
// Обновить только атрибуты: className old→new, убрать disabled
```

**Эвристика 3: key для списков**
```tsx
// Без key — React сравнивает по позиции (дорого при вставке в начало)
<li>Alice</li>  // pos 0
<li>Bob</li>    // pos 1

// С key — React отслеживает по идентификатору
<li key="alice">Alice</li>
<li key="bob">Bob</li>
// При вставке нового элемента в начало — только mount нового,
// Alice и Bob — просто переместятся
```

**Алгоритм Fiber (React 16+):**
Reconciliation разбита на **units of work** — небольшие задачи. Fiber может:
- Прерывать рекурсивный обход дерева
- Приоритизировать обновления (user input > background fetch)
- Батчить несколько setState в один ре-рендер

### Практика и применение

- **Условный рендеринг**: смена типа тега (div → section) → перемонтирование; лучше скрывать через `display: none` или conditional props если state важен
- **Key для reset**: `<Form key={userId} />` — при смене `key` компонент полностью перемонтируется (сбрасывает state)
- **React DevTools Profiler** — визуализирует, какие компоненты ре-рендерились и почему

### Важные нюансы и краеугольные камни

- **Index как key** — антипаттерн при изменяемых списках: при перестановке React считает, что элементы изменились по значению, а не переместились → неправильный diff
- **Смена типа компонента** (например, условно рендерить ClassA или ClassB) → полное перемонтирование обоих
- **React 18 Concurrent**: reconciliation в render phase — **прерываемая**; commit phase — всегда синхронная
- Reconciliation — не то же самое что render: render вызывает компонент, reconciliation анализирует результат

### Примеры

```tsx
// ❌ Антипаттерн: index как key — ломает reconciliation при сортировке
{items.map((item, index) => (
  <ListItem key={index} item={item} />
))}

// ✅ Правильно: стабильный уникальный id
{items.map(item => (
  <ListItem key={item.id} item={item} />
))}

// Принудительный ресет компонента через key
const [resetKey, setResetKey] = useState(0);
<ComplexForm key={resetKey} />
<button onClick={() => setResetKey(k => k + 1)}>Сбросить форму</button>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что происходит при изменении key?** — React считает это другим компонентом: старый размонтируется, новый монтируется с чистым state
- **Почему нельзя использовать Math.random() как key?** — каждый рендер генерирует новые ключи → React всегда «видит» новые элементы → постоянное перемонтирование
- **Как React batch обновления в React 18?** — автоматически в любом обработчике (events, timeouts, promises); в React 16-17 — только в event handlers

### Красные флаги (чего не говорить)

- «Reconciliation = render» — render вызывает компонент, reconciliation анализирует diff результата
- «Key — только для красоты/ESLint» — key критичен для корректного diff алгоритма

### Связанные темы

- `019-chto-takoe-virtual-dom-kak-on-rabotaet-s-react.md`
- `022-chto-takoe-react-fiber.md`
- `041-dlya-chego-nuzhen-atribut-key-pri-rendere-spiskov.md`
