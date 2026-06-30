<script setup lang="ts">
import { ref } from 'vue'

interface Task {
  id: string
  title: string
  done: boolean
}

const tasks = ref<Task[]>([
  { id: '1', title: 'Learn Vue', done: false },
  { id: '2', title: 'Build feature', done: true },
])

function toggle(id: string) {
  const task = tasks.value.find((t) => t.id === id)
  if (task) task.done = !task.done
}
</script>

<template>
  <ul>
    <li
      v-for="task in tasks"
      :key="task.id"
      :data-done="task.done"
      data-testid="task"
    >
      <span>{{ task.title }}</span>
      <button type="button" @click="toggle(task.id)">Toggle</button>
    </li>
  </ul>
</template>
