# Q014. Какие HTML атрибуты можно использовать для улучшения доступности?

> **Источник:** [12. accessibility.md](../12.%20accessibility.md) · **Тема:** Accessibility

---

## Короткий ответ

Для улучшения доступности используют: `alt` для изображений, `lang` на `<html>`, `for`/`id` для связки `<label>` с полями, `tabindex` для управления фокусом, `aria-label` / `aria-labelledby` / `aria-describedby` для имён и описаний, `aria-*` для состояний (checked, expanded, disabled), `autocomplete` для форм, `role` для семантики, `hidden` для скрытия. Нативные HTML-атрибуты предпочтительнее ARIA-дублирования.

---

## Развёрнутый ответ

### Суть и определение

HTML-атрибуты доступности делятся на три группы:
1. **Нативные атрибуты HTML** — встроены в спецификацию, работают без JS
2. **ARIA-атрибуты** — расширяют семантику для AT
3. **Атрибуты управления поведением** — `tabindex`, `autocomplete`, `lang`

### Как это работает

#### Нативные атрибуты HTML

```html
<!-- alt: текстовая альтернатива изображению (WCAG 1.1.1) -->
<img src="chart.png" alt="Рост продаж на 23% в Q1 2024" />
<img src="decoration.png" alt="" /> <!-- декоративное -->

<!-- lang: язык страницы и отдельных фрагментов (WCAG 3.1.1) -->
<html lang="ru">
<p lang="en">This is English text</p>

<!-- for + id: связь label с полем (WCAG 1.3.1) -->
<label for="email">Email</label>
<input type="email" id="email" name="email" />

<!-- title: подсказка, но не замена alt или label -->
<abbr title="Cascading Style Sheets">CSS</abbr>

<!-- hidden: скрывает от AT и визуально (HTML5) -->
<div hidden>Скрыто</div>

<!-- required: нативная валидация + семантика -->
<input type="text" id="name" required />

<!-- autocomplete: помогает пользователям с когнитивными нарушениями -->
<input type="email" autocomplete="email" />
<input type="tel" autocomplete="tel" />
<input type="text" autocomplete="given-name" />

<!-- disabled: поле недоступно для взаимодействия -->
<button disabled>Недоступно</button>
```

#### ARIA-атрибуты для имён и описаний

```html
<!-- aria-label: явное имя элемента (приоритет над текстом) -->
<button aria-label="Закрыть диалог">✕</button>

<!-- aria-labelledby: имя из другого элемента -->
<h2 id="dialog-title">Подтверждение удаления</h2>
<div role="dialog" aria-labelledby="dialog-title" aria-modal="true">
  ...
</div>

<!-- aria-describedby: дополнительное описание (следует за именем) -->
<input
  type="password"
  id="pwd"
  aria-describedby="pwd-hint"
/>
<p id="pwd-hint">Минимум 8 символов, одна цифра и одна заглавная буква</p>

<!-- aria-description (ARIA 1.3): строковое описание без id -->
<button aria-description="Откроет новую вкладку">Открыть</button>
```

#### ARIA-атрибуты для состояний

```html
<!-- aria-expanded: раскрыт ли аккордеон/меню -->
<button aria-expanded="false" aria-controls="menu">Меню</button>

<!-- aria-checked: состояние чекбокса/переключателя -->
<div role="checkbox" aria-checked="true" tabindex="0">Согласен</div>

<!-- aria-pressed: кнопка-переключатель -->
<button aria-pressed="false">Тёмная тема</button>

<!-- aria-selected: выбранный элемент в tablist/listbox -->
<button role="tab" aria-selected="true" aria-controls="panel-1">Вкладка 1</button>

<!-- aria-disabled: программно недоступен (остаётся в Tab, в отличие от disabled) -->
<button aria-disabled="true">Сохранить</button>

<!-- aria-invalid + aria-errormessage: ошибка валидации -->
<input
  type="email"
  aria-invalid="true"
  aria-errormessage="email-error"
/>
<p id="email-error" role="alert">Введите корректный email</p>

<!-- aria-hidden: скрыть от AT, оставить визуально -->
<span aria-hidden="true">★★★★☆</span>
<span class="sr-only">Рейтинг: 4 из 5</span>
```

#### Атрибуты управления фокусом

```html
<!-- tabindex="0": добавить в Tab-порядок (кастомный виджет) -->
<div role="button" tabindex="0">Кастомная кнопка</div>

<!-- tabindex="-1": убрать из Tab-порядка, но фокус через JS -->
<div id="modal-content" tabindex="-1">...</div>
<!-- JS: document.getElementById('modal-content').focus() -->
```

#### ARIA live regions

```html
<!-- aria-live="polite": уведомление после окончания речи AT -->
<div role="status" aria-live="polite" aria-atomic="true">
  Файл загружен
</div>

<!-- aria-live="assertive": срочное прерывание -->
<div role="alert" aria-live="assertive">
  Сессия истекает через 2 минуты
</div>
```

### Практика и применение

Чеклист для форм:

```html
<form>
  <!-- 1. Каждое поле — связанный label -->
  <label for="first-name">Имя</label>
  <input
    type="text"
    id="first-name"
    name="first-name"
    autocomplete="given-name"
    aria-required="true"
    aria-describedby="first-name-hint"
  />
  <p id="first-name-hint">Только латинские буквы</p>

  <!-- 2. Ошибка — текстом с aria-invalid -->
  <span
    id="first-name-error"
    role="alert"
    hidden
  >
    Поле обязательно для заполнения
  </span>
</form>
```

### Важные нюансы и краеугольные камни

- `title` не замена `alt` — AT объявляют `title` непоследовательно; некоторые игнорируют.
- `aria-required` и `required` не идентичны: `required` запускает браузерную валидацию, `aria-required` — только семантика.
- `tabindex > 0` (например, `tabindex="5"`) — антипаттерн: ломает естественный Tab-порядок.
- `aria-live="assertive"` прерывает текущее объявление AT — использовать только для критических сообщений.
- `autocomplete` значительно помогает пользователям с когнитивными нарушениями и моторными ограничениями (WCAG 1.3.5).

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница `aria-describedby` и `aria-labelledby`?** — `labelledby` — имя элемента (объявляется первым), `describedby` — дополнительное описание (объявляется после имени и роли).
- **Когда использовать `aria-required` вместо `required`?** — `aria-required` не запускает браузерную валидацию; используется, когда валидация кастомная или нужна семантика без нативного поведения.
- **Что делает `aria-atomic`?** — при `aria-atomic="true"` AT зачитывает всё содержимое live region целиком при любом изменении, а не только изменённую часть.

### Красные флаги (чего не говорить)

- «`tabindex="1"` помогает расставить приоритет фокуса» — ломает естественный порядок; использовать только `0` и `-1`.
- «`title` — это то же самое, что `alt`» — `title` показывается при hover, `alt` — текстовая альтернатива; AT обрабатывают их по-разному.
- «Нужно добавить все ARIA-атрибуты для надёжности» — избыточный ARIA перегружает AT шумом.

### Связанные темы

- `010-chto-takoe-aria-roli-v-veb-prilozhenii.md`
- `012-raznica-mezhdu-role-i-aria-label.md`
- `015-kak-struktura-zagolovkov-vliyaet-na-dostupnost.md`
- `006-chto-nuzhno-uchityvat-pri-razrabotke-dostupnogo-sayta.md`
