import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SlotsPanel from './003-slots.vue'

describe('003-slots', () => {
  it('renders default and named slots', () => {
    const wrapper = mount(SlotsPanel, {
      props: { title: 'Demo' },
      slots: {
        header: '<h1>Header</h1>',
        default: '<p>Body</p>',
        footer: '<span data-testid="year">{{ year }}</span>',
      },
    })
    expect(wrapper.get('[data-testid="header"]').text()).toBe('Header')
    expect(wrapper.get('[data-testid="body"]').text()).toBe('Body')
    expect(wrapper.get('[data-testid="year"]').text()).toBe('2026')
  })
})
