import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DefineModel from './002-define-model.vue'

describe('002-define-model', () => {
  it('supports v-model from parent', async () => {
    const wrapper = mount(DefineModel, {
      props: { modelValue: 'hello', 'onUpdate:modelValue': (v: string) => wrapper.setProps({ modelValue: v }) },
    })
    const input = wrapper.get('[data-testid="input"]')
    expect((input.element as HTMLInputElement).value).toBe('hello')
    await input.setValue('vue')
    expect(wrapper.props('modelValue')).toBe('vue')
  })
})
