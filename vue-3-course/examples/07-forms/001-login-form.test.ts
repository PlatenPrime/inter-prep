import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginForm from './001-login-form.vue'

describe('001-login-form', () => {
  it('shows validation errors for invalid input', async () => {
    const wrapper = mount(LoginForm)
    await wrapper.get('[data-testid="email"]').setValue('bad')
    await wrapper.get('[data-testid="password"]').setValue('short')
    await wrapper.get('[data-testid="form"]').trigger('submit.prevent')
    expect(wrapper.get('[data-testid="email-error"]').text()).toContain('Invalid')
    expect(wrapper.get('[data-testid="password-error"]').text()).toContain('8')
  })

  it('emits submit with valid data', async () => {
    const wrapper = mount(LoginForm)
    await wrapper.get('[data-testid="email"]').setValue('user@example.com')
    await wrapper.get('[data-testid="password"]').setValue('password123')
    await wrapper.get('[data-testid="form"]').trigger('submit.prevent')
    expect(wrapper.emitted('submit')?.[0]).toEqual([
      { email: 'user@example.com', password: 'password123' },
    ])
  })
})
