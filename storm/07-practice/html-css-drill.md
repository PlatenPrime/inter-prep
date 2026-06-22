# HTML + CSS — 3 мини-drill (без автотестов)

> Выполни в любом редакторе (VS Code + Live Server) или на [codepen.io](https://codepen.io).  
> Время: ~25 мин на все три.

---

## Drill 1 — Семантическая разметка (10 мин)

### Задание
Разметь страницу **блога** без лишних `<div>`:

- Шапка с логотипом и навигацией (3 ссылки)
- Основной контент: одна статья с заголовком, датой, текстом
- Боковая колонка не нужна
- Подвал с копирайтом

### Критерии приёмки
- [ ] Есть `header`, `nav`, `main`, `article`, `footer`
- [ ] Один `h1` на странице, подзаголовки `h2` при необходимости
- [ ] Ссылки в `nav` — настоящие `<a href="#">`, не `span`
- [ ] `lang` на `<html>` (например `uk` или `ru`)

### Пример скелета (скрыто — попробуй сам, потом сверь)

<details>
<summary>Показать скелет</summary>

```html
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Мій блог</title>
</head>
<body>
  <header>
    <a href="/">Логотип</a>
    <nav aria-label="Головна навігація">
      <a href="#">Головна</a>
      <a href="#">Статті</a>
      <a href="#">Контакти</a>
    </nav>
  </header>
  <main>
    <article>
      <h1>Заголовок статті</h1>
      <time datetime="2026-06-22">22 червня 2026</time>
      <p>Текст статті...</p>
    </article>
  </main>
  <footer>
    <p>&copy; 2026 Мій блог</p>
  </footer>
</body>
</html>
```

</details>

---

## Drill 2 — Flex: центрирование карточки (10 мин)

### Задание
Сверстай экран, где **карточка** (300×200px, border, border-radius) **по центру** viewport по горизонтали и вертикали.

### Требования
- Только flex на родителе (без `position: absolute` для центрирования)
- `box-sizing: border-box` на карточке
- На мобильном карточка не прилипает к краям — отступ минимум 16px (`padding` на wrapper или `gap`)

### Критерии приёмки
- [ ] `display: flex` на контейнере full viewport height
- [ ] `justify-content: center` и `align-items: center`
- [ ] Карточка визуально по центру при 375px и 1280px ширине

### Решение (после попытки)

<details>
<summary>Показать CSS</summary>

```html
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; }
  .page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 16px;
  }
  .card {
    width: 300px;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
</style>
<div class="page">
  <div class="card"></div>
</div>
```

</details>

**Примеры в репо:** [examples/css/02-flexbox/011-flex-center/](../../examples/css/02-flexbox/011-flex-center/)

---

## Drill 3 — Форма с доступностью (5 мин)

### Задание
Форма «Контакт» с полями:
- Имя (text, required)
- Email (email, required)
- Кнопка «Надіслати» (`type="submit"`)

### Критерии приёмки
- [ ] У каждого `input` связанный `<label for="...">`
- [ ] Кнопка — `<button type="submit">`, не `<div>`
- [ ] `autocomplete` на email: `email`
- [ ] У формы `aria-label` или видимый `<h2>`

### Вопрос на собесе (устно)
**[RU]** Что сломается для screen reader, если убрать `label`?  
**Answer (EN):** The field may be announced as unlabeled — users won't know what to enter. Clicking label won't focus input. WCAG failure.

---

## Self-check после drill

- [ ] Могу объяснить каждый семантический тег в Drill 1
- [ ] Помню три flex-свойства для центрирования
- [ ] Знаю связку `label for` + `input id`
