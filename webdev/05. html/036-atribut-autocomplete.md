# Q036. Для чего нужен атрибут `autocomplete`?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

Атрибут `autocomplete` управляет тем, может ли браузер или менеджер паролей автоматически заполнять поле сохранёнными данными. Он принимает значения `on`/`off`, а также семантические токены (`name`, `email`, `username`, `current-password`, `new-password`, `cc-number` и др.), которые подсказывают браузеру тип ожидаемых данных. Это влияет как на UX (удобство заполнения форм), так и на безопасность (правильное поведение менеджеров паролей).

---

## Развёрнутый ответ

### Суть и определение

`autocomplete` — атрибут для элементов `<form>`, `<input>`, `<select>`, `<textarea>`. Он сообщает пользовательскому агенту, имеет ли поле смысловое значение (тип данных), которое агент может автоматически подставить из своего хранилища.

### Как это работает

**На уровне формы** — устанавливает поведение по умолчанию для всех дочерних полей:
```html
<form autocomplete="off">...</form>
```

**На уровне поля** — переопределяет поведение конкретного поля:
```html
<input type="email" name="email" autocomplete="email" />
```

Браузер использует токен значения для сопоставления сохранённых данных. Семантические токены из спецификации WHATWG — это формализованный список типов данных.

**Ключевые семантические токены:**

| Токен | Смысл |
|-------|-------|
| `name` | Полное имя |
| `given-name` | Имя |
| `family-name` | Фамилия |
| `email` | Email-адрес |
| `username` | Логин |
| `current-password` | Текущий пароль |
| `new-password` | Новый пароль |
| `tel` | Телефон |
| `street-address` | Адрес |
| `postal-code` | Почтовый индекс |
| `country` | Страна |
| `cc-number` | Номер карты |
| `cc-exp` | Срок действия карты |
| `cc-csc` | CVV-код |
| `one-time-code` | OTP-код |
| `bday` | Дата рождения |

### Практика и применение

- `autocomplete="current-password"` — браузер предложит сохранённый пароль для этого сайта
- `autocomplete="new-password"` — браузер предложит сгенерировать новый пароль и не будет путать с текущим
- `autocomplete="one-time-code"` — на мобильных iOS/Android автоматически подтягивает OTP из SMS
- `autocomplete="off"` на полях с динамическими/уникальными данными (одноразовые поля, капча)
- `autocomplete="cc-number"` включает автозаполнение данных карты из Apple Pay / Google Pay

### Важные нюансы и краеугольные камни

- Браузеры **вправе игнорировать** `autocomplete="off"` для полей паролей — это сознательное решение (безопасность пользователя важнее воли разработчика)
- `autocomplete="off"` на поле OTP **сломает** автовставку кода из SMS на мобильных — частая ошибка
- `new-password` намного лучше `off` для полей создания пароля: браузер предложит strong password generator
- Токены можно комбинировать: `autocomplete="shipping street-address"` (раздел + тип)
- `autocomplete="false"` или `autocomplete="disabled"` — невалидные значения; только `"off"` работает

### Примеры

```html
<!-- Форма логина с корректными токенами -->
<form method="POST" action="/login">
  <label for="login-email">Email</label>
  <input type="email" id="login-email" name="email" autocomplete="username" />

  <label for="login-pass">Пароль</label>
  <input type="password" id="login-pass" name="password" autocomplete="current-password" />

  <button type="submit">Войти</button>
</form>

<!-- Форма регистрации — генерация нового пароля -->
<form method="POST" action="/register">
  <input type="text" name="name" autocomplete="given-name" placeholder="Имя" />
  <input type="email" name="email" autocomplete="email" placeholder="Email" />
  <input type="password" name="password" autocomplete="new-password" placeholder="Пароль" />
  <button type="submit">Зарегистрироваться</button>
</form>

<!-- OTP поле с автовставкой из SMS -->
<input
  type="text"
  inputmode="numeric"
  autocomplete="one-time-code"
  maxlength="6"
  placeholder="Код из SMS"
/>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Почему браузер игнорирует `autocomplete="off"` для паролей?
- Чем `current-password` отличается от `new-password` с точки зрения поведения браузера?
- Как `autocomplete="one-time-code"` работает на iOS/Android?
- Что произойдёт если поставить `autocomplete="off"` на форму, но `autocomplete="email"` на конкретный инпут?
- Как `autocomplete` влияет на работу менеджеров паролей (1Password, Bitwarden)?

### Красные флаги (чего не говорить)

- «`autocomplete="off"` гарантированно отключает заполнение» — браузеры вправе это игнорировать
- «`autocomplete` нужен только для паролей» — токены охватывают адреса, карты, имена и многое другое
- «`autocomplete="false"` работает так же как `"off"`» — `"false"` невалидное значение

### Связанные темы

- [037-atribut-novalidate.md](./037-atribut-novalidate.md) — управление валидацией форм
- [034-atributy-html-form.md](./034-atributy-html-form.md) — атрибуты форм
- [039-atribut-inputmode.md](./039-atribut-inputmode.md) — тип виртуальной клавиатуры
