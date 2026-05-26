# Q015. Назовите псевдоэлементы для подсветки текста?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

Для подсветки текста используются псевдоэлементы группы **highlight**: `::selection` (выделение пользователем), `::highlight()` (кастомные хайлайты через JavaScript Highlight API), `::spelling-error` и `::grammar-error` (орфографические/грамматические ошибки), `::target-text` (текст из URL-фрагмента `#:~:text=...`).

---

## Развёрнутый ответ

### Суть и определение

Спецификация **CSS Custom Highlight API** объединяет псевдоэлементы подсветки в отдельную группу. Они накладываются на текстовые узлы без изменения DOM.

| Псевдоэлемент | Назначение | Источник |
|---------------|-----------|----------|
| `::selection` | Текст, выделенный пользователем мышью/клавиатурой | CSS2.1 / CSS3 |
| `::spelling-error` | Текст, помеченный браузером как орфографическая ошибка | CSS4 |
| `::grammar-error` | Текст с грамматической ошибкой | CSS4 |
| `::target-text` | Текст из фрагмента URL (`#:~:text=...`) | CSS4 |
| `::highlight(name)` | Кастомные хайлайты через JS Highlight API | CSS Custom Highlight |

### Как это работает

**`::selection`:**
- Применяется автоматически при выделении текста.
- Ограниченный набор CSS-свойств: `color`, `background-color`, `text-decoration`, `text-shadow`, `stroke-color`, `fill-color`, `stroke-width`.
- Нельзя задавать `padding`, `margin`, `border`, `font-*`.
- Работает на любом тексте, включая `::before`/`::after` с `content`.

**`::highlight(name)` (Custom Highlight API):**
```javascript
// JS: создать Range и зарегистрировать highlight
const range = new Range();
range.setStart(textNode, 5);
range.setEnd(textNode, 10);
CSS.highlights.set('my-highlight', new Highlight(range));
```
```css
/* CSS: стилизовать */
::highlight(my-highlight) {
  background-color: yellow;
  color: black;
}
```

### Практика и применение

- `::selection` — кастомная цветовая схема выделения (корпоративный цвет бренда).
- `::highlight()` — синтаксическая подсветка кода (CodeMirror 6, Monaco Editor), поиск по тексту.
- `::target-text` — стилизация результатов Text Fragment Links (ссылок с `#:~:text=`).
- `::spelling-error` — кастомное подчёркивание орфографических ошибок (альтернатива красной волнистой линии браузера).

### Важные нюансы и краеугольные камни

- `::selection` имеет **ограниченный список** допустимых CSS-свойств — большинство свойств просто игнорируются.
- Firefox требует `-moz-selection` в старых версиях (до 62), современные используют стандарт.
- `::selection` не работает внутри `<input type="text">` и `<textarea>` в некоторых браузерах.
- `::highlight()` поддерживается Chrome 105+, Safari 17.2+, Firefox 117+.
- `::target-text` поддерживается пока только в Chromium-браузерах.
- Нельзя делать `color: inherit` в `::selection` — нужно указать явно.

### Примеры

```css
/* Кастомное выделение в бренд-цветах */
::selection {
  background-color: var(--color-primary);
  color: #fff;
}

/* Выделение для конкретного блока */
.code-block::selection {
  background-color: #264f78;
  color: #fff;
}

/* Стилизация орфографических ошибок */
::spelling-error {
  text-decoration: wavy underline red;
}

/* Target text — подсветка из URL фрагмента */
::target-text {
  background-color: #ffeb3b;
  color: #000;
}
```

```javascript
// Custom Highlight API — поиск по тексту
function highlightMatches(query) {
  CSS.highlights.clear();
  if (!query) return;

  const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const ranges = [];

  let node;
  while ((node = treeWalker.nextNode())) {
    let startIndex = 0;
    const text = node.textContent.toLowerCase();
    const q = query.toLowerCase();
    while ((startIndex = text.indexOf(q, startIndex)) !== -1) {
      const range = new Range();
      range.setStart(node, startIndex);
      range.setEnd(node, startIndex + q.length);
      ranges.push(range);
      startIndex += q.length;
    }
  }

  CSS.highlights.set('search', new Highlight(...ranges));
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему нельзя задать `padding` в `::selection`?** — Highlight псевдоэлементы не создают box, они накладываются на текстовые узлы; box-model свойства не применимы.
- **Чем `::highlight()` лучше span-обёрток для подсветки кода?** — Не изменяет DOM, нет Reflow/Repaint от вставки тегов; производительнее при большом тексте.
- **Как `::target-text` связан с Text Fragments?** — Text Fragments (`#:~:text=`) позволяют ссылаться на произвольный текст на странице; `::target-text` стилизует этот фрагмент.

### Красные флаги (чего не говорить)

- «`::selection` поддерживает все CSS-свойства» — только ограниченный набор.
- «Нет других псевдоэлементов для текста кроме `::selection`» — существует целая группа highlight псевдоэлементов.

### Связанные темы

- `010-chto-takoe-psevdoelementy-i-dlya-chego-oni-ispolzuyutsya.md`
- `011-raznica-mezhdu-psevdoklassami-i-psevdoelementami.md`
