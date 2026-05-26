# Q062. Для чего используется тэг `<template>`?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

`<template>` хранит инертный HTML-фрагмент: браузер парсит его, но не рендерит, не загружает ресурсы и не выполняет скрипты внутри. Содержимое доступно через `content` (DocumentFragment) и активируется клонированием: `document.importNode(tpl.content, true)`. Элемент является фундаментом Web Components и заменяет антипаттерн с `hidden` div.

---

## Развёрнутый ответ

### Суть и определение

`<template>` — специальный HTML-элемент, содержимое которого находится в отдельном DocumentFragment, не являющемся частью активного документа. Браузер полностью парсит разметку (проверяет корректность HTML), но откладывает всё что связано с рендерингом и побочными эффектами.

Свойство `HTMLTemplateElement.content` возвращает DocumentFragment — лёгкий контейнер-узел без родителя.

### Как это работает

1. При парсинге страницы браузер помещает содержимое `<template>` в отдельный DocumentFragment.
2. Изображения не загружаются, `<script>` не выполняется, CSS не применяется.
3. Для использования фрагмент нужно клонировать (`cloneNode(true)` или `importNode`) и вставить в DOM.
4. После вставки в DOM элементы становятся «живыми»: скрипты выполнятся, картинки загрузятся.

```js
const tpl = document.getElementById('card-template');
const clone = tpl.content.cloneNode(true); // deep clone
clone.querySelector('.title').textContent = 'Заголовок';
document.body.appendChild(clone);
```

### Практика и применение

- **Web Components** — шаблон Shadow DOM: содержимое `<template>` клонируется в `shadowRoot` при создании custom element.
- **Динамические списки** — шаблон строки таблицы/карточки клонируется при добавлении данных без innerHTML (XSS-безопасно).
- **Серверный рендеринг + гидратация** — шаблоны могут содержать клиентские компоненты, активируемые JS.
- **`<slot>` в Shadow DOM** — работает в паре с `<template shadowrootmode="open">` (Declarative Shadow DOM).

### Важные нюансы и краеугольные камни

- **Инертность** — ключевое отличие от `hidden` div: у div с `display:none` ресурсы всё равно загружаются (`<img src>` запускает запрос), у `<template>` — нет.
- **DocumentFragment** не клонируется при вставке — он перемещается. При повторном использовании шаблона нужен `cloneNode(true)`, иначе `content` станет пустым.
- Шаблон не наследует стили родительского документа — при использовании в Shadow DOM стили изолированы.
- **Declarative Shadow DOM** (Chrome 90+): `<template shadowrootmode="open">` прямо в разметке создаёт Shadow DOM без JS.
- Вложенные `<template>` парсятся, но тоже инертны — нужно явно активировать каждый уровень.

### Примеры

```html
<!-- Объявление шаблона -->
<template id="user-card">
  <article class="card">
    <img class="avatar" src="" alt="" />
    <h2 class="name"></h2>
    <p class="bio"></p>
  </article>
</template>

<!-- Активация через JS -->
<script>
  function renderCard({ name, bio, avatar }) {
    const tpl = document.getElementById('user-card');
    const clone = tpl.content.cloneNode(true);
    clone.querySelector('.name').textContent = name;
    clone.querySelector('.bio').textContent = bio;
    clone.querySelector('.avatar').src = avatar;
    clone.querySelector('.avatar').alt = name;
    document.getElementById('list').appendChild(clone);
  }
</script>

<!-- Declarative Shadow DOM (без JS) -->
<my-element>
  <template shadowrootmode="open">
    <style>:host { display: block; color: navy; }</style>
    <slot></slot>
  </template>
  <span>Содержимое</span>
</my-element>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- В чём конкретная разница между `<template>` и `<div hidden>`? (ресурсы, выполнение скриптов, производительность)
- Почему при повторном использовании нужен `cloneNode(true)`, а не прямой `appendChild(tpl.content)`? (content опустеет)
- Что такое Declarative Shadow DOM и чем он лучше imperative? (SSR, без JS для создания Shadow DOM)
- Как `<template>` помогает предотвратить XSS по сравнению с innerHTML? (работа с DOM-узлами, не строками)
- Как шаблоны связаны с `<slot>` в Web Components?

### Красные флаги (чего не говорить)

- «`<template>` просто скрывает элементы как `display:none`» — инертность гораздо глубже.
- «Содержимое template блокирует загрузку страницы» — нет, это его главное преимущество.
- «template и fragment — одно и то же» — template является элементом DOM, fragment — нет.

### Связанные темы

- [`063-teg-dialog.md`](./063-teg-dialog.md) — нативный диалог, часто реализуется через template
- [`065-skryt-element-bez-css-js.md`](./065-skryt-element-bez-css-js.md) — атрибут hidden и его отличия
