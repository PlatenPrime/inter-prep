# Q003. Почему важно минимизировать количество reflow и repaint в браузере? Как этого достигнуть?

> **Источник:** [13. performance.md](../13.%20performance.md) · **Тема:** Performance

---

## Короткий ответ

Reflow (Layout) и Repaint (Paint) — дорогостоящие синхронные операции на главном потоке. При частых reflow браузер не успевает отрисовывать 60 кадров в секунду, UI «замерзает», анимации заикаются. Минимизировать их можно через пакетирование DOM-изменений, чтение геометрических свойств перед записью, использование `transform`/`opacity` для анимаций и перевод элементов в отдельные compositing-слои.

---

## Развёрнутый ответ

### Суть и определение

Каждый reflow пересчитывает геометрию элементов (размеры, позиции) и запускает каскадный пересчёт потомков и соседей. Repaint растеризует визуальное содержимое в битмапы. Оба процесса выполняются на main thread — том же потоке, где работает JS. Если они занимают больше ~10 мс в 60 FPS-бюджете (16,7 мс на кадр), пользователь видит «дёргание».

### Как это работает

**Что вызывает reflow:**

| Действие | Пример |
|----------|--------|
| Чтение геометрических свойств | `offsetWidth`, `scrollTop`, `getBoundingClientRect()` |
| Изменение геометрических свойств | `width`, `height`, `margin`, `padding`, `font-size` |
| Добавление/удаление DOM-узлов | `appendChild`, `removeChild` |
| Изменение контента | `innerHTML`, `textContent` |
| Изменение CSS-классов | `classList.add()` с геометрическими стилями |

Браузер **откладывает** reflow (lazy evaluation) до момента, когда JS читает свойства геометрии или до конца кадра. Именно поэтому «чтение после записи» форсирует немедленный synchronous reflow — это называется **Layout Thrashing**.

**Что вызывает только repaint (без reflow):**
`color`, `background-color`, `border-color`, `box-shadow`, `outline`.

**Что вызывает только compositing (самое дешёвое):**
`transform`, `opacity`.

### Практика и применение

**1. Пакетировать DOM-изменения**

```javascript
// Плохо: 3 reflow
element.style.width = '100px';
element.style.height = '200px';
element.style.margin = '10px';

// Хорошо: 1 reflow через CSS-класс
element.classList.add('resized');
```

**2. Читать геометрию перед записью (разделять read/write)**

```javascript
// Плохо: Layout Thrashing — forced synchronous layout
boxes.forEach(box => {
  const width = box.offsetWidth;      // READ → forceLayout
  box.style.width = width * 2 + 'px'; // WRITE
});

// Хорошо: сначала все reads, потом все writes
const widths = boxes.map(box => box.offsetWidth); // READ phase
boxes.forEach((box, i) => {
  box.style.width = widths[i] * 2 + 'px';         // WRITE phase
});
```

**3. Использовать `requestAnimationFrame` для визуальных обновлений**

```javascript
// Браузер сам группирует обновления в кадр
function update() {
  element.style.transform = `translateX(${x}px)`;
  requestAnimationFrame(update);
}
requestAnimationFrame(update);
```

**4. Переводить анимируемые элементы в отдельные слои**

```css
.animated {
  will-change: transform; /* создаёт compositing layer заранее */
}
```

**5. Использовать `DocumentFragment` для массовых DOM-изменений**

```javascript
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item;
  fragment.appendChild(li);
});
list.appendChild(fragment); // один reflow вместо N
```

**6. CloneNode + замена**

```javascript
const clone = table.cloneNode(true);
// ... много изменений clone ...
table.parentNode.replaceChild(clone, table); // один reflow
```

**7. Виртуализация длинных списков** — рендерить только видимые строки (react-window, TanStack Virtual).

### Важные нюансы и краеугольные камни

- **`display: none` перед изменениями** — отключает элемент от layout tree, все изменения не вызывают reflow. Возврат через `display: block` — один reflow. Годится для batch-обновлений.
- **`visibility: hidden`** — не удаляет из layout tree, место в DOM сохраняется; repaint есть, reflow — нет (если размеры не меняются).
- **Absolute/Fixed позиционирование** — элемент выходит из нормального потока, его reflow не затрагивает соседей.
- **CSS containment** (`contain: layout` / `contain: strict`) — изолирует поддерево от остального документа, локализует reflow.
- **Браузер может объединять reflow** в batch при отсутствии «принудительного синхронного layout», но не стоит на это полагаться.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое Layout Thrashing и как его диагностировать?** — Forced synchronous layout в DevTools → Performance: жёлтые предупреждения в событиях Layout.
- **Чем `requestAnimationFrame` лучше `setTimeout` для анимаций?** — rAF привязан к частоте обновления экрана и выполняется перед следующим кадром; setTimeout не гарантирует синхронизацию.
- **Как `contain: layout` уменьшает reflow?** — Браузер не выходит за пределы containment-границы при пересчёте геометрии.
- **Когда виртуализация списков необходима?** — При тысячах DOM-узлов; каждый узел в Layout tree увеличивает время reflow.
- **Влияет ли `transform: translateX` на соседние элементы?** — Нет; composite-only изменения не вызывают reflow и не затрагивают поток.

### Красные флаги (чего не говорить)

- «Reflow и Repaint — одно и то же» — repaint происходит без reflow (только визуальные свойства); reflow всегда влечёт repaint.
- «Использую `setTimeout(fn, 0)` вместо `requestAnimationFrame`» — не привязан к кадру; может вызвать несколько reflow в одном кадре или пропустить кадр.
- «`will-change: transform` на всех элементах» — взрывной рост потребления GPU-памяти.
- «Добавляю узлы в цикле по одному» — N reflow вместо одного; нужен Fragment или batch-вставка.

### Связанные темы

- `001-nazvajte-kriticheskie-etapy-renderinga-critical-rendering-path.md`
- `002-raznica-mezhdu-layout-painting-i-compositing.md`
- `004-raznica-mezhdu-render-blocking-i-layout-thrashing.md`
