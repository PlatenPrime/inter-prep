# Q022. Разница между императивным и декларативным подходами программирования?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**Императивный подход** описывает **КАК** выполнить задачу — явные шаги, циклы, изменение состояния. **Декларативный** описывает **ЧТО** нужно получить — намерение, а не механизм. SQL, HTML, React JSX, CSS, массивные методы `map/filter/reduce` — декларативны. Циклы `for`, ручное управление состоянием — императивны. Декларативный код обычно короче, читабельнее и проще для оптимизации.

---

## Развёрнутый ответ

### Суть и определение

| Аспект | Императивный | Декларативный |
|--------|-------------|---------------|
| Вопрос | Как сделать? | Что получить? |
| Фокус | Шаги алгоритма | Результат / намерение |
| Состояние | Явное управление | Скрыто в реализации |
| Примеры | `for`, `while`, мутация | SQL, HTML, JSX, `map/filter` |
| Уровень абстракции | Низкий | Высокий |

---

### Пример 1: Числа

```typescript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// ❌ Императивный: описываем каждый шаг
const evenSquaresImperative: number[] = [];
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    evenSquaresImperative.push(numbers[i] ** 2);
  }
}

// ✅ Декларативный: описываем намерение
const evenSquaresDeclarative = numbers
  .filter(n => n % 2 === 0)
  .map(n => n ** 2);
// [4, 16, 36, 64, 100]
```

---

### Пример 2: UI — React vs DOM API

```typescript
// ❌ Императивный: DOM API (как изменить)
function showModal(title: string, body: string): void {
  const modal = document.createElement('div');
  modal.className = 'modal';

  const titleEl = document.createElement('h2');
  titleEl.textContent = title;

  const bodyEl = document.createElement('p');
  bodyEl.textContent = body;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', () => document.body.removeChild(modal));

  modal.appendChild(titleEl);
  modal.appendChild(bodyEl);
  modal.appendChild(closeBtn);
  document.body.appendChild(modal);
}

// ✅ Декларативный: React (что показать)
function Modal({ title, body, onClose }: ModalProps) {
  return (
    <div className="modal">
      <h2>{title}</h2>
      <p>{body}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
// React сам решает, как синхронизировать DOM
```

---

### Пример 3: Запросы данных

```sql
-- Декларативный: SQL — описываем что нужно
SELECT u.name, SUM(o.amount) as total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
GROUP BY u.name
HAVING total > 1000
ORDER BY total DESC;
```

```typescript
// Императивный эквивалент (псевдокод):
const results = [];
for (const user of users) {
  let total = 0;
  for (const order of orders) {
    if (order.userId === user.id && order.status === 'completed') {
      total += order.amount;
    }
  }
  if (total > 1000) {
    results.push({ name: user.name, total });
  }
}
results.sort((a, b) => b.total - a.total);
```

---

### Пример 4: CSS vs DOM-стили

```css
/* Декларативный: что должно выглядеть так */
.button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
```

```javascript
// Императивный: как изменить при событии
button.addEventListener('mouseenter', () => {
  button.style.backgroundColor = '#0056b3';
  button.style.transform = 'translateY(-2px)';
  button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
});
button.addEventListener('mouseleave', () => {
  button.style.backgroundColor = '';
  button.style.transform = '';
  button.style.boxShadow = '';
});
```

---

### Почему декларативный подход мощнее

```typescript
// Декларативный код легче оптимизировать — реализация скрыта
// React Concurrent Mode, SQL query planner — оптимизируют "под капотом"

// Например: массивные операции могут быть ленивыми (lazy evaluation)
// В Haskell/Scala/RxJS — lazy sequences оцениваются только когда нужен результат

// RxJS — декларативная реактивность
import { from, filter, map, reduce } from 'rxjs';

from([1, 2, 3, 4, 5, 6])
  .pipe(
    filter(n => n % 2 === 0),
    map(n => n ** 2),
    reduce((acc, n) => acc + n, 0)
  )
  .subscribe(console.log); // 56
```

---

### Уровни декларативности

```
Высокий декларатив:   SQL, HTML, CSS, GraphQL
↑
Средний:              React JSX, Terraform, Docker Compose
↑
Низкий:               map/filter/reduce, pipeline operators
↑
Императивный:         for-loop, while, manual DOM manipulation
```

### Практика и применение

- **React** — декларативный UI: описываешь желаемое состояние, фреймворк синхронизирует DOM
- **GraphQL** — декларативные запросы: описываешь нужные данные, сервер решает как их достать
- **Terraform/K8s manifests** — декларативная инфраструктура: описываешь желаемое состояние
- **RxJS** — декларативные потоки данных

### Важные нюансы и краеугольные камни

- **Декларативность != медленно**: SQL query planner, React reconciler — highly optimized под капотом
- Декларативный код создаёт дополнительный уровень абстракции — иногда труднее отлаживать (куда именно лезть в стек-трейсе?)
- Чрезмерная декларативность без понимания «как» ведёт к неэффективным паттернам (N+1 в GraphQL без DataLoader)
- В JS декларативность — **конвенция**, а не constraint. Язык позволяет оба подхода.

---

## Сравнение

| Критерий | Императивный | Декларативный |
|----------|-------------|---------------|
| Читаемость | Ниже | Выше |
| Оптимизируемость | Ниже | Выше (реализация скрыта) |
| Отладка | Проще (явные шаги) | Сложнее (абстракция) |
| Контроль | Полный | Ограниченный |
| Уровень абстракции | Низкий | Высокий |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему React декларативен?** — Описываешь желаемый UI как функцию от состояния (`UI = f(state)`); React сам решает как обновить DOM.
- **Может ли декларативный код быть неэффективным?** — Да: `[...arr].filter(...).map(...)` создаёт промежуточные массивы; для больших данных нужна ленивая обработка.
- **Что такое «уровень абстракции»?** — Насколько мы скрываем детали реализации. SQL скрывает алгоритм поиска, React скрывает DOM-манипуляции.

### Красные флаги (чего не говорить)

- «Декларативный код всегда лучше» — иногда нужен явный контроль (анимации, WebGL, WebAudio).
- «Imperativ vs декларатив — это ООП vs ФП» — не эквивалентно; ООП может быть декларативным, ФП — декларативно, но это разные измерения.

### Связанные темы

- `017-osnovnye-printsipy-fp.md`
- `023-protsedurnoe-vs-funktsionalnoe.md`
- `024-chto-takoe-reaktivnoe-programmirovanie.md`
