# Q035. Опишите процесс валидации форм в HTML5?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

HTML5 предоставляет встроенную систему валидации на основе атрибутов (`required`, `min`/`max`, `minlength`/`maxlength`, `pattern`, `type`) и Constraint Validation API (`validity`, `checkValidity()`, `reportValidity()`, `setCustomValidity()`). При попытке submit браузер проверяет каждое поле, и если валидация не прошла — показывает встроенные сообщения об ошибках и блокирует отправку. Для кастомной валидации атрибут `novalidate` на форме отключает встроенное поведение.

---

## Развёрнутый ответ

### Суть и определение

Constraint Validation — это встроенный механизм браузера, который проверяет значения полей формы против набора ограничений (constraints) перед отправкой. Ограничения задаются атрибутами HTML5 или программно через JS API.

### Как это работает

**Шаг 1 — Атрибуты-ограничения:**

| Атрибут | Применение | Описание |
|---------|------------|----------|
| `required` | все поля | Поле не должно быть пустым |
| `type` | `<input>` | Проверка формата (email, url, number и т.д.) |
| `min` / `max` | number, date, range | Диапазон числового/датового значения |
| `minlength` / `maxlength` | text, password, textarea | Длина строки |
| `pattern` | text, tel, url, email, password, search | Проверка по regex |
| `step` | number, range, date | Шаг допустимых значений |

**Шаг 2 — Объект `ValidityState`:**

Каждый `HTMLInputElement` имеет свойство `validity` типа `ValidityState` с булевыми флагами:

```js
input.validity.valueMissing    // required, но поле пустое
input.validity.typeMismatch    // значение не соответствует type
input.validity.patternMismatch // не совпадает с pattern
input.validity.tooShort        // короче minlength
input.validity.tooLong         // длиннее maxlength
input.validity.rangeUnderflow  // меньше min
input.validity.rangeOverflow   // больше max
input.validity.stepMismatch    // не кратно step
input.validity.customError     // установлен через setCustomValidity()
input.validity.valid           // все флаги false — поле валидно
```

**Шаг 3 — API методы:**

```js
element.checkValidity()    // true/false, без UI; генерирует событие 'invalid'
element.reportValidity()   // true/false + показывает встроенный tooltip с ошибкой
element.setCustomValidity(message) // установить кастомную ошибку; '' — сбросить
```

**Шаг 4 — Последовательность при submit:**

1. Пользователь нажимает кнопку submit
2. Браузер обходит все submittable поля
3. Вызывает внутренний `checkValidity()` на каждом
4. Если хотя бы одно поле невалидно — генерирует событие `invalid` на нём, показывает tooltip, отменяет submit
5. Если все поля валидны — генерирует событие `submit` на форме

### Практика и применение

- Мгновенная валидация без написания JS — достаточно атрибутов HTML
- Кастомная валидация через `setCustomValidity` + `input`/`change` события
- Стилизация через CSS псевдоклассы: `:valid`, `:invalid`, `:required`, `:optional`, `:in-range`, `:out-of-range`
- Для React/Vue форм часто используют `novalidate` + библиотеки (react-hook-form, Zod) для полного контроля

### Важные нюансы и краеугольные камни

- `setCustomValidity('')` обязательно вызывать для сброса кастомной ошибки, иначе поле всегда невалидно
- `:invalid` срабатывает сразу при загрузке страницы (если поле required и пустое) — это приводит к мигающим красным полям. Используют псевдокласс `:user-invalid` (современные браузеры) или JS для добавления класса после первого взаимодействия
- `checkValidity()` на `<form>` проверяет все поля сразу и возвращает `false` если хотя бы одно невалидно
- Disabled поля полностью пропускаются при валидации
- `<fieldset disabled>` отключает все вложенные поля включая валидацию

### Примеры

```html
<!-- Встроенная валидация атрибутами -->
<form action="/register" method="POST">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />

  <label for="age">Возраст</label>
  <input type="number" id="age" name="age" min="18" max="100" required />

  <label for="phone">Телефон</label>
  <input
    type="tel"
    id="phone"
    name="phone"
    pattern="^\+7\d{10}$"
    title="Формат: +7XXXXXXXXXX"
    required
  />

  <button type="submit">Зарегистрироваться</button>
</form>
```

```js
// Кастомная валидация через API
const emailInput = document.getElementById('email');

emailInput.addEventListener('input', () => {
  if (emailInput.value.includes('example.com')) {
    emailInput.setCustomValidity('Домен example.com не разрешён');
  } else {
    emailInput.setCustomValidity(''); // сброс ошибки
  }
});

// Проверка всей формы программно
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  if (!form.checkValidity()) {
    e.preventDefault();
    form.reportValidity(); // покажет встроенные tooltips
  }
});
```

```css
/* Стилизация состояний валидации */
input:user-invalid {
  border-color: red;
}
input:user-valid {
  border-color: green;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Чем `checkValidity()` отличается от `reportValidity()`?
- Почему поле с `required` сразу подсвечивается красным при загрузке страницы и как это исправить?
- Что такое `ValidityState` и какие флаги в нём есть?
- Как сбросить кастомную ошибку, установленную через `setCustomValidity`?
- Как `novalidate` влияет на Constraint Validation API?
- Что происходит с disabled полями при валидации?

### Красные флаги (чего не говорить)

- «Встроенная HTML5-валидация достаточна для продакшена» — нужна серверная валидация как последний рубеж
- «`pattern` работает на всех типах input» — работает только с текстоподобными типами
- «После `setCustomValidity` ошибка сама сбросится» — нет, нужно явно вызвать `setCustomValidity('')`

### Связанные темы

- [038-atribut-pattern.md](./038-atribut-pattern.md) — атрибут pattern
- [037-atribut-novalidate.md](./037-atribut-novalidate.md) — атрибут novalidate
- [034-atributy-html-form.md](./034-atributy-html-form.md) — атрибуты форм
