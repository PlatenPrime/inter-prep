# Q057. Что такое BEM и как это помогает в CSS?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**BEM (Block Element Modifier)** — методология именования CSS-классов, структурирующая стили через три концепции: **блок** (независимый компонент), **элемент** (часть блока) и **модификатор** (вариант блока/элемента). BEM предотвращает коллизии классов, устраняет необходимость в глубокой вложенности селекторов и делает CSS предсказуемым и поддерживаемым.

---

## Развёрнутый ответ

### Суть и определение

**Синтаксис:**
```
block__element--modifier
```

- **Block** — независимый UI-компонент: `card`, `button`, `nav`.
- **Element** — дочерняя часть блока, не существует без него: `card__title`, `card__image`.
- **Modifier** — вариант блока или элемента: `card--featured`, `button--primary`, `button__icon--large`.

```html
<div class="card card--featured">
  <img class="card__image" src="..." alt="...">
  <div class="card__body">
    <h2 class="card__title">Заголовок</h2>
    <button class="button button--primary">
      <span class="button__icon button__icon--left">→</span>
      Читать далее
    </button>
  </div>
</div>
```

### Как это работает

**Правила BEM:**
1. Блок именуется существительным: `form`, `header`, `menu`.
2. Элемент — через `__`: `form__input`, `menu__item`.
3. Модификатор — через `--`: `form--compact`, `menu__item--active`.
4. Никакой вложенности в CSS: `.card__title { }`, не `.card .title { }`.
5. Элемент принадлежит блоку, не другому элементу: `card__body__title` — неправильно; `card__title` — правильно.

**Специфичность:**
Каждый класс BEM имеет специфичность (0,1,0) — один класс. Это делает переопределение предсказуемым.

### Практика и применение

```css
/* BEM CSS */
.card { /* блок */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
}

.card--featured { /* модификатор блока */
  border: 2px solid var(--color-primary);
}

.card__image { /* элемент */
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.card__title { /* элемент */
  font-size: 1.25rem;
  font-weight: 700;
}

.card__title--small { /* модификатор элемента */
  font-size: 1rem;
}
```

### Важные нюансы и краеугольные камни

- Элемент не может принадлежать другому элементу: `block__elem1__elem2` — неправильно. Всегда `block__elem2`.
- BEM — методология, а не инструмент; нет компилятора, только соглашения.
- **CSS Modules** — решают ту же проблему коллизий технически (уникальные хеши), но без строгой методологии.
- В Sass BEM удобно с `&__` / `&--`:
  ```scss
  .card {
    &__title { ... }
    &--featured { ... }
  }
  ```
- Длинные имена — недостаток BEM: `navigation__list-item--active` может быть длинным.
- Существуют варианты: ABEM, SMACSS, OOCSS — альтернативные методологии.

### Примеры

```html
<!-- Правильный BEM -->
<nav class="nav">
  <ul class="nav__list">
    <li class="nav__item nav__item--active">
      <a class="nav__link" href="/">Главная</a>
    </li>
    <li class="nav__item">
      <a class="nav__link" href="/about">О нас</a>
    </li>
  </ul>
</nav>

<!-- Форма с модификаторами -->
<form class="form form--login">
  <div class="form__field form__field--required">
    <label class="form__label">Email</label>
    <input class="form__input form__input--error" type="email">
    <span class="form__message form__message--error">Неверный формат</span>
  </div>
  <button class="button button--primary button--full-width">Войти</button>
</form>
```

```scss
// Sass + BEM
.button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;

  &--primary {
    background: var(--color-primary);
    color: white;
  }

  &--outline {
    background: transparent;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
  }

  &__icon {
    width: 1em;
    height: 1em;
    flex-shrink: 0;
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как BEM решает проблему глобального CSS?** — Уникальные, описательные имена классов исключают коллизии без технических хаков.
- **Когда не стоит использовать BEM?** — В проектах с CSS Modules или CSS-in-JS — они решают ту же проблему технически.
- **Как правильно именовать элемент внутри элемента?** — Всегда `block__element`, никогда `block__elem1__elem2`.
- **Какая специфичность у BEM-класса?** — (0,1,0) — один класс; предсказуемо переопределяется.

### Красные флаги (чего не говорить)

- «BEM — это то же самое, что CSS Modules» — BEM — соглашение по именованию; CSS Modules — технический инструмент.
- «`block__elem1__elem2` — правильный BEM» — нет, элементы не вкладываются.

### Связанные темы

- `058-plyusy-i-minusy-metodologii-bem.md`
- `007-chto-takoe-specifichnost-selektora-kak-schitat-ves-selektora.md`
- `059-principy-masshtabiruemosti-i-podderzhivaemosti-css.md`
