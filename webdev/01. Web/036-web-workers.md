# Q036. Что такое Web Workers?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Web Workers** — механизм запуска JavaScript в **фоновом потоке** отдельно от main thread страницы. Обмен данными через `postMessage` (structured clone) или **Transferable** (`ArrayBuffer`). Не имеют доступа к DOM; подходят для тяжёлых вычислений, парсинга, криптографии, обработки больших массивов без блокировки UI. Варианты: Dedicated Worker, Shared Worker, (отдельно) Service Worker.

---

## Развёрнутый ответ

### Суть и определение

Браузер — однопоточный event loop на вкладке; долгий JS блокирует отрисовку и ввод. Worker создаёт **параллельный** поток с собственным глобальным объектом (`self` в worker.js).

**Dedicated Worker** — один владелец (страница или вложенный worker). **Shared Worker** — несколько вкладок одного origin (реже используется).

### Как это работает

1. `const worker = new Worker('worker.js', { type: 'module' })`.
2. `worker.postMessage({ data })` — клонирование или transfer владения буфером.
3. Worker считает и отвечает `self.postMessage(result)`.
4. `worker.terminate()` — принудительное завершение.

Ошибки: `worker.onerror`, `ErrorEvent` без доступа к stack из main в старых сценариях.

**Worker + IndexedDB / fetch** — да, для офлайн-обработки.

### Практика и применение

- **Сжатие изображений, парсинг CSV/JSON MB+, WASM crypto** — вынести из main.
- **Audio processing** (до AudioWorklet) — фоновые буферы.
- **Монолитные SPA** — разбить CPU-bound задачи; не для каждой мелочи (overhead создания worker).

Без workers UI «замирает» на тяжёлом цикле — плохой INP и отзывчивость.

### Важные нюансы и краеугольные камни

- **Нет DOM, window, parent** — только subset API.
- `postMessage` копирует большие объекты — дорого; использовать **transferable**.
- Слишком много workers — память и контекстные переключения.
- **CORS** для worker script — тот же origin (или blob/module worker).
- **React 18+** не заменяет workers — Concurrent Mode не параллелит CPU на другом ядре.

### Примеры

```javascript
// main.js
const worker = new Worker(new URL('./hash.worker.js', import.meta.url), {
  type: 'module',
});

worker.postMessage({ buffer: bigArrayBuffer }, [bigArrayBuffer]);

worker.onmessage = (e) => console.log('hash:', e.data.digest);
```

```javascript
// hash.worker.js
self.onmessage = async ({ data }) => {
  const digest = await crypto.subtle.digest('SHA-256', data.buffer);
  self.postMessage({ digest: [...new Uint8Array(digest)] });
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Worker vs Service Worker?** — нет fetch intercept, другой lifecycle.
- **Comlink / worker pools?** — упростить RPC и переиспользовать workers.
- **Atomics + SharedArrayBuffer?** — нужен COOP/COEP заголовки.
- **Module workers?** — `import` в worker, tree-shaking.
- **Когда Worker избыточен?** — задача < 50 ms, overhead не окупается.

### Красные флаги (чего не говорить)

- «Worker может менять DOM через прокси» — нет.
- Создавать worker на каждый клик без pool.
- Путать с **Web Worklet** (аудио/пейнт, другой lifecycle).

### Связанные темы

- [035-service-workers.md](035-service-workers.md)
- [037-web-worklet.md](037-web-worklet.md)
- [033-indexeddb.md](033-indexeddb.md)

---
