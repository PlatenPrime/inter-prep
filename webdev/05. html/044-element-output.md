# Q049. Что такое элемент `<output>` в HTML5?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

`<output>` — семантический HTML5-элемент для отображения результата вычислений, пользовательских действий или значений, полученных из формы. Атрибут `for` связывает `<output>` с одним или несколькими полями ввода, `form` привязывает к форме. Обновляется через JS-обработчики или декларативно через `oninput` на форме.

---

## Развёрнутый ответ

### Суть и определение

До HTML5 результаты вычислений отображали в обычном `<span>` или `<div>` без семантики. `<output>` решает эту проблему: браузеры и скринридеры понимают, что это **вывод**, связанный с конкретными входными данными, а не просто текстовый блок.

Технически `<output>` — inline-элемент уровня flow content, участвующий в form-ассоциации (form-associated element).

### Как это работает

**Ключевые атрибуты:**

| Атрибут | Описание |
|---------|----------|
| `for`   | Space-separated список `id` входных элементов, от которых зависит результат |
| `form`  | `id` формы-владельца (если `<output>` вне `<form>`) |
| `name`  | Имя для доступа через `form.elements` и отправки данных |

**DOM-свойства:**

- `output.value` — текущее строковое значение
- `output.defaultValue` — значение по умолчанию (содержимое из HTML)
- `output.htmlFor` — объект `DOMTokenList` id связанных элементов

### Практика и применение

- **Калькуляторы и конвертеры**: результат арифметики
- **Range-слайдеры**: отображение текущего значения рядом с ползунком
- **Многошаговые формы**: промежуточные итоги (сумма заказа, скидка)
- **Игровые интерфейсы**: счёт, очки, таймер

```html
<!-- Слайдер с живым выводом значения -->
<form oninput="result.value = range.valueAsNumber">
  <label>
    Громкость:
    <input type="range" id="range" name="range" min="0" max="100" value="50" />
  </label>
  <output name="result" for="range">50</output>
</form>
```

```html
<!-- Калькулятор суммы двух чисел -->
<form oninput="sum.value = Number(a.value) + Number(b.value)">
  <input type="number" id="a" name="a" value="0" />
  +
  <input type="number" id="b" name="b" value="0" />
  =
  <output name="sum" for="a b">0</output>
</form>
```

### Важные нюансы и краеугольные камни

- `<output>` **участвует в отправке формы**: его `name`/`value` включаются в form data как обычный input
- `defaultValue` сохраняет исходное значение из HTML; при `form.reset()` `output.value` сбрасывается к `defaultValue`
- ARIA: `<output>` имеет неявную роль `status` (live region `aria-live="polite"`), что означает скринридер автоматически объявит изменения
- Для сложной логики лучше обновлять через JS (`output.value = ...`), а не через `oninput` на форме
- Не является полем ввода — пользователь не может редактировать содержимое

### Примеры

```html
<!-- Полный пример: форма заказа с итогом -->
<form id="order-form">
  <label>
    Количество:
    <input type="number" id="qty" name="qty" min="1" value="1" />
  </label>
  <label>
    Цена за единицу:
    <input type="number" id="price" name="price" value="100" />
  </label>

  <p>
    Итого:
    <output name="total" for="qty price" form="order-form">100</output> ₽
  </p>
</form>

<script>
  const form = document.getElementById('order-form');
  const output = form.elements['total'];

  ['qty', 'price'].forEach((name) => {
    form.elements[name].addEventListener('input', () => {
      const qty = Number(form.elements['qty'].value);
      const price = Number(form.elements['price'].value);
      output.value = qty * price;
    });
  });
</script>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Чем `<output>` отличается от `<span>` с точки зрения доступности?
- Что происходит с `<output>` при вызове `form.reset()`?
- Включается ли значение `<output>` в данные при отправке формы?
- Какую ARIA-роль имеет `<output>` и что это означает?
- Можно ли использовать `<output>` вне `<form>`?

### Красные флаги (чего не говорить)

- «`<output>` — это просто семантический `<span>`» — у него есть form-ассоциация, defaultValue и ARIA-роль
- «Значение `<output>` не отправляется с формой» — отправляется, если задан `name`
- «`<output>` нужен только для кастомных UI» — это стандартный элемент с семантикой и доступностью

### Связанные темы

- [`valueAsNumber`](./045-svoystvo-valueasnumber.md) — числовое значение input
- [`<input type="range">`](./035-tipy-input.md) — ползунок значений
- [Доступность форм / ARIA live regions](../08.%20accessibility.md)
