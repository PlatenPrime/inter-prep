# Q035. Что такое CSS container queries? Как они работают?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**CSS container queries** позволяют применять стили к элементу в зависимости от размера его **родительского контейнера**, а не viewport. Для этого родительский элемент помечается как container через `container-type`, а дочерние стили оборачиваются в `@container`. Это делает компоненты по-настоящему переиспользуемыми.

---

## Развёрнутый ответ

### Суть и определение

Container queries состоят из двух частей:

**1. Определение контейнера:**
```css
.parent {
  container-type: inline-size; /* или size */
  container-name: my-container; /* необязательно */
}
/* Шортхенд */
.parent {
  container: my-container / inline-size;
}
```

**2. Запрос к контейнеру:**
```css
@container my-container (min-width: 600px) {
  .child { /* стили при ширине контейнера ≥ 600px */ }
}

/* Без имени — ближайший container-предок */
@container (max-width: 400px) {
  .child { /* стили при ширине контейнера ≤ 400px */ }
}
```

### Как это работает

**Под капотом — CSS Containment:**
- `container-type: inline-size` неявно добавляет `contain: inline-size layout style`.
- Это создаёт **size containment** по inline-оси: размер контейнера не зависит от потомков.
- Браузер теперь может безопасно измерить контейнер и применить правило `@container`.

**Разрешение контейнера:**
- `@container` без имени → ищет ближайшего предка с `container-type`.
- `@container name (...)` → ищет ближайшего предка с `container-name: name`.

**Типы container queries:**
1. **Size queries** — `@container (min-width: ...)`, `(aspect-ratio: ...)`, `(orientation: ...)`.
2. **Style queries** — `@container style(--variant: card)` — реакция на CSS custom property контейнера.

### Практика и применение

- **Переиспользуемый компонент карточки**: один CSS без медиазапросов адаптируется к любому месту размещения.
- **Дашборды**: виджеты не знают о своём расположении, но адаптируются к колонкам.
- **Nested containers**: можно вкладывать контейнеры — `@container` найдёт ближайший.

### Важные нюансы и краеугольные камни

- `container-type: size` требует явных размеров по обеим осям (иначе 0).
- Сам контейнер не может делать запрос на свой собственный размер.
- **Container query units**: `cqw` (1% inline-width контейнера), `cqh` (1% block-height), `cqi`, `cqb`, `cqmin`, `cqmax`.
- Вложенность: `@container` находит ближайший контейнер; если нужен конкретный — именуйте.
- `@container` не может содержать `@import` или `@charset` внутри.
- Поддержка: Chrome 105+, Firefox 110+, Safari 16+ (2023).

### Примеры

```css
/* Контейнер */
.card-wrapper {
  container: card / inline-size;
}

/* Вертикальная карточка (узкий контейнер) */
.card {
  display: flex;
  flex-direction: column;
}

/* Горизонтальная карточка (широкий контейнер) */
@container card (min-width: 450px) {
  .card {
    flex-direction: row;
    align-items: center;
  }

  .card__image {
    width: 40cqi; /* 40% ширины контейнера */
    flex-shrink: 0;
  }
}

/* Компактный режим через style queries */
.widget-area {
  container-type: inline-size;
}

@container (max-width: 200px) {
  .widget__label { display: none; }
  .widget__icon  { width: 1.5rem; }
}

/* Вложенные контейнеры */
.layout {
  container: layout / inline-size;
}
.section {
  container: section / inline-size;
}

@container section (min-width: 300px) {
  /* Реагирует на .section, не на .layout */
  .card { font-size: 1rem; }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Зачем `contain: inline-size` при `container-type`?** — Без size containment размер контейнера мог бы зависеть от потомков, создавая circular dependency при вычислении container queries.
- **Что такое `cqw` и чем отличается от `vw`?** — `cqw` = 1% ширины ближайшего контейнера; `vw` = 1% viewport ширины.
- **Чем именованный контейнер удобнее?** — При вложенности можно адресовать конкретный контейнер, минуя ближайший.

### Красные флаги (чего не говорить)

- «Container queries — то же что media queries, только для блоков» — принципиально другая семантика: компонент vs устройство.
- «Container queries поддерживаются только в Chrome» — поддержка во всех современных браузерах с 2023.

### Связанные темы

- `034-container-queries-vs-media-queries.md`
- `032-chto-takoe-css-containment-svoystvo-contain.md`
- `037-adaptivnyy-dizayn-bez-media-zaprosov.md`
