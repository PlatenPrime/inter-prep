# Q024. Порядок наложения элементов в CSS (Stacking Order)?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**Stacking Order** — фиксированный алгоритм CSS, определяющий порядок отрисовки элементов по оси Z внутри stacking context. Порядок от нижнего к верхнему: фон и border контекста → потомки с отрицательным z-index → блочные потомки → float-элементы → inline-потомки → positioned с `z-index: auto` → positioned с положительным z-index.

---

## Развёрнутый ответ

### Суть и определение

Порядок наложения внутри stacking context (от дальнего к ближнему):

```
1. Background + border stacking context
2. Потомки с z-index < 0 (positioned)
3. Block-level потомки в нормальном потоке
4. Float-элементы
5. Inline/inline-block потомки в нормальном потоке
6. Positioned потомки с z-index: auto или z-index: 0
7. Positioned потомки с z-index > 0
```

Каждый уровень содержит элементы в **порядке DOM** (позднее = сверху).

### Как это работает

Браузер обходит DOM для построения списка «paint items» с учётом stacking contexts. Каждый stacking context отрисовывается как единый блок относительно родительского контекста.

**Пример анализа:**

```html
<div class="A">           <!-- z-index: auto, position: relative -->
  <div class="A1"></div>  <!-- z-index: -1 → под .A -->
  <div class="A2"></div>  <!-- float: left → над блочными -->
  <div class="A3"></div>  <!-- z-index: 1 → выше всех в контексте A -->
</div>
```

Порядок отрисовки: фон A → A1 → фон A2 → фон A (block) → A2 (float) → A3.

### Практика и применение

- `z-index: -1` на псевдоэлементе `::before` позволяет разместить фоновый слой **под** содержимым элемента.
- Float-элементы (слой 4) отрисовываются над блочными потомками (слой 3) — текст обтекает float именно потому, что находится на уровне inline (слой 5).
- Positioned-элементы с `z-index: 0` могут накрывать inline-содержимое (слой 6 > слой 5).

### Важные нюансы и краеугольные камни

- `z-index: auto` не создаёт stacking context и участвует в stacking order родительского контекста на уровне 6.
- `z-index: 0` тоже участвует на уровне 6, но **создаёт** stacking context (в отличие от `auto`).
- Элементы одного уровня (например, два positioned с `z-index: 1`) сортируются по DOM-порядку: последний в DOM — выше.
- `isolation: isolate` создаёт stacking context без изменения z-index — полезно для предотвращения «утечки» наложений.

### Примеры

```css
/* z-index: -1 под содержимым (декоративный фон через ::before) */
.hero {
  position: relative;
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;                       /* под содержимым .hero */
  background: linear-gradient(...);
}

/* Positioned z-index: 0 vs z-index: auto */
.box-a {
  position: relative;
  z-index: auto; /* не создаёт stacking context */
}
.box-b {
  position: relative;
  z-index: 0;    /* создаёт stacking context! */
}
```

```html
<!-- DOM-порядок внутри одного уровня -->
<div style="position:relative; z-index:1;">Первый</div>
<div style="position:relative; z-index:1;">Второй</div>
<!-- «Второй» выше «Первого», потому что позже в DOM -->
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `z-index: 0` отличается от `z-index: auto`?** — `auto` не создаёт stacking context; `0` создаёт.
- **Почему отрицательный `z-index` не всегда «уходит за страницу»?** — Уходит за фон ближайшего stacking context, а не за `<body>`.
- **Как positioned-элемент оказывается под float?** — Только если у него отрицательный z-index (уровень 2), float на уровне 4.
- **Почему текст всегда виден поверх float?** — Inline-контент (уровень 5) выше float-элементов (уровень 4).

### Красные флаги (чего не говорить)

- «Все positioned-элементы выше float» — только те, что выше уровня 4 в stacking order (уровни 6, 7).
- «Stacking order = z-index» — z-index лишь часть алгоритма; тип отображения и поток тоже влияют.

### Связанные темы

- `023-chto-takoe-z-index-kak-formiruetsya-kontekst-nalozheniya.md`
- `022-tipy-pozitsionirovaniya-v-css.md`
