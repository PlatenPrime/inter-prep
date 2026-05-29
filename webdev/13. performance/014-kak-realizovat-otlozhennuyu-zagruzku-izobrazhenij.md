# Q014. Как реализовать отложенную загрузку изображений?

> **Источник:** [13. performance.md](../13.%20performance.md) · **Тема:** Performance

---

## Короткий ответ

Отложенная загрузка (lazy loading) изображений — откладывание загрузки off-screen изображений до момента, когда они приближаются к viewport. Современный способ — нативный атрибут `loading="lazy"` (поддерживается во всех актуальных браузерах). Для сложных сценариев используют **Intersection Observer API** — он наблюдает, когда элемент входит в viewport, и загружает изображение по требованию. React/Vue-компоненты обёртывают эту логику повторно используемым образом.

---

## Развёрнутый ответ

### Суть и определение

По умолчанию браузер загружает все `<img>` на странице сразу — даже те, которые находятся далеко за нижним краем экрана. Это расходует полосу пропускания и задерживает загрузку критических ресурсов. Lazy loading откладывает загрузку «невидимых» изображений, уменьшая количество сетевых запросов при первой загрузке.

### Как это работает

#### 1. Нативный `loading="lazy"` (рекомендуемый способ)

```html
<!-- Браузер сам определяет порог близости к viewport -->
<img
  src="photo.jpg"
  loading="lazy"
  width="800"
  height="600"
  alt="Photo description">

<!-- iframe тоже поддерживает -->
<iframe src="map.html" loading="lazy" width="600" height="400"></iframe>
```

**Как работает:** Браузер использует внутренний threshold (обычно 1250–1500px от viewport на медленных соединениях, 2500px на быстрых) — изображение начинает загружаться заранее, до того как пользователь доскроллит до него.

**Ограничения:**
- Не работает для CSS `background-image`.
- Нельзя использовать для LCP-изображения (задержит загрузку).
- Точный threshold зависит от браузера и скорости соединения.

#### 2. Intersection Observer API (кастомный контроль)

```javascript
class LazyImageLoader {
  #observer;
  #threshold;

  constructor(threshold = 0.1, rootMargin = '200px') {
    this.#threshold = threshold;
    this.#observer = new IntersectionObserver(
      this.#handleIntersection.bind(this),
      { threshold, rootMargin }
    );
  }

  #handleIntersection(entries) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      this.#loadImage(img);
      this.#observer.unobserve(img); // Перестаём следить после загрузки
    });
  }

  #loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (srcset) img.srcset = srcset;
    if (src) img.src = src;

    img.classList.remove('lazy');
    img.classList.add('loaded');
  }

  observe(selector = 'img[data-src]') {
    document.querySelectorAll(selector).forEach(img => {
      this.#observer.observe(img);
    });
  }

  disconnect() {
    this.#observer.disconnect();
  }
}

// Использование
const loader = new LazyImageLoader();
loader.observe();
```

```html
<!-- HTML: data-атрибуты вместо src/srcset -->
<img
  class="lazy"
  data-src="photo-800.webp"
  data-srcset="photo-480.webp 480w, photo-800.webp 800w"
  src="placeholder.svg"
  width="800"
  height="600"
  alt="Photo">
```

```css
/* Плейсхолдер до загрузки */
img.lazy {
  background: #f0f0f0;
  filter: blur(0);
  transition: filter 0.3s;
}

img.loaded {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

#### 3. LQIP — Low Quality Image Placeholder

Техника: показываем крошечное (< 1 KB) размытое изображение как плейсхолдер, пока грузится полное.

```javascript
// Генерация LQIP через Sharp (build time)
import sharp from 'sharp';

async function generateLQIP(inputPath) {
  const buffer = await sharp(inputPath)
    .resize(20) // очень маленькое — 20px ширина
    .webp({ quality: 20 })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString('base64')}`;
}
```

```html
<!-- LQIP как src, полное через data-src -->
<img
  src="data:image/webp;base64,/9j/4AAQ..."  <!-- LQIP inline -->
  data-src="photo-800.webp"
  class="lazy lqip"
  width="800"
  height="600"
  alt="Photo">
```

#### 4. React-компонент с Intersection Observer

```tsx
import { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  srcSet?: string;
  placeholder?: string;
  width: number;
  height: number;
  alt: string;
  rootMargin?: string;
}

export function LazyImage({
  src,
  srcSet,
  placeholder = 'data:image/svg+xml,...',
  width,
  height,
  alt,
  rootMargin = '200px',
}: LazyImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(img);
        }
      },
      { rootMargin }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : placeholder}
      srcSet={isVisible ? srcSet : undefined}
      width={width}
      height={height}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      style={{
        transition: 'opacity 0.3s',
        opacity: isLoaded ? 1 : 0.5,
      }}
    />
  );
}
```

#### 5. CSS background-image lazy loading

Нативный `loading="lazy"` не работает для CSS. Решение — добавлять класс при входе в viewport:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('bg-loaded');
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('.lazy-bg').forEach(el => observer.observe(el));
```

```css
.lazy-bg {
  background-color: #f0f0f0; /* плейсхолдер */
}
.lazy-bg.bg-loaded {
  background-image: url('/img/hero.webp');
}
```

### Практика и применение

**Когда использовать нативный `loading="lazy"`:**
- Простые страницы без сложных требований.
- Контент-тяжёлые страницы (блоги, галереи).
- Как fallback для любой системы.

**Когда использовать Intersection Observer:**
- Нужен точный контроль threshold.
- LQIP/blur-up эффекты.
- CSS background-image.
- Поддержка SSR (нативный `loading="lazy"` работает в гидрированном HTML).

### Важные нюансы и краеугольные камни

- **LCP + lazy = плохо**: никогда `loading="lazy"` для первого экрана; браузер откладывает загрузку → LCP ухудшается.
- **Размеры обязательны**: без `width`/`height` браузер не знает, сколько места занимает изображение; нативный lazy load работает менее эффективно (нет layout calculation).
- **SSR/SSG**: при серверном рендеринге изображения могут быть в viewport сразу — нужно учитывать это в логике Intersection Observer (IntersectionObserver не работает на сервере).
- **`rootMargin: '200px'`** — загружать изображения за 200px до появления; это убирает «белые прямоугольники» при быстром скролле.
- **Не использовать `scroll`-события** для lazy load: они вызываются сотни раз в секунду, дорогостоящие; IntersectionObserver значительно эффективнее.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему IntersectionObserver лучше scroll-события?** — IO не блокирует main thread, браузер управляет наблюдением нативно, уведомляет только при пересечении.
- **Как сделать lazy load для CSS background?** — Добавить класс при входе в viewport через IO, класс содержит background-image.
- **Как совместить LQIP с нативным lazy loading?** — LQIP через data URI в `src`, нативный `loading="lazy"` работает только с `src`, не с data URI — нужен IO.
- **Что такое `rootMargin` и зачем он нужен?** — Расширяет или сжимает viewport для наблюдения; `200px` — начинать загрузку раньше появления.
- **Как lazy load работает в SSR?** — На сервере нет viewport; Next.js `<Image>` автоматически ставит `loading="lazy"` для off-screen, `priority` prop — для LCP.

### Красные флаги (чего не говорить)

- «`loading="lazy"` на все изображения подряд» — LCP-изображение получит задержку → ухудшение метрики.
- «Использую scroll-событие для lazy load» — устаревший и дорогостоящий подход; IntersectionObserver эффективнее.
- «Lazy load не нужен, если изображения сжаты» — экономия сети; даже маленькие изображения создают лишние HTTP-запросы.
- «Data URI изображения не нужно lazy load» — base64 уже инлайнено в HTML, загрузка происходит с документом.

### Связанные темы

- `013-kak-optimizirovat-zagruzku-izobrazhenij.md`
- `010-rasskazhite-o-metrikakh-core-web-vitals.md`
- `003-pochemu-vazhno-minimizirovat-kolichestvo-reflow-i-repaint.md`
- `012-sposoby-umensheniya-vremeni-zagruzki-veb-stranicy.md`
