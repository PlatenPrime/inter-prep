# Q013. Как оптимизировать загрузку изображений для улучшения производительности?

> **Источник:** [13. performance.md](../13.%20performance.md) · **Тема:** Performance

---

## Короткий ответ

Оптимизация изображений включает: выбор правильного формата (WebP/AVIF), сжатие без потери качества, responsive images (srcset/sizes), lazy loading для off-screen, preload для LCP-изображения, правильные размеры (width/height для предотвращения CLS) и CDN с автоматической конвертацией. Изображения — типично самые тяжёлые ресурсы на странице (60–80% байт), поэтому их оптимизация даёт наибольший эффект на LCP.

---

## Развёрнутый ответ

### Суть и определение

Изображения влияют сразу на несколько метрик: LCP (если они крупнее всего на экране), CLS (если без размеров — сдвигают контент при загрузке), TTI (если блокируют ресурсы), время загрузки (байты по сети). Комплексный подход охватывает формат, размер, доставку и приоритизацию.

### Как это работает

#### Форматы изображений

| Формат | Сжатие | Поддержка | Применение |
|--------|--------|-----------|------------|
| JPEG | Lossy | Все | Фото, сложные изображения |
| PNG | Lossless | Все | Иконки с прозрачностью, скриншоты |
| WebP | Lossy + Lossless | 95%+ браузеров | Замена JPEG/PNG (на 25–35% меньше) |
| AVIF | Lossy + Lossless | ~90% браузеров | Лучшее сжатие (на 50% < JPEG), медленнее кодирует |
| SVG | Vector | Все | Иконки, логотипы, иллюстрации |
| GIF → MP4/WebM | — | — | Анимации: видео в 10–50× меньше GIF |

#### Адаптивные изображения (responsive images)

Браузер выбирает лучший источник, исходя из размера viewport и DPR (device pixel ratio).

```html
<!-- srcset с дескриптором ширины (w) -->
<img
  srcset="
    /img/photo-480.webp  480w,
    /img/photo-800.webp  800w,
    /img/photo-1200.webp 1200w,
    /img/photo-2400.webp 2400w
  "
  sizes="
    (max-width: 480px) 100vw,
    (max-width: 1024px) 50vw,
    800px
  "
  src="/img/photo-800.webp"
  width="800"
  height="533"
  alt="Photo description"
  loading="lazy">
```

#### `<picture>` с форматными fallback

```html
<picture>
  <!-- AVIF — лучшее сжатие, но не везде поддерживается -->
  <source
    srcset="/img/hero-480.avif 480w, /img/hero-1200.avif 1200w"
    sizes="(max-width: 480px) 480px, 1200px"
    type="image/avif">
  <!-- WebP — широкая поддержка -->
  <source
    srcset="/img/hero-480.webp 480w, /img/hero-1200.webp 1200w"
    sizes="(max-width: 480px) 480px, 1200px"
    type="image/webp">
  <!-- Fallback JPEG -->
  <img
    src="/img/hero-1200.jpg"
    width="1200"
    height="630"
    fetchpriority="high"
    alt="Hero">
</picture>
```

#### Preload LCP-изображения

```html
<head>
  <!-- Браузер начинает загрузку до обнаружения img в DOM -->
  <link
    rel="preload"
    href="/img/hero-1200.webp"
    as="image"
    imagesrcset="/img/hero-480.webp 480w, /img/hero-1200.webp 1200w"
    imagesizes="(max-width: 480px) 480px, 1200px">
</head>
```

#### Предотвращение CLS: размеры обязательны

```html
<!-- Всегда указывать width + height — браузер резервирует место -->
<img src="photo.jpg" width="800" height="600" alt="...">

<!-- Или CSS aspect-ratio для адаптивных изображений -->
<style>
.responsive-img {
  width: 100%;
  aspect-ratio: 4 / 3; /* резервирует место до загрузки */
  object-fit: cover;
}
</style>
<img class="responsive-img" src="photo.jpg" alt="...">
```

#### Оптимизация в процессе сборки

```javascript
// Vite + vite-imagetools
import heroUrl from './hero.jpg?w=1200&format=webp&quality=80';

// Next.js: автоматическая оптимизация через next/image
import Image from 'next/image';
<Image
  src="/hero.jpg"
  width={1200}
  height={630}
  priority  // = preload + fetchpriority="high"
  alt="Hero"
/>;
```

```javascript
// Скрипт оптимизации через Sharp
import sharp from 'sharp';

async function optimizeImages(inputDir, outputDir) {
  const files = await glob(`${inputDir}/**/*.{jpg,png}`);

  await Promise.all(files.map(async (file) => {
    const name = path.basename(file, path.extname(file));

    // WebP
    await sharp(file)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`${outputDir}/${name}-1200.webp`);

    // AVIF
    await sharp(file)
      .resize(1200, null, { withoutEnlargement: true })
      .avif({ quality: 60 })
      .toFile(`${outputDir}/${name}-1200.avif`);
  }));
}
```

### Практика и применение

**Пример стратегии для e-commerce:**
- Карточки товаров (~100 на странице): WebP + `loading="lazy"` + фиксированные размеры.
- Hero-изображение: AVIF/WebP + `preload` + `fetchpriority="high"` + srcset.
- Иконки/логотипы: SVG (не растровые форматы).
- Анимации: MP4/WebM вместо GIF.

**CDN с on-the-fly трансформацией:**
- Cloudinary, Imgix, Cloudflare Images, Next.js Image Optimization — автоматически конвертируют в WebP/AVIF, ресайзят, кэшируют на edge.

### Важные нюансы и краеугольные камни

- **`loading="lazy"` не для LCP**: браузер откладывает загрузку → LCP ухудшается. Для «первого экрана» — `loading="eager"` (дефолт) + `fetchpriority="high"`.
- **`fetchpriority="high"` vs `preload`**: `fetchpriority` не запускает загрузку раньше, а повышает приоритет в очереди; `preload` запускает загрузку немедленно. Для LCP-изображения нужны оба.
- **GIF → видео**: `<video autoplay muted loop playsinline>` с MP4 (H.264) — в 10–50 раз меньше по размеру.
- **Retina/HiDPI**: на устройствах с DPR=2 браузер запросит изображение вдвое шире; без srcset — размытое или перегруженное сетью.
- **AVIF кодирование медленнее**: требует больше CPU на сервере; для SSR с on-the-fly трансформацией WebP может быть компромиссом.
- **`decoding="async"`** — декодирование изображения в фоновом потоке; не блокирует main thread, но может задержать отображение.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему нельзя ставить `loading="lazy"` на LCP-изображение?** — Браузер намеренно откладывает загрузку → LCP растёт; нужен eager + fetchpriority="high".
- **Что такое DPR и как учитывать Retina?** — Device Pixel Ratio; на DPR=2 нужно изображение в 2× физических пикселей; srcset с `2x` дескриптором или `w`-дескрипторами.
- **Когда использовать SVG vs PNG для иконок?** — SVG: масштабируемые, любой разрешение, стилизуемые через CSS; PNG: когда SVG слишком сложный или нужен специфичный pixel art.
- **Как `<picture>` отличается от `srcset` в `<img>`?** — `<picture>` позволяет менять не только разрешение, но и формат, кропп и контент для разных breakpoints.
- **Как CDN помогает с изображениями?** — Edge-кэш уменьшает RTT; on-the-fly конвертация под тип устройства; автоматический WebP/AVIF для поддерживаемых браузеров.

### Красные флаги (чего не говорить)

- «Просто сжать JPEGs — и всё» — игнорирует формат, responsive images, lazy load, CLS.
- «WebP не поддерживается» — поддержка 95%+ браузеров с 2021 года.
- «`loading="lazy"` ускоряет все изображения» — только off-screen; для LCP вредит.
- «SVG для фотографий» — SVG — векторный формат, не подходит для растровых фото.

### Связанные темы

- `010-rasskazhite-o-metrikakh-core-web-vitals.md`
- `014-kak-realizovat-otlozhennuyu-zagruzku-izobrazhenij.md`
- `007-raznica-mezhdu-preload-prefetch-preconnect-i-prerender.md`
- `012-sposoby-umensheniya-vremeni-zagruzki-veb-stranicy.md`
