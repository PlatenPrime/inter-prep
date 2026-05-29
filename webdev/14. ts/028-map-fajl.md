# Q028. Что такое `.map` файл, как и зачем его использовать?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

**Source map** (`.map` файл) — это JSON-файл, связывающий скомпилированный/минифицированный JavaScript с исходным TypeScript-кодом. Благодаря нему браузер и отладчик показывают **оригинальный TypeScript код** вместо транспилированного JS — корректные строки в стектрейсах, шаги отладки по исходникам, понятные имена переменных.

---

## Развёрнутый ответ

### Суть и определение

TypeScript компилирует `.ts` → `.js`, и в продакшне JS ещё и минифицируется. Без source maps:
- Ошибки в браузере ссылаются на непонятный минифицированный код: `bundle.min.js:1:5423`
- Дебаггер показывает компилированный JS, а не исходный TypeScript
- Стектрейсы Node.js бесполезны после компиляции

С source maps: `UserService.ts:42` — точная строка в оригинальном файле.

### Как это работает

#### Структура `.map` файла

```json
{
  "version": 3,
  "file": "app.js",
  "sourceRoot": "",
  "sources": ["../src/app.ts", "../src/utils.ts"],
  "sourcesContent": ["// original TypeScript source", "// utils source"],
  "names": ["greet", "name", "message"],
  "mappings": "AAAA,SAAS,KAAK,CAAC,IAAY..."
}
```

- `version`: всегда 3 (Source Map Spec v3)
- `sources`: массив путей к исходникам
- `mappings`: VLQ-кодированная таблица соответствий позиций (сжатая)
- `sourcesContent`: содержимое исходников (опционально, для inline)

#### Настройка в TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "sourceMap": true,        // генерировать .js.map файлы
    "inlineSourceMap": false, // встроить map в JS (base64) вместо отдельного файла
    "inlineSources": false,   // встроить исходный TS в .map
    "sourceRoot": "/",        // базовый URL для исходников
    "declarationMap": true    // генерировать .d.ts.map (для library navigation)
  }
}
```

Компилятор добавляет в конец `.js` файла ссылку:
```javascript
// Отдельный map файл:
//# sourceMappingURL=app.js.map

// Или inline map (base64):
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIi...
```

#### Типы source map конфигураций

| Вариант | tsconfig | Описание |
|---------|----------|----------|
| Отдельный файл | `"sourceMap": true` | `app.js` + `app.js.map` |
| Inline map | `"inlineSourceMap": true` | только `app.js` с встроенным map |
| Inline sources | `"inlineSources": true` | TS-код встроен в `.map`; не нужен доступ к `.ts` |
| Declaration map | `"declarationMap": true` | `.d.ts.map` для перехода к источнику из библиотеки |

### Практика и применение

#### Отладка в браузере (Chrome DevTools)

```typescript
// src/services/user.service.ts
export class UserService {
  async getUser(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`User ${id} not found`); // Строка 6 в оригинале
    }
    return response.json();
  }
}
```

Без source map в консоли: `Error at bundle.min.js:1:2847`
С source map: `Error at user.service.ts:6:13`

#### Стектрейсы в Node.js

```bash
npm install source-map-support

# Или в коде:
import "source-map-support/register";

# Теперь стектрейсы показывают .ts файлы:
Error: Connection failed
    at DatabaseService.connect (src/database/database.service.ts:23:11)
    at AppModule.bootstrap (src/app.module.ts:45:5)
```

#### Vite/webpack — автоматическая настройка

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true,          // генерировать в продакшн
    // sourcemap: "inline",   // встроенный
    // sourcemap: "hidden",   // генерировать, но не ссылаться из JS (для Sentry)
  },
});

// webpack.config.js
module.exports = {
  devtool: "source-map",         // prod: полный source map
  // devtool: "eval-source-map", // dev: быстрее, встроенный
};
```

#### Продакшн source maps для Sentry/мониторинга

```bash
# Генерируем скрытые source maps (не отдаём браузеру)
# "hidden" в Vite: sourcemap: "hidden"
# Загружаем в Sentry
npx @sentry/wizard -i sourcemaps

# Теперь в Sentry ошибки показывают исходный TypeScript
```

### Важные нюансы и краеугольные камни

- **Source maps в продакшн** — двойное лезвие: удобны для мониторинга (Sentry), но **раскрывают исходный код** браузеру; используй `"hidden"` или загружай в Sentry отдельно
- **`declarationMap`** — для авторов библиотек: позволяет потребителям перейти к исходному `.ts` через «Go to definition»
- **Performance**: source maps не влияют на рантайм (загружаются только при открытии DevTools); но увеличивают размер сборки
- **Node.js**: нужен `source-map-support` или `--enable-source-maps` флаг (Node 14.18+)
- `inlineSources: true` + `sourceMap: true` — источник встроен прямо в map; полезно для Sentry/CI, не нужны `.ts` файлы на сервере

### Примеры

```json
// tsconfig.json для разработки
{
  "compilerOptions": {
    "sourceMap": true,
    "inlineSources": true
  }
}

// tsconfig.json для продакшн-сборки библиотеки
{
  "compilerOptions": {
    "sourceMap": true,
    "declarationMap": true,
    "declaration": true
  }
}
```

```typescript
// Node.js с source maps (встроенная поддержка Node 14.18+)
// package.json:
// "scripts": { "start": "node --enable-source-maps dist/server.js" }

// Стектрейс без --enable-source-maps:
// Error at Object.<anonymous> (dist/server.js:45:15)

// Стектрейс с --enable-source-maps:
// Error at UserController.findOne (src/controllers/user.controller.ts:42:12)
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Влияют ли source maps на производительность в рантайме?** — нет; браузер загружает их только при открытых DevTools
- **Как скрыть source maps от пользователей, но использовать в Sentry?** — `sourcemap: "hidden"` в Vite/webpack; upload map в Sentry; не деплоить `.map` в публичный CDN
- **Что такое `declarationMap`?** — source map для `.d.ts` файлов; позволяет «Go to definition» из потребителей библиотеки переходить к исходному `.ts`
- **Как включить source maps в Node.js?** — `--enable-source-maps` флаг (Node 14.18+) или пакет `source-map-support`

### Красные флаги (чего не говорить)

- «Source maps замедляют приложение» — нет; загружаются только при открытых DevTools; на рантайм не влияют
- «В продакшн source maps не нужны» — нужны для мониторинга ошибок (Sentry, Datadog); просто не отдавай их браузеру
- «Source maps работают только в браузере» — также поддерживаются в Node.js (--enable-source-maps), Deno, Bun

### Связанные темы

- `027-triple-slash-directives.md`
- `002-osnovnye-komponenty-typescript.md`
- `029-jsx-v-typescript.md`
