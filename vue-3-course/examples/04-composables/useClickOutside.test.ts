import { describe, it, expect, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useClickOutside } from './useClickOutside'

const TestComponent = defineComponent({
  setup() {
    const panel = ref<HTMLElement | null>(null)
    const closed = ref(false)
    useClickOutside(panel, () => {
      closed.value = true
    })
    return { panel, closed }
  },
  template: `
    <div>
      <div ref="panel" data-testid="panel">Panel</div>
      <div data-testid="outside">Outside</div>
      <span data-testid="closed">{{ closed }}</span>
    </div>
  `,
})

describe('useClickOutside', () => {
  it('calls handler when clicking outside panel', async () => {
    const wrapper = mount(TestComponent, { attachTo: document.body })
    wrapper.get('[data-testid="outside"]').element.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    )
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[data-testid="closed"]').text()).toBe('true')
    wrapper.unmount()
  })

  it('does not call handler when clicking inside', async () => {
    const wrapper = mount(TestComponent)
    await wrapper.get('[data-testid="panel"]').trigger('click')
    expect(wrapper.get('[data-testid="closed"]').text()).toBe('false')
  })
})
