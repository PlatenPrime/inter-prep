# Q008. Как скрыть содержимое тэга от скринридеров?

> **Источник:** [12. accessibility.md](../12.%20accessibility.md) · **Тема:** Accessibility

---

## Короткий ответ

Содержимое скрывается от скринридеров через `aria-hidden="true"` — элемент остаётся видимым, но исключается из Accessibility Tree. Альтернативы: `display: none` и `visibility: hidden` скрывают элемент как визуально, так и от AT. Атрибут `hidden` ведёт себя аналогично `display: none`. Каждый способ решает разную задачу, и их нельзя смешивать бездумно.

---

## Развёрнутый ответ

### Суть и определение

Скринридер читает **Accessibility Tree**, построенный браузером. Чтобы элемент не попал в дерево, нужно либо исключить его из рендеринга, либо явно пометить как нерелевантный для AT.

### Как это работает

#### Способ 1: `aria-hidden="true"`

Самый прицельный способ: элемент **видим визуально**, но полностью исключён из Accessibility Tree.

```html
<!-- Декоративная иконка — не нужна скринридеру -->
<button>
  <svg aria-hidden="true" focusable="false" width="20" height="20">
    <use href="#icon-search" />
  </svg>
  Найти
</button>
```

**Важно:** нельзя вешать `aria-hidden="true"` на фокусируемый элемент — он исчезнет из AT, но останется в Tab-порядке, создавая «призрачный» фокус.

#### Способ 2: `display: none` / `visibility: hidden`

Скрывает элемент и визуально, и от AT. Используется, когда контент должен быть скрыт полностью (например, закрытое модальное окно, неактивный таб).

```html
<div id="tooltip" hidden>Подсказка</div>
<!-- hidden === display:none → скрыто визуально и от AT -->
```

#### Способ 3: HTML-атрибут `hidden`

Эквивалентен `display: none`. Поддерживается нативно, удобен в динамических интерфейсах.

```html
<div role="tabpanel" id="panel-1" hidden>Содержимое панели</div>
```

#### Способ 4: Визуально скрытый, но доступный (`.sr-only`)

Обратная задача — скрыть **визуально**, но **оставить в AT**. Нужно для вспомогательных текстов.

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

```html
<button>
  <svg aria-hidden="true" focusable="false">...</svg>
  <span class="sr-only">Закрыть диалог</span>
</button>
```

### Практика и применение

| Задача | Решение |
|--------|---------|
| Декоративная иконка SVG | `aria-hidden="true"` на `<svg>` |
| Дублирующий текст рядом с иконкой | `aria-hidden="true"` на иконку, текст виден |
| Скрытая панель (неактивный таб) | `hidden` или `display: none` |
| Только для скринридера (контекст) | `.sr-only` (visually-hidden) |
| Счётчик значка (badge) | `aria-label` на кнопку или `.sr-only` |

### Важные нюансы и краеугольные камни

- `aria-hidden` **наследуется**: если поставить на родителя, все потомки исчезнут из AT — будьте осторожны с контейнерами.
- `aria-hidden` на `<body>` при открытии модалки — правильный паттерн «modal dialog»: весь основной контент помечается `aria-hidden="true"`, пока модалка открыта.
- Не путать `aria-hidden` с `role="presentation"` / `role="none"` — `role="none"` убирает семантику элемента, но его потомки остаются в AT.
- `focusable="false"` на `<svg>` нужен для IE/Edge: в старых версиях SVG становился фокусируемым по умолчанию.
- `clip-path: inset(50%)` — современная альтернатива `clip: rect()` в `.sr-only`.

### Примеры

```html
<!-- 1. Декоративная иконка со скрытым от AT SVG -->
<a href="/cart">
  <svg aria-hidden="true" focusable="false">...</svg>
  Корзина
</a>

<!-- 2. Бейдж с числом: иконка скрыта, число доступно через aria-label -->
<button aria-label="Уведомления, 3 новых">
  <svg aria-hidden="true" focusable="false">...</svg>
  <span aria-hidden="true" class="badge">3</span>
</button>

<!-- 3. Модалка: основной контент скрыт от AT при открытии -->
<!-- JS: document.getElementById('app').setAttribute('aria-hidden', 'true') -->
<div id="app" aria-hidden="true">
  <!-- основной контент страницы -->
</div>
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Подтверждение</h2>
  ...
</div>

<!-- 4. Только для скринридера -->
<span class="sr-only">Текущая страница:</span>
<strong>О нас</strong>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что произойдёт, если поставить `aria-hidden="true"` на фокусируемый элемент?** — элемент исчезнет из AT, но останется в Tab-порядке; NVDA/JAWS не объявят его, но фокус на нём будет — «призрачный» баг.
- **Как скрыть контент от AT, но сохранить в Tab-порядке?** — технически это плохая практика; если нужна такая логика — пересмотреть архитектуру.
- **Чем `.sr-only` лучше `display: none` для вспомогательного текста?** — `display: none` скрывает и от AT, `.sr-only` — только визуально.

### Красные флаги (чего не говорить)

- «Ставлю `aria-hidden` на весь контейнер, чтобы убрать лишнее» — легко случайно скрыть важные части.
- «`opacity: 0` скрывает от скринридера» — нет, AT всё равно читает такой элемент.
- «`display: none` и `aria-hidden` — одно и то же» — разные сценарии: `aria-hidden` для визуально видимых декоративных элементов.

### Связанные темы

- `007-chto-takoe-skrinrider.md`
- `009-kak-udalit-semantiku-u-elementa.md`
- `011-dlya-chego-ispolzuetsya-atribut-aria-roledescription.md`
