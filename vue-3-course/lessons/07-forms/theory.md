# Модуль 07 — Формы и валидация (Zod)

## Цель

Controlled forms, валидация схемами Zod, доступность, обработка submit.

## Controlled inputs

```vue
<input v-model="form.email" type="email" :aria-invalid="!!errors.email" />
<p v-if="errors.email" role="alert">{{ errors.email }}</p>
```

Типы полей:
- `text`, `email` — `v-model`
- `checkbox` — `v-model` на `boolean`
- `select` — `v-model` на value option
- checkbox group — `v-model` на `string[]`

## Zod schema

```ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
})

export type LoginForm = z.infer<typeof loginSchema>
```

## Валидация при submit

```ts
function onSubmit() {
  const result = loginSchema.safeParse(form.value)
  if (!result.success) {
    errors.value = flattenZodErrors(result.error)
    return
  }
  emit('submit', result.data)
}
```

## a11y

- Каждому input — `<label for="id">`
- Ошибки — `role="alert"`
- `aria-invalid="true"` при ошибке

## Примеры

- `examples/07-forms/001-login-form.vue`

## Следующий модуль

[08-server-state/theory.md](../08-server-state/theory.md)
