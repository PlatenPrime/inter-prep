# Q034. Что такое контейнерные запросы (container queries)? Как они отличаются от медиа запросов (media queries)?

> **Источник:** [06. css.md](../06.%20css.md) · **Тема:** CSS

---

## Короткий ответ

**Media queries** реагируют на параметры **viewport** (ширина экрана, orientation, DPR). **Container queries** реагируют на размер **родительского контейнера** конкретного компонента. Container queries позволяют создавать истинно переиспользуемые компоненты, которые адаптируются к своему контексту независимо от размера окна браузера.

---

## Развёрнутый ответ

### Суть и определение

**Media query:**
```css
@media (min-width: 768px) { ... }
/* Реагирует на: viewport width, height, orientation, prefers-color-scheme, etc. */
```

**Container query:**
```css
.wrapper { container-type: inline-size; }

@container (min-width: 400px) { ... }
/* Реагирует на: размер ближайшего container-контейнера */
```

**Установка контейнера:**

| Свойство | Значение | Описание |
|---------|---------|---------|
| `container-type` | `inline-size` | Запросы по inline-ширине |
| `container-type` | `size` | Запросы по ширине и высоте |
| `container-type` | `normal` | Только style queries |
| `container-name` | `card-container` | Именованный контейнер |

### Как это работает

```css
.card-wrapper {
  container-type: inline-size;
  container-name: card;  /* или шортхенд: container: card / inline-size */
}

/* Применяется к потомкам .card-wrapper при ширине ≥ 400px */
@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
```

Container queries используют **CSS Containment** под капотом: `container-type: inline-size` неявно применяет `contain: inline-size layout style`, чтобы размер контейнера не зависел от своих потомков (иначе — circular dependency).

**Container query units** (CQU):
- `cqw`, `cqh` — % от ширины/высоты контейнера.
- `cqi`, `cqb` — inline/block dimension.
- `cqmin`, `cqmax` — min/max из cqi и cqb.

### Практика и применение

- **Карточки в разных контекстах**: одна карточка — в боковой панели (узко) и в основном контенте (широко) — адаптируется по контейнеру, а не по viewport.
- **Виджеты дашборда**: компоненты не знают, куда будут помещены.
- **Design System компоненты**: card, hero, testimonial — адаптивны без знания внешнего layout.
- `@container style(--variant: compact)` — **style queries** реагируют на значение CSS custom property контейнера.

### Важные нюансы и краеугольные камни

- Элемент не может делать container query на **себя самого** — только на потомков; это исключает circular dependency.
- `container-type: size` требует, чтобы высота контейнера была явной — иначе 0.
- **Style queries** (`@container style(--foo: bar)`) — экспериментально, но поддерживается Chrome 111+.
- Поддержка: Chrome 105+, Firefox 110+, Safari 16+. Хороший уровень поддержки с 2023 года.
- Container query units (`cqw`) не работают вне container context.

### Примеры

```css
/* Настройка контейнера */
.sidebar, .main-content {
  container-type: inline-size;
}

/* Адаптивная карточка */
@container (max-width: 400px) {
  .card {
    flex-direction: column;
  }
  .card__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
}

@container (min-width: 401px) {
  .card {
    flex-direction: row;
    gap: 16px;
  }
  .card__image {
    width: 120px;
    flex-shrink: 0;
  }
}

/* Container query units */
.card__title {
  font-size: clamp(1rem, 5cqi, 2rem); /* 5% от ширины контейнера */
}

/* Style queries — компонент в "compact" режиме */
.widget-wrapper {
  container-type: inline-size;
}
.widget-wrapper.compact {
  --density: compact;
}

@container style(--density: compact) {
  .widget { padding: 8px; font-size: 0.875rem; }
}
```

---

## Сравнение

| Критерий | Media Query | Container Query |
|----------|------------|----------------|
| Что отслеживает | Viewport / устройство | Родительский контейнер |
| Переиспользуемость | Зависит от viewport | Истинная переиспользуемость |
| Применение | Глобальный layout | Компонентный layout |
| Поддержка | Все браузеры | Chrome 105+, Firefox 110+, Safari 16+ |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему нельзя делать container query на себя?** — Circular dependency: размер элемента влиял бы на свой же стиль, который влияет на размер.
- **Что такое container query units?** — `cqw`/`cqh` — % от размеров контейнера; аналог `vw`/`vh` для контейнера.
- **Что такое style queries?** — Container queries, реагирующие на значение CSS custom property контейнера.

### Красные флаги (чего не говорить)

- «Container queries заменяют media queries» — дополняют; media queries нужны для global layout и устройств.
- «Container queries работают на самом контейнере» — нет, только на его потомках.

### Связанные темы

- `035-chto-takoe-css-container-queries-kak-oni-rabotayut.md`
- `032-chto-takoe-css-containment-svoystvo-contain.md`
- `036-raznica-mobile-first-i-desktop-first.md`
