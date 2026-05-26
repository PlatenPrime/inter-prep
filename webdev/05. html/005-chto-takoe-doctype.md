# Q005. Что такое doctype? И для чего он используется?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

`<!DOCTYPE html>` — это инструкция в начале HTML-документа, которая сообщает браузеру использовать стандартный режим рендеринга (Standards Mode) вместо режима совместимости (Quirks Mode). Без DOCTYPE браузер переходит в Quirks Mode, имитируя баги старых браузеров IE5 — это ломает CSS-боксовую модель и многое другое. В HTML5 DOCTYPE сведён к минимальной форме `<!DOCTYPE html>` и не ссылается на DTD.

---

## Развёрнутый ответ

### Суть и определение

DOCTYPE (Document Type Declaration) — это не тег HTML, а специальная инструкция для парсера. Исторически DOCTYPE использовался для указания на DTD (Document Type Definition) — схему, описывающую допустимые элементы и атрибуты документа. В HTML5 DTD больше не используется, поэтому DOCTYPE стал чисто прагматическим — он только переключает режим рендеринга браузера.

### Как это работает

Браузер определяет режим рендеринга при парсинге первой строки документа:

```
Режим рендеринга определяется при старте парсера:

├─ DOCTYPE отсутствует          → Quirks Mode
├─ <!DOCTYPE html>              → Standards Mode (HTML5)
├─ Старые DOCTYPE с публичным   
│  идентификатором (HTML4, XHTML) → Standards Mode или Limited Quirks
└─ Неизвестный DOCTYPE          → Standards Mode (браузерная эвристика)
```

**Три режима рендеринга:**

| Режим | Триггер | Поведение |
|-------|---------|-----------|
| **Quirks Mode** | Нет DOCTYPE или старый некорректный | Имитирует баги IE5: другая боксовая модель, `margin: auto` не центрирует |
| **Limited Quirks** (Almost Standards) | Некоторые старые DOCTYPE | Почти стандартный, но с отдельными отступлениями |
| **Standards Mode** | `<!DOCTYPE html>` или корректный DOCTYPE | Полное соответствие спецификации W3C/WHATWG |

**Главное отличие Quirks Mode от Standards Mode** — боксовая модель: в Quirks Mode `width` включает `padding` и `border` (как `box-sizing: border-box`), в Standards Mode — нет (как `box-sizing: content-box`).

**Исторические DOCTYPE:**

```html
<!-- HTML 4.01 Strict -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
  "http://www.w3.org/TR/html4/strict.dtd">

<!-- XHTML 1.0 Transitional -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!-- HTML5 — единственный правильный современный вариант -->
<!DOCTYPE html>
```

### Практика и применение

- Первая строка любого HTML-файла — всегда `<!DOCTYPE html>`.
- CMS (WordPress, Drupal) и фреймворки (Next.js, Nuxt) добавляют DOCTYPE автоматически.
- В шаблонизаторах (`.hbs`, `.ejs`, `.blade.php`) DOCTYPE должен быть в базовом лейауте.
- При генерации PDF из HTML (puppeteer, wkhtmltopdf) DOCTYPE влияет на рендеринг.

### Важные нюансы и краеугольные камни

- DOCTYPE нечувствителен к регистру: `<!DOCTYPE html>`, `<!doctype html>` и `<!DOCTYPE HTML>` — эквивалентны.
- DOCTYPE не является HTML-тегом, поэтому не имеет закрывающего тега.
- Проверить режим рендеринга: `document.compatMode` — `"CSS1Compat"` (Standards) или `"BackCompat"` (Quirks).
- XML-декларация `<?xml version="1.0"?>` перед DOCTYPE в IE переводила страницу в Quirks Mode — исторический баг.
- В Quirks Mode `margin: auto` не центрирует блочные элементы, `vertical-align` работает иначе, `overflow` на `<table>` игнорируется.

### Примеры

```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <title>Страница в Standards Mode</title>
  </head>
  <body>
    <p>Рендерится по стандартам W3C/WHATWG</p>
  </body>
</html>
```

```js
// Проверка режима рендеринга в консоли браузера
console.log(document.compatMode);
// "CSS1Compat"  → Standards Mode
// "BackCompat"  → Quirks Mode
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что произойдёт, если убрать DOCTYPE?** — браузер перейдёт в Quirks Mode, CSS-боксовая модель изменится, многие стили сломаются.
- **Почему DOCTYPE в HTML5 такой короткий?** — в HTML5 больше нет DTD, DOCTYPE — только переключатель режима рендеринга.
- **Как проверить, в каком режиме рендерится страница?** — `document.compatMode` в консоли браузера.
- **Чем DOCTYPE отличается от тега `<html>`?** — DOCTYPE — инструкция парсеру, не HTML-тег; `<html>` — корневой элемент документа.

### Красные флаги (чего не говорить)

- «DOCTYPE определяет версию HTML» — в HTML5 это уже неверно: DOCTYPE — только переключатель режима.
- «DOCTYPE нужен для валидации» — валидатор использует DOCTYPE как подсказку, но современная валидация не зависит от его наличия.
- «Браузер не показывает страницу без DOCTYPE» — показывает, но в Quirks Mode.

### Связанные темы

- [001-chto-takoe-html.md](./001-chto-takoe-html.md)
- [006-bazovaya-struktura-html-stranicy.md](./006-bazovaya-struktura-html-stranicy.md)
- [008-chto-takoe-validaciya.md](./008-chto-takoe-validaciya.md)
- [009-etapy-proverki-validnosti-html.md](./009-etapy-proverki-validnosti-html.md)
