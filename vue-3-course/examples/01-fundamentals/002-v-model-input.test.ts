import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VModelInput from './002-v-model-input.vue'

describe('002-v-model-input', () => {
  it('syncs text input with state', async () => {
    const wrapper = mount(VModelInput)
    await wrapper.get('[data-testid="search"]').setValue('vue 3')
    expect(wrapper.get('[data-testid="search-display"]').text()).toBe('vue 3')
  })

  it('coerces number with v-model.number', async () => {
    const wrapper = mount(VModelInput)
    await wrapper.get('[data-testid="qty"]').setValue('42')
    expect(wrapper.get('[data-testid="qty-display"]').text()).toBe('42')
  })
})
