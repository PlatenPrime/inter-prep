<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ExampleViewer from '@/components/ExampleViewer.vue'
import { useExamples } from '@/composables/useExamples'

const route = useRoute()
const { modules, findExample } = useExamples()

const selectedModule = computed(() => {
  const value = route.params.module
  return typeof value === 'string' ? value : undefined
})

const selectedFile = computed(() => {
  const value = route.params.file
  return typeof value === 'string' ? value : undefined
})

const activeExample = computed(() => {
  if (!selectedModule.value || !selectedFile.value) return undefined
  return findExample(selectedModule.value, selectedFile.value)
})

function exampleTo(moduleId: string, fileId: string) {
  return {
    name: 'example-detail',
    params: { module: moduleId, file: fileId },
  }
}
</script>

<template>
  <div class="examples-layout">
    <aside class="examples-sidebar">
      <h2>Examples</h2>
      <p class="sidebar-hint">Pick an example to preview it live and read the source.</p>

      <nav class="module-list">
        <section v-for="module in modules" :key="module.id" class="module-group">
          <h3>{{ module.title }}</h3>
          <ul>
            <li v-for="example in module.examples" :key="example.id">
              <RouterLink
                :to="exampleTo(example.module, example.file)"
                class="example-link"
                :class="{ active: activeExample?.id === example.id }"
              >
                <span class="example-link-title">{{ example.title }}</span>
                <span class="example-link-badge">{{ example.lang }}</span>
              </RouterLink>
            </li>
          </ul>
        </section>
      </nav>
    </aside>

    <main class="examples-main">
      <ExampleViewer v-if="activeExample" :example="activeExample" />

      <section v-else class="examples-empty">
        <h2>Examples Playground</h2>
        <p>
          Choose an example from the sidebar. Vue components render live on the left; source code
          with syntax highlighting appears on the right.
        </p>
        <p>
          TypeScript-only files (composables, schemas, stores) are available as source-only
          references.
        </p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.examples-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.examples-sidebar {
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 6rem);
  overflow: auto;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 1rem;
  background: #fafafa;
}

.examples-sidebar h2 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.sidebar-hint {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
}

.module-group + .module-group {
  margin-top: 1rem;
}

.module-group h3 {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #555;
}

.module-group ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.example-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.55rem;
  border-radius: 6px;
  text-decoration: none;
  color: #2c3e50;
  font-size: 0.9rem;
}

.example-link:hover {
  background: #eef8f3;
}

.example-link.active {
  background: #42b883;
  color: white;
}

.example-link-badge {
  font-size: 0.7rem;
  text-transform: uppercase;
  opacity: 0.75;
}

.examples-main {
  min-width: 0;
}

.examples-empty {
  border: 1px dashed #d4d4d8;
  border-radius: 10px;
  padding: 2rem;
  color: #555;
  line-height: 1.6;
}

.examples-empty h2 {
  margin-top: 0;
}

@media (max-width: 900px) {
  .examples-layout {
    grid-template-columns: 1fr;
  }

  .examples-sidebar {
    position: static;
    max-height: none;
  }
}
</style>
