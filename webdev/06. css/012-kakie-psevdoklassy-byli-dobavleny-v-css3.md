# Q012. Какие псевдоклассы были добавлены в CSS3?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

CSS3 (Selectors Level 3 и 4) добавил обширный набор псевдоклассов: структурные (`:nth-child()`, `:nth-of-type()`, `:first-of-type`, `:last-of-type`, `:only-child`, `:empty`), UI-состояния (`:checked`, `:enabled`, `:disabled`, `:required`, `:optional`, `:valid`, `:invalid`, `:in-range`), и таргетинга (`:target`, `:not()`). Уровень 4 добавил `:is()`, `:where()`, `:has()`, `:focus-visible`, `:focus-within`.

---

## Развёрнутый ответ

### Суть и определение

**Selectors Level 3 (CSS3):**

| Группа | Псевдоклассы |
|--------|-------------|
| Структурные | `:root`, `:nth-child(n)`, `:nth-last-child(n)`, `:nth-of-type(n)`, `:nth-last-of-type(n)`, `:first-of-type`, `:last-of-type`, `:only-of-type`, `:only-child`, `:empty` |
| UI / Формы | `:enabled`, `:disabled`, `:checked`, `:required`, `:optional` |
| Таргетинг | `:target` |
| Отрицание | `:not(simple-selector)` |
| Языковой | `:lang()` |

**Selectors Level 4 (современный CSS):**

| Группа | Псевдоклассы |
|--------|-------------|
| Логические | `:is()`, `:where()`, `:has()` |
| Фокус | `:focus-visible`, `:focus-within` |
| Формы | `:valid`, `:invalid`, `:in-range`, `:out-of-range`, `:placeholder-shown`, `:user-valid`, `:user-invalid` |
| Расширенные | `:any-link`, `:local-link`, `:scope`, `:playing`, `:paused` |

### Как это работает

**`:nth-child(An+B)`** — выбирает каждый n-й дочерний элемент:
- `:nth-child(2n)` = чётные = `:nth-child(even)`
- `:nth-child(2n+1)` = нечётные = `:nth-child(odd)`
- `:nth-child(3n+1)` = 1, 4, 7, 10...

**`:nth-child(n of .selector)`** (Selectors 4) — позволяет фильтровать по классу:
```css
:nth-child(2 of .highlight) { ... } /* каждый 2-й среди .highlight */
```

**`:has()`** — «родительский селектор»: выбирает элемент, если внутри него есть соответствующий потомок. Это принципиальный прорыв — раньше невозможно было стилизовать родителя по потомку.

**`:focus-visible`** — показывает outline только при клавиатурной навигации, не при клике мышью.

**`:is()` / `:where()`** — forgiving selector list; `:where()` всегда имеет специфичность 0.

### Практика и применение

- `:nth-child(odd/even)` для зебра-полос таблиц без JavaScript.
- `:not(.disabled)` для стилизации активных элементов.
- `:checked` для кастомных чекбоксов и радиокнопок.
- `:valid`/`:invalid` для inline-валидации форм.
- `:focus-visible` — стандарт доступности кнопок и ссылок.
- `:has()` — адаптация layout в зависимости от наличия дочерних элементов.

### Важные нюансы и краеугольные камни

- `:nth-child()` считает **все** дочерние элементы по порядку, `:nth-of-type()` — только элементы одного тага.
- `:not()` в CSS3 принимал только простой селектор; в CSS4 — любой сложный: `:not(.a.b, #id)`.
- `:focus-visible` — поведение зависит от браузерной эвристики (клавиатура vs мышь).
- `:has()` — поддерживается с 2023 года во всех современных браузерах; в Safari был добавлен в версии 15.4.
- `:empty` совпадает с элементом, содержащим только пробелы в некоторых браузерах.

### Примеры

```css
/* Зебра-таблица */
tr:nth-child(even) {
  background-color: var(--color-row-alt);
}

/* Кастомный чекбокс */
.checkbox input:checked + .checkbox__label::before {
  background: var(--color-primary);
}

/* Inline-валидация */
.field:has(input:invalid):has(input:not(:placeholder-shown)) label {
  color: var(--color-error);
}

/* Layout с сайдбаром */
.layout:has(.sidebar) .main {
  grid-column: 2;
}

/* :focus-visible — outline только при клавиатуре */
.btn:focus { outline: none; }
.btn:focus-visible { outline: 2px solid var(--color-focus); }
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `:nth-child()` отличается от `:nth-of-type()`?** — `nth-child` считает все дочерние, `nth-of-type` — только одного типа тега.
- **Почему `:focus-visible` лучше `:focus`?** — Не мешает UX пользователям мыши, но обязателен для клавиатурных пользователей (a11y).
- **Когда `:has()` стал безопасен для production?** — С 2023 года: Chrome 105+, Safari 15.4+, Firefox 121+.
- **Что такое `:user-valid` и чем отличается от `:valid`?** — `:user-valid` срабатывает только после взаимодействия пользователя с полем; избегает красных рамок на пустых обязательных полях при загрузке.

### Красные флаги (чего не говорить)

- «`:nth-child(3)` выбирает 3-й элемент класса» — нет, 3-й дочерний элемент любого типа.
- «`:has()` нельзя использовать в production» — поддерживается во всех современных браузерах с 2023 года.
- Путать `:first-child` (первый дочерний независимо от типа) и `:first-of-type` (первый данного тега).

### Связанные темы

- `011-raznica-mezhdu-psevdoklassami-i-psevdoelementami.md`
- `013-dlya-chego-ispolzuetsya-psevdoklass-invalid.md`
- `014-rasskazhite-o-psevdoklasse-has.md`
