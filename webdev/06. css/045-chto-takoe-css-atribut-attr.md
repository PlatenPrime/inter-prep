# Q045. Что такое CSS-атрибут (`attr`)?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**`attr()`** — CSS-функция, позволяющая читать значение HTML-атрибута элемента и использовать его в CSS. В CSS2/3 работает только в свойстве `content` псевдоэлементов. В спецификации CSS Values Level 5 (`attr()` Level 4) расширяется до использования в любом свойстве с типизацией, но полная поддержка пока ограничена.

---

## Развёрнутый ответ

### Суть и определение

**Текущая (полная поддержка):**
```css
attr(<attribute-name>)
/* Только в свойстве content */

[data-label]::before {
  content: attr(data-label);
}
```

**Расширенный синтаксис (CSS Values 5, частичная поддержка):**
```css
attr(<attribute-name> <type>?, <fallback>)
/* тип: string | color | url | integer | number | length | ... */

.box {
  width: attr(data-width px, 100px); /* <теоретически> */
}
```

### Как это работает

Функция `attr()` обращается к HTML-атрибуту того элемента, к которому применяется CSS-правило. Значение атрибута интерпретируется как строка (в текущей реализации) и подставляется в `content`.

**Примеры использования в `content`:**

```html
<button data-tooltip="Сохранить файл">💾</button>
```
```css
[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  /* отображает: Сохранить файл */
}
```

**`data-*` атрибуты:**
Наиболее часто `attr()` используется с `data-*` атрибутами для передачи значений из HTML в CSS без JavaScript.

### Практика и применение

- **Тултипы без JavaScript**: `[data-tooltip]::before { content: attr(data-tooltip) }`.
- **Прогресс-бары**: `[data-progress]::after { content: attr(data-progress) '%' }`.
- **Accessibility-текст**: отображение текстовых подписей через data-атрибуты.
- **Таблицы с responsive подписями**: `td::before { content: attr(data-label) }` для мобильного layout.

### Важные нюансы и краеугольные камни

- `attr()` в `content` — широко поддерживается (CSS2).
- `attr()` в других свойствах (например, `width: attr(data-width px)`) — **не поддерживается** в большинстве браузеров на текущий момент.
- Значение атрибута — **строка**, не типизированное значение; для числовых операций нужны CSS Custom Properties или JS.
- Изменение атрибута в JS (`el.setAttribute('data-tooltip', '...')`) немедленно отражается в `content`.
- Пустой атрибут (`data-tooltip=""`) → пустой `content` → псевдоэлемент есть, но пустой.

### Примеры

```css
/* Тултип через data-атрибут */
[data-tooltip] {
  position: relative;
}
[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
}

/* Responsive таблица: подписи из data-атрибутов */
@media (max-width: 600px) {
  td::before {
    content: attr(data-label) ': ';
    font-weight: bold;
  }
}
```

```html
<table>
  <tr>
    <td data-label="Имя">Иван</td>
    <td data-label="Возраст">25</td>
  </tr>
</table>

<span data-tooltip="Нажмите для подтверждения">
  Подтвердить
</span>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Можно ли использовать `attr()` в `width: attr(data-w px)`?** — Теоретически да по спецификации CSS Values 5, но браузеры ещё не реализовали полностью.
- **Как передать числовое значение из HTML в CSS без JS?** — CSS Custom Properties через `style="--value: 75"` + `attr()` в `content`, или JS `setProperty`.
- **Реагирует ли CSS на изменение атрибута?** — Да: браузер отслеживает атрибуты для CSS-матчинга; изменение через JS → немедленный пересчёт стилей.

### Красные флаги (чего не говорить)

- «`attr()` работает в любом CSS-свойстве» — пока только в `content` с широкой поддержкой.
- «`attr()` читает CSS Custom Properties» — нет, только HTML-атрибуты.

### Связанные темы

- `010-chto-takoe-psevdoelementy-i-dlya-chego-oni-ispolzuyutsya.md`
- `046-svoystvo-text-rendering.md`
