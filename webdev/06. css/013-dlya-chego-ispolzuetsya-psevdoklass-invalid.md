# Q013. Для чего используется псевдокласс `:invalid`?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**`:invalid`** — псевдокласс, который совпадает с элементами формы (`<input>`, `<textarea>`, `<select>`, `<form>`), не прошедшими HTML5-валидацию (тип данных, `required`, `min`/`max`, `pattern`). Используется для визуальной индикации ошибок без JavaScript.

---

## Развёрнутый ответ

### Суть и определение

`:invalid` применяется к полю, когда его текущее значение нарушает ограничения:

| Атрибут | Когда `:invalid` |
|---------|-----------------|
| `type="email"` | Формат не соответствует email |
| `type="number"` | Не число или вне `min`/`max` |
| `required` | Поле пустое |
| `pattern="[A-Z]+"` | Значение не соответствует regex |
| `maxlength` | Превышена длина (браузеры обычно предотвращают это) |
| `<form>` | Содержит хотя бы одно `:invalid` поле |

**Связанные псевдоклассы:**
- `:valid` — поле прошло валидацию
- `:user-invalid` (CSS4) — `:invalid` после взаимодействия пользователя
- `:user-valid` (CSS4) — `:valid` после взаимодействия
- `:placeholder-shown` — виден плейсхолдер (поле пустое)
- `:required` / `:optional` — поле обязательное/необязательное

### Как это работает

Браузер постоянно проверяет constraint validation API для каждого поля и обновляет состояние. `:invalid` активируется **сразу при загрузке страницы** для пустых `required`-полей — это главная проблема UX.

**Порядок валидации браузером:**
1. Проверяет `required` → пустое = invalid.
2. Проверяет `type` → неверный формат = invalid.
3. Проверяет `min`/`max`/`step`.
4. Проверяет `pattern`.
5. Проверяет `minlength`/`maxlength`.

### Практика и применение

- Кастомная граница поля при ошибке без JS.
- Показ иконки-предупреждения через `::after` на обёртке.
- Блокировка кнопки Submit: `form:invalid .submit-btn { opacity: 0.5; pointer-events: none }`.
- Совместно с `:focus` — показывать ошибку только при фокусе: `input:focus:invalid { border-color: red }`.

### Важные нюансы и краеугольные камни

- **`:invalid` срабатывает при загрузке** для пустых `required`-полей — пользователь видит ошибку до ввода. Решение: `:user-invalid` (CSS4) или комбинация `:invalid:not(:placeholder-shown)`.
- `<form>:invalid` совпадает, если хотя бы одно поле невалидно.
- `:invalid` не учитывает `disabled`-поля — они исключены из валидации.
- Кастомные сообщения через `setCustomValidity('')` в JS влияют на `:invalid`.
- `<input type="text">` без `required` всегда `:valid` (даже пустой).

### Примеры

```css
/* Плохо: ошибка при загрузке пустой формы */
input:invalid {
  border-color: red; /* сразу красный border у пустого required поля */
}

/* Лучше: только после взаимодействия */
input:user-invalid {
  border-color: var(--color-error);
}

/* Fallback для старых браузеров */
input:invalid:not(:placeholder-shown) {
  border-color: var(--color-error);
}

/* Иконка ошибки через родительский элемент */
.field:has(input:user-invalid)::after {
  content: '✕';
  color: var(--color-error);
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

/* Блокировка кнопки */
form:invalid .btn--submit {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
```

```html
<div class="field">
  <label for="email">Email</label>
  <input id="email" type="email" required placeholder="user@example.com">
</div>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `:invalid` плохо использовать напрямую?** — Активируется при загрузке, до любого взаимодействия пользователя — плохой UX.
- **Чем `:user-invalid` лучше `:invalid`?** — Срабатывает только после того, как пользователь взаимодействовал с полем (потерян фокус и т.п.).
- **Как `setCustomValidity` влияет на `:invalid`?** — Непустая строка делает поле `:invalid`; пустая строка убирает кастомную ошибку.
- **Как отключить нативные browser validation tooltips?** — `novalidate` на `<form>` или JS `form.addEventListener('submit', e => e.preventDefault())`.

### Красные флаги (чего не говорить)

- «`:invalid` работает только после сабмита формы» — нет, срабатывает сразу при рендере.
- «`:invalid` — достаточно для UX валидации» — нужна комбинация с `:user-invalid` или `:not(:placeholder-shown)`.

### Связанные темы

- `012-kakie-psevdoklassy-byli-dobavleny-v-css3.md`
- `014-rasskazhite-o-psevdoklasse-has.md`
