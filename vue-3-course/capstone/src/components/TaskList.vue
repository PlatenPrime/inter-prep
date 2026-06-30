<script setup lang="ts">
import type { Task } from '@capstone/schemas/task'

defineProps<{
  tasks: Task[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  toggle: [id: string]
}>()
</script>

<template>
  <div>
    <p v-if="isLoading" data-testid="loading">Loading tasks...</p>
    <p v-else-if="tasks.length === 0" data-testid="empty">No tasks match filters.</p>
    <ul v-else class="task-list" data-testid="task-list">
      <li v-for="task in tasks" :key="task.id" data-testid="task-item">
        <label>
          <input
            type="checkbox"
            :checked="task.done"
            data-testid="task-checkbox"
            @change="emit('toggle', task.id)"
          />
          <RouterLink :to="`/tasks/${task.id}`" data-testid="task-link">
            {{ task.title }}
          </RouterLink>
        </label>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

a {
  color: #2c3e50;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
