# Q051. Для чего используются `data-`атрибуты?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

`data-*` атрибуты — стандартный механизм HTML5 для хранения произвольных данных непосредственно в разметке без нестандартных атрибутов. Доступны через JS-свойство `element.dataset` с автоматической конвертацией kebab-case в camelCase. Используются для передачи данных от сервера в клиентский JS, хранения состояния компонентов и написания CSS-селекторов без классов.

---

## Развёрнутый ответ

### Суть и определение

До HTML5 разработчики хранили дополнительные данные в нестандартных атрибутах (`<div rel="123">`), скрытых `<input>`, классах (`class="item-id-42"`) или глобальных JS-объектах. `data-*` атрибуты — официальное решение: любой атрибут, начинающийся с `data-`, валиден в HTML5 и не конфликтует со стандартными атрибутами.

**Синтаксис:** `data-{имя}="{значение}"` — имя в kebab-case, значение всегда строка.

### Как это работает

**Dataset API** — `element.dataset` возвращает объект `DOMStringMap`, где ключи — имена атрибутов в camelCase:

```
data-user-id   → dataset.userId
data-max-value → dataset.maxValue
data-x         → dataset.x
```

Операции CRUD через `dataset`:

```js
// Read
const id = el.dataset.userId;

// Write
el.dataset.status = 'active'; // создаёт data-status="active"

// Delete
delete el.dataset.status; // удаляет атрибут из DOM

// Check
'userId' in el.dataset; // true если data-user-id присутствует
```

### Практика и применение

- **Конфигурация JS-компонентов**: передать параметры виджета из шаблона без отдельного `<script>`
- **Состояние UI**: `data-expanded="true"` для аккордеонов, `data-selected` для табов
- **ID сущностей**: привязать DOM-элемент к записи в БД
- **CSS-стилизация**: стили по `[data-theme="dark"]` без дополнительных классов
- **Event delegation**: определить действие элемента в обработчике родителя

```html
<!-- Конфигурация слайдера -->
<div
  class="slider"
  data-autoplay="true"
  data-interval="3000"
  data-effect="fade"
></div>

<!-- ID для event delegation -->
<ul id="task-list">
  <li data-task-id="42" data-status="pending">Задача 1</li>
  <li data-task-id="43" data-status="done">Задача 2</li>
</ul>
```

```js
// Event delegation через data-атрибуты
document.getElementById('task-list').addEventListener('click', (e) => {
  const item = e.target.closest('[data-task-id]');
  if (!item) return;
  const { taskId, status } = item.dataset;
  toggleTask(taskId, status);
});

// Чтение конфигурации
const slider = document.querySelector('.slider');
const { autoplay, interval, effect } = slider.dataset;
initSlider({ autoplay: autoplay === 'true', interval: Number(interval), effect });
```

```css
/* CSS-селекторы по data-атрибутам */
[data-theme="dark"] { background: #1a1a1a; color: #fff; }
[data-status="done"] { text-decoration: line-through; opacity: 0.5; }
[data-status="pending"] { font-weight: bold; }
```

### Важные нюансы и краеугольные камни

- Все значения — **строки**: числа, булевы и объекты нужно парсить вручную (`Number()`, `JSON.parse()`)
- `dataset` — не обычный объект: итерация через `for...in` или `Object.entries(el.dataset)`
- `data-*` атрибуты видны в DevTools и исходном коде — **не хранить секреты** (токены, пароли)
- Для больших объёмов данных или сложных структур лучше использовать JS-хранилища (state management), а не накапливать данные в DOM
- Изменения через `dataset` немедленно отражаются в атрибутах DOM и наоборот — они синхронны
- Имя не должно начинаться с `xml`, не содержать `;`, `<`, `>`, `"`, символов в верхнем регистре Unicode

### Примеры

```html
<!-- Полный пример: список с фильтрацией через data-атрибуты -->
<div class="filter-bar">
  <button data-filter="all">Все</button>
  <button data-filter="active">Активные</button>
  <button data-filter="done">Выполненные</button>
</div>

<ul class="todo-list">
  <li data-status="active">Купить продукты</li>
  <li data-status="done">Написать тесты</li>
  <li data-status="active">Сделать ревью PR</li>
</ul>

<script>
  document.querySelector('.filter-bar').addEventListener('click', (e) => {
    const filter = e.target.dataset.filter;
    if (!filter) return;

    document.querySelectorAll('.todo-list li').forEach((item) => {
      const match = filter === 'all' || item.dataset.status === filter;
      item.hidden = !match;
    });
  });
</script>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Как получить все `data-`атрибуты элемента через JS?
- Почему нельзя хранить чувствительные данные в `data-*`?
- В чём разница между `getAttribute('data-id')` и `dataset.id`?
- Как `data-*` атрибуты соотносятся с state management-библиотеками?
- Как через `data-*` передать сложный объект (массив, JSON)?

### Красные флаги (чего не говорить)

- «`data-*` — нестандартные / нелегальные атрибуты» — стандартный механизм HTML5
- «`dataset.value` вернёт число если записано число» — всегда строка, нужен ручной парсинг
- «Можно хранить пароли/токены в `data-*`» — данные видны в HTML-источнике

### Связанные темы

- [Глобальные атрибуты HTML](./003-atributy-html.md) — стандартные атрибуты всех элементов
- [Event delegation](../03.%20security.md) — паттерн обработки событий
- [CSS attribute selectors](../css/selectors.md) — стилизация по атрибутам
