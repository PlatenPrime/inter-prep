import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VForList from './003-v-for-list.vue'

describe('003-v-for-list', () => {
  it('renders tasks with stable keys', () => {
    const wrapper = mount(VForList)
    expect(wrapper.findAll('[data-testid="task"]')).toHaveLength(2)
  })

  it('toggles done state', async () => {
    const wrapper = mount(VForList)
    const firstBtn = wrapper.findAll('[data-testid="task"] button')[0]!
    await firstBtn.trigger('click')
    expect(wrapper.findAll('[data-testid="task"]')[0]!.attributes('data-done')).toBe('true')
  })
})
