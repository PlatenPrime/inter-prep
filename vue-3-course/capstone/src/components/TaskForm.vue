<script setup lang="ts">
import { ref } from 'vue'
import { createTaskSchema, type CreateTaskInput } from '@capstone/schemas/task'

const emit = defineEmits<{
  submit: [data: CreateTaskInput]
}>()

const title = ref('')
const error = ref<string | null>(null)

function onSubmit() {
  const result = createTaskSchema.safeParse({ title: title.value })
  if (!result.success) {
    error.value = result.error.issues[0]?.message ?? 'Invalid'
    return
  }
  error.value = null
  emit('submit', result.data)
  title.value = ''
}
</script>

<template>
  <form data-testid="task-form" class="task-form" @submit.prevent="onSubmit">
    <label for="task-title">New task</label>
    <input
      id="task-title"
      v-model="title"
      data-testid="title-input"
      type="text"
      placeholder="What needs to be done?"
      :aria-invalid="!!error"
    />
    <p v-if="error" role="alert" data-testid="title-error">{{ error }}</p>
    <button type="submit" data-testid="submit-btn">Add task</button>
  </form>
</template>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #42b883;
  color: white;
  cursor: pointer;
}
</style>
