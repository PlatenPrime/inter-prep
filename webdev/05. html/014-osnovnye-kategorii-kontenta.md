# Q014. Какие категории считаются основными категориями контента?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

HTML5 определяет семь основных категорий контента: Flow, Sectioning, Heading, Phrasing, Embedded, Interactive и Metadata. Flow content — самая широкая категория, охватывающая почти всё содержимое `<body>`. Остальные категории либо являются подмножеством Flow, либо описывают специализированные роли (метаданные, встроенные ресурсы, интерактивные элементы).

---

## Развёрнутый ответ

### Суть и определение

Согласно спецификации WHATWG HTML Living Standard, каждый HTML-элемент классифицируется по своей роли в документе. Это формальная система, определяющая **правила вложенности** и **допустимые контексты** использования элементов.

### Как это работает

Категории образуют частично перекрывающиеся множества — элемент может принадлежать нескольким категориям одновременно. Большинство категорий (кроме Metadata) являются подмножеством **Flow content**.

```
Flow content (большинство элементов body)
├── Sectioning content  (article, aside, nav, section)
├── Heading content     (h1–h6, hgroup)
├── Phrasing content    (inline-подобные элементы)
│   └── Embedded content (img, video, iframe, canvas...)
│       └── Interactive content (a, button, input...)
└── ... остальные flow-элементы
Metadata content        (отдельно, обычно в <head>)
```

### Разбор каждой категории

**1. Flow content**
Самая широкая категория. Включает практически всё, что можно поместить в тело документа. Если элемент принадлежит другим категориям, он, как правило, также входит в Flow.
Примеры: `<div>`, `<p>`, `<ul>`, `<table>`, `<article>`, `<span>`, `<a>`, `<img>`

**2. Sectioning content**
Элементы, создающие новые области документа (outline) и определяющие область действия `<header>`, `<footer>` и heading content.
Примеры: `<article>`, `<aside>`, `<nav>`, `<section>`

**3. Heading content**
Заголовки разделов. Определяют заголовок секции, явной (sectioning content) или неявной.
Примеры: `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`, `<hgroup>`

**4. Phrasing content**
Текст и элементы, форматирующие текст внутри параграфов. Это «строчная» часть flow content, принимаемая элементами вроде `<p>`.
Примеры: `<span>`, `<a>`, `<strong>`, `<em>`, `<abbr>`, `<code>`, `<img>`, `<input>`, `<label>`

**5. Embedded content**
Элементы, встраивающие внешние ресурсы или контент из других пространств имён (MathML, SVG).
Примеры: `<audio>`, `<canvas>`, `<embed>`, `<iframe>`, `<img>`, `<math>`, `<object>`, `<picture>`, `<svg>`, `<video>`

**6. Interactive content**
Элементы, предназначенные для взаимодействия с пользователем. Нельзя вкладывать interactive content в interactive content.
Примеры: `<a href>`, `<button>`, `<details>`, `<embed>`, `<iframe>`, `<input>` (кроме `type="hidden"`), `<label>`, `<select>`, `<textarea>`

**7. Metadata content**
Метаданные: устанавливают поведение остального контента или задают отношение документа с другими. Обычно размещаются в `<head>`, но `<script>` и `<noscript>` могут быть и в `<body>`.
Примеры: `<base>`, `<link>`, `<meta>`, `<noscript>`, `<script>`, `<style>`, `<template>`, `<title>`

### Практика и применение

- Понимание категорий необходимо при написании валидного HTML и при анализе неожиданного поведения браузерного парсера.
- При разработке Web Components знание content model помогает правильно определять `<slot>` и `permitted content`.
- Категории используются в документации MDN в разделах «Content categories» и «Permitted content» каждого элемента.

### Важные нюансы и краеугольные камни

- **Контекстная принадлежность**: `<link>` — metadata content в `<head>`, но может быть phrasing content в `<body>` при определённых атрибутах `itemprop`.
- **Transparent content model**: `<a>`, `<ins>`, `<del>`, `<map>` и ряд других элементов «прозрачны» — их content model определяется родителем.
- **Phrasing ⊂ Flow**: phrasing content — подмножество flow content. Элементы phrasing также являются flow.
- **Embedded ⊂ Phrasing ⊂ Flow**: embedded content — подмножество phrasing.

### Примеры

```html
<!-- Metadata content в <head> -->
<head>
  <meta charset="UTF-8" />
  <title>Пример</title>
  <link rel="stylesheet" href="styles.css" />
</head>

<!-- Sectioning content создаёт новую секцию документа -->
<article>
  <h2>Заголовок статьи</h2> <!-- heading content -->
  <p>
    <!-- phrasing content: span, strong, a -->
    <span>Текст</span> со <strong>важным</strong> словом и
    <a href="/more">ссылкой</a>.
    <!-- embedded content -->
    <img src="photo.webp" alt="Фото" />
  </p>
  <!-- interactive content -->
  <button type="button">Подробнее</button>
</article>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Является ли `<img>` одновременно embedded и phrasing content? (да)
- Почему нельзя вложить `<button>` в `<a>`? (оба interactive content)
- Что такое transparent content model и как она применяется к `<a>`? (наследует модель родителя)
- В чём разница между sectioning content и heading content? (sectioning создаёт область, heading — её заголовок)
- Может ли `<script>` находиться в `<body>`? (да, он flow content и phrasing content)

### Красные флаги (чего не говорить)

- «Основных категорий три: блочные, строчные и таблицы» — это HTML4-модель, в HTML5 она устарела.
- «Embedded content — это только `<iframe>`» — это обширная категория включающая img, video, canvas, svg и другие.
- «Metadata content всегда в `<head>`» — `<script>`, `<noscript>`, `<template>` могут быть и в body.

### Связанные темы

- [013-kategorii-kontenta-html5.md](./013-kategorii-kontenta-html5.md)
- [015-raznica-blochnye-strochyne-elementy.md](./015-raznica-blochnye-strochyne-elementy.md)
- [016-article-vs-section.md](./016-article-vs-section.md)
