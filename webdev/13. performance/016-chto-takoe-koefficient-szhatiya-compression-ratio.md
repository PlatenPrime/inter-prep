# Q016. Что такое и как работает коэффициент сжатия (compression ratio) в контексте веб-разработки?

> **Источник:** [13. performance.md](../13.%20performance.md) · **Тема:** Performance

---

## Короткий ответ

**Compression ratio** — отношение исходного размера файла к сжатому: `original_size / compressed_size`. Например, 100 KB → 20 KB = коэффициент 5:1 (или 80% уменьшение). В веб-разработке применяется для текстовых ресурсов (HTML, CSS, JS, JSON) через алгоритмы **Gzip** и **Brotli**. Brotli даёт коэффициент на 15–25% лучше, чем Gzip для веб-контента, при сравнимом CPU overhead. Сжатие настраивается на сервере/CDN и прозрачно для клиента через заголовок `Content-Encoding`.

---

## Развёрнутый ответ

### Суть и определение

Compression ratio — базовая метрика эффективности сжатия данных. Вычисляется как:

```
Compression Ratio = original_size / compressed_size
Savings % = (1 - compressed_size / original_size) × 100
```

В контексте HTTP-сжатия сервер сжимает ответ перед отправкой, клиент (браузер) распаковывает. Байты по сети = compressed_size; байты в памяти = original_size.

### Как это работает

#### Алгоритмы HTTP-сжатия

**Deflate** — основан на LZ77 + Huffman coding. Устаревший, теперь вместо него используют Gzip.

**Gzip** — обёртка над Deflate с контрольными суммами. Стандарт с 1990-х, поддерживается повсеместно.

**Brotli** — разработан Google (2015). Использует LZ77, Huffman coding + Context modeling (словарь из 120 тысяч слов из веб-контента). Именно словарь даёт преимущество над Gzip: часто встречающиеся слова HTML/CSS/JS кодируются очень коротко.

**Zstandard (zstd)** — современный алгоритм от Facebook, превосходит Brotli по скорости кодирования при сравнимом сжатии. Поддержка в браузерах появляется в 2024+.

#### Типичные коэффициенты

| Тип контента | Gzip ratio | Brotli ratio |
|-------------|-----------|-------------|
| HTML | 4:1 – 6:1 | 5:1 – 7:1 |
| CSS | 5:1 – 7:1 | 6:1 – 8:1 |
| JavaScript | 3:1 – 5:1 | 4:1 – 6:1 |
| JSON API | 5:1 – 10:1 | 6:1 – 12:1 |
| Изображения JPEG/WebP | ~1:1 (уже сжатые) | ~1:1 |
| Бинарные данные | ~1:1 | ~1:1 |

Текстовые данные сжимаются хорошо (высокая энтропия повторяющихся паттернов), уже сжатые бинарные форматы — практически нет.

#### Протокол Content Negotiation

```
Клиент → Server:
Accept-Encoding: gzip, deflate, br, zstd

Server → Client:
Content-Encoding: br
Content-Type: application/javascript
(тело: Brotli-сжатый JS)
```

Браузер автоматически распаковывает на основе `Content-Encoding`.

#### Уровни сжатия

Алгоритмы имеют настраиваемые уровни — баланс между степенью сжатия и CPU-временем:

```
Gzip:   level 1 (быстро, хуже сжатие) → level 9 (медленно, лучше сжатие)
Brotli: level 0                        → level 11
```

**Static files**: можно сжать один раз заранее (максимальный уровень) и отдавать из кэша.

**Dynamic responses**: нужен компромисс (Brotli level 4–6, Gzip level 6).

### Практика и применение

**Настройка на Nginx:**

```nginx
# Gzip для динамики
gzip on;
gzip_comp_level 6;
gzip_min_length 1000; # не сжимать маленькие файлы (overhead > экономия)
gzip_types
  text/plain text/css text/javascript
  application/javascript application/json application/xml
  image/svg+xml;

# Brotli (нужен модуль ngx_brotli)
brotli on;
brotli_comp_level 6;
brotli_types
  text/plain text/css application/javascript application/json
  image/svg+xml;

# Pre-compressed static files (Brotli level 11 при сборке)
brotli_static on; # отдаёт file.js.br если существует
gzip_static on;   # отдаёт file.js.gz если существует
```

**Pre-compression при сборке (Vite/Webpack):**

```javascript
// vite.config.ts
import viteCompression from 'vite-plugin-compression';

export default {
  plugins: [
    viteCompression({ algorithm: 'brotliCompress', threshold: 1024 }),
    viteCompression({ algorithm: 'gzip', threshold: 1024 }),
  ],
};
```

**Проверка сжатия в DevTools:**

Network → запрос → Headers:
- `Content-Encoding: br` — Brotli.
- `Content-Encoding: gzip` — Gzip.
- Столбец «Size» vs «Content»: `23.5 KB / 87.2 KB` = 23.5 KB по сети, 87.2 KB распакованный.

```javascript
// Проверка через Fetch API (для диагностики)
const response = await fetch('/app.js');
const compressed = response.headers.get('content-encoding');
console.log('Compression:', compressed); // 'br' или 'gzip' или null
```

**Измерение реального эффекта:**

```bash
# curl: сравнение размеров
curl -s -o /dev/null -w "%{size_download}" https://example.com/app.js
curl -s -H "Accept-Encoding: br" -o /dev/null -w "%{size_download}" https://example.com/app.js
```

### Важные нюансы и краеугольные камни

- **Не сжимать маленькие файлы** (< 1 KB): HTTP-заголовки + overhead алгоритма могут дать файл **больше** оригинала. Порог: `gzip_min_length 1000`.
- **Изображения, видео, PDF, архивы** — уже сжаты своими алгоритмами; применение Gzip/Brotli даёт почти 0% выигрыша при 100% CPU overhead.
- **Brotli медленнее кодирует** (особенно level 9–11): не подходит для on-the-fly сжатия динамики; используется со static pre-compression или на level 4–6.
- **`Transfer-Encoding: chunked` + `Content-Encoding: gzip`** — потоковое сжатие: сервер начинает отдавать Gzip-данные до окончания ответа. Важно для больших динамических JSON.
- **Compression ratio зависит от контента**: минифицированный JS сжимается хуже нечитаемого; красиво отформатированный HTML — лучше. Минификация + сжатие работают синергетически.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему Brotli лучше Gzip?** — Встроенный словарь из веб-контента (120к слов) делает кодирование HTML/CSS/JS значительно эффективнее; на 15–25% меньше при сопоставимом CPU.
- **Когда compression ratio близок к 1 (нет сжатия)?** — Уже сжатые форматы (JPEG, WebP, AVIF, MP4, ZIP, WOFF2); применение Gzip не даёт выигрыша.
- **Чем отличается минификация от сжатия?** — Минификация убирает лишние символы (пробелы, комментарии) — применяется при сборке; сжатие кодирует паттерны — применяется при передаче. Они дополняют друг друга.
- **Как работает content negotiation для сжатия?** — Клиент в `Accept-Encoding` перечисляет поддерживаемые алгоритмы; сервер выбирает лучший и указывает в `Content-Encoding`.
- **Влияет ли сжатие на кэширование?** — Сжатый ответ кэшируется с заголовком `Vary: Accept-Encoding`, чтобы клиенты без Brotli получили Gzip-версию.

### Красные флаги (чего не говорить)

- «Gzip сжимает изображения» — минимальный эффект; WebP/AVIF уже используют эффективное сжатие.
- «Brotli всегда быстрее Gzip» — Brotli медленнее кодирует (особенно на высоких уровнях); быстрее только итоговая передача из-за меньшего размера.
- «Сжатие заменяет минификацию» — дополняют друг друга; минифицированный + сжатый JS меньше, чем просто сжатый.
- «Compression ratio всегда > 1» — для уже сжатых файлов и очень маленьких файлов может быть ≤ 1 (overhead заголовков).

### Связанные темы

- `012-sposoby-umensheniya-vremeni-zagruzki-veb-stranicy.md`
- `013-kak-optimizirovat-zagruzku-izobrazhenij.md`
- `015-metody-optimizacii-zagruzki-shriftov.md`
