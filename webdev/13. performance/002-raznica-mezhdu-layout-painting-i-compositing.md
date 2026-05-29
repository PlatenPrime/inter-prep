# Q002. Разница между layout, painting и compositing?

> **Источник:** [13. performance.md](../13.%20performance.md) · **Тема:** Performance

---

## Короткий ответ

**Layout (Reflow)** вычисляет геометрию элементов — размеры и позиции. **Paint** растеризует визуальное содержимое (цвета, текст, тени) в битмапы слоёв. **Composite** передаёт эти слои на GPU, который склеивает их в финальный кадр. Каждый следующий этап дешевле предыдущего: анимации только через `transform`/`opacity` пропускают Layout и Paint, работая исключительно на GPU.

---

## Развёрнутый ответ

### Суть и определение

Браузерный рендеринг после построения Render Tree разбит на три взаимозависимых, но принципиально разных этапа. Понимание их стоимости позволяет писать анимации и изменения стилей без просадок до 60 FPS.

### Как это работает

**Layout (Reflow)**

- Выполняется на главном потоке (main thread).
- Браузер обходит Render Tree и вычисляет box-модель каждого элемента: ширину, высоту, отступы, позиции.
- Результат — геометрическое дерево (layout tree).
- Любое свойство, меняющее размер или положение элемента, вызывает Layout: `width`, `height`, `margin`, `padding`, `font-size`, `top/left` в `position:absolute`, добавление/удаление узлов DOM.
- Layout «заразен»: изменение одного элемента может пересчитать весь поддокумент.

**Paint**

- Выполняется на главном потоке (или в отдельном Compositor Thread для выделенных слоёв).
- Браузер обходит layout tree и записывает команды рисования: прямоугольники, градиенты, текст, тени, border-radius.
- Команды выполняются растеризатором (Skia/RasterWorkerPool), результат — битмапы в памяти (слои).
- Свойства, вызывающие только Paint (без Layout): `color`, `background-color`, `box-shadow`, `border-color`, `outline`.

**Composite**

- Выполняется в отдельном Compositor Thread, параллельно main thread.
- GPU получает готовые текстуры слоёв и склеивает их с учётом `z-index`, `opacity`, `transform`.
- Только два CSS-свойства работают **исключительно** на этапе Composite, не затрагивая Layout и Paint:
  - `transform` (translate, scale, rotate)
  - `opacity`
- Дополнительные слои создаются через: `will-change: transform`, `position: fixed`, `video`/`canvas`, `filter`.

### Практика и применение

- **Анимации движения/масштаба** — использовать `transform`, а не `top`/`left`/`width`, чтобы оставаться в Composite и не дёргать main thread.
- **Fade-эффекты** — `opacity` вместо `visibility`/`display` для плавных переходов без Layout.
- **`will-change: transform`** — подсказка браузеру заранее создать слой для элемента перед анимацией; убирать после завершения анимации.
- **Chrome DevTools → Rendering → Paint flashing** — визуализирует области перерисовки в реальном времени.

```
Изменение свойства → Какие этапы задействованы
width/height/margin   Layout → Paint → Composite   (дорого)
color/background      Paint → Composite             (средне)
transform/opacity     Composite only                (дёшево)
```

### Важные нюансы и краеугольные камни

- **Слои не бесплатны**: каждый новый слой занимает память GPU. Злоупотребление `will-change` на сотнях элементов вызывает out-of-memory на мобильных устройствах.
- **`transform: translateZ(0)` как хак** — форсирует создание слоя, но это недокументированное поведение; лучше использовать `will-change: transform`.
- **Paint — не всегда main thread**: современные браузеры (Blink) используют рабочие потоки (RasterWorkerPool) для растеризации, но это не избавляет от overhead.
- **Composite не равно "мгновенно"**: при большом количестве слоёв или высоком разрешении экрана (Retina) склейка тоже занимает время.
- **`filter: blur()` и `backdrop-filter`** — Paint + Composite (дорогие операции, особенно на мобильных).

### Примеры

```css
/* Плохо: вызывает Layout → Paint → Composite каждый кадр */
.box-bad {
  animation: move-bad 1s infinite;
}
@keyframes move-bad {
  from { left: 0; }
  to   { left: 200px; }
}

/* Хорошо: только Composite */
.box-good {
  animation: move-good 1s infinite;
}
@keyframes move-good {
  from { transform: translateX(0); }
  to   { transform: translateX(200px); }
}
```

```javascript
// Принудительный Layout (Layout Thrashing — читаем размер после изменения стиля)
element.style.width = '200px';
const h = element.offsetHeight; // браузер вынужден выполнить Layout немедленно

// Правильно: сначала читаем, потом пишем
const h = element.offsetHeight; // читаем — Layout не форсируется
element.style.width = '200px';  // пишем — Layout будет отложен до следующего кадра
```

---

## Сравнение

| Критерий | Layout | Paint | Composite |
|----------|--------|-------|-----------|
| Поток | Main thread | Main thread / Raster workers | Compositor thread (GPU) |
| Стоимость | Высокая | Средняя | Низкая |
| Что триггерит | Геометрические свойства | Визуальные свойства | transform, opacity |
| «Заразность» | Высокая (каскадный пересчёт) | Изолированная | Изолированная |
| Блокирует UI | Да | Да | Нет |
| Примеры свойств | width, margin, font-size | color, background, shadow | transform, opacity |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `transform` быстрее `left`?** — `left` вызывает Layout; `transform` обрабатывается GPU без участия main thread.
- **Когда `will-change` вредит?** — При злоупотреблении: сотни слоёв → переполнение памяти GPU, лаги на мобильных.
- **Как DevTools показывает этапы рендеринга?** — Вкладка Performance: события Layout, Paint, Composite Layers на дорожке Main и GPU.
- **Что такое "paint storm"?** — Ситуация, когда каждый кадр перерисовывается большая область; видно через Paint Flashing в Rendering панели.
- **Влияет ли `display:none` на Layout?** — Да: элемент удаляется из layout tree, вызывая пересчёт.

### Красные флаги (чего не говорить)

- «Paint и Composite — это одно и то же» — принципиально разные шаги с разными потоками и стоимостью.
- «`opacity: 0` и `display: none` работают одинаково» — `opacity` остаётся в Render Tree (занимает место), `display:none` — нет; `opacity` не вызывает Layout.
- «`will-change` всегда ускоряет» — создаёт слой заранее, что потребляет память; на слабых устройствах может замедлить.
- «Composite — это работа CPU» — Composite выполняется GPU в отдельном потоке, именно поэтому он не блокирует main thread.

### Связанные темы

- `001-nazvajte-kriticheskie-etapy-renderinga-critical-rendering-path.md`
- `003-pochemu-vazhno-minimizirovat-kolichestvo-reflow-i-repaint.md`
- `004-raznica-mezhdu-render-blocking-i-layout-thrashing.md`
