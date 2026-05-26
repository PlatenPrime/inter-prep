# Q050. Что такое свойство `valueAsNumber`?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

`valueAsNumber` — DOM-свойство элемента `<input>`, возвращающее текущее значение поля в виде числа (тип `number`). Доступно для `type="number"`, `range`, `date`, `time`, `datetime-local`, `month`, `week`. Возвращает `NaN` если значение отсутствует или невалидно. Удобнее и безопаснее, чем `parseFloat(input.value)`.

---

## Развёрнутый ответ

### Суть и определение

`valueAsNumber` — часть спецификации HTML Living Standard, свойство интерфейса `HTMLInputElement`. Оно обеспечивает типобезопасный доступ к числовому представлению значения поля без ручного парсинга строки.

Для `date`/`time`-типов возвращает **миллисекунды от эпохи Unix** (как `Date.getTime()`).

### Как это работает

**Поддерживаемые типы:**

| `type`           | Возвращает                              |
|------------------|-----------------------------------------|
| `number`         | Число (float)                           |
| `range`          | Число в диапазоне `[min, max]`          |
| `date`           | мс от 1970-01-01 UTC                    |
| `time`           | мс от начала дня (0–86 399 999)         |
| `datetime-local` | мс от эпохи (без timezone offset)       |
| `month`          | Месяцы от эпохи (January 1970 = 0)      |
| `week`           | мс начала недели от эпохи               |

Для всех остальных типов (`text`, `email`, и т.д.) доступ к `valueAsNumber` возбуждает `DOMException` при попытке **установить** значение; при чтении — `NaN`.

### Практика и применение

- **Арифметика без парсинга**: `const sum = a.valueAsNumber + b.valueAsNumber`
- **Диапазоны дат**: сравнение дат как чисел без создания `Date`-объектов
- **Установка дефолтного значения**: `input.valueAsNumber = Date.now()` устанавливает сегодняшнюю дату в `type="date"`
- **Валидация**: проверка `isNaN(input.valueAsNumber)` вместо регулярок

```js
// Без valueAsNumber — fragile
const value = parseFloat(input.value); // NaN если строка пустая или "12abc"

// С valueAsNumber — надёжно
const value = input.valueAsNumber; // NaN если невалидно, иначе число
if (!isNaN(value)) {
  console.log(value * 2);
}
```

### Важные нюансы и краеугольные камни

- `valueAsNumber` и `value` синхронизированы: изменение одного обновляет другое
- Установка `valueAsNumber = NaN` очищает поле (`value` становится `""`)
- Для `type="date"` присвоение `input.valueAsNumber = Date.now()` корректно устанавливает текущую дату; `value` при этом принимает формат `YYYY-MM-DD`
- Если `input.value = "abc"` для `type="number"`, то `valueAsNumber` вернёт `NaN` — это ожидаемое поведение
- Не путать с `valueAsDate` — тот возвращает объект `Date` и работает только с `date`/`time`/`datetime-local`/`month`/`week`

### Примеры

```html
<form>
  <input type="number" id="price" min="0" step="0.01" value="99.99" />
  <input type="number" id="qty" min="1" value="1" />
  <output id="total">99.99</output>
</form>

<script>
  const price = document.getElementById('price');
  const qty = document.getElementById('qty');
  const total = document.getElementById('total');

  function updateTotal() {
    const p = price.valueAsNumber;
    const q = qty.valueAsNumber;

    // Безопасная проверка вместо parseFloat
    total.value = isNaN(p) || isNaN(q) ? '—' : (p * q).toFixed(2);
  }

  price.addEventListener('input', updateTotal);
  qty.addEventListener('input', updateTotal);
</script>
```

```js
// Работа с датами
const dateInput = document.querySelector('input[type="date"]');

// Установить сегодня
dateInput.valueAsNumber = Date.now();

// Получить как объект Date
const selectedDate = new Date(dateInput.valueAsNumber);
console.log(selectedDate.toLocaleDateString('ru-RU'));

// Разница в днях между двумя датами
const from = document.getElementById('from').valueAsNumber;
const to = document.getElementById('to').valueAsNumber;
const diffDays = (to - from) / (1000 * 60 * 60 * 24);
```

---

## Сравнение

| Критерий            | `valueAsNumber`              | `parseFloat(value)`           | `valueAsDate`               |
|---------------------|------------------------------|-------------------------------|-----------------------------|
| Тип возврата        | `number`                     | `number`                      | `Date \| null`              |
| При пустом поле     | `NaN`                        | `NaN`                         | `null`                      |
| При частичном вводе | `NaN`                        | Может вернуть частичное число | `null`                      |
| Типы input          | number, range, date/time/... | Любой (строка)                | date, time, month, week     |
| Установка значения  | Да, двунаправленно           | Нет (только чтение строки)    | Да, для date/time-типов     |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Что вернёт `valueAsNumber` для `<input type="text" value="42">`?
- Чем `valueAsNumber` отличается от `valueAsDate`?
- Как установить дату «сегодня» через `valueAsNumber`?
- Что произойдёт при `input.valueAsNumber = NaN`?
- Почему `parseFloat(input.value)` может давать некорректные результаты?

### Красные флаги (чего не говорить)

- «`valueAsNumber` работает для любого типа input» — только для числовых и временных типов
- «`valueAsNumber` — то же самое, что `Number(input.value)`» — `Number("")` возвращает `0`, а `valueAsNumber` вернёт `NaN`
- «Можно не проверять NaN, если поле обязательное» — значение может быть NaN даже при `required`, пока пользователь не завершил ввод

### Связанные темы

- [`<output>` элемент](./044-element-output.md) — отображение вычисленных значений
- [`<input type="range">`](./035-tipy-input.md) — числовые диапазоны
- [Валидация форм HTML5](./034-validaciya-form.md)
