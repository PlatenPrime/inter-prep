# Q034. Основные атрибуты HTML-форм? Как они влияют на отправку данных с веб-страницы?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

Ключевые атрибуты тега `<form>`: `action` (URL назначения), `method` (HTTP-метод: GET или POST), `enctype` (кодировка тела запроса, обязательна `multipart/form-data` при загрузке файлов), `target` (контекст открытия ответа) и `name`. При отправке браузер собирает данные полей с атрибутом `name` в объект `FormData` и отправляет их согласно `method` и `enctype`.

---

## Развёрнутый ответ

### Суть и определение

Атрибуты `<form>` определяют, **куда**, **как** и **в каком формате** браузер отправит данные при submit. Каждый атрибут влияет на одну из составляющих HTTP-запроса.

### Как это работает

**Основные атрибуты:**

| Атрибут | Значения | Описание |
|---------|----------|----------|
| `action` | URL | Куда отправить данные. По умолчанию — текущий URL страницы |
| `method` | `GET`, `POST` | HTTP-метод запроса |
| `enctype` | `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain` | Кодировка тела запроса |
| `target` | `_self`, `_blank`, `_parent`, `_top`, имя фрейма | Где открыть ответ сервера |
| `name` | строка | Имя формы для доступа через `document.forms` |
| `novalidate` | булев | Отключает встроенную HTML5-валидацию |
| `autocomplete` | `on`, `off` | Управляет автозаполнением браузером |

**Механизм сборки данных:**

1. Браузер обходит все поля формы с атрибутом `name`
2. Поля без `name` или с `disabled` игнорируются
3. Чекбоксы и радио включаются только если они `checked`
4. Данные упаковываются в `FormData`

**Отличие GET от POST:**
- `GET`: данные кодируются в query string URL (`?name=value&...`), ограничены по длине, видны в адресной строке, кэшируются
- `POST`: данные в теле запроса, без ограничений по размеру, не видны в URL, не кэшируются

**Роль `enctype`:**
- `application/x-www-form-urlencoded` (по умолчанию): пары `key=value` URL-кодируются, `+` вместо пробела
- `multipart/form-data`: каждое поле — отдельная часть MIME-сообщения; **обязателен** для `<input type="file">`
- `text/plain`: без кодирования, используется редко (отладка)

### Практика и применение

- Форма логина: `method="POST"`, `action="/login"`, `enctype` по умолчанию
- Форма поиска: `method="GET"`, чтобы URL был закладываемым и кэшируемым
- Форма загрузки файла: `method="POST"`, `enctype="multipart/form-data"` — обязательно
- `target="_blank"` в формах используется крайне редко и может создавать UX-проблемы

### Важные нюансы и краеугольные камни

- Если указать `enctype="multipart/form-data"`, но метод `GET` — файлы всё равно не передадутся; `multipart` работает только с POST
- Атрибуты `formaction`, `formmethod`, `formenctype`, `formtarget`, `formnovalidate` на `<button>` или `<input type="submit">` **переопределяют** соответствующие атрибуты формы для конкретной кнопки
- Поле `<input type="submit">` и `<button type="submit">` сами добавляют `name=value` в данные формы, если у них есть `name`
- При `method="GET"` `enctype` игнорируется

### Примеры

```html
<!-- Форма логина -->
<form action="/api/login" method="POST" autocomplete="on">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />

  <label for="password">Пароль</label>
  <input type="password" id="password" name="password" required />

  <button type="submit">Войти</button>
</form>

<!-- Форма загрузки файла -->
<form action="/upload" method="POST" enctype="multipart/form-data">
  <label for="avatar">Аватар</label>
  <input type="file" id="avatar" name="avatar" accept="image/*" />
  <button type="submit">Загрузить</button>
</form>

<!-- Переопределение action для отдельной кнопки -->
<form action="/save" method="POST">
  <input type="text" name="title" />
  <button type="submit">Сохранить</button>
  <button type="submit" formaction="/publish">Опубликовать</button>
</form>
```

---

## Сравнение (GET vs POST)

| Критерий | GET | POST |
|----------|-----|------|
| Данные в | URL (query string) | Тело запроса |
| Ограничение размера | ~2000 символов (зависит от браузера/сервера) | Практически нет |
| Видимость данных | Видны в URL | Скрыты |
| Кэширование | Да | Нет |
| Закладка | Можно сохранить | Нельзя |
| Идемпотентность | Да | Нет |
| Применение | Поиск, фильтры | Логин, отправка данных, загрузка файлов |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Что случится если `<input type="file">` в форме с `enctype` по умолчанию?
- Как `formaction` на кнопке переопределяет `action` формы?
- Почему GET нельзя использовать для отправки паролей?
- Как браузер обрабатывает поля без атрибута `name`?
- Как программно отправить форму и как это отличается от нативного submit?

### Красные флаги (чего не говорить)

- «POST безопаснее GET» — POST скрывает данные от адресной строки, но без HTTPS оба небезопасны
- «`enctype` нужен только для красоты» — без `multipart/form-data` загрузка файлов не работает
- «Данные POST нельзя посмотреть» — видны в DevTools Network

### Связанные темы

- [035-validaciya-form-html5.md](./035-validaciya-form-html5.md) — валидация форм
- [037-atribut-novalidate.md](./037-atribut-novalidate.md) — атрибут novalidate
- [036-atribut-autocomplete.md](./036-atribut-autocomplete.md) — атрибут autocomplete
