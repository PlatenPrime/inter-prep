<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTaskFiltersStore } from '@capstone/stores/taskFilters'

const filters = useTaskFiltersStore()
const { filter, search, hasActiveFilters } = storeToRefs(filters)
</script>

<template>
  <section class="settings" data-testid="settings">
    <h1>Settings</h1>
    <RouterLink to="/tasks">&larr; Back to tasks</RouterLink>

    <dl>
      <dt>Current filter</dt>
      <dd data-testid="current-filter">{{ filter }}</dd>
      <dt>Search query</dt>
      <dd data-testid="current-search">{{ search || '(empty)' }}</dd>
      <dt>Has active filters</dt>
      <dd data-testid="has-filters">{{ hasActiveFilters }}</dd>
    </dl>

    <button type="button" data-testid="reset-btn" @click="filters.reset()">
      Reset filters
    </button>
  </section>
</template>

<style scoped>
.settings {
  max-width: 480px;
  margin: 0 auto;
}

dl {
  margin: 1.5rem 0;
}

dt {
  font-weight: 600;
}

dd {
  margin: 0 0 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
}
</style>
