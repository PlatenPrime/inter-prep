# Q006. Можно ли использовать TypeScript в серверной разработке?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

Да, TypeScript широко используется в серверной разработке — он полностью совместим с Node.js и экосистемой npm. Фреймворки NestJS, Fastify, Express (с типами), tRPC и Prisma изначально написаны на TypeScript или имеют первоклассную поддержку. TypeScript на сервере даёт те же преимущества, что и во фронтенде: типобезопасность, рефакторинг, автодополнение.

---

## Развёрнутый ответ

### Суть и определение

Node.js исполняет JavaScript, поэтому TypeScript компилируется в JS и запускается стандартным способом. Выбор TypeScript для сервера — это решение об инструментарии, а не технические ограничения. Вся экосистема npm доступна как в JS, так и в TS.

### Как это работает

#### Способы запуска TypeScript в Node.js

**1. Компиляция через `tsc` → запуск JS**
```bash
tsc && node dist/server.js
```
Подходит для продакшн: компилируем один раз, запускаем чистый JS.

**2. `ts-node` — прямой запуск TS в Node**
```bash
npx ts-node src/server.ts
```
Удобен в разработке; медленнее из-за компиляции on-the-fly.

**3. `tsx` — быстрый запуск через esbuild**
```bash
npx tsx src/server.ts
```
Современная альтернатива `ts-node`; в ~10 раз быстрее.

**4. Node.js 22+ со встроенным strip types**
```bash
node --experimental-strip-types src/server.ts
```
Node.js удаляет типовые аннотации без полноценной компиляции (без проверки типов).

**5. Bun — рантайм с нативной поддержкой TS**
```bash
bun run src/server.ts
```
Bun транспилирует TS нативно, без дополнительных инструментов.

#### Популярные серверные фреймворки

| Фреймворк | TypeScript-first | Особенности |
|-----------|-----------------|-------------|
| **NestJS** | Да | Angular-style архитектура, DI, декораторы |
| **tRPC** | Да | End-to-end типобезопасность клиент-сервер |
| **Hono** | Да | Лёгкий, edge-ready, RPC-клиент |
| **Fastify** | Частично | Схемы JSON Schema / Zod через плагины |
| **Express** | `@types/express` | Популярный, через DefinitelyTyped |
| **Elysia** | Да | Bun-native, быстрый |

#### Инструменты экосистемы

- **Prisma** — TypeScript-first ORM с генерацией типов из схемы БД
- **Drizzle ORM** — типобезопасный SQL-ORM
- **Zod** — валидация входящих данных (body, params, env)
- **`dotenv-safe` + Zod** — типизированные переменные окружения

### Практика и применение

**Общий тип между фронтом и бэком** — монорепозиторий (Turborepo, Nx) с `shared` пакетом:

```
packages/
  shared/          ← общие типы, схемы Zod
    src/types.ts
  api/             ← NestJS / Fastify
  web/             ← Next.js / Vite
```

Тип `User` определяется один раз и используется на обоих слоях — изменение автоматически приводит к ошибкам компиляции там, где нарушена совместимость.

### Важные нюансы и краеугольные камни

- **В продакшн деплоят скомпилированный JS**, не TS — `node dist/server.js`, не `ts-node src/server.ts`
- **Source maps** — нужны для корректного стектрейса в логах при дебаггинге
- **`ts-node` в продакшн** — антипаттерн: медленный старт, лишняя зависимость
- **Переменные окружения не типизированы** по умолчанию — нужна схема Zod или `process.env` assertions
- **Декораторы NestJS** требуют `experimentalDecorators: true` в tsconfig

### Примеры

```typescript
// Fastify + Zod — типобезопасный роут
import Fastify from "fastify";
import { z } from "zod";

const app = Fastify();

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

type CreateUserBody = z.infer<typeof CreateUserSchema>;

app.post<{ Body: CreateUserBody }>("/users", async (req, reply) => {
  const body = CreateUserSchema.parse(req.body); // runtime validation
  const user = await createUser(body); // body типизирован
  return reply.status(201).send(user);
});
```

```typescript
// Типизированные переменные окружения
import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

export const env = EnvSchema.parse(process.env);
// env.PORT — number, env.DATABASE_URL — string, env.NODE_ENV — union
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как деплоить TypeScript-сервер?** — компилируем `tsc`, деплоим `dist/`, добавляем source maps для логов
- **Что такое NestJS и чем он отличается от Express?** — NestJS — opinionated фреймворк с DI, модулями, декораторами; Express — минималистичный без архитектурных ограничений
- **Что такое tRPC?** — библиотека для type-safe API без кодогенерации: типы роутера на сервере автоматически доступны на клиенте
- **Как типизировать переменные окружения?** — через Zod-схему с `z.parse(process.env)` при старте приложения

### Красные флаги (чего не говорить)

- «TypeScript работает только во фронтенде» — полностью поддерживается в Node.js и других рантаймах (Bun, Deno)
- «В продакшне запускаем `ts-node`» — это антипаттерн; в прод деплоят скомпилированный JS
- «Переменные окружения автоматически типизированы в TS» — `process.env` имеет тип `Record<string, string | undefined>` без явной схемы

### Связанные темы

- `001-chto-takoe-typescript.md`
- `002-osnovnye-komponenty-typescript.md`
- `020-dekoratory-v-typescript.md`
