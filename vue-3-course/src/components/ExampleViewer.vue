<script setup lang="ts">
import { computed, h, ref, shallowRef, watchEffect, type Component } from 'vue'
import { codeToHtml } from 'shiki'
import type { ExampleEntry } from '@/composables/useExamples'
import { buildSlotRenderers, exampleDemoConfig } from '@/examples-demo.config'

const props = defineProps<{
  example: ExampleEntry
}>()

const resolvedComponent = shallowRef<Component | null>(null)
const highlightedCode = ref('')
const isHighlightLoading = ref(true)
const isComponentLoading = ref(false)
const modelState = ref<unknown>(undefined)

watchEffect((onCleanup) => {
  let cancelled = false
  onCleanup(() => {
    cancelled = true
  })

  resolvedComponent.value = null
  isComponentLoading.value = props.example.isRenderable

  if (!props.example.isRenderable || !props.example.loadComponent) {
    isComponentLoading.value = false
    return
  }

  void props.example.loadComponent().then((module) => {
    if (!cancelled) {
      resolvedComponent.value = module.default
      isComponentLoading.value = false
    }
  })
})

watchEffect((onCleanup) => {
  let cancelled = false
  onCleanup(() => {
    cancelled = true
  })

  isHighlightLoading.value = true

  void codeToHtml(props.example.source, {
    lang: props.example.lang,
    theme: 'github-light',
  })
    .then((html) => {
      if (!cancelled) {
        highlightedCode.value = html
      }
    })
    .finally(() => {
      if (!cancelled) {
        isHighlightLoading.value = false
      }
    })
})

watchEffect(() => {
  const demo = exampleDemoConfig[props.example.id]
  modelState.value = demo?.model ? demo.model.initial : undefined
})

const liveVNode = computed(() => {
  if (!resolvedComponent.value) return null

  const demo = exampleDemoConfig[props.example.id]
  const renderProps: Record<string, unknown> = { ...demo?.props }

  if (demo?.model) {
    const { prop } = demo.model
    renderProps[prop] = modelState.value
    renderProps[`onUpdate:${prop}`] = (value: unknown) => {
      modelState.value = value
    }
  }

  const slots = buildSlotRenderers(demo?.slots)
  return h(resolvedComponent.value, renderProps, slots ?? {})
})
</script>

<template>
  <section class="example-viewer">
    <header class="example-header">
      <div>
        <p class="example-module">{{ example.module }}</p>
        <h2 class="example-title">{{ example.title }}</h2>
      </div>
      <code class="example-path">examples/{{ example.id }}.{{ example.lang === 'vue' ? 'vue' : 'ts' }}</code>
    </header>

    <div class="example-panels">
      <section class="panel live-panel">
        <h3>Live preview</h3>
        <div class="panel-body live-body">
          <p v-if="!example.isRenderable" class="source-only">
            TypeScript-only example — open the source panel to study the code.
          </p>
          <p v-else-if="isComponentLoading" class="loading">Loading component…</p>
          <component :is="liveVNode" v-else-if="liveVNode" />
        </div>
      </section>

      <section class="panel source-panel">
        <h3>Source</h3>
        <div class="panel-body source-body">
          <p v-if="isHighlightLoading" class="loading">Highlighting code…</p>
          <div
            v-else
            class="shiki-wrapper"
            v-html="highlightedCode"
          />
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.example-viewer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.example-module {
  margin: 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #42b883;
  font-weight: 600;
}

.example-title {
  margin: 0.25rem 0 0;
  font-size: 1.5rem;
}

.example-path {
  font-size: 0.85rem;
  background: #f4f4f5;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
}

.example-panels {
  display: grid;
  grid-template-columns: minmax(400px, 1fr) minmax(600px, 3fr);
  gap: 1rem;
  min-height: 0;
}

.panel {
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 420px;
}

.panel h3 {
  margin: 0;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  background: #fafafa;
  border-bottom: 1px solid #e5e5e5;
}

.panel-body {
  flex: 1;
  padding: 1rem;
  overflow: auto;
}

.live-body {
  display: flex;
  align-items: flex-start;
}

.source-body {
  padding: 0;
}

.shiki-wrapper {
  font-size: 0.85rem;
  line-height: 1.5;
}

.shiki-wrapper :deep(pre) {
  margin: 0;
  padding: 1rem;
  overflow: auto;
  min-height: 100%;
}

.loading,
.source-only {
  color: #666;
  margin: 0;
}

@media (max-width: 900px) {
  .example-panels {
    grid-template-columns: 1fr;
  }
}
</style>
