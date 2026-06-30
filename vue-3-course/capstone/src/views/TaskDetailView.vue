<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@pinia/colada'
import { fetchTaskById } from '@capstone/api/tasks'

const route = useRoute()
const taskId = computed(() => route.params.id as string)

const { data: task, isPending, error } = useQuery({
  key: () => ['tasks', taskId.value],
  query: () => fetchTaskById(taskId.value),
})
</script>

<template>
  <section class="detail" data-testid="task-detail">
    <RouterLink to="/tasks">&larr; Back to list</RouterLink>

    <p v-if="isPending" data-testid="loading">Loading...</p>
    <p v-else-if="error || !task" data-testid="not-found">Task not found.</p>
    <article v-else>
      <h1>{{ task.title }}</h1>
      <p>Status: <strong>{{ task.done ? 'Done' : 'Active' }}</strong></p>
      <p class="meta">Created: {{ new Date(task.createdAt).toLocaleString() }}</p>
    </article>
  </section>
</template>

<style scoped>
.detail {
  max-width: 640px;
  margin: 0 auto;
}

.meta {
  color: #666;
  font-size: 0.9rem;
}
</style>
