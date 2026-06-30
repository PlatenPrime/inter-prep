import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VMemoList from './001-v-memo-list.vue'

describe('001-v-memo-list', () => {
  it('toggles row selection', async () => {
    const wrapper = mount(VMemoList)
    const firstToggle = wrapper.findAll('[data-testid="row"] button')[0]!
    await firstToggle.trigger('click')
    expect(wrapper.findAll('[data-testid="selected"]')[0]!.text()).toBe('true')
  })

  it('updates render counter independently', async () => {
    const wrapper = mount(VMemoList)
    await wrapper.get('[data-testid="bump"]').trigger('click')
    expect(wrapper.get('[data-testid="render-count"]').text()).toBe('Renders: 1')
  })
})
