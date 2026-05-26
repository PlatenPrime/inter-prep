# Q026. Разница между обфускацией и минификацией кода?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**Минификация** — удаление лишних символов (пробелы, комментарии, переносы строк) и сокращение имён переменных для уменьшения размера файла; **цель — производительность**. **Обфускация** — намеренное запутывание кода (перекодирование строк, запутывание потока управления) для затруднения понимания; **цель — защита от реверс-инжиниринга**. Минификация — стандартная практика для любого production-сборки; обфускация — опциональная, применяется редко и только по специальным причинам.

---

## Развёрнутый ответ

### Сравнение на примере

**Исходный код:**
```javascript
// Вычисляет итоговую цену с учётом скидки и налога
function calculateTotal(price, discountPercent, taxRate) {
  const discountedPrice = price * (1 - discountPercent / 100);
  const total = discountedPrice * (1 + taxRate);
  return Math.round(total * 100) / 100;
}

module.exports = { calculateTotal };
```

**После минификации (terser):**
```javascript
function calculateTotal(e,t,a){const c=e*(1-t/100);return Math.round(c*(1+a)*100)/100}module.exports={calculateTotal};
```
- Размер: ~120 байт → ~90 байт (уменьшение ~25%)
- Логика читаема при небольшом усилии
- Имена сокращены, но структура видна

**После обфускации (javascript-obfuscator):**
```javascript
var _0x3f2a=['round','exports','calculateTotal'];(function(_0x1a,_0x2b){var _0x3c=function(_0x4d){while(--_0x4d){_0x1a['push'](_0x1a['shift']());}};_0x3c(++_0x2b);}(_0x3f2a,0x1d3));var _0x5e=function(_0x6f,_0x7g){_0x6f=_0x6f-0x0;return _0x3f2a[_0x6f];};function _0x8h9i(_0xa,_0xb,_0xc){var _0xd=_0xa*(0x1-_0xb/0x64);return Math[_0x5e('0x0')](_0xd*(0x1+_0xc)*0x64)/0x64;}module[_0x5e('0x1')]={[_0x5e('0x2')]:_0x8h9i};
```
- Размер: ~120 байт → ~450 байт (увеличение ~275%!)
- Логика крайне трудночитаема без деобфускации

---

## Сравнение

| Критерий | Минификация | Обфускация |
|----------|------------|------------|
| **Цель** | Уменьшить размер файла | Затруднить понимание кода |
| **Размер файла** | Уменьшается на 50–80% | Увеличивается на 20–300% |
| **Скорость выполнения** | Без изменений или лучше | Может снизиться на 15–50% |
| **Читаемость** | Низкая, но восстановима | Очень низкая, намеренно |
| **Reversibility** | Prettifier восстанавливает структуру | Требует серьёзного ручного анализа |
| **Применение** | Всегда в production | Редко, при специфической необходимости |
| **Инструменты** | terser, esbuild, closure-compiler | javascript-obfuscator, JScrambler |
| **Безопасность** | Не даёт | Минимальная (Security through Obscurity) |

---

### Детали минификации

```javascript
// Что делает минификатор:

// 1. Удаляет пробелы, комментарии, переносы строк
// 2. Сокращает имена локальных переменных
// 3. Удаляет unreachable code
// 4. Inline short functions
// 5. Константные вычисления (constant folding):
//    Math.PI * 2 → 6.283185307179586
// 6. Удаляет ненужные скобки
// 7. Заменяет if/else тернарным оператором

// Исходный:
function greet(name) {
  if (name === undefined) {
    name = 'World';
  }
  return 'Hello, ' + name + '!';
}

// Minified:
function greet(n){return'Hello, '+(n===void 0?'World':n)+'!'}
```

### Детали обфускации

```javascript
// Что делает обфускатор (дополнительно к минификации):

// 1. String Array + Rotation (замедляет поиск строк)
var _0x1a2b = ['Hello, ', 'World', '!'];
// Все строки хранятся в массиве, доступ через функцию с вычислением

// 2. Control Flow Flattening (switch-based state machine)
// Линейный код → switch/case → каждый "шаг" — отдельный case

// 3. Dead Code Injection (бессмысленные ветки кода)
if (![]['filter']['constructor']('return false')()) {
  neverExecuted();
}

// 4. Self-Defending (проверка, не был ли код изменён)
// При изменении (например, через DevTools) — ломает выполнение

// 5. Debug Protection
// Бесконечный цикл при открытии DevTools:
(function() {
  function _0xCheck() {
    var _0x = new Date();
    debugger; // открытие DevTools → долгая пауза
    if (new Date() - _0x > 100) { while(true) {} } // infinite loop
  }
  setInterval(_0xCheck, 100);
})();
```

### Инструменты и конфигурация

```typescript
// Vite: минификация в production (дефолтно)
export default defineConfig({
  build: {
    minify: 'esbuild',  // быстрее, но базовая минификация
    // ИЛИ:
    minify: 'terser',   // агрессивнее, медленнее
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        passes: 2,  // несколько проходов оптимизации
      },
      mangle: {
        toplevel: false, // не переименовывать top-level имена (API)
      },
    },
    sourcemap: false, // не выкладывать source maps публично
  },
});

// Обфускация через плагин (нужна редко):
import obfuscator from 'rollup-plugin-obfuscator';

export default defineConfig({
  plugins: [
    // Только если есть веская причина:
    process.env.OBFUSCATE === 'true' && obfuscator({
      compact: true,
      controlFlowFlattening: true,
      // НО: проверьте влияние на производительность!
    }),
  ].filter(Boolean),
});
```

### Source Maps — связующее звено

```typescript
// Source maps восстанавливают читаемость минифицированного кода
// В production: два варианта:

// 1. НЕ публиковать source maps (самый простой)
//    Плюсы: код нечитаем
//    Минусы: сложнее дебажить ошибки из production

// 2. Публиковать в Sentry с hidden источником
//    Sentry получает source map, пользователи — нет
// sentry.config.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  release: process.env.APP_VERSION,
});
// Загрузить source maps в Sentry CI при деплое:
// sentry-cli releases files $VERSION upload-sourcemaps ./dist --rewrite
```

### Важные нюансы

- **Минификация не делает код «безопасным»** — prettifier мгновенно восстанавливает форматирование; имена восстанавливаются через source maps
- **Обфускация замедляет загрузку** — больший размер файла + сложный код → медленный parsing; тест производительности обязателен
- **Оба метода работают после транспиляции** — TypeScript → JS → minify/obfuscate; TypeScript нельзя «защитить» обфускацией TS-исходников (они не отправляются в браузер)

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что быстрее: esbuild или terser?** — esbuild в 10-100x быстрее терсера по времени сборки; terser агрессивнее в оптимизации размера. Для большинства проектов esbuild достаточен.
- **Нужна ли обфускация если используется HTTPS?** — Нет связи: HTTPS шифрует трафик; обфускация относится к содержанию JS-файла. HTTPS не мешает читать исходный код.
- **Как source maps помогают в production?** — Без source maps stack traces показывают `_0x2a3b:1:5432`; с source maps (в Sentry) → `calculateTotal:15:8`. Source maps публично не публикуются.
- **Зачем minify убирает console.log?** — Уменьшение размера + предотвращение утечки debug информации (структуры данных, ключи) в production.

### Красные флаги (чего не говорить)

- «Минификация делает код безопасным» — минифицированный код читается после prettifier + source maps.
- «Обфускацию нужно применять ко всем проектам» — это редкий инструмент с существенными trade-offs (размер, скорость).
- Не знать разницу между терминами; путать minification и uglification (uglification = minification + renaming).

### Связанные темы

- `025-chto-takoe-obfuskatsiya-koda.md`
- `019-chto-takoe-sri-subresource-integrity.md`
