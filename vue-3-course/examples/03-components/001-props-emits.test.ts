import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PropsEmits from './001-props-emits.vue'

describe('001-props-emits', () => {
  it('renders label and emits action', async () => {
    const wrapper = mount(PropsEmits, { props: { label: 'Save' } })
    expect(wrapper.get('[data-testid="btn"]').text()).toBe('Save')
    await wrapper.get('[data-testid="btn"]').trigger('click')
    expect(wrapper.emitted('action')?.[0]).toEqual(['Save'])
  })
})
