# Q055. Плюсы и минусы `<canvas>` и `<svg>`?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

Canvas даёт высокую производительность при большом числе объектов и доступ к пикселям, но жертвует доступностью, масштабируемостью и требует ручного управления состоянием. SVG предлагает векторное масштабирование, нативную DOM-интерактивность и доступность из коробки, но деградирует при сотнях динамически обновляемых узлов.

---

## Развёрнутый ответ

### Суть и определение

У каждой технологии есть чёткие области применения, где преимущества перевешивают недостатки. Знание trade-offs позволяет делать осознанный архитектурный выбор.

### Как это работает

Canvas — низкоуровневый растровый буфер, управляемый через imperative API. SVG — декларативный XML, интегрированный в DOM и систему рендеринга браузера.

### Практика и применение

**Выбор в реальных проектах:**
- Игры, симуляции, particle effects → Canvas.
- Иконки, логотипы, UI-иллюстрации → SVG (inline или спрайты).
- Dashboard с живыми графиками и >500 точками → Canvas.
- Интерактивные диаграммы, карты → SVG + D3.
- Экспорт изображений на клиенте → Canvas (`toBlob`).

### Важные нюансы и краеугольные камни

**Canvas:**
- Требует HiDPI-обёртки (`devicePixelRatio`), иначе размытие на Retina.
- CORS-ограничения: cross-origin `drawImage` «тейнтит» холст.
- Не сохраняет состояние сцены — snapshot рисуется заново каждый кадр.
- Нет встроенного hit-testing: нужно вручную проверять координаты или использовать offscreen canvas с colormap.

**SVG:**
- При сотнях анимированных узлов — layout thrashing и jank.
- Inline SVG увеличивает размер HTML-документа.
- Стилизация внешнего SVG (через `<img src="file.svg">`) невозможна через CSS страницы.
- SMIL-анимации устарели (deprecated в Chromium, потом решение отложили) — лучше CSS или JS.

### Примеры

```html
<!-- Canvas: экспорт содержимого в PNG -->
<canvas id="exportCanvas" width="400" height="300"></canvas>
<button id="exportBtn">Скачать PNG</button>

<script>
  const canvas = document.getElementById('exportCanvas');
  const ctx = canvas.getContext('2d');

  // Рисуем что-нибудь
  ctx.fillStyle = '#4f46e5';
  ctx.fillRect(50, 50, 300, 200);
  ctx.fillStyle = '#fff';
  ctx.font = '24px sans-serif';
  ctx.fillText('Export me!', 120, 160);

  document.getElementById('exportBtn').addEventListener('click', () => {
    canvas.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'image.png';
      a.click();
      URL.revokeObjectURL(a.href);
    });
  });
</script>

<!-- SVG: inline-иконка, масштабируется идеально -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     width="24" height="24" aria-hidden="true" focusable="false">
  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
  <path d="M2 17l10 5 10-5" fill="none" stroke="currentColor" stroke-width="2"/>
</svg>
```

---

## Сравнение

| Критерий | `<canvas>` | `<svg>` |
|---|---|---|
| **Плюсы** | | |
| Производительность (много объектов) | ✅ Отличная при 1000+ объектах | ⚠️ Деградирует при 300+ узлах |
| Доступ к пикселям | ✅ `getImageData`, `putImageData` | ❌ Нет |
| 3D (WebGL) | ✅ Поддерживает | ❌ Только 2D |
| Один DOM-узел | ✅ Минимальный overhead | ❌ Узел на каждую фигуру |
| Экспорт bitmap | ✅ `toDataURL`, `toBlob` | ⚠️ Только через промежуточный canvas |
| **Минусы** | | |
| Масштабирование | ❌ Растровое (с потерями) | ✅ Векторное (без потерь) |
| Доступность (a11y) | ❌ Ручная реализация | ✅ `<title>`, `<desc>`, ARIA |
| CSS-стилизация | ❌ Только сам элемент | ✅ Полная (fill, stroke, filter) |
| События на объектах | ❌ Ручной hit-test | ✅ Нативные DOM events |
| Сериализация / индексация | ❌ Только bitmap | ✅ XML-текст |
| HiDPI | ❌ Требует ручной настройки | ✅ Автоматически |
| Анимация (объявительная) | ❌ Только JS | ✅ CSS + SMIL + JS |
| Стилизация из внешнего CSS | ❌ Нет | ✅ Для inline SVG |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Какой минус canvas критичен для публичных сайтов с требованиями WCAG? (нет a11y без ручной реализации)
- Как обойти CORS-ограничение canvas при `drawImage`? (CORS-заголовки на сервере + `crossOrigin="anonymous"` на img)
- Почему inline SVG предпочтительнее `<img src="file.svg">` когда нужна стилизация?
- Какой минус SVG проявляется в SPA при рендеринге сотен компонентов с иконками? (memory и layout overhead)
- Можно ли «очистить» canvas иначе, чем `clearRect`? (да: `canvas.width = canvas.width` сбрасывает буфер)

### Красные флаги (чего не говорить)

- «У canvas нет минусов если знать JS» — проблемы с a11y и масштабированием не решаются знанием JS.
- «SVG медленный по природе» — SVG медленный только при большом числе динамически обновляемых узлов.
- «Canvas поддерживает CSS-анимации на нарисованных объектах» — нет, только на самом DOM-элементе canvas.

### Связанные темы

- [053-raznica-canvas-vs-svg.md](./053-raznica-canvas-vs-svg.md) — детальное сравнение
- [054-kogda-canvas-kogda-svg.md](./054-kogda-canvas-kogda-svg.md) — когда что использовать
- [056-stilizaciya-svg.md](./056-stilizaciya-svg.md) — особенности стилизации SVG
