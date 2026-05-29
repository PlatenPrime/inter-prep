# Q013. Как создать доступный список в HTML с помощью ARIA ролей?

> **Источник:** [12. accessibility.md](../12.%20accessibility.md) · **Тема:** Accessibility

---

## Короткий ответ

Предпочтительный путь — нативный HTML: `<ul>`/`<ol>` с `<li>` уже содержат роли `list` и `listitem`. ARIA-роли (`role="list"` / `role="listitem"`) используются, когда CSS-сброс (`list-style: none`) удаляет нативную семантику в VoiceOver/Safari, или когда нативный HTML по каким-то причинам недоступен. Главное — пара ролей должна всегда использоваться вместе.

---

## Развёрнутый ответ

### Суть и определение

Семантика списка важна для пользователей скринридеров: AT объявляет «список, 5 элементов», позволяет прыгать между пунктами горячими клавишами и навигировать внутри виджета. Потеря этой семантики лишает пользователя ориентации в структуре контента.

### Как это работает

#### Нативный HTML (предпочтительно)

```html
<!-- Ненумерованный список -->
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
<!-- AT: "список, 3 элемента" → "HTML, 1 из 3" → "CSS, 2 из 3" -->

<!-- Нумерованный список -->
<ol>
  <li>Открыть редактор</li>
  <li>Написать код</li>
  <li>Запустить тесты</li>
</ol>
<!-- AT: "список, 3 элемента" / нумерует: "1. Открыть редактор" -->

<!-- Список описаний -->
<dl>
  <dt>HTTP</dt>
  <dd>Протокол передачи гипертекста</dd>
  <dt>ARIA</dt>
  <dd>Accessible Rich Internet Applications</dd>
</dl>
```

#### Проблема VoiceOver + `list-style: none`

Safari/VoiceOver удаляет роль `list`, если `list-style: none` применён к `<ul>`. Это «фича», а не баг — WebKit предполагает, что стилизованный список декоративный.

**Решение:**

```html
<!-- Явно добавляем role="list" после сброса стилей -->
<ul role="list" style="list-style: none; padding: 0; margin: 0;">
  <li>Элемент 1</li>
  <li>Элемент 2</li>
</ul>
```

#### ARIA-роли для нестандартной разметки

Когда структура HTML не позволяет использовать `<ul>`/`<li>` (например, кастомный виджет на `<div>`):

```html
<div role="list">
  <div role="listitem">Задача 1</div>
  <div role="listitem">Задача 2</div>
  <div role="listitem">Задача 3</div>
</div>
```

#### Навигационные списки

```html
<!-- nav + ul — правильная семантика для меню -->
<nav aria-label="Основное меню">
  <ul role="list">
    <li><a href="/">Главная</a></li>
    <li><a href="/about">О нас</a></li>
    <li><a href="/contact">Контакты</a></li>
  </ul>
</nav>
```

#### Интерактивный список с выбором (listbox)

Когда нужен список с выбором (не нативный `<select>`):

```html
<div
  role="listbox"
  aria-label="Выберите язык программирования"
  aria-activedescendant="opt-js"
>
  <div role="option" id="opt-js" aria-selected="true">JavaScript</div>
  <div role="option" id="opt-ts" aria-selected="false">TypeScript</div>
  <div role="option" id="opt-py" aria-selected="false">Python</div>
</div>
```

### Практика и применение

| Тип списка | HTML | ARIA-роль |
|-----------|------|-----------|
| Ненумерованный | `<ul>` + `<li>` | `list` + `listitem` |
| Нумерованный | `<ol>` + `<li>` | `list` + `listitem` |
| Описания | `<dl>` + `<dt>` + `<dd>` | `term` + `definition` |
| Выбор значения | `<select>` + `<option>` | `listbox` + `option` |
| Навигация | `<nav>` + `<ul>` | `navigation` + `list` |

### Важные нюансы и краеугольные камни

- `role="list"` без `role="listitem"` у дочерних элементов работает некорректно в большинстве AT — пара обязательна.
- `role="listbox"` требует управления с клавиатуры: стрелки для навигации, Enter/Space для выбора, `aria-activedescendant` для указания текущего элемента.
- Вложенные списки: `<ul>` → `<li>` → `<ul>` — семантика сохраняется; NVDA объявит уровень вложенности.
- `<menu>` в HTML5 имеет роль `list` и предназначен для контекстных меню, а не обычной навигации.
- `role="listitem"` нельзя применять к элементам вне контейнера `role="list"` — нарушение required context.

### Примеры

```html
<!-- 1. Нативный список со сброшенными стилями (решение VoiceOver) -->
<ul role="list" class="tag-list">
  <li>React</li>
  <li>TypeScript</li>
  <li>Accessibility</li>
</ul>

/* CSS */
.tag-list {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 2. Виртуализированный список (React/Vue) */
<div role="list" aria-label="Список задач" aria-rowcount="200">
  {items.map(item => (
    <div key={item.id} role="listitem">
      {item.title}
    </div>
  ))}
</div>

<!-- 3. Вложенный список -->
<ul>
  <li>
    Frontend
    <ul>
      <li>React</li>
      <li>Vue</li>
    </ul>
  </li>
  <li>Backend</li>
</ul>
<!-- NVDA: "Frontend, 1 из 2 уровень 1" → "React, 1 из 2 уровень 2" -->
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `list-style: none` ломает доступность в Safari?** — WebKit интерпретирует сброс стилей как сигнал декоративности списка и удаляет роль `list` из Accessibility Tree.
- **Когда использовать `role="listbox"` вместо `<select>`?** — для кастомных выпадающих меню с расширенным функционалом (изображения, чекбоксы); требует полной клавиатурной реализации.
- **Как правильно реализовать виртуализированный список?** — `role="list"` на контейнере, `role="listitem"` на каждом рендеримом элементе, `aria-rowcount` для общего числа.

### Красные флаги (чего не говорить)

- «`<div>` со стилями под список — норм» — теряется семантика, нужен хотя бы `role="list"`.
- «`role="list"` можно без `role="listitem"` у дочерних элементов» — нарушение required owned elements в ARIA.
- «Списки для навигации не нужны» — `<nav>` + `<ul>` — устоявшийся паттерн; AT объявляют «навигация, список, N пунктов».

### Связанные темы

- `010-chto-takoe-aria-roli-v-veb-prilozhenii.md`
- `014-kakie-html-atributy-mozhno-ispolzovat-dlya-uluchsheniya-dostupnosti.md`
- `009-kak-udalit-semantiku-u-elementa.md`
