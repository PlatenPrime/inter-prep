<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { createTask, fetchTasks, toggleTaskDone } from '@capstone/api/tasks'
import TaskForm from '@capstone/components/TaskForm.vue'
import TaskList from '@capstone/components/TaskList.vue'
import { useFilteredTasks } from '@capstone/composables/useFilteredTasks'
import type { CreateTaskInput } from '@capstone/schemas/task'
import { useTaskFiltersStore } from '@capstone/stores/taskFilters'

const filters = useTaskFiltersStore()
const { filter, search } = storeToRefs(filters)

const queryCache = useQueryCache()

const { data: tasks, isPending } = useQuery({
  key: ['tasks'],
  query: () => fetchTasks(),
})

const filteredTasks = useFilteredTasks(tasks, filter, search)

const { mutate: addTask } = useMutation({
  mutation: (input: CreateTaskInput) => createTask(input),
  onSettled: async () => {
    await queryCache.invalidateQueries({ key: ['tasks'] })
  },
})

const { mutate: toggleDone } = useMutation({
  mutation: (id: string) => toggleTaskDone(id),
  onSettled: async () => {
    await queryCache.invalidateQueries({ key: ['tasks'] })
  },
})

function onCreate(input: CreateTaskInput) {
  addTask(input)
}
</script>

<template>
  <section class="task-board">
    <header class="header">
      <h1>Task Board</h1>
      <nav>
        <RouterLink to="/tasks/settings">Settings</RouterLink>
      </nav>
    </header>

    <div class="filters" data-testid="filters">
      <input
        v-model="search"
        data-testid="search"
        type="search"
        placeholder="Search tasks..."
      />
      <select v-model="filter" data-testid="filter-select">
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="done">Done</option>
      </select>
    </div>

    <TaskForm @submit="onCreate" />
    <TaskList
      :tasks="filteredTasks"
      :is-loading="isPending"
      @toggle="toggleDone"
    />
  </section>
</template>

<style scoped>
.task-board {
  max-width: 640px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

input[type='search'],
select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
