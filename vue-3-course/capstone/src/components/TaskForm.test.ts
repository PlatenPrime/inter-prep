import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskForm from '@capstone/components/TaskForm.vue'

describe('TaskForm', () => {
  it('shows validation error for empty title', async () => {
    const wrapper = mount(TaskForm)
    await wrapper.get('[data-testid="task-form"]').trigger('submit.prevent')
    expect(wrapper.get('[data-testid="title-error"]').text()).toContain('required')
  })

  it('emits submit with valid title', async () => {
    const wrapper = mount(TaskForm)
    await wrapper.get('[data-testid="title-input"]').setValue('Ship feature')
    await wrapper.get('[data-testid="task-form"]').trigger('submit.prevent')
    expect(wrapper.emitted('submit')?.[0]).toEqual([{ title: 'Ship feature' }])
    expect((wrapper.get('[data-testid="title-input"]').element as HTMLInputElement).value).toBe('')
  })
})
