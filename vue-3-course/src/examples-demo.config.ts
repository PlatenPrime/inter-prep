import { h, type Slots } from 'vue'

export interface ExampleDemoConfig {
  props?: Record<string, unknown>
  slots?: Record<string, string>
  model?: {
    prop: string
    initial: unknown
  }
}

export const exampleDemoConfig: Record<string, ExampleDemoConfig> = {
  '03-components/001-props-emits': {
    props: {
      label: 'Click me',
    },
  },
  '03-components/002-define-model': {
    model: {
      prop: 'modelValue',
      initial: 'Hello Vue',
    },
  },
  '03-components/003-slots': {
    props: {
      title: 'Panel',
    },
    slots: {
      header: 'Header slot',
      default: 'Default slot body',
      footer: 'Footer slot',
    },
  },
}

export function buildSlotRenderers(
  slotConfig?: Record<string, string>,
): Slots | undefined {
  if (!slotConfig) return undefined

  return Object.fromEntries(
    Object.entries(slotConfig).map(([name, content]) => [name, () => [h('span', content)]]),
  ) as Slots
}
