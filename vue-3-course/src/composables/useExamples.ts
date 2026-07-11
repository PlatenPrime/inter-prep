import type { Component } from 'vue'

export type ExampleLang = 'vue' | 'typescript'

export interface ExampleEntry {
  id: string
  module: string
  file: string
  title: string
  isRenderable: boolean
  source: string
  lang: ExampleLang
  loadComponent?: () => Promise<{ default: Component }>
}

export interface ExampleModule {
  id: string
  title: string
  examples: ExampleEntry[]
}

const vueModules = import.meta.glob('../../examples/**/*.vue')
const sourceModules = import.meta.glob(
  ['../../examples/**/*.{vue,ts}', '!../../examples/**/*.test.ts'],
  { query: '?raw', import: 'default', eager: true },
)

const MODULE_TITLES: Record<string, string> = {
  '01-fundamentals': 'Fundamentals',
  '02-reactivity': 'Reactivity',
  '03-components': 'Components',
  '04-composables': 'Composables',
  '05-routing': 'Routing',
  '06-pinia': 'Pinia',
  '07-forms': 'Forms',
  '08-server-state': 'Server State',
  '09-performance': 'Performance',
}

function parseExamplePath(path: string): { module: string; file: string; ext: string } | null {
  const match = path.match(/examples\/([^/]+)\/([^/]+)\.(vue|ts)$/)
  if (!match) return null

  const [, module, file, ext] = match
  if (!module || !file || !ext) return null

  return { module, file, ext }
}

function formatTitle(file: string): string {
  return file.replace(/^\d+-/, '').replace(/-/g, ' ')
}

function buildCatalog(): ExampleEntry[] {
  const entries = new Map<string, ExampleEntry>()

  for (const [path, source] of Object.entries(sourceModules)) {
    const parsed = parseExamplePath(path)
    if (!parsed) continue

    const { module, file, ext } = parsed
    const id = `${module}/${file}`
    const isVue = ext === 'vue'
    const vuePath = `../../examples/${module}/${file}.vue`
    const loader = isVue ? vueModules[vuePath] : undefined

    entries.set(id, {
      id,
      module,
      file,
      title: formatTitle(file),
      isRenderable: isVue && typeof loader === 'function',
      source: source as string,
      lang: isVue ? 'vue' : 'typescript',
      loadComponent:
        isVue && typeof loader === 'function'
          ? () => loader() as Promise<{ default: Component }>
          : undefined,
    })
  }

  return [...entries.values()].sort((a, b) => a.id.localeCompare(b.id))
}

const catalog = buildCatalog()

export function useExamples() {
  const modules: ExampleModule[] = []

  const byModule = new Map<string, ExampleEntry[]>()
  for (const example of catalog) {
    const list = byModule.get(example.module) ?? []
    list.push(example)
    byModule.set(example.module, list)
  }

  for (const [moduleId, examples] of [...byModule.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    modules.push({
      id: moduleId,
      title: MODULE_TITLES[moduleId] ?? moduleId,
      examples,
    })
  }

  function findExample(moduleId: string, fileId: string): ExampleEntry | undefined {
    return catalog.find((entry) => entry.module === moduleId && entry.file === fileId)
  }

  function getFirstExample(): ExampleEntry | undefined {
    return catalog[0]
  }

  return {
    modules,
    catalog,
    findExample,
    getFirstExample,
  }
}
