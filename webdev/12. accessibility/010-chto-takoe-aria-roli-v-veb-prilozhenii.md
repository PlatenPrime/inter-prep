# Q010. Что такое ARIA роли в веб приложении?

> **Источник:** [12. accessibility.md](../12.%20accessibility.md) · **Тема:** Accessibility

---

## Короткий ответ

**ARIA (Accessible Rich Internet Applications)** — спецификация W3C, определяющая атрибуты `role`, `aria-*` и `aria-live` для обогащения семантики HTML-элементов. Роли (roles) сообщают вспомогательным технологиям, **что это за элемент** (кнопка, диалог, вкладка, дерево), когда нативный HTML не передаёт эту информацию. Первое правило ARIA: используй нативный HTML там, где он достаточен.

---

## Развёрнутый ответ

### Суть и определение

ARIA состоит из трёх частей:
1. **Roles** (`role="..."`) — тип/функция элемента
2. **Properties** (`aria-label`, `aria-labelledby`, `aria-required`, ...) — статичные характеристики
3. **States** (`aria-checked`, `aria-expanded`, `aria-disabled`, ...) — динамические состояния

Роли передаются в Accessibility Tree и объявляются скринридером при фокусировании. Без роли кастомный `<div>` для AT — просто «группа» без смысла.

### Как это работает

Роли делятся на категории:

#### Landmark roles (ориентиры)

Определяют крупные регионы страницы. Пользователи скринридеров могут прыгать между ними горячими клавишами.

| Role | HTML-эквивалент |
|------|----------------|
| `banner` | `<header>` |
| `navigation` | `<nav>` |
| `main` | `<main>` |
| `complementary` | `<aside>` |
| `contentinfo` | `<footer>` |
| `search` | `<search>` (HTML5.3) / `<form role="search">` |
| `form` | `<form aria-label="...">` |
| `region` | `<section aria-labelledby="...">` |

#### Widget roles (компоненты)

Для интерактивных виджетов, которых нет в нативном HTML.

| Role | Описание |
|------|---------|
| `button` | Кнопка (уже есть у `<button>`) |
| `checkbox` | Чекбокс |
| `dialog` | Модальное окно |
| `tablist` / `tab` / `tabpanel` | Вкладки |
| `tree` / `treeitem` | Дерево |
| `grid` / `row` / `gridcell` | Интерактивная таблица |
| `combobox` / `listbox` / `option` | Выпадающий список |
| `slider` | Ползунок |
| `spinbutton` | Числовой ввод с +/- |
| `tooltip` | Всплывающая подсказка |
| `alertdialog` | Диалог с ошибкой/подтверждением |

#### Document structure roles

`list`, `listitem`, `table`, `row`, `columnheader`, `rowheader`, `figure`, `img`, `separator`, `note`, `definition`...

#### Live region roles

`alert`, `status`, `log`, `marquee`, `timer` — для автоматически обновляемого контента.

### Практика и применение

Три правила ARIA:

1. **Не добавляй ARIA без необходимости** — нативные HTML-элементы имеют встроенную семантику.
2. **Не меняй нативную семантику** — `<h1 role="button">` — плохая идея.
3. **Все интерактивные ARIA-виджеты должны управляться с клавиатуры**.

```
Кнопка:       <button>  НЕ  <div role="button"> (если не вынужден)
Чекбокс:      <input type="checkbox">  НЕ  <div role="checkbox">
Навигация:    <nav>  НЕ  <div role="navigation">
```

### Важные нюансы и краеугольные камни

- **ARIA не добавляет поведение** — `role="button"` не делает `<div>` фокусируемым или реагирующим на Enter/Space. Всё поведение нужно добавить вручную.
- **ARIA Authoring Practices Guide (APG)** — официальные паттерны для каждого виджета с примерами клавиатурного взаимодействия.
- Атрибуты `aria-*` должны синхронизироваться с реальным состоянием: `aria-expanded="false"` должно меняться на `true` при раскрытии.
- Ошибка: установить роль, забыть про связанные атрибуты — `role="checkbox"` без `aria-checked` бесполезен.

### Примеры

```html
<!-- Кастомный аккордеон (WAI-ARIA APG) -->
<div>
  <h3>
    <button
      aria-expanded="false"
      aria-controls="panel-1"
      id="btn-1"
    >
      Раздел 1
    </button>
  </h3>
  <div
    role="region"
    id="panel-1"
    aria-labelledby="btn-1"
    hidden
  >
    Содержимое раздела 1
  </div>
</div>

<!-- Вкладки -->
<div role="tablist" aria-label="Разделы настроек">
  <button role="tab" aria-selected="true" aria-controls="panel-general" id="tab-general">
    Основные
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-security" id="tab-security" tabindex="-1">
    Безопасность
  </button>
</div>
<div role="tabpanel" id="panel-general" aria-labelledby="tab-general">
  Основные настройки
</div>
<div role="tabpanel" id="panel-security" aria-labelledby="tab-security" hidden>
  Настройки безопасности
</div>

<!-- Alert live region -->
<div role="alert" aria-live="assertive">
  <!-- AT немедленно прочтёт при появлении контента -->
</div>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Каково первое правило ARIA?** — если можно использовать нативный HTML с нужной семантикой, используй его.
- **Что нужно добавить помимо `role="button"` для `<div>`?** — `tabindex="0"`, обработчики `click`, `keydown` (Enter и Space), состояние `aria-disabled` при необходимости.
- **Чем `role="alert"` отличается от `role="status"`?** — `alert` — assertive (прерывает), `status` — polite (ждёт паузы); `alert` для ошибок, `status` для уведомлений.

### Красные флаги (чего не говорить)

- «ARIA автоматически делает элемент доступным» — ARIA только добавляет семантику в AT, поведение (фокус, клавиатура) нужно реализовывать отдельно.
- «Чем больше ARIA, тем лучше» — избыточный ARIA шумит в AT и мешает пользователям.
- «`role="presentation"` и `role="none"` одно и то же что `aria-hidden`» — разные механизмы с разным эффектом.

### Связанные темы

- `009-kak-udalit-semantiku-u-elementa.md`
- `011-dlya-chego-ispolzuetsya-atribut-aria-roledescription.md`
- `012-raznica-mezhdu-role-i-aria-label.md`
- `013-kak-sozdat-dostupnyy-spisok-v-html-s-pomoshyu-aria-roley.md`
