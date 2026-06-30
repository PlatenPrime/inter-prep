import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RefCounter from './001-ref-counter.vue'

describe('001-ref-counter', () => {
  it('increments and decrements ref', async () => {
    const wrapper = mount(RefCounter)
    expect(wrapper.get('[data-testid="count"]').text()).toBe('0')
    await wrapper.get('[data-testid="inc"]').trigger('click')
    await wrapper.get('[data-testid="inc"]').trigger('click')
    expect(wrapper.get('[data-testid="count"]').text()).toBe('2')
    await wrapper.get('[data-testid="dec"]').trigger('click')
    expect(wrapper.get('[data-testid="count"]').text()).toBe('1')
  })
})
