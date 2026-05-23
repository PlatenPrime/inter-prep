# examples — справочник кода

Независимый от `days/` банк примеров: **задача + решение + мини-тест** в одном файле.

## Структура

| Папка | Содержание |
|-------|------------|
| [`js/`](js/) | JavaScript: полифиллы, утилиты, async, лёгкие алгоритмы (001–200) |
| [`css/`](css/) | CSS + Tailwind CDN: layout, responsive, a11y, компоненты (001–100) |

Планируется: `ts/`, `react/` и др.

## Как пользоваться

1. **JS:** открой `examples/js/NNN-slug.js` — сверху условие, ниже решение.
2. **CSS:** открой `examples/css/.../NNN-slug/index.html` или `index.tailwind.html` в браузере.
3. Запуск: `node examples/js/01-types/001-typeof-detailed.js` · `npm run examples:js` · `npm run examples:css` · `npm run examples:css:serve`

## Соглашения

- Нумерация **001–200** глобальная, имя файла: `NNN-kebab-slug.js`
- ESM (`export`), Node ≥ 20
- Self-test внизу файла; выполняется только при прямом запуске (`node path/to/file.js`)

## Регенерация

```bash
node scripts/generate-examples-js.mjs
node scripts/generate-examples-css.mjs
```
