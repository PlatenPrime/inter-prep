# examples — справочник кода

Независимый от `days/` банк примеров для подготовки к собеседованиям.

## Структура

| Папка | Содержание |
|-------|------------|
| [`js/`](js/) | JavaScript: полифиллы, утилиты, async, лёгкие алгоритмы (001–200) |
| [`css/`](css/) | CSS + Tailwind CDN: layout, responsive, a11y, компоненты (001–100) |
| [`ts/`](ts/) | TypeScript: теория + демо + self-test, темы собеседования (001–100) |
| [`react/`](react/) | React: компонент + Vitest/RTL, теория собеседования (001–100) |

## Как пользоваться

1. **JS:** открой `examples/js/NNN-slug.js` — сверху условие, ниже решение.
2. **CSS:** открой `examples/css/.../NNN-slug/index.html` или `index.tailwind.html` в браузере.
3. **TS:** открой `examples/ts/.../NNN-slug.ts` — блоки «Теория», «На собеседовании», демо-код.
4. **React:** открой `examples/react/.../NNN-slug.tsx` + `NNN-slug.test.tsx` — компонент и RTL-тесты.
5. Запуск:
   - `node examples/js/01-types/001-typeof-detailed.js`
   - `npx tsx examples/ts/01-fundamentals/001-structural-typing.ts`
   - `npx vitest run examples/react/01-fundamentals/001-hello-props.test.tsx`
   - `npm run examples:js` · `npm run examples:ts` · `npm run examples:react` · `npm run examples:css` · `npm run examples:css:serve`

## Соглашения

| Раздел | Нумерация | Формат файла | Запуск |
|--------|-----------|--------------|--------|
| `js/` | 001–200 | `NNN-kebab-slug.js` | `node` |
| `css/` | 001–100 | `NNN-slug/index.html` | браузер |
| `ts/` | 001–100 | `NNN-kebab-slug.ts` | `tsx` |
| `react/` | 001–100 | `NNN-kebab-slug.tsx` + `.test.tsx` | `vitest` |

- ESM (`export`), Node ≥ 20
- TS: self-test внизу файла; выполняется только при прямом запуске
- React: тесты в отдельном `*.test.tsx`; общие провайдеры — [`react/_shared/render.tsx`](react/_shared/render.tsx)

## Регенерация

```bash
node scripts/generate-examples-js.mjs
node scripts/generate-examples-css.mjs
node scripts/generate-examples-ts.mjs
node scripts/generate-examples-react.mjs
```
