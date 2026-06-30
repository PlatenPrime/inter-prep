import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TemplateBasics from './001-template-basics.vue'

describe('001-template-basics', () => {
  it('renders message and list items', () => {
    const wrapper = mount(TemplateBasics)
    expect(wrapper.get('[data-testid="message"]').text()).toBe('Hello Vue')
    expect(wrapper.findAll('[data-testid="item"]')).toHaveLength(3)
  })

  it('hides block on click', async () => {
    const wrapper = mount(TemplateBasics)
    await wrapper.get('button').trigger('click')
    expect(wrapper.find('[data-testid="visible"]').exists()).toBe(false)
  })
})
