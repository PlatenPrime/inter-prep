# Q037. Для чего используют атрибут `novalidate`?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

Атрибут `novalidate` на элементе `<form>` отключает встроенную HTML5-валидацию при отправке формы: браузер не проверяет ограничения (`required`, `pattern`, `type` и др.) и не показывает нативные всплывающие подсказки об ошибках. Используется когда разработчик реализует собственную логику валидации на JavaScript — чтобы избежать конфликта двух систем валидации.

---

## Развёрнутый ответ

### Суть и определение

`novalidate` — булев атрибут (его присутствие равно значению `true`). Он является флагом, который сообщает браузеру: «не запускай constraint validation при submit, я сам разберусь с проверкой данных».

### Как это работает

```html
<form action="/submit" method="POST" novalidate>
  <input type="email" name="email" required />
  <button type="submit">Отправить</button>
</form>
```

Без `novalidate`: при пустом email-поле браузер блокирует submit, показывает тултип «Пожалуйста, заполните это поле».

С `novalidate`: форма отправляется (или JS-обработчик `submit` запускается) без нативных проверок — даже если `required` поля пусты.

**Важно:** `novalidate` отключает лишь UI-блокировку и нативные тултипы. Constraint Validation API (`checkValidity()`, `reportValidity()`, `validity`) продолжает работать полноценно — его всё ещё можно использовать программно.

### Практика и применение

- Кастомная JS-валидация с пользовательскими сообщениями об ошибках и дизайном
- React/Vue/Angular формы: контролируемые компоненты с собственным состоянием ошибок
- Формы с библиотеками валидации: react-hook-form, Formik, VeeValidate — всегда ставят `novalidate`
- UX-требования, несовместимые с нативным поведением (валидация при `blur`, а не при `submit`)
- Многошаговые формы (wizard): нельзя отправить форму целиком — `novalidate` + ручная проверка каждого шага

### Важные нюансы и краеугольные камни

- `novalidate` применяется **только на `<form>`**, не на отдельных полях
- Аналогом на уровне кнопки является `formnovalidate` на `<button type="submit">` или `<input type="submit">` — отключает валидацию только для этой кнопки (например, кнопка «Сохранить черновик»)
- Без `novalidate` браузерные тултипы показываются только для первого невалидного поля — это плохой UX при наличии нескольких ошибок
- `novalidate` не влияет на серверную валидацию — она всегда должна существовать независимо
- CSS псевдоклассы `:valid` / `:invalid` продолжают работать независимо от `novalidate`

### Примеры

```html
<!-- React-форма с novalidate — кастомная валидация на JS -->
<form novalidate onSubmit={handleSubmit}>
  <div>
    <label htmlFor="email">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      value={email}
      onChange={handleChange}
      aria-describedby="email-error"
    />
    {errors.email && <span id="email-error" role="alert">{errors.email}</span>}
  </div>
  <button type="submit">Отправить</button>
</form>

<!-- formnovalidate на кнопке "Сохранить черновик" -->
<form action="/publish" method="POST">
  <input type="text" name="title" required />
  <textarea name="content" required></textarea>

  <!-- Публикация требует валидации -->
  <button type="submit">Опубликовать</button>

  <!-- Черновик — валидация не нужна -->
  <button type="submit" formaction="/draft" formnovalidate>Сохранить черновик</button>
</form>
```

```js
// novalidate + ручное использование Constraint Validation API
const form = document.querySelector('form[novalidate]');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const invalidFields = [];
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    if (!field.checkValidity()) {
      invalidFields.push({ field, message: field.validationMessage });
    }
  });

  if (invalidFields.length > 0) {
    invalidFields.forEach(({ field, message }) => {
      showError(field, message); // кастомный UI ошибки
    });
    return;
  }

  submitForm(new FormData(form));
});
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Продолжает ли `checkValidity()` работать при `novalidate`?
- Что такое `formnovalidate` и чем отличается от `novalidate`?
- Почему библиотеки типа react-hook-form всегда рекомендуют `novalidate`?
- Как `novalidate` взаимодействует с CSS псевдоклассами `:valid` / `:invalid`?
- Есть ли способ отключить валидацию для конкретного поля, а не всей формы?

### Красные флаги (чего не говорить)

- «`novalidate` отключает Constraint Validation API» — API продолжает работать, отключается только UI
- «Можно поставить `novalidate` на `<input>`» — атрибут применяется только к `<form>`
- «`novalidate` делает форму небезопасной» — безопасность обеспечивается серверной валидацией, а не браузерной

### Связанные темы

- [035-validaciya-form-html5.md](./035-validaciya-form-html5.md) — процесс валидации HTML5
- [034-atributy-html-form.md](./034-atributy-html-form.md) — основные атрибуты форм
- [038-atribut-pattern.md](./038-atribut-pattern.md) — атрибут pattern
