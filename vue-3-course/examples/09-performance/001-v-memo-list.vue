<script setup lang="ts">
import { ref } from 'vue'

interface Row {
  id: string
  label: string
  selected: boolean
}

const rows = ref<Row[]>([
  { id: '1', label: 'Alpha', selected: false },
  { id: '2', label: 'Beta', selected: true },
  { id: '3', label: 'Gamma', selected: false },
])

const renderCount = ref(0)

function toggle(id: string) {
  const row = rows.value.find((r) => r.id === id)
  if (row) row.selected = !row.selected
}

function bumpRenderCount() {
  renderCount.value++
}
</script>

<template>
  <div>
    <p data-testid="render-count">Renders: {{ renderCount }}</p>
    <button type="button" data-testid="bump" @click="bumpRenderCount">Bump</button>
    <ul>
      <li
        v-for="row in rows"
        :key="row.id"
        v-memo="[row.id, row.selected]"
        data-testid="row"
      >
        <span>{{ row.label }}</span>
        <button type="button" @click="toggle(row.id)">Toggle</button>
        <span data-testid="selected">{{ row.selected }}</span>
      </li>
    </ul>
  </div>
</template>
