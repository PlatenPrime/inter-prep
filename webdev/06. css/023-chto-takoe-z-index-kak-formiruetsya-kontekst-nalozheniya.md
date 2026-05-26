# Q023. Что такое `z-index`? Как формируется контекст наложения?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**`z-index`** управляет порядком наложения элементов по оси Z (ближе/дальше от зрителя) внутри одного **контекста наложения (stacking context)**. **Stacking context** — изолированная «плоскость» рендеринга, внутри которой z-index дочерних элементов сравнивается только между собой, а не с элементами других контекстов.

---

## Развёрнутый ответ

### Суть и определение

`z-index` принимает:
- `auto` (дефолт) — не создаёт новый stacking context; порядок определяется алгоритмом stacking order.
- `<integer>` (положительный, нулевой, отрицательный) — числовое значение.

**Работает только на:**
- `position: relative / absolute / fixed / sticky`
- Flex-items и Grid-items
- Элементах с `opacity < 1`, `transform`, `filter`, `isolation: isolate` и т.д.

### Что создаёт stacking context

| Свойство | Значение |
|---------|---------|
| `position: fixed / sticky` | Любое |
| `position: relative / absolute` | + `z-index` ≠ `auto` |
| `opacity` | `< 1` |
| `transform` | ≠ `none` |
| `filter` | ≠ `none` |
| `isolation` | `isolate` |
| `will-change` | С GPU-свойствами |
| `mix-blend-mode` | ≠ `normal` |
| `clip-path` | ≠ `none` |
| `mask` | ≠ `none` |
| Flex/Grid-items | + `z-index` ≠ `auto` |
| `contain: layout / paint / strict / content` | |
| `perspective` / `transform-style: preserve-3d` | |

### Как это работает

Каждый stacking context — независимый слой. Z-index внутри него сравнивается только с другими элементами **того же** контекста.

```
Родитель A (z-index: 1) — stacking context
  └─ Дочерний A1 (z-index: 9999)

Родитель B (z-index: 2) — stacking context
  └─ Дочерний B1 (z-index: 1)
```

Несмотря на то, что A1 имеет `z-index: 9999`, он **ниже** B1, потому что его родитель (A, z-index:1) ниже B (z-index:2). Z-index 9999 сравнивается только внутри контекста A.

### Практика и применение

- Модальные окна, тосты, тултипы — используют высокий `z-index` на уровне `<body>` (вне вложенных stacking context).
- `isolation: isolate` — явно создаёт stacking context без изменения z-index или opacity; используется для CSS-эффектов blend mode.
- В React/Vue порталы (`ReactDOM.createPortal`) рендерят модалки в `<body>` именно чтобы избежать проблем с вложенными stacking contexts.

### Важные нюансы и краеугольные камни

- Самая частая ошибка: `z-index: 9999` не работает, потому что элемент находится внутри stacking context с малым z-index.
- `transform: translateZ(0)` создаёт stacking context — побочный эффект GPU-оптимизации, который ломает z-index соседних элементов.
- `position: static` не создаёт stacking context и не реагирует на `z-index`.
- Отрицательный `z-index` помещает элемент **под** его stacking context (за фоном родителя).

### Примеры

```css
/* Корректная иерархия z-index */
:root {
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-toast: 500;
}

/* Проблема: transform ломает z-index */
.animated-card {
  transform: translateY(0); /* создаёт stacking context! */
}
.animated-card .tooltip {
  z-index: 9999; /* сравнивается ТОЛЬКО внутри .animated-card */
}

/* Решение 1: вынести tooltip из stacking context */
/* Решение 2: isolation: isolate на контейнере */

/* isolation: isolate — явный stacking context */
.blended-section {
  isolation: isolate; /* blend-mode не утечёт наружу */
}
.blended-section .overlay {
  mix-blend-mode: multiply;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `z-index: 9999` не работает?** — Элемент внутри stacking context с малым z-index; z-index не «пробивает» контекст.
- **Что создаёт stacking context помимо `z-index`?** — `opacity < 1`, `transform`, `filter`, `isolation: isolate`, `will-change` и другие.
- **Как `isolation: isolate` помогает?** — Явно создаёт stacking context для группировки blend-mode эффектов без изменения z-index.
- **Как решить проблему z-index в компоненте с `transform`?** — Вынести перекрывающий элемент выше в DOM (через portal), или использовать `isolation: isolate` на нужном уровне.

### Красные флаги (чего не говорить)

- «Чем больше z-index, тем выше элемент» — только внутри одного stacking context.
- «`z-index` работает на любом элементе» — только на positioned, flex/grid items.
- «`transform: translateZ(0)` безвреден» — создаёт stacking context, что может сломать z-index.

### Связанные темы

- `022-tipy-pozitsionirovaniya-v-css.md`
- `024-poryadok-nalozheniya-elementov-stacking-order.md`
