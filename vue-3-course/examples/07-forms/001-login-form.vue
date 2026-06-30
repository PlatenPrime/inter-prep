<script setup lang="ts">
import { ref } from 'vue'
import { flattenZodErrors, loginSchema, type LoginForm } from './loginSchema'

const emit = defineEmits<{
  submit: [data: LoginForm]
}>()

const form = ref<LoginForm>({ email: '', password: '' })
const errors = ref<Record<string, string>>({})

function onSubmit() {
  const result = loginSchema.safeParse(form.value)
  if (!result.success) {
    errors.value = flattenZodErrors(result.error)
    return
  }
  errors.value = {}
  emit('submit', result.data)
}
</script>

<template>
  <form data-testid="form" @submit.prevent="onSubmit">
    <label for="email">Email</label>
    <input
      id="email"
      v-model="form.email"
      data-testid="email"
      type="email"
      :aria-invalid="!!errors.email"
    />
    <p v-if="errors.email" role="alert" data-testid="email-error">{{ errors.email }}</p>

    <label for="password">Password</label>
    <input
      id="password"
      v-model="form.password"
      data-testid="password"
      type="password"
      :aria-invalid="!!errors.password"
    />
    <p v-if="errors.password" role="alert" data-testid="password-error">
      {{ errors.password }}
    </p>

    <button type="submit" data-testid="submit">Sign in</button>
  </form>
</template>
